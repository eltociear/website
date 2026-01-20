import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const LANGUAGES = ['sv', 'en']; // Swedish first, as this is primarily for Swedish municipalities
const OUTPUT_DIR = path.join(__dirname, '..', 'static', 'downloads');
const STATIC_DIR = path.join(__dirname, '..', 'static');

// The specific order of files for the Resilience Shield
const FILE_ORDER = [
  'introduction.md',
  'overview.md',
  'local-resilience-fund.md',
  'community-work-teams.md',
  'crisis-command.md',
  'implementation.md',
  'case-studies.md'
];

// --- STYLING (The Shield Theme) ---
// Replace the entire CSS string with this version:
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');
  
  :root {
    --shield-primary: #1e3a8a;
    --shield-secondary: #3b82f6;
    --shield-accent: #60a5fa;
    --text: #334155;
    --light-bg: #f8fafc;
  }

  body {
    font-family: 'Merriweather', 'Georgia', serif;
    font-size: 11pt;
    line-height: 1.7;
    color: var(--text);
    margin: 0;
    padding: 0;
  }

  /* --- Typography --- */
  h1, h2, h3, h4 {
    font-family: 'Inter', sans-serif;
    color: var(--shield-primary);
    page-break-after: avoid;
  }

  h1 { 
    font-size: 24pt; 
    font-weight: 800; 
    border-bottom: 3px solid var(--shield-secondary); 
    padding-bottom: 0.5em; 
    margin-top: 2em; 
  }
  
  h2 { 
    font-size: 18pt; 
    font-weight: 700; 
    margin-top: 2em;
    color: var(--shield-secondary);
  }
  
  h3 { 
    font-size: 14pt; 
    font-weight: 600; 
    margin-top: 1.5em; 
    color: #475569; 
  }
  
  p { margin-bottom: 1em; text-align: justify; }
  
  /* --- Important Callouts/Blockquotes --- */
  blockquote {
    background: #eff6ff;
    border-left: 4px solid var(--shield-secondary);
    margin: 1.5em 0;
    padding: 1em 1.5em;
    font-style: italic;
    color: #1e40af;
    page-break-inside: avoid;
  }

  /* --- Lists (matching your bullet styling) --- */
  ul {
    margin-bottom: 1.5rem;
    padding-left: 0;
    list-style: none;
  }

  ul li {
    position: relative;
    padding-left: 2rem;
    margin-bottom: 0.75rem;
    line-height: 1.7;
  }

  ul li::before {
    content: "▶";
    position: absolute;
    left: 0;
    color: var(--shield-primary);
    font-weight: bold;
    font-size: 1.1em;
  }

  ol {
    margin-bottom: 1.5rem;
    padding-left: 0;
    list-style: none;
    counter-reset: item;
  }

  ol li {
    position: relative;
    padding-left: 2.5rem;
    margin-bottom: 0.75rem;
    line-height: 1.7;
    counter-increment: item;
  }

  ol li::before {
    content: counter(item);
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: var(--shield-primary);
    color: white;
    border-radius: 50%;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1;
  }

  /* --- Tables --- */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }

  th {
    background: var(--shield-primary);
    color: white;
    padding: 0.75em;
    text-align: left;
    font-weight: 600;
  }

  td {
    padding: 0.75em;
    border-bottom: 1px solid #e2e8f0;
  }

  tr:nth-child(even) {
    background: var(--light-bg);
  }

  /* --- Visuals --- */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 2em auto;
    page-break-inside: avoid;
  }
  
  .image-caption {
    text-align: center;
    font-size: 9pt;
    color: #64748b;
    font-family: 'Inter', sans-serif;
    margin-top: -1.5em;
    margin-bottom: 2em;
  }

  /* --- Title Page --- */
  .title-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    page-break-after: always;
  }
  
  .logo { max-width: 150px; margin: 0 auto 2em auto; }
  
  .main-title { 
    font-family: 'Inter', sans-serif; 
    font-size: 36pt; 
    font-weight: 900; 
    color: var(--shield-primary); 
    line-height: 1.1; 
    margin-bottom: 0.5em;
  }
  
  .subtitle { 
    font-family: 'Inter', sans-serif;
    font-size: 16pt; 
    color: #64748b; 
    font-weight: 300; 
    margin-bottom: 3em; 
  }
  
  .meta { 
    font-family: 'Inter', sans-serif; 
    font-size: 11pt; 
    color: var(--shield-primary); 
  }

  /* --- Print Helpers --- */
  .page-break { page-break-before: always; }
  
  /* --- Code blocks --- */
  code {
    background: var(--light-bg);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    color: var(--shield-primary);
  }

  pre {
    background: var(--light-bg);
    padding: 1em;
    border-left: 3px solid var(--shield-secondary);
    overflow-x: auto;
    page-break-inside: avoid;
  }

  pre code {
    background: none;
    padding: 0;
  }
