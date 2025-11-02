// src/routes/frameworks/peace-and-conflict-resolution/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Peace Framework +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('executive-summary') || 
         cleanPath.includes('at-a-glance') ||
         cleanPath.includes('framework-overview') ||
         cleanPath.includes('theoretical-foundation') ||
         cleanPath.includes('governance-architecture') ||
         cleanPath.includes('prevention-early-warning') ||
         cleanPath.includes('active-conflict-resolution') ||
         cleanPath.includes('post-conflict-transformation') ||
         cleanPath.includes('scale-specific-applications') ||
         cleanPath.includes('ggf-integration') ||
         cleanPath.includes('technology-tools') ||
         cleanPath.includes('training-professional-development') ||
         cleanPath.includes('cultural-adaptation-decolonization') ||
         cleanPath.includes('implementation-roadmap') ||
         cleanPath.includes('measurement-evaluation') ||
         cleanPath.includes('risk-management') ||
         cleanPath.includes('resources-sustainability') ||
         cleanPath.includes('conclusion') ||
         cleanPath.includes('implementation-tools') ||
         cleanPath.includes('appendix') ||
         cleanPath.includes('preamble'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️  Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/peace-and-conflict-resolution';
    }
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Clean path for translations:', cleanPath);
    
    // Load translations for this specific page path
    if (DEBUG_FRAMEWORK_LOADING) console.log('About to call loadTranslations with:', currentLocale, cleanPath);
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    if (DEBUG_FRAMEWORK_LOADING) console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
    if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded translations for path:', cleanPath, 'with locale:', currentLocale);
  } catch (e) {
    console.error('Failed to load translations:', e);
    console.error('Error details:', e.stack);
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

  // Define sections to load - peace framework sections in correct order following 4-part structure
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    'preamble',
    
    // PART I: FOUNDATIONS
    'framework-overview',
    'theoretical-foundation',
    'governance-architecture',
    
    // PART II: OPERATIONAL FRAMEWORK
    'prevention-early-warning',
    'active-conflict-resolution',
    'post-conflict-transformation',
    'scale-specific-applications',
    
    // PART III: IMPLEMENTATION
    'ggf-integration',
    'technology-tools',
    'training-professional-development',
    'cultural-adaptation-decolonization',
    
    // PART IV: DEPLOYMENT
    'implementation-roadmap',
    'measurement-evaluation',
    'risk-management',
    'resources-sustainability',
    
    // Conclusion and Tools
    'conclusion',
    'implementation-tools',
    
    // APPENDICES
    'appendix-a-case-studies',
    'appendix-b-templates',
    'appendix-c-cultural-adaptation',
    'appendix-d-technical',
    'appendix-e-reference'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading peace framework sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/peace-and-conflict-resolution/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/peace-and-conflict-resolution/${section}.md`);
        content[section] = await fallbackPromise;
        loadedSections++;
        
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded section:', section, 'in English as fallback');
        
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load section ${section} in any language:`, fallbackError.message);
        
        // Create a safe placeholder for missing sections
        content[section] = {
          default: function MissingSection() {
            return {
              render: () => ({
                html: `<div class="missing-section-content">
                  <h2>Section "${section}" not found</h2>
                  <p>This content is still being developed.</p>
                </div>`,
                css: { code: '', map: null }
              })
            };
          }
        };
      }
    }
  }
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Total sections loaded:', loadedSections, 'out of', sections.length);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded sections:', Object.keys(content));
  
  // Validate that we have at least the index section
  if (!content.index) {
    console.error('Critical: Could not load index section');
    throw error(500, {
      message: 'Failed to load peace framework content',
      details: 'The main index section could not be loaded'
    });
  }
  
  return {
    sections: content,
    // Always use modular approach
    isModular: true,
    isPrintMode, // This will be false during prerendering, true/false on client
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: loadedSections,
    totalSectionsCount: sections.length,
    
    // Additional metadata for peace framework
    frameworkType: 'peace-and-conflict-resolution',
    totalSections: sections.length,
    
    // Peace framework structure metadata
    foundationSections: 4, // preamble, at-a-glance, executive-summary, framework-overview
    coreSections: 3, // theoretical-foundation, governance-architecture (Part I)
    operationalSections: 4, // prevention through scale-specific (Part II)
    implementationSections: 4, // ggf-integration through cultural-adaptation (Part III)
    deploymentSections: 4, // implementation-roadmap through resources-sustainability (Part IV)
    conclusionSections: 2, // conclusion, implementation-tools
    appendixSections: 5, // appendix-a through appendix-e
    
    hasExecutiveSummary: true,
    hasAtAGlance: true,
    hasPreamble: true,
    hasImplementationTools: true,
    hasAppendices: true,
    
    // Peace-specific metadata
    frameworkVersion: '1.0',
    isGoldenTriangleIntegrated: true, // Treaty + Indigenous + Meta-Governance
    valuesBasedApproach: true,
    fourPartStructure: true,
    
    // Framework capabilities
    capabilities: {
      preventionEarlyWarning: true,
      activeConflictResolution: true,
      postConflictTransformation: true,
      scaleSpecificApplications: true,
      ggfIntegration: true,
      technologyTools: true,
      culturalAdaptation: true,
      riskManagement: true,
      sustainableResources: true,
      comprehensiveAppendices: true
    },
    
    // Integration points
    integrationWith: {
      treatyForOurOnlyHome: true,
      indigenousGovernance: true,
      metaGovernance: true,
      aubi: true,
      globalHealth: true,
      climateEnergy: true,
      justiceSystemsImplementation: true
    },
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/peace-and-conflict-resolution'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering',
      structureValidation: {
        hasFoundations: content['framework-overview'] && content['theoretical-foundation'] && content['governance-architecture'],
        hasOperational: content['prevention-early-warning'] && content['active-conflict-resolution'] && content['post-conflict-transformation'] && content['scale-specific-applications'],
        hasImplementation: content['ggf-integration'] && content['technology-tools'] && content['training-professional-development'] && content['cultural-adaptation-decolonization'],
        hasDeployment: content['implementation-roadmap'] && content['measurement-evaluation'] && content['risk-management'] && content['resources-sustainability'],
        hasConclusion: content['conclusion'] && content['implementation-tools'],
        hasAppendices: content['appendix-a-case-studies'] && content['appendix-b-templates'] && content['appendix-c-cultural-adaptation'] && content['appendix-d-technical'] && content['appendix-e-reference']
      }
    }
  };
}
