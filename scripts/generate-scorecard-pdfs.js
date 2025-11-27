// generate-scorecard-pdfs.js
// Run with: node generate-scorecard-pdfs.js

import puppeteer from 'puppeteer';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  languages: ['en', 'sv'],
  inputDir: 'src/lib/content/scorecards',
  outputDir: 'static/resources',
  logoPath: 'static/logo.svg',
  websiteUrl: 'https://globalgovernanceframeworks.org'
};

// Language-specific configuration
const langConfig = {
  en: {
    title: 'The Integration Scorecard',
    subtitle: 'Measuring Human Flourishing Across Six Domains',
    footer: 'Global Governance Frameworks',
    pageLabel: 'Page',
    scoringGuide: 'Scoring Guide',
    outputFile: 'Integration-Scorecard-EN.pdf',
    interactiveFile: 'Integration-Scorecard-EN-Interactive.pdf'
  },
  sv: {
    title: 'Integrationsresultatkortet',
    subtitle: 'Mäta mänskligt välmående över sex domäner',
    footer: 'Global Governance Frameworks',
    pageLabel: 'Sida',
    scoringGuide: 'Poängguide',
    outputFile: 'Integration-Scorecard-SV.pdf',
    interactiveFile: 'Integration-Scorecard-SV-Interactive.pdf'
  }
};

