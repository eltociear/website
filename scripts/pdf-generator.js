// pdf-generator.js
// Generates PDFs for all frameworks: full frameworks, tools and quick-start guides
// Installation: npm install puppeteer marked

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

// Parse command line arguments
const args = process.argv.slice(2);
const targetCategory = args[0]; // Get category from command line argument
console.log(`Target category: ${targetCategory || 'all'}`);

// If no arguments provided, show usage information
if (args.length === 0) {
  console.log(`
Usage: node tools-pdf-generator.js [category]

Available categories:
- regenerative-enterprise
- institutional-regeneration
- educational-systems
- climate-and-energy-governance
- peace-and-conflict-resolution
- economic-integration
- digital-commons
- justice-systems
- religious-and-spiritual-dialogue-governance
- financial-systems
- governance
- environmental-stewardship
- kinship-garden
- biodiversity
- planetary-health-governance
- global-health-and-pandemic-security
- consciousness-and-inner-development
- aging-population-support-governance
- animal-welfare-governance 
- water-and-sanitation-governance
- indigenous-governance-and-traditional-knowledge
- kinship-protocol
- mental-health-governance
- moral-operating-system
- treaty-for-our-only-home
- get-involved
- frameworks-foundation
- meta-governance
- aethelred-accord
- gaian-trade
- work-in-liberation
- aegis-protocol
- shield-protocol
- synoptic-protocol
- conduit-protocol
- hearthstone-protocol
- technology-governance
- regenerative-resources
- great-transition
- deep-time-governance
- bioregional-polis
- sundown-protocol
- mobility-commons
- regenerative-journeys
- oceans-and-marine-governance
- emergent-governance-protocol
- disaster-risk-reduction
- ggf-overview
- whitepapers
- protocols
- bioregional-compass

Example: node tools-pdf-generator.js economic
  `);
  // Uncomment the line below if you want to exit when no category is provided
  // process.exit(0);
}

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const languages = ['en', 'sv', 'es', 'fr'];
const outputDirs = {
  'regenerative-enterprise': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'regenerative-enterprise'),
  'institutional-regeneration': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'institutional-regeneration'),
  'educational-systems': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'educational-systems'),
  'climate-and-energy-governance': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'climate-and-energy-governance'),
  'peace-and-conflict-resolution': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'peace-and-conflict-resolution'),
  'economic-integration': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'economic-integration'),
  'digital-commons': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'digital-commons'),
  'justice-systems': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'justice-systems'),
  'spiritual-and-religious-dialogue-governance': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'religious-and-spiritual-dialogue-governance'),
  'financial-systems': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'financial-systems'),
  'environmental-stewardship': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'environmental-stewardship'),
  'governance': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'governance'),
  'biodiversity-governance': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'biodiversity-governance'),
  'planetary-health-governance': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'planetary-health-governance'),
  'global-health-and-pandemic-security': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'global-health-and-pandemic-security'),
  'kinship-protocol': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'kinship-protocol'),
  'mental-health-governance': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'mental-health-governance'),
  'moral-operating-system': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'moral-operating-system'),
  'aethelred-accord': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'aethelred-accord'),
  'consciousness-and-inner-development': path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'consciousness-and-inner-development'),
  'youth': path.join(__dirname, '..', 'static', 'frameworks','tools', 'youth'),
  'aging-population-support-governance': path.join(__dirname, '..', 'static', 'frameworks','tools', 'aging-population-support-governance'),
  'animal-welfare-governance': path.join(__dirname, '..', 'static', 'frameworks','tools', 'animal-welfare-governance'),
  'gaian-trade': path.join(__dirname, '..', 'static', 'frameworks','tools', 'gaian-trade'),
  'work-in-liberation': path.join(__dirname, '..', 'static', 'frameworks','tools', 'work-in-liberation'),
  'kinship-garden': path.join(__dirname, '..', 'static', 'frameworks','tools', 'kinship-garden'),
  'aegis-protocol': path.join(__dirname, '..', 'static', 'frameworks','tools', 'aegis-protocol'),
  'shield-protocol': path.join(__dirname, '..', 'static', 'frameworks','tools', 'shield-protocol'),
  'synoptic-protocol': path.join(__dirname, '..', 'static', 'frameworks','tools', 'synoptic-protocol'),
  'conduit-protocol': path.join(__dirname, '..', 'static', 'frameworks','tools', 'conduit-protocol'),
  'hearthstone-protocol': path.join(__dirname, '..', 'static', 'frameworks','tools', 'hearthstone-protocol'),
  'technology-governance': path.join(__dirname, '..', 'static', 'frameworks','tools', 'technology-governance'),
  'regenerative-resources': path.join(__dirname, '..', 'static', 'frameworks','tools', 'regenerative-resources'),
  'great-transition': path.join(__dirname, '..', 'static', 'frameworks','tools', 'great-transition'),
  'bioregional-compass': path.join(__dirname, '..', 'static', 'frameworks','tools', 'bioregional-compass'),
  'deep-time-governance': path.join(__dirname, '..', 'static', 'frameworks','tools', 'deep-time-governance'),
  'bioregional-polis': path.join(__dirname, '..', 'static', 'frameworks','tools', 'bioregional-polis'),
  'water-and-sanitation-governance': path.join(__dirname, '..', 'static', 'frameworks','tools', 'water-and-sanitation-governance'),
  'indigenous-governance-and-traditional-knowledge': path.join(__dirname, '..', 'static', 'frameworks','tools', 'indigenous-governance-and-traditional-knowledge'),
  'emergent-governance-protocol': path.join(__dirname, '..', 'static', 'frameworks','tools', 'emergent-governance-protocol'),
  'living-land-protocol': path.join(__dirname, '..', 'static', 'frameworks','tools', 'living-land-protocol'),
  'oceans-and-marine-governance': path.join(__dirname, '..', 'static', 'frameworks','tools', 'oceans-and-marine-governance'),
  'mobility-commons': path.join(__dirname, '..', 'static', 'frameworks','tools', 'mobility-commons'),
  'regenerative-journeys': path.join(__dirname, '..', 'static', 'frameworks','tools', 'regenerative-journeys'),
  'disaster-risk-reduction': path.join(__dirname, '..', 'static', 'frameworks','tools', 'disaster-risk-reduction'),
  'sundown-protocol': path.join(__dirname, '..', 'static', 'frameworks','tools', 'sundown-protocol'),
  'treaty-for-our-only-home': path.join(__dirname, '..', 'static', 'frameworks','tools', 'treaty-for-our-only-home'),
  'get-involved': path.join(__dirname, '..', 'static', 'get-involved'),
  'frameworks-foundation': path.join(__dirname, '..', 'static', 'downloads'),
  'meta-governance': path.join(__dirname, '..', 'static', 'downloads'),
  'ggf-overview': path.join(__dirname, '..', 'static', 'downloads'),
  'whitepapers': path.join(__dirname, '..', 'static', 'resources', 'whitepapers'),
  'protocols': path.join(__dirname, '..', 'static', 'resources', 'protocols'),
};

// Validate category if provided
if (targetCategory && !Object.keys(outputDirs).includes(targetCategory)) {
  console.error(`Error: Invalid category '${targetCategory}'`);
  console.error(`Valid categories are: ${Object.keys(outputDirs).join(', ')}`);
  process.exit(1);
}

