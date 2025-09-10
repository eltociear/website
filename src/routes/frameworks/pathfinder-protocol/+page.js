// src/routes/frameworks/regenerative-enterprise/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Regenerative Enterprise +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('foreword') || 
         cleanPath.includes('a-compass-for-changemakers') ||
         cleanPath.includes('the-case-for-regeneration') ||
         cleanPath.includes('the-core-principles') ||
         cleanPath.includes('module-') ||
         cleanPath.includes('beginning-the-journey') ||
         cleanPath.includes('deepening-the-practice') ||
         cleanPath.includes('a-commitment') ||
         cleanPath.includes('weaving-with-the-wider-ecosystem') ||
         cleanPath.includes('tools') ||
         cleanPath.includes('ways-to-begin-the-journey') ||
         cleanPath.includes('keeping-the-framework-alive') ||
         cleanPath.includes('appendices'))) {
      
      console.log('⚠️  Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/regenerative-enterprise';
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

  // Define sections to load - regenerative enterprise framework sections in logical order
  const sections = [
    // Introductory materials
    'foreword',
    'a-compass-for-changemakers',
    'ways-to-begin-the-journey',
    
    // Foundation sections
    'the-case-for-regeneration',
    'the-core-principles',
    
    // Core modules (0-5)
    'module-0',
    'module-1', 
    'module-2',
    'module-3',
    'module-4',
    'module-5',
    
    // Implementation guidance
    'beginning-the-journey',
    'deepening-the-practice',
    
    // Justice and decolonization
    'a-commitment',
    
    // Ecosystem integration
    'weaving-with-the-wider-ecosystem',
    
    // Resources and tools
    'tools',
    'keeping-the-framework-alive',
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  console.log('Loading regenerative enterprise sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/regenerative-enterprise/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/regenerative-enterprise/${section}.md`);
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
  
  // Validate that we have at least some core sections
  if (!content['the-case-for-regeneration'] && !content['a-compass-for-changemakers']) {
    console.error('Critical: Could not load any core sections');
    throw error(500, {
      message: 'Failed to load regenerative enterprise framework content',
      details: 'No core sections could be loaded'
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
    
    // Additional metadata for regenerative enterprise framework
    frameworkType: 'regenerative-enterprise',
    totalSections: sections.length,
    coreModuleSections: 6, // module-0 through module-5
    foundationSections: 3, // compass, ways-to-begin, case-for-regeneration, core-principles
    implementationSections: 2, // beginning-the-journey, deepening-the-practice
    resourceSections: 3, // tools, keeping-alive, appendices
    hasModularStructure: true,
    
    // Framework-specific metadata
    frameworkVersion: '1.0',
    isComprehensiveGuide: true,
    totalModules: 6,
    implementationPhases: 3, // exploring, integrating, leading
    
    // Section categorization for navigation
    sectionCategories: {
      introduction: ['foreword', 'a-compass-for-changemakers', 'ways-to-begin-the-journey'],
      foundations: ['the-case-for-regeneration', 'the-core-principles'],
      coreModules: ['module-0', 'module-1', 'module-2', 'module-3', 'module-4', 'module-5'],
      implementation: ['beginning-the-journey', 'deepening-the-practice'],
      justice: ['a-commitment'],
      ecosystem: ['weaving-with-the-wider-ecosystem'],
      resources: ['tools', 'keeping-the-framework-alive', 'appendices']
    },
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/regenerative-enterprise'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
