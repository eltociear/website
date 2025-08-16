// src/routes/frameworks/implementation-methods-and-tools/+page.js
// MINIMAL CHANGES - Drop-in replacement that fixes the main issues
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, fetch }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Implementation Tools +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    const cleanPath = '/frameworks/implementation-methods-and-tools';
    
    console.log('Loading translations for path:', cleanPath);
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Safe check for print mode that works during prerendering
  let isPrintMode = false;
  if (browser) {
    try {
      isPrintMode = url.search ? url.searchParams.get('print') === 'true' : false;
      console.log('Print mode detected:', isPrintMode);
    } catch (e) {
      console.warn('Could not access URL search params:', e);
      isPrintMode = false;
    }
  }

  // Define all the content we want to load as raw markdown
  // KEEPING YOUR EXISTING STRUCTURE - just fixing the loading
  const contentPaths = {
    sections: {
      'index': 'index.md',
      'overview': 'overview.md',
      'assessment-rubric': 'assessment-rubric.md',
      'journey-pathways': 'journey-pathways.md',
      'tool-database': 'tool-database.md',
      'implementation-guidance': 'implementation-guidance.md',
      'cultural-adaptation': 'cultural-adaptation.md',
      'monitoring-evaluation': 'monitoring-evaluation.md'
    },
    appendices: {
      'anti-colonial-evaluation-template': 'appendices/anti-colonial-evaluation-template.md',
      'failure-library-examples': 'appendices/failure-library-examples.md',
      'glossary': 'appendices/glossary.md',
      'resource-calculator': 'appendices/resource-calculator.md',
      'success-patterns': 'appendices/success-patterns.md'
    },
    integrations: {
      'aubi-integration': 'integration/aubi-integration.md',
      'indigenous-framework-integration': 'integration/indigenous-framework-integration.md',
      'meta-governance-integration': 'integration/meta-governance-integration.md',
      'treaty-integration': 'integration/treaty-integration.md'
    },
    quickstart: {
      'first-90-days-playbook': 'quickstart/first-90-days-playbook.md',
      'pilot-feedback-template': 'quickstart/pilot-feedback-template.md',
      'tool-selection-flowchart': 'quickstart/tool-selection-flowchart.md'
    },
    stacks: {
      'getting-started-stack': 'stacks/getting-started-stack.md',
      'crisis-response-stack': 'stacks/crisis-response-stack.md',
      'building-capacity-stack': 'stacks/building-capacity-stack.md',
      'deepening-practice-stack': 'stacks/deepening-practice-stack.md',
      'evolution-transition-stack': 'stacks/evolution-transition-stack.md'
    },
    tools: {
      'council-convening-playbook': 'tools/council-convening-playbook.md',
      'rapid-governance-activation': 'tools/rapid-governance-activation.md',
      'citizen-assembly-module': 'tools/citizen-assembly-module.md',
      'bioregional-mapping-guide': 'tools/bioregional-mapping-guide.md',
      'institution-chartering-kit': 'tools/institution-chartering-kit.md',
      'aubi-pilot-guide': 'tools/aubi-pilot-guide.md'
    }
  };
  
  const sectionsUsingEnglishFallback = new Set();
  const content = {
    sections: {},
    appendices: {},
    integrations: {},
    quickstart: {},
    stacks: {},
    tools: {}
  };
  let totalLoadedSections = 0;
  
  console.log('Loading implementation tools content for locale:', currentLocale);

  // Helper function to load raw markdown content
  // FIXED: Better error handling and fallback mechanism
  async function loadMarkdownContent(category, fileName, filePath) {
    const basePath = `/src/lib/content/frameworks`;
    
    try {
      // Try to load the current locale version first
      let url = `${basePath}/${currentLocale}/implementation/implementation-methods-tools/${filePath}`;
      console.log(`Attempting to load: ${url}`);
      
      let response = await fetch(url);
      
      if (!response.ok) {
        // Fall back to English if translation isn't available
        url = `${basePath}/en/implementation/implementation-methods-tools/${filePath}`;
        console.log(`Fallback to English: ${url}`);
        response = await fetch(url);
        
        if (currentLocale !== 'en' && response.ok) {
          sectionsUsingEnglishFallback.add(`${category}/${fileName}`);
        }
      }
      
      if (response.ok) {
        const markdownText = await response.text();
        content[category][fileName] = {
          rawMarkdown: markdownText,
          type: 'markdown'
        };
        totalLoadedSections++;
        console.log(`Successfully loaded ${category}/${fileName}`);
      } else {
        console.warn(`Could not load ${category}/${fileName}: ${response.status}`);
        // Create a placeholder for missing sections
        content[category][fileName] = {
          rawMarkdown: `# ${fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\nThis content is still being developed.`,
          type: 'placeholder'
        };
      }
      
    } catch (fetchError) {
      console.warn(`Error loading ${category}/${fileName}:`, fetchError.message);
      
      // Create a safe placeholder for missing sections
      content[category][fileName] = {
        rawMarkdown: `# ${fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\nThis content is still being developed.`,
        type: 'placeholder'
      };
    }
  }

  // Load all content sections
  for (const [category, paths] of Object.entries(contentPaths)) {
    for (const [fileName, filePath] of Object.entries(paths)) {
      await loadMarkdownContent(category, fileName, filePath);
    }
  }
  
  console.log('Total sections loaded:', totalLoadedSections, 'out of', Object.values(contentPaths).reduce((sum, paths) => sum + Object.keys(paths).length, 0));

  // ENHANCED: Load tools and stacks data 
  // Replace this with your actual tool loading logic from TypeScript schema files
  // For now, providing working sample data to get the components functional
  const toolsData = {
    // Example tool structure - replace with your actual data loading
    'council-convening-playbook': {
      id: 'council-convening-playbook',
      name: 'Council Convening Playbook',
      category: 'governance',
      complexity: 'Intermediate',
      timeframe: '3-6 months',
      description: 'Complete guide for establishing bioregional governance councils',
      journey: ['getting-started', 'building-capacity'],
      tags: ['governance', 'facilitation', 'bioregional'],
      culturalAdaptation: 'high'
    },
    'rapid-governance-activation': {
      id: 'rapid-governance-activation',
      name: 'Rapid Governance Activation',
      category: 'crisis',
      complexity: 'Advanced',
      timeframe: '1-4 weeks',
      description: 'Emergency protocols for rapid democratic response',
      journey: ['crisis-response'],
      tags: ['emergency', 'rapid-response', 'democracy'],
      culturalAdaptation: 'medium'
    },
    'citizen-assembly-module': {
      id: 'citizen-assembly-module',
      name: 'Citizen Assembly Module',
      category: 'participation',
      complexity: 'Intermediate',
      timeframe: '2-4 months',
      description: 'Structured process for citizen-led decision making',
      journey: ['getting-started', 'building-capacity', 'deepening-practice'],
      tags: ['participation', 'democracy', 'decision-making'],
      culturalAdaptation: 'high'
    },
    'bioregional-mapping-guide': {
      id: 'bioregional-mapping-guide',
      name: 'Bioregional Mapping Guide',
      category: 'planning',
      complexity: 'Basic',
      timeframe: '1-3 months',
      description: 'Tools for understanding local ecosystems and boundaries',
      journey: ['getting-started', 'building-capacity'],
      tags: ['bioregional', 'mapping', 'ecosystems'],
      culturalAdaptation: 'high'
    },
    'institution-chartering-kit': {
      id: 'institution-chartering-kit',
      name: 'Institution Chartering Kit',
      category: 'legal',
      complexity: 'Advanced',
      timeframe: '6-12 months',
      description: 'Legal frameworks for new governance institutions',
      journey: ['building-capacity', 'deepening-practice'],
      tags: ['legal', 'institutions', 'governance'],
      culturalAdaptation: 'medium'
    },
    'aubi-pilot-guide': {
      id: 'aubi-pilot-guide',
      name: 'AUBI Pilot Guide',
      category: 'economics',
      complexity: 'Expert',
      timeframe: '1-2 years',
      description: 'Implementation guide for Adaptive Universal Basic Income pilots',
      journey: ['deepening-practice', 'evolution-transition'],
      tags: ['economics', 'aubi', 'pilot'],
      culturalAdaptation: 'high'
    }
  };

  const toolStacksData = {
    'getting-started-stack': {
      id: 'getting-started-stack',
      name: 'Getting Started Stack',
      description: 'Essential tools for beginning your governance transformation journey',
      complexity: 'Beginner',
      timeframe: '6-12 months',
      resources: 'Low to Moderate',
      tools: ['council-convening-playbook', 'citizen-assembly-module', 'bioregional-mapping-guide'],
      targetAudience: ['New communities', 'Grassroots organizers'],
      expectedOutcomes: ['Initial coordination', 'Community engagement'],
      content: content.stacks?.['getting-started-stack']
    },
    'crisis-response-stack': {
      id: 'crisis-response-stack',
      name: 'Crisis Response Stack',
      description: 'Rapid deployment tools for emergency governance situations',
      complexity: 'Advanced',
      timeframe: '1-8 weeks',
      resources: 'Moderate to High',
      tools: ['rapid-governance-activation', 'council-convening-playbook'],
      targetAudience: ['Emergency coordinators', 'Crisis leaders'],
      expectedOutcomes: ['Rapid coordination', 'Emergency response'],
      content: content.stacks?.['crisis-response-stack']
    },
    'building-capacity-stack': {
      id: 'building-capacity-stack',
      name: 'Building Capacity Stack',
      description: 'Tools for strengthening and expanding governance capabilities',
      complexity: 'Intermediate',
      timeframe: '1-2 years',
      resources: 'Moderate',
      tools: ['institution-chartering-kit', 'bioregional-mapping-guide', 'citizen-assembly-module'],
      targetAudience: ['Established communities', 'Growing organizations'],
      expectedOutcomes: ['Enhanced capacity', 'Institutional strength'],
      content: content.stacks?.['building-capacity-stack']
    },
    'deepening-practice-stack': {
      id: 'deepening-practice-stack',
      name: 'Deepening Practice Stack',
      description: 'Advanced tools for mature governance systems',
      complexity: 'Advanced',
      timeframe: '2-5 years',
      resources: 'High',
      tools: ['aubi-pilot-guide', 'citizen-assembly-module', 'institution-chartering-kit'],
      targetAudience: ['Mature communities', 'Experienced practitioners'],
      expectedOutcomes: ['Deep transformation', 'Cultural shifts'],
      content: content.stacks?.['deepening-practice-stack']
    },
    'evolution-transition-stack': {
      id: 'evolution-transition-stack',
      name: 'Evolution & Transition Stack',
      description: 'Tools for large-scale systemic transformation',
      complexity: 'Expert',
      timeframe: '5-15 years',
      resources: 'Very High',
      tools: ['institution-chartering-kit', 'aubi-pilot-guide'],
      targetAudience: ['System change leaders', 'Transitioning institutions'],
      expectedOutcomes: ['System transformation', 'Smooth transitions'],
      content: content.stacks?.['evolution-transition-stack']
    }
  };

  // Debug logging
  console.log('Tools data created:', Object.keys(toolsData));
  console.log('Tool stacks data created:', Object.keys(toolStacksData));
  
  return {
    content,
    isModular: true,
    isPrintMode,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: totalLoadedSections,
    totalExpectedSections: Object.values(contentPaths).reduce((sum, paths) => sum + Object.keys(paths).length, 0),
    
    // Enhanced data with markdown content
    tools: toolsData,
    toolStacks: toolStacksData,
    
    // Framework metadata
    frameworkType: 'implementation-methods-and-tools',
    frameworkTier: 4,
    frameworkStatus: 'Review',
    isMetaFramework: true,
    
    // Implementation Tools specific metadata
    totalTools: Object.keys(toolsData).length,
    totalStacks: Object.keys(toolStacksData).length,
    supportedJourneys: ['getting-started', 'crisis-response', 'building-capacity', 'deepening-practice', 'evolution-transition'],
    hasAssessmentRubric: true,
    supportsCulturalAdaptation: true,
    hasDigitalComponents: true,
    hasAnalogFallbacks: true,
    
    // Content organization
    contentStructure: {
      sections: Object.keys(contentPaths.sections).length,
      appendices: Object.keys(contentPaths.appendices).length,
      integrations: Object.keys(contentPaths.integrations).length,
      quickstart: Object.keys(contentPaths.quickstart).length,
      stacks: Object.keys(contentPaths.stacks).length,
      tools: Object.keys(contentPaths.tools).length
    },
    
    // Version and development info
    frameworkVersion: '7.0',
    lastUpdated: '2024-12-19',
    developmentStage: 'Final Draft Outline',
    
    // Debug information
    debug: {
      currentLocale,
      availableContent: {
        sections: Object.keys(content.sections),
        appendices: Object.keys(content.appendices),
        integrations: Object.keys(content.integrations),
        quickstart: Object.keys(content.quickstart),
        stacks: Object.keys(content.stacks),
        tools: Object.keys(content.tools)
      },
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: totalLoadedSections > 0,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/implementation-methods-and-tools'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering',
      contentLoaded: {
        sections: Object.keys(content.sections).length,
        appendices: Object.keys(content.appendices).length,
        integrations: Object.keys(content.integrations).length,
        quickstart: Object.keys(content.quickstart).length,
        stacks: Object.keys(content.stacks).length,
        tools: Object.keys(content.tools).length
      }
    }
  };
}
