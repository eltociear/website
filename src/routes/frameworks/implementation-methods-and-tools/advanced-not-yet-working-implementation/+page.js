// src/routes/frameworks/implementation-methods-and-tools/+page.js
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
  
  console.log('Total sections loaded:', totalLoadedSections);
  console.log('Loaded content structure:', Object.keys(content));
  
  // Enhanced tool data based on loaded markdown content
  const toolsData = {
    'council-convening-playbook': {
      id: 'council-convening-playbook',
      name: 'Council Convening Playbook',
      description: 'Step-by-step guide for launching councils with cultural sensitivity and traditional governance integration',
      journey: 'getting-started',
      complexity: 'Basic',
      culturalAdaptation: 'High',
      tags: ['governance', 'councils', 'cultural-protocols'],
      estimatedTime: '2-4 weeks',
      resources: ['Facilitation guide', 'Cultural templates', 'Sample agendas'],
      quickWins: ['Establish meeting rhythm', 'Define decision-making process'],
      prerequisites: ['Community commitment', 'Basic facilitation skills'],
      content: content.tools['council-convening-playbook']
    },
    'rapid-governance-activation': {
      id: 'rapid-governance-activation',
      name: 'Rapid Governance Activation',
      description: 'Emergency protocols for establishing governance during crises and system breakdowns',
      journey: 'crisis-response',
      complexity: 'High',
      culturalAdaptation: 'Medium',
      tags: ['crisis', 'emergency', 'rapid-deployment'],
      estimatedTime: '72 hours',
      resources: ['Emergency protocols', 'Communication templates', 'Decision frameworks'],
      quickWins: ['Emergency coordination structure', 'Communication channels'],
      prerequisites: ['Crisis situation', 'Basic communication capacity'],
      content: content.tools['rapid-governance-activation']
    },
    'citizen-assembly-module': {
      id: 'citizen-assembly-module',
      name: 'Citizen Assembly Module',
      description: 'Comprehensive toolkit for running participatory decision-making processes with diverse communities',
      journey: 'building-capacity',
      complexity: 'Medium',
      culturalAdaptation: 'High',
      tags: ['participation', 'democracy', 'decision-making'],
      estimatedTime: '3-6 months',
      resources: ['Facilitation guides', 'Technology platforms', 'Evaluation tools'],
      quickWins: ['Pilot assembly on local issue', 'Community engagement protocols'],
      prerequisites: ['Existing governance structure', 'Community trust'],
      content: content.tools['citizen-assembly-module']
    },
    'bioregional-mapping-guide': {
      id: 'bioregional-mapping-guide',
      name: 'Bioregional Mapping Guide',
      description: 'Tools for defining and understanding bioregional boundaries using traditional ecological knowledge',
      journey: 'getting-started',
      complexity: 'Medium',
      culturalAdaptation: 'High',
      tags: ['bioregion', 'indigenous', 'ecology', 'mapping'],
      estimatedTime: '4-8 weeks',
      resources: ['Mapping templates', 'TEK integration guides', 'Community workshops'],
      quickWins: ['Basic bioregional map', 'Stakeholder identification'],
      prerequisites: ['Local ecological knowledge', 'Community participation'],
      content: content.tools['bioregional-mapping-guide']
    },
    'institution-chartering-kit': {
      id: 'institution-chartering-kit',
      name: 'Institution Chartering Kit',
      description: 'Templates and processes for creating new governance institutions aligned with treaty frameworks',
      journey: 'getting-started',
      complexity: 'Medium',
      culturalAdaptation: 'Medium',
      tags: ['institutions', 'governance', 'legal'],
      estimatedTime: '6-12 weeks',
      resources: ['Legal templates', 'Charter examples', 'Compliance checklists'],
      quickWins: ['Draft charter', 'Stakeholder alignment'],
      prerequisites: ['Legal framework understanding', 'Community mandate'],
      content: content.tools['institution-chartering-kit']
    },
    'aubi-pilot-guide': {
      id: 'aubi-pilot-guide',
      name: 'AUBI Pilot Program Guide',
      description: 'Framework for launching Abundant Universal Basic Income pilots with Hearts and Leaves systems',
      journey: 'building-capacity',
      complexity: 'Advanced',
      culturalAdaptation: 'Medium',
      tags: ['economics', 'aubi', 'hearts', 'leaves'],
      estimatedTime: '6-18 months',
      resources: ['Economic models', 'Technology platforms', 'Evaluation frameworks'],
      quickWins: ['Pilot cohort selection', 'Basic Hearts distribution'],
      prerequisites: ['Economic capacity', 'Technical infrastructure'],
      content: content.tools['aubi-pilot-guide']
    }
  };

  // Enhanced tool stacks data based on loaded markdown content
  const toolStacksData = {
    'getting-started': {
      id: 'getting-started',
      name: 'Getting Started Stack',
      description: 'Essential tools for launching new governance initiatives and community organizations',
      tools: [
        'council-convening-playbook',
        'institution-chartering-kit',
        'bioregional-mapping-guide'
      ],
      complexity: 'Basic',
      timeframe: '3-6 months',
      resources: 'Low to Medium',
      targetAudience: ['New community organizations', 'Grassroots movements', 'Reform-minded groups'],
      expectedOutcomes: ['Established governance structure', 'Clear decision-making processes', 'Community engagement protocols'],
      content: content.stacks['getting-started-stack']
    },
    'crisis-response': {
      id: 'crisis-response',
      name: 'Crisis Response Stack',
      description: 'Rapid deployment tools for emergency governance situations and system breakdowns',
      tools: [
        'rapid-governance-activation'
      ],
      complexity: 'High',
      timeframe: '72 hours - 3 months',
      resources: 'High urgency, variable resources',
      targetAudience: ['Emergency response teams', 'Communities in crisis', 'Post-conflict regions'],
      expectedOutcomes: ['Stabilized governance', 'Emergency coordination', 'Community cohesion'],
      content: content.stacks['crisis-response-stack']
    },
    'building-capacity': {
      id: 'building-capacity',
      name: 'Building Capacity Stack',
      description: 'Comprehensive tools for growing and strengthening existing governance initiatives',
      tools: [
        'citizen-assembly-module',
        'aubi-pilot-guide'
      ],
      complexity: 'Medium',
      timeframe: '6-18 months',
      resources: 'Medium to High',
      targetAudience: ['Established organizations', 'Municipal governments', 'NGOs seeking improvement'],
      expectedOutcomes: ['Enhanced participation', 'Improved decision-making', 'Economic integration'],
      content: content.stacks['building-capacity-stack']
    },
    'deepening-practice': {
      id: 'deepening-practice',
      name: 'Deepening Practice Stack',
      description: 'Advanced tools for mature initiatives ready to pioneer new approaches',
      tools: [],
      complexity: 'Advanced',
      timeframe: '1-3 years',
      resources: 'High',
      targetAudience: ['Advanced practitioners', 'Pioneer communities', 'Research institutions'],
      expectedOutcomes: ['Cutting-edge practices', 'Technology integration', 'Cultural innovation'],
      content: content.stacks['deepening-practice-stack']
    },
    'evolution-transition': {
      id: 'evolution-transition',
      name: 'Evolution & Transition Stack',
      description: 'Tools for fundamental system transformation and graceful transitions',
      tools: [],
      complexity: 'Expert',
      timeframe: '2-5 years',
      resources: 'Very High',
      targetAudience: ['System change leaders', 'Transitioning institutions', 'Regional governments'],
      expectedOutcomes: ['System transformation', 'Smooth transitions', 'Legacy preservation'],
      content: content.stacks['evolution-transition-stack']
    }
  };
  
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
