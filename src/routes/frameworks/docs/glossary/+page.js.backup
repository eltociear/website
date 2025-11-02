// src/routes/frameworks/docs/glossary/+page.js
import { loadTranslations, locale } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export async function load({ depends }) {
  // Declare dependency on locale
  depends('app:locale');
  
  // Get the base locale from the store
  let currentLocale = get(locale);
  
  // Only check URL param in the browser, not during prerendering
  if (browser) {
    const url = new URL(window.location.href);
    const langParam = url.searchParams.get('lang');
    if (langParam) {
      currentLocale = langParam;
    }
  }
  
  // Explicitly load glossary translations
  await loadTranslations(currentLocale, '/frameworks/docs/glossary');
  
  return {};
}