`;

// --- HELPERS ---

// Get Logo as Base64
function getLogoDataUrl() {
  const logoPathSvg = path.join(STATIC_DIR, 'logo.svg');
  const logoPathPng = path.join(STATIC_DIR, 'logo.png');
  
  try {
    if (fs.existsSync(logoPathSvg)) {
      const svg = fs.readFileSync(logoPathSvg, 'utf8');
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    } else if (fs.existsSync(logoPathPng)) {
      const png = fs.readFileSync(logoPathPng);
      return `data:image/png;base64,${png.toString('base64')}`;
    }
  } catch (e) {
    console.warn("Logo not found or could not be loaded.");
  }
  return null;
}

function processImages(html) {
  return html.replace(/src="\/images\/([^"]+)"/g, (match, filepath) => {
    const localPath = path.join(STATIC_DIR, 'images', filepath);
    try {
      if (fs.existsSync(localPath)) {
        const stats = fs.statSync(localPath);
        const ext = path.extname(localPath).toLowerCase();
        const mime = ext === '.svg' ? 'image/svg+xml' : 'image/png';
        const imgData = fs.readFileSync(localPath, 'base64');
        return `src="data:${mime};base64,${imgData}"`;
      }
    } catch (error) {
      console.warn(`Error processing image ${filepath}: ${error.message}`);
    }
    return match;
  });
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---[\s\S]+?---\s*/, '');
}

function getMetadata(lang) {
  if (lang === 'sv') {
    return {
      title: 'Resilience Shield',
      subtitle: 'En GGF-implementeringsguide för kommunal krishantering och klimatanpassning',
      date: 'Januari 2026',
      authors: 'Björn Kenneth Holmström + AI',
      organization: 'Global Governance Frameworks'
    };
  }
  return {
    title: 'The Resilience Shield',
    subtitle: 'A GGF Implementation Guide for Municipal Crisis Resilience and Climate Adaptation',
    date: 'January 2026',
    authors: 'Björn Kenneth Holmström + AI',
    organization: 'Global Governance Frameworks'
  };
}

async function generateResilienceShieldPdf() {
  console.log("🛡️  Starting Resilience Shield PDF Generation...");
  const logoUrl = getLogoDataUrl();

  // Ensure output directories exist
  for (const lang of LANGUAGES) {
    const langDir = path.join(OUTPUT_DIR, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
  }

  // Launch browser with more resources
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  for (const lang of LANGUAGES) {
    console.log(`\nProcessing Language: ${lang.toUpperCase()}`);
    
    const sourceDir = path.join(__dirname, '..', 'src', 'lib', 'content', 'guides', lang, 'resilience-shield');
    
    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
      console.error(`  ❌ Source directory not found: ${sourceDir}`);
      continue;
    }
    
    const metadata = getMetadata(lang);
    
    // Create a new page for each language to avoid memory issues
    const page = await browser.newPage();
    
    // Set timeout for page operations
    page.setDefaultTimeout(30000);
    
    let fullHtmlContent = '';

    // 1. Build Title Page
    const titlePage = `
      <div class="title-page">
        ${logoUrl ? `<img src="${logoUrl}" class="logo" />` : ''}
        <div class="main-title">${metadata.title}</div>
        <div class="subtitle">${metadata.subtitle}</div>
        <div class="meta">
          <p><strong>${lang === 'sv' ? 'Datum' : 'Date'}:</strong> ${metadata.date}</p>
          <p><strong>${lang === 'sv' ? 'Författare' : 'Authors'}:</strong> ${metadata.authors}</p>
          <p><strong>${lang === 'sv' ? 'Organisation' : 'Organization'}:</strong> ${metadata.organization}</p>
        </div>
      </div>
    `;
    fullHtmlContent += titlePage;

    // 2. Loop through files and append content
    for (const filename of FILE_ORDER) {
      const filePath = path.join(sourceDir, filename);
      
      console.log(`  Processing: ${filename}`);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠️  Missing file: ${filename}`);
        // Add placeholder content to continue
        fullHtmlContent += `<div class="page-break"></div><h2>${filename.replace('.md', '')}</h2><p>Content not available</p>`;
        continue;
      }

      try {
        const rawMd = fs.readFileSync(filePath, 'utf8');
        const cleanMd = stripFrontmatter(rawMd);
        
        // Parse markdown with error handling
        let html;
        try {
          html = await marked.parse(cleanMd);
        } catch (parseError) {
          console.error(`  ❌ Markdown parsing error in ${filename}:`, parseError.message);
          html = `<h2>${filename.replace('.md', '')}</h2><p>Error processing content</p>`;
        }
        
        // Add page break before each major section
        html = `<div class="page-break"></div>` + html;
        fullHtmlContent += html;
        
      } catch (error) {
        console.error(`  ❌ Error reading ${filename}:`, error.message);
        fullHtmlContent += `<div class="page-break"></div><h2>${filename.replace('.md', '')}</h2><p>Error loading content</p>`;
      }
    }

    // 3. Image Processing
    fullHtmlContent = processImages(fullHtmlContent);

    // 4. Assemble Final HTML Wrapper
    const finalHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>${css}</style>
      </head>
      <body>
        ${fullHtmlContent}
      </body>
      </html>
    `;

    // 5. Generate PDF
    const outputPath = path.join(OUTPUT_DIR, lang, 'resiliensskolden-alpha-1.0.pdf');
    
    console.log(`  Generating PDF for ${lang}...`);
    
    try {
      await page.setContent(finalHtml, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '2.5cm',
          bottom: '2.5cm',
          left: '2.5cm',
          right: '2.5cm'
        },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="font-size: 8px; color: #94a3b8; font-family: sans-serif; width: 100%; text-align: center; padding-bottom: 10px;">
            ${metadata.title} | ${metadata.organization} | ${lang === 'sv' ? 'Sida' : 'Page'} <span class="pageNumber"></span> ${lang === 'sv' ? 'av' : 'of'} <span class="totalPages"></span>
          </div>
        `
      });
      
      console.log(`  ✅ Generated: ${outputPath}`);
    } catch (error) {
      console.error(`  ❌ Error generating PDF for ${lang}:`, error.message);
    }
    
    // Close the page to free memory
    await page.close();
  }

  await browser.close();
  console.log("\n✨ Done.");
}

// Add global error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

generateResilienceShieldPdf().catch(console.error);
