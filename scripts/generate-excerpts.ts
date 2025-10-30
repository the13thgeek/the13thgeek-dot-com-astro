import fs from 'fs';
import path from 'path';

function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove frontmatter
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n\n/, '');
  
  // Remove markdown formatting
  let plainText = contentWithoutFrontmatter
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.+?\)/g, '') // Remove images
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/\n{2,}/g, ' ') // Replace multiple newlines with space
    .replace(/\n/g, ' ') // Replace single newlines with space
    .trim();
  
  // Truncate to maxLength, breaking at word boundary
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '…'
    : truncated + '…';
}

function updateMarkdownWithExcerpt(filepath: string) {
  const content = fs.readFileSync(filepath, 'utf-8');
  
  // Check if excerpt already exists in frontmatter
  if (/^excerpt:\s*.+$/m.test(content)) {
    return { updated: false, reason: 'excerpt exists' };
  }
  
  // Extract frontmatter and body
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    return { updated: false, reason: 'no frontmatter' };
  }
  
  const [, frontmatter, body] = frontmatterMatch;
  
  // Generate excerpt from body
  const excerpt = extractExcerpt(body, 160);
  
  if (!excerpt || excerpt.length < 10) {
    return { updated: false, reason: 'excerpt too short' };
  }
  
  // Insert excerpt into frontmatter (after description if it exists, otherwise before pubDate)
  const lines = frontmatter.split('\n');
  let insertIndex = lines.findIndex(line => line.startsWith('pubDate:'));
  
  if (insertIndex === -1) {
    insertIndex = lines.length;
  }
  
  lines.splice(insertIndex, 0, `excerpt: "${excerpt.replace(/"/g, '\\"')}"`);
  
  // Reconstruct file
  const newContent = `---\n${lines.join('\n')}\n---\n\n${body}`;
  
  fs.writeFileSync(filepath, newContent, 'utf-8');
  
  return { updated: true, excerpt };
}

async function generateExcerpts() {
  console.log('📝 Generating excerpts for field notes...\n');
  
  const contentDir = path.join(process.cwd(), 'src', 'content', 'field-notes');
  
  if (!fs.existsSync(contentDir)) {
    console.error('❌ Error: field-notes directory not found');
    process.exit(1);
  }
  
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const file of files) {
    const filepath = path.join(contentDir, file);
    const result = updateMarkdownWithExcerpt(filepath);
    
    if (result.updated) {
      console.log(`✓ ${file}`);
      console.log(`  "${result.excerpt}"\n`);
      updated++;
    } else {
      console.log(`⏭️  ${file} (${result.reason})`);
      skipped++;
    }
  }
  
  console.log(`\n✅ Complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
}

generateExcerpts().catch(console.error);