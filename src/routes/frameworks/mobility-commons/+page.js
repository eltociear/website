// src/routes/frameworks/mobility-commons/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Mobility Commons +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('at-a-glance') ||
         cleanPath.includes('executive-summary') ||
         cleanPath.includes('introduction-vision') ||
         cleanPath.includes('foundational-principles') ||
         cleanPath.includes('integration-architecture') ||
         cleanPath.includes('four-pillars') ||
         cleanPath.includes('implementation-phases') ||
         cleanPath.includes('bioregional-integration') ||
         cleanPath.includes('technology-innovation') ||
         cleanPath.includes('climate-resilience') ||
         cleanPath.includes('justice-equity') ||
         cleanPath.includes('success-metrics') ||
         cleanPath.includes('faq') ||
         cleanPath.includes('taking-action') ||
         cleanPath.includes('appendices'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️ Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/mobility-commons';
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

  // Define sections to load - mobility commons framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
    'introduction-vision',
    'foundational-principles',
    'integration-architecture',
    'four-pillars',
    'implementation-phases',
    
    // Specialized implementation areas
    'bioregional-integration',
    'technology-innovation',
    'climate-resilience',
    'justice-equity',
    'success-metrics',
    
    // Support and action
    'faq',
    'taking-action',
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading mobility commons sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/mobility-commons/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/mobility-commons/${section}.md`);
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
      message: 'Failed to load mobility commons content',
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
    
    // Additional metadata for mobility commons framework
    frameworkType: 'mobility-commons',
    totalSections: sections.length,
    coreFrameworkSections: 5, // introduction-vision through implementation-phases
    foundationSections: 2, // at-a-glance and executive-summary
    implementationSections: 4, // bioregional through success-metrics
    resourceSections: 3, // faq, taking-action, appendices
    hasExecutiveSummary: true,
    
    // Mobility Commons-specific metadata
    frameworkVersion: '7.0',
    tier: 2, // Life Support System
    status: 'First Release',
    frameworkPillars: 4, // Four Pillars Framework
    implementationPhases: 4, // Phase 0-3
    
    // Framework characteristics
    isRegenerativeFramework: true,
    includesIndigenousGovernance: true,
    hasUniversalAccess: true,
    isFossilFreeByDefault: true,
    includesEmergencyProtocols: true,
    hasGlobalCouncil: true, // Global Mobility Council (GMC)
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/mobility-commons'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering',
      
      // Framework-specific debug info
      frameworkDetails: {
        pillars: ['Governance & Coordination', 'Regenerative Infrastructure', 'Mobility Economy', 'Mobility Justice'],
        keyPrinciples: ['Mobility as Commons', 'Fossil-Free by Default', 'Universal Design', 'Bioregional Integration'],
        governanceBody: 'Global Mobility Council (GMC)',
        integrationPoints: ['Treaty for Our Only Home', 'Indigenous Framework', 'Climate & Energy Framework', 'Aurora Accord']
      }
    }
  };
}
