// scripts/generate-paper-pdfs.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600&family=Inter:wght@400;600;700&display=swap');
  
  /* --- SOVEREIGN PAGE SETUP --- */
  @page {
    margin: 2cm 2cm;
    @bottom-center {
      content: "Global Governance Frameworks | " counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #888;
    }
  }

  * { box-sizing: border-box; }
  
  body {
    font-family: 'Crimson Pro', 'Georgia', serif;
    font-size: 11pt; 
    line-height: 1.35; /* DENSE: The "Briefing" standard */
    color: #111; /* Darker black for authority */
    max-width: none;
    margin: 0;
    padding: 0; /* Padding handled by PDF margins */
    background: white;
    text-align: justify;
  }
  
  /* --- COVER PAGE UTILITY --- */
  .cover-page {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 90vh; 
    text-align: left;
  }

  /* --- TYPOGRAPHY HIERARCHY --- */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', 'Helvetica', sans-serif;
    color: #000;
    page-break-after: avoid;
    margin-top: 1.5em;
    margin-bottom: 0.75em;
  }
  
  h1 { 
    font-weight: 700;
    font-size: 28pt; 
    line-height: 1.1;
    margin-bottom: 0.5em;
    letter-spacing: -0.02em;
    border-bottom: none; /* Clean look for cover */
  }
  
  h2 { 
    font-weight: 600;
    font-size: 14pt; 
    text-transform: uppercase; /* The "Intelligence" look */
    letter-spacing: 0.05em;
    color: #333;
    border-bottom: 2px solid #000;
    padding-bottom: 0.2em;
    margin-top: 2em;
  }
  
  h3 { 
    font-size: 11pt; 
    font-weight: 700;
    text-transform: uppercase;
    color: #000;
  }
  
  h4 { font-size: 11pt; font-weight: 600; font-style: italic; }
  
  p { 
    margin: 0.8em 0; 
    orphans: 3;
    widows: 3;
  }
  
  /* --- LINKS --- */
  a { 
    color: #2B4B8C; 
    text-decoration: none;
    border-bottom: 1px solid #b0c4de;
  }
  
  /* --- BLOCKQUOTES (Updated Style) --- */
  blockquote {
    border-left: 3px solid #000;
    margin: 1.5em 0;
    padding: 1em;
    background: #f9f9f9;
    font-style: italic;
    color: #333;
    page-break-inside: avoid;
  }
  
  /* --- CODE BLOCKS (Preserved) --- */
  code {
    background-color: #f6f8fa;
    padding: 0.15em 0.4em;
    border-radius: 3px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 10pt;
    border: 1px solid #e1e4e8;
  }
  
  pre {
    background-color: #f6f8fa;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
    border: 1px solid #e1e4e8;
    page-break-inside: avoid;
    margin: 1em 0;
  }
  
  pre code {
    background: none;
    border: none;
    padding: 0;
  }
  
  /* --- LISTS --- */
  ul, ol { 
    padding-left: 1.5em; 
    margin: 0.5em 0;
  }
  li { margin-bottom: 0.25em; }
  
  /* --- IMAGES --- */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.5em auto;
    page-break-inside: avoid;
  }
  
  .image-container, .svg-container {
    text-align: center;
    margin: 1.5em 0;
    padding: 10px;
    border: 1px solid #eee; /* Subtle frame */
  }
  
  /* --- TABLES (Preserved & Tightened) --- */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5em 0;
    font-size: 10pt; /* Slightly smaller for density */
    page-break-inside: avoid;
  }
  
  table, th, td {
    border: 1px solid #ccc; /* Greyer borders */
  }
  
  th, td {
    padding: 0.5em 0.7em;
    text-align: left;
    vertical-align: top;
  }
  
  th {
    background-color: #000; /* Authority Black headers */
    color: white;
    font-weight: 600;
    font-size: 9pt;
    text-transform: uppercase;
    font-family: 'Inter', sans-serif;
  }
  
  tr:nth-child(even) {
    background-color: #f5f5f5;
  }
  
  /* --- SPECIAL BOXES --- */
  .abstract, .executive-summary {
    background: #f8f9fa;
    border-left: 4px solid #000;
    padding: 1em 1.5em;
    margin: 1.5em 0;
    page-break-inside: avoid;
  }
  
  /* --- METADATA (For Cover Page) --- */
  .paper-metadata {
    border-top: 4px solid #000;
    border-bottom: 1px solid #ccc;
    padding: 1.5em 0;
    margin-top: 2em;
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
    color: #333;
  }
  
  .paper-metadata p { margin: 0.25em 0; }
  .paper-metadata strong { text-transform: uppercase; min-width: 120px; display: inline-block; font-weight: 700; }
  
  /* --- TABLE OF CONTENTS --- */
  .toc {
    background: #f9f9f9;
    border: 1px solid #ddd;
    padding: 1em 1.5em;
    margin: 2em 0;
    page-break-inside: avoid;
  }
  
  .toc h2 {
    margin-top: 0;
    border: none;
    font-size: 12pt;
  }
  
  .toc ul { list-style: none; padding-left: 0; }
  .toc li { margin-bottom: 0.5em; }

  /* --- PRINT OPTIMIZATIONS --- */
  @media print {
    h1 { page-break-before: always; }
    h1:first-of-type { page-break-before: avoid; } /* Don't break on cover */
    a { text-decoration: none; color: #000; }
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
function processImageReferences(markdown, paperSlug, lang) {
  console.log(`🖼️  Processing images for ${paperSlug} (${lang.toUpperCase()})`);
  
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
          path.join(__dirname, '..', 'static', imgPath),
          path.join(__dirname, '..', 'static', 'images', imgPath),
          path.join(__dirname, '..', 'static', 'images', 'whitepapers', imgPath),
          path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', lang, imgPath)
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

async function findPapers() {
  const papers = [];
  const languages = ['en', 'sv'];
  
  for (const lang of languages) {
    const papersDir = path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', lang);
    
    console.log(`\n📁 Checking directory: ${papersDir}`);
    
    if (!fs.existsSync(papersDir)) {
      console.log(`❌ Directory not found: ${papersDir}`);
      continue;
    }
    
    const files = fs.readdirSync(papersDir).filter(f => f.endsWith('.md'));
    console.log(`📄 Found ${files.length} markdown files in ${lang.toUpperCase()}`);
    
    for (const file of files) {
      const slug = file.replace('.md', '');
      const filePath = path.join(papersDir, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const metadata = extractMetadata(content);
        const markdownContent = removeFrontmatter(content);
        
        if (metadata.title) {
          papers.push({
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
  
  console.log(`\n📊 Total papers found: ${papers.length}`);
  console.log(`   English: ${papers.filter(p => p.lang === 'en').length}`);
  console.log(`   Swedish: ${papers.filter(p => p.lang === 'sv').length}`);
  
  return papers;
}

async function generatePaperPDF(browser, paper) {
  try {
    console.log(`\n📝 Generating PDF for: ${paper.metadata.title} (${paper.lang})`);
    
    // Process images first
    const processedMarkdown = processImageReferences(paper.content, paper.slug, paper.lang);
    
    // Convert markdown to HTML
    const html = marked(processedMarkdown);
    
    // Build metadata section
    const metadataHtml = `
      <div class="paper-metadata">
        ${paper.metadata.author ? `<p><strong>Author:</strong> ${paper.metadata.author}</p>` : ''}
        ${paper.metadata.date ? `<p><strong>Date:</strong> ${new Date(paper.metadata.date).toLocaleDateString()}</p>` : ''}
        ${paper.metadata.version ? `<p><strong>Version:</strong> ${paper.metadata.version}</p>` : ''}
        ${paper.metadata.status ? `<p><strong>Status:</strong> ${paper.metadata.status}</p>` : ''}
        ${paper.metadata.category ? `<p><strong>Category:</strong> ${paper.metadata.category}</p>` : ''}
        ${paper.metadata.pages ? `<p><strong>Pages:</strong> ${paper.metadata.pages}</p>` : ''}
        ${paper.metadata.readTime ? `<p><strong>Read Time:</strong> ${paper.metadata.readTime} minutes</p>` : ''}
      </div>
    `;
    
    // Create full HTML document with dedicated Cover Page structure
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="${paper.lang}">
      <head>
        <meta charset="UTF-8">
        <title>${paper.metadata.title}</title>
        <style>${css}</style>
      </head>
      <body>
        
        <div class="cover-page">
            <div style="font-family: 'Inter'; font-weight: 700; font-size: 10pt; text-transform: uppercase; margin-bottom: 20px;">
                Global Governance Frameworks
            </div>
            
            <h1>${paper.metadata.title}</h1>
            
            ${paper.metadata.subtitle ? `<div style="font-size: 16pt; font-family: 'Crimson Pro'; margin-bottom: 2em; color: #444;">${paper.metadata.subtitle}</div>` : ''}

            ${metadataHtml}
        </div>

        ${html}
      </body>
      </html>
    `;
    
    // Create output directory
    const outputDir = path.join(__dirname, '..', 'static', 'resources', 'whitepapers');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate filename from pdfPath if available, otherwise construct it
    let pdfFilename;
    if (paper.metadata.pdfPath) {
      pdfFilename = path.basename(paper.metadata.pdfPath);
    } else {
      // Use title to create filename (sanitize for filesystem)
      const sanitizedTitle = paper.metadata.title
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_');
      pdfFilename = paper.lang === 'en' 
        ? `${sanitizedTitle}.pdf` 
        : `${sanitizedTitle}_${paper.lang}.pdf`;
    }
    
    const outputFile = path.join(outputDir, pdfFilename);
    
    // Generate PDF
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 60000 });
    
    await page.pdf({
      path: outputFile,
      format: 'A4',
      margin: { 
        top: '2.5cm',
        right: '2cm', 
        bottom: '2.5cm',
        left: '2cm' 
      },
      printBackground: true,
      preferCSSPageSize: true
    });
    
    await page.close();
    
    console.log(`✅ PDF generated: ${outputFile}`);
    
    // Check file size
    const stats = fs.statSync(outputFile);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`   PDF size: ${sizeMB} MB`);
    
    // Update markdown file with PDF path if not already present
    if (!paper.metadata.pdfPath) {
      const relativePdfPath = `/resources/whitepapers/${pdfFilename}`;
      await updateMarkdownWithPdfPath(paper.filePath, relativePdfPath);
    }
    
  } catch (error) {
    console.error(`❌ Error generating PDF for ${paper.slug}:`, error);
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
    console.log(`   Updated ${filePath} with PDF path`);
  } catch (error) {
    console.error(`   Error updating markdown file:`, error);
  }
}

async function generatePaperPDFs() {
  console.log('🚀 Starting white paper PDF generation...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const papers = await findPapers();
    console.log(`\n📚 Found ${papers.length} white papers total`);
    
    if (papers.length === 0) {
      console.log('⚠️  No white papers found. Check your file structure.');
      return;
    }
    
    for (const paper of papers) {
      await generatePaperPDF(browser, paper);
    }
    
    console.log('\n🎉 White paper PDF generation completed!');
  } finally {
    await browser.close();
  }
}

// Run the generator
generatePaperPDFs().catch(console.error);
