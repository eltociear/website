// src/routes/frameworks/implementation-methods-and-tools/+page.js
// FIXED: Use imports instead of fetch for markdown files
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Implementation Tools +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    const cleanPath = '/frameworks/implementation-methods-and-tools';
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Loading translations for path:', cleanPath);
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    if (DEBUG_FRAMEWORK_LOADING) console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Safe check for print mode that works during prerendering
  let isPrintMode = false;
  if (browser) {
    try {
      isPrintMode = url.search ? url.searchParams.get('print') === 'true' : false;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Print mode detected:', isPrintMode);
    } catch (e) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn('Could not access URL search params:', e);
      isPrintMode = false;
    }
  }

  // FIXED: Load content using dynamic imports instead of fetch
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading implementation tools content for locale:', currentLocale);

  // Helper function to load markdown content via imports
  async function loadMarkdownContentViaImport(category, fileName, filePath) {
    try {
      // Try to load the current locale version first
      let importPath = `/src/lib/content/frameworks/${currentLocale}/implementation/implementation-methods-tools/${filePath}`;
      if (DEBUG_FRAMEWORK_LOADING) console.log(`Attempting to import: ${importPath}`);
      
      let markdownModule;
      
      try {
        markdownModule = await import(`../../../lib/content/frameworks/${currentLocale}/implementation/implementation-methods-tools/${filePath}?raw`);
      } catch (primaryError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary import failed for ${category}/${fileName}:`, primaryError.message);
        
        // Fall back to English if translation isn't available
        try {
          if (DEBUG_FRAMEWORK_LOADING) console.log(`Fallback to English for: ${fileName}`);
          markdownModule = await import(`../../../lib/content/frameworks/en/implementation/implementation-methods-tools/${filePath}?raw`);
          
          if (currentLocale !== 'en') {
            sectionsUsingEnglishFallback.add(`${category}/${fileName}`);
          }
        } catch (fallbackError) {
          if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load ${category}/${fileName} in any language:`, fallbackError.message);
          
          // Create a placeholder for missing sections
          content[category][fileName] = {
            rawMarkdown: createPlaceholderContent(fileName),
            type: 'placeholder'
          };
          return;
        }
      }
      
      if (markdownModule && markdownModule.default) {
        content[category][fileName] = {
          rawMarkdown: markdownModule.default,
          type: 'markdown'
        };
        totalLoadedSections++;
        if (DEBUG_FRAMEWORK_LOADING) console.log(`Successfully loaded ${category}/${fileName}`);
      }
      
    } catch (importError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Error importing ${category}/${fileName}:`, importError.message);
      
      // Create a safe placeholder for missing sections
      content[category][fileName] = {
        rawMarkdown: createPlaceholderContent(fileName),
        type: 'placeholder'
      };
    }
  }

  // Helper function to create meaningful placeholder content
  function createPlaceholderContent(fileName) {
    const displayName = fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    switch (fileName) {
      case 'index':
        return `# Implementation Methods & Tools Framework

Welcome to the Implementation Methods & Tools Framework - your comprehensive guide for bringing governance frameworks to life.

## Quick Start

1. **Take the Assessment** - Understand your context and readiness
2. **Choose Your Journey** - Select an implementation pathway
3. **Explore Tools** - Discover tools matched to your needs
4. **Review Tool Stacks** - Get pre-configured tool combinations

## Framework Overview

This meta-framework provides practical guidance for implementing all other GGF frameworks through:

- Context-aware assessment rubrics
- Cultural adaptation protocols  
- Modular tool library
- Implementation journey pathways
- Community-controlled processes

*This content is still being developed. Please check back soon for updates.*`;

      case 'overview':
        return `# Framework Overview

The Implementation Methods & Tools Framework serves as the "operating manual" for the Global Governance Frameworks project.

## Purpose

Rather than providing one-size-fits-all solutions, this framework helps communities:

- Assess their unique implementation context
- Select appropriate tools and methodologies
- Adapt frameworks to local cultural conditions
- Follow proven implementation pathways
- Learn from global implementation experiences

*Detailed content coming soon.*`;

      case 'assessment-rubric':
        return `# Context Assessment Rubric

The Context Assessment Rubric helps you understand your implementation readiness across key dimensions.

## Assessment Areas

- **Governance Maturity** - Current system sophistication
- **Cultural Context** - Traditional governance patterns
- **Resource Availability** - Financial and human capacity
- **Conflict Dynamics** - Social tension levels

*Interactive assessment tool available below.*`;

      default:
        return `# ${displayName}

This section provides detailed guidance on ${displayName.toLowerCase()}.

*Content is currently being developed and will be available soon.*

## Coming Soon

- Detailed methodology
- Best practices
- Implementation examples
- Cultural adaptation guidance

Please check back for updates or contact us if you have specific questions about this topic.`;
    }
  }

  // Define content to load
  const contentToLoad = [
    // Core sections
    { category: 'sections', fileName: 'index', filePath: 'index.md' },
    { category: 'sections', fileName: 'overview', filePath: 'overview.md' },
    { category: 'sections', fileName: 'assessment-rubric', filePath: 'assessment-rubric.md' },
    { category: 'sections', fileName: 'journey-pathways', filePath: 'journey-pathways.md' },
    { category: 'sections', fileName: 'tool-database', filePath: 'tool-database.md' },
    { category: 'sections', fileName: 'implementation-guidance', filePath: 'implementation-guidance.md' },
    { category: 'sections', fileName: 'cultural-adaptation', filePath: 'cultural-adaptation.md' },
    { category: 'sections', fileName: 'monitoring-evaluation', filePath: 'monitoring-evaluation.md' },
    
    // Appendices
    { category: 'appendices', fileName: 'anti-colonial-evaluation-template', filePath: 'appendices/anti-colonial-evaluation-template.md' },
    { category: 'appendices', fileName: 'failure-library-examples', filePath: 'appendices/failure-library-examples.md' },
    { category: 'appendices', fileName: 'glossary', filePath: 'appendices/glossary.md' },
    { category: 'appendices', fileName: 'resource-calculator', filePath: 'appendices/resource-calculator.md' },
    { category: 'appendices', fileName: 'success-patterns', filePath: 'appendices/success-patterns.md' },
    
    // Integrations
    { category: 'integrations', fileName: 'aubi-integration', filePath: 'integration/aubi-integration.md' },
    { category: 'integrations', fileName: 'indigenous-framework-integration', filePath: 'integration/indigenous-framework-integration.md' },
    { category: 'integrations', fileName: 'meta-governance-integration', filePath: 'integration/meta-governance-integration.md' },
    { category: 'integrations', fileName: 'treaty-integration', filePath: 'integration/treaty-integration.md' },
    
    // Quickstart
    { category: 'quickstart', fileName: 'first-90-days-playbook', filePath: 'quickstart/first-90-days-playbook.md' },
    { category: 'quickstart', fileName: 'pilot-feedback-template', filePath: 'quickstart/pilot-feedback-template.md' },
    { category: 'quickstart', fileName: 'tool-selection-flowchart', filePath: 'quickstart/tool-selection-flowchart.md' },
    
    // Stacks
    { category: 'stacks', fileName: 'getting-started-stack', filePath: 'stacks/getting-started-stack.md' },
    { category: 'stacks', fileName: 'crisis-response-stack', filePath: 'stacks/crisis-response-stack.md' },
    { category: 'stacks', fileName: 'building-capacity-stack', filePath: 'stacks/building-capacity-stack.md' },
    { category: 'stacks', fileName: 'deepening-practice-stack', filePath: 'stacks/deepening-practice-stack.md' },
    { category: 'stacks', fileName: 'evolution-transition-stack', filePath: 'stacks/evolution-transition-stack.md' },
    
    // Tools
    { category: 'tools', fileName: 'council-convening-playbook', filePath: 'tools/council-convening-playbook.md' },
    { category: 'tools', fileName: 'rapid-governance-activation', filePath: 'tools/rapid-governance-activation.md' },
    { category: 'tools', fileName: 'citizen-assembly-module', filePath: 'tools/citizen-assembly-module.md' },
    { category: 'tools', fileName: 'bioregional-mapping-guide', filePath: 'tools/bioregional-mapping-guide.md' },
    { category: 'tools', fileName: 'institution-chartering-kit', filePath: 'tools/institution-chartering-kit.md' },
    { category: 'tools', fileName: 'aubi-pilot-guide', filePath: 'tools/aubi-pilot-guide.md' }
  ];

  // Load all content
  for (const { category, fileName, filePath } of contentToLoad) {
    await loadMarkdownContentViaImport(category, fileName, filePath);
  }
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Total sections loaded:', totalLoadedSections, 'out of', contentToLoad.length);

  // Enhanced tools and stacks data 
  const toolsData = {
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
  if (DEBUG_FRAMEWORK_LOADING) console.log('Tools data created:', Object.keys(toolsData));
  if (DEBUG_FRAMEWORK_LOADING) console.log('Tool stacks data created:', Object.keys(toolStacksData));
  
  return {
    content,
    isModular: true,
    isPrintMode,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: totalLoadedSections,
    totalExpectedSections: contentToLoad.length,
    
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
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