// Define tools to process
const tools = [

  // Protocols
  {
    name: 'cultural-translation',
    category: 'protocols',
    fileNames: {
      en: 'cultural-translation-protocol',
      sv: 'cultural-translation-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'protocols', 'en', 'cultural-translation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'protocols', 'sv', 'cultural-translation')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Cultural Translation Protocol',
      sv: 'Kulturellt översättningsprotokoll'
    },
    sections: [
      'introduction',
      'overview',
      'purpose-foundation',
      'recognition-principles',
      'deep-dialogue',
      'co-design-adaptation',
      'validation-integration',
      'safeguards-implementation'
    ]
  },

  // White Papers
  {
    name: 'the-infinite-paradox',
    category: 'whitepapers',
    fileNames: {
      en: 'The_Infinite_Paradox_-_Non-Dual_Ethics_for_Planetary_Governance',
      sv: 'Den_oändliga_paradoxen_-_Icke-dual_etik_för_planetariskt_styre'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'sv')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'resources', 'whitepapers'),
      sv: path.join(__dirname, '..', 'static', 'resources', 'whitepapers')
    },
    pageFooter: {
      en: 'GGF Whitepaper - The Infinite Paradox: Non-Dual Ethics for Planetary Governance',
      sv: 'GGF Whitepaper - Den oändliga paradoxen: Icke-dual etik för planetariskt styre'
    }
  },
  {
    name: 'the-regenerative-governance',
    category: 'whitepapers',
    fileNames: {
      en: 'The_Regenerative_Governance_-_Integrating_Hardware_Heart_Nervous_System',
      sv: 'Regenerativ_styrning_-_Integrering_hårdvara_hjärta_nervsystem'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'sv')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'resources', 'whitepapers'),
      sv: path.join(__dirname, '..', 'static', 'resources', 'whitepapers')
    },
    pageFooter: {
      en: 'GGF Whitepaper - The Regenerative Governance: Integrating the Hardware, Heart, and Nervous System of Global Governance',
      sv: 'GGF Whitepaper - Regenerativ styrning: Integrering av hårdvaran, hjärtat och nervsystemet i global styrning'
    }
  },
  {
    name: 'cognitive-scaffolding',
    category: 'whitepapers',
    fileNames: {
      en: 'Cognitive_Scaffolding_-_A_Multi-Model_AI_Synthesis_Method',
      sv: 'Kognitiv_stöttning_-_En_syntesmetod_med_flera_AI-modeller'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'sv')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'resources', 'whitepapers'),
      sv: path.join(__dirname, '..', 'static', 'resources', 'whitepapers')
    },
    pageFooter: {
      en: 'GGF Whitepaper - Cognitive Scaffolding: A Multi-Model AI Synthesis Method for Solving Complex Systemic Problems',
      sv: 'GGF Whitepaper - Kognitiv stöttning: En syntesmetod med flera AI-modeller för att lösa komplexa systemproblem'
    }
  },
  {
    name: 'the-currency-of-care',
    category: 'whitepapers',
    fileNames: {
      en: 'The_Currency_of_Care_Beyond_UBI',
      sv: 'Omsorgens_valuta_bortom_UBI'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'sv')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'resources', 'whitepapers'),
      sv: path.join(__dirname, '..', 'static', 'resources', 'whitepapers')
    },
    pageFooter: {
      en: "GGF Whitepaper - The Currency of Care: Why Universal Basic Income Isn't Enough",
      sv: 'GGF Whitepaper - Omsorgens valuta: Varför universell basinkomst inte är nog'
    }
  },
  {
    name: 'beyond-fragmented-truth',
    category: 'whitepapers',
    fileNames: {
      en: 'Beyond_Fragmented_Truth_-_A_Reasoning_Path_from_Ancient_Wisdom_to_Modern_Governance',
      sv: 'Bortom_fragmenterad_sanning_-_En_resonemangsväg_från_forntida_visdom_till_modern_styrning'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'papers', 'sv')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'resources', 'whitepapers'),
      sv: path.join(__dirname, '..', 'static', 'resources', 'whitepapers')
    },
    pageFooter: {
      en: "GGF Whitepaper - Beyond Fragmented Truth: A Reasoning Path from Ancient Wisdom to Modern Governance",
      sv: 'GGF Whitepaper - Bortom fragmenterad sanning: En resonemangsväg från forntida visdom till modern styrning'
    }
  },

  // GGF Overview
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'ggf-overview',
    fileNames: {
      en: 'ggf-overview-executive-summary-en',
      sv: 'ggf-overview-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'overview', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'overview', 'sv')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'GGF Overview - Executive Summary for the Skeptic',
      sv: 'GGF Översikt - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'ggf-overview',
    category: 'ggf-overview',
    fileNames: {
      en: 'ggf-complete-overview',
      sv: 'ggf-komplett-översikt'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'overview', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'overview', 'sv')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'GGF Overview',
      sv: 'GGF Översikt'
    },
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

  // Emergent Governance Protocol, Full framework
  {
    name: 'emergent-governance-protocol-framework',
    category: 'emergent-governance-protocol',
    fileNames: {
      en: 'Emergent-Governance-Protocol-Framework',
      sv: 'Emergent-Governance-Protocol-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'emergent-governance-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'emergent-governance-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Emergent Governance Protocol',
      sv: 'Protokoll för framväxande styrning'
    },
    sections: [
      'emergent-governance-protocol',
      'egp-one-page-summary',
      'egp-appendix',
      'egp-glossary'
    ]
  },

  // Bioregional Compass
  // Full guide
  {
    name: 'bioregional-compass-guide',
    category: 'bioregional-compass',
    fileNames: {
      en: 'ggf-guide-bioregional-compass-v1.0',
      sv: 'ggf-guide-bioregional-compass-v1.0'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'guides', 'en', 'bioregional-compass', 'the-guide'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'guides', 'sv', 'bioregional-compass', 'the-guide')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Bioregional Compass Guide',
      sv: 'Bioregional kompass-guide'
    },
    sections: [
      'introduction',
      'how-to-use-this-guide',
      'defining-your-minimum-viable-baz',
      'pillar-0-the-inner-ground',
      'pillar-1-the-spark',
      'pillar-2-finding-our-place',
      'pillar-3-building-the-vessel',
      'pillar-4-weaving-the-council',
      'pillar-5-installing-the-os',
      'pillar-6-igniting-the-engine',
      'becoming-a-baz-graduation-and-network-integration'
    ]
  },

  // Great Transition
  // Full guide
  {
    name: 'great-transition-guide',
    category: 'great-transition',
    fileNames: {
      en: 'ggf-guide-great-transition-v1.0',
      sv: 'ggf-guide-great-transition-v1.0'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'guides', 'en', 'great-transition'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'guides', 'sv', 'great-transition')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Great Transition Guide',
      sv: 'Guide till den stora omställningen'
    },
    sections: [
      'introduction',
      'table-of-contents',
      'sunsetting',
      'healing',
      'empowering',
      'building',
      'case-study',
      'conclusion'
    ]
  },

  // Regenerative Resources
  // Full guide
  {
    name: 'regenerative-resources-guide',
    category: 'regenerative-resources',
    fileNames: {
      en: 'ggf-guide-regenerative-resources-v1.0',
      sv: 'ggf-guide-regenerative-resources-v1.0'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'guides', 'en', 'regenerative-resources'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'guides', 'sv', 'regenerative-resources')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Regenerative Resources Guide',
      sv: 'Guide till regenerativa resurser'
    },
    sections: [
    'introduction',
    'table-of-contents',
    'core-principle',
    'pillar-1',
    'pillar-2', 
    'pillar-3',
    'pillar-4',
    'pillar-5',
    'unified-workflow',
    'conclusion'
    ]
  },

  // Oceans & Marine Governance
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'oceans-and-marine-governance',
    fileNames: {
      en: 'oceans-and-marine-governance-executive-summary-en',
      sv: 'oceans-and-marine-governance-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'oceans-and-marine-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'oceans-and-marine-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Oceans & Marine Governance - Executive Summary for the Skeptic',
      sv: 'Havs- och marinstyrning - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'oceans-and-marine-governance-framework',
    category: 'oceans-and-marine-governance',
    fileNames: {
      en: 'Oceans-And-Marine-Governance-Framework',
      sv: 'Oceans-And-Marine-Governance-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'oceans-and-marine-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'oceans-and-marine-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Oceans & Marine Governance Framework',
      sv: 'Ramkverk för havs- och marinstyrning'
    },
    sections: [
      'index',
      'introduction-vision',
      'blue-heart-metaphor',
      'framework-integration',
      'three-pillars',
      'key-innovations',
      'implementation-roadmap',
      'economic-model',
      'faq',
      'getting-involved',
      'appendices'
    ]
  },

  // Regenerative Journeys
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'regenerative-journeys',
    fileNames: {
      en: 'regenerative-journeys-executive-summary-en',
      sv: 'regenerative-journeys-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'regenerative-journeys'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'regenerative-journeys')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Regenerative Journeys - Executive Summary for the Skeptic',
      sv: 'Regenerativa resor - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'regenerative-journeys-framework',
    category: 'regenerative-journeys',
    fileNames: {
      en: 'Regenerative-Journeys-Framework',
      sv: 'Regenerative-Journeys-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'regenerative-journeys'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'regenerative-journeys')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Regenerative Journeys Framework',
      sv: 'Ramverk för regenerativa resor'
    },
    sections: [
      'index',
      'executive-summary-vision',
      'framework-positioning',
      'core-principles',
      'six-pillars',
      'implementation-sequence',
      'sacred-journey',
      'economic-justice',
      'climate-adaptation',
      'accountability-systems',
      'recovery-protocols',
      'success-stories',
      'appendices'
    ]
  },

  // Climate & Energy Governance
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'climate-and-energy-governance-executive-summary-en',
      sv: 'climate-and-energy-governance-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Climate & Energy Governance - Executive Summary for the Skeptic',
      sv: 'Klimat och energistyrning - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'climate-and-energy-governance-framework',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'Climate-And-Energy-Governance-Framework',
      sv: 'Climate-And-Energy-Governance-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Climate & Energy Governance Framework',
      sv: 'Ramverk för klimat och energistyrning'
    },
    sections: [
      'index',
      'introduction-vision',
      'guiding-principles',
      'integration-architecture',
      'governance-structure',
      'four-pillars',
      'policy-mechanisms',
      'stakeholder-engagement',
      'financing-framework',
      'implementation-roadmap',
      'success-metrics',
      'challenges-solutions',
      'taking-action',
      'appendices'
    ]
  },


  // Technology Governance
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'technology-governance',
    fileNames: {
      en: 'technology-governance-executive-summary-en',
      sv: 'technology-governance-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'technology-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'technology-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Technology Governance - Executive Summary for the Skeptic',
      sv: 'Teknikstyrning - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'technology-governance-framework',
    category: 'technology-governance',
    fileNames: {
      en: 'Technology-Governance-Framework',
      sv: 'Technology-Governance-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'technology-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'technology-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Technology Governance Framework',
      sv: 'Ramverk för teknikstyrning'
    },
    sections: [
      'index',
      'principles',
      'position',
      'gtc',
      'trrt',
      'oversight',
      'indigenous',
      'mechanisms',
      'economy',
      'roadmap',
      'tools',
      'emerging',
      'evaluation',
      'case-studies',
      'international',
      'glossary',
      'references',
      'contributing',
      'playbook',
      'trrt-detailed',
      'starter-kit-detailed',
      'circuit-breaker',
      'crisis-unit',
      'international-detailed',
      'implementation-strategy',
      'documentation',
      'philosophy'
    ]
  },

  // Disaster Risk Reduction & Resilience Framework
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'disaster-risk-reduction',
    fileNames: {
      en: 'disaster-risk-reduction-executive-summary-en',
      sv: 'disaster-risk-reduction-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'disaster-risk-reduction'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'disaster-risk-reduction')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Disaster Risk Reduction & Resilience Framework - Executive Summary for the Skeptic',
      sv: 'Ramverk för katastrofriskreducering & resiliens - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'disaster-risk-reduction-framework',
    category: 'disaster-risk-reduction',
    fileNames: {
      en: 'Disaster-Risk-Reduction-Framework',
      sv: 'Disaster-Risk-Reduction-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'disaster-risk-reduction'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'disaster-risk-reduction')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Disaster Risk Reduction & Resilience',
      sv: 'Ramverk för katastrofriskreducering & resiliens'
    },
    sections: [
      'index',
      'introduction-context',
      'guiding-principles',
      'integration-architecture',
      'framework-components',
      'three-pillars',
      'global-resilience-pool',
      'community-resilience-score',
      'tek-integration',
      'crisis-recovery-cycle',
      'success-metrics',
      'implementation-phases',
      'taking-action',
      'appendices'
    ]
  },

  // Mobility Commons Framework
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'mobility-commons',
    fileNames: {
      en: 'mobility-commons-executive-summary-en',
      sv: 'mobility-commons-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mobility-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mobility-commons')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Mobility Commons - Executive Summary for the Skeptic',
      sv: 'Mobilitetsallmänningen - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'mobility-commons-framework',
    category: 'mobility-commons',
    fileNames: {
      en: 'Mobility-Commons-Framework',
      sv: 'Mobility-Commons-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mobility-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mobility-commons')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Mobility Commons',
      sv: 'Mobilitetsallmänningen'
    },
    sections: [
      'index',
      'introduction-vision',
      'foundational-principles',
      'integration-architecture',
      'four-pillars',
      'implementation-phases',
      'bioregional-integration',
      'technology-innovation',
      'climate-resilience',
      'justice-equity',
      'success-metrics',
      'faq',
      'taking-action',
      'appendices'
    ]
  },

  // Sundown Protocol
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'sundown-protocol',
    fileNames: {
      en: 'sundown-protocol-executive-summary-en',
      sv: 'sundown-protocol-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'sundown-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'sundown-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Sundown Protocol - Executive Summary for the Skeptic',
      sv: 'Sundown-protokollet - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'sundown-protocol-framework',
    category: 'sundown-protocol',
    fileNames: {
      en: 'Sundown-Protocol-Framework',
      sv: 'Sundown-Protocol-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'sundown-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'sundown-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Sundown Protocol',
      sv: 'Sundown-protokollet'
    },
    sections: [
      'index',
      'introduction-vision',
      'foundational-principles',
      'integration-architecture',
      'historical-grounding',
      'strategic-resilience',
      'economic-modeling',
      'stakeholder-integration',
      'implementation-phases',
      'core-components',
      'justice-reparations',
      'success-metrics',
      'faq',
      'taking-action',
      'appendices'
    ]
  },

  // Kinship Garden Framework
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'kinship-garden',
    fileNames: {
      en: 'kinship-garden-framework-executive-summary-en',
      sv: 'kinship-garden-framework-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'kinship-garden'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'kinship-garden')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Kinship Garden Framework - Executive Summary for the Skeptic',
      sv: 'Kinship Garden-ramverket - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'kinship-garden-framework',
    category: 'kinship-garden',
    fileNames: {
      en: 'Kinship-Garden-Framework',
      sv: 'Kinship-Garden-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'kinship-garden'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'kinship-garden')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Kinship Garden Framework',
      sv: 'Kinship Garden-ramverket'
    },
    sections: [
      'index',
      'introduction-vision',
      'foundational-principles',
      'integration-architecture',
      'theory-of-change',
      'strategic-objectives',
      'three-pillars',
      'implementation-mechanisms',
      'regional-customization',
      'stakeholder-engagement',
      'risk-management',
      'success-metrics',
      'timeline-milestones',
      'taking-action',
      'appendices'
    ]
  },


  // Living Land Protocol
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'living-land-protocol',
    fileNames: {
      en: 'living-land-protocol-executive-summary-en',
      sv: 'living-land-protocol-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'living-land-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'living-land-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Living Land Protocol - Executive Summary for the Skeptic',
      sv: 'Living Land-protokollet - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'living-land-protocol-framework',
    category: 'living-land-protocol',
    fileNames: {
      en: 'Living-Land-Protocol-Framework',
      sv: 'Living-Land-Protocol-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'living-land-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'living-land-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Living Land Protocol',
      sv: 'Living Land-protokollet'
    },
    sections: [
      'index',
      'introduction',
      'theory-of-change',
      'core-principles',
      'framework-architecture',
      'critical-path-dependencies',
      'baz-led-rural-council',
      'regenerative-rural-economy', 
      'rural-observatory-technology',
      'meta-coordination',
      'implementation-roadmap',
      'framework-integration',
      'risk-management',
      'success-metrics',
      'getting-involved',
      'glossary',
      'appendices'
    ]
  },

  // Hearthstone Protocol
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'hearthstone-protocol',
    fileNames: {
      en: 'hearthstone-protocol-executive-summary-en',
      sv: 'hearthstone-protocol-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'hearthstone-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'hearthstone-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Hearthstone Protocol - Executive Summary for the Skeptic',
      sv: 'Hearthstone-protokollet - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'hearthstone-protocol-framework',
    category: 'hearthstone-protocol',
    fileNames: {
      en: 'Hearthstone-Protocol-Framework',
      sv: 'Hearthstone-Protocol-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'hearthstone-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'hearthstone-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Hearthstone Protocol',
      sv: 'Hearthstone-protokollet'
    },
    sections: [
      'index',
      'introduction',
      'theory-of-change',
      'core-principles',
      'commons-architecture',
      'asset-transition-pathways',
      'legal-cultural-framework',
      'economic-integration',
      'implementation-strategy',
      'framework-integration',
      'risk-mitigation',
      'advocacy-action',
      'glossary',
      'appendices'
    ]
  },

  // Synoptic Protocol
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'synoptic-protocol',
    fileNames: {
      en: 'synoptic-protocol-executive-summary-en',
      sv: 'synoptic-protocol-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'synoptic-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'synoptic-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Synoptic Protocol - Executive Summary for the Skeptic',
      sv: 'Det synoptiska protokollet - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'synoptic-protocol-framework',
    category: 'synoptic-protocol',
    fileNames: {
      en: 'Synoptic-Protocol-Framework',
      sv: 'Synoptic-Protocol-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'synoptic-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'synoptic-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Synoptic Protocol',
      sv: 'Det synoptiska protokollet'
    },
    sections: [
      'index',
      'introduction',
      'epistemic-crisis',
      'foundational-principles',
      'six-pillars',
      'implementation-governance',
      'framework-integration',
      'risk-mitigation',
      'advocacy-action',
      'glossary',
      'appendices'
    ]
  },

  // Conduit Protocol
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'conduit-protocol',
    fileNames: {
      en: 'conduit-protocol-executive-summary-en',
      sv: 'conduit-protocol-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'conduit-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'conduit-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Conduit Protocol - Executive Summary for the Skeptic',
      sv: 'Conduit-protokollet - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'conduit-protocol-framework',
    category: 'conduit-protocol',
    fileNames: {
      en: 'Conduit-Protocol-Framework',
      sv: 'Conduit-Protocol-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'conduit-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'conduit-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Conduit Protocol',
      sv: 'Conduit-protokollet'
    },
    sections: [
      'index',
      'introduction',
      'theory-of-change',
      'core-principles',
      'infrastructure-commons',
      'key-mechanisms',
      'just-transition',
      'implementation-pathways',
      'framework-integration',
      'technical-specifications',
      'advocacy-action',
      'glossary',
      'appendices'
    ]
  },

  // Aegis Protocol
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'aegis-protocol',
    fileNames: {
      en: 'aegis-protocol-executive-summary-en',
      sv: 'aegis-protocol-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aegis-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aegis-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Aegis Protocol - Executive Summary for the Skeptic',
      sv: 'Aegisprotokollet - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'aegis-protocol-framework',
    category: 'aegis-protocol',
    fileNames: {
      en: 'Aegis-Protocol-Framework',
      sv: 'Aegis-Protocol-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aegis-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aegis-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Aegis Protocol',
      sv: 'Aegisprotokollet'
    },
    sections: [
      'index',
      'introduction-vision',
      'foundational-principles',
      'integration-architecture',
      'historical-grounding',
      'strategic-resilience',
      'economic-modeling',
      'non-state-integration',
      'implementation-phases',
      'three-pillars',
      'root-causes',
      'success-metrics',
      'faq',
      'taking-action',
      'strategic-briefing-for-the-russian-federation',
      'the-china-engagement-strategy',
      'the-european-ally-briefing',
      'the-global-south-partnership-proposal',
      'appendices'
    ]
  },

  // Shield Protocol
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'shield-protocol',
    fileNames: {
      en: 'shield-protocol-executive-summary-en',
      sv: 'shield-protocol-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'shield-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'shield-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Shield Protocol - Executive Summary for the Skeptic',
      sv: 'Sköldprotokollet - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'shield-protocol-framework',
    category: 'shield-protocol',
    fileNames: {
      en: 'Shield-Protocol-Framework',
      sv: 'Shield-Protocol-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'shield-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'shield-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Shield Protocol',
      sv: 'Sköldprotokollet'
    },
    sections: [
      'index',
      'introduction',
      'core-principles',
      'governance-architecture',
      'operational-systems',
      'crisis-response',
      'implementation-roadmap',
      'cross-cutting-mechanisms',
      'funding-mechanisms',
      'framework-integration',
      'case-studies',
      'getting-started',
      'conclusion',
      'appendices'
    ]
  },

  // Deep Time Governance
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'deep-time-governance',
    fileNames: {
      en: 'deep-time-governance-executive-summary-en',
      sv: 'deep-time-governance-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'deep-time-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'deep-time-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Deep Time Governance - Executive Summary for the Skeptic',
      sv: 'Djup tidsstyrning - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'deep-time-governance-framework',
    category: 'deep-time-governance',
    fileNames: {
      en: 'Deep-Time-Governance-Framework',
      sv: 'Deep-Time-Governance-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'deep-time-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'deep-time-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Deep Time Governance',
      sv: 'Djup tidsstyrning'
    },
    sections: [
      'index',
      'introduction-vision',
      'framework-position',
      'five-domains',
      'core-principles',
      'institutional-architecture',
      'implementation-pathways',
      'philosophical-foundations',
      'technical-specifications',
      'case-studies',
      'faq'
    ]
  },

  // Bioregional Polis
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'bioregional-polis',
    fileNames: {
      en: 'bioregional-polis-executive-summary-en',
      sv: 'bioregional-polis-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'bioregional-polis'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'bioregional-polis')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Bioregional Polis - Executive Summary for the Skeptic',
      sv: 'Den bioregionala staden - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'bioregional-polis-framework',
    category: 'bioregional-polis',
    fileNames: {
      en: 'Bioregional-Polis-Framework',
      sv: 'Bioregional-Polis-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'bioregional-polis'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'bioregional-polis')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Bioregional Polis',
      sv: 'Den bioregionala staden'
    },
    sections: [
      'index',
      'introduction-vision',
      'framework-foundations',
      'five-dimensions',
      'indigenous-governance',
      'integration-architecture',
      'implementation-pathways',
      'success-stories',
      'thrivability-scorecard',
      'getting-started',
      'resources-tools'
    ]
  },

  // Kinship Protocol
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'kinship-protocol',
    fileNames: {
      en: 'kinship-protocol-executive-summary-en',
      sv: 'kinship-protocol-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'kinship-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'kinship-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Kinship Protocol - Executive Summary for the Skeptic',
      sv: 'Kinship-protokollet - Sammanfattning för skeptiker'
    }
  },

  // Full framework
  {
    name: 'kinship-protocol-framework',
    category: 'kinship-protocol',
    fileNames: {
      en: 'Kinship-Protocol-Framework',
      sv: 'Kinship-Protocol-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'kinship-protocol'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'kinship-protocol')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Kinship Protocol',
      sv: 'Kinship-protokollet'
    },
    sections: [
      'index',
      'introduction-vision',
      'core-principles',
      'integration-architecture',
      'functional-pillars',
      'implementation-roadmap',
      'success-metrics',
      'global-south-leadership',
      'cultural-transformation',
      'economic-justice',
      'digital-rights',
      'crisis-response',
      'kinship-festival',
      'faq',
      'taking-action',
      'appendices'
    ]
  },

  // Regenerative Enterprise
  {
    name: 'a-compass-for-changemakers',
    category: 'regenerative-enterprise',
    fileNames: {
      en: 'regenerative-enterprise-a-compass-for-changemakers-en',
      sv: 'regenerative-enterprise-a-compass-for-changemakers-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'regenerative-enterprise'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'regenerative-enterprise')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Regenerative Enterprise - A Compass for Changemakers',
      sv: 'Regenerativa företag - En kompass för förändringsskapare'
    }
  },

  // Full framework
  {
    name: 'regenerative-enterprise-framework',
    category: 'regenerative-enterprise',
    fileNames: {
      en: 'Regenerative-Enterprise-Framework',
      sv: 'Regenerative-Enterprise-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'regenerative-enterprise'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'regenerative-enterprise')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Regenerative Enterprise Framework',
      sv: 'Ramverk för regenerativa företag'
    },
    sections: [
      'foreword',
      'ways-to-begin-the-journey',
      'the-case-for-regeneration',
      'the-core-principles',
      'module-0',
      'module-1', 
      'module-2',
      'module-3',
      'module-4',
      'module-5',
      'beginning-the-journey',
      'deepening-the-practice',
      'a-commitment',
      'weaving-with-the-wider-ecosystem',
      'tools',
      'keeping-the-framework-alive',
      'appendices'
    ]
  },
  // Institutional Regeneration
  {
    name: 'institutional-regeneration-executive-summary',
    category: 'institutional-regeneration',
    fileNames: {
      en: 'institutional-regeneration-executive-summary-en',
      sv: 'institutional-regeneration-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'institutional-regeneration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'institutional-regeneration')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Institutional Regeneration - Executive Summary',
      sv: 'Institutionell förnyelse - Sammanfattning'
    }
  },
  {
    name: 'regeneration-compact',
    category: 'institutional-regeneration',
    fileNames: {
      en: 'institutional-regeneration-compact-en',
      sv: 'institutional-regeneration-compact-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'institutional-regeneration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'institutional-regeneration')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Institutional Regeneration - Regeneration Compact',
      sv: 'Institutionell förnyelse - Förnyelsepakt'
    }
  },

  // Seed Track (MVP)
  {
    name: 'moral-operating-system-framework',
    category: 'institutional-regeneration',
    fileNames: {
      en: 'institutional-regeneration-seed-track-mvp-en',
      sv: 'institutional-regeneration-seed-track-mvp-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'institutional-regeneration', 'seed-track-mvp'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'institutional-regeneration', 'seed-track-mvp')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Institutional Regeneration - Seed Track (MVP)',
      sv: 'Institutionell förnyelse - Fröspåret (MVP)'
    },
    sections: [
     'introduction',
     'module-1',
     'module-2',
     'module-3',
     'next-steps'
    ]
  },

  // Regenerative Educational Systems Framework
  // Full framework combined PDF
  {
    name: 'eductional-systems',
    category: 'educational-systems',
    fileNames: {
      en: 'Educational-Systems',
      sv: 'Educational-Systems'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Education Framework',
      sv: 'Utbildningsramverk'
    },
    // Special config for full framework
    sections: [
      'index',
      '01-preamble',
      '02-vision-principles',
      '03-structural-components',
      '04-implementation-strategies',
      '05-monitoring-evaluation',
      '06-sdg-alignment',
      '07-visual-multimedia',
      '08-case-models',
      '09-future-potential',
      '10-appendices',
    ]
  },
  // Guides
  {
    name: 'quick-start',
    category: 'educational-systems',
    fileNames: {
      en: 'education-framework-lite',
      sv: 'education-framework-lite-swedish'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems')
    },
    pageFooter: {
      en: 'Education Framework Lite Guide - Page ',
      sv: 'Utbildningsramverk Lite Guide - Sida '
    }
  },
  // Tools
  {
    name: 'pilot-readiness-self-assessment-tool',
    category: 'educational-systems',
    fileNames: {
      en: 'pilot-readiness-self-assessment-tool-en',
      sv: 'pilot-readiness-self-assessment-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'appendix-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'appendix-tools')
    },
    pageFooter: {
      en: 'Pilot Readiness Self-Assessment Tool - Page ',
      sv: 'Självbedömningsverktyg för pilotberedskap - Sida '
    }
  },
  {
    name: 'youth-council-charter',
    category: 'educational-systems',
    fileNames: {
      en: 'youth-council-charter-en',
      sv: 'youth-council-charter-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'appendix-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'appendix-tools')
    },
    pageFooter: {
      en: 'Youth Council Charter Template - Page ',
      sv: 'Mall för ungdomsrådsstadga - Sida '
    }
  },
  {
    name: 'regenerative-project-guide',
    category: 'educational-systems',
    fileNames: {
      en: 'regenerative-project-guide-en',
      sv: 'regenerative-project-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'appendix-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'appendix-tools')
    },
    pageFooter: {
      en: 'Regenerative Project Guide - Page ',
      sv: 'Guide för regenerativa projekt - Sida '
    }
  },
  {
    name: 'curriculum-mapping-template',
    category: 'educational-systems',
    fileNames: {
      en: 'curriculum-mapping-template-en',
      sv: 'curriculum-mapping-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation',  'educational-systems', 'appendix-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'appendix-tools')
    },
    pageFooter: {
      en: 'Curriculum Mapping Template - Page ',
      sv: 'Mall för läroplansanpassning - Sida '
    }
  },
  {
    name: 'mne-rubric-template',
    category: 'educational-systems',
    fileNames: {
      en: 'mne-rubric-template-en',
      sv: 'mne-rubric-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'appendix-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'appendix-tools')
    },
    pageFooter: {
      en: 'M&E Rubric Template - Page ',
      sv: 'M&E-bedömningsmatris mall - Sida '
    }
  },
  {
    name: 'advocacy-playbook',
    category: 'educational-systems',
    fileNames: {
      en: 'advocacy-playbook-en',
      sv: 'advocacy-playbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'appendix-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'appendix-tools')
    },
    pageFooter: {
      en: 'Advocacy Playbook - Page ',
      sv: 'Opinionsbildningshandbok - Sida '
    }
  },
  {
    name: 'bureaucratic-navigation-toolkit',
    category: 'educational-systems',
    fileNames: {
      en: 'bureaucratic-navigation-toolkit-en',
      sv: 'bureaucratic-navigation-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'appendix-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'appendix-tools')
    },
    pageFooter: {
      en: 'Bureaucratic Navigation Toolkit - Page ',
      sv: 'Verktygslåda för byråkratisk navigation - Sida '
    }
  },
  {
    name: 'cost-benefit-analysis-model',
    category: 'educational-systems',
    fileNames: {
      en: 'cost-benefit-analysis-model-en',
      sv: 'cost-benefit-analysis-model-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'appendix-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'appendix-tools')
    },
    pageFooter: {
      en: 'Cost-Benefit Analysis Model - Page ',
      sv: 'Kostnad-nytta-analysmodell - Sida '
    }
  },
  {
    name: 'financial-pathway-assessment',
    category: 'educational-systems',
    fileNames: {
      en: 'financial-pathway-assessment-en',
      sv: 'financial-pathway-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'appendix-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'appendix-tools')
    },
    pageFooter: {
      en: 'Financial Pathway Assessment Tool - Page ',
      sv: 'Verktyg för bedömning av ekonomisk utveckling - Sida '
    }
  },
  {
    name: 'equity-training-inclusion-checklist',
    category: 'educational-systems',
    fileNames: {
      en: 'equity-training-inclusion-checklist-en',
      sv: 'equity-training-inclusion-checklist-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'seed-kit')
    },
    pageFooter: {
      en: 'Equity Training Inclusion Checklist - Page ',
      sv: 'Checklista för inkludering av jämlikhetsutbildning - Sida '
    }
  },
  {
    name: 'getting-started-guide',
    category: 'educational-systems',
    fileNames: {
      en: 'getting-started-guide-en',
      sv: 'getting-started-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'seed-kit')
    },
    pageFooter: {
      en: 'Getting Started Guide - Page ',
      sv: 'Kom-igång guide - Sida '
    }
  },
  {
    name: 'spiral-dynamics-intro-educators',
    category: 'educational-systems',
    fileNames: {
      en: 'spiral-dynamics-intro-educators-en',
      sv: 'spiral-dynamics-intro-educators-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'seed-kit')
    },
    pageFooter: {
      en: 'Spiral Dynamics Intro for Educators - Page ',
      sv: 'Spiral Dynamics intro för utbildare - Sida '
    }
  },
  {
    name: 'systems-thinking-module',
    category: 'educational-systems',
    fileNames: {
      en: 'systems-thinking-module-en',
      sv: 'systems-thinking-module-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'educational-systems', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'educational-systems', 'seed-kit')
    },
    pageFooter: {
      en: 'Systems Thinking Module - Page ',
      sv: 'Systemtänkande modul - Sida '
    }
  },
  {
    name: 'climate-energy-action-guide',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'climate-energy-action-guide-en',
      sv: 'climate-energy-action-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance')
    },
    pageFooter: {
      en: 'Climate Action Guide - Page ',
      sv: 'Klimataktionsguide - Sida '
    }
  },
  {
    name: 'climate-energy-stakeholder-guide',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'climate-energy-stakeholder-guide-en',
      sv: 'climate-energy-stakeholder-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance')
    },
    pageFooter: {
      en: 'Stakeholder Implementation Guide for the Climate & Energy Governance Framework - Page ',
      sv: 'Implementeringsguide för intressenter inom ramen för klimat- och energistyrning - Sida '
    }
  },
  {
    name: 'climate-energy-technical-guide',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'climate-energy-technical-guide-en',
      sv: 'climate-energy-technical-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Technical Guide for Policymakers and Officials: Climate & Energy Governance Framework - Page ',
      sv: 'Teknisk guide för beslutsfattare och tjänstemän: Ramverk för klimat- och energistyrning - Sida '
    }
  },
  {
    name: 'adaptation-planning-framework',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'adaptation-planning-framework-en',
      sv: 'adaptation-planning-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Adaptation Planning Framework - Page ',
      sv: 'Ramverk för anpassningsplanering - Sida '
    }
  },
  {
    name: 'carbon-pricing-guide',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'carbon-pricing-guide-en',
      sv: 'carbon-pricing-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Carbon Pricing Implementation Guide - Page ',
      sv: 'Implementeringsguide för koldioxidprissättning - Sida '
    }
  },
  {
    name: 'energy-transition-roadmap',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'energy-transition-roadmap-en',
      sv: 'energy-transition-roadmap-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Energy Transition Roadmap Template - Page ',
      sv: 'Mall för färdplan för energiomställning - Sida '
    }
  },
  {
    name: 'finance-access-navigator',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'finance-access-navigator-en',
      sv: 'finance-access-navigator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Climate Finance Access Navigator - Page ',
      sv: 'Klimatfinansieringsåtkomstnavigator - Sida '
    }
  },
  {
    name: 'governance-communication-toolkit',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'governance-communication-toolkit-en',
      sv: 'governance-communication-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Governance Communication Toolkit - Page ',
      sv: 'Verktygslåda för styrningskommunikation - Sida '
    }
  },
  {
    name: 'governance-coordination-guide',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'governance-coordination-guide-en',
      sv: 'governance-coordination-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Multi-level Governance Coordination Guide - Page ',
      sv: 'Guide för samordning av flernivåstyrning - Sida '
    }
  },
  {
    name: 'governance-readiness-assessment',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'governance-readiness-assessment-en',
      sv: 'governance-readiness-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Governance Readiness Assessment Tool - Page ',
      sv: 'Verktyg för bedömning av styrningsberedskap - Sida '
    }
  },
  {
    name: 'innovation-acceleration-kit',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'innovation-acceleration-kit-en',
      sv: 'innovation-acceleration-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Climate Innovation Acceleration Kit - Page ',
      sv: 'Accelerationspaket för klimatinnovation - Sida '
    }
  },
  {
    name: 'institutional-reform-guide',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'institutional-reform-guide-en',
      sv: 'institutional-reform-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Climate Institutional Reform Guide - Page ',
      sv: 'Guide till klimatinstitutionell reform - Sida '
    }
  },
  {
    name: 'just-transition-planning-template',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'just-transition-planning-template-en',
      sv: 'just-transition-planning-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Just Transition Planning Template - Page ',
      sv: 'Mall för planering av en rättvis övergång - Sida '
    }
  },
  {
    name: 'nature-based-solutions-tool',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'nature-based-solutions-tool-en',
      sv: 'nature-based-solutions-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Nature-based Solutions Assessment Tool - Page ',
      sv: 'Utvärderingsverktyg för naturbaserade lösningar - Sida '
    }
  },
  {
    name: 'policy-brief-templates',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'policy-brief-templates-en',
      sv: 'policy-brief-templates-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Climate Policy Brief Templates - Page ',
      sv: 'Mallar för klimatpolicyöversikter - Sida '
    }
  },
  {
    name: 'policy-integration-matrix',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'policy-integration-matrix-en',
      sv: 'policy-integration-matrix-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Climate-Energy Policy Integration Matrix - Page ',
      sv: 'Integrationsmatris för klimat- och energipolitik - Sida '
    }
  },
  {
    name: 'stakeholder-engagement-protocol',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'stakeholder-engagement-protocol-en',
      sv: 'stakeholder-engagement-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'tools')
    },
    pageFooter: {
      en: 'Stakeholder Engagement Protocol - Page ',
      sv: 'Protokoll för intressentengagemang - Sida '
    }
  },
  {
    name: 'background-context-document',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'background-context-document-en',
      sv: 'background-context-document-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'seed-kit')
    },
    pageFooter: {
      en: 'Background/Context Document: Climate & Energy Governance Implementation Framework - Page ',
      sv: 'Bakgrunds-/kontextdokument: Ramverk för implementering av klimat- och energistyrning - Sida '
    }
  },
  {
    name: 'case-studies-or-examples',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'case-studies-or-examples-en',
      sv: 'case-studies-or-examples-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'seed-kit')
    },
    pageFooter: {
      en: 'Case Studies or Examples: Climate & Energy Governance Implementation Framework - Page ',
      sv: 'Fallstudier eller exempel: Ramverk för implementering av klimat- och energistyrning - Sida '
    }
  },
  {
    name: 'evaluation-or-monitoring-framework',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'evaluation-or-monitoring-framework-en',
      sv: 'evaluation-or-monitoring-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'seed-kit')
    },
    pageFooter: {
      en: 'Evaluation or Monitoring Framework - Page ',
      sv: 'Utvärderings- eller övervakningsramverk - Sida '
    }
  },
  {
    name: 'getting-started-guide',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'getting-started-guide-en',
      sv: 'getting-started-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'seed-kit')
    },
    pageFooter: {
      en: 'Climate Governance Seed Kit Getting Started Guide - Page ',
      sv: 'Guide för att komma igång med klimatstyrningsfröpaket - Sida '
    }
  },
  {
    name: 'regional-hub-connection-guide',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'regional-hub-connection-guide-en',
      sv: 'regional-hub-connection-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance', 'seed-kit')
    },
    pageFooter: {
      en: 'Regional Hub Connection Guide - Page ',
      sv: 'Guide för regionala knutpunkter - Sida '
    }
  },
  // Full Climate & Energy Framework
  {
    name: 'climate-energy-framework',
    category: 'climate-and-energy-governance',
    fileNames: {
      en: 'Climate-Energy-Governance',
      sv: 'Climate-Energy-Governance'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'climate-and-energy-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'climate-and-energy-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Climate & Energy Governance Framework',
      sv: 'Ramverk för klimat- och energistyrning'
    },
    // Special config for full framework
    sections: [
      'index',
      '01-introduction',
      '02-guiding-principles',
      '03-governance-structure',
      '04-core-pillars',
      '05-policy-mechanisms',
      '06-stakeholder-engagement',
      '07-financing-the-framework',
      '08-implementation-roadmap',
      '09-metrics-for-success',
      '10-challenges-and-solutions',
      '11-implementation-tools',
      '12-conclusion',
      'appendix-a',
      'appendix-b'
    ]
  },

  {
    name: 'technical-guide-policymakers',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'technical-guide-policymakers-en',
      sv: 'technical-guide-policymakers-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution')
    },
    pageFooter: {
      en: 'Technical Guide for Policymakers and Mediators - Page ',
      sv: 'Teknisk guide för beslutsfattare och medlare - Sida '
    }
  },
  {
    name: 'community-peace-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'community-peace-guide-en',
      sv: 'community-peace-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution')
    },
    pageFooter: {
      en: 'Community Peace Implementation Guide - Page ',
      sv: 'Guide till implementering av fred i samhället - Sida '
    }
  },
  {
    name: 'youth-peace-action-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'youth-peace-action-guide-en',
      sv: 'youth-peace-action-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution')
    },
    pageFooter: {
      en: 'Youth Peace Action Guide - Page ',
      sv: 'Ungdomsfredsguide - Sida '
    }
  },
  {
    name: 'indigenous-partnership-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'indigenous-partnership-guide-en',
      sv: 'indigenous-partnership-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution')
    },
    pageFooter: {
      en: 'Indigenous Partnership Guide for Non-Indigenous Peace Practitioners - Page ',
      sv: 'Guide till partnerskap med ursprungsbefolkningar för fredsutövare som inte är ursprungsbefolkningar - Sida '
    }
  },
  {
    name: 'meta-governance-coordination-primer',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'meta-governance-coordination-primer-en',
      sv: 'meta-governance-coordination-primer-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution')
    },
    pageFooter: {
      en: 'Meta-Governance Coordination Primer for Peace Organizations - Page ',
      sv: 'Metastyrningskoordineringsgrundbok för fredsorganisationer - Sida '
    }
  },
  // Full Peace & Conflict Resolution Framework
  {
    name: 'peace-framework',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'Peace-Conflict-Resolution',
      sv: 'Peace-Conflict-Resolution'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Peace & Conflict Resolution Framework',
      sv: 'Ramverk för fred & konfliktlösning'
    },
    // Special config for full framework
    sections: [
      'index',
      'preamble',
      'framework-overview',
      'theoretical-foundation',
      'governance-architecture',
      'prevention-early-warning',
      'active-conflict-resolution',
      'post-conflict-transformation',
      'scale-specific-applications',
      'ggf-integration',
      'technology-tools',
      'training-professional-development',
      'cultural-adaptation-decolonization',
      'implementation-roadmap',
      'measurement-evaluation',
      'risk-management',
      'resources-sustainability',
      'conclusion',
      'implementation-tools'
    ]
  },
  {
    name: 'ethics-framework-standard',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'Global-Ethics-Rights',
      sv: 'Global-Ethics-Rights'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'standard'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'standard')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Rights of Beings Standard',
      sv: 'Rättigheter för Varelser Standard'
    },
    // Full framework combined sections in proper order
    sections: [
      '0-preamble',
      '1-introduction',
      '2-foundational-values',
      '2.3-global-ethical-traditions',
      '2.5-rights-of-beings',
      '2.6-scientific-foundations',
      '3-commitments',
      '3.1-traditional-rights',
      '3.2-emerging-rights',
      '3.2.1-ai-consciousness',
      '3.2.1a-assessment-hub-network',
      '3.2.1b-scientific-standards',
      '3.2.2-ambiguous-entities',
      '3.2.3-measurement-standards',
      '3.2.4-recognition-pathways',
      '3.2.5-non-western-recognition',
      '3.3-conflict-resolution',
      '3.3.1-moon-wish-test',
      '4-governance-mechanisms',
      '4.1-transparency',
      '4.2-inclusive-decision-making',
      '4.3-conflict-resolution',
      '4.4-guardianship-councils',
      '4.4.1-enforcement-mechanisms',
      '4.4.2-non-compliance-strategy',
      '4.5-funding-model',
      '4.5.1-hub-sustainability',
      '4.5.2-resource-optimization',
      '4.6-governance-accountability',
      '4.7-entity-conflict-resolution',
      '4.8-interoperability',
      '4.9-decision-making',
      '4.10-coordination-mechanisms',
      '5-implementation',
      '5.1-quick-wins',
      '5.1.1-cost-analysis',
      '5.2-phased-rollout',
      '5.2.1-space-ethics',
      '5.3-education-accessibility',
      '5.3.1-resource-constraint',
      '5.3.2-cultural-accessibility',
      '5.3.3-knowledge-integration',
      '5.4-global-cooperation',
      '5.5-monitoring',
      '5.6-public-engagement',
      '5.7-stakeholder-strategy',
      '5.7.1-consensus-building',
      '5.7.2-resistant-stakeholder',
      '5.8-resistance-handling',
      '5.8.1-opposition-response',
      '5.8.2-learning-system',
      '5.9-benchmarks-metrics',
      '5.10-scenario-planning',
      '5.11-accessibility-matrix',
      '6-appendices',
      '6.1-emerging-rights-toolkit',
      '6.2-case-studies',
      '6.3-ethical-forecasting',
      '6.3.1-speculative-paradigm',
      '6.3.2-validation-protocols',
      '6.4-reporting-portal',
      '6.5-plain-language',
      '6.6-edge-case-protocols',
      '6.7-philosophy-of-rights',
      '6.8-spiral-aware-primer',
      '6.9-impact-assessment',
      '6.10-pioneer-pilots',
      '6.11-crisis-ethics',
      '6.12-technical-protocols'
    ]
  },
  {
    name: 'digital-peace-ethics-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'digital-peace-ethics-guide-en',
      sv: 'digital-peace-ethics-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution')
    },
    pageFooter: {
      en: 'Digital Peace Ethics Guide - Page ',
      sv: 'Digital fredsetisk guide - Sida '
    }
  },
  {
    name: 'conflict-analysis-framework',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'conflict-analysis-framework-en',
      sv: 'conflict-analysis-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Conflict Analysis Framework - Page ',
      sv: 'Ramverk för konfliktanalys - Sida '
    }
  },
  {
    name: 'peace-committee-charter',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'peace-committee-charter-en',
      sv: 'peace-committee-charter-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Local Peace Committee Charter Template - Page ',
      sv: 'Mall för stadgar för lokal fredskommitté - Sida '
    }
  },
  {
    name: 'multi-track-dialogue-protocol',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'multi-track-dialogue-protocol-en',
      sv: 'multi-track-dialogue-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Multi-Track Dialogue Protocol - Page ',
      sv: 'Protokoll för flerspårig dialog - Sida '
    }
  },
  {
    name: 'early-warning-design-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'early-warning-design-guide-en',
      sv: 'early-warning-design-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Early Warning System Design Guide - Page ',
      sv: 'Guide för design av tidiga varningssystem - Sida '
    }
  },
  {
    name: 'peace-tech-ethics-assessment',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'peace-tech-ethics-assessment-en',
      sv: 'peace-tech-ethics-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Peace-Technology Ethics Assessment - Page ',
      sv: 'Etisk bedömning av fredsteknologi - Sida '
    }
  },
  {
    name: 'value-system-mapping-template',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'value-system-mapping-template-en',
      sv: 'value-system-mapping-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Value System Mapping Template - Page ',
      sv: 'Mall för värdesystemkartläggning - Sida '
    }
  },
  // Context-Specific Implementation Guides
  {
    name: 'urban-conflict-toolkit',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'urban-conflict-toolkit-en',
      sv: 'urban-conflict-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Urban Conflict Mediation Toolkit - Page ',
      sv: 'Verktyg för medling av urbana konflikter - Sida '
    }
  },
  {
    name: 'resource-conflict-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'resource-conflict-guide-en',
      sv: 'resource-conflict-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Resource Conflict Transformation Guide - Page ',
      sv: 'Guide för omvandling av resurskonflikter - Sida '
    }
  },
  {
    name: 'reconciliation-framework',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'reconciliation-framework-en',
      sv: 'reconciliation-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Post-Conflict Reconciliation Framework - Page ',
      sv: 'Ramverk för försoning efter konflikt - Sida '
    }
  },
  {
    name: 'business-peace-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'business-peace-guide-en',
      sv: 'business-peace-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Private Sector Peace Engagement Guide - Page ',
      sv: 'Guide för privat sektors fredsengagemang - Sida '
    }
  },
  {
    name: 'protection-transition-manual',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'protection-transition-manual-en',
      sv: 'protection-transition-manual-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Military-Civilian Protection Transition Manual - Page ',
      sv: 'Manual för militär-civil skyddsövergång - Sida '
    }
  },

  // Advocacy & Scaling Tools
  {
    name: 'peace-advocacy-toolkit',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'peace-advocacy-toolkit-en',
      sv: 'peace-advocacy-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Peace Advocacy Campaign Toolkit - Page ',
      sv: 'Verktygslåda för fredsförespråkande kampanjer - Sida '
    }
  },
  {
    name: 'peace-financing-navigator',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'peace-financing-navigator-en',
      sv: 'peace-financing-navigator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Peace Financing Navigator - Page ',
      sv: 'Navigator för fredsfinansiering - Sida '
    }
  },
  {
    name: 'institutional-integration-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'institutional-integration-guide-en',
      sv: 'institutional-integration-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Institutional Peace Integration Guide - Page ',
      sv: 'Guide för institutionell fredsintegration - Sida '
    }
  },
  {
    name: 'media-peace-messaging-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'media-peace-messaging-guide-en',
      sv: 'media-peace-messaging-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Media Peace Messaging Guide - Page ',
      sv: 'Guide för mediefredsbudskap - Sida '
    }
  },

  // Low-Resource Funding Implementation Tools
  {
    name: 'community-peace-fund-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'community-peace-fund-guide-en',
      sv: 'community-peace-fund-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Community Peace Fund Establishment Guide - Page ',
      sv: 'Guide för upprättande av lokala fredsfonder - Sida '
    }
  },
  {
    name: 'peace-micro-grant-template',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'peace-micro-grant-template-en',
      sv: 'peace-micro-grant-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Peace Micro-Grant Template - Page ',
      sv: 'Mall för fredsmikrobidrag - Sida '
    }
  },
  {
    name: 'resource-mapping-tool',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'resource-mapping-tool-en',
      sv: 'resource-mapping-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Resource Mapping Tool - Page ',
      sv: 'Verktyg för resurskartläggning - Sida '
    }
  },
  {
    name: 'hybrid-funding-agreement',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'hybrid-funding-agreement-en',
      sv: 'hybrid-funding-agreement-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Hybrid Funding Agreement Template - Page ',
      sv: 'Mall för hybridfinansieringsavtal - Sida '
    }
  },
  {
    name: 'peace-fund-sustainability-calculator',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'peace-fund-sustainability-calculator-en',
      sv: 'peace-fund-sustainability-calculator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Peace Fund Sustainability Calculator - Page ',
      sv: 'Hållbarhetskalkylator för fredsfonder - Sida '
    }
  },

  // Traditional Peace Tools
  {
    name: 'islamic-mediation-protocol',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'islamic-mediation-protocol-en',
      sv: 'islamic-mediation-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Islamic-Informed Mediation Protocol - Page ',
      sv: 'Islamiskt informerat medlingsprotokoll - Sida '
    }
  },
  {
    name: 'confucian-dialogue-template',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'confucian-dialogue-template-en',
      sv: 'confucian-dialogue-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Confucian Harmony-Based Dialogue Template - Page ',
      sv: 'Mall för konfuciansk harmonibaserad dialog - Sida '
    }
  },
  {
    name: 'trauma-informed-toolkit',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'trauma-informed-toolkit-en',
      sv: 'trauma-informed-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Trauma-Informed Facilitation Toolkit - Page ',
      sv: 'Traumabaserad faciliteringsverktyg - Sida '
    }
  },
  {
    name: 'cross-cultural-integration-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'cross-cultural-integration-guide-en',
      sv: 'cross-cultural-integration-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Cross-Cultural Peace Tradition Integration Guide - Page ',
      sv: 'Guide för integrering av tvärkulturella fredstraditioner - Sida '
    }
  },
  {
    name: 'causal-loop-template',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'causal-loop-template-en',
      sv: 'causal-loop-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Causal Loop Diagramming Template - Page ',
      sv: 'Mall för kausal loopdiagram - Sida '
    }
  },
  {
    name: 'systemic-stakeholder-mapping',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'systemic-stakeholder-mapping-en',
      sv: 'systemic-stakeholder-mapping-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Systemic Stakeholder Mapping - Page ',
      sv: 'Systemisk intressentkartläggning - Sida '
    }
  },
  {
    name: 'system-boundary-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'system-boundary-guide-en',
      sv: 'system-boundary-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'System Boundary Definition Guide - Page ',
      sv: 'Guide för definition av systemgränser - Sida '
    }
  },
  {
    name: 'stock-flow-analysis',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'stock-flow-analysis-en',
      sv: 'stock-flow-analysis-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Stock and Flow Analysis Framework for Peace & Conflict Resolution - Page ',
      sv: 'Analysramverk för lager och flöden inom freds- och konfliktarbete - Sida '
    }
  },
  {
    name: 'conflict-iceberg-template',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'conflict-iceberg-template-en',
      sv: 'conflict-iceberg-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Conflict Iceberg Model Template - Page ',
      sv: 'Mall för konfliktisbergsmodell - Sida '
    }
  },
  {
    name: 'conflict-archetype-guide',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'conflict-archetype-guide-en',
      sv: 'conflict-archetype-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Conflict System Archetype Guide - Page ',
      sv: 'Guide till arketyper för konfliktsystem - Sida '
    }
  },
  {
    name: 'leverage-point-matrix',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'leverage-point-matrix-en',
      sv: 'leverage-point-matrix-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Leverage Point Identification Matrix - Page ',
      sv: 'Matris för identifiering av hävstångspunkter - Sida '
    }
  },
  {
    name: 'systems-scenario-planning',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'systems-scenario-planning-en',
      sv: 'systems-scenario-planning-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Systems-Based Scenario Planning - Page ',
      sv: 'Systembaserad scenarioplanering - Sida '
    }
  },
  {
    name: 'systemic-outcomes-harvesting',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'systemic-outcomes-harvesting-en',
      sv: 'systemic-outcomes-harvesting-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Systemic Outcomes Harvesting - Page ',
      sv: 'Systemisk utfallsuppsamling - Sida '
    }
  },
  {
    name: 'community-systems-mapping',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'community-systems-mapping-en',
      sv: 'community-systems-mapping-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Community Systems Mapping Guide - Page ',
      sv: 'Guide för kartläggning av samhällssystem - Sida '
    }
  },
  {
    name: 'organizational-systems-analysis',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'organizational-systems-analysis-en',
      sv: 'organizational-systems-analysis-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Organizational Systems Analysis Framework - Page ',
      sv: 'Ramverk för organisatorisk systemanalys - Sida '
    }
  },
  {
    name: 'policy-systems-assessment',
    category: 'peace-and-conflict-resolution',
    fileNames: {
      en: 'policy-systems-assessment-en',
      sv: 'policy-systems-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'peace-and-conflict-resolution', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'peace-and-conflict-resolution', 'tools')
    },
    pageFooter: {
      en: 'Peace Policy Systems Assessment Framework - Page ',
      sv: 'Ramverk för bedömning av fredspolitiska system - Sida '
    }
  },
  // Lite Guides
  {
    name: 'technical-guide',
    category: 'economic-integration',
    fileNames: {
      en: 'technical-guide-en',
      sv: 'technical-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration')
    },
    pageFooter: {
      en: 'Technical Guide for Policymakers - Page ',
      sv: 'Teknisk guide för beslutsfattare - Sida '
    }
  },
  {
    name: 'community-guide',
    category: 'economic-integration',
    fileNames: {
      en: 'community-guide-en',
      sv: 'community-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration')
    },
    pageFooter: {
      en: 'Community Economic Implementation Guide - Page ',
      sv: 'Samhällsguide för ekonomisk implementering - Sida '
    }
  },
  {
    name: 'youth-guide',
    category: 'economic-integration',
    fileNames: {
      en: 'youth-guide-en',
      sv: 'youth-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration')
    },
    pageFooter: {
      en: 'Youth Economic Action Guide - Page ',
      sv: 'Ekonomisk handlingsguide för ungdomar - Sida '
    }
  },
  {
    name: 'digital-ethics',
    category: 'economic-integration',
    fileNames: {
      en: 'digital-ethics-en',
      sv: 'digital-ethics-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration')
    },
    pageFooter: {
      en: 'Digital Economic Ethics Guide - Page ',
      sv: 'Digital ekonomietikguide - Sida '
    }
  },
  {
    name: 'indigenous-guide',
    category: 'economic-integration',
    fileNames: {
      en: 'indigenous-guide-en',
      sv: 'indigenous-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration')
    },
    pageFooter: {
      en: 'Indigenous Economic Stewardship Guide - Page ',
      sv: 'Urfolks ekonomiska förvaltningsguide - Sida '
    }
  },

  // Core Governance Tools
  {
    name: 'economic-analysis-framework',
    category: 'economic-integration',
    fileNames: {
      en: 'economic-analysis-framework-en',
      sv: 'economic-analysis-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Economic Analysis Framework - Page ',
      sv: 'Ramverk för ekonomisk analys - Sida '
    }
  },
  {
    name: 'currency-design-template',
    category: 'economic-integration',
    fileNames: {
      en: 'currency-design-template-en',
      sv: 'currency-design-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Community Currency Design Template - Page ',
      sv: 'Mall för design av lokalvaluta - Sida '
    }
  },
  {
    name: 'participatory-budgeting-protocol',
    category: 'economic-integration',
    fileNames: {
      en: 'participatory-budgeting-protocol-en',
      sv: 'participatory-budgeting-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Participatory Budgeting Protocol - Page ',
      sv: 'Protokoll för deltagarbudgetering - Sida '
    }
  },
  {
    name: 'ethical-trade-zone-charter',
    category: 'economic-integration',
    fileNames: {
      en: 'ethical-trade-zone-charter-en',
      sv: 'ethical-trade-zone-charter-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Ethical Trade Zone Charter - Page ',
      sv: 'Stadga för etisk handelszon - Sida '
    }
  },
  {
    name: 'aubi-implementation-guide',
    category: 'economic-integration',
    fileNames: {
      en: 'aubi-implementation-guide-en',
      sv: 'aubi-implementation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'AUBI Implementation Guide - Page ',
      sv: 'Implementeringsguide för AUBI - Sida '
    }
  },
  {
    name: 'commons-management-toolkit',
    category: 'economic-integration',
    fileNames: {
      en: 'commons-management-toolkit-en',
      sv: 'commons-management-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Commons Management Toolkit - Page ',
      sv: 'Verktygslåda för allmänningsförvaltning - Sida '
    }
  },

  // Context-Specific Implementation Guides
  {
    name: 'urban-economic-toolkit',
    category: 'economic-integration',
    fileNames: {
      en: 'urban-economic-toolkit-en',
      sv: 'urban-economic-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Urban Economic Integration Toolkit - Page ',
      sv: 'Verktygslåda för urban ekonomisk integration - Sida '
    }
  },
  {
    name: 'rural-cooperative-guide',
    category: 'economic-integration',
    fileNames: {
      en: 'rural-cooperative-guide-en',
      sv: 'rural-cooperative-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Rural Cooperative Development Guide - Page ',
      sv: 'Utvecklingsguide för landsbygdskooperativ - Sida '
    }
  },
  {
    name: 'bioregional-protocol',
    category: 'economic-integration',
    fileNames: {
      en: 'bioregional-protocol-en',
      sv: 'bioregional-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Bioregional Resource Sharing Protocol - Page ',
      sv: 'Protokoll för bioregional resursdelning - Sida '
    }
  },
  {
    name: 'global-commons-framework',
    category: 'economic-integration',
    fileNames: {
      en: 'global-commons-framework-en',
      sv: 'global-commons-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Global Commons Governance Framework - Page ',
      sv: 'Ramverk för global allmänningsstyrning - Sida '
    }
  },

  // Advocacy & Scaling Tools
  {
    name: 'economic-advocacy-toolkit',
    category: 'economic-integration',
    fileNames: {
      en: 'economic-advocacy-toolkit-en',
      sv: 'economic-advocacy-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Economic Advocacy Campaign Toolkit - Page ',
      sv: 'Verktygslåda för ekonomisk påverkanskampanj - Sida '
    }
  },
  {
    name: 'economic-financing-navigator',
    category: 'economic-integration',
    fileNames: {
      en: 'economic-financing-navigator-en',
      sv: 'economic-financing-navigator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Economic Financing Navigator - Page ',
      sv: 'Navigator för ekonomisk finansiering - Sida '
    }
  },
  {
    name: 'institutional-integration-guide',
    category: 'economic-integration',
    fileNames: {
      en: 'institutional-integration-guide-en',
      sv: 'institutional-integration-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Institutional Economic Integration Guide - Page ',
      sv: 'Guide för institutionell ekonomisk integration - Sida '
    }
  },
  {
    name: 'ppp-template',
    category: 'economic-integration',
    fileNames: {
      en: 'ppp-template-en',
      sv: 'ppp-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Public-Private Partnership Template - Page ',
      sv: 'Mall för offentlig-privat partnerskap - Sida '
    }
  },

  // Low-Resource Funding Tools
  {
    name: 'community-economic-fund-guide',
    category: 'economic-integration',
    fileNames: {
      en: 'community-economic-fund-guide-en',
      sv: 'community-economic-fund-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Community Economic Fund Guide - Page ',
      sv: 'Guide för samhällsekonomisk fond - Sida '
    }
  },
  {
    name: 'economic-micro-grant-template',
    category: 'economic-integration',
    fileNames: {
      en: 'economic-micro-grant-template-en',
      sv: 'economic-micro-grant-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Economic Micro-Grant Template - Page ',
      sv: 'Mall för ekonomiskt mikrobidrag - Sida '
    }
  },
  {
    name: 'resource-mapping-tool',
    category: 'economic-integration',
    fileNames: {
      en: 'resource-mapping-tool-en',
      sv: 'resource-mapping-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Resource Mapping Tool - Page ',
      sv: 'Verktyg för resurskartläggning - Sida '
    }
  },

  // Digital Tools
  {
    name: 'currency-simulator-app',
    category: 'economic-integration',
    fileNames: {
      en: 'currency-simulator-app-en',
      sv: 'currency-simulator-app-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Currency Simulator App - Page ',
      sv: 'Valutasimulatorapp - Sida '
    }
  },
  {
    name: 'nested-economic-health-dashboard',
    category: 'economic-integration',
    fileNames: {
      en: 'nested-economic-health-dashboard-en',
      sv: 'nested-economic-health-dashboard-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Nested Economic Health Index Dashboard - Page ',
      sv: 'Dashboard för nästlat ekonomiskt hälsoindex - Sida '
    }
  },
  {
    name: 'ai-chatbot-for-tool-navigation',
    category: 'economic-integration',
    fileNames: {
      en: 'ai-chatbot-for-tool-navigation-en',
      sv: 'ai-chatbot-for-tool-navigation-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'AI Chatbot for Tool Navigation - Page ',
      sv: 'AI-chatbot för verktygsnavigering - Sida '
    }
  },
  {
    name: 'real-time-collaboration-platform',
    category: 'economic-integration',
    fileNames: {
      en: 'real-time-collaboration-platform-en',
      sv: 'real-time-collaboration-platform-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Real-Time Collaboration Platform - Page ',
      sv: 'Realtidssamarbetsplattform - Sida '
    }
  },
  {
    name: 'sample-audit-report-template',
    category: 'economic-integration',
    fileNames: {
      en: 'sample-audit-report-template-en',
      sv: 'sample-audit-report-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'economic-integration', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'economic-integration', 'tools')
    },
    pageFooter: {
      en: 'Sample Audit Report Template - Page ',
      sv: 'Exempel på mall för revisionsrapport - Sida '
    }
  },
  // Digital Commons Framework - Main Guides
  {
    name: 'quick-start-guide',
    category: 'digital-commons',
    fileNames: {
      en: 'quick-start-guide-en',
      sv: 'quick-start-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Quick-Start Guide: Digital Commons Framework - Page ',
      sv: 'Snabbstartsguide: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'technical-guide',
    category: 'digital-commons',
    fileNames: {
      en: 'technical-guide-en',
      sv: 'technical-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Technical Guide for Policymakers: Digital Commons Framework - Page ',
      sv: 'Teknisk guide för beslutsfattare: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'community-guide',
    category: 'digital-commons',
    fileNames: {
      en: 'community-guide-en',
      sv: 'community-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Community Implementation Guide: Digital Commons Framework - Page ',
      sv: 'Samhällsguide för implementering: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'youth-guide',
    category: 'digital-commons',
    fileNames: {
      en: 'youth-guide-en',
      sv: 'youth-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Youth Engagement Guide: Digital Commons Framework - Page ',
      sv: 'Engagemangsguide för ungdomar: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'digital-ethics-guide',
    category: 'digital-commons',
    fileNames: {
      en: 'digital-ethics-guide-en',
      sv: 'digital-ethics-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Digital Ethics Guide: Digital Commons Framework - Page ',
      sv: 'Digital etikguide: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'indigenous-guide',
    category: 'digital-commons',
    fileNames: {
      en: 'indigenous-guide-en',
      sv: 'indigenous-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Indigenous Data Stewardship Guide: Digital Commons Framework - Page ',
      sv: 'Förvaltningsguide för urfolksdata: Digital Commons-ramverket - Sida '
    }
  },

  // Digital Commons Framework - Core Governance Tools
  {
    name: 'node-setup-guide',
    category: 'digital-commons',
    fileNames: {
      en: 'node-setup-guide-en',
      sv: 'node-setup-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'core-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'core-governance')
    },
    pageFooter: {
      en: 'Node Setup Guide: Digital Commons Framework - Page ',
      sv: 'Guide för nodinställning: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'governance-toolkit',
    category: 'digital-commons',
    fileNames: {
      en: 'governance-toolkit-en',
      sv: 'governance-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'core-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'core-governance')
    },
    pageFooter: {
      en: 'Governance Toolkit: Digital Commons Framework - Page ',
      sv: 'Verktygslåda för styrning: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'sms-voting-template',
    category: 'digital-commons',
    fileNames: {
      en: 'sms-voting-template-en',
      sv: 'sms-voting-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'core-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'core-governance')
    },
    pageFooter: {
      en: 'SMS Voting Template: Digital Commons Framework - Page ',
      sv: 'SMS röstmall: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'data-sovereignty-protocol',
    category: 'digital-commons',
    fileNames: {
      en: 'data-sovereignty-protocol-en',
      sv: 'data-sovereignty-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'core-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'core-governance')
    },
    pageFooter: {
      en: 'Data Sovereignty Protocol: Digital Commons Framework - Page ',
      sv: 'Datsuveränitetsprotokoll: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'ethical-ai-audit-checklist',
    category: 'digital-commons',
    fileNames: {
      en: 'ethical-ai-audit-checklist-en',
      sv: 'ethical-ai-audit-checklist-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'core-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'core-governance')
    },
    pageFooter: {
      en: 'Ethical AI Audit Checklist: Digital Commons Framework - Page ',
      sv: 'Etisk AI-granskningschecklista: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'glossary',
    category: 'digital-commons',
    fileNames: {
      en: 'glossary-en',
      sv: 'glossary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'core-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'core-governance')
    },
    pageFooter: {
      en: 'Commons Glossary: Digital Commons Framework - Page ',
      sv: 'Allmänningsordlista: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'failure-analysis-report-template',
    category: 'digital-commons',
    fileNames: {
      en: 'failure-analysis-report-template-en',
      sv: 'failure-analysis-report-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'core-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'core-governance')
    },
    pageFooter: {
      en: 'Failure Analysis Report Template: Digital Commons Framework - Page ',
      sv: 'Mall för felhändelsanalys: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'impact-assessment-template',
    category: 'digital-commons',
    fileNames: {
      en: 'impact-assessment-template-en',
      sv: 'impact-assessment-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'core-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'core-governance')
    },
    pageFooter: {
      en: 'Impact Assessment Template: Digital Commons Framework - Page ',
      sv: 'Mall för konsekvensanalys: Digital Commons-ramverket - Sida '
    }
  },

  // Digital Commons Framework - Context-Specific Implementation Guides
  {
    name: 'commons-in-practice-documentation',
    category: 'digital-commons',
    fileNames: {
      en: 'commons-in-practice-documentation-en',
      sv: 'commons-in-practice-documentation-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'context-specific'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'context-specific')
    },
    pageFooter: {
      en: 'Digital Commons in Practice Documentation - Page ',
      sv: 'Dokumentation om digitala allmänna villkor i praktiken - Sida '
    }
  },
  {
    name: 'rural-digital-commons-toolkit',
    category: 'digital-commons',
    fileNames: {
      en: 'rural-digital-commons-toolkit-en',
      sv: 'rural-digital-commons-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'context-specific'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'context-specific')
    },
    pageFooter: {
      en: 'Rural Digital Commons Toolkit: Digital Commons Framework - Page ',
      sv: 'Verktygslåda för landsortens digitala allmänningar: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'urban-digital-commons-guide',
    category: 'digital-commons',
    fileNames: {
      en: 'urban-digital-commons-guide-en',
      sv: 'urban-digital-commons-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'context-specific'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'context-specific')
    },
    pageFooter: {
      en: 'Urban Digital Commons Guide: Digital Commons Framework - Page ',
      sv: 'Guide för urbana digitala allmänningar: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'disaster-resilient-commons-protocol',
    category: 'digital-commons',
    fileNames: {
      en: 'disaster-resilient-commons-protocol-en',
      sv: 'disaster-resilient-commons-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'context-specific'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'context-specific')
    },
    pageFooter: {
      en: 'Disaster-Resilient Commons Protocol: Digital Commons Framework - Page ',
      sv: 'Katastrofmotståndskraftigt allmänningsprotokoll: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'global-commons-governance-framework',
    category: 'digital-commons',
    fileNames: {
      en: 'global-commons-governance-framework-en',
      sv: 'global-commons-governance-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'context-specific'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'context-specific')
    },
    pageFooter: {
      en: 'Global Commons Governance Framework: Digital Commons Framework - Page ',
      sv: 'Globalt styrsystem för allmänningar: Digital Commons-ramverket - Sida '
    }
  },

  // Digital Commons Framework - Advocacy & Scaling Tools
  {
    name: 'digital-commons-advocacy-toolkit',
    category: 'digital-commons',
    fileNames: {
      en: 'digital-commons-advocacy-toolkit-en',
      sv: 'digital-commons-advocacy-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'advocacy-and-scaling'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'advocacy-and-scaling')
    },
    pageFooter: {
      en: 'Digital Commons Advocacy Toolkit: Digital Commons Framework - Page ',
      sv: 'Verktygslåda för förespråkande av digitala allmänningar: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'funding-navigator',
    category: 'digital-commons',
    fileNames: {
      en: 'funding-navigator-en',
      sv: 'funding-navigator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'advocacy-and-scaling'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'advocacy-and-scaling')
    },
    pageFooter: {
      en: 'Funding Navigator: Digital Commons Framework - Page ',
      sv: 'Finansieringsnavigator: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'ppp-template',
    category: 'digital-commons',
    fileNames: {
      en: 'ppp-template-en',
      sv: 'ppp-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'advocacy-and-scaling'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'advocacy-and-scaling')
    },
    pageFooter: {
      en: 'Public-Private Partnership Template: Digital Commons Framework - Page ',
      sv: 'Mall för offentlig-privat partnerskap: Digital Commons-ramverket - Sida '
    }
  },

  // Digital Commons Framework - Low-Resource Tools
  {
    name: 'community-funding-guide',
    category: 'digital-commons',
    fileNames: {
      en: 'community-funding-guide-en',
      sv: 'community-funding-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'low-resource'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'low-resource')
    },
    pageFooter: {
      en: 'Community Funding Guide: Digital Commons Framework - Page ',
      sv: 'Guide för samhällsfinansiering: Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'resource-mapping-tool',
    category: 'digital-commons',
    fileNames: {
      en: 'resource-mapping-tool-en',
      sv: 'resource-mapping-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'low-resource'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'low-resource')
    },
    pageFooter: {
      en: 'Resource Mapping Tool: Digital Commons Framework - Page ',
      sv: 'Verktyg för resurskartering: Digital Commons-ramverket - Sida '
    }
  },

  // Digital Commons Framework - Audit Tools
  {
    name: 'audit-report-template',
    category: 'digital-commons',
    fileNames: {
      en: 'audit-report-template-en',
      sv: 'audit-report-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'audit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'audit')
    },
    pageFooter: {
      en: 'Audit Report Template: Digital Commons Framework - Page ',
      sv: 'Mall för granskningsrapport: Digital Commons-ramverket - Sida '
    }
  },

  // Digital Commons Framework - Appendices (for the seed kit)
  {
    name: 'appendix-b-visual-companion-toolkit',
    category: 'digital-commons',
    fileNames: {
      en: 'visual-companion-toolkit-en',
      sv: 'visual-companion-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Appendix B: Visual Companion Toolkit - Digital Commons Framework - Page ',
      sv: 'Bilaga B: Visuellt Följeslagarverktyg - Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'appendix-c-corporate-participation-playbook',
    category: 'digital-commons',
    fileNames: {
      en: 'corporate-participation-playbook-en',
      sv: 'corporate-participation-playbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Appendix C: Corporate Participation Playbook - Digital Commons Framework - Page ',
      sv: 'Bilaga C: Spelbok för Företagsdeltagande - Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'appendix-d-digital-ethics-charter',
    category: 'digital-commons',
    fileNames: {
      en: 'digital-ethics-charter-en',
      sv: 'digital-ethics-charter-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Appendix D: Digital Ethics Charter - Digital Commons Framework - Page ',
      sv: 'Bilaga D: Digital Etikstadga - Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'appendix-e-commons-glossary',
    category: 'digital-commons',
    fileNames: {
      en: 'commons-glossary-en',
      sv: 'commons-glossary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Appendix E: Commons Glossary - Digital Commons Framework - Page ',
      sv: 'Bilaga E: Commons-ordlista - Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'appendix-f-minimal-viable-node-quickstart',
    category: 'digital-commons',
    fileNames: {
      en: 'minimal-viable-node-quickstart-en',
      sv: 'minimal-viable-node-quickstart-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Appendix F: Minimal-Viable Node Quickstart - Digital Commons Framework - Page ',
      sv: 'Bilaga F: Minimal-Genomförbar Nodsnabbstart - Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'appendix-g-field-test-logbook-template',
    category: 'digital-commons',
    fileNames: {
      en: 'field-test-logbook-template-en',
      sv: 'field-test-logbook-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Appendix G: Field-Test Logbook Template - Digital Commons Framework - Page ',
      sv: 'Bilaga G: Mall för Fälttestloggbok - Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'appendix-i-diplomatic-mini-deck',
    category: 'digital-commons',
    fileNames: {
      en: 'diplomatic-mini-deck-en',
      sv: 'diplomatic-mini-deck-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Appendix I: Diplomatic Mini Deck - Digital Commons Framework - Page ',
      sv: 'Bilaga I: Diplomatiskt Mini-Däck - Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'appendix-j-historical-commons-context',
    category: 'digital-commons',
    fileNames: {
      en: 'historical-commons-context-en',
      sv: 'historical-commons-context-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Appendix J: Historical Commons Context - Digital Commons Framework - Page ',
      sv: 'Bilaga J: Historisk Allmänningskontext - Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'appendix-k-impact-assessment-framework',
    category: 'digital-commons',
    fileNames: {
      en: 'impact-assessment-framework-en',
      sv: 'impact-assessment-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons')
    },
    pageFooter: {
      en: 'Appendix K: Impact Assessment Framework - Digital Commons Framework - Page ',
      sv: 'Bilaga K: Ramverk för Konsekvensanalys - Digital Commons-ramverket - Sida '
    }
  },
  {
    name: 'how-to-use-the-digital-commons-seed-kit',
    category: 'digital-commons',
    fileNames: {
      en: 'how-to-use-the-digital-commons-seed-kit-en',
      sv: 'how-to-use-the-digital-commons-seed-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'How to Use the Digital Commons Seed Kit - Page ',
      sv: 'Så här använder du Digital Commons Seed Kit - Sida '
    }
  },

  // Digital Commons Framework - Digital Tools
  {
    name: 'governance-simulator-app',
    category: 'digital-commons',
    fileNames: {
      en: 'governance-simulator-app-en',
      sv: 'governance-simulator-app-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'digital-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'digital-tools')
    },
    pageFooter: {
      en: 'Governance Simulator App Documentation - Page ',
      sv: 'Dokumentation för appen Governance Simulator - Sida '
    }
  },
  {
    name: 'ai-chatbot',
    category: 'digital-commons',
    fileNames: {
      en: 'ai-chatbot-en',
      sv: 'ai-chatbot-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'digital-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'digital-tools')
    },
    pageFooter: {
      en: 'AI Chatbot for Tool Navigation Documentation - Page ',
      sv: 'Dokumentation för verktygsnavigerings-AI-chatbot - Sida '
    }
  },
  {
    name: 'collaboration-platform',
    category: 'digital-commons',
    fileNames: {
      en: 'collaboration-platform-en',
      sv: 'collaboration-platform-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'digital-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'digital-tools')
    },
    pageFooter: {
      en: 'Real-Time Collaboration Platform Documentation - Page ',
      sv: 'Dokumentation för plattform för samarbete i realtid - Sida '
    }
  },
  {
    name: 'health-dashboard',
    category: 'digital-commons',
    fileNames: {
      en: 'health-dashboard-en',
      sv: 'health-dashboard-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'digital-commons', 'tools', 'digital-tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'digital-commons', 'tools', 'digital-tools')
    },
    pageFooter: {
      en: 'Digital Commons Health Dashboard Documentation - Page ',
      sv: 'Dokumentation av Digital Commons Health Dashboard - Sida '
    }
  },
  {
    name: 'youth-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'youth-guide-en',
      sv: 'youth-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings')
    },
    pageFooter: {
      en: 'Youth & Community Action Guide: Rights of All Beings - Page ',
      sv: 'Handledning för ungdomar och samhällsaktiviteter: Alla varelsers rättigheter - Sida '
    }
  },
  {
    name: 'business-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'business-guide-en',
      sv: 'business-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings')
    },
    pageFooter: {
      en: 'Rights of Beings for Business Leaders: Implementation Guide - Page ',
      sv: 'Varelsers rättigheter för företagsledare: Implementeringsguide - Sida '
    }
  },
  {
    name: 'community-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'community-guide-en',
      sv: 'community-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings')
    },
    pageFooter: {
      en: 'Rights of Beings for Communities - Page ',
      sv: 'Varelsers rättigheter för samhällen och gemenskaper - Sida '
    }
  },
  {
    name: 'crisis-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'crisis-guide-en',
      sv: 'crisis-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings')
    },
    pageFooter: {
      en: 'Rights of Beings in Crisis Situations: Emergency Implementation Guide - Page ',
      sv: 'Rättigheter för varelser i krissituationer: Guide till implementering av nödsituationer - Sida '
    }
  },
  {
    name: 'educators-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'educators-guide-en',
      sv: 'educators-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings')
    },
    pageFooter: {
      en: 'Rights of Beings for Educators: Implementation Guide - Page ',
      sv: 'Varelsers rättigheter för lärare: Implementeringsguide - Sida '
    }
  },
  {
    name: 'indigenous-communities-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'indigenous-communities-guide-en',
      sv: 'indigenous-communities-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings')
    },
    pageFooter: {
      en: 'Rights of Beings for Indigenous Communities - Page ',
      sv: 'Rättigheter för varelser för ursprungsbefolkningar - Sida '
    }
  },
  {
    name: 'policy-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'policy-guide-en',
      sv: 'policy-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings')
    },
    pageFooter: {
      en: 'Rights of Beings for Policymakers - Page ',
      sv: 'Varelsers rättigheter för beslutsfattare - Sida '
    }
  },
  {
    name: 'religious-communities-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'religious-communities-guide-en',
      sv: 'religious-communities-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings')
    },
    pageFooter: {
      en: 'Rights of Beings for Religious Communities - Page ',
      sv: 'Varelsers rättigheter för religiösa samfund - Sida '
    }
  },
  {
    name: 'crisis-ethics-field-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'crisis-ethics-field-guide-en',
      sv: 'crisis-ethics-field-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'core-guides'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'core-guides')
    },
    pageFooter: {
      en: 'Crisis Ethics Field Guide - Page ',
      sv: 'Fältguide för krisetik - Sida '
    }
  },
  {
    name: 'rights-assessment-methodology',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'rights-assessment-methodology-en',
      sv: 'rights-assessment-methodology-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'core-guides'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'core-guides')
    },
    pageFooter: {
      en: 'Rights Assessment Methodology Handbook - Page ',
      sv: 'Handbok för metodik för rättighetsbedömning - Sida '
    }
  },
  {
    name: 'rights-recognition-starter-kit',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'rights-recognition-starter-kit-en',
      sv: 'rights-recognition-starter-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'core-guides'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'core-guides')
    },
    pageFooter: {
      en: 'Rights Recognition Starter Kit - Page ',
      sv: 'Startpaket för erkännande av rättigheter - Sida '
    }
  },
  {
    name: 'spiral-aware-implementation-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'spiral-aware-implementation-guide-en',
      sv: 'spiral-aware-implementation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'core-guides'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'core-guides')
    },
    pageFooter: {
      en: 'Spiral-Aware Implementation Guide - Page ',
      sv: 'Spiralmedveten implementeringsguide - Sida '
    }
  },
  {
    name: 'conflict-resolution-guide',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'conflict-resolution-guide-en',
      sv: 'conflict-resolution-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources')
    },
    pageFooter: {
      en: 'Conflict Resolution Protocol Guide - Page ',
      sv: 'Guide till protokoll för konfliktlösning - Sida '
    }
  },
  {
    name: 'consciousness-assessment-toolkit',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'consciousness-assessment-toolkit-en',
      sv: 'consciousness-assessment-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources')
    },
    pageFooter: {
      en: 'Consciousness Assessment Toolkit - Page ',
      sv: 'Verktygslåda för medvetandebedömning - Sida '
    }
  },
  {
    name: 'guardianship-handbook',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'guardianship-handbook-en',
      sv: 'guardianship-handbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources')
    },
    pageFooter: {
      en: 'Guardianship Council Handbook - Page ',
      sv: 'Handbok för förmynderskapsrådet - Sida '
    }
  },
  {
    name: 'indigenous-knowledge-protocol',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'indigenous-knowledge-protocol-en',
      sv: 'indigenous-knowledge-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources')
    },
    pageFooter: {
      en: 'Indigenous Knowledge Integration Protocol - Page ',
      sv: 'Protokoll för integration av ursprungsbefolkningens kunskap - Sida '
    }
  },
  {
    name: 'pioneer-pilots-manual',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'pioneer-pilots-manual-en',
      sv: 'pioneer-pilots-manual-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources')
    },
    pageFooter: {
      en: 'Pioneer Pilots Implementation Manual - Page ',
      sv: 'Implementeringsmanual för Pioneer Pilots - Sida '
    }
  },
  {
    name: 'resistance-management-playbook',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'resistance-management-playbook-en',
      sv: 'resistance-management-playbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources')
    },
    pageFooter: {
      en: 'Resistance Management Playbook - Page ',
      sv: 'Handbok för hantering av motstånd - Sida '
    }
  },
  {
    name: 'edge-case-handbook',
    category: 'global-ethics-and-rights-of-beings',
    fileNames: {
      en: 'edge-case-handbook-en',
      sv: 'edge-case-handbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-ethics-and-rights-of-beings', 'tools', 'specialized-resources')
    },
    pageFooter: {
      en: 'Edge Case Handbook - Page ',
      sv: 'Handbok för gränsfall - Sida '
    }
  },
  // Justice Framework
  {
    name: 'at-a-glance',
    category: 'justice-systems',
    fileNames: {
      en: 'justice-at-a-glance',
      sv: 'justice-at-a-glance'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems')
    },
    pageFooter: {
      en: 'Justice Systems Framework At A Glance - Page ',
      sv: 'Överblick över rättssystemsramverk - Sida '
    }
  },
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'justice-systems',
    fileNames: {
      en: 'justice-systems-framework-executive-summary-en',
      sv: 'justice-systems-framework-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Justice Systems Framework Executive Summary for the Skeptic - Page ',
      sv: 'Rättssystemsramverk - Sammanfattning för skeptiker - Sida '
    }
  },
  // Full framework
  {
    name: 'justice-systems-framework',
    category: 'justice-systems',
    fileNames: {
      en: 'Justice-Systems-Framework',
      sv: 'Justice-Systems-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Justice Systems Framework',
      sv: 'Rättsystemsramverk'
    },
    sections: [
      'index',
      'introduction',
      'governance-structure',
      'legal-framework',
      'institutional-relationships',
      'implementation-mechanisms',
      'digital-justice-innovation',
      'monitoring-accountability',
      'stakeholder-engagement',
      'challenges-mitigation',
      'timeline-milestones',
      'conclusion',
      'appendices'
    ]
  },

