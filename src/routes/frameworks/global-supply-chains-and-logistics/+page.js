// src/routes/frameworks/global-supply-chains-and-logistics/+page.js
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
  
  // Define sections to load - GSCL framework sections in correct order
  const sections = [
    // Preamble as entry point
    'preamble',

    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
    'introduction',
    'theory-of-change',
    'framework-position',
    'core-pillars',
    'economic-integration',
    'technology-infrastructure',
    'governance-compliance',
    'implementation-roadmap',
    'monitoring-evaluaton',
    'global-alignment',
    
    // Essential appendices
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading GSCL sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/global-supply-chains-and-logistics/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/global-supply-chains-and-logistics/${section}.md`);
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
      message: 'Failed to load GSCL content',
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
    
    // Additional metadata for GSCL framework
    frameworkType: 'global-supply-chains-and-logistics',
    totalSections: sections.length,
    coreFrameworkSections: 10,
    hasSupplementaryMaterials: true,
    hasExecutiveSummary: true,
    
    // GSCL-specific metadata
    frameworkVersion: '1.0',
    isSupplyChainFramework: true,
    tier: 1, // Urgent Global Stability & Justice
    implementationPhases: 3,
    corePillars: 5,
    bioregionalZones: 100, // target by 2030
    
    // Supply chain transformation metadata
    heartsLeavescurrency: true,
    aubiIntegration: true,
    communityControlled: true,
    indigenousSovereignty: true,
    bioregionalGovernance: true,
    
    // Integration metadata
    treatyIntegration: 'treaty-for-our-only-home',
    indigenousFrameworkAlignment: true,
    metaGovernanceCoordination: true,
    auroraAccordCompliance: true,
    
    // Transformation targets
    emissionReduction: '30%', // by 2035
    localizedProduction: '50%', // by 2035
    communityEconomicSovereignty: '80%', // target
    stakeholderSatisfaction: '80%', // target
    lmciImprovement: '15%', // Love, Meaning, Connection Index
    
    // Technology metadata
    iotDevices: 1000000, // 1M by 2030
    renewableEnergyTarget: '50%', // by 2028
    eWasteRecovery: '90%', // target
    quantumResistantSecurity: true,
    lowTechResilience: true,
    
    // Economic metadata
    heartsCurrencyValue: 1, // 1 Heart = $1 USD equivalent
    globalSouthSMETarget: '30%', // by 2030
    fsfFunding: 500000000, // $500M for Global South
    cooperativeDevelopment: true,
    
    // Implementation metadata
    pilotBAZs: 5, // Phase 1
    regionalScaling: 20, // Phase 2
    globalIntegration: 100, // Phase 3
    crisisRecoveryTime: '<48 hours',
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkTier: 'urgent-global-stability',
      greenNewDealForGlobalTrade: true,
      regenerativeSupplyChains: true
    }
  };
}
