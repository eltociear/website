// src/routes/frameworks/planetary-immune-system/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  if (DEBUG_FRAMEWORK_LOADING) console.log('🛡️ Planetary Immune System +page.js - URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('🛡️ Planetary Immune System +page.js - Full URL:', url.href);
  
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  if (DEBUG_FRAMEWORK_LOADING) console.log('🛡️ Current locale:', currentLocale);
  
  
  // Load framework translations for navigation
  try {
    if (DEBUG_FRAMEWORK_LOADING) console.log('🛡️ About to call loadTranslations with:', currentLocale, url.pathname);
    await loadTranslations(currentLocale, url.pathname);
    if (DEBUG_FRAMEWORK_LOADING) console.log('🛡️ loadTranslations completed');
  } catch (e) {
    if (DEBUG_FRAMEWORK_LOADING) console.warn('🛡️ Failed to load translations:', e);
  }
  
  // Safe check for print mode that works during prerendering
  const isPrintMode = browser ? url.searchParams.get('print') === 'true' : false;
  
  // Define sections to load - Planetary Immune System framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
    'introduction',
    'principles',
    'structural',
    'implementation',
    'coordination-response',
    'long-term-stewardship',
    
    // Implementation resources - appendices
    'threat-assessment',
    'crisis-protocols', 
    'technology-frameworks',
    'resource-mobilization',
    'success-metrics',
    'risk-assessment'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading Planetary Immune System sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/planetary-immune-system/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/planetary-immune-system/${section}.md`);
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
      message: 'Failed to load Planetary Immune System content',
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
    
    // Additional metadata for Planetary Immune System framework
    frameworkType: 'planetary-immune-system',
    totalSections: sections.length,
    coreFrameworkSections: 7,
    appendixSections: 5,
    hasSupplementaryMaterials: true,
    hasExecutiveSummary: true,
    
    // Planetary Immune System-specific metadata
    frameworkVersion: '1.0',
    isExistentialRiskFramework: true,
    tier: 4, // Planetary Immune System
    implementationPhases: 3,
    governanceBodies: 4,
    corePrinciples: 6,
    riskTiers: 3, // Tier 0, 1, 2
    
    // Existential Risk governance metadata
    existentialRiskObservatory: true,
    crisisCommandProtocol: true,
    worldRiskAssembly: true,
    globalResponseTeams: true,
    officeOfTheAdversary: true,
    epistemologicalPluralismMandate: true,
    
    // Key mechanisms metadata
    threatAssessment: true,
    crisisCoordination: true,
    communityProtection: true,
    culturalSovereignty: true,
    democraticAccountability: true,
    traditionalKnowledgeIntegration: true,
    
    // Integration metadata
    treatyIntegration: 'treaty-for-our-only-home',
    metaGovernanceIntegration: true,
    indigenousFrameworkAlignment: true,
    crossFrameworkSynergies: 5,
    
    // Implementation metadata
    foundationPhase: '3-years',
    integrationPhase: '4-years', 
    evolutionPhase: '8-years',
    emergencyResponseCapacity: true,
    planetaryDefenseProtocols: true,
    
    // Funding and resources metadata
    globalCommonsFund: true,
    sinTaxRevenue: true,
    equityCenteredDistribution: true,
    communityControlledResources: true,
    
    // Risk management metadata
    artificialIntelligenceRisk: true,
    biotechnologyRisk: true,
    nuclearRisk: true,
    climateRisk: true,
    emergingTechnologyRisk: true,
    
    // Community engagement metadata
    existentialCivicsEducation: true,
    mobileGERGRiskApp: true,
    communityBasedMonitoring: true,
    youthAuthority: true,
    
    // Success metrics metadata
    treatyAdoptionTarget: '80%',
    civicsEducationTarget: '100 million',
    resilienceCoverageTarget: '50%',
    communityControlledEvaluation: true,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkTier: 'planetary-immune-system',
      civilizationalDefense: true,
      existentialRiskManagement: true
    }
  };
}
