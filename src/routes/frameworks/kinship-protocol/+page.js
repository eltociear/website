// src/routes/frameworks/kinship-protocol/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Kinship Protocol +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    // The pathname should always be /frameworks/kinship-protocol
    // If it's not, we need to handle this case
    let cleanPath = url.pathname;
    
    console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('introduction-vision') ||
         cleanPath.includes('core-principles') ||
         cleanPath.includes('integration-architecture') ||
         cleanPath.includes('functional-pillars') ||
         cleanPath.includes('implementation-roadmap') ||
         cleanPath.includes('success-metrics') ||
         cleanPath.includes('global-south-leadership') ||
         cleanPath.includes('cultural-transformation') ||
         cleanPath.includes('economic-justice') ||
         cleanPath.includes('digital-rights') ||
         cleanPath.includes('crisis-response') ||
         cleanPath.includes('kinship-festival') ||
         cleanPath.includes('faq') ||
         cleanPath.includes('taking-action') ||
         cleanPath.includes('at-a-glance') ||
         cleanPath.includes('executive-summary-for-the-skeptic') ||
         cleanPath.includes('appendices'))) {
      
      console.log('⚠️  Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/kinship-protocol';
    }
    
    console.log('Clean path for translations:', cleanPath);
    
    // Load translations for this specific page path
    console.log('About to call loadTranslations with:', currentLocale, cleanPath);
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
    console.log('Loaded translations for path:', cleanPath, 'with locale:', currentLocale);
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
      console.log('Print mode detected:', isPrintMode);
    } catch (e) {
      console.warn('Could not access URL search params:', e);
      isPrintMode = false;
    }
  }

  // Define sections to load - kinship protocol framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance', 
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
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
    
    // Supplementary materials
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  console.log('Loading kinship protocol sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/kinship-protocol/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/kinship-protocol/${section}.md`);
        content[section] = await fallbackPromise;
        loadedSections++;
        
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
        console.log('Loaded section:', section, 'in English as fallback');
        
      } catch (fallbackError) {
        console.warn(`Could not load section ${section} in any language:`, fallbackError.message);
        
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
  
  console.log('Total sections loaded:', loadedSections, 'out of', sections.length);
  console.log('Loaded sections:', Object.keys(content));
  
  // Validate that we have at least the index section
  if (!content.index) {
    console.error('Critical: Could not load index section');
    throw error(500, {
      message: 'Failed to load kinship protocol content',
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
    
    // Additional metadata for kinship protocol framework
    frameworkType: 'kinship-protocol',
    totalSections: sections.length,
    coreFrameworkSections: 12, // introduction-vision through taking-action
    foundationSections: 2, // at-a-glance and executive-summary
    resourceSections: 1, // appendices
    hasExecutiveSummary: true,
    hasStrategicBriefings: false, // kinship protocol doesn't have strategic briefings
    
    // Kinship Protocol-specific metadata
    protocolVersion: '1.0',
    tier: 3,
    implementationPhases: ['foundation', 'systems-integration', 'institutional-embedding', 'global-kinship'],
    fourPillars: ['foundational-governance', 'legal-transformation', 'economic-transformation', 'cultural-transformation'],
    targetDecriminalization: 80, // percentage by 2030
    targetPayGapClosure: 50, // percentage by 2030
    targetGlobalEquityIndex: 90, // percentage compliance by 2035
    transformationTimeframe: '2025-2050',
    isJusticeFramework: true,
    isIntersectionalFramework: true,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/kinship-protocol'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
