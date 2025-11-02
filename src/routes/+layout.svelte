<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css';
  import Footer from '$lib/components/Footer.svelte';
  import { locale, loadTranslations, detectLocale } from '$lib/i18n';
  import { onMount, onDestroy } from 'svelte';
  import { navigating, page } from '$app/stores';
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import { afterNavigate } from '$app/navigation';
  import { writable } from 'svelte/store';
  import Header from '$lib/components/Header.svelte';
  import GlobalNotice from '$lib/components/GlobalNotice.svelte';
  import { registerServiceWorker } from '$lib/utils/registerServiceWorker';
  import { preloadFrameworkDatabase } from '$lib/data/precomputedFrameworkDatabase';

  
  // Initialize stores at the top level
  let serviceWorkerRegistered = false;
  let loadingTimeout = null;
  
  // Initialize as false to prevent premature rendering
  const translationsLoaded = writable(false);

  onMount(async () => {
    preloadFrameworkDatabase();
    if (browser) {
      try {
        const initLocale = detectLocale();
        let path = $page.url.pathname;
        
        // Load translations BEFORE setting as loaded
        await loadTranslations(initLocale, path);
        locale.set(initLocale);
        translationsLoaded.set(true); // Only set true after translations load
      } catch (e) {
        console.error("Translation loading error:", e);
        translationsLoaded.set(true); // Still show content on error
      }
    }
  });

  // Clear timeout on destroy
  onDestroy(() => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
  });

  // Handle navigation - only in browser
  $: if (browser && $navigating) {
    console.log(`Navigating to: ${$navigating.to?.url.pathname}`);
    
    let path = $navigating.to?.url.pathname || '/';
    
    loadTranslations($locale, path)
      .catch(e => console.error("Translation loading error during navigation:", e));
  }

  afterNavigate(() => {
    if (browser) {
      window.scrollTo(0, 0);
    }
  });
</script>

<!-- FIXED: Remove ALL Tailwind classes that conflict with custom CSS -->
<div class="site-layout">
  <Header />
  <GlobalNotice />
  <main class="main-content">
    {#key $page.url.pathname}
      <slot />
    {/key}
  </main>
  
  <Footer />
</div>

<style>
  /* FIXED: Use custom CSS instead of conflicting Tailwind classes */
  .site-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    /* Remove conflicting padding and margins that interfere with framework cards */
    padding: 0;
    margin: 0;
  }

  /* Override any remaining Tailwind interference */
  :global(.main-content *) {
    /* Prevent Tailwind from overriding component styles */
    box-sizing: border-box;
  }

  /* Specifically target and fix the framework cards interference */
  :global(.main-content .framework-item) {
    /* Ensure no Tailwind classes interfere */
    margin: 0 !important;
    padding: 0 !important;
  }

  :global(.main-content .framework-item *) {
    /* Prevent any inherited Tailwind issues */
    box-sizing: border-box;
  }
</style>
