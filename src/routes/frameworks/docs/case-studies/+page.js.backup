// src/routes/frameworks/docs/case-studies/+page.js
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export async function load({ depends }) {
  // Declare dependency on locale
  depends('app:locale');
  
  // Only check URL param in the browser, not during prerendering
  let currentLocale = get(locale);
  
  // This conditional ensures we don't try to access URL during prerendering
  if (browser) {
    const url = new URL(window.location.href);
    const langParam = url.searchParams.get('lang');
    if (langParam) {
      currentLocale = langParam;
    }
  }
  
  let content;
  try {
    // Try to load the current locale version
    content = await import(`$lib/content/frameworks/${currentLocale}/case-studies.md`);
  } catch (e) {
    // Fall back to English if translation isn't available
    content = await import(`$lib/content/frameworks/en/case-studies.md`);
  }
  
  return {
    component: content.default
  };
}
