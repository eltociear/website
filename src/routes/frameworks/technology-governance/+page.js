// src/routes/frameworks/technology-governance/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('at-a-glance') || 
         cleanPath.includes('executive-summary-for-the-skeptic') ||
         cleanPath.includes('principles') || 
         cleanPath.includes('position') ||
         cleanPath.includes('gtc') ||
         cleanPath.includes('trrt') ||
         cleanPath.includes('oversight') ||
         cleanPath.includes('indigenous') ||
         cleanPath.includes('mechanisms') ||
         cleanPath.includes('economy') ||
         cleanPath.includes('roadmap') ||
         cleanPath.includes('tools') ||
         cleanPath.includes('emerging') ||
         cleanPath.includes('evaluation') ||
         cleanPath.includes('case-studies') ||
         cleanPath.includes('international') ||
         cleanPath.includes('glossary') ||
         cleanPath.includes('references') ||
         cleanPath.includes('contributing') ||
         cleanPath.includes('playbook') ||
         cleanPath.includes('trrt-detailed') ||
         cleanPath.includes('starter-kit-detailed') ||
         cleanPath.includes('circuit-breaker') ||
         cleanPath.includes('crisis-unit') ||
         cleanPath.includes('international-detailed') ||
         cleanPath.includes('implementation-strategy') ||
         cleanPath.includes('documentation') ||
         cleanPath.includes('philosophy'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️  Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/technology-governance';
    }
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Clean path for translations:', cleanPath);
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('About to call loadTranslations with:', currentLocale, cleanPath);
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    if (DEBUG_FRAMEWORK_LOADING) console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
    if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded translations for path:', cleanPath, 'with locale:', currentLocale);
  } catch (e) {
    console.error('Failed to load translations:', e);
    console.error('Error details:', e.stack);
  }
  
  // Safe check for print mode that works during prerendering
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

  // Define sections to load - technology governance framework sections in logical order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    
    // Foundation sections
    'principles',
    'position',
    
    // Structure sections
    'gtc',
    'trrt',
    'oversight',
    
    // Operation sections
    'indigenous',
    'mechanisms',
    'economy',
    
    // Implementation sections
    'roadmap',
    'tools',
    'emerging',
    'evaluation',
    
    // Examples and cooperation
    'case-studies',
    'international',
    
    // Reference materials
    'glossary',
    'references',
    'contributing',
    
    // Implementation tools
    'playbook',
    'trrt-detailed',
    'starter-kit-detailed',
    
    // Crisis & security protocols
    'circuit-breaker',
    'crisis-unit',
    
    // Coordination & cooperation
    'international-detailed',
    'implementation-strategy',
    
    // Evaluation & documentation
    'documentation',
    'philosophy'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading technology governance sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/technology-governance/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/technology-governance/${section}.md`);
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
      message: 'Failed to load technology governance content',
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
    
    // Additional metadata for technology governance framework
    frameworkType: 'technology-governance',
    totalSections: sections.length,
    foundationSections: 5, // index, at-a-glance, executive-summary, principles, position
    structureSections: 3, // gtc, trrt, oversight
    operationSections: 3, // indigenous, mechanisms, economy
    implementationSections: 4, // roadmap, tools, emerging, evaluation
    examplesSections: 2, // case-studies, international
    referenceSections: 3, // glossary, references, contributing
    toolsSections: 3, // playbook, trrt-detailed, starter-kit-detailed
    crisisSections: 2, // circuit-breaker, crisis-unit
    coordinationSections: 2, // international-detailed, implementation-strategy
    evaluationSections: 2, // documentation, philosophy
    
    // Technology governance specific metadata
    frameworkVersion: '3.2',
    tgifVersion: '1.0',
    hasCybersecurityCouncil: true,
    implementationMilestones: 4,
    riskTiers: 4,
    hasEthicalCircuitBreaker: true,
    hasCrisisResponseUnit: true,
    hasAmnestyProgram: true,
    
    // Core innovations
    coreInnovations: [
      'Cybersecurity & Resilience Council',
      'Ethical Circuit Breaker Protocol',
      'Tech Crisis Response Unit',
      'Technology Amnesty Program',
      'Digital Well-being by Design'
    ],
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/technology-governance'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
