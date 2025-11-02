<!-- src/routes/frameworks/emergent-governance-protocol/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  const DEBUG_LOG = false;

  export let data;

  // Translation state
  $: translationsReady = $isLocaleLoaded;
  $: egp = translationsReady ? ($t('egpFramework') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'emergent-governance-protocol';
  let mounted = false;
  let isPrintMode = false;

  // Computed values
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/emergent-governance-protocol') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/emergent-governance-protocol${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/emergent-governance-protocol');
        } catch (e) {
          if (DEBUG_LOG) console.error('Failed to reload translations:', e);
        }
      }
      
      // Set initial section from URL
      const urlParams = new URLSearchParams(window.location.search);
      isPrintMode = urlParams.get('print') === 'true';
      
      const sectionParam = urlParams.get('section');
      const hashSection = (extractedHash || window.location.hash).substring(1);
      
      if (sectionParam && data?.sections?.[sectionParam]) {
        activeSection = sectionParam;
      } else if (hashSection && data?.sections?.[hashSection]) {
        activeSection = hashSection;
      }
      
      // Global function for PDF generation
      window.showAllSectionsForPrint = () => { isPrintMode = true; };
      
      // Listen for hash changes
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash && data?.sections?.[hash] && activeSection !== hash) {
          activeSection = hash;
          
          // Scroll to content
          setTimeout(() => {
            const contentElement = document.querySelector('.section-content');
            if (contentElement) {
              contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 100);
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        if (window.showAllSectionsForPrint) {
          delete window.showAllSectionsForPrint;
        }
      };
    }
  });

  // Function to set active section
  function setActiveSection(section) {
    if (!data?.sections?.[section]) return;
    
    activeSection = section;
    
    if (browser) {
      const newUrl = `/frameworks/emergent-governance-protocol${window.location.search}#${section}`;
      history.replaceState(null, '', newUrl);

      setTimeout(() => {
        const contentElement = document.querySelector('.section-content');
        if (contentElement) {
          contentElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  }

  // Translation helper functions with fallbacks
  function getSectionTitle(section) {
    const titleMap = {
      'emergent-governance-protocol': 'Core Protocol',
      'egp-one-page-summary': 'One-Page Summary', 
      'egp-appendix': 'Implementation Guide',
      'egp-glossary': 'Glossary'
    };
    
    return translationsReady ? (egp.sections?.[section] || titleMap[section]) 
                             : titleMap[section];
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('egpFramework.meta.title', 'Emergent Governance Protocol - Global Governance Framework')}</title>
  <meta name="description" content="{getTextWithFallback('egpFramework.meta.description', 'The Minimum Viable Grammar for regenerative governance - three simple system calls that enable emergent coordination')}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- EGP Guide Card -->
      {#if !isPrintMode && activeSection === 'emergent-governance-protocol' && translationsReady}
        <div class="egp-guide-card">
          <div class="card-content">
            <div class="card-icon">🗣️</div>
            <div class="card-text">
              <h3>{egp.guideCard?.title || 'New to the Emergent Governance Protocol?'}</h3>
              <p>{egp.guideCard?.description || 'Start with our one-page summary—the essential concepts in 5 minutes or less.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('egp-one-page-summary')}>
                {egp.guideCard?.buttonText || 'Read One-Page Summary'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Simple tab navigation for EGP sections -->
      {#if !isPrintMode} 
        <div class="section-nav">
          <div class="nav-tabs">
            <button 
              class="nav-tab" 
              class:active={activeSection === 'emergent-governance-protocol'}
              on:click={() => setActiveSection('emergent-governance-protocol')}
            >
              <span class="tab-icon">🗣️</span>
              <span class="tab-title">Core Protocol</span>
            </button>
            
            <button 
              class="nav-tab" 
              class:active={activeSection === 'egp-one-page-summary'}
              on:click={() => setActiveSection('egp-one-page-summary')}
            >
              <span class="tab-icon">⚡</span>
              <span class="tab-title">Quick Start</span>
            </button>
            
            <button 
              class="nav-tab" 
              class:active={activeSection === 'egp-appendix'}
              on:click={() => setActiveSection('egp-appendix')}
            >
              <span class="tab-icon">🛠️</span>
              <span class="tab-title">Implementation</span>
            </button>
            
            <button 
              class="nav-tab" 
              class:active={activeSection === 'egp-glossary'}
              on:click={() => setActiveSection('egp-glossary')}
            >
              <span class="tab-icon">📖</span>
              <span class="tab-title">Glossary</span>
            </button>
          </div>
        </div>
      {/if}

      <!-- Show active section, or all sections in print mode -->
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && translationsReady}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{egp.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{egp.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons for one-page summary -->
            {#if section === 'egp-one-page-summary' && !isPrintMode && translationsReady}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => setActiveSection('egp-appendix')}>
                  {egp.navigation?.viewImplementation || 'View Implementation Guide'} <span class="arrow-icon">→</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('emergent-governance-protocol')}>
                  {egp.navigation?.readFullProtocol || 'Read Full Protocol'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}

            <!-- Navigation for core protocol -->
            {#if section === 'emergent-governance-protocol' && !isPrintMode && translationsReady}
              <div class="protocol-navigation">
                <button class="secondary-btn" on:click={() => setActiveSection('egp-glossary')}>
                  {egp.navigation?.viewGlossary || 'View Glossary'} <span class="arrow-icon">→</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('egp-appendix')}>
                  {egp.navigation?.startImplementing || 'Start Implementing'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('egpFramework.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('egpFramework.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('egpFramework.loading.text', 'Loading protocol content...')}</p>
  </div>
{/if}

<style>
  /* EGP color scheme - inspired by Unix terminals and communication */
  :root {
    --egp-primary: #2D3748;      /* Dark slate gray - stable foundation */
    --egp-secondary: #4FD1C7;    /* Teal - communication & flow */
    --egp-accent: #9F7AEA;       /* Purple - emergence & wisdom */
    --egp-success: #68D391;      /* Green - success & growth */
    --egp-warning: #F6E05E;      /* Yellow - attention & signals */
    --egp-danger: #FC8181;       /* Red - errors & stops */
    --egp-light: #F7FAFC;        /* Very light gray - backgrounds */
    --egp-dark: #1A202C;         /* Very dark gray - text */
    --egp-wisdom: #553C9A;       /* Deep purple - deep wisdom */
  }

  /* Loading state */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 1rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid var(--egp-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Layout */
  .documentation-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .content {
    min-width: 0;
  }
  
  .section-content {
    padding-top: 1rem;
    scroll-margin-top: 2rem;
  }

  .missing-section {
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  .missing-section h2 {
    color: #374151;
    margin-bottom: 0.5rem;
  }

  /* Simple Tab Navigation for EGP */
  .section-nav {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(to bottom, var(--egp-light), #f1f5f9);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .nav-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .nav-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    font-weight: 500;
    color: #4b5563;
    text-align: left;
  }

  .nav-tab:hover {
    background-color: rgba(79, 209, 199, 0.05);
    border-color: var(--egp-secondary);
    color: #374151;
  }

  .nav-tab:focus-visible {
    outline: 2px solid var(--egp-accent);
    outline-offset: 2px;
    background-color: rgba(79, 209, 199, 0.1);
  }

  .nav-tab.active {
    background: linear-gradient(135deg, var(--egp-primary), var(--egp-secondary));
    color: white;
    border-color: var(--egp-primary);
    font-weight: 600;
  }

  .nav-tab.active:hover {
    background: linear-gradient(135deg, var(--egp-secondary), var(--egp-accent));
  }

  .tab-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .tab-title {
    flex-grow: 1;
    text-align: left;
  }

  /* EGP guide card */
  .egp-guide-card {
    background: linear-gradient(135deg, rgba(79, 209, 199, 0.1) 0%, rgba(159, 122, 234, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(45, 55, 72, 0.1);
    border: 1px solid rgba(79, 209, 199, 0.3);
    position: relative;
    z-index: 1;
  }
  
  .card-content {
    display: flex;
    flex-wrap: wrap;
    padding: 1.5rem;
    align-items: center;
    gap: 1.5rem;
  }
  
  .card-icon {
    font-size: 2.5rem;
    color: var(--egp-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--egp-primary);
    font-size: 1.25rem;
  }
  
  .card-text p {
    margin: 0;
    color: #4b5563;
    font-size: 1rem;
  }
  
  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    position: relative;
    overflow: visible;
  }
  
  .primary-btn {
    background: linear-gradient(135deg, var(--egp-primary), var(--egp-secondary));
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background: linear-gradient(135deg, var(--egp-secondary), var(--egp-accent));
    transform: translateY(-1px);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--egp-accent);
    outline-offset: 2px;
    background: linear-gradient(135deg, var(--egp-secondary), var(--egp-accent));
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--egp-primary);
    border: 1px solid var(--egp-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(79, 209, 199, 0.1);
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--egp-accent);
    outline-offset: 2px;
    background-color: rgba(79, 209, 199, 0.1);
    transform: translateY(-1px);
  }
  
  .guide-navigation,
  .protocol-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .arrow-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(79, 209, 199, 0.1);
    border: 1px solid rgba(79, 209, 199, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--egp-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--egp-secondary);
    font-size: 0.95rem;
    display: block;
    margin-bottom: 0.25rem;
  }

  .notice-content p {
    color: #4b5563;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }

  /* Content styling */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--egp-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--egp-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--egp-accent);
  }

  .content :global(h4) {
    font-size: 1.2rem;
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }

  /* Blockquotes */
  .content :global(blockquote) {
    background-color: rgba(79, 209, 199, 0.1);
    border-left: 4px solid var(--egp-secondary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  /* Lists */
  .content :global(ul), .content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1rem;
    color: #4b5563;
  }

  .content :global(ul) {
    list-style-type: none;
  }

  .content :global(ul li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }

  .content :global(ul li:not(.nav-tabs li))::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1.2rem;
    color: var(--egp-secondary);
  }

  /* Ordered lists */
  .content :global(ol) {
    list-style-type: decimal;
    counter-reset: item;
  }

  .content :global(ol li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
    color: #4b5563;
  }

  .content :global(ol li::marker) {
    color: var(--egp-secondary);
    font-weight: 600;
  }

  /* Links */
  .content :global(a) {
    color: var(--egp-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--egp-primary);
  }

  /* Code blocks */
  .content :global(pre) {
    background-color: var(--egp-dark);
    color: #f7fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    border-left: 4px solid var(--egp-secondary);
  }

  .content :global(code) {
    background-color: rgba(45, 55, 72, 0.1);
    color: var(--egp-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .content :global(pre code) {
    background: none;
    color: inherit;
    padding: 0;
  }

  /* Tables */
  .content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(45, 55, 72, 0.1);
  }

  .content :global(th),
  .content :global(td) {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .content :global(th) {
    background-color: rgba(79, 209, 199, 0.1);
    color: var(--egp-primary);
    font-weight: 600;
    border-bottom: 2px solid var(--egp-secondary);
  }

  .content :global(tr:hover) {
    background-color: rgba(79, 209, 199, 0.05);
  }

  /* System calls styling - unique to EGP */
  .content :global(.system-call) {
    background: linear-gradient(135deg, rgba(45, 55, 72, 0.1), rgba(79, 209, 199, 0.1));
    border: 2px solid var(--egp-secondary);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin: 2rem 0;
    position: relative;
  }

  .content :global(.system-call::before) {
    content: "🗣️";
    position: absolute;
    top: -10px;
    left: 20px;
    background: white;
    padding: 0 0.5rem;
    font-size: 1.25rem;
  }

  .content :global(.system-call h3) {
    color: var(--egp-primary);
    margin-top: 0;
    margin-bottom: 1rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  /* Terminal-style syntax highlighting */
  .content :global(.syntax-sense) { color: var(--egp-success); }
  .content :global(.syntax-propose) { color: var(--egp-warning); }
  .content :global(.syntax-adopt) { color: var(--egp-accent); }

  /* Special callout boxes */
  .content :global(.callout) {
    background-color: rgba(159, 122, 234, 0.1);
    border-left: 4px solid var(--egp-accent);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .content :global(.callout.wisdom) {
    background-color: rgba(85, 60, 154, 0.1);
    border-left-color: var(--egp-wisdom);
  }

  .content :global(.callout.warning) {
    background-color: rgba(246, 224, 94, 0.1);
    border-left-color: var(--egp-warning);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .documentation-container {
      grid-template-columns: 1fr;
      padding: 1rem 0.5rem;
      gap: 1rem;
    }

    .section-nav {
      padding: 0.75rem;
      margin-bottom: 1rem;
    }

    .nav-tabs {
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-tab {
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
    }

    .tab-icon {
      font-size: 1rem;
    }

    .egp-guide-card {
      margin-bottom: 1rem;
    }

    .card-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
    }

    .card-icon {
      font-size: 2rem;
    }

    .card-text h3 {
      font-size: 1.1rem;
    }

    .card-text p {
      font-size: 0.9rem;
    }

    .card-actions {
      width: 100%;
      justify-content: center;
    }

    .guide-navigation,
    .protocol-navigation {
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;
    }

    .guide-navigation button,
    .protocol-navigation button {
      width: 100%;
    }

    .loading-container {
      padding: 2rem 1rem;
      min-height: 50vh;
    }

    .language-fallback-notice {
      padding: 0.75rem 1rem;
      gap: 0.75rem;
    }

    .notice-content strong {
      font-size: 0.9rem;
    }

    .notice-content p {
      font-size: 0.8rem;
    }

    /* Content responsive adjustments */
    .content :global(h1) {
      font-size: 1.75rem;
    }

    .content :global(h2) {
      font-size: 1.35rem;
      margin-top: 1.5rem;
    }

    .content :global(h3),
    .content :global(h4) {
      font-size: 1.15rem;
      margin-top: 1.25rem;
    }

    .content :global(.system-call) {
      padding: 1rem;
      margin: 1.5rem 0;
    }

    .content :global(table) {
      font-size: 0.85rem;
    }

    .content :global(th),
    .content :global(td) {
      padding: 0.5rem 0.75rem;
    }

    .content :global(pre) {
      padding: 0.75rem;
      font-size: 0.8rem;
    }
  }

  /* Print styles */
  @media print {
    .documentation-container {
      grid-template-columns: 1fr;
      max-width: none;
      margin: 0;
      padding: 0;
    }

    .section-nav,
    .egp-guide-card,
    .guide-navigation,
    .protocol-navigation,
    .language-fallback-notice {
      display: none !important;
    }

    .content :global(*) {
      color: black !important;
      background: white !important;
    }

    .content :global(a) {
      text-decoration: underline;
      color: black !important;
    }

    .section-content {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .content :global(h1),
    .content :global(h2),
    .content :global(h3) {
      page-break-after: avoid;
      break-after: avoid;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :root {
      --egp-primary: #000000;
      --egp-secondary: #0066cc;
      --egp-accent: #6600cc;
      --egp-light: #ffffff;
      --egp-dark: #000000;
    }

    .nav-tab {
      border-width: 2px;
    }

    .nav-tab.active {
      border-width: 3px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    .loading-spinner {
      animation: none;
      border: 4px solid #e5e7eb;
      border-top: 4px solid var(--egp-primary);
    }
  }
</style>
