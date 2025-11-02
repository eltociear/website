// src/routes/frameworks/tools/digital/[tool]/+page.js
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';
import { error } from '@sveltejs/kit';

export async function load({ params, depends }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const { tool } = params;
  const currentLocale = get(locale);
  
  // Validate the tool parameter
  const validTools = ['ai-chatbot', 'collaboration-platform', 'governance-simulator-app', 'health-dashboard'];
  if (!validTools.includes(tool)) {
    throw error(404, 'Tool not found');
  }
  
  let component;
  try {
    // Try to load the tool document in the current locale
    component = await import(`$lib/content/frameworks/${currentLocale}/implementation/digital/tools/digital-tools/${tool}.md`);
  } catch (e) {
    // Fall back to English if translation isn't available
    try {
      component = await import(`$lib/content/frameworks/en/implementation/digital/tools/digital-tools/${tool}.md`);
    } catch (e) {
      console.error(`Error loading tool markdown: ${e}`);
      component = null;
    }
  }
  
  return {
    tool,
    component: component?.default
  };
}
