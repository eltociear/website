// generate-frameworks.js
// Generates clean, full-framework PDFs with covers and a navigable table of contents.
//
// Usage:
// 1. Generate all frameworks: node generate-frameworks.js
// 2. Generate a single framework: node generate-frameworks.js meta-governance
//
// Relies on: npm install puppeteer marked
// Data source: src/lib/stores/frameworkNav.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

// --- DATA ---
// Import the list of all frameworks from your SvelteKit store
// We must adjust the path to be relative to this script's location (e.g., in a /scripts folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..'); // Assumes script is in a /scripts folder
const frameworkNavPath = path.join(projectRoot, 'src', 'lib', 'stores', 'frameworkNav.js');

// We need to read frameworkNav.js as text and extract the array,
// as Node.js can't import Svelte .js files directly.
let allFrameworks = [];
try {
	const navFileContent = fs.readFileSync(frameworkNavPath, 'utf8');
	// A bit of regex magic to extract the allFrameworks array as a JSON string
	const match = navFileContent.match(/export const allFrameworks = (\[[\s\S]*?\]);/);
	if (match) {
		// Use a function constructor to safely parse the array string.
		// This avoids insecure eval() and handles newlines/quotes in the JS array.
		allFrameworks = new Function(`return ${match[1]}`)();
		console.log(`✅ Successfully loaded ${allFrameworks.length} frameworks from frameworkNav.js`);
	} else {
		throw new Error('Could not find or parse allFrameworks array in frameworkNav.js');
	}
} catch (e) {
	console.error(`❌ CRITICAL ERROR: Could not load framework data.`, e);
	process.exit(1);
}

