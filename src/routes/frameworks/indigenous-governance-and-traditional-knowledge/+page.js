// src/routes/frameworks/indigenous-governance-and-traditional-knowledge/+page.js
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
  
  // Load framework translations for navigation
  try {
    await loadTranslations(currentLocale, url.pathname);
  } catch (e) {
    if (DEBUG_FRAMEWORK_LOADING) console.warn('Failed to load translations:', e);
  }
  
  // Safe check for print mode that works during prerendering
  const isPrintMode = browser ? url.searchParams.get('print') === 'true' : false;
  
  // Define sections to load - indigenous framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'preamble',
    'indigenous-framework-essentials',
    
    // Core framework sections (01-10)
    'core-principles',
    'structural-components',
    'implementation-timeline',
    'key-mechanisms',
    'expected-outcomes',
    'interface-existing-systems',
    'pathways-broader-engagement',
    'documentation-risk-assessment',
    'system-map-visual',
    'glossary-references'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading indigenous framework sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/indigenous-governance-and-traditional-knowledge/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded indigenous-governance-and-traditional-knowledge section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/indigenous-governance-and-traditional-knowledge/${section}.md`);
        content[section] = await fallbackPromise;
        loadedSections++;
        
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded indigenous indigenous-governance-and-traditional-knowledge:', section, 'in English as fallback');
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load indigenous-governance-and-traditional-knowledge section ${section} in any language:`, fallbackError.message);
        
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Total indigenous-governance-and-traditional-knowledge sections loaded:', loadedSections, 'out of', sections.length);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded indigenous-governance-and-traditional-knowledge sections:', Object.keys(content));
  
  // Validate that we have at least the index section
  if (!content.index) {
    console.error('Critical: Could not load indigenous-governance-and-traditional-knowledge framework index section');
    throw error(500, {
      message: 'Failed to load indigenous-governance-and-traditional-knowledge framework content',
      details: 'The main index section could not be loaded'
    });
  }
  
  return {
    sections: content,
    // Always use modular approach
    isModular: true,
    isPrintMode,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: loadedSections,
    totalSectionsCount: sections.length,
    
    // Additional metadata for indigenous framework
    frameworkType: 'indigenous',
    totalSections: sections.length,
    coreFrameworkSections: 10, // core-principles through glossary-references
    hasEssentialGuide: true,
    hasPreamble: true,
    
    // Indigenous-specific metadata
    indigenousVersion: '1.0',
    isSpecializedFramework: true,
    focusArea: 'indigenous-governance-and-traditional-knowledge',
    implementationLevel: 'community-centered',
    
    // Framework characteristics
    keyComponents: [
      'traditional-knowledge',
      'self-determination',
      'cultural-preservation',
      'land-sovereignty',
      'intergenerational-wisdom'
    ],
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkType: 'indigenous-governance-and-traditional-knowledge'
    }
  };
}