// HTML template for the PDF
function createHTMLTemplate(content, lang, logoBase64) {
  const lc = langConfig[lang];
  
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lc.title}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm 1.5cm;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 210mm;
      margin: 0 auto;
      padding: 0;
      font-size: 11pt;
    }
    
    /* Header */
    .pdf-header {
      text-align: center;
      margin-bottom: 2cm;
      padding-bottom: 1cm;
      border-bottom: 3px solid #2B4B8C;
    }
    
    .logo {
      height: 60px;
      margin-bottom: 1em;
    }
    
    h1 {
      color: #2B4B8C;
      font-size: 28pt;
      font-weight: 700;
      margin: 0.5em 0 0.25em;
      line-height: 1.2;
    }
    
    .subtitle {
      color: #6B5CA5;
      font-size: 14pt;
      font-weight: 400;
      margin: 0 0 0.5em;
    }
    
    /* Content */
    h2 {
      color: #2B4B8C;
      font-size: 18pt;
      font-weight: 600;
      margin: 1.5em 0 0.75em;
      page-break-after: avoid;
    }
    
    h3 {
      color: #6B5CA5;
      font-size: 14pt;
      font-weight: 600;
      margin: 1.25em 0 0.5em;
      page-break-after: avoid;
    }
    
    h4 {
      color: #333;
      font-size: 12pt;
      font-weight: 600;
      margin: 1em 0 0.5em;
      page-break-after: avoid;
    }
    
    p {
      margin: 0.75em 0;
      text-align: justify;
    }
    
    ul, ol {
      margin: 0.5em 0;
      padding-left: 1.5em;
    }
    
    li {
      margin: 0.25em 0;
    }
    
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      page-break-inside: avoid;
    }
    
    th {
      background-color: #2B4B8C;
      color: white;
      padding: 0.75em;
      text-align: left;
      font-weight: 600;
      border: 1px solid #1e3567;
    }
    
    td {
      padding: 0.75em;
      border: 1px solid #ddd;
      vertical-align: top;
    }
    
    tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    
    /* Scoring boxes */
    .scoring-box {
      background-color: #f0f4f8;
      border-left: 4px solid #6B5CA5;
      padding: 1em;
      margin: 1em 0;
      page-break-inside: avoid;
    }
    
    .scoring-box h4 {
      margin-top: 0;
      color: #6B5CA5;
    }
    
    /* Info boxes */
    .info-box {
      background-color: #fff9e6;
      border: 2px solid #DAA520;
      border-radius: 4px;
      padding: 1em;
      margin: 1em 0;
      page-break-inside: avoid;
    }
    
    .info-box strong {
      color: #B8860B;
    }
    
    /* Domain sections */
    .domain-section {
      margin: 1.5em 0;
      page-break-inside: avoid;
    }
    
    .domain-header {
      background: linear-gradient(135deg, #2B4B8C 0%, #6B5CA5 100%);
      color: white;
      padding: 0.75em 1em;
      border-radius: 4px;
      margin-bottom: 0.5em;
    }
    
    .domain-header h3 {
      margin: 0;
      color: white;
    }
    
    /* Footer */
    .pdf-footer {
      margin-top: 3cm;
      padding-top: 1em;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 9pt;
    }
    
    .pdf-footer a {
      color: #2B4B8C;
      text-decoration: none;
    }
    
    /* Page breaks */
    .page-break {
      page-break-before: always;
    }
    
    /* Print optimization */
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .no-break {
        page-break-inside: avoid;
      }
    }
    
    /* Worksheet styling */
    .worksheet-table {
      margin: 1em 0;
    }
    
    .worksheet-table td {
      min-height: 3em;
    }
    
    .score-cell {
      width: 80px;
      text-align: center;
      background-color: #f8f9fa;
    }
    
    /* Assessment criteria */
    .criteria-list {
      list-style: none;
      padding-left: 0;
    }
    
    .criteria-list li {
      padding: 0.5em 0;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .criteria-list li:last-child {
      border-bottom: none;
    }
    
    /* Legend */
    .legend {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5em;
      margin: 1em 0;
      font-size: 10pt;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5em;
    }
    
    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      flex-shrink: 0;
    }
    
    .crisis { background-color: #dc3545; }
    .surviving { background-color: #ffc107; }
    .functioning { background-color: #28a745; }
    .flourishing { background-color: #007bff; }
  </style>
</head>
<body>
  <div class="pdf-header">
    <img src="${logoBase64}" alt="GGF Logo" class="logo" />
    <h1>${lc.title}</h1>
    <p class="subtitle">${lc.subtitle}</p>
  </div>
  
  ${content}
  
  <div class="pdf-footer">
    <p>${lc.footer} • <a href="${config.websiteUrl}">${config.websiteUrl}</a></p>
    <p>This scorecard is freely available for personal, organizational, and community use.</p>
  </div>
</body>
</html>
  `;
}

// Convert markdown to HTML with custom rendering
function convertMarkdownToHTML(markdown) {
  // Custom renderer for better PDF formatting
  const renderer = new marked.Renderer();
  
  // Wrap domain sections
  const originalHeading = renderer.heading;
  renderer.heading = function(text, level, raw) {
    if (level === 3 && text.includes('Domain')) {
      return `<div class="domain-section"><div class="domain-header">${originalHeading.call(this, text, level, raw)}</div>`;
    }
    return originalHeading.call(this, text, level, raw);
  };
  
  marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true
  });
  
  return marked.parse(markdown);
}

// Convert SVG to base64 data URL
async function svgToBase64(svgPath) {
  try {
    const svgContent = await fs.readFile(svgPath, 'utf-8');
    const base64 = Buffer.from(svgContent).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  } catch (error) {
    console.warn(`Could not load logo from ${svgPath}, using placeholder`);
    return '';
  }
}

// Generate read-only PDF
async function generateReadOnlyPDF(lang) {
  console.log(`Generating read-only PDF for ${lang}...`);
  
  const lc = langConfig[lang];
  const markdownPath = path.join(config.inputDir, lang, 'integration-scorecard.md');
  
  try {
    // Read markdown content
    const markdown = await fs.readFile(markdownPath, 'utf-8');
    const htmlContent = convertMarkdownToHTML(markdown);
    
    // Get logo as base64
    const logoBase64 = await svgToBase64(config.logoPath);
    
    // Create full HTML
    const html = createHTMLTemplate(htmlContent, lang, logoBase64);
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const outputPath = path.join(config.outputDir, lc.outputFile);
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '2cm',
        right: '1.5cm',
        bottom: '2cm',
        left: '1.5cm'
      }
    });
    
    await browser.close();
    
    console.log(`✓ Created ${outputPath}`);
    return outputPath;
    
  } catch (error) {
    console.error(`Error generating PDF for ${lang}:`, error);
    throw error;
  }
}

// Add interactive form fields to PDF
async function addInteractiveFields(sourcePdfPath, outputPdfPath, lang) {
  console.log(`Adding interactive fields to ${lang} PDF...`);
  
  try {
    // Load the PDF
    const existingPdfBytes = await fs.readFile(sourcePdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Get the form
    const form = pdfDoc.getForm();
    
    // Define domains and their field positions
    // Note: These positions are approximate and may need adjustment
    const domains = [
      { name: 'biological', page: 2, y: 650 },
      { name: 'cognitive', page: 3, y: 650 },
      { name: 'emotional', page: 4, y: 650 },
      { name: 'behavioral', page: 5, y: 650 },
      { name: 'social', page: 6, y: 650 },
      { name: 'spiritual', page: 7, y: 650 }
    ];
    
    // Add text fields for each domain score
    domains.forEach(domain => {
      const fieldName = `${domain.name}_score`;
      const textField = form.createTextField(fieldName);
      textField.setText('');
      textField.setFontSize(12);
      
      // This is a simplified version - actual positioning requires
      // analyzing the PDF structure or using coordinates
      // You would need to add widgets to specific pages
    });
    
    // Add notes fields
    const notesField = form.createTextField('notes');
    notesField.setText('');
    notesField.enableMultiline();
    notesField.setFontSize(10);
    
    // Save the interactive PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPdfPath, pdfBytes);
    
    console.log(`✓ Created interactive ${outputPdfPath}`);
    
  } catch (error) {
    console.error(`Error adding interactive fields to ${lang}:`, error);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Integration Scorecard PDF Generation...\n');
  
  // Ensure output directory exists
  try {
    await fs.mkdir(config.outputDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  for (const lang of config.languages) {
    try {
      console.log(`\n📄 Processing ${lang.toUpperCase()} version...`);
      
      // Generate read-only PDF
      const readOnlyPath = await generateReadOnlyPDF(lang);
      
      // Generate interactive PDF
      const lc = langConfig[lang];
      const interactivePath = path.join(config.outputDir, lc.interactiveFile);
      
      // Note: Interactive PDF generation is complex and may require manual adjustment
      // For now, we'll create a copy and add a note
      console.log(`\n⚠️  Note: Interactive PDF fields require manual positioning.`);
      console.log(`   The read-only PDF has been created successfully.`);
      console.log(`   For fillable forms, consider using Adobe Acrobat or similar tools.`);
      
    } catch (error) {
      console.error(`Failed to process ${lang}:`, error);
    }
  }
  
  console.log('\n✨ PDF generation complete!\n');
  console.log('Generated files:');
  for (const lang of config.languages) {
    const lc = langConfig[lang];
    console.log(`  - ${config.outputDir}/${lc.outputFile}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main, generateReadOnlyPDF };