// 1. DEFINE THE FRAMEWORKS TO BE GENERATED
// This new array defines the *content* and *structure* of each PDF.
const frameworksToGenerate = [
	{
		slug: 'treaty-for-our-only-home',
		name: 'Treaty for Our Only Home',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'treaty-for-our-only-home'),
		sections: [
			'index',
			'introduction',
			'core-principles',
			'five-pillars',
			'implementation-strategies',
			'monitoring-evaluation',
			'conclusion',
			'faq-and-challenges',
			'glossary',
			'executive-summary-for-the-skeptic',
			'at-a-glance'
		]
	},
	{
		slug: 'genesis-protocol',
		name: 'Genesis Protocol: Constitutional Convening Process',
		manualMeta: {
			 version: '1.0', // from genesis-protocol-1.md
			 status: 'Draft'   // from cluster.constitutional-foundation.ts
		},
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'genesis-protocol'),
		sections: [
			'genesis-protocol-1',
			'genesis-protocol-2',
			'genesis-protocol-3',
			'genesis-protocol-4',
			'genesis-protocol-5',
			'genesis-protocol-6'
		]
	},
	{
		slug: 'meta-governance',
		name: 'Integrated Meta-Governance Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'meta-governance'),
		sections: [
			'introduction',
			'index', 
			'principles',
			'value-proposition', 
			'structural',
			'implementation',
			'evaluation',
			'case-models',
			'future',
			'manifesto', 
			'appendix',
			'related',
			'quick-start'
		]
	},
	{
		slug: 'indigenous-sovereignty-pathways',
		name: 'An Invitational Framework for Indigenous Sovereignty and Planetary Healing',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-sovereignty-pathways'),
		sections: [
    'index',
    'preamble',
    'indigenous-framework-essentials',
    'core-principles',
    'structural-components',
    'pathways-from-vision-to-action',
    'key-mechanisms',
    'vision-of-flourishing',
    'interface-existing-systems',
    'pathways-broader-engagement',
    'supporting-materials-considerations',
    'system-map-visual',
    'glossary-references'
		]
	},
	{
		slug: 'ggf-overview',
		name: 'GGF Complete Overview',
		manualMeta: { version: '1.0', status: 'Ready' },
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'overview', 'en'),
		sections: [
			'introduction',
			'ggf-vision',
			'foundational-architecture',
			'implementation-roadmap',
			'thematic-clusters',
			'living-system',
			'invitation',
		]
	},
	{
		slug: 'emergent-governance-protocol',
		name: 'Emergent Governance Protocol Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'emergent-governance-protocol'),
		sections: [
			'emergent-governance-protocol',
			'egp-one-page-summary',
			'egp-appendix',
			'egp-glossary'
		]
	},
	{
		slug: 'planetary-immune-system',
		name: 'Planetary Immune System Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'planetary-immune-system'),
		sections: [
			'index',
			'introduction',
			'principles',
			'structural',
			'implementation',
			'coordination-response',
			'long-term-stewardship',
			'threat-assessment',
			'crisis-protocols', 
			'technology-frameworks',
			'resource-mobilization',
			'success-metrics',
			'risk-assessment'
		]
	},
	{
		slug: 'technology-governance',
		name: 'Technology Governance Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'technology-governance'),
		sections: [
			'index', 'principles', 'position', 'gtc', 'trrt', 'oversight', 'indigenous',
			'mechanisms', 'economy', 'roadmap', 'tools', 'emerging', 'evaluation',
			'case-studies', 'international', 'glossary', 'references', 'contributing',
			'playbook', 'trrt-detailed', 'starter-kit-detailed', 'circuit-breaker',
			'crisis-unit', 'international-detailed', 'implementation-strategy',
			'documentation', 'philosophy'
		]
	},
	{
		slug: 'justice-systems',
		name: 'Justice Systems Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems'),
		sections: [
			'index', 'introduction', 'governance-structure', 'legal-framework',
			'institutional-relationships', 'implementation-mechanisms', 'digital-justice-innovation',
			'monitoring-accountability', 'stakeholder-engagement', 'challenges-mitigation',
			'timeline-milestones', 'conclusion', 'appendices'
		]
	},
	{
		slug: 'financial-systems',
		name: 'Financial Systems Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems'),
		sections: [
			'index', 'introduction', 'core-principles', 'structural-components',
			'implementation-approaches', 'metrics-evaluation', 'supporting-sections', 'appendices'
		]
	},
	{
		slug: 'moral-operating-system',
		name: 'Moral Operating System Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'moral-operating-system'),
		sections: [
			'index', 'preamble', 'introduction', 'foundational-values-principles',
			'rights-commitments', 'governance-integration', 'implementation-plan',
			'appendix-a', 'appendix-b', 'appendix-c', 'appendix-d', 'what-is-a-right',
			'living-continuum-worth', 'entitlement-to-entanglement', 'spiral-ethical-growth',
			'ontological-humility', 'rights-promise-future'
		]
	},
	{
		slug: 'work-in-liberation',
		name: 'Work in Liberation Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'work-in-liberation'),
		sections: [
			'index', 'introduction', 'core-principles', 'core-components',
			'implementation-plan', 'tools-technologies', 'monitoring-evaluation',
			'crisis-response', 'expected-outcomes', 'framework-integration',
			'global-implementation', 'conclusion', 'appendices'
		]
	},
	{
		slug: 'aegis-protocol',
		name: 'Aegis Protocol Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aegis-protocol'),
		sections: [
			'index', 'introduction-vision', 'foundational-principles', 'integration-architecture',
			'historical-grounding', 'strategic-resilience', 'economic-modeling',
			'non-state-integration', 'implementation-phases', 'three-pillars',
			'root-causes', 'success-metrics', 'faq', 'taking-action',
			'strategic-briefing-for-the-russian-federation', 'the-china-engagement-strategy',
			'the-european-ally-briefing', 'the-global-south-partnership-proposal', 'appendices'
		]
	},
	{
		slug: 'hearthstone-protocol',
		name: 'Hearthstone Protocol Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'hearthstone-protocol'),
		sections: [
			'index', 'introduction', 'theory-of-change', 'core-principles',
			'commons-architecture', 'asset-transition-pathways', 'legal-cultural-framework',
			'economic-integration', 'implementation-strategy', 'framework-integration',
			'risk-mitigation', 'advocacy-action', 'glossary', 'appendices'
		]
	},
	{
		slug: 'hearthlight-protocol',
		name: 'Hearthlight Protocol Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'hearthlight-protocol'),
		sections: [
    'index', 'at-a-glance', 'executive-summary-skeptics', 'vision-purpose', 'core-principles',
    'framework-architecture', 'implementation-strategy', 'ggf-integration', 'performance-indicators',
    'risk-management', 'pathways-forward'
		]
	},
	{
		slug: 'synoptic-protocol',
		name: 'Synoptic Protocol Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'synoptic-protocol'),
		sections: [
			'index', 'introduction', 'epistemic-crisis', 'foundational-principles',
			'six-pillars', 'implementation-governance', 'framework-integration',
			'risk-mitigation', 'advocacy-action', 'glossary', 'appendices'
		]
	},
	{
		slug: 'conduit-protocol',
		name: 'Conduit Protocol Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'conduit-protocol'),
		sections: [
			'index', 'introduction', 'theory-of-change', 'core-principles',
			'infrastructure-commons', 'key-mechanisms', 'just-transition',
			'implementation-pathways', 'framework-integration', 'technical-specifications',
			'advocacy-action', 'glossary', 'appendices'
		]
	},
	{
		slug: 'deep-time-governance',
		name: 'Deep Time Governance Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'deep-time-governance'),
		sections: [
			'index', 'introduction-vision', 'framework-position', 'five-domains',
			'core-principles', 'institutional-architecture', 'implementation-pathways',
			'philosophical-foundations', 'technical-specifications', 'case-studies', 'faq'
		]
	},
	{
		slug: 'planetary-health-governance',
		name: 'Planetary Health Governance Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'planetary-health-governance'),
		sections: [
			'preamble', 'index', 'introduction', 'planetary-health-charter',
			'core-principles', 'governance-architecture', 'cross-cutting-policies',
			'framework-integration', 'implementation-roadmap', 'conclusion', 'appendices'
		]
	},
	{
		slug: 'global-health-and-pandemic-security',
		name: 'Global Health & Pandemic Security Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-health-and-pandemic-security'),
		sections: [
			'index', 'introduction', 'core-principles', 'universal-declaration',
			'governance-architecture', 'operational-systems', 'crisis-response',
			'implementation-roadmap', 'funding-mechanisms', 'framework-integration',
			'conclusion', 'appendices'
		]
	},
	{
		slug: 'consciousness-and-inner-development',
		name: 'Consciousness & Inner Development Implementation Framework',
		sourceDir: path.join(projectRoot, 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development'),
		sections: [
			'index', 'manifesto', 'governance-structure', 'personal-transformation',
			'collective-consciousness', 'systemic-integration', 'spiral-dynamics',
			'economic-realignment', 'community-engagement', 'crisis-response',
			'metrics-accountability', 'digital-platforms', 'ethical-ai-governance',
			'cross-cultural-translation', 'implementation-roadmap',
			'visual-architecture-map', 'conclusion'
		]
	}
];