/*  {
    name: 'justice-framework-lite-guide',
    category: 'justice-systems',
    fileNames: {
      en: 'justice-framework-lite-guide-en',
      sv: 'justice-framework-lite-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems')
    },
    pageFooter: {
      en: 'Justice Systems Framework Lite Guide - Page ',
      sv: 'Förenklad guide för rättssystemets ramverk - Sida '
    }
  },
  {
    name: 'justice-lite-guide-community',
    category: 'justice-systems',
    fileNames: {
      en: 'justice-lite-guide-community-en',
      sv: 'justice-lite-guide-community-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems')
    },
    pageFooter: {
      en: 'Justice Systems Framework Lite Guide (Community) - Page ',
      sv: 'Förenklad guide för rättssystemets ramverk (Samhälle) - Sida '
    }
  },
  {
    name: 'youth-justice-guide',
    category: 'justice-systems',
    fileNames: {
      en: 'youth-justice-guide-en',
      sv: 'youth-justice-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems')
    },
    pageFooter: {
      en: 'Justice Systems Framework Lite Guide (Youth) - Page ',
      sv: 'Förenklad guide för rättssystemets ramverk (Ungdom) - Sida '
    }
  },

  // Core Tools
  {
    name: 'pilot-readiness-self-assessment-tool',
    category: 'justice-systems',
    fileNames: {
      en: 'pilot-readiness-self-assessment-tool-en',
      sv: 'pilot-readiness-self-assessment-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'core')
    },
    pageFooter: {
      en: 'Pilot Readiness Self-Assessment Tool - Page ',
      sv: 'Självbedömningsverktyg för pilotberedskap - Sida '
    }
  },
  {
    name: 'stakeholder-engagement-charter',
    category: 'justice-systems',
    fileNames: {
      en: 'stakeholder-engagement-charter-en',
      sv: 'stakeholder-engagement-charter-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'core')
    },
    pageFooter: {
      en: 'Stakeholder Engagement Charter - Page ',
      sv: 'Charta för intressentengagemang - Sida '
    }
  },
  {
    name: 'restorative-justice-guide',
    category: 'justice-systems',
    fileNames: {
      en: 'restorative-justice-guide-en',
      sv: 'restorative-justice-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'core')
    },
    pageFooter: {
      en: 'Restorative Justice Guide - Page ',
      sv: 'Guide för reparativ rättvisa - Sida '
    }
  },
  {
    name: 'indigenous-justice-integration-template',
    category: 'justice-systems',
    fileNames: {
      en: 'indigenous-justice-integration-template-en',
      sv: 'indigenous-justice-integration-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'core')
    },
    pageFooter: {
      en: 'Indigenous Justice Integration Template - Page ',
      sv: 'Mall för integrering av ursprungsfolks rättvisesystem - Sida '
    }
  },
  {
    name: 'monitoring-evaluation-rubric',
    category: 'justice-systems',
    fileNames: {
      en: 'monitoring-evaluation-rubric-en',
      sv: 'monitoring-evaluation-rubric-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'core')
    },
    pageFooter: {
      en: 'Monitoring & Evaluation Rubric - Page ',
      sv: 'Bedömningsmatris för övervakning och utvärdering - Sida '
    }
  },

  // Advocacy Tools
  {
    name: 'advocacy-playbook',
    category: 'justice-systems',
    fileNames: {
      en: 'advocacy-playbook-en',
      sv: 'advocacy-playbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'advocacy')
    },
    pageFooter: {
      en: 'Advocacy Playbook - Page ',
      sv: 'Handbok för påverkansarbete - Sida '
    }
  },
  {
    name: 'policy-harmonization-toolkit',
    category: 'justice-systems',
    fileNames: {
      en: 'policy-harmonization-toolkit-en',
      sv: 'policy-harmonization-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'advocacy')
    },
    pageFooter: {
      en: 'Policy Harmonization Toolkit - Page ',
      sv: 'Verktygslåda för policyharmonisering - Sida '
    }
  },
  {
    name: 'executive-summary',
    category: 'justice-systems',
    fileNames: {
      en: 'executive-summary-en',
      sv: 'executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'advocacy')
    },
    pageFooter: {
      en: 'Executive Summary - Page ',
      sv: 'Sammanfattning för beslutsfattare - Sida '
    }
  },
  {
    name: 'policy-brief',
    category: 'justice-systems',
    fileNames: {
      en: 'policy-brief-en',
      sv: 'policy-brief-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'advocacy')
    },
    pageFooter: {
      en: 'Policy Brief - Page ',
      sv: 'Policydokument - Sida '
    }
  },
  {
    name: 'cost-benefit-analysis-model',
    category: 'justice-systems',
    fileNames: {
      en: 'cost-benefit-analysis-model-en',
      sv: 'cost-benefit-analysis-model-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'advocacy')
    },
    pageFooter: {
      en: 'Cost-Benefit Analysis Model - Page ',
      sv: 'Modell för kostnads-nyttoanalys - Sida '
    }
  },*/

  // Simulation Tools
  {
    name: 'stakeholder-simulation-guide',
    category: 'justice-systems',
    fileNames: {
      en: 'stakeholder-simulation-guide-en',
      sv: 'stakeholder-simulation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'justice-systems', 'tools', 'simulation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'justice-systems', 'tools', 'simulation')
    },
    pageFooter: {
      en: 'Stakeholder Simulation Guide - Page ',
      sv: 'Guide för intressentsimulering - Sida '
    }
  },
  // Spiritual & Religious Dialogue Framework
  // 1. Main guides
  {
    name: 'executive-brief',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'executive-brief-en',
      sv: 'executive-brief-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance')
    },
    pageFooter: {
      en: 'Executive Brief - Page ',
      sv: 'Sammanfattning för Beslutsfattare - Sida '
    }
  },
  {
    name: 'policy-guide',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'policy-guide-en',
      sv: 'policy-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance')
    },
    pageFooter: {
      en: 'Policy Guide - Page ',
      sv: 'Policyguide - Sida '
    }
  },
  {
    name: 'youth-and-broad-audiences-guide',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'youth-and-broad-audiences-guide-en',
      sv: 'youth-and-broad-audiences-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance')
    },
    pageFooter: {
      en: 'Youth & Broad Audiences Guide - Page ',
      sv: 'Guide för Ungdomar & Bred Publik - Sida '
    }
  },

  // 2. Implementation tools
  {
    name: 'adaptive-facilitation-tools',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'adaptive-facilitation-tools-en',
      sv: 'adaptive-facilitation-tools-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance')
    },
    pageFooter: {
      en: 'Adaptive Facilitation Tools - Page ',
      sv: 'Adaptiva Faciliteringsverktyg - Sida '
    }
  },
  {
    name: 'digital-feedback-dashboard',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'digital-feedback-dashboard-en',
      sv: 'digital-feedback-dashboard-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance')
    },
    pageFooter: {
      en: 'Digital Feedback Dashboard - Page ',
      sv: 'Digital Feedback Dashboard - Sida '
    }
  },

  // 3. Core Tools
  {
    name: 'dialogue-facilitation-scripts',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'dialogue-facilitation-scripts-en',
      sv: 'dialogue-facilitation-scripts-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Dialogue Facilitation Scripts - Page ',
      sv: 'Dialogfaciliteringsskript - Sida '
    }
  },
  {
    name: 'digital-access-inclusion-audit',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'digital-access-inclusion-audit-en',
      sv: 'digital-access-inclusion-audit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Digital Access & Inclusion Audit - Page ',
      sv: 'Digital Tillgång & Inkludering Granskning - Sida '
    }
  },
  {
    name: 'truth-reconciliation-toolkit',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'truth-reconciliation-toolkit-en',
      sv: 'truth-reconciliation-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Truth & Reconciliation Toolkit - Page ',
      sv: 'Sannings & Försoningsverktygslåda - Sida '
    }
  },
  {
    name: 'wisdom-documentation-templates',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'wisdom-documentation-templates-en',
      sv: 'wisdom-documentation-templates-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Wisdom Documentation Templates - Page ',
      sv: 'Visdomsdokumentationsmallar - Sida '
    }
  },

  // 4. Implementation Tools
  {
    name: 'adaptive-learning-protocol',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'adaptive-learning-protocol-en',
      sv: 'adaptive-learning-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'implementation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'implementation')
    },
    pageFooter: {
      en: 'Adaptive Learning Protocol - Page ',
      sv: 'Adaptivt Inlärningsprotokoll - Sida '
    }
  },
  {
    name: 'impact-assessment-guide',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'impact-assessment-guide-en',
      sv: 'impact-assessment-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'implementation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'implementation')
    },
    pageFooter: {
      en: 'Impact Assessment Guide - Page ',
      sv: 'Guide för Effektbedömning - Sida '
    }
  },
  {
    name: 'representation-metrics-dashboard',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'representation-metrics-dashboard-en',
      sv: 'representation-metrics-dashboard-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'implementation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'implementation')
    },
    pageFooter: {
      en: 'Representation Metrics Dashboard - Page ',
      sv: 'Dashboard för Representationsmått - Sida '
    }
  },

  // 5. Policy Tools
  {
    name: 'cross-tradition-values-mapping-tool',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'cross-tradition-values-mapping-tool-en',
      sv: 'cross-tradition-values-mapping-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy')
    },
    pageFooter: {
      en: 'Cross-Tradition Values Mapping Tool - Page ',
      sv: 'Traditionsövergripande Värdemappningsverktyg - Sida '
    }
  },
  {
    name: 'ethics-charter-template',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'ethics-charter-template-en',
      sv: 'ethics-charter-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy')
    },
    pageFooter: {
      en: 'Ethics Charter Template - Page ',
      sv: 'Mall för Etiskt Stadga - Sida '
    }
  },
  {
    name: 'policy-development-guide',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'policy-development-guide-en',
      sv: 'policy-development-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy')
    },
    pageFooter: {
      en: 'Policy Development Guide - Page ',
      sv: 'Guide för Policyutveckling - Sida '
    }
  },
  {
    name: 'policy-translation-guide',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'policy-translation-guide-en',
      sv: 'policy-translation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy')
    },
    pageFooter: {
      en: 'Policy Translation Guide - Page ',
      sv: 'Guide för Policyöversättning - Sida '
    }
  },
  {
    name: 'wisdom-repository-starter-kit',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'wisdom-repository-starter-kit-en',
      sv: 'wisdom-repository-starter-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'policy')
    },
    pageFooter: {
      en: 'Wisdom Repository Starter Kit - Page ',
      sv: 'Startkit för Visdomsförvar - Sida '
    }
  },

  // 6. Seed Kit Tools
  {
    name: 'conflict-de-escalation-protocols',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'conflict-de-escalation-protocols-en',
      sv: 'conflict-de-escalation-protocols-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'Conflict De-escalation Protocols - Page ',
      sv: 'Protokoll för Konfliktdeeskalering - Sida '
    }
  },
  {
    name: 'cultural-appropriation-prevention',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'cultural-appropriation-prevention-en',
      sv: 'cultural-appropriation-prevention-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'Cultural Appropriation Prevention - Page ',
      sv: 'Förebyggande av Kulturell Appropriering - Sida '
    }
  },
  {
    name: 'dialogue-facilitation-guide',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'dialogue-facilitation-guide-en',
      sv: 'dialogue-facilitation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'Dialogue Facilitation Guide - Page ',
      sv: 'Guide för Dialogfacilitering - Sida '
    }
  },
  {
    name: 'local-partnership-templates',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'local-partnership-templates-en',
      sv: 'local-partnership-templates-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'Local Partnership Templates - Page ',
      sv: 'Mallar för Lokala Partnerskap - Sida '
    }
  },
  {
    name: 'regional-customization-framework',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'regional-customization-framework-en',
      sv: 'regional-customization-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'Regional Customization Framework - Page ',
      sv: 'Ramverk för Regional Anpassning - Sida '
    }
  },
  {
    name: 'representation-assessment-tool',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'representation-assessment-tool-en',
      sv: 'representation-assessment-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'Representation Assessment Tool - Page ',
      sv: 'Verktyg för Representationsbedömning - Sida '
    }
  },
  {
    name: 'sacred-space-setup-guide',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'sacred-space-setup-guide-en',
      sv: 'sacred-space-setup-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'Sacred Space Setup Guide - Page ',
      sv: 'Guide för Uppsättning av Heliga Rum - Sida '
    }
  },
  {
    name: 'tradition-protocol-cards',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'tradition-protocol-cards-en',
      sv: 'tradition-protocol-cards-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'Tradition-Specific Protocol Cards - Page ',
      sv: 'Tradtiionsspecifika Protokollkort - Sida '
    }
  },

  // Full framework combined PDF
  {
    name: 'spiritual-dialogue-framework',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'Spiritual-Dialogue',
      sv: 'Spiritual-Dialogue'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Religious & Spiritual Dialogue Framework',
      sv: 'Religiös & Spirituell Dialog Ramverk'
    },
    // Special config for full framework
    sections: [
      'index',
      'introduction',
      'core-principles',
      'objectives',
      'governance-structure',
      'implementation-mechanisms',
      'key-activities',
      'funding-and-resources',
      'challenges-and-mitigation-strategies',
      'timeline',
      'conclusion',
      'appendix-a',
      'appendix-b',
      'appendix-c',
      'appendix-d',
      'appendix-e',
      'appendix-f',
      'appendix-g',
      'appendix-h'
    ]
  },

  // Sacred Seed Kit combined PDF 
  {
    name: 'sacred-seed-kit',
    category: 'spiritual-and-religious-dialogue-governance',
    fileNames: {
      en: 'sacred-seed-kit-en',
      sv: 'sacred-seed-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'spiritual-and-religious-dialogue-governance', 'tools', 'seed-kit')
    },
    pageFooter: {
      en: 'Sacred Seed Kit - Page ',
      sv: 'Heligt Startkit - Sida '
    },
    // Special config to combine all seed kit files
    combinedFiles: [
      'dialogue-facilitation-guide',
      'representation-assessment-tool',
      'cultural-appropriation-prevention',
      'conflict-de-escalation-protocols',
      'local-partnership-templates',
      'regional-customization-framework',
      'sacred-space-setup-guide',
      'tradition-protocol-cards'
    ]
  },

  // Financial Systems

  // Quick Guides
  {
    name: 'quick-guide',
    category: 'financial-systems',
    fileNames: {
      en: 'quick-guide-en',
      sv: 'quick-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems')
    },
    pageFooter: {
      en: 'Quick Guide - Page ',
      sv: 'Snabbguide - Sida '
    }
  },
  {
    name: 'quick-guide-medium',
    category: 'financial-systems',
    fileNames: {
      en: 'quick-guide-medium-en',
      sv: 'quick-guide-medium-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems')
    },
    pageFooter: {
      en: 'Community Guide - Page ',
      sv: 'Samhällsguide - Sida '
    }
  },
  {
    name: 'quick-guide-youth',
    category: 'financial-systems',
    fileNames: {
      en: 'quick-guide-youth-en',
      sv: 'quick-guide-youth-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems')
    },
    pageFooter: {
      en: 'Youth Guide - Page ',
      sv: 'Ungdomsguide - Sida '
    }
  },

  // Implementation Tools
  {
    name: 'hearts-toolkit',
    category: 'financial-systems',
    fileNames: {
      en: 'hearts-toolkit-en',
      sv: 'hearts-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems', 'tools')
    },
    pageFooter: {
      en: 'Hearts Implementation Toolkit - Page ',
      sv: 'Hearts Implementeringsverktyg - Sida '
    }
  },
  {
    name: 'transition-guide',
    category: 'financial-systems',
    fileNames: {
      en: 'transition-guide-en',
      sv: 'transition-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems', 'tools')
    },
    pageFooter: {
      en: 'Transition Guide - Page ',
      sv: 'Övergångsguide - Sida '
    }
  },
  {
    name: 'validator-training',
    category: 'financial-systems',
    fileNames: {
      en: 'validator-training-en',
      sv: 'validator-training-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems', 'tools')
    },
    pageFooter: {
      en: 'Validator Training Manual - Page ',
      sv: 'Validatorträningsmanual - Sida '
    }
  },
  {
    name: 'love-ledger-guide',
    category: 'financial-systems',
    fileNames: {
      en: 'love-ledger-guide-en',
      sv: 'love-ledger-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems', 'tools')
    },
    pageFooter: {
      en: 'Love Ledger User Guide - Page ',
      sv: 'Love Ledger Användarguide - Sida '
    }
  },
  {
    name: 'hearts-technical-spec',
    category: 'financial-systems',
    fileNames: {
      en: 'hearts-technical-spec-en',
      sv: 'hearts-technical-spec-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems', 'tools')
    },
    pageFooter: {
      en: 'Hearts Technical Specification - Page ',
      sv: 'Hearts Teknisk Specifikation - Sida '
    }
  },
  {
    name: 'translation-layer',
    category: 'financial-systems',
    fileNames: {
      en: 'translation-layer-en',
      sv: 'translation-layer-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems', 'tools')
    },
    pageFooter: {
      en: 'Inter-Currency Translation Layer - Page ',
      sv: 'Inter-Valuta Översättningslager - Sida '
    }
  },
  {
    name: 'proof-of-care',
    category: 'financial-systems',
    fileNames: {
      en: 'proof-of-care-en',
      sv: 'proof-of-care-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems', 'tools')
    },
    pageFooter: {
      en: 'Proof of Care Protocol - Page ',
      sv: 'Proof of Care Protokoll - Sida '
    }
  },
  // Full framework combined PDF
  {
    name: 'financial-systems-framework',
    category: 'financial-systems',
    fileNames: {
      en: 'Financial-Systems-Framework',
      sv: 'Finansiella-Systems-Ramverk'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'financial-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'financial-systems')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Financial Systems Framework',
      sv: 'Finansiella Systems Ramverk'
    },
    // Special config for full framework
    sections: [
      'index',
      'introduction',
      'core-principles',
      'structural-components',
      'implementation-approaches',
      'metrics-evaluation',
      'supporting-sections',
      'appendices'
    ]
  },

  // General Governance
  // Core Tools
  {
    name: 'decidetogether-platform-guide',
    category: 'governance',
    fileNames: {
      en: 'decidetogether-platform-guide-en',
      sv: 'decidetogether-platform-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'governance','tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'DecideTogether Platform Guide - Page ',
      sv: 'Guide till DecideTogether-plattformen - Sida '
    }
  },
  {
    name: 'stakeholder-engagement-charter',
    category: 'governance',
    fileNames: {
      en: 'stakeholder-engagement-charter-en',
      sv: 'stakeholder-engagement-charter-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'governance','tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Stakeholder Engagement Charter Template - Page ',
      sv: 'Mall för stadga för intressentengagemang - Sida '
    }
  },
  {
    name: 'community-well-being-index',
    category: 'governance',
    fileNames: {
      en: 'community-well-being-index-en',
      sv: 'community-well-being-index-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'governance','tools', 'monitoring'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'governance', 'tools', 'monitoring')
    },
    pageFooter: {
      en: 'Community Well-Being Index - Page ',
      sv: 'Index för samhällets välbefinnande - Sida '
    }
  },

  // Environmental Stewardship Framework
  // Core Tools
  {
    name: 'dynamic-rights-spectrum-guide',
    category: 'environmental-stewardship',
    fileNames: {
      en: 'dynamic-rights-spectrum-guide-en',
      sv: 'dynamic-rights-spectrum-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'environmental-stewardship', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'environmental-stewardship', 'tools', 'core')
    },
    pageFooter: {
      en: 'Dynamic Rights Spectrum Guide - Page ',
      sv: 'Guide för dynamiskt rättighetsspektrum - Sida '
    }
  },
  {
    name: 'reparations-protocol',
    category: 'environmental-stewardship',
    fileNames: {
      en: 'reparations-protocol-en',
      sv: 'reparations-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'environmental-stewardship', 'tools', 'governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'environmental-stewardship', 'tools', 'governance')
    },
    pageFooter: {
      en: 'Reparations Protocol - Page ',
      sv: 'Reparationsprotokoll - Sida '
    }
  },
  {
    name: 'ecosystem-health-indicators',
    category: 'environmental-stewardship',
    fileNames: {
      en: 'ecosystem-health-indicators-en',
      sv: 'ecosystem-health-indicators-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'environmental-stewardship', 'tools', 'monitoring'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'environmental-stewardship', 'tools', 'monitoring')
    },
    pageFooter: {
      en: 'Ecosystem Health Indicators - Page ',
      sv: 'Indikatorer för ekosystemhälsa - Sida '
    }
  },
  {
    name: 'nexus-impact-assessment-tool',
    category: 'environmental-stewardship',
    fileNames: {
      en: 'nexus-impact-assessment-tool-en',
      sv: 'nexus-impact-assessment-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'environmental-stewardship', 'tools', 'monitoring'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'environmental-stewardship', 'tools', 'monitoring')
    },
    pageFooter: {
      en: 'Nexus Impact Assessment Tool - Page ',
      sv: 'Nexus konsekvensbedömningsverktyg - Sida '
    }
  },
  // Guides
  {
    name: 'one-page-essence',
    category: 'environmental-stewardship',
    fileNames: {
      en: 'one-page-essence-en',
      sv: 'one-page-essence-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'environmental-stewardship'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'environmental-stewardship')
    },
    pageFooter: {
      en: 'Environmental Stewardship Framework - One Page Essence - Page ',
      sv: 'Ramverk för miljöförvaltning - Essens på en sida - Sida '
    }
  },
  {
    name: 'one-page-essence',
    category: 'environmental-stewardship',
    fileNames: {
      en: 'environmental-stewardship-framework-essence-en',
      sv: 'environmental-stewardship-framework-essence-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'environmental-stewardship'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'environmental-stewardship')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Environmental Stewardship Framework - One Page Essence - Page ',
      sv: 'Ramverk för miljöförvaltning - Essens på en sida - Sida '
    }
  },
  {
    name: 'first-100-days-playbook',
    category: 'environmental-stewardship',
    fileNames: {
      en: 'first-100-days-playbook-en',
      sv: 'first-100-days-playbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'environmental-stewardship'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'environmental-stewardship')
    },
    pageFooter: {
      en: 'First 100 Days Playbook - Page ',
      sv: 'Handbok för de första 100 dagarna - Sida '
    }
  },
  // Full framework
  {
    name: 'environmental-stewardship-framework',
    category: 'environmental-stewardship',
    fileNames: {
      en: 'Environmental-Stewardship-Framework',
      sv: 'Environmental-Stewardship-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'environmental-stewardship'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'environmental-stewardship')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Environmental Stewardship Framework for Multi-Level Governance',
      sv: 'Miljöförvaltningsramverk för Flernivåstyrning'
    },
    // Special config for full framework
    sections: [
      'index',
      
      // Core framework sections
      'introduction',
      'guiding-principles',
      'governance-structure',
      'core-pillars',
      'policy-mechanisms',
      'stakeholder-engagement',
      'financing-mechanisms',
      'implementation-roadmap',
      'metrics-for-success',
      'visualizations',
      'challenges-and-solutions',
      'implementation-tools',
      'reparations-protocol',
      'conclusion',
      
      // Appendices overview
      'appendices-overview',
      
      // Part I: Strategic Planning & Oversight
      'appendix-a', // Contingency Plans and Adaptive Management
      'appendix-b', // Detailed Pillar Strategies and Implementation
      'appendix-c', // Detailed Roadmap and Implementation Timeline
      'appendix-d', // Risk Assessment and Mitigation Matrix
      
      // Part II: Governance, Policy & Finance
      'appendix-e', // Governance Details and Institutional Frameworks
      'appendix-f', // Policy Implementation and Regulatory Frameworks
      'appendix-g', // Reparations Details and Justice Implementation
      'appendix-h', // Financing Details and Economic Mechanisms
      
      // Part III: Implementation, Engagement & Tools
      'appendix-i', // Implementation Toolkit and Protocol Library
      'appendix-j', // Engagement Materials and Public Resources
      'appendix-k', // Engagement Plans and Stakeholder Coordination
      'appendix-l', // Case Studies and Implementation Examples
      
      // Part IV: Core Protocols & Integration
      'appendix-m', // Cross-Framework Integration Protocols
      'appendix-n', // Data-to-Reward Pipeline Protocol
      'appendix-o', // Rights Hand-Off Protocol
      'appendix-p', // Cross-Council Coordination Charter
      
      // Part V: Measurement, Learning & Evidence
      'appendix-q', // Comprehensive Monitoring & Evaluation Indicators
      'appendix-r', // Visualization Gallery and Communication Tools
      'appendix-s'  // Framework Learning and Knowledge Systems
    ]
  },
  // Biodiversity Framework Tools & Guides Snippets for PDF Generator and Markdown Copy Tool

  // Main Implementation Guides
  {
    name: 'technical-guide-policymakers',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'technical-guide-policymakers-en',
      sv: 'technical-guide-policymakers-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Technical Guide for Policymakers - Page ',
      sv: 'Ramverk för biologisk mångfald - Teknisk guide för beslutsfattare - Sida '
    }
  },

  {
    name: 'community-implementation-guide',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'community-implementation-guide-en',
      sv: 'community-implementation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Community Implementation Guide - Page ',
      sv: 'Ramverk för biologisk mångfald - Samhällsguide för implementering - Sida '
    }
  },

  {
    name: 'youth-engagement-leadership-guide',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'youth-engagement-leadership-guide-en',
      sv: 'youth-engagement-leadership-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Youth Engagement & Leadership Guide - Page ',
      sv: 'Ramverk för biologisk mångfald - Ungdomsengagemang & ledarskapsguide - Sida '
    }
  },

  {
    name: 'corporate-transition-redemption-guide',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'corporate-transition-redemption-guide-en',
      sv: 'corporate-transition-redemption-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Corporate Transition & Redemption Guide - Page ',
      sv: 'Ramverk för biologisk mångfald - Företagsövergång & återlösningsguide - Sida '
    }
  },

  {
    name: 'indigenous-data-sovereignty-guide',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'indigenous-data-sovereignty-guide-en',
      sv: 'indigenous-data-sovereignty-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Indigenous Data Sovereignty Guide - Page ',
      sv: 'Ramverk för biologisk mångfald - Urfolks datasuveränitetsguide - Sida '
    }
  },

  // Core Tools
  {
    name: 'fpic-2-protocols-template',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'fpic-2-protocols-template-en',
      sv: 'fpic-2-protocols-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Biodiversity Framework - FPIC 2.0 Protocols Template - Page ',
      sv: 'Ramverk för biologisk mångfald - FPIC 2.0 protokollmall - Sida '
    }
  },

  {
    name: 'rights-escalation-ladder-framework',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'rights-escalation-ladder-framework-en',
      sv: 'rights-escalation-ladder-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Rights Escalation Ladder Framework - Page ',
      sv: 'Ramverk för biologisk mångfald - Rättighetsupptrappningsstege ramverk - Sida '
    }
  },

  {
    name: 'youth-leadership-pipeline-guide',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'youth-leadership-pipeline-guide-en',
      sv: 'youth-leadership-pipeline-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Youth Leadership Pipeline Guide - Page ',
      sv: 'Ramverk för biologisk mångfald - Guide för ungdomsledarskap - Sida '
    }
  },

  {
    name: 'future-beings-council-setup',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'future-beings-council-setup-en',
      sv: 'future-beings-council-setup-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Future Beings Council Setup - Page ',
      sv: 'Ramverk för biologisk mångfald - Framtida varelsers råd uppsättning - Sida '
    }
  },

  {
    name: 'corporate-transition-support-toolkit',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'corporate-transition-support-toolkit-en',
      sv: 'corporate-transition-support-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Corporate Transition Support Toolkit - Page ',
      sv: 'Ramverk för biologisk mångfald - Verktygskit för företagsövergångsstöd - Sida '
    }
  },

  {
    name: 'crisis-response-protocols',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'crisis-response-protocols-en',
      sv: 'crisis-response-protocols-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Crisis Response Protocols - Page ',
      sv: 'Ramverk för biologisk mångfald - Krisberedskapsprotokoll - Sida '
    }
  },

  {
    name: 'regional-adaptation-guidelines',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'regional-adaptation-guidelines-en',
      sv: 'regional-adaptation-guidelines-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'core')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Regional Adaptation Guidelines - Page ',
      sv: 'Ramverk för biologisk mångfald - Riktlinjer för regional anpassning - Sida '
    }
  },

  // Economic Tools
  {
    name: 'hybrid-ubes-implementation-guide',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'hybrid-ubes-implementation-guide-en',
      sv: 'hybrid-ubes-implementation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'economic-integration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'economic-integration')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Hybrid UBES Implementation Guide - Page ',
      sv: 'Ramverk för biologisk mångfald - Hybrid UBES implementeringsguide - Sida '
    }
  },

  {
    name: 'impact-bonds-financing',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'impact-bonds-financing-en',
      sv: 'impact-bonds-financing-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'economic-integration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'economic-integration')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Biodiversity Impact Bonds & Financing - Page ',
      sv: 'Ramverk för biologisk mångfald - Biodiversitetspåverkningsobligationer & finansiering - Sida '
    }
  },

  {
    name: 'economic-resilience-corporate',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'economic-resilience-corporate-en',
      sv: 'economic-resilience-corporate-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'economic-integration'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'economic-integration')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Economic Resilience & Corporate Transition Toolkit - Page ',
      sv: 'Ramverk för biologisk mångfald - Ekonomisk motståndskraft & företagsövergångsverktyg - Sida '
    }
  },

  // Cultural Mobilization Tools
  {
    name: 'bio-arts-toolkit',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'bio-arts-toolkit-en',
      sv: 'bio-arts-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'cultural'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'cultural')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Bio-Arts Residencies Toolkit - Page ',
      sv: 'Ramverk för biologisk mångfald - Bio-konstresidensers verktygskit - Sida '
    }
  },

  {
    name: 'restoration-calendar-template',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'restoration-calendar-template-en',
      sv: 'restoration-calendar-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'cultural'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'cultural')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Global Restoration Calendar Template - Page ',
      sv: 'Ramverk för biologisk mångfald - Global restaureringskalender mall - Sida '
    }
  },

  {
    name: 'bio-influencer-campaign',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'bio-influencer-campaign-en',
      sv: 'bio-influencer-campaign-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'cultural'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'cultural')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Bio-Influencer Training & Campaign Kit - Page ',
      sv: 'Ramverk för biologisk mångfald - Bio-influencer träning & kampanjkit - Sida '
    }
  },

  // Technology & Monitoring Tools
  {
    name: 'blockchain-setup-guide',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'blockchain-setup-guide-en',
      sv: 'blockchain-setup-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'technology'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'technology')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Biodiversity Blockchain Setup Guide - Page ',
      sv: 'Ramverk för biologisk mångfald - Biodiversitetsblockkedja uppsättningsguide - Sida '
    }
  },

  {
    name: 'trust-dashboard-evaluation',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'trust-dashboard-evaluation-en',
      sv: 'trust-dashboard-evaluation-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'technology'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'technology')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Public Trust Dashboard & Evaluation Template - Page ',
      sv: 'Ramverk för biologisk mångfald - Offentlig förtroendedashboard & utvärderingsmall - Sida '
    }
  },

  {
    name: 'cyber-guardianship-complete',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'cyber-guardianship-complete-en',
      sv: 'cyber-guardianship-complete-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'technology'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'technology')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Cyber-Physical Guardianship Protocols - Page ',
      sv: 'Ramverk för biologisk mångfald - Cyber-fysiska vårdnadsprotokoll - Sida '
    }
  },

  // Digital Platform Tools
  {
    name: 'governance-simulator',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'governance-simulator-en',
      sv: 'governance-simulator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'digital-commons')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Biodiversity Governance Simulator - Page ',
      sv: 'Ramverk för biologisk mångfald - Biodiversitetsstyrningssimulator - Sida '
    }
  },

  {
    name: 'health-dashboard',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'health-dashboard-en',
      sv: 'health-dashboard-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'digital-commons')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Global Biodiversity Health Dashboard - Page ',
      sv: 'Ramverk för biologisk mångfald - Global biodiversitetshälsodashboard - Sida '
    }
  },

  {
    name: 'collaboration-platform',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'collaboration-platform-en',
      sv: 'collaboration-platform-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'digital-commons')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Real-Time Collaboration Platform - Page ',
      sv: 'Ramverk för biologisk mångfald - Realtids samarbetsplattform - Sida '
    }
  },

  // Regional Implementation Tools
  {
    name: 'amazon-basin-complete',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'amazon-basin-complete-en',
      sv: 'amazon-basin-complete-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'regional'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'regional')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Amazon Basin Implementation Toolkit - Page ',
      sv: 'Ramverk för biologisk mångfald - Amazonbäckenet implementeringsverktyg - Sida '
    }
  },

  {
    name: 'arctic-sovereignty-complete',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'arctic-sovereignty-complete-en',
      sv: 'arctic-sovereignty-complete-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'regional'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'regional')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Arctic Indigenous Sovereignty Toolkit - Page ',
      sv: 'Ramverk för biologisk mångfald - Arktisk ursprungssuveränitetsverktyg - Sida '
    }
  },

  {
    name: 'urban-biodiversity-guide',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'urban-biodiversity-guide-en',
      sv: 'urban-biodiversity-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'regional'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'regional')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Urban Biodiversity Integration Guide - Page ',
      sv: 'Ramverk för biologisk mångfald - Urbans biodiversitetsintegrationsguide - Sida '
    }
  },

  // Advocacy & Scaling Tools
  {
    name: 'advocacy-toolkit',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'advocacy-toolkit-en',
      sv: 'advocacy-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'advocacy')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Biodiversity Advocacy Campaign Toolkit - Page ',
      sv: 'Ramverk för biologisk mångfald - Biodiversitetspåverkanskampanj verktygskit - Sida '
    }
  },

  {
    name: 'funding-navigator',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'funding-navigator-en',
      sv: 'funding-navigator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'advocacy')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Funding Navigator for Biodiversity Projects - Page ',
      sv: 'Ramverk för biologisk mångfald - Finansieringsnavigator för biodiversitetsprojekt - Sida '
    }
  },

  {
    name: 'diplomatic-playbook',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'diplomatic-playbook-en',
      sv: 'diplomatic-playbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'advocacy')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Diplomatic Engagement Playbook - Page ',
      sv: 'Ramverk för biologisk mångfald - Diplomatisk engagemangshandbok - Sida '
    }
  },

  {
    name: 'coalition-building-guide',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'coalition-building-guide-en',
      sv: 'coalition-building-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'advocacy')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Coalition Building Strategy Guide - Page ',
      sv: 'Ramverk för biologisk mångfald - Koalitionsbyggnadsstrategi guide - Sida '
    }
  },

  // Assessment & Evaluation Tools
  {
    name: 'pilot-audit-learning',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'pilot-audit-learning-en',
      sv: 'pilot-audit-learning-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'assessment'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'assessment')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Pilot Program Audit & Learning Template - Page ',
      sv: 'Ramverk för biologisk mångfald - Pilotprogram revision & lärandemall - Sida '
    }
  },

  {
    name: 'cultural-democratic-assessment',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'cultural-democratic-assessment-en',
      sv: 'cultural-democratic-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance', 'tools', 'assessment'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance', 'tools', 'assessment')
    },
    pageFooter: {
      en: 'Biodiversity Framework - Cultural Impact & Democratic Assessment Tool - Page ',
      sv: 'Ramverk för biologisk mångfald - Kulturell påverkan & demokratisk bedömningsverktyg - Sida '
    }
  },
  // Full Biodiversity Framework
  {
    name: 'biodiversity-framework',
    category: 'biodiversity-governance',
    fileNames: {
      en: 'Biodiversity-Framework',
      sv: 'Biodiversity-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'biodiversity-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'biodiversity-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Global Governance Biodiversity Implementation Framework',
      sv: 'Global Styrning Biodiversitet Implementering Ramverk'
    },
    // Special config for full framework
    sections: [
      'index',
      'philosophical-preamble',
      'introduction-vision',
      'guiding-principles',
      'core-pillars',
      'governance-structure',
      'policy-mechanisms',
      'stakeholder-engagement',
      'financing-mechanisms',
      'implementation-roadmap',
      'metrics-success',
      'visualizations',
      'challenges-solutions',
      'implementation-tools',
      'reparations-protocol',
      'conclusion-call-to-action',
      'appendix-a-synergy-esfmlg',
      'appendix-b-glossary',
      'appendix-c-tool-library',
      'appendix-d-moral-edge-cases',
      'appendix-e-political-economy',
      'appendix-f-feasibility-studies',
      'appendix-g-pilot-blueprints',
      'appendix-h-scenario-planning',
      'appendix-i-cooperation-protocols',
      'appendix-j-creative-outputs'
    ]
  },

  // Planetary Health Governance Framework
  {
    name: 'planetary-health-charter-1-page',
    category: 'planetary-health-governance',
    fileNames: {
      en: 'planetary-health-charter-1-page',
      sv: 'planetary-health-charter-1-page'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'planetary-health-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'planetary-health-governance')
    },
    pageFooter: {
      en: 'Planetary Health Governance Framework - Planetary Health Charter',
      sv: 'Planetariskt hälsostyrningsramverk - Planetarisk hälsostadga'
    }
  },
  {
    name: 'planetary-health-governance-framework',
    category: 'planetary-health-governance',
    fileNames: {
      en: 'Planetary-Health-Governance-Framework',
      sv: 'Planetary-Health-Governance-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'planetary-health-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'planetary-health-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Planetary Health Governance Framework',
      sv: 'Planetariskt hälsostyrningsramverk'
    },
    // Special config for full framework
    sections: [
      'preamble',
      'index',
      'introduction',
      'planetary-health-charter',
      'core-principles',
      'governance-architecture',
      'cross-cutting-policies',
      'framework-integration',
      'implementation-roadmap',
      'conclusion',
      'appendices'
    ]
  },

  // Global Health & Pandemic Security Framework
  {
    name: 'universal-declaration-health-rights',
    category: 'global-health-and-pandemic-security',
    fileNames: {
      en: 'universal-declaration-health-rights',
      sv: 'universal-declaration-health-rights'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-health-and-pandemic-security'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-health-and-pandemic-security')
    },
    pageFooter: {
      en: 'Global Health & Pandemic Security Framework - Universal Declaration of Health Rights',
      sv: 'Globalt ramverk för hälsa och pandemisäkerhet - Allmänna förklaringen om hälsorättigheter'
    }
  },
  {
    name: 'global-health-and-pandemic-security-framework',
    category: 'global-health-and-pandemic-security',
    fileNames: {
      en: 'Global-Health-&-Pandemic-Security-Framework',
      sv: 'Global-Health-&-Pandemic-Security-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'global-health-and-pandemic-security'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'global-health-and-pandemic-security')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Global Health & Pandemic Security Framework',
      sv: 'Globalt ramverk för hälsa och pandemisäkerhet'
    },
    // Special config for full framework
    sections: [
      'index',
      'introduction',
      'core-principles',
      'universal-declaration',
      'governance-architecture',
      'operational-systems',
      'crisis-response',
      'implementation-roadmap',
      'funding-mechanisms',
      'framework-integration',
      'conclusion',
      'appendices'
    ]
  },

  // Consciousness Framework

  // Main framework files
  {
    name: 'consciousness-accord-lite',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'consciousness-accord-lite-en',
      sv: 'consciousness-accord-lite-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development')
    },
    pageFooter: {
      en: 'Consciousness Framework - Consciousness Accord Lite - Page ',
      sv: 'Medvetande Ramverk - Medvetande Accord Lite - Sida '
    }
  },
  {
    name: 'executive-core-overview',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'executive-core-overview-en',
      sv: 'executive-core-overview-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development')
    },
    pageFooter: {
      en: 'Consciousness Framework - Executive Summary - Page ',
      sv: 'Medvetande Ramverk - Sammanfattning - Sida '
    }
  },

  // Core Governance Tools
  {
    name: 'global-wisdom-council-setup',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'global-wisdom-council-setup-en',
      sv: 'global-wisdom-council-setup-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'core')
    },
    pageFooter: {
      en: 'Consciousness Framework - Global Wisdom Council Setup Guide - Page ',
      sv: 'Medvetande Ramverk - Uppsättningsguide för globalt vishetsråd - Sida '
    }
  },
  {
    name: 'regional-consciousness-hub-implementation',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'regional-consciousness-hub-implementation-en',
      sv: 'regional-consciousness-hub-implementation-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'core')
    },
    pageFooter: {
      en: 'Consciousness Framework - Regional Consciousness Hub Implementation Guide - Page ',
      sv: 'Medvetande Ramverk - Implementeringsguide för regionalt medvetandecentrum - Sida '
    }
  },
  {
    name: 'policy-design-guide',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'policy-design-guide-en',
      sv: 'policy-design-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'core')
    },
    pageFooter: {
      en: 'Consciousness Framework - Policy Design Guide - Page ',
      sv: 'Medvetande Ramverk - Guide för policydesign - Sida '
    }
  },
  {
    name: 'stakeholder-engagement-protocols',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'stakeholder-engagement-protocols-en',
      sv: 'stakeholder-engagement-protocols-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'core')
    },
    pageFooter: {
      en: 'Consciousness Framework - Stakeholder Engagement Protocols - Page ',
      sv: 'Medvetande Ramverk - Protokoll för intressentengagemang - Sida '
    }
  },
  {
    name: 'youth-council-framework',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'youth-council-framework-en',
      sv: 'youth-council-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'core')
    },
    pageFooter: {
      en: 'Consciousness Framework - Youth Council Framework - Page ',
      sv: 'Medvetande Ramverk - Ramverk för ungdomsråd - Sida '
    }
  },

  // Personal Transformation Tools
  {
    name: 'mindfulness-training-module',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'mindfulness-training-module-en',
      sv: 'mindfulness-training-module-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'personal'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'personal')
    },
    pageFooter: {
      en: 'Consciousness Framework - Mindfulness Training Module - Page ',
      sv: 'Medvetande Ramverk - Mindfulnessträningsmodul - Sida '
    }
  },
  {
    name: 'shadow-work-coaching-guide',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'shadow-work-coaching-guide-en',
      sv: 'shadow-work-coaching-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'personal'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'personal')
    },
    pageFooter: {
      en: 'Consciousness Framework - Shadow Work Coaching Guide - Page ',
      sv: 'Medvetande Ramverk - Guide för coachning i skuggarbete - Sida '
    }
  },
  {
    name: 'nonviolent-communication-toolkit',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'nonviolent-communication-toolkit-en',
      sv: 'nonviolent-communication-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'personal'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'personal')
    },
    pageFooter: {
      en: 'Consciousness Framework - Nonviolent Communication Toolkit - Page ',
      sv: 'Medvetande Ramverk - Verktygslåda för ickevåldsam kommunikation - Sida '
    }
  },
  {
    name: 'leadership-toolkit',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'leadership-toolkit-en',
      sv: 'leadership-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'personal'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'personal')
    },
    pageFooter: {
      en: 'Consciousness Framework - Leadership Toolkit - Page ',
      sv: 'Medvetande Ramverk - Verktygslåda för ledarskap - Sida '
    }
  },

  // Community Engagement Tools
  {
    name: 'community-dialogue-manual',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'community-dialogue-manual-en',
      sv: 'community-dialogue-manual-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'community'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'community')
    },
    pageFooter: {
      en: 'Consciousness Framework - Community Dialogue Manual - Page ',
      sv: 'Medvetande Ramverk - Handbok för samhällsdialog - Sida '
    }
  },
  {
    name: 'cultural-sensitivity-protocols',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'cultural-sensitivity-protocols-en',
      sv: 'cultural-sensitivity-protocols-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'community'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'community')
    },
    pageFooter: {
      en: 'Consciousness Framework - Cultural Sensitivity Protocols - Page ',
      sv: 'Medvetande Ramverk - Protokoll för kulturell känslighet - Sida '
    }
  },
  {
    name: 'consciousness-raising-circle-guide',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'consciousness-raising-circle-guide-en',
      sv: 'consciousness-raising-circle-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'community'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'community')
    },
    pageFooter: {
      en: 'Consciousness Framework - Consciousness-Raising Circle Guide - Page ',
      sv: 'Medvetande Ramverk - Medvetandehöjande cirkelguide - Sida '
    }
  },

  // Digital Platform Tools
  {
    name: 'ai-sentiment-analysis-setup',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'ai-sentiment-analysis-setup-en',
      sv: 'ai-sentiment-analysis-setup-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'digital-commons')
    },
    pageFooter: {
      en: 'Consciousness Framework - AI Sentiment Analysis Setup Guide - Page ',
      sv: 'Medvetande Ramverk - Installationsguide för AI-sentimentanalys - Sida '
    }
  },
  {
    name: 'vr-wisdom-council-framework',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'vr-wisdom-council-framework-en',
      sv: 'vr-wisdom-council-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'digital-commons')
    },
    pageFooter: {
      en: 'Consciousness Framework - VR Wisdom Council Framework - Page ',
      sv: 'Medvetande Ramverk - VR Vishetsrådsramverk - Sida '
    }
  },
  {
    name: 'ai-bias-audit-framework',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'ai-bias-audit-framework-en',
      sv: 'ai-bias-audit-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'digital-commons')
    },
    pageFooter: {
      en: 'Consciousness Framework - AI Bias Audit Framework - Page ',
      sv: 'Medvetande Ramverk - Ramverk för granskning av AI-bias - Sida '
    }
  },
  {
    name: 'cybersecurity-framework-governance',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'cybersecurity-framework-governance-en',
      sv: 'cybersecurity-framework-governance-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'digital-commons'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'digital-commons')
    },
    pageFooter: {
      en: 'Consciousness Framework - Cybersecurity Framework for Governance - Page ',
      sv: 'Medvetande Ramverk - Ramverk för cybersäkerhet för styrning - Sida '
    }
  },

  // Economic and Metrics Tools
  {
    name: 'conscious-budget-template',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'conscious-budget-template-en',
      sv: 'conscious-budget-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'metrics'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'metrics')
    },
    pageFooter: {
      en: 'Consciousness Framework - Conscious Budget Template - Page ',
      sv: 'Medvetande Ramverk - Medveten budgetmall - Sida '
    }
  },
  {
    name: 'vmeme-transition-toolkit',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'vmeme-transition-toolkit-en',
      sv: 'vmeme-transition-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'metrics'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'metrics')
    },
    pageFooter: {
      en: 'Consciousness Framework - vMeme Transition Toolkit - Page ',
      sv: 'Medvetande Ramverk - vMeme-övergångsverktyg - Sida '
    }
  },
  {
    name: 'leader-consciousness-index-guide',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'leader-consciousness-index-guide-en',
      sv: 'leader-consciousness-index-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'metrics'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'metrics')
    },
    pageFooter: {
      en: 'Consciousness Framework - Leader Consciousness Index Guide - Page ',
      sv: 'Medvetande Ramverk - Guide till index för ledarmedvetenhet - Sida '
    }
  },
  {
    name: 'intergenerational-justice-metrics-framework',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'intergenerational-justice-metrics-framework-en',
      sv: 'intergenerational-justice-metrics-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'metrics'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'metrics')
    },
    pageFooter: {
      en: 'Consciousness Framework - Intergenerational Justice Metrics Framework - Page ',
      sv: 'Medvetande Ramverk - Ramverk för generationsöverskridande rättvisemetriker - Sida '
    }
  },

  // Pilots
  {
    name: 'conscious-governance-pilot-guides',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'conscious-governance-pilot-guides-en',
      sv: 'conscious-governance-pilot-guides-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'pilots'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'pilots')
    },
    pageFooter: {
      en: 'Consciousness Framework - Conscious Governance Pilot Guides - Page ',
      sv: 'Medvetande Ramverk - Pilotguider för medveten styrning - Sida '
    }
  },

  // Crisis Response Tools
  {
    name: 'crisis-wisdom-team-protocols',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'crisis-wisdom-team-protocols-en',
      sv: 'crisis-wisdom-team-protocols-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'crisis'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'crisis')
    },
    pageFooter: {
      en: 'Consciousness Framework - Crisis Wisdom Team Protocols - Page ',
      sv: 'Medvetande Ramverk - Protokoll för krisvisdomsteamet - Sida '
    }
  },
  {
    name: 'ethical-decision-template',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'ethical-decision-template-en',
      sv: 'ethical-decision-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'crisis'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'crisis')
    },
    pageFooter: {
      en: 'Consciousness Framework - Ethical Decision Template - Page ',
      sv: 'Medvetande Ramverk - Etiskt beslutsmall - Sida '
    }
  },

  // Full Consciousness Framework
  {
    name: 'consciousness-framework',
    category: 'consciousness-and-inner-development',
    fileNames: {
      en: 'Consciousness-Inner-Development-Framework',
      sv: 'Consciousness-Inner-Development-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Consciousness & Inner Development Implementation Framework',
      sv: 'Medvetande och inre utveckling implementeringsramverk'
    },
    // Special config for full framework
    sections: [
      'index',
      'manifesto',
      'governance-structure',
      'personal-transformation',
      'collective-consciousness',
      'systemic-integration',
      'spiral-dynamics',
      'economic-realignment',
      'community-engagement',
      'crisis-response',
      'metrics-accountability',
      'digital-platforms',
      'ethical-ai-governance',
      'cross-cultural-translation',
      'implementation-roadmap',
      'visual-architecture-map',
      'conclusion'
    ]
  },

  // Youth Leadership Hub
  {
    name: 'youth-governance-comic',
    category: 'youth',
    fileNames: {
      en: 'youth-governance-comic-en',
      sv: 'youth-governance-comic-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development')
    },
    pageFooter: {
      en: 'Youth Leadership - Comic - Page ',
      sv: 'Youth Leadership - Serie - Sida '
    }
  },
  {
    name: 'youth-community-action-guide',
    category: 'youth',
    fileNames: {
      en: 'youth-community-action-guide-en',
      sv: 'youth-community-action-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'youth'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'youth')
    },
    pageFooter: {
      en: 'Youth Leadership - Youth Community Action Guide - Page ',
      sv: 'Youth Leadership - Handledning för ungdomsaktiviteter i samhället - Sida '
    }
  },
  {
    name: 'youth-dialogue-circle-guide',
    category: 'youth',
    fileNames: {
      en: 'youth-dialogue-circle-guide-en',
      sv: 'youth-dialogue-circle-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'youth'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'youth')
    },
    pageFooter: {
      en: 'Youth Leadership - Youth Dialogue Circle Guide - Page ',
      sv: 'Youth Leadership - Guide för ungdomsdialogcirkel - Sida '
    }
  },
  {
    name: 'youth-mindfulness-guide',
    category: 'youth',
    fileNames: {
      en: 'youth-mindfulness-guide-en',
      sv: 'youth-mindfulness-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'consciousness-and-inner-development', 'youth'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'consciousness-and-inner-development', 'youth')
    },
    pageFooter: {
      en: 'Youth Leadership - Mindfulness for Young Leaders - Page ',
      sv: 'Youth Leadership - Mindfulness för unga ledare - Sida '
    }
  },

  // Aging Population Support Framework
  // Core Framework Documents
  {
    name: 'executive-summary',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'executive-summary-en',
      sv: 'executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance')
    },
    pageFooter: {
      en: 'Aging Population Support Framework - Executive Summary - Page ',
      sv: 'Åldrande Befolkningsstöd Ramverk - Sammanfattning - Sida '
    }
  },

  {
    name: 'aging-framework-essentials',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'aging-framework-essentials-en',
      sv: 'aging-framework-essentials-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance')
    },
    pageFooter: {
      en: 'Aging Population Support Framework - Essentials Guide - Page ',
      sv: 'Åldrande Befolkningsstöd Ramverk - Grundläggande Guide - Sida '
    }
  },

  // Core Implementation Tools
  {
    name: 'elder-readiness-assessment',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'elder-readiness-assessment-en',
      sv: 'elder-readiness-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'core')
    },
    pageFooter: {
      en: 'Elder Community Readiness Assessment - Page ',
      sv: 'Äldre Samhälle Beredskapsanalys - Sida '
    }
  },

  {
    name: 'aubi-pilot-template',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'aubi-pilot-template-en',
      sv: 'aubi-pilot-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'core')
    },
    pageFooter: {
      en: 'AUBI Pilot Design Template - Page ',
      sv: 'AUBI Pilot Design Mall - Sida '
    }
  },

  {
    name: 'elder-political-organizing-toolkit',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'elder-political-organizing-toolkit-en',
      sv: 'elder-political-organizing-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'core')
    },
    pageFooter: {
      en: 'Elder Political Organizing Toolkit - Page ',
      sv: 'Äldre Politisk Organisering Verktygslåda - Sida '
    }
  },

  {
    name: 'technology-governance-charter',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'technology-governance-charter-en',
      sv: 'technology-governance-charter-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'core')
    },
    pageFooter: {
      en: 'Technology Governance Charter Template - Page ',
      sv: 'Teknikstyrning Charter Mall - Sida '
    }
  },

  {
    name: 'elder-wellbeing-index-calculator',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'elder-wellbeing-index-calculator-en',
      sv: 'elder-wellbeing-index-calculator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'core')
    },
    pageFooter: {
      en: 'Elder Wellbeing Index Calculator - Page ',
      sv: 'Äldre Välbefinnande Index Kalkylator - Sida '
    }
  },

  {
    name: 'climate-wisdom-documentation-kit',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'climate-wisdom-documentation-kit-en',
      sv: 'climate-wisdom-documentation-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'core')
    },
    pageFooter: {
      en: 'Climate Wisdom Documentation Kit - Page ',
      sv: 'Klimatvisdom Dokumentationskit - Sida '
    }
  },

  // Advocacy and Scaling Tools
  {
    name: 'ageism-interruption-training-guide',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'ageism-interruption-training-guide-en',
      sv: 'ageism-interruption-training-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'advocacy')
    },
    pageFooter: {
      en: 'Ageism Interruption Training Guide - Page ',
      sv: 'Åldersdiskriminering Avbrott Träningsguide - Sida '
    }
  },

  {
    name: 'aging-rights-charter',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'aging-rights-charter-en',
      sv: 'aging-rights-charter-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'advocacy')
    },
    pageFooter: {
      en: 'Rights of Aging Beings Charter Template - Page ',
      sv: 'Rättigheter för Åldrande Varelser Charter Mall - Sida '
    }
  },

  {
    name: 'elder-economic-zone-toolkit',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'elder-economic-zone-toolkit-en',
      sv: 'elder-economic-zone-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'advocacy')
    },
    pageFooter: {
      en: 'Elder Economic Zone Planning Toolkit - Page ',
      sv: 'Äldre Ekonomisk Zon Planeringsverktygslåda - Sida '
    }
  },

  {
    name: 'aubi-economic-modeling-tool',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'aubi-economic-modeling-tool-en',
      sv: 'aubi-economic-modeling-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'advocacy')
    },
    pageFooter: {
      en: 'AUBI Economic Modeling Tool - Page ',
      sv: 'AUBI Ekonomisk Modelleringsverktyg - Sida '
    }
  },

  // Elder Agency and Innovation Tools
  {
    name: 'mutual-care-network-setup-guide',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'mutual-care-network-setup-guide-en',
      sv: 'mutual-care-network-setup-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'agency-and-innovation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'agency-and-innovation')
    },
    pageFooter: {
      en: 'Mutual Care Network Setup Guide - Page ',
      sv: 'Ömsesidig Vård Nätverk Inställningsguide - Sida '
    }
  },

  {
    name: 'elder-innovation-hub-playbook',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'elder-innovation-hub-playbook-en',
      sv: 'elder-innovation-hub-playbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'agency-and-innovation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'agency-and-innovation')
    },
    pageFooter: {
      en: 'Elder Innovation Hub Playbook - Page ',
      sv: 'Äldre Innovation Hub Spelbok - Sida '
    }
  },

  {
    name: 'intergenerational-program-templates',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'intergenerational-program-templates-en',
      sv: 'intergenerational-program-templates-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance', 'agency-and-innovation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance', 'agency-and-innovation')
    },
    pageFooter: {
      en: 'Intergenerational Program Templates - Page ',
      sv: 'Intergenerationella Programmallar - Sida '
    }
  },

  // Full Aging Framework
  {
    name: 'aging-framework',
    category: 'aging-population-support-governance',
    fileNames: {
      en: 'Aging-Population-Support-Framework',
      sv: 'Aging-Population-Support-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aging-population-support-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aging-population-support-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Aging Population Support Framework',
      sv: 'Åldrande befolkningsstödsramverk'
    },
    // Special config for full framework
    sections: [
      'index',
      'preamble',
      'economic-security',
      'meaningful-occupation',
      'healthcare-climate',
      'social-inclusion',
      'nested-governance',
      'legal-ethical',
      'implementation-roadmap',
      'monitoring-adaptive',
      'call-to-action',
      'appendices'
    ]
  },

  // Animal Welfare Framework
  // Core Framework Documents
  {
    name: 'global-guardian-framework-essentials',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'global-guardian-framework-essentials-en',
      sv: 'global-guardian-framework-essentials-sv',
      es: 'global-guardian-framework-essentials-es',
      fr: 'global-guardian-framework-essentials-fr'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance'),
      es: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'es', 'implementation', 'animal-welfare-governance'),
      fr: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'fr', 'implementation', 'animal-welfare-governance')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Global Guardian Framework Essentials - Page ',
      sv: 'Djurskyddsramverk - Globalt skyddsramverk, grundprinciper - Sida ',
      es: 'Marco de Bienestar Animal - Marco de Protección Global, Principios Básicos - Página ',
      fr: 'Cadre de protection des animaux - Cadre mondial de protection, Principes fondamentaux - Page ',
    }
  },
  {
    name: 'executive-summary',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'executive-summary-en',
      sv: 'executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Executive Summary - Page ',
      sv: 'Djurskyddsramverk - Sammanfattning - Sida '
    }
  },

  // Core Implementation Tools
  {
    name: 'community-welfare-readiness-assessment',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'community-welfare-readiness-assessment-en',
      sv: 'community-welfare-readiness-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'core')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Community Welfare Readiness Assessment - Page ',
      sv: 'Djurskyddsramverk - Samhällsberedskap för djurvälfärd - Sida '
    }
  },

  {
    name: 'cultural-adaptation-protocol-guide',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'cultural-adaptation-protocol-guide-en',
      sv: 'cultural-adaptation-protocol-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'core')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Cultural Adaptation Protocol Guide - Page ',
      sv: 'Djurskyddsramverk - Kulturell anpassningsprotokoll - Sida '
    }
  },

  {
    name: 'indigenous-rights-integration-kit',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'indigenous-rights-integration-kit-en',
      sv: 'indigenous-rights-integration-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'core')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Indigenous Rights Integration Kit - Page ',
      sv: 'Djurskyddsramverk - Ursprungsbefolkningens rättighetsintegration - Sida '
    }
  },

  {
    name: 'sentience-assessment-framework',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'sentience-assessment-framework-en',
      sv: 'sentience-assessment-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'core')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Sentience Assessment Framework - Page ',
      sv: 'Djurskyddsramverk - Ramverk för bedömning av medvetenhet - Sida '
    }
  },

  {
    name: 'welfare-compliance-audit-tool',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'welfare-compliance-audit-tool-en',
      sv: 'welfare-compliance-audit-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'core')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Welfare Compliance Audit Tool - Page ',
      sv: 'Djurskyddsramverk - Verktyg för välfärdsrevisioner - Sida '
    }
  },

  {
    name: 'welfare-transition-planning-template',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'welfare-transition-planning-template-en',
      sv: 'welfare-transition-planning-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'core')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Welfare Transition Planning Template - Page ',
      sv: 'Djurskyddsramverk - Mall för övergångsplanering - Sida '
    }
  },

  // Advocacy and Policy Tools
  {
    name: 'anti-speciesism-training-materials',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'anti-speciesism-training-materials-en',
      sv: 'anti-speciesism-training-materials-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'advocacy')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Anti-Speciesism Training Materials - Page ',
      sv: 'Djurskyddsramverk - Utbildningsmaterial mot artdiskriminering - Sida '
    }
  },

  {
    name: 'economic-impact-assessment',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'economic-impact-assessment-en',
      sv: 'economic-impact-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'advocacy')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Economic Impact Assessment - Page ',
      sv: 'Djurskyddsramverk - Ekonomisk konsekvensanalys - Sida '
    }
  },

  {
    name: 'guardian-rights-charter-template',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'guardian-rights-charter-template-en',
      sv: 'guardian-rights-charter-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'advocacy')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Guardian Rights Charter Template - Page ',
      sv: 'Djurskyddsramverk - Mall för skyddsrättighetsstadga - Sida '
    }
  },

  {
    name: 'stakeholder-engagement-framework',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'stakeholder-engagement-framework-en',
      sv: 'stakeholder-engagement-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'advocacy')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Stakeholder Engagement Framework - Page ',
      sv: 'Djurskyddsramverk - Ramverk för intressentengagemang - Sida '
    }
  },

  {
    name: 'welfare-policy-development-guide',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'welfare-policy-development-guide-en',
      sv: 'welfare-policy-development-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'advocacy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'advocacy')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Welfare Policy Development Guide - Page ',
      sv: 'Djurskyddsramverk - Guide för utveckling av välfärdspolitik - Sida '
    }
  },

  // Evaluation and Monitoring Tools
  {
    name: 'community-progress-tracking-templates',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'community-progress-tracking-templates-en',
      sv: 'community-progress-tracking-templates-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'evaluation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'evaluation')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Community Progress Tracking Templates - Page ',
      sv: 'Djurskyddsramverk - Mallar för samhällsframstegsspårning - Sida '
    }
  },

  {
    name: 'transparency-dashboard-setup-guide',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'transparency-dashboard-setup-guide-en',
      sv: 'transparency-dashboard-setup-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'evaluation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'evaluation')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Transparency Dashboard Setup Guide - Page ',
      sv: 'Djurskyddsramverk - Guide för transparensplattform - Sida '
    }
  },

  {
    name: 'welfare-impact-measurement-framework',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'welfare-impact-measurement-framework-en',
      sv: 'welfare-impact-measurement-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'evaluation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'evaluation')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Welfare Impact Measurement Framework - Page ',
      sv: 'Djurskyddsramverk - Ramverk för välfärdsmätning - Sida '
    }
  },

  // Innovation and Technology Tools
  {
    name: 'alternative-protein-development-guide',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'alternative-protein-development-guide-en',
      sv: 'alternative-protein-development-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'innovation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'innovation')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Alternative Protein Development Guide - Page ',
      sv: 'Djurskyddsramverk - Guide för alternativ proteinutveckling - Sida '
    }
  },

  {
    name: 'blockchain-certification-setup-guide',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'blockchain-certification-setup-guide-en',
      sv: 'blockchain-certification-setup-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'innovation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'innovation')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Blockchain Certification Setup Guide - Page ',
      sv: 'Djurskyddsramverk - Guide för blockchain-certifiering - Sida '
    }
  },

  {
    name: 'citizen-science-monitoring-app',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'citizen-science-monitoring-app-en',
      sv: 'citizen-science-monitoring-app-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'innovation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'innovation')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Citizen Science Monitoring App - Page ',
      sv: 'Djurskyddsramverk - Medborgarvetenskapsapp för övervakning - Sida '
    }
  },

  {
    name: 'welfare-technology-assessment-kit',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'welfare-technology-assessment-kit-en',
      sv: 'welfare-technology-assessment-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'innovation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'innovation')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Welfare Technology Assessment Kit - Page ',
      sv: 'Djurskyddsramverk - Bedömningskit för välfärdsteknologi - Sida '
    }
  },

  // Transition and Economic Tools
  {
    name: 'animal-welfare-carbon-credits-guide',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'animal-welfare-carbon-credits-guide-en',
      sv: 'animal-welfare-carbon-credits-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'transition'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'transition')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Animal Welfare Carbon Credits Guide - Page ',
      sv: 'Djurskyddsramverk - Guide för kolkrediter och djurvälfärd - Sida '
    }
  },

  {
    name: 'cooperative-development-toolkit',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'cooperative-development-toolkit-en',
      sv: 'cooperative-development-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'transition'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'transition')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Cooperative Development Toolkit - Page ',
      sv: 'Djurskyddsramverk - Verktygslåda för kooperativ utveckling - Sida '
    }
  },

  {
    name: 'innovation-challenge-fund-kit',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'innovation-challenge-fund-kit-en',
      sv: 'innovation-challenge-fund-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'transition'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'transition')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Innovation Challenge Fund Kit - Page ',
      sv: 'Djurskyddsramverk - Kit för innovationsutmaningsfond - Sida '
    }
  },

  {
    name: 'just-transition-planning-workbook',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'just-transition-planning-workbook-en',
      sv: 'just-transition-planning-workbook-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance', 'transition'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance', 'transition')
    },
    pageFooter: {
      en: 'Animal Welfare Framework - Just Transition Planning Workbook - Page ',
      sv: 'Djurskyddsramverk - Arbetsbok för rättvis övergång - Sida '
    }
  },

  // Full Animal Welfare Framework
  {
    name: 'animal-welfare-framework',
    category: 'animal-welfare-governance',
    fileNames: {
      en: 'Animal-Welfare-Framework',
      sv: 'Animal-Welfare-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'animal-welfare-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'animal-welfare-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Animal Welfare Framework',
      sv: 'Djurskyddsramverk'
    },
    // Special config for full framework
    sections: [
      'index',
      'introduction',
      'core-principles',
      'structural-components',
      'implementation-approaches',
      'metrics-evaluation',
      'cultural-justice',
      'environmental-integration',
      'appendices'
    ]
  },

  // Water & Sanitation Framework
  // Executive Materials
  {
    name: 'executive-summary',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'executive-summary-en',
      sv: 'executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Executive Summary - Page ',
      sv: 'Vatten och sanitetsramverk - Sammanfattning - Sida '
    }
  },

  {
    name: 'quick-implementation-guide',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'quick-implementation-guide-en',
      sv: 'quick-implementation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Quick Implementation Guide - Page ',
      sv: 'Vatten och sanitetsramverk - Snabb implementeringsguide - Sida '
    }
  },

  {
    name: 'youth-leadership-guide',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'youth-leadership-guide-en',
      sv: 'youth-leadership-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Youth Leadership Guide - Page ',
      sv: 'Vatten och sanitetsramverk - Ungdomsledarskapguide - Sida '
    }
  },

  // Core Governance Tools
  {
    name: 'community-water-assembly-guide',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'community-water-assembly-guide-en',
      sv: 'community-water-assembly-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'core')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Community Water Assembly Guide - Page ',
      sv: 'Vatten och sanitetsramverk - Guide för kommunala vattenförsamlingar - Sida '
    }
  },

  {
    name: 'power-analysis-toolkit',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'power-analysis-toolkit-en',
      sv: 'power-analysis-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'core')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Power Analysis Toolkit - Page ',
      sv: 'Vatten och sanitetsramverk - Maktanalysverktyg - Sida '
    }
  },

  {
    name: 'wash-constitutional-amendment-toolkit',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'wash-constitutional-amendment-toolkit-en',
      sv: 'wash-constitutional-amendment-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'core')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Constitutional Amendment Toolkit - Page ',
      sv: 'Vatten och sanitetsramverk - Grundlagsändring verktyg - Sida '
    }
  },

  {
    name: 'water-rights-legal-template',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'water-rights-legal-template-en',
      sv: 'water-rights-legal-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'core')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Water Rights Legal Template - Page ',
      sv: 'Vatten och sanitetsramverk - Vattenrättslig mall - Sida '
    }
  },

  // Financial Planning Tools
  {
    name: 'carbon-water-credit-calculator',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'carbon-water-credit-calculator-en',
      sv: 'carbon-water-credit-calculator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'financial-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'financial-systems')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Carbon-Water Credit Calculator - Page ',
      sv: 'Vatten och sanitetsramverk - Kalkylator för kolvatten-krediter - Sida '
    }
  },

  {
    name: 'circular-finance-planning-tool',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'circular-finance-planning-tool-en',
      sv: 'circular-finance-planning-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'financial-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'financial-systems')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Circular Finance Planning Tool - Page ',
      sv: 'Vatten och sanitetsramverk - Cirkulär finansplaneringsverktyg - Sida '
    }
  },

  {
    name: 'community-equity-model-template',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'community-equity-model-template-en',
      sv: 'community-equity-model-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'financial-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'financial-systems')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Community Equity Model Template - Page ',
      sv: 'Vatten och sanitetsramverk - Mall för samhällelig rättvisemodell - Sida '
    }
  },

  {
    name: 'wash-sovereign-wealth-fund-model',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'wash-sovereign-wealth-fund-model-en',
      sv: 'wash-sovereign-wealth-fund-model-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'financial-systems'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'financial-systems')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - WASH Sovereign Wealth Fund Model - Page ',
      sv: 'Vatten och sanitetsramverk - WASH statsfondmodell - Sida '
    }
  },

  // Monitoring & Evaluation Tools
  {
    name: 'community-monitoring-toolkit',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'community-monitoring-toolkit-en',
      sv: 'community-monitoring-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'monitoring'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'monitoring')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Community Monitoring Toolkit - Page ',
      sv: 'Vatten och sanitetsramverk - Verktyg för samhällsövervakning - Sida '
    }
  },

  {
    name: 'hydrological-justice-assessment',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'hydrological-justice-assessment-en',
      sv: 'hydrological-justice-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'monitoring'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'monitoring')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Hydrological Justice Assessment - Page ',
      sv: 'Vatten och sanitetsramverk - Hydrologisk rättvisa bedömning - Sida '
    }
  },

  {
    name: 'performance-dashboard-template',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'performance-dashboard-template-en',
      sv: 'performance-dashboard-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'monitoring'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'monitoring')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Performance Dashboard Template - Page ',
      sv: 'Vatten och sanitetsramverk - Mall för prestationsinstrumentpanel - Sida '
    }
  },

  // Technology & Innovation Tools
  {
    name: 'ai-bias-audit-framework',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'ai-bias-audit-framework-en',
      sv: 'ai-bias-audit-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'technology'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'technology')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - AI Bias Audit Framework - Page ',
      sv: 'Vatten och sanitetsramverk - AI bias granskningsramverk - Sida '
    }
  },

  {
    name: 'microgrid-planning-toolkit',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'microgrid-planning-toolkit-en',
      sv: 'microgrid-planning-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'technology'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'technology')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Microgrid Planning Toolkit - Page ',
      sv: 'Vatten och sanitetsramverk - Mikronät planeringsverktyg - Sida '
    }
  },

  {
    name: 'open-source-wash-tech-library',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'open-source-wash-tech-library-en',
      sv: 'open-source-wash-tech-library-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'technology'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'technology')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Open Source WASH Tech Library - Page ',
      sv: 'Vatten och sanitetsramverk - Öppen källkod WASH teknikbibliotek - Sida '
    }
  },

  {
    name: 'traditional-knowledge-protection',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'traditional-knowledge-protection-en',
      sv: 'traditional-knowledge-protection-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'technology'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'technology')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Traditional Knowledge Protection - Page ',
      sv: 'Vatten och sanitetsramverk - Traditionell kunskapsskydd - Sida '
    }
  },

  // Crisis Response Tools
  {
    name: 'climate-adaptation-planning-tool',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'climate-adaptation-planning-tool-en',
      sv: 'climate-adaptation-planning-tool-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'crisis'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'crisis')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Climate Adaptation Planning Tool - Page ',
      sv: 'Vatten och sanitetsramverk - Klimatanpassning planeringsverktyg - Sida '
    }
  },

  {
    name: 'conflict-sensitive-wash-guidelines',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'conflict-sensitive-wash-guidelines-en',
      sv: 'conflict-sensitive-wash-guidelines-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'crisis'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'crisis')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Conflict-Sensitive WASH Guidelines - Page ',
      sv: 'Vatten och sanitetsramverk - Konfliktkänsliga WASH riktlinjer - Sida '
    }
  },

  {
    name: 'emergency-wash-response-protocols',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'emergency-wash-response-protocols-en',
      sv: 'emergency-wash-response-protocols-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance', 'crisis'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance', 'crisis')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework - Emergency WASH Response Protocols - Page ',
      sv: 'Vatten och sanitetsramverk - Nödläge WASH responsprotokoll - Sida '
    }
  },

  // Full Water and Sanitation Framework
  {
    name: 'water-framework',
    category: 'water-and-sanitation-governance',
    fileNames: {
      en: 'Water-&-Sanitation-Framework',
      sv: 'Water-&-Sanitation-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'water-and-sanitation-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'water-and-sanitation-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Water & Sanitation Framework',
      sv: 'Vatten och sanitetsramverk'
    },
    // Special config for full framework
    sections: [
      'index',
      'theory-of-change',
      'guiding-principles',
      'institutional-policy-framework',
      'financing-investment',
      'service-delivery-infrastructure',
      'monitoring-accountability',
      'climate-environmental-integration',
      'innovation-knowledge-sharing',
      'crisis-response-adaptation',
      'social-behavioral-change',
      'global-partnerships',
      'ethical-systems-framing',
      'implementation-roadmap',
      'regional-implementation-blueprints',
      'visual-accessibility-aids',
      'glossary'
    ]
  },

  // Indigenous & Traditional Knowledge Framework
  
  // Executive Materials
  {
    name: 'indigenous-framework-essentials',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'indigenous-framework-essentials-en',
      sv: 'indigenous-framework-essentials-sv',
      fr: 'indigenous-framework-essentials-fr',
      es: 'indigenous-framework-essentials-es'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge'),
      fr: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'fr', 'implementation', 'indigenous-governance-and-traditional-knowledge'),
      es: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'es', 'implementation', 'indigenous-governance-and-traditional-knowledge')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Framework Essentials - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Ramverkets grunder - Sida ',
      fr: 'Cadre des connaissances autochtones et traditionnelles - Éléments essentiels du cadre - Page ',
      es: 'Marco de conocimientos indígenas y tradicionales: elementos esenciales del marco - Página '

    }
  },

  // Core Governance Tools
  {
    name: 'baz-readiness-assessment',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'baz-readiness-assessment-en',
      sv: 'baz-readiness-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - BAZ Readiness Assessment - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - BAZ-beredskapsanalys - Sida '
    }
  },

  {
    name: 'earth-council-formation-guide',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'earth-council-formation-guide-en',
      sv: 'earth-council-formation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Earth Council Formation Guide - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Jordrådsformationsguide - Sida '
    }
  },

  {
    name: 'indigenous-data-sovereignty-framework',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'indigenous-data-sovereignty-framework-en',
      sv: 'indigenous-data-sovereignty-framework-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Data Sovereignty Framework - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Datasuveränitetsramverk - Sida '
    }
  },

  {
    name: 'municipal-indigenous-agreement',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'municipal-indigenous-agreement-en',
      sv: 'municipal-indigenous-agreement-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Municipal-Indigenous Agreement - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Kommunal-ursprungsfolksavtal - Sida '
    }
  },

  {
    name: 'tek-documentation-kit',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'tek-documentation-kit-en',
      sv: 'tek-documentation-kit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'core')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - TEK Documentation Kit - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - TEK-dokumentationskit - Sida '
    }
  },

  // Cultural and Leadership Tools
  {
    name: 'ceremonial-governance-integration-guide',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'ceremonial-governance-integration-guide-en',
      sv: 'ceremonial-governance-integration-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'cultural-and-leadership'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'cultural-and-leadership')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Ceremonial Governance Integration - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Ceremoniell styrningsintegration - Sida '
    }
  },

  {
    name: 'cultural-integrity-replication-protocol',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'cultural-integrity-replication-protocol-en',
      sv: 'cultural-integrity-replication-protocol-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'cultural-and-leadership'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'cultural-and-leadership')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Cultural Integrity Protocol - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Kulturell integritetsprotokoll - Sida '
    }
  },

  {
    name: 'indigenous-leadership-development-program',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'indigenous-leadership-development-program-en',
      sv: 'indigenous-leadership-development-program-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'cultural-and-leadership'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'cultural-and-leadership')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Leadership Development Program - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Ledarutvecklingsprogram - Sida '
    }
  },

  {
    name: 'storytelling-media-strategy-toolkit',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'storytelling-media-strategy-toolkit-en',
      sv: 'storytelling-media-strategy-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'cultural-and-leadership'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'cultural-and-leadership')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Storytelling & Media Strategy - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Berättande och mediestrategi - Sida '
    }
  },

  // Economic and Legal Tools
  {
    name: 'gph-index-calculator',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'gph-index-calculator-en',
      sv: 'gph-index-calculator-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'economic-and-legal'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'economic-and-legal')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - GPH Index Calculator - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - GPH-indexkalkylator - Sida '
    }
  },

  {
    name: 'land-rematriation-template',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'land-rematriation-template-en',
      sv: 'land-rematriation-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'economic-and-legal'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'economic-and-legal')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Land Rematriation Template - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Mall för jordåterlämnande - Sida '
    }
  },

  {
    name: 'legal-strategy-guide',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'legal-strategy-guide-en',
      sv: 'legal-strategy-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'economic-and-legal'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'economic-and-legal')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Legal Strategy Guide - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Juridisk strategiguide - Sida '
    }
  },

  {
    name: 'reparations-toolkit',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'reparations-toolkit-en',
      sv: 'reparations-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'economic-and-legal'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'economic-and-legal')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Reparations Toolkit - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Skadeståndstoolkit - Sida '
    }
  },

  // Technology Tools
  {
    name: 'ai-governance-protocols',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'ai-governance-protocols-en',
      sv: 'ai-governance-protocols-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'technology'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'technology')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - AI Governance Protocols - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - AI-styrningsprotokoll - Sida '
    }
  },

  {
    name: 'cybersecurity-quantum-guide',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'cybersecurity-quantum-guide-en',
      sv: 'cybersecurity-quantum-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'technology'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge', 'technology')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework - Cybersecurity & Quantum Guide - Page ',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap - Cybersäkerhet och kvantguide - Sida '
    }
  },

  // Full Indigenous & Traditional Knowledge Framework
  {
    name: 'indigenous-framework',
    category: 'indigenous-governance-and-traditional-knowledge',
    fileNames: {
      en: 'Indigenous-&-Traditional-Knowledge-Framework',
      sv: 'Indigenous-&-Traditional-Knowledge-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'indigenous-governance-and-traditional-knowledge'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'indigenous-governance-and-traditional-knowledge')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Indigenous & Traditional Knowledge Framework',
      sv: 'Ramverk för ursprungsfolk och traditionell kunskap'
    },
    // Special config for full framework
    sections: [
      'index',
      'preamble',
      'core-principles',
      'structural-components',
      'implementation-timeline',
      'key-mechanisms',
      'expected-outcomes',
      'interface-existing-systems',
      'pathways-broader-engagement',
      'documentation-risk-assessment',
      'system-map-visual',
      'glossary-references'
    ]
  },

  // Mental Health Framework
  // Core Guides
  {
    name: 'mental-health-framework-essentials',
    category: 'mental-health-governance',
    fileNames: {
      en: 'mental-health-framework-essentials-en',
      sv: 'mental-health-framework-essentials-sv',
      es: 'mental-health-framework-essentials-es',
      fr: 'mental-health-framework-essentials-fr',
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance'),
      es: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'es', 'implementation', 'mental-health-governance'),
      fr: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'fr', 'implementation', 'mental-health-governance')
    },
    pageFooter: {
      en: 'Mental Health Framework - Guide - Page ',
      sv: 'Psykisk hälsoramverk - Guide - Sida ',
      fr: 'Cadre de santé mentale - Guide - Page ',
      es: 'Marco de Salud Mental - Guía - Página '
    }
  },

  {
    name: 'executive-summary',
    category: 'mental-health-governance',
    fileNames: {
      en: 'executive-summary-en',
      sv: 'executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance')
    },
    pageFooter: {
      en: 'Mental Health Framework - Executive Summary - Page ',
      sv: 'Psykisk hälsoramverk - Sammanfattning - Sida '
    }
  },

  // Quick Start Implementation Tools
  {
    name: 'path-to-compliance-checklist',
    category: 'mental-health-governance',
    fileNames: {
      en: 'path-to-compliance-checklist-en',
      sv: 'path-to-compliance-checklist-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'quick-start'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'quick-start')
    },
    pageFooter: {
      en: 'Mental Health Framework - Quick Start Tool - Page ',
      sv: 'Psykisk hälsoramverk - Snabbstartsverktyg - Sida '
    }
  },

  {
    name: 'community-task-force-guide',
    category: 'mental-health-governance',
    fileNames: {
      en: 'community-task-force-guide-en',
      sv: 'community-task-force-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'quick-start'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'quick-start')
    },
    pageFooter: {
      en: 'Mental Health Framework - Community Guide - Page ',
      sv: 'Psykisk hälsoramverk - Gemenskapsguide - Sida '
    }
  },

  {
    name: 'cultural-adaptation-toolkit',
    category: 'mental-health-governance',
    fileNames: {
      en: 'cultural-adaptation-toolkit-en',
      sv: 'cultural-adaptation-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'quick-start'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'quick-start')
    },
    pageFooter: {
      en: 'Mental Health Framework - Cultural Toolkit - Page ',
      sv: 'Psykisk hälsoramverk - Kulturell verktygslåda - Sida '
    }
  },

  {
    name: 'watchdog-implementation-manual',
    category: 'mental-health-governance',
    fileNames: {
      en: 'watchdog-implementation-manual-en',
      sv: 'watchdog-implementation-manual-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'quick-start'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'quick-start')
    },
    pageFooter: {
      en: 'Mental Health Framework - Watchdog Manual - Page ',
      sv: 'Psykisk hälsoramverk - Övervakningsmanual - Sida '
    }
  },

  {
    name: 'traffic-light-assessment',
    category: 'mental-health-governance',
    fileNames: {
      en: 'traffic-light-assessment-en',
      sv: 'traffic-light-assessment-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'quick-start'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'quick-start')
    },
    pageFooter: {
      en: 'Mental Health Framework - Assessment Tool - Page ',
      sv: 'Psykisk hälsoramverk - Bedömningsverktyg - Sida '
    }
  },

  // Governance & Policy Tools
  {
    name: 'national-commission-guide',
    category: 'mental-health-governance',
    fileNames: {
      en: 'national-commission-guide-en',
      sv: 'national-commission-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'governance-and-policy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'governance-and-policy')
    },
    pageFooter: {
      en: 'Mental Health Framework - Governance Guide - Page ',
      sv: 'Psykisk hälsoramverk - Styrningsguide - Sida '
    }
  },

  {
    name: 'rights-based-legislation-template',
    category: 'mental-health-governance',
    fileNames: {
      en: 'rights-based-legislation-template-en',
      sv: 'rights-based-legislation-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'governance-and-policy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'governance-and-policy')
    },
    pageFooter: {
      en: 'Mental Health Framework - Legal Template - Page ',
      sv: 'Psykisk hälsoramverk - Juridisk mall - Sida '
    }
  },

  {
    name: 'international-treaty-roadmap',
    category: 'mental-health-governance',
    fileNames: {
      en: 'international-treaty-roadmap-en',
      sv: 'international-treaty-roadmap-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'governance-and-policy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'governance-and-policy')
    },
    pageFooter: {
      en: 'Mental Health Framework - Treaty Guide - Page ',
      sv: 'Psykisk hälsoramverk - Fördragsguide - Sida '
    }
  },

  {
    name: 'youth-parliament-charter',
    category: 'mental-health-governance',
    fileNames: {
      en: 'youth-parliament-charter-en',
      sv: 'youth-parliament-charter-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'governance-and-policy'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'governance-and-policy')
    },
    pageFooter: {
      en: 'Mental Health Framework - Youth Charter - Page ',
      sv: 'Psykisk hälsoramverk - Ungdomscharter - Sida '
    }
  },

  // Clinical & Service Tools
  {
    name: 'spiritual-crisis-decision-trees',
    category: 'mental-health-governance',
    fileNames: {
      en: 'spiritual-crisis-decision-trees-en',
      sv: 'spiritual-crisis-decision-trees-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'clinical-and-service'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'clinical-and-service')
    },
    pageFooter: {
      en: 'Mental Health Framework - Clinical Tool - Page ',
      sv: 'Psykisk hälsoramverk - Kliniskt verktyg - Sida '
    }
  },

  {
    name: 'consciousness-development-guide',
    category: 'mental-health-governance',
    fileNames: {
      en: 'consciousness-development-guide-en',
      sv: 'consciousness-development-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'clinical-and-service'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'clinical-and-service')
    },
    pageFooter: {
      en: 'Mental Health Framework - Consciousness Guide - Page ',
      sv: 'Psykisk hälsoramverk - Medvetandeguide - Sida '
    }
  },

  {
    name: 'consciousness-healing-protocols',
    category: 'mental-health-governance',
    fileNames: {
      en: 'consciousness-healing-protocols-en',
      sv: 'consciousness-healing-protocols-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'clinical-and-service'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'clinical-and-service')
    },
    pageFooter: {
      en: 'Mental Health Framework - Healing Protocols - Page ',
      sv: 'Psykisk hälsoramverk - Helande protokoll - Sida '
    }
  },

  {
    name: 'traditional-healing-integration-guidelines',
    category: 'mental-health-governance',
    fileNames: {
      en: 'traditional-healing-integration-guidelines-en',
      sv: 'traditional-healing-integration-guidelines-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'clinical-and-service'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'clinical-and-service')
    },
    pageFooter: {
      en: 'Mental Health Framework - Traditional Healing Guide - Page ',
      sv: 'Psykisk hälsoramverk - Traditionell helande guide - Sida '
    }
  },

  {
    name: 'psychedelic-therapy-lab-guide',
    category: 'mental-health-governance',
    fileNames: {
      en: 'psychedelic-therapy-lab-guide-en',
      sv: 'psychedelic-therapy-lab-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'clinical-and-service'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'clinical-and-service')
    },
    pageFooter: {
      en: 'Mental Health Framework - Therapy Lab Guide - Page ',
      sv: 'Psykisk hälsoramverk - Terapilabbguide - Sida '
    }
  },

  // Financing & Economics Tools
  {
    name: 'commons-fund-blueprint',
    category: 'mental-health-governance',
    fileNames: {
      en: 'commons-fund-blueprint-en',
      sv: 'commons-fund-blueprint-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'financing-and-economic'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'financing-and-economic')
    },
    pageFooter: {
      en: 'Mental Health Framework - Fund Blueprint - Page ',
      sv: 'Psykisk hälsoramverk - Fondritning - Sida '
    }
  },

  {
    name: 'right-to-rest-policy-guide',
    category: 'mental-health-governance',
    fileNames: {
      en: 'right-to-rest-policy-guide-en',
      sv: 'right-to-rest-policy-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'financing-and-economic'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'financing-and-economic')
    },
    pageFooter: {
      en: 'Mental Health Framework - Policy Guide - Page ',
      sv: 'Psykisk hälsoramverk - Policyguide - Sida '
    }
  },

  // Monitoring & Evaluation Tools
  {
    name: 'flourishing-metrics-dashboard-spec',
    category: 'mental-health-governance',
    fileNames: {
      en: 'flourishing-metrics-dashboard-spec-en',
      sv: 'flourishing-metrics-dashboard-spec-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'monitoring-and-evaluation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'monitoring-and-evaluation')
    },
    pageFooter: {
      en: 'Mental Health Framework - Dashboard Spec - Page ',
      sv: 'Psykisk hälsoramverk - Instrumentpanelspec - Sida '
    }
  },

  {
    name: 'community-monitoring-toolkit',
    category: 'mental-health-governance',
    fileNames: {
      en: 'community-monitoring-toolkit-en',
      sv: 'community-monitoring-toolkit-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'monitoring-and-evaluation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'monitoring-and-evaluation')
    },
    pageFooter: {
      en: 'Mental Health Framework - Monitoring Toolkit - Page ',
      sv: 'Psykisk hälsoramverk - Övervakningsverktygslåda - Sida '
    }
  },

  {
    name: 'narrative-equity-review-guide',
    category: 'mental-health-governance',
    fileNames: {
      en: 'narrative-equity-review-guide-en',
      sv: 'narrative-equity-review-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'monitoring-and-evaluation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'monitoring-and-evaluation')
    },
    pageFooter: {
      en: 'Mental Health Framework - Review Guide - Page ',
      sv: 'Psykisk hälsoramverk - Granskningsguide - Sida '
    }
  },

  {
    name: 'transparency-dashboard-template',
    category: 'mental-health-governance',
    fileNames: {
      en: 'transparency-dashboard-template-en',
      sv: 'transparency-dashboard-template-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance', 'monitoring-and-evaluation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance', 'monitoring-and-evaluation')
    },
    pageFooter: {
      en: 'Mental Health Framework - Dashboard Template - Page ',
      sv: 'Psykisk hälsoramverk - Instrumentpanelmall - Sida '
    }
  },

  // Full Mental Health Framework
  {
    name: 'mental-health-framework',
    category: 'mental-health-governance',
    fileNames: {
      en: 'Mental-Health-Framework',
      sv: 'Mental-Health-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'mental-health-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'mental-health-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Mental Health Framework',
      sv: 'Psykisk hälsoramverk'
    },
    // Special config for full framework
    sections: [
      'index',
      'vision-principles',
      'governance-structures',
      'legal-policy',
      'financing-resources',
      'service-delivery',
      'monitoring-accountability',
      'crisis-response',
      'innovation-research',
      'cross-cutting-themes',
      'implementation-strategy',
      'political-strategy',
      'risk-management',
      'technology-implementation',
      'change-management',
      'conclusion',
    ]
  },

  // Treaty for Our Only Home
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'treaty-for-our-only-home',
    fileNames: {
      en: 'treaty-for-our-only-home-executive-summary-en',
      sv: 'treaty-for-our-only-home-executive-summary-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'treaty-for-our-only-home'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'treaty-for-our-only-home')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets','pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets','pdf')
    },
    pageFooter: {
      en: 'Treaty for Our Only Home - Executive Summary for the Skeptic - Page ',
      sv: 'Fördraget för vårt enda hem - Sammanfattning för skeptikern - Sida '
    }
  },
  {
    name: 'treaty-framework-essentials',
    category: 'treaty-for-our-only-home',
    fileNames: {
      en: 'treaty-framework-essentials-en',
      sv: 'treaty-framework-essentials-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'treaty-for-our-only-home'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'treaty-for-our-only-home')
    },
    pageFooter: {
      en: 'Treaty for Our Only Home - Framework Essentials - Page ',
      sv: 'Fördraget för vårt enda hem - Ramverket i korthet - Sida '
    }
  },
  {
    name: 'treaty-at-a-glance-reference-card',
    category: 'treaty-for-our-only-home',
    fileNames: {
      en: 'treaty-at-a-glance-reference-card-en',
      sv: 'treaty-at-a-glance-reference-card-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'treaty-for-our-only-home', 'tools'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'treaty-for-our-only-home', 'tools')
    },
    pageFooter: {
      en: 'Treaty for Our Only Home - Treaty at a Glance Reference Card - Page ',
      sv: 'Fördraget för vårt enda hem - Referenskort för fördraget i korthet - Sida '
    }
  },
  {
    name: 'treaty-for-our-only-home',
    category: 'treaty-for-our-only-home',
    fileNames: {
      en: 'Treaty-for-Our-Only-Home',
      sv: 'Treaty-for-Our-Only-Home'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'treaty-for-our-only-home'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'treaty-for-our-only-home')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Treaty for Our Only Home - Global Institutional Reform Framework',
      sv: 'Fördraget för vårt enda hem - Globalt institutionellt reform-ramverk'
    },
    // Special config for full framework
    sections: [
      'introduction',
      'index',
      'executive-summary-for-the-skeptic',
      'introduction',
      'core-principles',
      'five-pillars',
      'implementation-strategies',
      'monitoring-evaluation',
      'conclusion',
      'faq-and-challenges',
      'glossary'
    ]
  },

  // Get involved: Guides
  {
    name: 'website-guide',
    category: 'get-involved',
    fileNames: {
      en: 'website-guide-en',
      sv: 'website-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'website', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'website', 'sv'),
    },
    pageFooter: {
      en: 'Contributing to the Global Governance Frameworks Website - Page ',
      sv: 'Guide för att bidra till Global Governance Frameworks webbsida - Sida '
    }
  },
  {
    name: 'translation-guide',
    category: 'get-involved',
    fileNames: {
      en: 'translation-guide-en',
      sv: 'translation-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'translations', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'translations', 'sv'),
    },
    pageFooter: {
      en: 'Contributing to the Global Governance Frameworks translations - Page ',
      sv: 'Bidra till Global Governance Frameworks översättningar - Sida '
    }
  },
  {
    name: 'frameworks-guide',
    category: 'get-involved',
    fileNames: {
      en: 'frameworks-guide-en',
      sv: 'frameworks-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'frameworks', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'frameworks', 'sv'),
    },
    pageFooter: {
      en: 'Contributing to the Global Governance Frameworks frameworks - Page ',
      sv: 'Bidra till Global Governance Frameworks ramverk - Sida '
    }
  },
  {
    name: 'outreach-guide',
    category: 'get-involved',
    fileNames: {
      en: 'outreach-guide-en',
      sv: 'outreach-guide-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'sv'),
    },
    pageFooter: {
      en: 'Contributing to the Global Governance Frameworks outreach - Page ',
      sv: 'Bidra till Global Governance Frameworks utåtriktade verksamhet - Sida '
    }
  },
  {
    name: 'project-overview',
    category: 'get-involved',
    fileNames: {
      en: 'Project_Overview',
      sv: 'Projekt_Oversikt'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'sv'),
    },
    subfolders: {
      en: 'Advocacy_Kit/Message_Pack',
      sv: '/Opinionsbildningskit/Meddelandepaket',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Project Overview - Page ',
      sv: 'Global Governance Frameworks. Projektöversikt - Sida '
    }
  },
  {
    name: 'key-talking-points-and-faq',
    category: 'get-involved',
    fileNames: {
      en: 'Key_Talking_Points_and_FAQ',
      sv: 'Viktiga_Samtalsamnen_och_FAQ'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'sv'),
    },
    subfolders: {
      en: 'Advocacy_Kit/Message_Pack',
      sv: '/Opinionsbildningskit/Meddelandepaket',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Project Key Talking Points & FAQ - Page ',
      sv: 'Global Governance Frameworks. Viktiga samtalsämnen och vanliga frågor - Sida '
    }
  },
  {
    name: 'key-facts-and-statistics-sheet',
    category: 'get-involved',
    fileNames: {
      en: 'Key_Facts_and_Statistics',
      sv: 'Viktiga_Fakta_och_Statistik'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'sv'),
    },
    subfolders: {
      en: 'Advocacy_Kit/Message_Pack',
      sv: '/Opinionsbildningskit/Meddelandepaket',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Project Key Facts & Statistics - Page ',
      sv: 'Global Governance Frameworks. Viktiga fakta och statistik - Sida '
    }
  },
  {
    name: 'brand-guidelines',
    category: 'get-involved',
    fileNames: {
      en: 'Brand_Guidelines',
      sv: 'Riktlinjer_For_Grafisk_Profil'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'sv'),
    },
    subfolders: {
      en: 'Advocacy_Kit/Media_Kit/GGF_Logo_and_Branding_Kit',
      sv: '/Opinionsbildningskit/Media-Kit/GGF_Grafisk_Profil_och_Logotyper',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Brand Guidelines - Page ',
      sv: 'Global Governance Frameworks. Grafisk profil - Sida '
    }
  },
  {
    name: 'guide-to-talking-about-ggf',
    category: 'get-involved',
    fileNames: {
      en: 'Guide_to_Talking_About_GGF',
      sv: 'Guide_for_Att_Prata_Om_GGF'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'sv'),
    },
    subfolders: {
      en: 'Advocacy_Kit/Action_Pack',
      sv: '/Opinionsbildningskit/Aktionspaket',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Guide to Talking About GGF - Page ',
      sv: 'Global Governance Frameworks. Guide för att prata om GGF - Sida '
    }
  },
  {
    name: 'community-event-guide',
    category: 'get-involved',
    fileNames: {
      en: 'Community_Event_Guide',
      sv: 'Guide_for_Lokala_Evenemang'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'sv'),
    },
    subfolders: {
      en: 'Advocacy_Kit/Action_Pack',
      sv: '/Opinionsbildningskit/Aktionspaket',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Community Event Guide - Page ',
      sv: 'Global Governance Frameworks. Guide för lokala evenemang - Sida '
    }
  },
  {
    name: 'content-creation-guide',
    category: 'get-involved',
    fileNames: {
      en: 'Content_Creation_Guide',
      sv: 'Guide_for_Innehallsskapande'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'get-involved', 'outreach', 'sv'),
    },
    subfolders: {
      en: 'Advocacy_Kit/Action_Pack',
      sv: '/Opinionsbildningskit/Aktionspaket',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Content Creation Guide - Page ',
      sv: 'Global Governance Frameworks. Guide för innehållsskapande - Sida '
    }
  },

  // Frameworks Foundation
  {
    name: 'case-studies',
    category: 'frameworks-foundation',
    fileNames: {
      en: 'Case-Studies',
      sv: 'Case-Studies'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv'),
    },
    subfolders: {
      en: 'en',
      sv: 'sv',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Case Studies - Page ',
      sv: 'Global Governance Frameworks Fallstudier - Sida '
    }
  },
  {
    name: 'implementation',
    category: 'frameworks-foundation',
    fileNames: {
      en: 'Implementation-Guidelines',
      sv: 'Implementation-Guidelines'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv'),
    },
    subfolders: {
      en: 'en',
      sv: 'sv',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Implementation Guidelines - Page ',
      sv: 'Global Governance Frameworks Implementeringsriktlinjer - Sida '
    }
  },
  {
    name: 'principles',
    category: 'frameworks-foundation',
    fileNames: {
      en: 'Core-Principles',
      sv: 'Core-Principles'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv'),
    },
    subfolders: {
      en: 'en',
      sv: 'sv',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Core Principles - Page ',
      sv: 'Global Governance Frameworks Grundprinciper - Sida '
    }
  },
  {
    name: 'resources',
    category: 'frameworks-foundation',
    fileNames: {
      en: 'Resources',
      sv: 'Resources'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv'),
    },
    subfolders: {
      en: 'en',
      sv: 'sv',
    },
    pageFooter: {
      en: 'Global Governance Frameworks Resources - Page ',
      sv: 'Global Governance Frameworks Resurser - Sida '
    }
  },

  // Integrated Meta Governance, full framework
  {
    name: 'integrated-meta-governance',
    category: 'meta-governance',
    fileNames: {
      en: 'Meta-Governance',
      sv: 'Meta-Governance'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'meta-governance'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'meta-governance')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Integrated Meta Governance Framework',
      sv: 'Integrerat metastyrningsramverk'
    },
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

  // Aethelred-Accord, Biotechnology Governance

  // Guides
  {
    name: 'at-a-glance',
    category: 'aethelred-accord',
    fileNames: {
      en: 'aethelred-accord-framework-ata-glance-en',
      sv: 'aethelred-accord-framework-ata-glance-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aethelred-accord'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aethelred-accord')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Aethelred Accord - At a Glance',
      sv: 'Aethelred-avtalet - En överblick'
    }
  },
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'aethelred-accord',
    fileNames: {
      en: 'aethelred-accord-framework-executivesummary-for-the-skeptic-en',
      sv: 'aethelred-accord-framework-executivesummary-for-the-skeptic-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aethelred-accord'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aethelred-accord')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Aethelred Accord - Executive Summary for the Skeptic',
      sv: 'Aethelred-avtalet - Sammanfattning för skeptikern'
    }
  },

  // Full framework
  {
    name: 'aethelred-accord-framework',
    category: 'aethelred-accord',
    fileNames: {
      en: 'Aethelred-Accord-Biotechnology-Governance',
      sv: 'Aethelred-Accord-Biotechnology-Governance'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'aethelred-accord'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'aethelred-accord')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Aethelred Accord',
      sv: 'Aethelred-avtalet'
    },
    sections: [
      'index',
      'preamble',
      'introduction',
      'universal-declaration',
      'core-principles',
      'governance-architecture',
      'operational-systems',
      'crisis-response',
      'implementation-roadmap',
      'cross-cutting-mechanisms',
      'funding-mechanisms',
      'framework-integration',
      'tools-and-resources',
      'getting-started',
      'conclusion',
      'appendices'
    ]
  },

  // Gaian Trade Framework, Global Trade & Resource Governance

  // Guides
  {
    name: 'at-a-glance',
    category: 'gaian-trade',
    fileNames: {
      en: 'gaian-trade-framework-ata-glance-en',
      sv: 'gaian-trade-framework-ata-glance-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'gaian-trade'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'gaian-trade')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Gaian Trade Framework - At a Glance',
      sv: 'Gaianska handelsramverket - En överblick'
    }
  },
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'gaian-trade',
    fileNames: {
      en: 'gaiantrade-framework-executivesummary-for-the-skeptic-en',
      sv: 'gaian-trade-framework-executivesummary-for-the-skeptic-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'gaian-trade'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'gaian-trade')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Gaian Trade Framework - Executive Summary for the Skeptic',
      sv: 'Gaian handelsramverket - Sammanfattning för skeptikern'
    }
  },

  // Full framework
  {
    name: 'gaian-trade-framework',
    category: 'gaian-trade',
    fileNames: {
      en: 'Gaian-Trade-Framework',
      sv: 'Gaian-Trade-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'gaian-trade'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'gaian-trade')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Gaian Trade Framework',
      sv: 'Gaianska handelsramverket'
    },
    sections: [
    'index',
    'introduction',
    'sacred-covenant',
    'core-principles',
    'governance-architecture',
    'key-mechanisms',
    'implementation-pathways',
    'regional-integration',
    'crisis-response',
    'monitoring-evaluation',
    'tools-resources',
    'getting-started',
    'conclusion',
    'appendices'
    ]
  },
  // Work in Liberation, Labor & Employment Governance

  // Guides
  {
    name: 'at-a-glance',
    category: 'work-in-liberation',
    fileNames: {
      en: 'work-in-liberation-ata-glance-en',
      sv: 'work-in-liberation-ata-glance-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'work-in-liberation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'work-in-liberation')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Work in Liberation - At a Glance',
      sv: 'Frigjort arbete - En överblick'
    }
  },
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'work-in-liberation',
    fileNames: {
      en: 'work-in-liberation-executivesummary-for-the-skeptic-en',
      sv: 'work-in-liberation-executivesummary-for-the-skeptic-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'work-in-liberation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'work-in-liberation')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Work in Liberation - Executive Summary for the Skeptic',
      sv: 'Frigjort arbete - Sammanfattning för skeptikern'
    }
  },

  // Full framework
  {
    name: 'work-in-liberation-framework',
    category: 'work-in-liberation',
    fileNames: {
      en: 'Work-in-Liberation-Framework',
      sv: 'Work-in-Liberation-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'work-in-liberation'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'work-in-liberation')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Work in Liberation Framework',
      sv: 'Ramverket för frigjort arbete'
    },
    sections: [
    'index',
    'introduction',
    'core-principles',
    'core-components',
    'implementation-plan',
    'tools-technologies',
    'monitoring-evaluation',
    'crisis-response',
    'expected-outcomes',
    'framework-integration',
    'global-implementation',
    'conclusion',
    'appendices'
    ]
  },
  // Moral Operating System, former Ethics and Rights of Beings

  // Guides
  {
    name: 'mos-essence',
    category: 'moral-operating-system',
    fileNames: {
      en: 'mos-essentials-en',
      sv: 'mos-essentials-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'moral-operating-system'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'moral-operating-system')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'moral-operating-system'),
      sv: path.join(__dirname, '..', 'static', 'frameworks', 'tools', 'moral-operating-system')
    },
    pageFooter: {
      en: 'Moral Operating System - Essentials',
      sv: 'Moraliskt operativsystem - Nödvändigheter'
    }
  },
  {
    name: 'essence',
    category: 'moral-operating-system',
    fileNames: {
      en: 'moral-operating-system-framework-essence-en',
      sv: 'moral-operating-system-framework-essence-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'moral-operating-system'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'moral-operating-system')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Moral Operating System - Essence',
      sv: 'Moraliskt operativsystem - Essens'
    }
  },
  {
    name: 'executive-summary-for-the-skeptic',
    category: 'moral-operating-system',
    fileNames: {
      en: 'moral-operating-system-framework-executivesummary-for-the-skeptic-en',
      sv: 'moral-operating-system-framework-executivesummary-for-the-skeptic-sv'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'moral-operating-system'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'moral-operating-system')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'assets', 'pdf'),
      sv: path.join(__dirname, '..', 'static', 'assets', 'pdf')
    },
    pageFooter: {
      en: 'Moral Operating System - Executive Summary for the Skeptic',
      sv: 'Moraliskt operativsystem - Sammanfattning för skeptikern'
    }
  },

  // Full framework
  {
    name: 'moral-operating-system-framework',
    category: 'moral-operating-system',
    fileNames: {
      en: 'Moral-Operating-System-Framework',
      sv: 'Moral-Operating-System-Framework'
    },
    sourceDir: {
      en: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'en', 'implementation', 'moral-operating-system'),
      sv: path.join(__dirname, '..', 'src', 'lib', 'content', 'frameworks', 'sv', 'implementation', 'moral-operating-system')
    },
    outputDir: {
      en: path.join(__dirname, '..', 'static', 'downloads', 'en'),
      sv: path.join(__dirname, '..', 'static', 'downloads', 'sv')
    },
    pageFooter: {
      en: 'Moral Operating System Framework',
      sv: 'Moraliskt Operativsystem, ramverk'
    },
    sections: [
     'index',
     'preamble',
     'introduction',
     'foundational-values-principles',
     'rights-commitments',
     'governance-integration',
     'implementation-plan',
     'appendix-a',
     'appendix-b',
     'appendix-c',
     'appendix-d',
     'what-is-a-right',
     'living-continuum-worth',
     'entitlement-to-entanglement',
     'spiral-ethical-growth',
     'ontological-humility',
     'rights-promise-future'
    ]
  }
];

