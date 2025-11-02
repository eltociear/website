// src/routes/frameworks/guides/bioregional-compass/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Bioregional Compass Guide +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load guide translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/guides/bioregional-compass') && 
        (cleanPath.includes('baz-starter-pack') || 
         cleanPath.includes('pre-formation-assessment') ||
         cleanPath.includes('quick-start-guide') ||
         cleanPath.includes('library') ||
         cleanPath.includes('playbooks') ||
         cleanPath.includes('the-guide'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️  Detected corrupted pathname, correcting to base guide path');
      cleanPath = '/frameworks/guides/bioregional-compass';
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
  
  // Safe check for section selector that works during prerendering
  let selectedSection = 'baz-starter-pack'; // default
  if (browser) {
    try {
      const params = url.search ? url.searchParams : null;
      selectedSection = params?.get('section') || 'baz-starter-pack';
      if (DEBUG_FRAMEWORK_LOADING) console.log('Selected section:', selectedSection);
    } catch (e) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn('Could not access URL search params:', e);
      selectedSection = 'baz-starter-pack';
    }
  }

  // Define top-level sections for the main page selector
  const topSections = [
    'baz-starter-pack',
    'pre-formation-assessment', 
    'quick-start-guide'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content for top sections
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading bioregional compass guide top sections for locale:', currentLocale);
  
  // Try to load each top section with proper error handling
  for (const section of topSections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/${section}.md`);
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Total top sections loaded:', loadedSections, 'out of', topSections.length);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded sections:', Object.keys(content));
  
  // Validate that we have at least the starter pack section
  if (!content['baz-starter-pack']) {
    console.error('Critical: Could not load baz-starter-pack section');
    throw error(500, {
      message: 'Failed to load bioregional compass guide content',
      details: 'The main starter pack section could not be loaded'
    });
  }
  
  return {
    topSections: content,
    selectedSection,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: loadedSections,
    totalSectionsCount: topSections.length,
    
    // Additional metadata for bioregional compass guide
    guideType: 'bioregional-compass',
    totalTopSections: topSections.length,
    hasLibrary: true,
    hasPlaybooks: true,
    hasMainGuide: true,
    
    // Guide-specific metadata
    guideVersion: '1.0',
    isImplementationGuide: true,
    targetAudience: ['community-leaders', 'bioregional-stewards', 'cooperative-organizers', 'indigenous-communities'],
    
    // Main sections metadata for navigation cards
    mainSections: {
      library: {
        title: 'Resource Library',
        description: 'Comprehensive toolkits and detailed resources organized by implementation pillar',
        icon: '📚',
        path: '/frameworks/guides/bioregional-compass/library',
        subsections: [
          'Pre-Formation Assessment Suite',
          'Six Pillar Toolkits', 
          'Quality Assurance Systems',
          'Learning Journey Resources'
        ]
      },
      playbooks: {
        title: 'Specialized Playbooks',
        description: 'Strategic guidance for complex challenges and specialized scenarios',
        icon: '🎯',
        path: '/frameworks/guides/bioregional-compass/playbooks',
        subsections: [
          'Legal Strategy & Resilience',
          'Crisis & Conflict Management',
          'External Relations & Diplomacy',
          'Technology Integration'
        ]
      },
      guide: {
        title: 'The Complete Formation Guide',
        description: 'Step-by-step journey through the six pillars of BAZ formation',
        icon: '🧭',
        path: '/frameworks/guides/bioregional-compass/the-guide',
        subsections: [
          'The Six Pillars Framework',
          'Scale-Sensitive Adaptations',
          'Network Integration Process',
          'Graduation Protocols'
        ]
      }
    },
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === topSections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
