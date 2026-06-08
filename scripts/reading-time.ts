import fs from 'fs';
import path from 'path';

function calculateReadingTime(markdown: string, wordsPerMinute: number = 200): number {
  // Remove frontmatter
  const contentWithoutFrontmatter = markdown.replace(/^---[\s\S]*?---\n\n/, '');
  
  // Remove markdown formatting and code blocks
  const text = contentWithoutFrontmatter
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.+?\)/g, '') // Remove images
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/[#*`\[\]()_~]/g, ''); // Remove remaining markdown formatting
  
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return Math.max(1, minutes); // Minimum 1 minute
}

function updateMarkdownWithReadingTime(filepath: string) {
  const content = fs.readFileSync(filepath, 'utf-8');
  
  // Check if readingTime already exists
  if (/^readingTime:\s*\d+/m.test(content)) {
    return { updated: false, reason: 'readingTime exists', readingTime: 0 };
  }
  
  // Extract frontmatter and body - more flexible regex
  const frontmatterMatch = content.match(/^-{3,}\s*[\r\n]+([\s\S]*?)[\r\n]+-{3,}\s*[\r\n]+([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    return { updated: false, reason: 'no frontmatter', readingTime: 0 };
  }
  
  const [, frontmatter, body] = frontmatterMatch;
  
  // Calculate reading time from body
  const readingTime = calculateReadingTime(body);
  
  // Insert readingTime into frontmatter (after excerpt if it exists, otherwise before pubDate)
  const lines = frontmatter.split('\n');
  let insertIndex = lines.findIndex(line => line.startsWith('pubDate:'));
  
  if (insertIndex === -1) {
    insertIndex = lines.length;
  }
  
  lines.splice(insertIndex, 0, `readingTime: ${readingTime}`);
  
  // Reconstruct file
  const newContent = `---\n${lines.join('\n')}\n---\n\n${body}`;
  
  fs.writeFileSync(filepath, newContent, 'utf-8');
  
  return { updated: true, readingTime };
}

async function calculateReadingTimeForAll() {
  console.log('⏱️  Calculating reading time for field notes...\n');
  
  const contentDir = path.join(process.cwd(), 'src', 'content', 'field-notes');
  
  if (!fs.existsSync(contentDir)) {
    console.error('❌ Error: field-notes directory not found');
    process.exit(1);
  }
  
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  let updated = 0;
  let skipped = 0;
  
  for (const file of files) {
    const filepath = path.join(contentDir, file);
    const result = updateMarkdownWithReadingTime(filepath);
    
    if (result.updated) {
      console.log(`✓ ${file}`);
      console.log(`  ${result.readingTime} min read\n`);
      updated++;
    } else {
      console.log(`⏭️  ${file} (${result.reason})`);
      skipped++;
    }
  }
  
  console.log(`\n✅ Complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
}

calculateReadingTimeForAll().catch(console.error);