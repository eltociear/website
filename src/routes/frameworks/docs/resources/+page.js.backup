// src/routes/frameworks/docs/resources/+page.js
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

export async function load({ depends }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  let content;
  try {
    // Try to load the current locale version
    content = await import(`$lib/content/frameworks/${currentLocale}/resources.md`);
  } catch (e) {
    // Fall back to English if translation isn't available
    content = await import(`$lib/content/frameworks/en/resources.md`);
  }
  
  return {
    component: content.default
  };
}
