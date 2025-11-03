import fs from 'fs';
import path from 'path';
import https from 'https';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

// Sanity configuration
const SANITY_PROJECT_ID = '94cv7x6u';
const SANITY_DATASET = 'production'; // Change if different
const SANITY_API_VERSION = '2024-09-18';

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
});

const builder = imageUrlBuilder(client);

interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  category?: Array<{
    _ref: string;
    name?: string;
  }>;
  tags?: string[];
  featuredImage?: any;
  content: any[];
  isActive: boolean;
}

interface SanityCategory {
  _id: string;
  name: string;
  slug: { current: string };
}

function urlFor(source: any) {
  return builder.image(source);
}

function downloadImage(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          fs.unlinkSync(outputPath);
          downloadImage(redirectUrl, outputPath).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        file.close();
        fs.unlinkSync(outputPath);
        reject(err);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });
  });
}

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function convertPortableTextToMarkdown(content: any[]): string {
  if (!content || content.length === 0) return '';
  
  let markdown = '';
  
  for (const block of content) {
    // Handle different block types
    switch (block._type) {
      case 'block':
        markdown += convertBlockToMarkdown(block);
        break;
      
      case 'image':
        if (block.asset) {
          const imageUrl = urlFor(block).url();
          const alt = block.alt || '';
          markdown += `\n![${alt}](${imageUrl})\n\n`;
        }
        break;
      
      case 'code':
        const language = block.language || '';
        const code = block.code || '';
        markdown += `\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
        break;
      
      case 'divider':
        markdown += '\n---\n\n';
        break;
      
      default:
        console.warn(`Unknown block type: ${block._type}`);
    }
  }
  
  return markdown.trim();
}

function convertBlockToMarkdown(block: any): string {
  if (!block.children || block.children.length === 0) return '\n';
  
  let text = '';
  
  // Process children (text spans)
  for (const child of block.children) {
    let span = child.text || '';
    
    // Apply marks (bold, italic, code, etc.)
    if (child.marks && child.marks.length > 0) {
      for (const mark of child.marks) {
        if (mark === 'strong') {
          span = `**${span}**`;
        } else if (mark === 'em') {
          span = `*${span}*`;
        } else if (mark === 'code') {
          span = `\`${span}\``;
        } else if (mark === 'underline') {
          span = `<u>${span}</u>`;
        } else if (mark === 'strike-through') {
          span = `~~${span}~~`;
        }
      }
    }
    
    text += span;
  }
  
  // Handle links (annotations)
  if (block.markDefs && block.markDefs.length > 0) {
    for (const mark of block.markDefs) {
      if (mark._type === 'link') {
        const linkRegex = new RegExp(mark._key, 'g');
        text = text.replace(linkRegex, `[${text}](${mark.href})`);
      }
    }
  }
  
  // Apply block-level formatting
  switch (block.style) {
    case 'h1':
      return `\n# ${text}\n\n`;
    case 'h2':
      return `\n## ${text}\n\n`;
    case 'h3':
      return `\n### ${text}\n\n`;
    case 'h4':
      return `\n#### ${text}\n\n`;
    case 'h5':
      return `\n##### ${text}\n\n`;
    case 'h6':
      return `\n###### ${text}\n\n`;
    case 'blockquote':
      return `\n> ${text}\n\n`;
    case 'normal':
    default:
      // Handle list items
      if (block.listItem === 'bullet') {
        return `- ${text}\n`;
      } else if (block.listItem === 'number') {
        return `1. ${text}\n`;
      }
      return `${text}\n\n`;
  }
}

async function fetchCategories(): Promise<Map<string, string>> {
  const query = `*[_type == "gkBlogCategory"] {
    _id,
    name,
    slug
  }`;
  
  const categories: SanityCategory[] = await client.fetch(query);
  const categoryMap = new Map<string, string>();
  
  categories.forEach(cat => {
    categoryMap.set(cat._id, cat.name);
  });
  
  return categoryMap;
}

async function fetchPosts(): Promise<SanityBlogPost[]> {
  const query = `*[_type == "gkBlogType" && isActive == true] | order(date desc) {
    _id,
    title,
    slug,
    date,
    "category": category[]-> {
      _id,
      name
    },
    tags,
    featuredImage,
    content,
    isActive
  }`;
  
  return await client.fetch(query);
}

