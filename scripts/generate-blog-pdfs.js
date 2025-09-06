// scripts/generate-blog-pdfs.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
  
  body {
    font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
    font-size: 11pt;
    line-height: 1.4;
    color: #333;
    max-width: none;
    margin: 0;
    padding: 0.8cm;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    color: #2B4B8C;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  
  h1 { font-size: 16pt; margin-bottom: 0.8em; }
  h2 { font-size: 14pt; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
  h3 { font-size: 12pt; }
  
  p { margin: 0.3em 0; text-align: justify; }
  a { color: #2B4B8C; text-decoration: none; }
  
  blockquote {
    border-left: 3px solid #6B5CA5;
    padding-left: 10px;
    margin: 0.5em 0 0.5em 5px;
    color: #555;
    font-style: italic;
  }
  
  code {
    background-color: #f6f8fa;
    padding: 0.1em 0.3em;
    border-radius: 2px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 10pt;
  }
  
  ul, ol { padding-left: 1.2em; margin: 0.3em 0; }
  li { margin-bottom: 0.2em; }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em auto;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .image-container {
    text-align: center;
    margin: 1em 0;
    page-break-inside: avoid;
  }
  
  .svg-container {
    text-align: center;
    margin: 1em 0;
    page-break-inside: avoid;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  
  table, th, td {
    border: 1px solid #ddd;
  }
  
  th, td {
    padding: 8px 12px;
    text-align: left;
    vertical-align: top;
  }
  
  th {
    background-color: #2B4B8C;
    color: white;
    font-weight: 600;
    font-size: 9pt;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
  
  /* Responsive table handling for PDF */
  @media print {
    table {
      font-size: 9pt;
    }
    
    th, td {
      padding: 6px 8px;
    }
  }
`;

// Helper function to get MIME type from file extension
function getMimeType(ext) {
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon'
  };
  
  return mimeTypes[ext.toLowerCase()] || 'image/png';
}

// Process image references in markdown
function processImageReferences(markdown, postSlug, lang) {
  console.log(`🖼️  Processing images for ${postSlug} (${lang.toUpperCase()})`);
  
  const imgRegex = /!\[(.*?)\]\(([^)]+)\)/g;
  let match;
  let processedMarkdown = markdown;
  let processedCount = 0;
  
  // Count total images first
  const imageMatches = markdown.match(imgRegex);
  const imageCount = imageMatches ? imageMatches.length : 0;
  
  if (imageCount === 0) {
    console.log(`   No images found`);
    return markdown;
  }
  
  console.log(`   Found ${imageCount} image references`);
  
  // Reset regex for processing
  imgRegex.lastIndex = 0;
  
  while ((match = imgRegex.exec(markdown)) !== null) {
    const altText = match[1];
    let imgPath = match[2];
    
    console.log(`   Processing: ${imgPath}`);
    
    // Skip if it's already a data URI or external URL
    if (imgPath.startsWith('data:') || imgPath.startsWith('http')) {
      console.log(`     Skipping external/data URI`);
      continue;
    }
    
    // Handle different image types
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const isImage = imageExtensions.some(ext => imgPath.toLowerCase().endsWith(ext));
    
    if (isImage) {
      let resolvedPath;
      
      if (imgPath.startsWith('/')) {
        // Absolute path from project root - map to static directory
        resolvedPath = path.join(__dirname, '..', 'static', imgPath);
      } else {
        // Try multiple possible locations for relative paths
        const possiblePaths = [
          path.join(__dirname, '..', 'static', imgPath), // Direct in static
          path.join(__dirname, '..', 'static', 'images', imgPath), // In images folder
          path.join(__dirname, '..', 'static', 'images', 'blog', imgPath), // In blog images
          path.join(__dirname, '..', 'src', 'lib', 'posts', lang, imgPath) // Relative to post
        ];
        
        resolvedPath = possiblePaths.find(p => fs.existsSync(p));
      }
      
      if (resolvedPath && fs.existsSync(resolvedPath)) {
        try {
          const ext = path.extname(resolvedPath).toLowerCase();
          
          if (ext === '.svg') {
            // Handle SVG files
            const svgContent = fs.readFileSync(resolvedPath, 'utf8');
            let processedSvg = svgContent;
            
            // Ensure SVG has namespace
            if (!svgContent.includes('xmlns="http://www.w3.org/2000/svg"')) {
              processedSvg = svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            
            const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(processedSvg)}`;
            
            processedMarkdown = processedMarkdown.replace(
              match[0],
              `<div class="svg-container"><img src="${svgDataUri}" alt="${altText}" /></div>`
            );
            
            processedCount++;
            console.log(`     ✅ Embedded SVG: ${path.basename(resolvedPath)}`);
            
          } else {
            // Handle raster images
            const imageBuffer = fs.readFileSync(resolvedPath);
            const mimeType = getMimeType(ext);
            const base64Data = imageBuffer.toString('base64');
            const dataUri = `data:${mimeType};base64,${base64Data}`;
            
            processedMarkdown = processedMarkdown.replace(
              match[0],
              `<div class="image-container"><img src="${dataUri}" alt="${altText}" /></div>`
            );
            
            processedCount++;
            console.log(`     ✅ Embedded ${ext.toUpperCase()}: ${path.basename(resolvedPath)}`);
          }
          
        } catch (error) {
          console.warn(`     ❌ Error processing: ${error.message}`);
        }
      } else {
        console.warn(`     ⚠️  Image not found: ${imgPath}`);
      }
    }
  }
  
  console.log(`   📊 Images embedded: ${processedCount}/${imageCount}`);
  return processedMarkdown;
}

