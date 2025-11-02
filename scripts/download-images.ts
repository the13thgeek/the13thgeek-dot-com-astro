import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

interface ImageInfo {
  url: string;
  postSlug: string;
}

interface DownloadResult {
  originalUrl: string;
  localPath: string;
  success: boolean;
  error?: string;
}

function sanitizeFilename(url: string): string {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const filename = path.basename(pathname);
  
  // Remove query strings and sanitize
  return filename
    .split('?')[0]
    .replace(/[^a-zA-Z0-9.-]/g, '_');
}

function downloadImage(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(outputPath);
    
    protocol.get(url, (response) => {
      // Handle redirects
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

async function downloadImages() {
  console.log('🖼️  Starting image download...\n');
  
  // Read image list
  const imageListPath = path.join(process.cwd(), 'image-downloads.json');
  if (!fs.existsSync(imageListPath)) {
    console.error('❌ Error: image-downloads.json not found');
    console.log('Run the migration script first!');
    process.exit(1);
  }
  
  const images: ImageInfo[] = JSON.parse(fs.readFileSync(imageListPath, 'utf-8'));
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'public', 'images', 'field-notes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`Found ${images.length} images to download`);
  console.log(`Downloading to: ${outputDir}\n`);
  
  const results: DownloadResult[] = [];
  const urlToLocalPath = new Map<string, string>();
  
  // Download images with progress
  let completed = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const imageInfo of images) {
    const { url } = imageInfo;
    
    // Skip if already processed
    if (urlToLocalPath.has(url)) {
      skipped++;
      continue;
    }
    
    try {
      const filename = sanitizeFilename(url);
      const outputPath = path.join(outputDir, filename);
      const localPath = `/assets/field-notes/${filename}`;
      
      // Skip if file already exists
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  Skipped (exists): ${filename}`);
        urlToLocalPath.set(url, localPath);
        results.push({ originalUrl: url, localPath, success: true });
        skipped++;
        continue;
      }
      
      // Download the image
      await downloadImage(url, outputPath);
      console.log(`✓ Downloaded: ${filename}`);
      
      urlToLocalPath.set(url, localPath);
      results.push({ originalUrl: url, localPath, success: true });
      completed++;
      
      // Rate limit to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`✗ Failed: ${url} (${errorMsg})`);
      results.push({ 
        originalUrl: url, 
        localPath: '', 
        success: false, 
        error: errorMsg 
      });
      failed++;
    }
  }
  
  // Save mapping for next step
  const mappingPath = path.join(process.cwd(), 'image-mapping.json');
  const mapping = Object.fromEntries(urlToLocalPath);
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf-8');
  
  console.log(`\n✅ Download complete!`);
  console.log(`   Downloaded: ${completed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\nSaved mapping to: image-mapping.json`);
  
  if (failed > 0) {
    console.log(`\n⚠️  Some images failed to download. Check the URLs manually.`);
  }
  
  return mapping;
}

async function updateMarkdownFiles(mapping: Record<string, string>) {
  console.log('\n📝 Updating markdown files with local image paths...\n');
  
  const contentDir = path.join(process.cwd(), 'src', 'content', 'field-notes');
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  let filesUpdated = 0;
  let imagesReplaced = 0;
  
  for (const file of files) {
    const filepath = path.join(contentDir, file);
    let content = fs.readFileSync(filepath, 'utf-8');
    let updated = false;
    
    // Replace image URLs with local paths
    for (const [originalUrl, localPath] of Object.entries(mapping)) {
      const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedUrl, 'g');
      
      if (content.includes(originalUrl)) {
        content = content.replace(regex, localPath);
        updated = true;
        imagesReplaced++;
      }
    }
    
    if (updated) {
      fs.writeFileSync(filepath, content, 'utf-8');
      console.log(`✓ Updated: ${file}`);
      filesUpdated++;
    }
  }
  
  console.log(`\n✅ Markdown update complete!`);
  console.log(`   Files updated: ${filesUpdated}`);
  console.log(`   Image references replaced: ${imagesReplaced}`);
}

async function main() {
  try {
    const mapping = await downloadImages();
    await updateMarkdownFiles(mapping);
    
    console.log('\n🎉 All done! Your images are now local.');
    console.log('\nNext steps:');
    console.log('1. Review your field notes in src/content/field-notes/');
    console.log('2. Check images in public/assets/field-notes/');
    console.log('3. Start building your field notes listing page!');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();