<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css';
  import Footer from '$lib/components/Footer.svelte';
  import { translationsLoaded, locale, loadTranslations, detectLocale } from '$lib/i18n';
  // ADD tick HERE
  import { onMount, onDestroy, tick } from 'svelte';
  import { navigating, page } from '$app/stores';
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import { afterNavigate, goto } from '$app/navigation';
  import Header from '$lib/components/Header.svelte';
  import GlobalNotice from '$lib/components/GlobalNotice.svelte';
  import { registerServiceWorker } from '$lib/utils/registerServiceWorker';
  import { preloadFrameworkDatabase } from '$lib/data/precomputedFrameworkDatabase';

  const DEBUG_LOG = false;
  // Initialize stores at the top level
  let serviceWorkerRegistered = false;
  let loadingTimeout = null;
  // Add this function to handle sidebar clicks without preloading
  function handleSidebarClick(event) {
    const sidebarLink = event.target.closest('.sidebar a');
    if (sidebarLink && sidebarLink.href) {
      event.preventDefault();
      goto(sidebarLink.href);
    }
  }

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
        if (DEBUG_LOG) console.error("Translation loading error:", e);
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
    if (DEBUG_LOG) console.log(`Navigating to: ${$navigating.to?.url.pathname}`);
    let path = $navigating.to?.url.pathname || '/';
    
    loadTranslations($locale, path)
      .catch(e => console.error("Translation loading error during navigation:", e));
  }

  // UPDATED SCROLL LOGIC
  afterNavigate(async () => {
    if (browser) {
      await tick(); // Wait for the #key block to finish re-rendering the DOM
      // Use instant to prevent fighting with CSS transitions or browser restoration
      window.scrollTo({ top: 0, behavior: 'instant' }); 
    }
  });
</script>

<div class="site-layout" data-sveltekit-preload-data="tap">
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
  /* Your existing styles */
  .site-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    padding: 0;
    margin: 0;
  }

  /* Override any remaining Tailwind interference */
  :global(.main-content *) {
    box-sizing: border-box;
  }

  :global(.main-content .framework-item) {
    margin: 0 !important;
    padding: 0 !important;
  }

  :global(.main-content .framework-item *) {
    box-sizing: border-box;
  }
</style>