// Extract frontmatter metadata from markdown content
function extractMetadata(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};
  
  const frontmatter = frontmatterMatch[1];
  const metadata = {};
  
  // Simple YAML parser for basic frontmatter
  const lines = frontmatter.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      let value = match[2].trim();
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays (tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
      }
      
      metadata[match[1]] = value;
    }
  }
  
  return metadata;
}

// Remove frontmatter from content
function removeFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n/, '');
}

async function findBlogPosts() {
  const posts = [];
  const languages = ['en', 'sv']; // Make sure both languages are included
  
  for (const lang of languages) {
    const postsDir = path.join(__dirname, '..', 'src', 'lib', 'posts', lang);
    
    console.log(`\n📁 Checking directory: ${postsDir}`);
    
    if (!fs.existsSync(postsDir)) {
      console.log(`❌ Directory not found: ${postsDir}`);
      continue;
    }
    
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    console.log(`📄 Found ${files.length} markdown files in ${lang.toUpperCase()}`);
    
    for (const file of files) {
      const slug = file.replace('.md', '');
      const filePath = path.join(postsDir, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const metadata = extractMetadata(content);
        const markdownContent = removeFrontmatter(content);
        
        if (metadata.title) {
          posts.push({
            slug,
            lang,
            filePath,
            metadata,
            content: markdownContent.trim()
          });
          
          console.log(`  ✅ Added: ${metadata.title} (${lang})`);
        } else {
          console.log(`  ⚠️  Skipping ${file} - no title found`);
        }
      } catch (error) {
        console.log(`  ❌ Error reading ${file}: ${error.message}`);
      }
    }
  }
  
  console.log(`\n📊 Total posts found: ${posts.length}`);
  console.log(`   English: ${posts.filter(p => p.lang === 'en').length}`);
  console.log(`   Swedish: ${posts.filter(p => p.lang === 'sv').length}`);
  
  return posts;
}

async function generateBlogPDF(browser, post) {
  try {
    console.log(`\nGenerating PDF for: ${post.metadata.title} (${post.lang})`);
    
    // Process images first
    const processedMarkdown = processImageReferences(post.content, post.slug, post.lang);
    
    // Convert markdown to HTML
    const html = marked(processedMarkdown);
    
    // Create full HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="${post.lang}">
      <head>
        <meta charset="UTF-8">
        <title>${post.metadata.title}</title>
        <style>${css}</style>
      </head>
      <body>
        <h1>${post.metadata.title}</h1>
        <p style="color: #666; margin-bottom: 2em;">
          ${post.metadata.author ? `By ${post.metadata.author}` : ''} 
          ${post.metadata.date ? ` • ${new Date(post.metadata.date).toLocaleDateString()}` : ''}
        </p>
        ${html}
      </body>
      </html>
    `;
    
    // Create output directory
    const outputDir = path.join(__dirname, '..', 'static', 'blog', 'pdfs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate language-specific filename
    const pdfFilename = post.lang === 'en' ? `${post.slug}.pdf` : `${post.slug}-${post.lang}.pdf`;
    const outputFile = path.join(outputDir, pdfFilename);
    
    // Generate PDF
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 30000 });
    
    await page.pdf({
      path: outputFile,
      format: 'A4',
      margin: { 
        top: '2cm',
        right: '1.5cm', 
        bottom: '2cm',
        left: '1.5cm' 
      },
      printBackground: true
    });
    
    await page.close();
    
    console.log(`✅ PDF generated: ${outputFile}`);
    
    // Check file size
    const stats = fs.statSync(outputFile);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`PDF size: ${sizeMB} MB`);
    
    // Update markdown file with language-specific PDF path
    const relativePdfPath = `/blog/pdfs/${pdfFilename}`;
    if (!post.metadata.pdfPath) {
      await updateMarkdownWithPdfPath(post.filePath, relativePdfPath);
    }
    
  } catch (error) {
    console.error(`❌ Error generating PDF for ${post.slug}:`, error);
  }
}

async function updateMarkdownWithPdfPath(filePath, pdfPath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if pdfPath already exists
    if (content.includes('pdfPath:')) {
      return;
    }
    
    // Add pdfPath to frontmatter
    const updatedContent = content.replace(
      /^(---\n[\s\S]*?)(\n---)/,
      `$1pdfPath: "${pdfPath}"$2`
    );
    
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated ${filePath} with PDF path`);
  } catch (error) {
    console.error(`Error updating markdown file:`, error);
  }
}

async function generateBlogPDFs() {
  console.log('Starting blog PDF generation with image processing...');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const blogPosts = await findBlogPosts();
    console.log(`Found ${blogPosts.length} blog posts total`);
    
    if (blogPosts.length === 0) {
      console.log('No blog posts found. Check your file structure.');
      return;
    }
    
    for (const post of blogPosts) {
      await generateBlogPDF(browser, post);
    }
    
    console.log('\n🎉 Blog PDF generation completed!');
  } finally {
    await browser.close();
  }
}

// Run the generator
generateBlogPDFs().catch(console.error);
