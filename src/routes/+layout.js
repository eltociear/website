// src/routes/+layout.js
import { locale, loadTranslations, detectLocale } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export async function load({ url }) {
  const currentLocale = browser ? (get(locale) || detectLocale()) : 'en';
  
  try {
    // Load translations on both server and client
    await loadTranslations(currentLocale, url.pathname);
  } catch (e) {
    console.warn('Failed to load translations in layout:', e);
  }
  
  return {
    // Pass the locale to the page so it's available during SSR
    initialLocale: currentLocale
  };
}
