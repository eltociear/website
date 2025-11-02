// src/routes/frameworks/environmental-stewardship/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Environmental Stewardship +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('introduction') || 
         cleanPath.includes('guiding-principles') ||
         cleanPath.includes('governance-structure') ||
         cleanPath.includes('core-pillars') ||
         cleanPath.includes('policy-mechanisms') ||
         cleanPath.includes('stakeholder-engagement') ||
         cleanPath.includes('financing-mechanisms') ||
         cleanPath.includes('implementation-roadmap') ||
         cleanPath.includes('metrics-for-success') ||
         cleanPath.includes('visualizations') ||
         cleanPath.includes('challenges-and-solutions') ||
         cleanPath.includes('implementation-tools') ||
         cleanPath.includes('reparations-protocol') ||
         cleanPath.includes('conclusion') ||
         cleanPath.includes('appendices') ||
         cleanPath.includes('one-page-essence') ||
         cleanPath.includes('first-100-days-playbook'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️  Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/environmental-stewardship';
    }
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Clean path for translations:', cleanPath);
    
    // Load translations for this specific page path
    if (DEBUG_FRAMEWORK_LOADING) console.log('About to call loadTranslations with:', currentLocale, cleanPath);
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    if (DEBUG_FRAMEWORK_LOADING) console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
    if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded translations for path:', cleanPath, 'with locale:', currentLocale);
  } catch (e) {
    console.error('Failed to load translations:', e);
    console.error('Error details:', e.stack);
  }
  
  // Safe check for print mode that works during prerendering
  // Only access url.search on the client side
  let isPrintMode = false;
  if (browser) {
    try {
      isPrintMode = url.search ? url.searchParams.get('print') === 'true' : false;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Print mode detected:', isPrintMode);
    } catch (e) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn('Could not access URL search params:', e);
      isPrintMode = false;
    }
  }

  // Define sections to load - environmental stewardship framework sections in correct order
  const sections = [
    // Framework overview and quick start
    'index',
    'one-page-essence',
    'first-100-days-playbook',
    
    // Core framework sections
    'introduction',
    'guiding-principles',
    'governance-structure',
    'core-pillars',
    'policy-mechanisms',
    'stakeholder-engagement',
    'financing-mechanisms',
    'implementation-roadmap',
    'metrics-for-success',
    'visualizations',
    'challenges-and-solutions',
    'implementation-tools',
    'reparations-protocol',
    'conclusion',
    
    // Appendices overview
    'appendices-overview',
    
    // Part I: Strategic Planning & Oversight
    'appendix-a', // Contingency Plans and Adaptive Management
    'appendix-b', // Detailed Pillar Strategies and Implementation
    'appendix-c', // Detailed Roadmap and Implementation Timeline
    'appendix-d', // Risk Assessment and Mitigation Matrix
    
    // Part II: Governance, Policy & Finance
    'appendix-e', // Governance Details and Institutional Frameworks
    'appendix-f', // Policy Implementation and Regulatory Frameworks
    'appendix-g', // Reparations Details and Justice Implementation
    'appendix-h', // Financing Details and Economic Mechanisms
    
    // Part III: Implementation, Engagement & Tools
    'appendix-i', // Implementation Toolkit and Protocol Library
    'appendix-j', // Engagement Materials and Public Resources
    'appendix-k', // Engagement Plans and Stakeholder Coordination
    'appendix-l', // Case Studies and Implementation Examples
    
    // Part IV: Core Protocols & Integration
    'appendix-m', // Cross-Framework Integration Protocols
    'appendix-n', // Data-to-Reward Pipeline Protocol
    'appendix-o', // Rights Hand-Off Protocol
    'appendix-p', // Cross-Council Coordination Charter
    
    // Part V: Measurement, Learning & Evidence
    'appendix-q', // Comprehensive Monitoring & Evaluation Indicators
    'appendix-r', // Visualization Gallery and Communication Tools
    'appendix-s'  // Framework Learning and Knowledge Systems
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading environmental stewardship sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/environmental-stewardship/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/environmental-stewardship/${section}.md`);
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
      message: 'Failed to load environmental stewardship content',
      details: 'The main index section could not be loaded'
    });
  }
  
  return {
    sections: content,
    // Always use modular approach
    isModular: true,
    isPrintMode, // This will be false during prerendering, true/false on client
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: loadedSections,
    totalSectionsCount: sections.length,
    
    // Additional metadata for environmental stewardship framework
    frameworkType: 'environmental-stewardship',
    totalSections: sections.length,
    coreFrameworkSections: 14, // introduction through conclusion
    quickStartSections: 2, // one-page-essence and first-100-days-playbook
    appendicesSections: 19, // appendices-overview plus 18 specific appendices
    hasOnePageEssence: true,
    hasFirstHundredDays: true,
    
    // Environmental stewardship-specific metadata
    frameworkVersion: '2.5',
    isEcologicalIntelligenceLayer: true,
    tierLevel: 2,
    integrationFrameworks: ['AUBI', 'Justice Systems', 'TGIF', 'Planetary Health', 'Meta-Governance'],
    governanceStructure: 'PHC-BAZ-Advisory',
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/environmental-stewardship'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
