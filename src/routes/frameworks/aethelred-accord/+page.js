// src/routes/frameworks/aethelred-accord/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  if (DEBUG_FRAMEWORK_LOADING) console.log('🧬 Aethelred Accord +page.js - URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('🧬 Aethelred Accord +page.js - Full URL:', url.href);
  
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  if (DEBUG_FRAMEWORK_LOADING) console.log('🧬 Current locale:', currentLocale);
  
  
  // Load framework translations for navigation
  try {
    if (DEBUG_FRAMEWORK_LOADING) console.log('🧬 About to call loadTranslations with:', currentLocale, url.pathname);
    await loadTranslations(currentLocale, url.pathname);
    if (DEBUG_FRAMEWORK_LOADING) console.log('🧬 loadTranslations completed');
  } catch (e) {
    if (DEBUG_FRAMEWORK_LOADING) console.warn('🧬 Failed to load translations:', e);
  }
  
  // Safe check for print mode that works during prerendering
  const isPrintMode = browser ? url.searchParams.get('print') === 'true' : false;
  
  // Define sections to load - Aethelred Accord framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    'preamble',
    
    // Core framework sections
    'introduction',
    'universal-declaration',
    'core-principles',
    'governance-architecture',
    'operational-systems',
    'crisis-response',
    'implementation-roadmap',
    'cross-cutting-mechanisms',
    'funding-mechanisms',
    'framework-integration',
    
    // Implementation resources
    'tools-and-resources',
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading Aethelred Accord sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/aethelred-accord/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/aethelred-accord/${section}.md`);
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
      message: 'Failed to load Aethelred Accord content',
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
    
    // Additional metadata for Aethelred Accord framework
    frameworkType: 'aethelred-accord',
    totalSections: sections.length,
    coreFrameworkSections: 10,
    hasSupplementaryMaterials: true,
    hasExecutiveSummary: true,
    
    // Aethelred Accord-specific metadata
    frameworkVersion: '1.0',
    isBiotechnologyFramework: true,
    tier: 1, // Urgent Global Stability & Justice
    implementationPhases: 3,
    governanceBodies: 6,
    corePrinciples: 11,
    biosafettyLevels: 5,
    
    // Biotechnology governance metadata
    universalDeclarationOfBioethics: true,
    globalBiosafetyCouncil: true,
    biotechHealthAssemblies: true,
    youthBioethicsCouncils: true,
    geneticCommonsRegistry: true,
    biotechAccessFacility: true,
    
    // Key mechanisms metadata
    freepriorInformedConsent2: true,
    geneticResourceSovereignty: true,
    engineeredReversibility: true,
    radicalTransparency: true,
    intergenerationalProofOfHarmlessness: true,
    sentientBiomachinesGovernance: true,
    
    // Integration metadata
    treatyIntegration: 'treaty-for-our-only-home',
    planetaryHealthGovernance: true,
    indigenousFrameworkAlignment: true,
    crossFrameworkSynergies: 8,
    
    // Implementation metadata
    foundationPhase: '3-years',
    integrationPhase: '7-years', 
    maturationPhase: '5-years',
    biotechEmergencyCorps: true,
    crisisResponseProtocols: true,
    
    // Access and equity metadata
    universalAccess: true,
    patentBuyoutPools: true,
    progressivePricing: true,
    communityManufacturing: true,
    globalBiotechCommons: true,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkTier: 'urgent-global-stability',
      covenantForLifesCode: true,
      biotechnologyStewardship: true
    }
  };
}
