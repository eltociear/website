// src/routes/resources/cultural-translation-protocol/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Cultural Translation Protocol +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load protocol translations
  try {
    let cleanPath = url.pathname;
    
    console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted
    if (cleanPath.includes('/resources/cultural-translation-protocol') && 
        (cleanPath.includes('introduction') || 
         cleanPath.includes('overview') ||
         cleanPath.includes('purpose-foundation') ||
         cleanPath.includes('recognition-principles') ||
         cleanPath.includes('deep-dialogue') ||
         cleanPath.includes('co-design-adaptation') ||
         cleanPath.includes('validation-integration') ||
         cleanPath.includes('safeguards-implementation'))) {
      
      console.log('⚠️ Detected corrupted pathname, correcting to base protocol path');
      cleanPath = '/resources/cultural-translation-protocol';
    }
    
    console.log('Clean path for translations:', cleanPath);
    
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Safe check for print mode
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

  // Define sections to load - cultural translation protocol sections in order
  const sections = [
    // Overview and context
    'introduction',
    'overview',
    
    // Phase I: Foundation
    'purpose-foundation',
    'recognition-principles',
    
    // Phase II: Implementation
    'deep-dialogue',
    'co-design-adaptation',
    
    // Phase III: Validation & Integration
    'validation-integration',
    'safeguards-implementation'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  console.log('Loading cultural translation protocol sections for locale:', currentLocale);
  
  // Try to load each section
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/protocols/${currentLocale}/cultural-translation/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/protocols/en/cultural-translation/${section}.md`);
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
      message: 'Failed to load cultural translation protocol content',
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
    
    // Additional metadata for cultural translation protocol
    protocolType: 'cultural-translation',
    totalSections: sections.length,
    phaseOneSections: 2, // purpose-foundation, recognition-principles
    phaseTwoSections: 2, // deep-dialogue, co-design-adaptation
    phaseThreeSections: 2, // validation-integration, safeguards-implementation
    hasOverview: true,
    
    // Protocol-specific metadata
    protocolVersion: '1.0',
    isImplementationProtocol: true,
    targetAudience: ['indigenous-communities', 'cultural-liaisons', 'governance-facilitators', 'international-organizations'],
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/resources/cultural-translation-protocol'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
