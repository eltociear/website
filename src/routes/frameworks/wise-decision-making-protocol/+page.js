// src/routes/frameworks/wise-decision-making-protocol/+page.js
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends }) {
  // Declare dependency on locale
  depends('app:locale');
  
  return {
  };
}
