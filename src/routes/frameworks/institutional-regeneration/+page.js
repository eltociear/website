// src/routes/frameworks/institutional-regeneration/+page.js
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
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // IMPORTANT: url.hash is not available in load functions!
  // url.search is also not available during prerendering
  
  // Load framework translations for navigation and page-specific translations
  try {
    // The pathname should always be /frameworks/institutional-regeneration
    // If it's not, we need to handle this case
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('executive-summary') || 
         cleanPath.includes('regeneration-compact') ||
         cleanPath.includes('introduction') ||
         cleanPath.includes('module-'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️  Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/institutional-regeneration';
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
    } catch (e) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn('Could not access URL search params:', e);
      isPrintMode = false;
    }
  }
  
  // Define sections to load - institutional regeneration framework sections in correct order
  const sections = [
    // Entry point and overview
    'executive-summary',
    'regeneration-compact',
    
    // Seed Track MVP sections
    'seed-track-mvp/introduction',
    'seed-track-mvp/module-1',
    'seed-track-mvp/module-2', 
    'seed-track-mvp/module-3',
    'seed-track-mvp/next-steps'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading institutional regeneration sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      let modulePromise;
      
      // Handle nested seed-track-mvp sections differently
      if (section.startsWith('seed-track-mvp/')) {
        // For seed track sections, construct the path properly
        const subSection = section.replace('seed-track-mvp/', '');
        modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/institutional-regeneration/seed-track-mvp/${subSection}.md`);
      } else {
        // For main sections, use the direct path
        modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/institutional-regeneration/${section}.md`);
      }
      
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        let fallbackPromise;
        
        // Handle nested seed-track-mvp sections in fallback too
        if (section.startsWith('seed-track-mvp/')) {
          const subSection = section.replace('seed-track-mvp/', '');
          fallbackPromise = import(`$lib/content/frameworks/en/implementation/institutional-regeneration/seed-track-mvp/${subSection}.md`);
        } else {
          fallbackPromise = import(`$lib/content/frameworks/en/implementation/institutional-regeneration/${section}.md`);
        }
        
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
  
  // Validate that we have at least the executive summary section
  if (!content['executive-summary']) {
    console.error('Critical: Could not load executive summary section');
    throw error(500, {
      message: 'Failed to load institutional regeneration content',
      details: 'The main executive summary section could not be loaded'
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
    
    // Additional metadata for institutional regeneration framework
    frameworkType: 'institutional-regeneration',
    totalSections: sections.length,
    coreFrameworkSections: 2,
    seedTrackSections: 5,
    hasExecutiveSummary: true,
    hasRegenerationCompact: true,
    
    // Framework-specific metadata
    frameworkVersion: '0.8',
    isImplementationReady: true,
    moduleCount: 5,
    pilotInstitutions: 0,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/institutional-regeneration'
      }
    }
  };
}
