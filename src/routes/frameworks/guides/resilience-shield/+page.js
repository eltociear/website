// src/routes/frameworks/guides/resilience-shield/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false;

export async function load({ depends, url, params }) {
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Resilience Shield Guide +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load guide translations
  try {
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if pathname contains section names and correct if needed
    if (cleanPath.includes('/frameworks/guides/resilience-shield') && 
        (cleanPath.includes('introduction') || 
         cleanPath.includes('overview') ||
         cleanPath.includes('local-resilience-fund') ||
         cleanPath.includes('community-work-teams') ||
         cleanPath.includes('crisis-command') ||
         cleanPath.includes('implementation') ||
         cleanPath.includes('case-studies'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️  Detected corrupted pathname, correcting to base guide path');
      cleanPath = '/frameworks/guides/resilience-shield';
    }
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Clean path for translations:', cleanPath);
    
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    if (DEBUG_FRAMEWORK_LOADING) console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
    if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded translations for path:', cleanPath, 'with locale:', currentLocale);
  } catch (e) {
    console.error('Failed to load translations:', e);
    console.error('Error details:', e.stack);
  }
  
  // Safe check for print mode
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

  // Define sections in order
  const sections = [
    'introduction',
    'overview',
    'local-resilience-fund',
    'community-work-teams',
    'crisis-command',
    'implementation',
    'case-studies'
  ];
  
  const sectionsUsingEnglishFallback = new Set();
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading resilience shield guide sections for locale:', currentLocale);
  
  // Load each section
  for (const section of sections) {
    try {
      const modulePromise = import(`$lib/content/guides/${currentLocale}/resilience-shield/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English
      try {
        const fallbackPromise = import(`$lib/content/guides/en/resilience-shield/${section}.md`);
        content[section] = await fallbackPromise;
        loadedSections++;
        
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded section:', section, 'in English as fallback');
        
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load section ${section} in any language:`, fallbackError.message);
        
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
  
  // Validate introduction exists
  if (!content.introduction) {
    console.error('Critical: Could not load introduction section');
    throw error(500, {
      message: 'Failed to load resilience shield guide content',
      details: 'The main introduction section could not be loaded'
    });
  }
  
  return {
    sections: content,
    isModular: true,
    isPrintMode,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: loadedSections,
    totalSectionsCount: sections.length,
    
    // Guide metadata
    guideType: 'resilience-shield',
    totalSections: sections.length,
    
    // Guide-specific metadata
    guideVersion: 'Alpha 1.0',
    isImplementationGuide: true,
    targetAudience: ['municipal-leaders', 'security-chiefs', 'community-organizers', 'civil-defense'],
    geographicFocus: 'swedish-municipalities',
    
    // Section organization
    sectionGroups: {
      introduction: ['introduction', 'overview'],
      coreMechanisms: ['local-resilience-fund', 'community-work-teams', 'crisis-command'],
      implementation: ['implementation', 'case-studies']
    },
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/resilience-shield'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
