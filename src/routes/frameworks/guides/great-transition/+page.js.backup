// src/routes/frameworks/guides/great-transition/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Great Transition Guide +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load guide translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/guides/great-transition') && 
        (cleanPath.includes('introduction') || 
         cleanPath.includes('table-of-contents') ||
         cleanPath.includes('sunsetting') ||
         cleanPath.includes('healing') ||
         cleanPath.includes('empowering') ||
         cleanPath.includes('building') ||
         cleanPath.includes('case-study') ||
         cleanPath.includes('conclusion'))) {
      
      console.log('⚠️  Detected corrupted pathname, correcting to base guide path');
      cleanPath = '/frameworks/guides/great-transition';
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

  // Define sections to load - great transition guide sections in correct order
  const sections = [
    // Overview and context
    'introduction',
    'table-of-contents',
    
    // Part I: Acknowledging the Past, Sunsetting the Present
    'sunsetting',
    'healing',
    
    // Part II: Building the Regenerative Future
    'empowering',
    'building',
    
    // Part III: Synthesis & Vision
    'case-study',
    'conclusion'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  console.log('Loading great transition guide sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/guides/${currentLocale}/great-transition/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/guides/en/great-transition/${section}.md`);
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
  
  // Validate that we have at least the introduction section
  if (!content.introduction) {
    console.error('Critical: Could not load introduction section');
    throw error(500, {
      message: 'Failed to load great transition guide content',
      details: 'The main introduction section could not be loaded'
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
    
    // Additional metadata for great transition guide
    guideType: 'great-transition',
    totalSections: sections.length,
    partOneSections: 2, // sunsetting, healing
    partTwoSections: 2, // empowering, building
    partThreeSections: 2, // case-study, conclusion
    hasTableOfContents: true,
    
    // Guide-specific metadata
    guideVersion: '1.0',
    isImplementationGuide: true,
    targetAudience: ['community-leaders', 'baz-councils', 'regional-planners', 'worker-cooperatives'],
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/great-transition'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