// --- STYLING ---
// Re-using the CSS from your original script to match the site's branding
const finalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
  body {
    font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
    font-size: 11pt;
    line-height: 1.4;
    color: #333;
    max-width: none;
    margin: 0;
    padding: 0.5cm;
  }
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    color: #2B4B8C; /* GGF Blue */
    margin-top: 0.8em;
    margin-bottom: 0.4em;
    line-height: 1.2;
  }
  h1 { font-size: 20pt; }
  h2 { font-size: 16pt; border-bottom: 1px solid #eaecef; padding-bottom: 0.2em; }
  h3 { font-size: 14pt; }
  h4 { font-size: 12pt; font-weight: bold; }
  p { margin: 0.3em 0; text-align: justify; }
  a { color: #DAA520; text-decoration: none; } /* GGF Gold */
  blockquote {
    border-left: 3px solid #6B5CA5; /* GGF Purple */
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
  pre code {
    display: block;
    padding: 0.5em;
    overflow-x: auto;
    font-size: 10pt;
  }
  table { border-collapse: collapse; width: 100%; margin: 0.5em 0; font-size: 10pt; }
  table, th, td { border: 1px solid #ddd; }
  th, td { padding: 6px 8px; text-align: left; }
  th { background-color: #2B4B8C; color: white; font-size: 10pt; }
  tr:nth-child(even) { background-color: #f9f9f9; }
  hr { border: 0; height: 1px; background: #eaecef; margin: 1em 0; }
  ul, ol { padding-left: 1.2em; margin: 0.3em 0; }
  li { margin-bottom: 0.2em; }
  img { max-width: 100%; height: auto; display: block; margin: 0.5em auto; }
  
  .image-container { text-align: center; margin: 1em 0; page-break-inside: avoid; }
  .image-container img { max-width: 90%; height: auto; display: block; margin: 0 auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #eee; }
  .svg-container { text-align: center; margin: 1em 0; page-break-inside: avoid; }
  .svg-container img { max-width: 85%; height: auto; display: block; margin: 0 auto; }
  
  .page-break { page-break-before: always; }
  h1, h2 { page-break-after: avoid; page-break-inside: avoid; }
  h3, h4, h5, h6 { page-break-after: avoid; }
  .page-break-avoid { page-break-inside: avoid; }
  p { orphans: 3; widows: 3; }
  table { page-break-inside: avoid; }
  
  /* New Cover Page Styles */
  .cover-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2cm;
    box-sizing: border-box;
  }
  .cover-logo {
    width: 120px;
    height: 120px;
    margin-bottom: 2rem;
  }
  .cover-title {
    font-size: 28pt;
    font-weight: 700;
    color: #2B4B8C; /* GGF Blue */
    margin-bottom: 2rem;
    line-height: 1.3;
  }
  .cover-meta-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  .cover-badge {
    display: inline-block;
    font-size: 10pt;
    padding: 0.3rem 0.8rem;
    border-radius: 1rem;
    margin: 0 0.25rem;
    font-weight: 600;
    white-space: nowrap;
    font-family: 'Inter', sans-serif;
  }
  .cover-badge-status {
    background-color: #DBEAFE; /* Blue */
    color: #1E40AF;
  }
  .cover-badge-version {
    background-color: #1E40AF;
    color: #FFFFFF;
    font-family: 'Monaco', 'Menlo', monospace;
  }
  
  /* New TOC Styles */
  .toc-page {
    page-break-before: always;
  }
  .toc-page h1 {
    font-size: 20pt;
    text-align: left;
    border-bottom: 2px solid #2B4B8C;
  }
  .toc-page ul {
    list-style: none;
    padding-left: 0;
  }
  .toc-page li {
    font-size: 12pt;
    margin-bottom: 0.75rem;
  }
  .toc-page a {
    color: #2B4B8C;
    text-decoration: none;
    font-weight: 600;
  }
  .toc-page a:hover {
    color: #DAA520;
    text-decoration: underline;
  }
`;

// --- HELPER FUNCTIONS ---
// (Kept from your original script)

function getLogoDataUri() {
	const logoPath = path.join(projectRoot, 'static', 'logo.svg');
	if (fs.existsSync(logoPath)) {
		try {
			const svgContent = fs.readFileSync(logoPath, 'utf8');
			let processedSvg = svgContent;
			if (!svgContent.includes('xmlns="http://www.w3.org/2000/svg"')) {
				processedSvg = svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
			}
			return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(processedSvg)}`;
		} catch (error) {
			console.warn(`❌ Error processing logo: ${error.message}`);
			return '';
		}
	} else {
		console.warn(`⚠️ Logo file not found: ${logoPath}`);
		return '';
	}
}

function processSection(sectionFile, sourceDir) {
	const fullPath = path.join(sourceDir, sectionFile);
	if (!fs.existsSync(fullPath)) {
		console.warn(`   ⚠️  File not found: ${sectionFile}, skipping.`);
		return { content: '', title: null };
	}

	try {
		let content = fs.readFileSync(fullPath, 'utf8');
		let title = null;

		// Try to find the first H1 tag for the TOC
		const h1Match = content.match(/^#\s+(.+)$/m);
		if (h1Match) {
			title = h1Match[1].trim();
		}

		// Remove YAML frontmatter
		if (content.startsWith('---\n') || content.startsWith('---\r\n')) {
			const endPos = content.indexOf('\n---\n', 4);
			if (endPos !== -1) {
				content = content.substring(endPos + 5);
			}
		}

		// If no H1, try to find a frontmatter title
		if (!title) {
			const titleMatch = content.match(/^title:\s*['"]?(.+?)['"]?$/m);
			if (titleMatch) {
				title = titleMatch[1].trim();
			}
		}

		// Fallback title
		if (!title) {
			title = sectionFile.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
		}

		return { content, title };
	} catch (error) {
		console.error(`   ❌ Error processing file ${sectionFile}: ${error.message}`);
		return { content: '', title: null };
	}
}

function processImageReferences(markdown, inputFileDir) {
	console.log(`🖼️  Processing images relative to: ${inputFileDir}`);
	const imgRegex = /!\[(.*?)\]\(([^)]+)\)/g;
	let processedMarkdown = markdown;
	let match;
	while ((match = imgRegex.exec(markdown)) !== null) {
		const altText = match[1];
		let imgPath = match[2];

		if (imgPath.startsWith('data:') || imgPath.startsWith('http')) continue;

		let resolvedPath;
		if (imgPath.startsWith('/')) {
			resolvedPath = path.join(projectRoot, 'static', imgPath);
		} else {
			resolvedPath = path.join(inputFileDir, imgPath);
		}

		if (fs.existsSync(resolvedPath)) {
			try {
				const ext = path.extname(resolvedPath).toLowerCase();
				if (ext === '.svg') {
					const svgContent = fs.readFileSync(resolvedPath, 'utf8');
					let processedSvg = svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
					const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(processedSvg)}`;
					processedMarkdown = processedMarkdown.replace(match[0], `<div class="svg-container"><img src="${svgDataUri}" alt="${altText}" /></div>`);
				} else {
					const imageBuffer = fs.readFileSync(resolvedPath);
					const mimeType = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' }[ext] || 'image/png';
					const dataUri = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
					processedMarkdown = processedMarkdown.replace(match[0], `<div class="image-container"><img src="${dataUri}" alt="${altText}" /></div>`);
				}
				console.log(`     ✅ Embedded image: ${path.basename(resolvedPath)}`);
			} catch (e) {
				console.warn(`     ❌ Error embedding image ${resolvedPath}: ${e.message}`);
			}
		} else {
			console.warn(`     ⚠️  Image file not found: ${resolvedPath}`);
		}
	}
	return processedMarkdown;
}

// --- MAIN SCRIPT ---

async function generateFrameworkPDFs() {
	// Parse command line argument
	const targetSlug = process.argv[2];
	const frameworks = targetSlug
		? frameworksToGenerate.filter(f => f.slug === targetSlug)
		: frameworksToGenerate;

	if (frameworks.length === 0) {
		console.error(`❌ Error: No framework found with slug "${targetSlug}".`);
		return;
	}

	console.log(`🚀 Starting PDF generation for ${frameworks.length} framework(s)...`);

	const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
	const logoDataUri = getLogoDataUri();

	for (const framework of frameworks) {
		console.log(`\n=================================================`);
		console.log(`📦 Processing Framework: ${framework.name}`);
		console.log(`=================================================`);

		// 1. Find framework data from frameworkNav.js
		const frameworkData = allFrameworks.find(f => f.slug === framework.slug);
		if (!frameworkData) {
			console.warn(`   ⚠️  Could not find framework data for slug "${framework.slug}" in frameworkNav.js. Skipping.`);
			continue;
		}

		const version = frameworkData.version || 'N/A';
		const status = frameworkData.status ? (frameworkData.status.charAt(0).toUpperCase() + frameworkData.status.slice(1)) : 'N/A';
		const lang = 'en'; // Hardcoded to English for this script
		const outputDir = path.join(projectRoot, 'static', 'downloads', lang);
		if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
		
		const outputFile = path.join(outputDir, `${framework.slug}-framework-v${version}.pdf`);
		
		let sectionsContent = [];
		let contentHtml = '';
		let tocHtml = `<div class="toc-page"><h1>Table of Contents</h1><ul>`;

		// 2. Load, clean, and process all markdown sections
		console.log(`📚 Loading ${framework.sections.length} content sections...`);
		for (const sectionName of framework.sections) {
			const sectionFile = `${sectionName}.md`;
			const { content, title } = processSection(sectionFile, framework.sourceDir);

			if (content && title) {
				sectionsContent.push({ content, title });
				console.log(`   ✔️  Loaded section: "${title}"`);
			}
		}

		if (sectionsContent.length === 0) {
			console.error(`   ❌ No content found for ${framework.name}. Skipping.`);
			continue;
		}

		// 3. Build the TOC and the main content HTML
		console.log(`🔨 Building Table of Contents and main HTML...`);
		sectionsContent.forEach((section, index) => {
			const anchorId = `section-${index}`;
			tocHtml += `<li><a href="#${anchorId}">${section.title}</a></li>`;
			
			// Add page break before every section *except the first one*
			const pageBreak = index === 0 ? '' : `<div class="page-break" id="${anchorId}"></div>`;
			
			contentHtml += `${pageBreak}${section.content}`;
		});
		tocHtml += `</ul></div>`;

		// 4. Create the new Cover Page
		console.log(`🎨 Creating cover page...`);
		const coverHtml = `
		<div class="cover-page">
			<img src="${logoDataUri}" alt="GGF Logo" class="cover-logo" />
			<h1 class="cover-title">${framework.name}</h1>
			<div class="cover-meta-container">
				<span class="cover-badge cover-badge-status">${status}</span>
				<span class="cover-badge cover-badge-version">Version ${version}</span>
			</div>
		</div>
		`;

		// 5. Combine, process images, and convert to final HTML
		console.log(`🖼️  Processing images in combined HTML...`);
		let finalMarkdown = contentHtml; // contentHtml is still markdown at this point
		finalMarkdown = processImageReferences(finalMarkdown, framework.sourceDir);

		let finalHtml = marked(finalMarkdown);

		// 6. Create the full HTML document for Puppeteer
		const fullHtml = `
		<!DOCTYPE html>
		<html lang="${lang}">
		<head>
			<meta charset="UTF-8">
			<title>${framework.name}</title>
			<style>${finalCSS}</style>
		</head>
		<body>
			${coverHtml}
			${tocHtml}
			${finalHtml}
		</body>
		</html>`;
		
		// 7. Generate the PDF
		console.log(`📄 Generating PDF... (this may take a moment)`);
		try {
			const page = await browser.newPage();
			await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 90000 });

			const footerText = `${framework.name} | ${status} v${version}`;
			
			await page.pdf({
				path: outputFile,
				format: 'A4',
				margin: { top: '2.5cm', right: '1.5cm', bottom: '2.5cm', left: '1.5cm' },
				printBackground: true,
				displayHeaderFooter: true,
				headerTemplate: `
					<div style="width: 100%; font-size: 8px; padding: 0 1.5cm; color: #2B4B8C; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee;">
						<div style="display: flex; align-items: center;">
							<img src="${logoDataUri}" style="height: 12px; margin-right: 8px;" />
							<span style="font-weight: 600;">Global Governance Frameworks</span>
						</div>
						<div style="font-size: 7px; color: #666;">
							${footerText}
						</div>
					</div>
				`,
				footerTemplate: `
					<div style="width: 100%; font-size: 7px; padding: 0 1.5cm; color: #777; text-align: center; border-top: 1px solid #eee;">
						<span style="font-weight: 500;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
					</div>
				`,
				preferCSSPageSize: false,
				scale: 0.95
			});

			await page.close();
			console.log(`\n🎉 SUCCESS: Generated ${outputFile}`);

		} catch (e) {
			console.error(`   ❌ PDF generation failed for ${framework.name}: ${e.message}`);
		}
	}

	await browser.close();
	console.log(`\n✨ All framework PDFs generated.`);
}

generateFrameworkPDFs().catch(console.error);