// Your existing CSS (unchanged)
const css = `
  /* Import the Inter font from Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

  body {
    /* Use Inter as the primary font, with standard fallbacks */
    font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
    font-size: 11pt;
    line-height: 1.4;
    color: #333;
    max-width: none;
    margin: 0;
    padding: 0.5cm;
  }

  /* Make headings use the bold version of Inter */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    color: #2B4B8C;
    margin-top: 0.8em;
    margin-bottom: 0.4em;
    line-height: 1.2;
  }
  h1 {
    font-size: 14pt;
    text-align: center;
    margin-bottom: 0.6em;
    margin-top: 0.4em;
  }
  h2 {
    font-size: 13pt;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.2em;
  }
  h3 {
    font-size: 12pt;
  }
  h4 {
    font-size: 11pt;
    font-weight: bold;
  }
  p {
    margin: 0.3em 0;
    text-align: justify;
  }
  a {
    color: #2B4B8C;
    text-decoration: none;
  }
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
  pre code {
    display: block;
    padding: 0.5em;
    overflow-x: auto;
    font-size: 10pt;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.5em 0;
    font-size: 10pt;
  }
  table, th, td {
    border: 1px solid #ddd;
  }
  th, td {
    padding: 6px 8px;
    text-align: left;
  }
  th {
    background-color: #2B4B8C;
    color: white;
    font-size: 10pt;
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  hr {
    border: 0;
    height: 1px;
    background: #eaecef;
    margin: 1em 0;
  }
  .emoji {
    height: 1em;
    width: auto;
    vertical-align: middle;
    margin: 0 0.02em;
  }
  ul, ol {
    padding-left: 1.2em;
    margin: 0.3em 0;
  }
  li {
    margin-bottom: 0.2em;
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0.5em auto;
  }
  
  /* Compact image styling */
  .image-container {
    text-align: center;
    margin: 0.8em 0;
    page-break-inside: avoid;
  }
  
  .image-container img {
    max-width: 90%;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  
  .svg-container {
    text-align: center;
    margin: 0.8em 0;
    page-break-inside: avoid;
  }
  
  .svg-container img {
    max-width: 85%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
`;

