import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import TurndownService from 'turndown';

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Handle YouTube embeds
turndownService.addRule('youtube', {
  filter: (node) => {
    return node.nodeName === 'IFRAME' && 
           node.getAttribute('src')?.includes('youtube.com');
  },
  replacement: (content, node: any) => {
    const src = node.getAttribute('src');
    return `\n\n[YouTube Video](${src})\n\n`;
  }
});

interface WPPost {
  title: string;
  link: string;
  pubDate: string;
  'content:encoded': string;
  'excerpt:encoded': string;
  'wp:post_id': string;
  'wp:post_name': string;
  'wp:status': string;
  'wp:post_type': string;
  category?: Array<{ _: string; $: { domain: string; nicename: string } }>;
}

interface ImageInfo {
  url: string;
  postSlug: string;
}

async function parseWordPressXML(xmlPath: string) {
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
  const result = await parseStringPromise(xmlContent);
  
  const channel = result.rss.channel[0];
  const items = channel.item || [];
  
  return items;
}

function extractCategories(post: WPPost): string[] {
  if (!post.category) return [];
  
  return post.category
    .filter(cat => cat.$.domain === 'category')
    .map(cat => cat.$.nicename);
}

function extractTags(post: WPPost): string[] {
  if (!post.category) return [];
  
  return post.category
    .filter(cat => cat.$.domain === 'post_tag')
    .map(cat => cat.$.nicename);
}

function extractImages(content: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;
  
  while ((match = imgRegex.exec(content)) !== null) {
    images.push(match[1]);
  }
  
  return images;
}

function extractFeaturedImage(content: string): string | null {
  const images = extractImages(content);
  return images.length > 0 ? images[0] : null;
}

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function createMarkdownFile(post: WPPost, outputDir: string, allImages: ImageInfo[]) {
  const title = post.title[0];
  const content = post['content:encoded']?.[0] || '';
  const excerpt = post['excerpt:encoded']?.[0] || '';
  const pubDate = new Date(post.pubDate[0]);
  const wpId = post['wp:post_id'][0];
  const slug = sanitizeSlug(post['wp:post_name'][0]);
  
  const categories = extractCategories(post);
  const tags = extractTags(post);
  const featuredImage = extractFeaturedImage(content);
  
  // Extract all images from this post
  const postImages = extractImages(content);
  postImages.forEach(img => {
    allImages.push({ url: img, postSlug: slug });
  });
  
  // Convert HTML to Markdown
  const markdownContent = turndownService.turndown(content);
  
  // Create frontmatter
  const frontmatter = {
    title: title,
    description: excerpt.replace(/<[^>]*>/g, '').trim().substring(0, 160),
    pubDate: pubDate.toISOString(),
    author: 'Your Name', // Update this
    categories: categories,
    tags: tags,
    featuredImage: featuredImage || undefined,
    wpId: parseInt(wpId),
    wpSlug: slug,
  };
  
  // Build the markdown file
  let markdownFile = '---\n';
  markdownFile += `title: "${frontmatter.title.replace(/"/g, '\\"')}"\n`;
  if (frontmatter.description) {
    markdownFile += `description: "${frontmatter.description.replace(/"/g, '\\"')}"\n`;
  }
  markdownFile += `pubDate: ${frontmatter.pubDate}\n`;
  markdownFile += `author: "${frontmatter.author}"\n`;
  markdownFile += `categories: [${categories.map(c => `"${c}"`).join(', ')}]\n`;
  markdownFile += `tags: [${tags.map(t => `"${t}"`).join(', ')}]\n`;
  if (frontmatter.featuredImage) {
    markdownFile += `featuredImage: "${frontmatter.featuredImage}"\n`;
  }
  markdownFile += `wpId: ${frontmatter.wpId}\n`;
  markdownFile += `wpSlug: "${frontmatter.wpSlug}"\n`;
  markdownFile += '---\n\n';
  markdownFile += markdownContent;
  
  // Create filename from slug only (wpId preserved in frontmatter)
  const filename = `${slug}.md`;
  
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, markdownFile, 'utf-8');
  
  console.log(`✓ Created: ${filename}`);
}

async function migrate(xmlPath: string) {
  console.log('🚀 Starting WordPress to Astro migration...\n');
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'src', 'content', 'field-notes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Parse WordPress XML
  console.log('📖 Reading WordPress export...');
  const items = await parseWordPressXML(xmlPath);
  
  // Filter for published posts only
  const posts = items.filter((item: any) => 
    item['wp:post_type']?.[0] === 'post' && 
    item['wp:status']?.[0] === 'publish'
  );
  
  console.log(`Found ${posts.length} published posts\n`);
  
  // Track all images
  const allImages: ImageInfo[] = [];
  
  // Convert each post
  posts.forEach((post: WPPost) => {
    createMarkdownFile(post, outputDir, allImages);
  });
  
  // Save image list for later downloading
  const imageListPath = path.join(process.cwd(), 'image-downloads.json');
  fs.writeFileSync(
    imageListPath, 
    JSON.stringify(allImages, null, 2), 
    'utf-8'
  );
  
  console.log(`\n✅ Migration complete!`);
  console.log(`📝 Created ${posts.length} markdown files`);
  console.log(`🖼️  Found ${allImages.length} images (saved to image-downloads.json)`);
  console.log(`\nNext steps:`);
  console.log(`1. Review the files in src/content/field-notes/`);
  console.log(`2. Run the image download script (coming next!)`);
  console.log(`3. Update author names in the frontmatter`);
}

// Run the migration
const xmlPath = process.argv[2] || './wordpress-export.xml';

if (!fs.existsSync(xmlPath)) {
  console.error(`❌ Error: Could not find XML file at ${xmlPath}`);
  console.log('Usage: npm run migrate path/to/wordpress-export.xml');
  process.exit(1);
}

migrate(xmlPath).catch(console.error);