// src/routes/frameworks/global-health-and-pandemic-security/+page.js
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
  
  // Define sections to load - global health & pandemic security framework sections in correct order
  const sections = [
    // Core framework sections
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    'universal-declaration',
    'introduction',
    'core-principles',
    'governance-architecture',
    'operational-systems',
    'crisis-response',
    'implementation-roadmap',
    'funding-mechanisms',
    'framework-integration',
    'conclusion',
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading global health & pandemic security framework sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/global-health-and-pandemic-security/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded global health & pandemic security section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/global-health-and-pandemic-security/${section}.md`);
        content[section] = await fallbackPromise;
        loadedSections++;
        
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded global health & pandemic security section:', section, 'in English as fallback');
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load global health & pandemic security section ${section} in any language:`, fallbackError.message);
        
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Total global health & pandemic security sections loaded:', loadedSections, 'out of', sections.length);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded global health & pandemic security sections:', Object.keys(content));
  
  // Validate that we have at least the index section
  if (!content.index) {
    console.error('Critical: Could not load global health & pandemic security framework index section');
    throw error(500, {
      message: 'Failed to load global health & pandemic security framework content',
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
    
    // Additional metadata for global health & pandemic security framework
    frameworkType: 'global-health-and-pandemic-security',
    totalSections: sections.length,
    coreFrameworkSections: 14, // index through appendices (including the 3 communication documents)
    hasSupplementaryMaterials: true, // we have the 3 communication documents
    hasLiteVersion: false,
    
    // Global health & pandemic security-specific metadata
    globalHealthPandemicSecurityVersion: '1.0',
    isComprehensiveFramework: true,
    focusArea: 'global-health-and-pandemic-security',
    implementationScope: 'global',
    
    // Framework characteristics
    keyComponents: [
      'global-health-security-council',
      'health-emergency-corps',
      'community-health-legions',
      'global-pathogen-surveillance-network',
      'planetary-health-assemblies',
      'pandemic-prevention-fund'
    ],
    
    // Communication suite characteristics
    communicationSuite: [
      'at-a-glance',
      'executive-summary-for-the-skeptic',
      'universal-declaration'
    ],
    
    // Framework type characteristics
    governanceType: 'planetary-immune-system',
    hasUniversalDeclaration: true,
    hasEmergencyCorps: true,
    hasCommunicationSuite: true,
    hasTraditionalKnowledgeIntegration: true,
    hasYouthAuthority: true,
    
    // Implementation phases
    implementationPhases: [
      'health-sanctuary-development',
      'continental-integration', 
      'planetary-health-security'
    ],
    
    // Immune system metaphor components
    immuneSystemComponents: {
      brainstem: 'global-health-security-council',
      whiteBloocCells: 'health-emergency-corps',
      tCells: 'community-health-legions',
      sensoryNerves: 'global-pathogen-surveillance-network',
      adaptiveMemory: 'planetary-health-assemblies'
    },
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkType: 'global-health-and-pandemic-security'
    }
  };
}