// Enhanced CSS with ALL features
const finalCSS = css + `
  
  /* Enhanced image styling */
  .image-container {
    text-align: center;
    margin: 1em 0;
    page-break-inside: avoid;
  }
  
  .image-container img {
    max-width: 90%;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border: 1px solid #eee;
  }
  
  .svg-container {
    text-align: center;
    margin: 1em 0;
    page-break-inside: avoid;
  }
  
  .svg-container img {
    max-width: 85%;
    height: auto;
    display: block;
    margin: 0 auto;
    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.1));
  }
  
  /* Page break controls for sections */
  .section-break {
    page-break-before: always;
  }
  
  .section-break:first-child {
    page-break-before: auto; /* Don't break before the first section */
  }
  
  /* Ensure headings don't break badly */
  h1, h2 {
    page-break-after: avoid;
    page-break-inside: avoid;
  }
  
  h3, h4, h5, h6 {
    page-break-after: avoid;
  }
  
  /* Keep content together */
  .page-break-avoid {
    page-break-inside: avoid;
  }
  
  /* Prevent orphaned lines */
  p {
    orphans: 3;
    widows: 3;
  }
  
  /* Keep tables together */
  table {
    page-break-inside: avoid;
  }
  
  /* Special styling for section headers */
  .section-header {
    margin-top: 0;
    padding-top: 1em;
  }
  
  .section-header:first-child {
    padding-top: 0;
  }
  
  /* Prevent images from being too small */
  img {
    min-height: 20px;
    min-width: 20px;
  }
`;

