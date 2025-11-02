// src/routes/frameworks/adaptive-universal-basic-income/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  if (DEBUG_FRAMEWORK_LOADING) console.log('💰 AUBI Framework +page.js - URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('💰 AUBI Framework +page.js - Full URL:', url.href);
  
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  if (DEBUG_FRAMEWORK_LOADING) console.log('💰 Current locale:', currentLocale);
  
  
  // Load framework translations for navigation
  try {
    if (DEBUG_FRAMEWORK_LOADING) console.log('💰 About to call loadTranslations with:', currentLocale, url.pathname);
    await loadTranslations(currentLocale, url.pathname);
    if (DEBUG_FRAMEWORK_LOADING) console.log('💰 loadTranslations completed');
  } catch (e) {
    if (DEBUG_FRAMEWORK_LOADING) console.warn('💰 Failed to load translations:', e);
  }
  
  // Safe check for print mode that works during prerendering
  const isPrintMode = browser ? url.searchParams.get('print') === 'true' : false;
  
  // Define sections to load - AUBI framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'technical-fact-sheet',
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
    'introduction',
    'aubi-philosophy',
    'core-architecture',
    'four-layer-payout-system',
    'hearts-leaves-currency',
    'governance-model',
    'implementation-roadmap',
    'cultural-integration',
    'technical-infrastructure',
    'crisis-response-protocols',
    'framework-integration',
    
    // Conclusion and appendices
    'conclusion',
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading AUBI Framework sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/adaptive-universal-basic-income/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/adaptive-universal-basic-income/${section}.md`);
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
      message: 'Failed to load AUBI Framework content',
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
    
    // Additional metadata for AUBI framework
    frameworkType: 'adaptive-universal-basic-income',
    totalSections: sections.length,
    coreFrameworkSections: 11,
    hasSupplementaryMaterials: true,
    hasExecutiveSummary: true,
    hasTechnicalFactSheet: true,
    
    // AUBI-specific metadata
    frameworkVersion: '5.0',
    isEconomicFramework: true,
    tier: 1, // Foundational Social Framework
    implementationPhases: 3,
    payoutLayers: 4,
    corePrinciples: 7, // Right Relationship principles
    currencyTypes: 2, // Hearts & Leaves
    
    // Economic governance metadata
    socialResilienceCouncil: true,
    bioregionalAutonomousZones: true,
    loveConnectionnMeaningIndex: true,
    youthCivicInternships: true,
    globalCommonsFund: true,
    loveLedgerPlatform: true,
    
    // Key mechanisms metadata
    rightRelationshipEconomics: true,
    careEconomyRecognition: true,
    ecologicalRestoration: true,
    relationalWealth: true,
    automationTaxation: true,
    communityValidation: true,
    
    // Currency and technology metadata
    heartsCurrency: true,
    leavesCurrency: true,
    hyperledgerFabric: true,
    indigenousDataSovereignty: true,
    postQuantumCryptography: true,
    aiGovernanceProtocols: true,
    
    // Integration metadata
    treatyIntegration: 'treaty-for-our-only-home',
    indigenousFrameworkAlignment: true,
    metaGovernanceCoordination: true,
    planetaryHealthGovernance: true,
    financialSystemsIntegration: true,
    workLiberationFramework: true,
    crossFrameworkSynergies: 6,
    
    // Implementation metadata
    pilotPhase: '3-years',
    regionalPhase: '4-years', 
    globalPhase: '8-years',
    communityWeavers: true,
    crisisResponseProtocols: true,
    culturalAdaptation: true,
    
    // Access and equity metadata
    universalBaseline: true,
    contributionBonuses: true,
    equitySupplements: true,
    indigenousSovereignty: true,
    youthAuthority: true,
    democraticGovernance: true,
    
    // Funding and economics metadata
    diversifiedFunding: true,
    automationTax: true,
    resourceExtractionFees: true,
    digitalCommonsDividends: true,
    financialTransactionTax: true,
    carbonPricing: true,
    
    // Crisis and resilience metadata
    economicCrisisProtocols: true,
    politicalCrisisResponse: true,
    technicalCrisisManagement: true,
    indigenousLedRecovery: true,
    communityResilience: true,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkTier: 'foundational-social',
      rightRelationshipEconomics: true,
      indigenousGuidedGovernance: true,
      heartsLeavesLifeblood: true,
      regenerativeCivilization: true
    }
  };
}
