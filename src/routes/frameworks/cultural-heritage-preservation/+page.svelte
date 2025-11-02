<!-- src/routes/frameworks/cultural-heritage-preservation/+page.svelte -->
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

  // Translation state - use isLocaleLoaded for better reactivity
  $: translationsReady = $isLocaleLoaded;
  $: chf = translationsReady ? ($t('culturalHeritageFramework') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'index';
  let mounted = false;
  let isPrintMode = false;
  let foundationOpen = false;
  let coreFrameworkOpen = false;
  let resourcesOpen = false;

  // Computed values - add safety checks
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];
  $: coreFrameworkSections = Object.keys(data?.sections || {}).filter(section => 
    !['index', 'at-a-glance', 'executive-summary-for-the-skeptic', 'appendices'].includes(section)
  );
  $: isCoreSection = coreFrameworkSections.includes(activeSection);
  $: foundationSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];
  $: resourceSections = ['appendices'];
  $: isExecutiveSummaryActive = activeSection === 'executive-summary-for-the-skeptic';
  $: isSupplementaryActive = resourceSections.includes(activeSection);

  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    foundationOpen = foundationSections.includes(activeSection);
    coreFrameworkOpen = coreFrameworkSections.includes(activeSection);
    resourcesOpen = resourceSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/cultural-heritage-preservation') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/cultural-heritage-preservation${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/cultural-heritage-preservation');
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
      
      initializeAccordionStates();
      
      // Global function for PDF generation
      window.showAllSectionsForPrint = () => { isPrintMode = true; };
      
      // Listen for hash changes
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash && data?.sections?.[hash] && activeSection !== hash) {
          activeSection = hash;
          initializeAccordionStates();
          
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
    initializeAccordionStates();
    
    if (browser) {
      const newUrl = `/frameworks/cultural-heritage-preservation${window.location.search}#${section}`;
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
    return translationsReady ? (chf.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (chf.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (chf.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Accordion toggle functions
  function toggleFoundation() { foundationOpen = !foundationOpen; }
  function toggleCoreFramework() { coreFrameworkOpen = !coreFrameworkOpen; }
  function toggleResources() { resourcesOpen = !resourcesOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('culturalHeritageFramework.meta.title', 'Cultural Heritage Preservation Framework - Project Tapestry | Global Governance Framework')}</title>
  <meta name="description" content="{getTextWithFallback('culturalHeritageFramework.meta.description', 'Sovereign cultural preservation guided by Indigenous wisdom. BAZ-led stewardship, FPIC 2.0 protocols, and quantum-safe archives protecting humanity\'s living heritage.')}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Cultural Heritage -->
      {#if !isPrintMode && !isExecutiveSummaryActive && activeSection === 'index' && translationsReady}
        <div class="heritage-guide-card">
          <div class="card-content">
            <div class="card-icon">🏛️</div>
            <div class="card-text">
              <h3>{chf.guideCard?.title || 'New to the Cultural Heritage Preservation Framework?'}</h3>
              <p>{chf.guideCard?.description || 'Start with our executive summary to understand how Indigenous wisdom guides sovereign cultural preservation.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('executive-summary-for-the-skeptic')}>
                {chf.guideCard?.buttonText || 'Read executive summary'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for cultural heritage sections -->
      {#if !isPrintMode} 
        <div class="section-nav">
          <!-- Overview -->
          <div class="nav-section">
            <button 
              class="nav-item overview-item" 
              class:active={activeSection === 'index'}
              on:click={() => setActiveSection('index')}
            >
              <span class="nav-icon">🏠</span>
              <span class="nav-title">{getSectionCategoryTitle('overview')}</span>
            </button>
          </div>

          <!-- Foundation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={foundationOpen}
              class:has-active={foundationSections.includes(activeSection)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">(2)</span>
              <span class="toggle-arrow" class:rotated={foundationOpen}>▼</span>
            </button>
            {#if foundationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each foundationSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">{section === 'at-a-glance' ? '⚡' : '🤔'}</span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Core Framework Accordion -->
          {#if coreFrameworkSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={coreFrameworkOpen}
                class:has-active={isCoreSection}
                on:click={toggleCoreFramework}
              >
                <span class="accordion-icon">🏛️</span>
                <span class="accordion-title">{getSectionCategoryTitle('framework')}</span>
                <span class="section-count">({coreFrameworkSections.length})</span>
                <span class="toggle-arrow" class:rotated={coreFrameworkOpen}>▼</span>
              </button>
              {#if coreFrameworkOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each coreFrameworkSections as section}
                    {#if data?.sections?.[section]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="nav-title">{getSectionTitle(section)}</span>
                      </button>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Resources Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={resourcesOpen}
              class:has-active={resourceSections.includes(activeSection)}
              on:click={toggleResources}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
              <span class="section-count">(1)</span>
              <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
            </button>
            {#if resourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each resourceSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">📚</span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Language fallback notice -->
      {#if data.sectionsUsingEnglishFallback && data.sectionsUsingEnglishFallback.length > 0 && activeSection && data.sectionsUsingEnglishFallback.includes(activeSection)}
        <div class="language-fallback-notice">
          <span class="notice-icon">ℹ️</span>
          <div class="notice-content">
            <strong>{getTextWithFallback('culturalHeritageFramework.fallbackNotice.title', 'Language Notice')}</strong>
            <p>{getTextWithFallback('culturalHeritageFramework.fallbackNotice.message', 'This section is currently only available in English. We are working on translations.')}</p>
          </div>
        </div>
      {/if}

      <!-- Section Content -->
      <div class="section-content">
        {#each sectionsToShow as section}
          {#if data?.sections?.[section]}
            <svelte:component this={data.sections[section].default} />
          {/if}
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="loading-container">
    <p>{getTextWithFallback('common.loading', 'Loading...')}</p>
  </div>
{/if}

<style>
  /* Cultural Heritage Theme - Warm earth tones */
  :global(:root) {
    --heritage-primary: #d97706; /* amber-600 */
    --heritage-secondary: #ea580c; /* orange-600 */
    --heritage-accent: #eab308; /* yellow-500 */
    --heritage-light: #fef3c7; /* amber-100 */
    --heritage-dark: #78350f; /* amber-900 */
  }
  
  /* Container Layout */
  .documentation-container {
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: 100vh;
    background: linear-gradient(to bottom, #fffbeb, #ffffff);
  }
  
  /* Content Area */
  .content {
    max-width: 1024px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
  }
  
  /* Heritage Guide Card */
  .heritage-guide-card {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border: 2px solid var(--heritage-primary);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);
  }
  
  .card-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .card-icon {
    font-size: 3rem;
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
  }
  
  .card-text h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--heritage-dark);
    margin: 0 0 0.5rem 0;
  }
  
  .card-text p {
    color: #78350f;
    margin: 0;
    line-height: 1.6;
  }
  
  .card-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  /* Navigation Styles */
  .section-nav {
    background: white;
    border: 1px solid #fde68a;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .nav-section {
    margin-bottom: 0.75rem;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 500;
    color: #78350f;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  
  .nav-item:hover {
    background: #fffbeb;
  }
  
  .nav-item.active {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: var(--heritage-dark);
    font-weight: 600;
  }
  
  .nav-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
  
  .nav-title {
    flex: 1;
  }
  
  .overview-item {
    background: linear-gradient(135deg, #fef3c7, #fed7aa);
    font-weight: 600;
  }
  
  /* Accordion Styles */
  .nav-accordion {
    margin-bottom: 0.5rem;
  }
  
  .accordion-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid #fde68a;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--heritage-dark);
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  
  .accordion-header:hover {
    background: #fffbeb;
    border-color: var(--heritage-primary);
  }
  
  .accordion-header.open {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-color: var(--heritage-primary);
  }
  
  .accordion-header.has-active {
    border-color: var(--heritage-primary);
    background: #fffbeb;
  }
  
  .accordion-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
  
  .accordion-title {
    flex: 1;
  }
  
  .section-count {
    font-size: 0.85rem;
    color: #92400e;
    font-weight: 500;
  }
  
  .toggle-arrow {
    font-size: 0.75rem;
    color: #92400e;
    transition: transform 0.2s;
  }
  
  .toggle-arrow.rotated {
    transform: rotate(-180deg);
  }
  
  .accordion-content {
    padding-left: 1rem;
    margin-top: 0.5rem;
  }
  
  .subsection-item {
    padding-left: 2rem;
    font-size: 0.9rem;
  }
  
  /* Buttons */
  .primary-btn {
    background: linear-gradient(135deg, var(--heritage-primary), var(--heritage-secondary));
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
  }
  
  .arrow-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }
  
  /* Language Fallback Notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(217, 119, 6, 0.1);
    border: 1px solid rgba(217, 119, 6, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  .notice-icon {
    font-size: 1.25rem;
    color: var(--heritage-primary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  .notice-content {
    flex: 1;
  }
  
  .notice-content strong {
    color: var(--heritage-primary);
    font-size: 0.95rem;
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .notice-content p {
    color: #78350f;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }
  
  /* Section Content Prose Styles */
  .section-content {
    margin-top: 1.5rem;
  }
  
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--heritage-dark);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--heritage-primary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--heritage-secondary);
  }
  
  .content :global(h4) {
    font-size: 1.2rem;
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }
  
  .content :global(blockquote) {
    background-color: rgba(217, 119, 6, 0.1);
    border-left: 4px solid var(--heritage-primary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }
  
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
  
  .content :global(ul li:not(.section-nav li))::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1.2rem;
    color: var(--heritage-primary);
  }
  
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
    color: var(--heritage-primary);
    font-weight: 600;
  }
  
  .content :global(a) {
    color: var(--heritage-primary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .content :global(a:hover) {
    color: var(--heritage-secondary);
  }
  
  /* Loading State */
  .loading-container {
    padding: 4rem 2rem;
    text-align: center;
    color: #78350f;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .documentation-container {
      grid-template-columns: 1fr;
    }
    
    .card-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .card-actions {
      width: 100%;
      justify-content: center;
    }
    
    .section-nav {
      padding: 0.75rem;
    }
    
    .accordion-header {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
    }
    
    .nav-item {
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
    }
    
    .subsection-item {
      padding-left: 1rem;
    }
  }
  
  /* Print Styles */
  @media print {
    .section-nav,
    .heritage-guide-card,
    .language-fallback-notice {
      display: none;
    }
  }
</style>
