// src/routes/frameworks/shield-protocol/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false;

export async function load({ depends, url, params }) {
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Shield Protocol +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  try {
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('at-a-glance') ||
         cleanPath.includes('executive-summary-for-the-skeptic') ||
         cleanPath.includes('introduction') ||
         cleanPath.includes('core-principles') ||
         cleanPath.includes('governance-architecture') ||
         cleanPath.includes('operational-systems') ||
         cleanPath.includes('crisis-response') ||
         cleanPath.includes('implementation-roadmap') ||
         cleanPath.includes('cross-cutting-mechanisms') ||
         cleanPath.includes('funding-mechanisms') ||
         cleanPath.includes('framework-integration') ||
         cleanPath.includes('case-studies') ||
         cleanPath.includes('getting-started') ||
         cleanPath.includes('conclusion') ||
         cleanPath.includes('appendices'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️ Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/shield-protocol';
    }
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Clean path for translations:', cleanPath);
    
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    if (DEBUG_FRAMEWORK_LOADING) console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
  } catch (e) {
    console.error('Failed to load translations:', e);
    console.error('Error details:', e.stack);
  }
  
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

  const sections = [
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    'introduction',
    'core-principles',
    'governance-architecture',
    'operational-systems',
    'crisis-response',
    'implementation-roadmap',
    'cross-cutting-mechanisms',
    'funding-mechanisms',
    'framework-integration',
    'case-studies',
    'getting-started',
    'conclusion',
    'appendices'
  ];
  
  const sectionsUsingEnglishFallback = new Set();
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading Shield Protocol sections for locale:', currentLocale);
  
  for (const section of sections) {
    try {
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/shield-protocol/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/shield-protocol/${section}.md`);
        content[section] = await fallbackPromise;
        loadedSections++;
        
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded section:', section, 'in English as fallback');
        
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load section ${section} in any language:`, fallbackError.message);
        
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
  
  if (!content.index) {
    console.error('Critical: Could not load index section');
    throw error(500, {
      message: 'Failed to load Shield Protocol content',
      details: 'The main index section could not be loaded'
    });
  }
  
  return {
    sections: content,
    isModular: true,
    isPrintMode,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: loadedSections,
    totalSectionsCount: sections.length,
    frameworkType: 'shield-protocol',
    totalSections: sections.length,
    coreFrameworkSections: 9,
    foundationSections: 2,
    implementationSections: 3,
    referenceSections: 1,
    hasExecutiveSummary: true,
    protocolVersion: '1.0',
    isSecurityFramework: true,
    
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/shield-protocol'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
