// src/routes/frameworks/financial-systems/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
 if (DEBUG_FRAMEWORK_LOADING) console.log('❤️ Financial Systems +page.js - URL pathname:', url.pathname);
 if (DEBUG_FRAMEWORK_LOADING) console.log('❤️ Financial Systems +page.js - Full URL:', url.href);
 
 // Declare dependency on locale
 depends('app:locale');
 
 const currentLocale = get(locale);
 if (DEBUG_FRAMEWORK_LOADING) console.log('❤️ Current locale:', currentLocale);
 
 
 // Load framework translations for navigation
 try {
   if (DEBUG_FRAMEWORK_LOADING) console.log('❤️ About to call loadTranslations with:', currentLocale, url.pathname);
   await loadTranslations(currentLocale, url.pathname);
   if (DEBUG_FRAMEWORK_LOADING) console.log('❤️ loadTranslations completed');
 } catch (e) {
   if (DEBUG_FRAMEWORK_LOADING) console.warn('❤️ Failed to load translations:', e);
 }
 
 // Safe check for print mode that works during prerendering
 const isPrintMode = browser ? url.searchParams.get('print') === 'true' : false;
 
 // Define sections to load - Financial Systems framework sections in correct order
 const sections = [
   // Entry point and overview
   'index',
   'at-a-glance',
   'executive-summary-for-the-skeptic',
   
   // Core framework sections
   'introduction',
   'hearts-leaves-philosophy',
   'core-architecture',
   'value-systems-integration',
   'hearts-leaves-currency',
   'love-ledger-platform',
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
 
 if (DEBUG_FRAMEWORK_LOADING) console.log('Loading Financial Systems sections for locale:', currentLocale);
 
 // Try to load each section with proper error handling
 for (const section of sections) {
   try {
     // Try to load the current locale version first
     const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/financial-systems/${section}.md`);
     content[section] = await modulePromise;
     loadedSections++;
     if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
   } catch (primaryError) {
     // Fall back to English if translation isn't available
     try {
       const fallbackPromise = import(`$lib/content/frameworks/en/implementation/financial-systems/${section}.md`);
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
     message: 'Failed to load Financial Systems content',
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
   
   // Additional metadata for Financial Systems framework
   frameworkType: 'financial-systems',
   totalSections: sections.length,
   coreFrameworkSections: 11,
   hasSupplementaryMaterials: true,
   hasExecutiveSummary: true,
   
   // Financial Systems-specific metadata
   frameworkVersion: '1.0',
   isFoundationalEconomicFramework: true,
   tier: 1, // Foundational Economic Framework
   implementationPhases: 3,
   currencyTypes: 2, // Hearts & Leaves
   corePrinciples: 7,
   
   // Hearts & Leaves currency metadata
   heartsCurrency: true,
   leavesCurrency: true,
   loveLedger: true,
   aubiIntegration: true,
   communityWeavers: true,
   socialResilienceCouncil: true,
   lmciIndex: true,
   rightRelationship: true,
   
   // Key mechanisms metadata
   careEconomyRecognition: true,
   ecologicalRestorationRewards: true,
   communityValidation: true,
   culturalAdaptation: true,
   interCurrencyTranslation: true,
   proofOfCare: true,
   antiAccumulation: true,
   giftEconomyIntegration: true,
   
   // Governance metadata
   indigenousEarthCouncil: true,
   fractalLaborParliament: true,
   digitalJusticeTribunal: true,
   redLinesClause: true,
   fpic2Protocol: true,
   democraticAssemblies: true,
   consensusBuilding: true,
   rotatingLeadership: true,
   
   // Integration metadata
   treatyIntegration: 'treaty-for-our-only-home',
   aubiFramework: true,
   nestedSovereigntyFramework: true,
   workInLiberationFramework: true,
   indigenousFrameworkAlignment: true,
   metaGovernanceIntegration: true,
   planetaryHealthAlignment: true,
   crossFrameworkSynergies: 8,
   
   // Implementation metadata
   minimumViableHeartsEconomy: true,
   pilotPhase: '3-years',
   regionalPhase: '4-years', 
   globalPhase: '8-years',
   communityPilots: 5,
   bioregionalNetworks: 25,
   targetCommunities: 100,
   
   // Economic innovation metadata
   sacredEconomics: true,
   regenerativeFinance: true,
   communityControlledCurrency: true,
   careAsCapital: true,
   ecologicalWealthCreation: true,
   giftEconomyRevival: true,
   mutualCreditNetworks: true,
   participatoryBudgeting: true,
   
   // Technical infrastructure metadata
   hyperledgerFabric: true,
   blockchainSovereignty: true,
   indigenousNodes: true,
   postQuantumCryptography: true,
   zeroKnowledgePrivacy: true,
   mobileFirst: true,
   offlineCapability: true,
   universalAccessibility: true,
   
   // Cultural protection metadata
   traditionalKnowledgeProtection: true,
   ceremonialGovernance: true,
   languageSovereignty: true,
   culturalProtocols: true,
   spiritualBoundaries: true,
   antiAppropriation: true,
   sevenGenerationsThinking: true,
   
   // Care economy metadata
   unpaidWorkRecognition: true,
   careWorkValuation: true,
   elderCareSupport: true,
   childCareRecognition: true,
   disabilityJustice: true,
   familyCareSupport: true,
   communityHealing: true,
   emotionalLaborRecognition: true,
   
   // Ecological restoration metadata
   carbonSequestration: true,
   biodiversityProtection: true,
   ecosystemRestoration: true,
   traditionalStewardship: true,
   climateAdaptation: true,
   watershedProtection: true,
   soilRegeneration: true,
   wildlifeHabitat: true,
   
   // Crisis response metadata
   economicResilience: true,
   communityMutualAid: true,
   crisisCoordination: true,
   emergencyProtocols: true,
   democraticContinuity: true,
   culturalContinuity: true,
   technicalResilience: true,
   
   // Debug information
   debug: {
     currentLocale,
     availableSections: Object.keys(content),
     fallbackSections: Array.from(sectionsUsingEnglishFallback),
     loadSuccess: loadedSections === sections.length,
     frameworkTier: 'foundational-economic',
     economicsOfRightRelationship: true,
     financialSystemsAsChannels: true,
     heartsLeavesPhilosophy: true,
     communityControlledFinance: true,
     indigenousWisdomGuided: true,
     regenerativeAbundance: true
   }
 };
}
