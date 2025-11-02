// src/routes/frameworks/planetary-health-governance/+page.js
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
  
  // Define sections to load - planetary health governance framework sections in correct order
  const sections = [
    // Core framework sections
    'index',
    'at-a-glance',
    'preamble', 
    'executive-summary-for-the-skeptic',
    'introduction',
    'planetary-health-charter',
    'core-principles',
    'governance-architecture',
    'cross-cutting-policies',
    'framework-integration',
    'implementation-roadmap',
    'conclusion',
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading planetary health governance framework sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/planetary-health-governance/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded planetary health governance section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/planetary-health-governance/${section}.md`);
        content[section] = await fallbackPromise;
        loadedSections++;
        
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded planetary health governance section:', section, 'in English as fallback');
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load planetary health governance section ${section} in any language:`, fallbackError.message);
        
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Total planetary health governance sections loaded:', loadedSections, 'out of', sections.length);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded planetary health governance sections:', Object.keys(content));
  
  // Validate that we have at least the index section
  if (!content.index) {
    console.error('Critical: Could not load planetary health governance framework index section');
    throw error(500, {
      message: 'Failed to load planetary health governance framework content',
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
    
    // Additional metadata for planetary health governance framework
    frameworkType: 'planetary-health-governance',
    totalSections: sections.length,
    coreFrameworkSections: 13, // index through appendices (including the 3 new files)
    hasSupplementaryMaterials: true, // now we have the 3 communication documents
    hasLiteVersion: false,
    
    // Planetary health governance-specific metadata
    planetaryHealthGovernanceVersion: '1.0',
    isComprehensiveFramework: true,
    focusArea: 'planetary-health-governance',
    implementationScope: 'global',
    
    // Framework characteristics
    keyComponents: [
      'planetary-health-council',
      'biosphere-health-index',
      'rights-of-nature',
      'planetary-health-assemblies',
      'future-generations-council',
      'health-commons-protection'
    ],
    
    // Communication suite characteristics
    communicationSuite: [
      'at-a-glance',
      'preamble', 
      'executive-summary-for-the-skeptic'
    ],
    
    // Framework type characteristics
    governanceType: 'planetary-health-coordination',
    hasCharterDocument: true,
    hasTribunalMechanism: true,
    hasCommunicationSuite: true,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkType: 'planetary-health-governance'
    }
  };
}
