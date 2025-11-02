// src/routes/frameworks/work-in-liberation/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
 if (DEBUG_FRAMEWORK_LOADING) console.log('👥 Work in Liberation Framework +page.js - URL pathname:', url.pathname);
 if (DEBUG_FRAMEWORK_LOADING) console.log('👥 Work in Liberation Framework +page.js - Full URL:', url.href);
 
 // Declare dependency on locale
 depends('app:locale');
 
 const currentLocale = get(locale);
 if (DEBUG_FRAMEWORK_LOADING) console.log('👥 Current locale:', currentLocale);
 
 
 // Load framework translations for navigation
 try {
   if (DEBUG_FRAMEWORK_LOADING) console.log('👥 About to call loadTranslations with:', currentLocale, url.pathname);
   await loadTranslations(currentLocale, url.pathname);
   if (DEBUG_FRAMEWORK_LOADING) console.log('👥 loadTranslations completed');
 } catch (e) {
   if (DEBUG_FRAMEWORK_LOADING) console.warn('👥 Failed to load translations:', e);
 }
 
 // Safe check for print mode that works during prerendering
 const isPrintMode = browser ? url.searchParams.get('print') === 'true' : false;
 
 // Define sections to load - Work in Liberation Framework sections in correct order
 const sections = [
   // Entry point and overview
   'index',
   'at-a-glance',
   'executive-summary-for-the-skeptic',
   
   // Foundation sections
   'preamble',
   'introduction',
   'core-principles',
   
   // Core framework sections
   'core-components',
   'implementation-plan',
   'tools-technologies',
   'monitoring-evaluation',
   'crisis-response',
   'expected-outcomes',
   
   // Integration and implementation
   'framework-integration',
   'global-implementation',
   
   // Conclusion and resources
   'conclusion',
   'appendices'
 ];
 
 // Track which sections fell back to English
 const sectionsUsingEnglishFallback = new Set();
 
 // Try to load modular content
 const content = {};
 let loadedSections = 0;
 
 if (DEBUG_FRAMEWORK_LOADING) console.log('Loading Work in Liberation Framework sections for locale:', currentLocale);
 
 // Try to load each section with proper error handling
 for (const section of sections) {
   try {
     // Try to load the current locale version first
     const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/work-in-liberation/${section}.md`);
     content[section] = await modulePromise;
     loadedSections++;
     if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
   } catch (primaryError) {
     // Fall back to English if translation isn't available
     try {
       const fallbackPromise = import(`$lib/content/frameworks/en/implementation/work-in-liberation/${section}.md`);
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
     message: 'Failed to load Work in Liberation Framework content',
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
   
   // Additional metadata for Work in Liberation Framework
   frameworkType: 'work-in-liberation',
   totalSections: sections.length,
   coreFrameworkSections: 10,
   hasSupplementaryMaterials: true,
   hasExecutiveSummary: true,
   
   // Work in Liberation Framework-specific metadata
   frameworkVersion: '2.3',
   isLabourFramework: true,
   tier: 1, // Foundational Organizational Framework
   implementationPhases: 3,
   transformationYears: 25,
   corePrinciples: 5,
   
   // Core governance metadata
   fractalLaborParliament: true,
   communityWorkTeams: true,
   aubiIntegration: true,
   indigenousLeadership: true,
   bioregionalAutonomousZones: true,
   
   // Key components metadata
   loveLedger: true,
   heartsLeavesCurrencies: true,
   greenJobScore: true,
   flexibleTimeAgreements: true,
   communityWorkApp: true,
   industrialSunsetting: true,
   
   // Economic transformation metadata
   workWithPurpose: true,
   careRevolution: true,
   greenRenaissance: true,
   cooperativeConversion: true,
   gigPlatformReplacement: true,
   justTransition: true,
   
   // Technology integration metadata
   humanAiSymbiosis: true,
   technologyThatServes: true,
   communityControlledTech: true,
   skillsResonanceMatching: true,
   ecoGriefSupport: true,
   
   // Cultural integration metadata
   indigenousPrimacy: true,
   culturalIntegration: true,
   communityWeavers: true,
   ceremonialGovernance: true,
   traditionalEcologicalKnowledge: true,
   
   // Implementation metadata
   experimentationPhase: '2025-2035',
   scalingPhase: '2035-2045', 
   globalIntegrationPhase: '2045-2055',
   twentyFiveYearPlan: true,
   pilotMatrix: true,
   
   // Economic justice metadata
   postGrowthDoctrine: true,
   grossPlanetaryHealth: true,
   freedomFromSurvivalWork: true,
   fairPluralRewards: true,
   ecologicalSocialJustice: true,
   
   // Framework integration metadata
   treatyIntegration: 'treaty-for-our-only-home',
   aubiFoundation: 'aubi-framework',
   financialSystemsIntegration: 'financial-systems-framework',
   indigenousFrameworkAlignment: 'indigenous-governance',
   metaGovernanceCoordination: 'meta-governance-framework',
   peaceConflictResolution: 'peace-conflict-resolution-framework',
   
   // Monitoring and outcomes metadata
   communityWellbeingIndex: true,
   lmciMetrics: true, // Love, Meaning, and Connection Index
   loveLedgerTracking: true,
   adaptiveManagement: true,
   crisisResilienceCompass: true,
   
   // Coalition building metadata
   indigenousPartnerships: true,
   unionAlignment: true,
   cooperativeMovement: true,
   youthLeadership: true,
   elderWisdom: true,
   disabilityJustice: true,
   
   // Debug information
   debug: {
     currentLocale,
     availableSections: Object.keys(content),
     fallbackSections: Array.from(sectionsUsingEnglishFallback),
     loadSuccess: loadedSections === sections.length,
     frameworkTier: 'foundational-organizational',
     workAsPlanetalyContribution: true,
     communityWorkTeamsReady: true,
     loveLedgerInDevelopment: true,
     transformativeLabourGovernance: true,
     workInLiberationMovement: true
   }
 };
}
