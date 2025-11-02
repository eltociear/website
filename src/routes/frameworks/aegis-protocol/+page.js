// src/routes/frameworks/aegis-protocol/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Aegis Protocol +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    // The pathname should always be /frameworks/aegis-protocol
    // If it's not, we need to handle this case
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('introduction-vision') ||
         cleanPath.includes('foundational-principles') ||
         cleanPath.includes('integration-architecture') ||
         cleanPath.includes('historical-grounding') ||
         cleanPath.includes('strategic-resilience') ||
         cleanPath.includes('economic-modeling') ||
         cleanPath.includes('non-state-integration') ||
         cleanPath.includes('implementation-phases') ||
         cleanPath.includes('three-pillars') ||
         cleanPath.includes('root-causes') ||
         cleanPath.includes('success-metrics') ||
         cleanPath.includes('faq') ||
         cleanPath.includes('taking-action') ||
         cleanPath.includes('at-a-glance') ||
         cleanPath.includes('executive-summary-for-the-skeptic') ||
         cleanPath.includes('strategic-briefing-for-the-russian-federation') ||
         cleanPath.includes('the-china-engagement-strategy') ||
         cleanPath.includes('the-european-ally-briefing') ||
         cleanPath.includes('the-global-south-partnership-proposal') ||
         cleanPath.includes('appendices'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️  Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/aegis-protocol';
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
  // Only access url.search on the client side
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

  // Define sections to load - aegis protocol framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
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
    
    // Strategic regional briefings
    'strategic-briefing-for-the-russian-federation',
    'the-china-engagement-strategy',
    'the-european-ally-briefing',
    'the-global-south-partnership-proposal',
    
    // Supplementary materials
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading aegis protocol sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/aegis-protocol/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/aegis-protocol/${section}.md`);
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
      message: 'Failed to load aegis protocol content',
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
    
    // Additional metadata for aegis protocol framework
    frameworkType: 'aegis-protocol',
    totalSections: sections.length,
    coreFrameworkSections: 13, // introduction-vision through taking-action
    foundationSections: 2, // at-a-glance and executive-summary
    strategicBriefings: 4, // regional engagement strategies
    resourceSections: 1, // appendices
    hasExecutiveSummary: true,
    hasStrategicBriefings: true,
    
    // Aegis Protocol-specific metadata
    protocolVersion: '1.0',
    tier: 1,
    implementationPhases: ['observer', 'bilateral', 'voluntary', 'regional', 'systemic'],
    threePillars: ['GSET', 'CTO', 'TOC'],
    targetBudgetRedirection: 50, // percentage
    globalMilitaryBudget: 2700, // billion USD
    transformationTimeframe: '2025-2045',
    isSecurityFramework: true,
    isTransitionFramework: true,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/aegis-protocol'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
