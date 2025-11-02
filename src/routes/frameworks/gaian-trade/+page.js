// src/routes/frameworks/gaian-trade/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  if (DEBUG_FRAMEWORK_LOADING) console.log('🌍 Gaian Trade Framework +page.js - URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('🌍 Gaian Trade Framework +page.js - Full URL:', url.href);
  
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  if (DEBUG_FRAMEWORK_LOADING) console.log('🌍 Current locale:', currentLocale);
  
  
  // Load framework translations for navigation
  try {
    if (DEBUG_FRAMEWORK_LOADING) console.log('🌍 About to call loadTranslations with:', currentLocale, url.pathname);
    await loadTranslations(currentLocale, url.pathname);
    if (DEBUG_FRAMEWORK_LOADING) console.log('🌍 loadTranslations completed');
  } catch (e) {
    if (DEBUG_FRAMEWORK_LOADING) console.warn('🌍 Failed to load translations:', e);
  }
  
  // Safe check for print mode that works during prerendering
  const isPrintMode = browser ? url.searchParams.get('print') === 'true' : false;
  
  // Define sections to load - Gaian Trade Framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    
    // Foundation sections
    'introduction',
    'sacred-covenant',
    'core-principles',
    
    // Core framework sections
    'governance-architecture',
    'key-mechanisms',
    'implementation-pathways',
    'regional-integration',
    'crisis-response',
    'monitoring-evaluation',
    
    // Implementation resources
    'tools-resources',
    'getting-started',
    
    // Conclusion and appendices
    'conclusion',
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading Gaian Trade Framework sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/gaian-trade/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/gaian-trade/${section}.md`);
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
      message: 'Failed to load Gaian Trade Framework content',
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
    
    // Additional metadata for Gaian Trade Framework
    frameworkType: 'gaian-trade',
    totalSections: sections.length,
    coreFrameworkSections: 9,
    hasSupplementaryMaterials: true,
    hasExecutiveSummary: true,
    
    // Gaian Trade Framework-specific metadata
    frameworkVersion: '1.0',
    isTradeFramework: true,
    tier: 1, // Urgent Global Stability & Justice
    implementationPhases: 3,
    governanceBodies: 5,
    corePrinciples: 9,
    regenerativeTradeZones: true,
    
    // Trade governance metadata
    sacredCovenant: true,
    globalTradeResourceCouncil: true,
    indigenousTradeCouncils: true,
    bioregionalTradeHubs: true,
    youthBioregionalAssemblies: true,
    globalCommonsOffice: true,
    
    // Key mechanisms metadata
    digitalProductPassports: true,
    planetaryBoundaryTariffs: true,
    globalCommonsRoyalties: true,
    fairFlowCertification: true,
    justTransitionFund: true,
    reparationsTradeRoutes: true,
    
    // Sacred covenant elements
    tradeAsCeremony: true,
    planetaryBoundariesInviolable: true,
    indigenousSovereigntyFoundational: true,
    futureGenerationsPresent: true,
    commonsBelongToAll: true,
    justiceNonNegotiable: true,
    
    // Integration metadata
    treatyIntegration: 'treaty-for-our-only-home',
    planetaryResourceStewardship: true,
    indigenousFrameworkAlignment: true,
    crossFrameworkSynergies: 12,
    financialSystemsIntegration: true,
    
    // Implementation metadata
    foundationPhase: '5-years',
    scalingPhase: '10-years', 
    stewardshipPhase: '15-years',
    globalStrategicReserve: true,
    crisisResponseProtocols: true,
    
    // Trade transformation metadata
    extractiveToRegenerative: true,
    transparentSupplyChains: true,
    bioregionalSelfReliance: true,
    circularByDesign: true,
    decolonizedExchange: true,
    intergenerationalEquity: true,
    
    // Economic justice metadata
    heartsLeavesCurrencies: true,
    patentBuyoutPools: true,
    workerCooperatives: true,
    communityOwnership: true,
    globalCommonsWealth: true,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkTier: 'urgent-global-stability',
      sacredCovenantForPlanetaryHealing: true,
      regenerativeCommerce: true,
      materialKinshipReweaving: true
    }
  };
}