// Keep your existing debug configuration
const DEBUG_CONFIG = {
  verbose: false,          
  maxPreviewLength: 200,   
  showSuccessDetails: true,
  saveDebugFiles: false,   
  focusCategory: 'meta-governance'
};

// Keep ALL your existing helper functions
function debugInfo(message, data = null) {
  if (data && typeof data === 'object') {
    console.log(`ℹ️  ${message}:`, JSON.stringify(data, null, 2).substring(0, 200));
  } else {
    console.log(`ℹ️  ${message}${data ? `: ${data}` : ''}`);
  }
}

function debugWarning(message, details = null) {
  console.log(`⚠️  WARNING: ${message}`);
  if (details) console.log(`   Details: ${details}`);
}

function debugError(message, error = null) {
  console.log(`❌ ERROR: ${message}`);
  if (error) {
    console.log(`   Error: ${error.message}`);
    if (DEBUG_CONFIG.verbose) console.log(`   Stack: ${error.stack}`);
  }
}

function debugSuccess(message, details = null) {
  if (DEBUG_CONFIG.showSuccessDetails) {
    console.log(`✅ ${message}${details ? `: ${details}` : ''}`);
  }
}

function analyzeContent(content, type = 'markdown') {
  const analysis = {
    length: content.length,
    isEmpty: content.trim().length === 0,
    hasHeadings: false,
    headingCount: 0,
    hasImages: false,
    imageCount: 0,
    sections: [],
    issues: []
  };

  if (type === 'markdown') {
    const headings = content.match(/^#{1,6}\s+.+$/gm);
    analysis.hasHeadings = !!headings;
    analysis.headingCount = headings ? headings.length : 0;
    
    if (headings) {
      analysis.sections = headings.slice(0, 5).map(h => 
        h.replace(/^#+\s+/, '').substring(0, 50)
      );
    }

    const images = content.match(/!\[.*?\]\([^)]+\)/g);
    analysis.hasImages = !!images;
    analysis.imageCount = images ? images.length : 0;

    if (analysis.length < 100) analysis.issues.push('Content too short');
    if (!analysis.hasHeadings) analysis.issues.push('No headings found');
    if (content.includes('undefined')) analysis.issues.push('Contains undefined values');
    if (content.includes('null')) analysis.issues.push('Contains null values');
  }

  return analysis;
}

function discoverFiles(sourceDir, expectedSections = null) {
  const discovery = {
    sourceExists: fs.existsSync(sourceDir),
    allFiles: [],
    markdownFiles: [],
    expectedFiles: [],
    missingFiles: [],
    foundSections: []
  };

  if (!discovery.sourceExists) {
    return discovery;
  }

  try {
    discovery.allFiles = fs.readdirSync(sourceDir);
    discovery.markdownFiles = discovery.allFiles.filter(f => f.endsWith('.md'));

    if (expectedSections) {
      discovery.expectedFiles = expectedSections.map(s => `${s}.md`);
      discovery.missingFiles = discovery.expectedFiles.filter(f => 
        !discovery.markdownFiles.includes(f)
      );
      discovery.foundSections = expectedSections.filter(s => 
        discovery.markdownFiles.includes(`${s}.md`)
      );
    }
  } catch (error) {
    discovery.error = error.message;
  }

  return discovery;
}

function processSection(sectionFile, sectionName, sourceDir) {
  const result = {
    name: sectionName,
    exists: false,
    content: '',
    analysis: null,
    issues: []
  };

  const fullPath = path.join(sourceDir, sectionFile);
  result.exists = fs.existsSync(fullPath);

  if (!result.exists) {
    result.issues.push(`File not found: ${fullPath}`);
    return result;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalLength = content.length;

    console.log(`\n🔍 DEBUGGING ${sectionName}:`);
    console.log(`   Original content length: ${originalLength}`);
    console.log(`   First 200 chars: "${content.substring(0, 200)}"`);
    console.log(`   Content contains '---': ${content.includes('---')}`);
    
    // Count how many --- separators exist
    const dashCount = (content.match(/---/g) || []).length;
    console.log(`   Number of '---' found: ${dashCount}`);

    // Show all --- contexts
    const dashMatches = content.match(/.{0,50}---+.{0,50}/g);
    if (dashMatches) {
      console.log(`   '---' contexts:`);
      dashMatches.forEach((match, i) => {
        console.log(`     ${i + 1}: "${match.replace(/\n/g, '\\n')}"`);
      });
    }

    // SAFER frontmatter removal - only if it starts at the very beginning
    let frontmatterRemoved = false;
    
    // Check if content starts with frontmatter
    if (content.startsWith('---\n') || content.startsWith('---\r\n')) {
      console.log(`   🎯 FRONTMATTER DETECTED at start`);
      
      // Find the closing --- (must be on its own line)
      const frontmatterEnd = content.indexOf('\n---\n', 4);
      const frontmatterEndCRLF = content.indexOf('\r\n---\r\n', 4);
      
      let endPos = -1;
      if (frontmatterEnd !== -1 && (frontmatterEndCRLF === -1 || frontmatterEnd < frontmatterEndCRLF)) {
        endPos = frontmatterEnd + 5; // Skip past \n---\n
      } else if (frontmatterEndCRLF !== -1) {
        endPos = frontmatterEndCRLF + 7; // Skip past \r\n---\r\n
      }
      
      if (endPos !== -1) {
        const frontmatter = content.substring(0, endPos);
        content = content.substring(endPos);
        frontmatterRemoved = true;
        
        console.log(`   ✂️  REMOVED frontmatter (${frontmatter.length} chars):`);
        console.log(`   📄 Content after removal (${content.length} chars):`);
        console.log(`      First 150 chars: "${content.substring(0, 150)}"`);
      } else {
        console.log(`   ⚠️  Frontmatter start found but no proper closing ---`);
      }
    } else {
      console.log(`   ✅ No frontmatter at start`);
    }
    
    // TOML frontmatter check
    if (!frontmatterRemoved && (content.startsWith('+++\n') || content.startsWith('+++\r\n'))) {
      console.log(`   🎯 TOML FRONTMATTER DETECTED`);
      const tomlEnd = content.indexOf('\n+++\n', 4);
      if (tomlEnd !== -1) {
        const tomlFrontmatter = content.substring(0, tomlEnd + 5);
        content = content.substring(tomlEnd + 5);
        frontmatterRemoved = true;
        console.log(`   ✂️  REMOVED TOML frontmatter (${tomlFrontmatter.length} chars)`);
      }
    }
    
    console.log(`   📊 FINAL RESULT:`);
    console.log(`      Final length: ${content.length}`);
    console.log(`      Length change: ${originalLength - content.length}`);
    console.log(`      Still contains '---': ${content.includes('---')}`);
    console.log(`      Final '---' count: ${(content.match(/---/g) || []).length}`);
    
    result.content = content;
    result.analysis = analyzeContent(content);

    if (result.analysis.issues.length > 0) {
      result.issues.push(...result.analysis.issues);
    }

  } catch (error) {
    result.issues.push(`Read error: ${error.message}`);
  }

  return result;
}

// Logo handling function
function getLogoDataUri() {
  const logoPath = path.join(__dirname, '..', 'static', 'logo-favicon.svg');
  if (fs.existsSync(logoPath)) {
    try {
      const svgContent = fs.readFileSync(logoPath, 'utf8');
      let processedSvg = svgContent;
      
      // Ensure SVG has namespace
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

// Section title extraction
function extractSectionTitlesEnhanced(markdown) {
  const sections = [];
  
  console.log(`🔍 Extracting section titles for enhanced footer tracking...`);
  
  // Look for all major headings (h1 and h2)
  const headingMatches = markdown.match(/^#{1,2}\s+(.+)$/gm);
  if (headingMatches) {
    headingMatches.forEach((match, index) => {
      const title = match.replace(/^#{1,2}\s+/, '').trim();
      // Clean up any markdown artifacts
      const cleanTitle = title
        .replace(/\{[^}]*\}/g, '') // Remove {.class} annotations
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .trim();
      
      if (cleanTitle.length > 3 && !cleanTitle.toLowerCase().includes('---')) {
        sections.push(cleanTitle);
      }
    });
  }
  
  // Limit to reasonable number and log results
  const limitedSections = sections.slice(0, 20);
  
  console.log(`📋 Extracted ${limitedSections.length} enhanced section titles:`);
  limitedSections.slice(0, 8).forEach((section, index) => {
    console.log(`   ${index + 1}. "${section}"`);
  });
  if (limitedSections.length > 8) {
    console.log(`   ... and ${limitedSections.length - 8} more sections`);
  }
  
  return limitedSections;
}

// Enhanced section markers with better tracking
function addEnhancedSectionMarkers(html, sections, isMultiSection) {
  if (!isMultiSection || sections.length === 0) {
    console.log(`📄 Single document mode - basic section tracking`);
    return html;
  }
  
  console.log(`📚 Multi-section document - adding enhanced section tracking for ${sections.length} sections`);
  
  // Enhanced section tracking script
  const sectionScript = `
    <script>
      // Enhanced section tracking for PDF generation
      window.currentSections = ${JSON.stringify(sections)};
      window.sectionIndex = 0;
      
      window.getCurrentSection = function() {
        if (!window.currentSections || window.currentSections.length === 0) {
          return 'Document';
        }
        
        // For PDF generation, we'll use a simple progressive approach
        // This could be enhanced with intersection observers for dynamic tracking
        const currentIndex = Math.min(window.sectionIndex, window.currentSections.length - 1);
        return window.currentSections[currentIndex];
      };
      
      window.nextSection = function() {
        if (window.sectionIndex < window.currentSections.length - 1) {
          window.sectionIndex++;
        }
        return window.getCurrentSection();
      };
      
      // Initialize
      window.currentSection = window.getCurrentSection();
      
      console.log('Enhanced section tracking initialized:', window.currentSections?.length || 0, 'sections');
      console.log('First section:', window.currentSection);
    </script>
  `;
  
  return html.replace('</body>', sectionScript + '</body>');
}

// Enhanced image processing function
function processImageReferences(markdown, inputFileDir) {
  console.log(`🖼️  PROCESSING IMAGES from directory: ${inputFileDir}`);
  
  // Find all image references in markdown
  const imgRegex = /!\[(.*?)\]\(([^)]+)\)/g;
  let match;
  let processedMarkdown = markdown;
  let imageCount = 0;
  let processedCount = 0;
  
  // Count total images first
  const imageMatches = markdown.match(imgRegex);
  if (imageMatches) {
    imageCount = imageMatches.length;
    console.log(`   Found ${imageCount} image references`);
  } else {
    console.log(`   No image references found`);
    return markdown;
  }
  
  // Reset regex for processing
  imgRegex.lastIndex = 0;
  
  while ((match = imgRegex.exec(markdown)) !== null) {
    const altText = match[1];
    let imgPath = match[2];
    
    console.log(`   Processing: ${imgPath}`);
    
    // Skip if it's already a data URI or external URL
    if (imgPath.startsWith('data:') || imgPath.startsWith('http')) {
      console.log(`     Skipping external/data URI: ${imgPath}`);
      continue;
    }
    
    // Handle different image types
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const isImage = imageExtensions.some(ext => imgPath.toLowerCase().endsWith(ext));
    
    if (isImage) {
      // Resolve the image path
      let resolvedPath;
      
      if (imgPath.startsWith('/')) {
        // Absolute path from project root - map to static directory
        resolvedPath = path.join(__dirname, '..', 'static', imgPath);
      } else {
        // Relative path from markdown file
        resolvedPath = path.join(inputFileDir, imgPath);
      }
      
      console.log(`     Checking: ${resolvedPath}`);
      
      // Check if image file exists
      if (fs.existsSync(resolvedPath)) {
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
            
            // Replace with embedded SVG
            processedMarkdown = processedMarkdown.replace(
              match[0],
              `<div class="svg-container"><img src="${svgDataUri}" alt="${altText}" /></div>`
            );
            
            processedCount++;
            console.log(`     ✅ Embedded SVG: ${path.basename(resolvedPath)}`);
            
          } else {
            // Handle raster images (PNG, JPG, etc.)
            const imageBuffer = fs.readFileSync(resolvedPath);
            const mimeType = getMimeType(ext);
            const base64Data = imageBuffer.toString('base64');
            const dataUri = `data:${mimeType};base64,${base64Data}`;
            
            // Replace with data URI
            processedMarkdown = processedMarkdown.replace(
              match[0],
              `<div class="image-container"><img src="${dataUri}" alt="${altText}" style="max-width: 100%; height: auto;" /></div>`
            );
            
            processedCount++;
            console.log(`     ✅ Embedded ${ext.toUpperCase()}: ${path.basename(resolvedPath)}`);
          }
          
        } catch (error) {
          console.warn(`     ❌ Error processing image ${resolvedPath}: ${error.message}`);
          // Keep original reference if processing fails
        }
      } else {
        console.warn(`     ⚠️  Image file not found: ${resolvedPath}`);
        // Keep original reference if file doesn't exist
      }
    }
  }
  
  console.log(`🖼️  IMAGE PROCESSING COMPLETE: ${processedCount}/${imageCount} images embedded`);
  return processedMarkdown;
}

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

function addSectionPageBreaks(combinedContent, processedSections) {
  console.log(`\n📄 ADDING PAGE BREAKS BETWEEN FILES ONLY...`);
  
  if (!processedSections || processedSections.length <= 1) {
    console.log(`   Single file/section detected - no page breaks needed`);
    console.log(`   Returning content unchanged (${combinedContent.length} chars)`);
    return combinedContent;
  }
  
  console.log(`   Processing ${processedSections.length} separate files for page breaks`);
  console.log(`   Input content length: ${combinedContent.length}`);
  console.log(`   Input preview: "${combinedContent.substring(0, 200)}..."`);
  
  // Use the unique file boundary marker
  const FILE_BOUNDARY = '\n<<<FILE_BOUNDARY_MARKER>>>\n';
  
  // Check if boundaries exist
  const hasBoundaries = combinedContent.includes('<<<FILE_BOUNDARY_MARKER>>>');
  console.log(`   Contains file boundaries: ${hasBoundaries}`);
  
  if (!hasBoundaries) {
    console.log(`   ⚠️  No file boundaries found - treating as single content`);
    return combinedContent;
  }
  
  // Split on the unique file boundary markers only
  const fileSections = combinedContent.split(FILE_BOUNDARY);
  
  console.log(`   Found ${fileSections.length} file sections after split`);
  
  // Debug each section
  fileSections.forEach((section, i) => {
    console.log(`   Section ${i + 1} length: ${section.length}`);
    console.log(`   Section ${i + 1} preview: "${section.substring(0, 100)}..."`);
  });
  
  let processedContent = '';
  
  for (let i = 0; i < fileSections.length; i++) {
    const fileContent = fileSections[i].trim();
    if (!fileContent) {
      console.log(`   Skipping empty section ${i + 1}`);
      continue;
    }
    
    // Find the first heading in this file
    const headingMatch = fileContent.match(/^(#{1,6})\s+(.+)$/m);
    
    if (headingMatch && i > 0) {
      // Add page break for files after the first one
      const title = headingMatch[2];
      const sectionName = processedSections[i] || `Section ${i + 1}`;
      
      console.log(`   File ${i + 1} (${sectionName}): "${title}" - adding page break`);
      
      // Add page break div before the file content
      const pageBreakDiv = '<div class="section-break"></div>\n\n';
      
      // Keep the file content exactly as is, just add page break before it
      processedContent += pageBreakDiv + fileContent;
    } else {
      // First file or no heading found - no page break
      if (headingMatch) {
        const sectionName = processedSections[i] || `Section ${i + 1}`;
        console.log(`   File ${i + 1} (${sectionName}): "${headingMatch[2]}" (first file, no page break)`);
      } else {
        console.log(`   File ${i + 1}: No heading found, adding without page break`);
      }
      processedContent += fileContent;
    }
    
    // Add spacing between files (but not after the last one)
    if (i < fileSections.length - 1) {
      processedContent += '\n\n';
    }
  }
  
  console.log(`\n📄 PAGE BREAK PROCESSING COMPLETE:`);
  console.log(`   Input length: ${combinedContent.length}`);
  console.log(`   Output length: ${processedContent.length}`);
  console.log(`   Length change: ${processedContent.length - combinedContent.length}`);
  console.log(`   Output preview: "${processedContent.substring(0, 200)}..."`);
  
  return processedContent;
}

function validateContentAtEachStep(content, stepName) {
  console.log(`\n🔍 CONTENT VALIDATION - ${stepName}:`);
  console.log(`   Length: ${content.length}`);
  console.log(`   Contains '---': ${content.includes('---')}`);
  console.log(`   '---' count: ${(content.match(/---/g) || []).length}`);
  console.log(`   Preview: "${content.substring(0, 150)}..."`);
  
  // Look for common problematic patterns
  if (content.includes('undefined')) {
    console.log(`   ⚠️  WARNING: Contains 'undefined'`);
  }
  if (content.includes('null')) {
    console.log(`   ⚠️  WARNING: Contains 'null'`);
  }
  if (content.length < 100) {
    console.log(`   ⚠️  WARNING: Content very short`);
  }
  
  return content;
}

// NEW: Enhanced structure detection for single files
function detectContentStructure(tool, sourceDir, lang) {
  console.log(`🔍 DETECTING CONTENT STRUCTURE for ${tool.name} (${lang.toUpperCase()})`);
  console.log(`   Source directory: ${sourceDir}`);
  
  const structure = {
    type: 'unknown',
    files: [],
    hasContent: false,
    suggestions: []
  };
  
  if (!fs.existsSync(sourceDir)) {
    structure.suggestions.push(`Directory not found: ${sourceDir}`);
    return structure;
  }
  
  try {
    const allFiles = fs.readdirSync(sourceDir);
    const markdownFiles = allFiles.filter(f => f.endsWith('.md'));
    
    console.log(`   Found ${allFiles.length} total files, ${markdownFiles.length} markdown files`);
    
    structure.files = markdownFiles;
    
    // Case 1: Multi-section structure (what the script expects)
    if (tool.sections && Array.isArray(tool.sections) && tool.sections.length > 1) {
      console.log(`   Expected: Multi-section (${tool.sections.length} sections)`);
      
      const expectedFiles = tool.sections.map(s => `${s}.md`);
      const foundFiles = expectedFiles.filter(f => markdownFiles.includes(f));
      
      console.log(`   Expected files: ${expectedFiles.join(', ')}`);
      console.log(`   Found files: ${foundFiles.join(', ')}`);
      
      if (foundFiles.length > 0) {
        structure.type = 'multi-section';
        structure.hasContent = true;
      } else {
        structure.suggestions.push('No expected section files found');
        structure.suggestions.push(`Try looking for: ${expectedFiles.join(', ')}`);
      }
    }
    // Case 2: Single section structure
    else if (tool.sections && Array.isArray(tool.sections) && tool.sections.length === 1) {
      console.log(`   Expected: Single section (${tool.sections[0]})`);
      
      const expectedFile = `${tool.sections[0]}.md`;
      if (markdownFiles.includes(expectedFile)) {
        structure.type = 'single-section';
        structure.hasContent = true;
        console.log(`   ✅ Found expected file: ${expectedFile}`);
      } else {
        structure.suggestions.push(`Expected file not found: ${expectedFile}`);
        structure.suggestions.push(`Available files: ${markdownFiles.join(', ')}`);
      }
    }
    // Case 3: Single file (filename matches tool name)
    else {
      console.log(`   Expected: Single file matching tool name`);
      
      // Try different naming patterns
      const possibleNames = [
        `${tool.fileNames[lang]}.md`,
        `${tool.name}.md`,
        'index.md',
        'README.md'
      ];
      
      console.log(`   Trying names: ${possibleNames.join(', ')}`);
      
      for (const name of possibleNames) {
        if (markdownFiles.includes(name)) {
          structure.type = 'single-file';
          structure.hasContent = true;
          structure.foundFile = name;
          console.log(`   ✅ Found file: ${name}`);
          break;
        }
      }
      
      if (!structure.hasContent && markdownFiles.length > 0) {
        structure.suggestions.push(`No standard files found. Available: ${markdownFiles.join(', ')}`);
        structure.suggestions.push(`Consider using the first available file: ${markdownFiles[0]}`);
        
        // Auto-suggest using the first markdown file
        structure.type = 'auto-detect';
        structure.hasContent = true;
        structure.foundFile = markdownFiles[0];
        console.log(`   🔄 Auto-detecting: Using ${markdownFiles[0]}`);
      }
    }
    
    // Directory exploration for debugging
    if (!structure.hasContent) {
      console.log(`   📂 Directory contents for debugging:`);
      allFiles.forEach(file => {
        const fullPath = path.join(sourceDir, file);
        const stat = fs.statSync(fullPath);
        console.log(`      ${stat.isDirectory() ? '📁' : '📄'} ${file}`);
        
        // If it's a directory, peek inside
        if (stat.isDirectory()) {
          try {
            const subFiles = fs.readdirSync(fullPath);
            const subMarkdown = subFiles.filter(f => f.endsWith('.md'));
            if (subMarkdown.length > 0) {
              console.log(`         └── Contains: ${subMarkdown.join(', ')}`);
              structure.suggestions.push(`Found markdown in subdirectory: ${file}/${subMarkdown.join(', ')}`);
            }
          } catch (e) {
            // Ignore permission errors
          }
        }
      });
    }
    
  } catch (error) {
    structure.suggestions.push(`Error reading directory: ${error.message}`);
  }
  
  console.log(`   📊 Structure detected: ${structure.type}`);
  console.log(`   📄 Has content: ${structure.hasContent}`);
  
  return structure;
}

function loadContentByStructure(tool, sourceDir, lang, structure) {
  console.log(`\n📚 LOADING CONTENT using ${structure.type} strategy`);
  
  let combinedContent = '';
  let processedSections = [];
  let totalIssues = [];
  
  // Use a unique file boundary marker that won't appear in content
  const FILE_BOUNDARY = '\n<<<FILE_BOUNDARY_MARKER>>>\n';
  
  try {
    switch (structure.type) {
      case 'multi-section':
        console.log(`   Processing ${tool.sections.length} sections...`);
        for (let i = 0; i < tool.sections.length; i++) {
          const section = tool.sections[i];
          const sectionFile = `${section}.md`;
          const result = processSection(sectionFile, section, sourceDir);
          
          if (result.exists && result.content.trim()) {
            // Add unique file separator ONLY between different files
            if (combinedContent.trim()) {
              console.log(`   📎 Adding file boundary between sections`);
              combinedContent += FILE_BOUNDARY;
            }
            
            console.log(`   ➕ Adding section ${i + 1}: ${section} (${result.content.length} chars)`);
            combinedContent += result.content;
            processedSections.push(section);
            debugSuccess(`${section}`, `${result.content.length} chars`);
          } else {
            debugWarning(`Section ${section} failed`, result.issues?.join('; ') || 'No content');
            totalIssues.push(...(result.issues || [`Empty content: ${section}`]));
          }
        }
        break;
        
      case 'single-section':
      case 'single-file':
      case 'auto-detect':
        // Handle all single-file cases together
        let filePath;
        let sectionName;
        
        if (structure.type === 'single-section') {
          sectionName = tool.sections[0];
          filePath = path.join(sourceDir, `${sectionName}.md`);
        } else {
          sectionName = structure.foundFile.replace('.md', '');
          filePath = path.join(sourceDir, structure.foundFile);
        }
        
        console.log(`   Processing single file: ${filePath}`);
        
        if (fs.existsSync(filePath)) {
          // Use the same processing as multi-section for consistency
          const result = processSection(path.basename(filePath), sectionName, sourceDir);
          
          if (result.exists && result.content.trim()) {
            combinedContent = result.content; // No separators for single file
            processedSections.push(sectionName);
            debugSuccess(`${sectionName}`, `${result.content.length} chars`);
          } else {
            debugError(`Single file processing failed`, result.issues?.join('; ') || 'No content');
            totalIssues.push(...(result.issues || ['Empty single file']));
          }
        } else {
          debugError(`File not found: ${filePath}`);
          totalIssues.push(`File not found: ${filePath}`);
        }
        break;
        
      default:
        debugError(`Unknown structure type: ${structure.type}`);
        totalIssues.push('Unknown content structure');
    }
    
    console.log(`\n📋 CONTENT LOADING SUMMARY:`);
    console.log(`   Total combined length: ${combinedContent.length}`);
    console.log(`   Sections processed: ${processedSections.length}`);
    console.log(`   Combined content preview: "${combinedContent.substring(0, 200)}..."`);
    console.log(`   Contains file boundaries: ${combinedContent.includes('<<<FILE_BOUNDARY_MARKER>>>')}`);
    
  } catch (error) {
    debugError(`Content loading failed`, error);
    totalIssues.push(`Loading error: ${error.message}`);
  }
  
  return {
    content: combinedContent,
    sections: processedSections,
    issues: totalIssues
  };
}

function protectContentSeparators(content) {
  console.log(`\n🛡️  PROTECTING CONTENT SEPARATORS...`);
  
  const originalDashCount = (content.match(/---/g) || []).length;
  console.log(`   Original '---' count: ${originalDashCount}`);
  
  // Replace standalone --- lines with a placeholder that won't be interpreted by markdown
  // This regex matches --- on its own line (with optional whitespace)
  const protectedContent = content.replace(/^(\s*)---(\s*)$/gm, '$1<<<CONTENT_SEPARATOR>>>$2');
  
  const protectedDashCount = (protectedContent.match(/---/g) || []).length;
  const placeholderCount = (protectedContent.match(/<<<CONTENT_SEPARATOR>>>/g) || []).length;
  
  console.log(`   Protected separators: ${placeholderCount}`);
  console.log(`   Remaining '---': ${protectedDashCount}`);
  console.log(`   Content preview: "${protectedContent.substring(0, 200)}..."`);
  
  return protectedContent;
}

function restoreContentSeparators(html) {
  console.log(`\n🔓 RESTORING CONTENT SEPARATORS...`);
  
  const placeholderCount = (html.match(/<<<CONTENT_SEPARATOR>>>/g) || []).length;
  console.log(`   Placeholders to restore: ${placeholderCount}`);
  
  // Convert placeholders back to proper HTML horizontal rules
  const restoredHTML = html.replace(/<<<CONTENT_SEPARATOR>>>/g, '<hr>');
  
  const finalHrCount = (restoredHTML.match(/<hr>/g) || []).length;
  console.log(`   Final <hr> tags: ${finalHrCount}`);
  
  return restoredHTML;
}

// COMPLETE: Main processing function with ALL features + single file support
async function generateFinalPDFs() {
  // NOTE: You need to define these variables based on your project structure
  // const targetCategory = 'your-target-category'; // or null for all
  // const languages = ['en', 'sv']; // your supported languages
  // const tools = []; // your tools array
  // const outputDirs = {}; // your output directories
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const toolsToProcess = targetCategory 
    ? tools.filter(tool => tool.category === targetCategory)
    : tools;
  
  console.log(`\n🔍 COMPLETE PROCESSING: ${toolsToProcess.length} tools with ALL FEATURES + SINGLE FILE SUPPORT`);
  console.log(`📋 Languages: ${languages.join(', ')}`);
  console.log(`🦶 Footer generation: ENABLED`);
  console.log(`📄 Header generation: ENABLED`);
  console.log(`🖼️  Image processing: ENABLED`);
  console.log(`📄 Section page breaks: ENABLED`);
  console.log(`🔧 Single file support: ENABLED`);

  try {
    for (const tool of toolsToProcess) {
      console.log(`\n📦 PROCESSING: ${tool.name}`);

      for (const lang of languages) {
        if (!tool.fileNames[lang] || !tool.sourceDir[lang]) {
          debugWarning(`Language '${lang}' not available for tool '${tool.name}' - skipping`);
          continue;
        }

        const fileName = tool.fileNames[lang];
        const sourceDir = tool.sourceDir[lang];
        
        console.log(`\n🔍 ANALYZING: ${fileName} (${lang.toUpperCase()})`);
        
        // STEP 1: Enhanced structure detection (NEW)
        const structure = detectContentStructure(tool, sourceDir, lang);
        
        if (!structure.hasContent) {
          console.log(`\n❌ NO CONTENT DETECTED - SKIPPING`);
          if (structure.suggestions.length > 0) {
            console.log(`💡 Suggestions:`);
            structure.suggestions.forEach(s => console.log(`   - ${s}`));
          }
          continue;
        }
        
        // STEP 2: Enhanced content loading (NEW + ORIGINAL)
        const contentResult = loadContentByStructure(tool, sourceDir, lang, structure);
        validateContentAtEachStep(contentResult.content, "STEP 2: After Loading");

        if (!contentResult.content.trim()) {
          console.log(`\n❌ CONTENT LOADING FAILED - SKIPPING`);
          continue;
        }
        
        // STEP 3: Content analysis (ORIGINAL)
        const finalAnalysis = analyzeContent(contentResult.content);
        const isMultiSection = contentResult.sections.length > 1;
        const docType = isMultiSection ? 'Multi-section' : 'Single document';
        
        console.log(`\n📊 FINAL ANALYSIS (${lang.toUpperCase()}) - ${docType}:`);
        console.log(`   Combined length: ${finalAnalysis.length} characters`);
        console.log(`   Sections processed: ${contentResult.sections.length}`);
        console.log(`   Section names: ${contentResult.sections.join(', ')}`);
        console.log(`   Total headings: ${finalAnalysis.headingCount}`);
        console.log(`   Images found: ${finalAnalysis.imageCount}`);
        console.log(`   Issues: ${contentResult.issues.length}`);

        // Enhanced validation (ORIGINAL)
        if (finalAnalysis.length < 100) {
          debugError(`Content too short (${finalAnalysis.length} chars) - minimum 100 required`);
          continue;
        }
        
        if (finalAnalysis.headingCount === 0) {
          debugWarning(`No headings found - PDF will have poor structure`);
          // Don't skip, but warn
        }

        console.log(`\n✅ CONTENT VALID (${lang.toUpperCase()}) - Proceeding with FULL FEATURE PDF generation`);
        
        try {
          let outputDir;
          if (tool.outputDir && tool.outputDir[lang]) {
            outputDir = tool.outputDir[lang];
          } else {
            outputDir = path.join(outputDirs[tool.category], lang);
          }
          
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          const outputFile = path.join(outputDir, `${fileName}.pdf`);
          
          // Step 1: Add section page breaks (ORIGINAL FEATURE)
          console.log(`\n📄 STEP 1: Processing page breaks between files...`);
          let contentWithBreaks;

          if (isMultiSection) {
            console.log(`   Multi-section document: Adding page breaks between ${contentResult.sections.length} files`);
            contentWithBreaks = addSectionPageBreaks(contentResult.content, contentResult.sections);
          } else {
            console.log(`   Single document: No file breaks needed`);
            contentWithBreaks = contentResult.content;
          }

          validateContentAtEachStep(contentWithBreaks, "STEP 1: After Page Breaks");
          
          // Step 2: Process images (ORIGINAL FEATURE)
          console.log(`\n🖼️  STEP 2: Processing images...`);
          const processedMarkdown = processImageReferences(contentWithBreaks, path.dirname(sourceDir));
          validateContentAtEachStep(processedMarkdown, "STEP 2: After Image Processing");

          console.log(`\n🛡️  STEP 2.5: Protecting content separators...`);
          const protectedMarkdown = protectContentSeparators(processedMarkdown);
          validateContentAtEachStep(protectedMarkdown, "STEP 2.5: After Protection");

          // Step 3: Convert to HTML (ORIGINAL)
          console.log(`\n📝 STEP 3: Converting to HTML...`);
          let html = marked(processedMarkdown);
          console.log(`\n🔍 HTML VALIDATION:`);
          console.log(`   HTML length: ${html.length}`);
          console.log(`   HTML preview: "${html.substring(0, 200)}..."`);
          console.log(`   HTML contains '---': ${html.includes('---')}`);

          // NEW STEP 3.5: Restore content separators after HTML conversion
          console.log(`\n🔓 STEP 3.5: Restoring content separators...`);
          html = restoreContentSeparators(html);

          // CRITICAL: Save intermediate files for inspection
          /*const debugDir = path.join(outputDir, 'debug');
          if (!fs.existsSync(debugDir)) {
            fs.mkdirSync(debugDir, { recursive: true });
          }

          fs.writeFileSync(path.join(debugDir, `${fileName}_1_loaded.md`), contentResult.content);
          fs.writeFileSync(path.join(debugDir, `${fileName}_2_with_breaks.md`), contentWithBreaks);
          fs.writeFileSync(path.join(debugDir, `${fileName}_3_with_images.md`), processedMarkdown);
          fs.writeFileSync(path.join(debugDir, `${fileName}_4_final.html`), html);

          console.log(`\n💾 DEBUG FILES SAVED to ${debugDir} - check these to see where content is lost!`);*/
          
          // Step 4: Enhanced section tracking (ORIGINAL FEATURE)
          console.log(`\n📚 STEP 4: Setting up section tracking...`);
          const sectionTitles = isMultiSection ? extractSectionTitlesEnhanced(processedMarkdown) : [];
          
          if (isMultiSection) {
            console.log(`   Multi-section tracking: ${sectionTitles.length} sections detected`);
          } else {
            console.log(`   Single document: Simple tracking only`);
          }
          
          html = addEnhancedSectionMarkers(html, sectionTitles, isMultiSection);
          
          // Step 5: Create final HTML document (ORIGINAL)
          console.log(`\n📄 STEP 5: Creating final HTML document...`);
          const fullHtml = `
          <!DOCTYPE html>
          <html lang="${lang}">
          <head>
            <meta charset="UTF-8">
            <title>${fileName}</title>
            <style>${finalCSS}</style>
          </head>
          <body>${html}</body>
          </html>`;

          const page = await browser.newPage();
          
          // Set extended timeout for complex content (ORIGINAL)
          console.log(`⏳ Loading page with all features (extended timeout)...`);
          await page.setContent(fullHtml, { 
            waitUntil: 'networkidle0', 
            timeout: 90000 // Extended to 90 seconds for full processing
          });
          
          // Step 6: Generate headers and footers (ORIGINAL FEATURE)
          console.log(`\n🦶 STEP 6: Setting up headers and footers...`);
          const footerText = tool.pageFooter && tool.pageFooter[lang] 
            ? tool.pageFooter[lang].replace(' - Page ', '') 
            : fileName;
          const logoDataUri = getLogoDataUri();
          
          const headerTemplate = logoDataUri ? `
            <div style="width: 100%; font-size: 8px; padding: 0 1.5cm; color: #2B4B8C; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee;">
              <div style="display: flex; align-items: center;">
                <img src="${logoDataUri}" style="height: 12px; margin-right: 8px;" />
                <span style="font-weight: 600;">${footerText}</span>
              </div>
              <div style="font-size: 7px; color: #666;">
                Global Governance Frameworks
              </div>
            </div>
          ` : `
            <div style="width: 100%; font-size: 8px; padding: 0 1.5cm; color: #2B4B8C; border-bottom: 1px solid #eee;">
              <span style="font-weight: 600;">${footerText}</span>
            </div>
          `;
          
          let footerTemplate;
          if (isMultiSection && sectionTitles.length > 0) {
            // Multi-section footer with first section name
            const firstSection = sectionTitles[0];
            footerTemplate = `
              <div style="width: 100%; font-size: 7px; padding: 0 1.5cm; color: #777; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee;">
                <span style="font-style: italic; max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${firstSection}</span>
                <span style="font-weight: 500;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
              </div>
            `;
          } else {
            // Simple footer for single documents
            footerTemplate = `
              <div style="width: 100%; font-size: 7px; padding: 0 1.5cm; color: #777; text-align: center; border-top: 1px solid #eee;">
                <span style="font-weight: 500;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
              </div>
            `;
          }
          
          console.log(`   Document type: ${docType}`);
          console.log(`   Header: ${logoDataUri ? 'With logo' : 'Text only'}`);
          console.log(`   Footer: ${isMultiSection ? `Multi-section (${sectionTitles.length} sections)` : 'Simple page numbers'}`);
          
          // Step 7: Generate final PDF (ORIGINAL)
          console.log(`\n📄 STEP 7: Generating final PDF with all features...`);
          
          await page.pdf({
            path: outputFile,
            format: 'A4',
            margin: { 
              top: '2.5cm',     // Space for header
              right: '1.5cm', 
              bottom: '2.5cm',  // Space for footer
              left: '1.5cm' 
            },
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
            preferCSSPageSize: false,
            scale: 0.95
          });
          
          await page.close();
          
          console.log(`\n🎉 FINAL PDF GENERATED (${lang.toUpperCase()}): ${outputFile}`);
          
          // Step 8: Validate and report (ORIGINAL)
          console.log(`\n📊 FINAL VALIDATION:`);
          if (fs.existsSync(outputFile)) {
            const stats = fs.statSync(outputFile);
            const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
            console.log(`   📄 PDF size: ${sizeMB} MB`);
            
            if (stats.size < 1000) {
              debugWarning('PDF file is very small - possible generation issue');
            } else if (stats.size > 50 * 1024 * 1024) { // 50MB
              debugWarning(`PDF file is very large (${sizeMB} MB) - check image optimization`);
            } else {
              debugSuccess(`PDF file size is excellent (${sizeMB} MB)`);
            }
            
            // Quick feature check (ENHANCED)
            console.log(`   ✅ Features included:`);
            console.log(`      📋 ${lang.toUpperCase()} language support`);
            console.log(`      🔧 ${structure.type} content structure`);
            console.log(`      📄 Header with ${logoDataUri ? 'logo' : 'text'}`);
            console.log(`      🦶 Footer with page numbers${isMultiSection ? ' and section tracking' : ''}`);
            console.log(`      🖼️  Image processing (${finalAnalysis.imageCount} images found)`);
            if (isMultiSection) {
              console.log(`      📄 Section page breaks (${contentResult.sections.length} sections)`);
            } else {
              console.log(`      📄 Single document layout`);
            }
            
          } else {
            debugError('PDF file was not created');
          }
          
          // Save processed markdown for reference (ORIGINAL)
          const markdownOutputFile = path.join(outputDir, `${fileName}_final.md`);
          fs.writeFileSync(markdownOutputFile, processedMarkdown);
          console.log(`   📝 Processed markdown saved: ${markdownOutputFile}`);
          
        } catch (pdfError) {
          debugError(`PDF generation failed for ${lang}`, pdfError);
          
          // Comprehensive fallback strategy (ORIGINAL)
          console.log(`\n🔄 COMPREHENSIVE FALLBACK STRATEGY:`);
          
          // Fallback 1: Remove page breaks
          try {
            console.log(`   Trying fallback 1: Without page breaks...`);
            const processedMarkdown = processImageReferences(contentResult.content, path.dirname(sourceDir));
            let html = marked(processedMarkdown);
            
            const fallbackHtml = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"><title>${fileName}</title><style>${css}</style></head><body>${html}</body></html>`;
            
            const page = await browser.newPage();
            await page.setContent(fallbackHtml, { waitUntil: 'networkidle0', timeout: 30000 });
            
            await page.pdf({
              path: outputFile.replace('.pdf', '_fallback1.pdf'),
              format: 'A4',
              margin: { top: '2cm', right: '1.5cm', bottom: '2cm', left: '1.5cm' },
              printBackground: true
            });
            
            await page.close();
            console.log(`   ✅ Fallback 1 successful: ${outputFile.replace('.pdf', '_fallback1.pdf')}`);
            
          } catch (fallback1Error) {
            console.log(`   ❌ Fallback 1 failed: ${fallback1Error.message}`);
            
            // Fallback 2: Basic content only
            try {
              console.log(`   Trying fallback 2: Basic content only...`);
              let html = marked(contentResult.content);
              const basicHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${fileName}</title><style>body{font-family:Arial;font-size:12pt;margin:2cm;}</style></head><body>${html}</body></html>`;
              
              const page = await browser.newPage();
              await page.setContent(basicHtml, { waitUntil: 'networkidle0', timeout: 15000 });
              
              await page.pdf({
                path: outputFile.replace('.pdf', '_basic.pdf'),
                format: 'A4',
                margin: { top: '2cm', right: '1.5cm', bottom: '2cm', left: '1.5cm' }
              });
              
              await page.close();
              console.log(`   ✅ Fallback 2 successful: ${outputFile.replace('.pdf', '_basic.pdf')}`);
              
            } catch (fallback2Error) {
              debugError(`All fallback attempts failed`, fallback2Error);
            }
          }
        }
      }
    }
  } finally {
    await browser.close();
    console.log(`\n🎉🎉🎉 ALL FEATURES COMPLETE WITH SINGLE FILE SUPPORT! 🎉🎉🎉`);
    console.log(`\n📋 COMPLETE FEATURE SET:`);
    console.log(`   ✅ Swedish & English language support`);
    console.log(`   ✅ Professional headers with logo`);
    console.log(`   ✅ Smart footers with section tracking`);
    console.log(`   ✅ Full image processing (SVG & raster)`);
    console.log(`   ✅ Section page breaks for readability`);
    console.log(`   ✅ Fallback generation strategies`);
    console.log(`   ✅ Comprehensive validation & reporting`);
    console.log(`   ✅ NEW: Single file content support`);
    console.log(`   ✅ NEW: Auto-detection of content structure`);
    console.log(`   ✅ NEW: Enhanced debugging for missing files`);
    
    console.log(`\n🚀 YOUR PDF GENERATION SCRIPT IS NOW COMPLETE WITH SINGLE FILE SUPPORT!`);
    console.log(`\n💡 USAGE TIPS:`);
    console.log(`   - Script now supports multi-section AND single file documents`);
    console.log(`   - Check console output for detailed content structure detection`);
    console.log(`   - Look for suggestions if files aren't found`);
    console.log(`   - Check both language folders for generated PDFs`);
    console.log(`   - Look for _final.md files to see processed content`);
    console.log(`   - If main generation fails, check for _fallback*.pdf files`);
  }
}

// Uncomment to run:
generateFinalPDFs().catch(console.error);

