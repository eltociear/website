// src/lib/utils/scrollManager.js
// Utility for managing scroll position during framework navigation

import { browser } from '$app/environment';
import { tick } from 'svelte';

/**
 * Scrolls to the top of the page smoothly
 * @param {boolean} immediate - Whether to scroll immediately without smooth animation
 */
export function scrollToTop(immediate = false) {
  if (!browser) return;
  
  const options = {
    top: 0,
    left: 0,
    behavior: immediate ? 'auto' : 'smooth'
  };
  
  window.scrollTo(options);
}

/**
 * Resets scroll position for framework page navigation
 * Should be called when navigating between framework pages
 */
export async function resetFrameworkPageScroll() {
  if (!browser) return;
  
  // Wait for the page to render
  await tick();
  
  // Small delay to ensure DOM is fully updated
  setTimeout(() => {
    scrollToTop(true); // Use immediate scroll for page navigation
  }, 50);
}

/**
 * Handles scroll restoration for SvelteKit navigation
 * Call this in onMount for framework pages
 */
export function initializeFrameworkPageScroll() {
  if (!browser) return;
  
  // Force scroll to top on page load
  resetFrameworkPageScroll();
  
  // Optional: Disable browser's native scroll restoration for this page
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
  }
}

/**
 * Smoothly scrolls to a specific element
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Optional offset from the top of the element
 */
export function scrollToElement(elementId, offset = 0) {
  if (!browser) return;
  
  const element = document.getElementById(elementId);
  if (element) {
    const elementTop = element.offsetTop - offset;
    window.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    });
  }
}