async function createMarkdownFile(
  post: SanityBlogPost, 
  outputDir: string,
  imagesDir: string,
  allImages: Array<{url: string, postSlug: string}>
) {
  const title = post.title;
  const slug = sanitizeSlug(post.slug.current);
  const pubDate = new Date(post.date);
  
  // Get category names
  const categories = post.category?.map(cat => cat.name).filter(Boolean) || [];
  const tags = post.tags || [];
  
  // Handle featured image
  let featuredImagePath = '';
  if (post.featuredImage?.asset) {
    try {
      const imageUrl = urlFor(post.featuredImage).width(1200).url();
      const imageFilename = `${slug}-featured.jpg`;
      const imagePath = path.join(imagesDir, imageFilename);
      
      if (!fs.existsSync(imagePath)) {
        await downloadImage(imageUrl, imagePath);
        console.log(`  ✓ Downloaded featured image`);
      }
      
      featuredImagePath = `/assets/field-notes/${imageFilename}`;
      allImages.push({ url: imageUrl, postSlug: slug });
    } catch (error) {
      console.error(`  ✗ Failed to download featured image:`, error);
    }
  }
  
  // Convert Portable Text to Markdown
  const markdownContent = convertPortableTextToMarkdown(post.content || []);
  
  // Extract first 160 chars for excerpt
  const plainText = markdownContent
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/!\[.*?\]\(.+?\)/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
  
  const excerpt = plainText.length > 160 
    ? plainText.substring(0, 160).substring(0, plainText.substring(0, 160).lastIndexOf(' ')) + '…'
    : plainText;
  
  // Build frontmatter
  let frontmatter = '---\n';
  frontmatter += `title: "${title.replace(/"/g, '\\"')}"\n`;
  if (excerpt) {
    frontmatter += `excerpt: "${excerpt.replace(/"/g, '\\"')}"\n`;
  }
  frontmatter += `pubDate: ${pubDate.toISOString()}\n`;
  frontmatter += `author: "the13thgeek"\n`;
  frontmatter += `categories: [${categories.map(c => `"${c}"`).join(', ')}]\n`;
  frontmatter += `tags: [${tags.map(t => `"${t}"`).join(', ')}]\n`;
  if (featuredImagePath) {
    frontmatter += `featuredImage: "${featuredImagePath}"\n`;
  }
  frontmatter += `sanityId: "${post._id}"\n`;
  frontmatter += '---\n\n';
  
  // Combine frontmatter and content
  const fullContent = frontmatter + markdownContent;
  
  // Save markdown file
  const filename = `${slug}.md`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, fullContent, 'utf-8');
  console.log(`✓ Created: ${filename}`);
}

async function migrate() {
  console.log('🚀 Starting Sanity to Astro migration...\n');
  
  // Create output directories
  const outputDir = path.join(process.cwd(), 'src', 'content', 'field-notes');
  const imagesDir = path.join(process.cwd(), 'public', 'assets', 'field-notes');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  try {
    // Fetch categories first
    console.log('📚 Fetching categories...');
    await fetchCategories();
    
    // Fetch all published posts
    console.log('📖 Fetching published posts from Sanity...');
    const posts = await fetchPosts();
    
    console.log(`Found ${posts.length} published posts\n`);
    
    if (posts.length === 0) {
      console.log('⚠️  No posts found. Check your dataset name and ensure posts are marked as published (isActive: true)');
      return;
    }
    
    // Track images
    const allImages: Array<{url: string, postSlug: string}> = [];
    
    // Process each post
    for (const post of posts) {
      console.log(`\nProcessing: ${post.title}`);
      await createMarkdownFile(post, outputDir, imagesDir, allImages);
    }
    
    console.log(`\n✅ Migration complete!`);
    console.log(`📝 Created ${posts.length} markdown files`);
    console.log(`🖼️  Downloaded ${allImages.length} images`);
    console.log(`\nNext steps:`);
    console.log(`1. Review the files in src/content/field-notes/`);
    console.log(`2. Check images in public/assets/field-notes/`);
    console.log(`3. Run 'npm run generate-excerpts' if you want to regenerate excerpts`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();