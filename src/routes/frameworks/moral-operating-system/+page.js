// src/routes/frameworks/moral-operating-system/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
 if (DEBUG_FRAMEWORK_LOADING) console.log('🦋 Moral Operating System Framework +page.js - URL pathname:', url.pathname);
 if (DEBUG_FRAMEWORK_LOADING) console.log('🦋 Moral Operating System Framework +page.js - Full URL:', url.href);
 
 // Declare dependency on locale
 depends('app:locale');
 
 const currentLocale = get(locale);
 if (DEBUG_FRAMEWORK_LOADING) console.log('🦋 Current locale:', currentLocale);
 
 
 // Load framework translations for navigation
 try {
   if (DEBUG_FRAMEWORK_LOADING) console.log('🦋 About to call loadTranslations with:', currentLocale, url.pathname);
   await loadTranslations(currentLocale, url.pathname);
   if (DEBUG_FRAMEWORK_LOADING) console.log('🦋 loadTranslations completed');
 } catch (e) {
   if (DEBUG_FRAMEWORK_LOADING) console.warn('🦋 Failed to load translations:', e);
 }
 
 // Safe check for print mode that works during prerendering
 const isPrintMode = browser ? url.searchParams.get('print') === 'true' : false;
 
 // Define sections to load - Moral Operating System Framework sections in correct order
 const sections = [
   // Layer 1: One-Page Essence & Preamble
   'index',
   'essence',
   'preamble',
   'executive-summary-for-the-skeptic',
   
   // Layer 2: Core Framework
   'introduction',
   'foundational-values-principles',
   'rights-commitments',
   'governance-integration',
   'implementation-plan',
   
   // Layer 3: Implementation Appendices
   'appendix-a',
   'appendix-b',
   'appendix-c',
   'appendix-d',
   
   // Layer 4: Philosophical Treatise
   'what-is-a-right',
   'living-continuum-worth',
   'entitlement-to-entanglement',
   'spiral-ethical-growth',
   'ontological-humility',
   'rights-promise-future',
   
   // Ecosystem Integration
   'ecosystem-integration'
 ];
 
 // Track which sections fell back to English
 const sectionsUsingEnglishFallback = new Set();
 
 // Try to load modular content
 const content = {};
 let loadedSections = 0;
 
 if (DEBUG_FRAMEWORK_LOADING) console.log('Loading Moral Operating System Framework sections for locale:', currentLocale);
 
 // Try to load each section with proper error handling
 for (const section of sections) {
   try {
     // Try to load the current locale version first
     const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/moral-operating-system/${section}.md`);
     content[section] = await modulePromise;
     loadedSections++;
     if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
   } catch (primaryError) {
     // Fall back to English if translation isn't available
     try {
       const fallbackPromise = import(`$lib/content/frameworks/en/implementation/moral-operating-system/${section}.md`);
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
     message: 'Failed to load Moral Operating System Framework content',
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
   
   // Additional metadata for Moral Operating System Framework
   frameworkType: 'moral-operating-system',
   totalSections: sections.length,
   coreFrameworkSections: 5,
   hasSupplementaryMaterials: true,
   hasExecutiveSummary: true,
   
   // Moral Operating System Framework-specific metadata
   frameworkVersion: '2.4',
   isEthicalFramework: true,
   tier: 1, // Foundational Ethical Layer
   implementationPhases: 5,
   transformationYears: 26, // 2024-2050
   layeredArchitecture: 4,
   
   // Core ethical governance metadata
   dynamicRightsSpectrum: true,
   distributedGuardianship: true,
   earthCouncil: true,
   planetaryHealthCouncil: true,
   digitalJusticeTribunal: true,
   globalTechnologyCouncil: true,
   
   // Key components metadata
   rightsForAllBeings: true,
   spiralAwareTranslation: true,
   aiConsciousnessAssessment: true,
   ecosystemPersonhood: true,
   rightsStatusDashboard: true,
   citizenReportingPortal: true,
   
   // Rights framework metadata
   humanRightsTier1: true,
   animalRightsTier2: true,
   ecosystemRightsTier3: true,
   aiRightsTier4: true,
   emergentRightsTier45: true,
   planetaryRightsTier5: true,
   
   // Philosophical foundations metadata
   rightRelationship: true,
   ontologicalHumility: true,
   spiralEthicalGrowth: true,
   entitlementToEntanglement: true,
   livingContinuumWorth: true,
   rightsAsPromiseFuture: true,
   
   // Implementation tools metadata
   rightsSeedKit: true,
   ethicalDilemmaCards: true,
   communityDialogueFacilitation: true,
   spiralAwareMicrolearning: true,
   moonWishTest: true,
   multiculturalEthicsTranslation: true,
   
   // Campaign and engagement metadata
   rightsForAllBeingsCampaign: true,
   socialMediaEngagement: true,
   communityDialogues: true,
   rightsSeedKitDistribution: true,
   youthEthicsEducation: true,
   elderWisdomIntegration: true,
   
   // Framework integration metadata
   treatyEnforcement: 'treaty-for-our-only-home',
   aubiEthicalFoundation: 'aubi-framework',
   workLiberationEthics: 'work-in-liberation',
   indigenousEthicalGuidance: 'indigenous-governance',
   metaGovernanceEthics: 'meta-governance-framework',
   educationalEthicsIntegration: 'educational-systems',
   
   // Technology ethics metadata
   humanCenteredAI: true,
   aiEthicsCompliance: true,
   digitalRights: true,
   technologyGovernance: true,
   algorithmicTransparency: true,
   communityTechnologySovereignty: true,
   
   // Environmental and intergenerational metadata
   ecocideEnforcement: true,
   sevenGenerationThinking: true,
   planetaryBoundaries: true,
   biodiversityProtection: true,
   climateJustice: true,
   indigenousSovereignty: true,
   
   // Cultural integration metadata
   culturalEthicsTranslation: true,
   indigenousWisdomIntegration: true,
   ancestralKnowledgeRespect: true,
   ceremonyProtocolIntegration: true,
   traditionalEcologicalKnowledge: true,
   multiculturalEthics: true,
   
   // Implementation timeline metadata
   quickWinsPhase: '2024-2025',
   animalsEcosystemsPhase: '2025-2030',
   spaceGovernancePhase: '2030-2035',
   aiDigitalPhase: '2030-2040',
   comprehensiveSpacePhase: '2040+',
   fiftyYearVision: '2024-2074',
   
   // Monitoring and accountability metadata
   rightsStatusAtlas: true,
   realTimeMonitoring: true,
   transparentAccountability: true,
   citizenOversight: true,
   blockchainAudits: true,
   performanceIndicators: true,
   
   // Global coordination metadata
   universalHumanRights: true,
   planetsSystemsProtection: true,
   emergentConsciousnessProtection: true,
   intergalacticEthics: true,
   futureGenerationsAdvocacy: true,
   cosmicConsciousnessIntegration: true,
   
   // Access and participation metadata
   layeredAccessModel: true,
   multilingualResources: true,
   accessibilitySupport: true,
   communityControlledAccess: true,
   indigenousDataSovereignty: true,
   redLinesProtection: true,
   
   // Stakeholder engagement metadata
   governmentPartnership: true,
   corporateEthicsCompliance: true,
   civilSocietyAlliance: true,
   youthLeadership: true,
   elderWisdom: true,
   faithCommunityEngagement: true,
   
   // Debug information
   debug: {
     currentLocale,
     availableSections: Object.keys(content),
     fallbackSections: Array.from(sectionsUsingEnglishFallback),
     loadSuccess: loadedSections === sections.length,
     frameworkTier: 'foundational-ethical-layer',
     ethicalSourceCode: true,
     planetaryGovernanceReady: true,
     rightsForAllBeingsActivated: true,
     dynamicRightsSpectrumOperational: true,
     distributedGuardianshipImplemented: true,
     moralOperatingSystemActive: true
   }
 };
}
