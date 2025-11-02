// src/routes/frameworks/docs/implementation/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export async function load({ depends, url }) {
  // Declare dependency on locale
  depends('app:locale');
  
  // Get the base locale from the store
  let currentLocale = get(locale);

 // Load framework translations for this route
  await loadTranslations(currentLocale, url.pathname);
  
  // Only check URL param in the browser, not during prerendering
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
    content = await import(`$lib/content/frameworks/${currentLocale}/implementation.md`);
  } catch (e) {
    // Fall back to English if translation isn't available
    content = await import(`$lib/content/frameworks/en/implementation.md`);
  }
  
  return {
    component: content.default
  };
}
