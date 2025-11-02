// src/routes/frameworks/regenerative-journeys/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  // REMOVED: if (DEBUG_FRAMEWORK_LOADING) console.log('URL search:', url.search); // This causes prerender errors!
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // IMPORTANT: url.hash is not available in load functions!
  // url.search is also not available during prerendering
  
  // Load framework translations for navigation and page-specific translations
  try {
    // The pathname should always be /frameworks/regenerative-journeys
    // If it's not, we need to handle this case
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('executive-summary-vision') || 
         cleanPath.includes('executive-summary-for-the-skeptic') ||
         cleanPath.includes('at-a-glance') ||
         cleanPath.includes('framework-positioning') ||
         cleanPath.includes('core-principles') ||
         cleanPath.includes('six-pillars') ||
         cleanPath.includes('implementation-sequence') ||
         cleanPath.includes('sacred-journey') ||
         cleanPath.includes('economic-justice') ||
         cleanPath.includes('climate-adaptation') ||
         cleanPath.includes('accountability-systems') ||
         cleanPath.includes('recovery-protocols') ||
         cleanPath.includes('success-stories') ||
         cleanPath.includes('appendices'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️  Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/regenerative-journeys';
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

  // Define sections to load - regenerative journeys framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-vision',
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
    'framework-positioning',
    'core-principles',
    'six-pillars',
    'implementation-sequence',
    
    // Detailed implementation areas
    'sacred-journey',
    'economic-justice',
    'climate-adaptation',
    
    // Governance and accountability
    'accountability-systems',
    'recovery-protocols',
    
    // Learning and resources
    'success-stories',
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading regenerative journeys sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/regenerative-journeys/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/regenerative-journeys/${section}.md`);
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
      message: 'Failed to load regenerative journeys content',
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
    
    // Additional metadata for regenerative journeys framework
    frameworkType: 'regenerative-journeys',
    totalSections: sections.length,
    coreFrameworkSections: 4, // framework-positioning through implementation-sequence
    foundationSections: 4, // index, at-a-glance, executive summaries
    implementationSections: 3, // sacred-journey, economic-justice, climate-adaptation
    governanceSections: 2, // accountability-systems, recovery-protocols
    resourceSections: 2, // success-stories, appendices
    hasExecutiveSummary: true,
    
    // Regenerative Journeys-specific metadata
    frameworkVersion: '3.3',
    frameworkTier: 3,
    frameworkStatus: 'Ready for Implementation',
    isEquityFramework: true,
    focusArea: 'Tourism Transformation',
    
    // Implementation metadata
    totalPillars: 6,
    implementationPhases: 8, // Phases 0-7
    estimatedReadingTime: 35,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/regenerative-journeys'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
