import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const LANGUAGES = ['en']; // Add 'sv' when ready
const OUTPUT_DIR = path.join(__dirname, '..', 'static', 'resources', 'whitepapers', 'omega-proof', 'downloads');
const STATIC_DIR = path.join(__dirname, '..', 'static');

// The specific order of files for the Omega Proof
const FILE_ORDER = [
  '00-executive-summary.md',
  '01-introduction.md',
  '02-apparatus.md',
  '03-the-data.md',
  '04-diagnosis.md',
  '05-prescriptions.md',
  '06-trajectory.md',
  '07-conclusion.md'
];

// --- STYLING (The Omega Theme) ---
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');
  
  :root {
    --navy: #1e1b4b;
    --gold: #d97706;
    --text: #334155;
  }

  body {
    font-family: 'Merriweather', 'Georgia', serif;
    font-size: 11pt;
    line-height: 1.7;
    color: var(--text);
    margin: 0;
    padding: 0; /* Margins handled by PDF printer */
  }

  /* --- Typography --- */
  h1, h2, h3, h4 {
    font-family: 'Inter', sans-serif;
    color: var(--navy);
    page-break-after: avoid;
  }

  h1 { font-size: 24pt; font-weight: 800; border-bottom: 2px solid var(--gold); padding-bottom: 0.5em; margin-top: 2em; }
  h2 { font-size: 18pt; font-weight: 700; margin-top: 2em; }
  h3 { font-size: 14pt; font-weight: 600; margin-top: 1.5em; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
  
  p { margin-bottom: 1em; text-align: justify; }
  
  /* --- The "Kill Memo" Blockquotes --- */
  blockquote {
    background: #fffbeb;
    border-left: 4px solid var(--gold);
    margin: 1.5em 0;
    padding: 1em 1.5em;
    font-style: italic;
    color: #4b5563;
    page-break-inside: avoid;
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
    color: var(--navy); 
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
  
  .meta { font-family: 'Inter', sans-serif; font-size: 11pt; color: var(--navy); }

  /* --- TOC --- */
  .toc { page-break-after: always; }
  .toc-item { display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; margin-bottom: 0.5em; }

  /* --- Print Helpers --- */
  .page-break { page-break-before: always; }
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

// Process Images (Convert /images/ paths to file:// paths or base64)
function processImages(html) {
  // Regex to find <img src="/images/...">
  return html.replace(/src="\/images\/([^"]+)"/g, (match, filepath) => {
    const localPath = path.join(STATIC_DIR, 'images', filepath);
    if (fs.existsSync(localPath)) {
      // For PDF generation, file:// protocol works best with puppeteer if configured
      // Or we can base64 encode it to be safe
      const ext = path.extname(localPath).toLowerCase();
      const mime = ext === '.svg' ? 'image/svg+xml' : 'image/png'; // simplified
      const imgData = fs.readFileSync(localPath, 'base64');
      return `src="data:${mime};base64,${imgData}"`;
    }
    console.warn(`Warning: Image not found locally: ${filepath}`);
    return match;
  });
}

// Remove Frontmatter (--- ... ---)
function stripFrontmatter(markdown) {
  return markdown.replace(/^---[\s\S]+?---\s*/, '');
}

async function generateOmegaPdf() {
  console.log("🚀 Starting Omega Proof PDF Generation...");
  const logoUrl = getLogoDataUrl();

  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  for (const lang of LANGUAGES) {
    console.log(`\nProcessing Language: ${lang.toUpperCase()}`);
    
    const sourceDir = path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', lang, 'omega-proof');
    let fullHtmlContent = '';

    // 1. Build Title Page
    const titlePage = `
      <div class="title-page">
        ${logoUrl ? `<img src="${logoUrl}" class="logo" />` : ''}
        <div class="main-title">The Omega Proof</div>
        <div class="subtitle">An Empirical Demonstration of the Nation-State System's Terminal Incompatibility with Planetary Peace</div>
        <div class="meta">
          <p><strong>Date:</strong> January 4, 2026</p>
          <p><strong>Authors:</strong> Björn Kenneth Holmström + AI (Gemini, DeepSeek, Grok, Claude)</p>
          <p><strong>Organization:</strong> Global Governance Frameworks</p>
        </div>
      </div>
    `;
    fullHtmlContent += titlePage;

    // 2. Loop through files and append content
    for (const filename of FILE_ORDER) {
      const filePath = path.join(sourceDir, filename);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠️ Missing file: ${filename}`);
        continue;
      }

      console.log(`  Processing: ${filename}`);
      const rawMd = fs.readFileSync(filePath, 'utf8');
      const cleanMd = stripFrontmatter(rawMd);
      
      // Add a page break before every new file (except the first one if preferred)
      // Note: We skip page break for the first content section so it follows title page logically or TOC
      let html = marked.parse(cleanMd);
      
      // Inject Page Break class for the file start
      html = `<div class="page-break"></div>` + html;

      fullHtmlContent += html;
    }

    // 3. Image Processing
    fullHtmlContent = processImages(fullHtmlContent);

    // 4. Assemble Final HTML Wrapper
    const finalHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${fullHtmlContent}
      </body>
      </html>
    `;

    // 5. Generate PDF
    const outputPath = path.join(OUTPUT_DIR, `omega-proof${lang === 'sv' ? '-sv' : ''}.pdf`);
    
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
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
      // Footer with page numbers
      footerTemplate: `
        <div style="font-size: 8px; color: #94a3b8; font-family: sans-serif; width: 100%; text-align: center; padding-bottom: 10px;">
          The Omega Proof | Global Governance Frameworks | Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `
    });

    console.log(`  ✅ Generated: ${outputPath}`);
  }

  await browser.close();
  console.log("\n✨ Done.");
}

generateOmegaPdf().catch(console.error);
