<!-- src/routes/frameworks/migration-and-human-mobility/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Extract migration translations for shorter references
  $: migration = $t('migrationFramework') || {};
  $: translationFunction = $t;
  
  // Keep track of which section is active (for sub-navigation)
  let activeSection = 'preamble';

  // This will track the current locale for our component
  $: currentLocale = $locale;

  // Check if we're in print mode - simplified to avoid hydration issues
  let isPrintMode = false;
  
  // Client-side only initialization to avoid hydration mismatches
  let mounted = false;
  let initializing = true;

  // If in print mode, we'll show all sections
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];

  // Accordion states - initialize in a way that prevents hydration issues
  let foundationOpen = false;
  let coreFrameworkOpen = false;
  let implementationOpen = false;
  let resourcesOpen = false;

  // Enhanced section icon mapping - meaningful icons for each section
  const sectionIcons = {
    // Sacred opening
    'preamble': '🌅',
    'index': '🏠',
    'at-a-glance': '⚡',
    'executive-summary-for-the-skeptic': '🤔',
    
    // Core Framework sections
    'introduction': '🌊',
    'theory-of-change': '🔄',
    'core-principles': '🧭',
    'radical-innovations': '🚀',
    'planetary-migration-council': '🌍',
    
    // Implementation sections  
    'implementation-pathways': '🗺️',
    'framework-integration': '🤝',
    'cultural-adaptability': '🎭',
    'monitoring-accountability': '📊',
    'radical-faqs': '❓',
    'advocacy-action': '📣',
    
    // Resources sections
    'glossary': '📖',
    'appendices': '📎',
    'conclusion': '🌟'
  };

  // Function to get section icon
  function getSectionIcon(section) {
    return sectionIcons[section] || '📄';
  }

  // Initialize accordion states after mount
  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    if (['at-a-glance', 'executive-summary-for-the-skeptic'].includes(activeSection)) {
      foundationOpen = true;
    } else if (coreFrameworkSections.includes(activeSection)) {
      coreFrameworkOpen = true;
    } else if (implementationSections.includes(activeSection)) {
      implementationOpen = true;
    } else if (['glossary', 'appendices', 'conclusion'].includes(activeSection)) {
      resourcesOpen = true;
    } else {
      // Default state for sacred opening
      coreFrameworkOpen = true;
    }
  }

  onMount(async () => {
    await tick(); // Wait for DOM to be ready
    mounted = true;
    
    if (browser) {
      // Check print mode only on client
      const urlParams = new URLSearchParams(window.location.search);
      isPrintMode = urlParams.get('print') === 'true';
      
      // Make this function available globally for the PDF generator
      window.showAllSectionsForPrint = () => {
        isPrintMode = true;
      };

      // Handle URL parameters and hash
      const sectionParam = urlParams.get('section');
      
      if (sectionParam && data?.sections?.[sectionParam]) {
        activeSection = sectionParam;
      } else if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (hash && data?.sections?.[hash]) {
          activeSection = hash;
        }
      }

      // Initialize accordion states after setting active section
      initializeAccordionStates();

      // Listen for hash changes
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash && data?.sections?.[hash] && activeSection !== hash) {
          activeSection = hash;
          initializeAccordionStates();
          
          // Scroll to content
          setTimeout(() => {
            const contentElement = document.querySelector('.content');
            if (contentElement) {
              contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 100);
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      
      initializing = false;
      
      // Cleanup
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        if (window.showAllSectionsForPrint) {
          delete window.showAllSectionsForPrint;
        }
      };
    }
    
    initializing = false;
  });

  // Function to set active section
  function setActiveSection(section) {
    if (!data?.sections?.[section]) return;
    
    activeSection = section;
    initializeAccordionStates();
    
    if (browser) {
      const url = new URL(window.location.href);
      url.hash = section;
      history.replaceState(null, '', url.toString());

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

  // Get section titles in current language using short references
  function getSectionTitle(section) {
    return migration.sections?.[section] || section;
  }

  // Group sections logically with multi-lingual support using short references
  function getSectionCategoryTitle(category) {
    return migration.categories?.[category] || category;
  }

  // Function to get shortened section titles for navigation using short references
  function getShortSectionTitle(section) {
    return migration.sectionsShort?.[section] || getSectionTitle(section);
  }

  // Function to download the Migration Framework PDF
  function downloadMigrationFramework(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/migration-and-human-mobility${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `migration-and-human-mobility${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Computed values - add safety checks
  $: isOverviewActive = ['preamble', 'index'].includes(activeSection);
  $: isFoundationActive = ['at-a-glance', 'executive-summary-for-the-skeptic'].includes(activeSection);
  $: isResourcesActive = ['glossary', 'appendices', 'conclusion'].includes(activeSection);
  $: coreFrameworkSections = Object.keys(data?.sections || {}).filter(section => 
    ['introduction', 'theory-of-change', 'core-principles', 'radical-innovations', 'planetary-migration-council'].includes(section)
  );
  $: implementationSections = Object.keys(data?.sections || {}).filter(section => 
    ['implementation-pathways', 'framework-integration', 'cultural-adaptability', 'monitoring-accountability', 'radical-faqs', 'advocacy-action'].includes(section)
  );
  $: isCoreSection = coreFrameworkSections.includes(activeSection);
  $: isImplementationSection = implementationSections.includes(activeSection);

  function toggleFoundation() {
    foundationOpen = !foundationOpen;
  }

  function toggleCoreFramework() {
    coreFrameworkOpen = !coreFrameworkOpen;
  }

  function toggleImplementation() {
    implementationOpen = !implementationOpen;
  }

  function toggleResources() {
    resourcesOpen = !resourcesOpen;
  }

  // Handle locale changes - add safety check
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{migration.meta?.title || 'Enhanced Global Governance Framework for Migration & Human Mobility'}</title>
  <meta name="description" content="{migration.meta?.description || 'Transforming migration from crisis management to sacred circulation that regenerates ecosystems and strengthens communities through Indigenous wisdom and sacred economics'}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Sacred Circulation Badges -->
      {#if !isPrintMode && !initializing && isOverviewActive}
        <div class="circulation-badges">
          <div class="badge sacred-circulation">
            <span class="badge-icon">🌊</span>
            <span class="badge-text">{migration.badges?.sacredCirculation || 'Sacred Circulation'}</span>
          </div>
          <div class="badge indigenous-sovereignty">
            <span class="badge-icon">🪶</span>
            <span class="badge-text">{migration.badges?.indigenousSovereignty || 'Indigenous Sovereignty'}</span>
          </div>
          <div class="badge hearts-currency">
            <span class="badge-icon">💝</span>
            <span class="badge-text">{migration.badges?.heartsCurrency || 'Hearts Currency'}</span>
          </div>
          <div class="badge youth-authority">
            <span class="badge-icon">🌱</span>
            <span class="badge-text">{migration.badges?.youthAuthority || 'Youth Authority'}</span>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for Migration Framework sections -->
      {#if !isPrintMode && !initializing} 
        <div class="section-nav">
          <!-- Sacred Opening -->
          <div class="nav-section">
            <button 
              class="nav-item preamble-item" 
              class:active={activeSection === 'preamble'}
              on:click={() => setActiveSection('preamble')}
            >
              <span class="nav-icon">{getSectionIcon('preamble')}</span>
              <span class="nav-title">{getSectionCategoryTitle('sacredOpening')}</span>
            </button>
            <button 
              class="nav-item overview-item" 
              class:active={activeSection === 'index'}
              on:click={() => setActiveSection('index')}
            >
              <span class="nav-icon">{getSectionIcon('index')}</span>
              <span class="nav-title">{getSectionCategoryTitle('overview')}</span>
            </button>
          </div>

          <!-- Foundation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={foundationOpen}
              class:has-active={['at-a-glance', 'executive-summary-for-the-skeptic'].some(section => activeSection === section)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">(2)</span>
              <span class="toggle-arrow" class:rotated={foundationOpen}>▼</span>
            </button>
            {#if foundationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#if data?.sections?.['at-a-glance']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'at-a-glance'}
                    on:click={() => setActiveSection('at-a-glance')}
                  >
                    <span class="nav-icon">{getSectionIcon('at-a-glance')}</span>
                    <span class="nav-title">{getSectionTitle('at-a-glance')}</span>
                  </button>
                {/if}
                {#if data?.sections?.['executive-summary-for-the-skeptic']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'executive-summary-for-the-skeptic'}
                    on:click={() => setActiveSection('executive-summary-for-the-skeptic')}
                  >
                    <span class="nav-icon">{getSectionIcon('executive-summary-for-the-skeptic')}</span>
                    <span class="nav-title">{getShortSectionTitle('executive-summary-for-the-skeptic')}</span>
                  </button>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Core Framework Accordion -->
          {#if coreFrameworkSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={coreFrameworkOpen}
                class:has-active={coreFrameworkSections.some(section => activeSection === section)}
                on:click={toggleCoreFramework}
              >
                <span class="accordion-icon">🌊</span>
                <span class="accordion-title">{getSectionCategoryTitle('coreFramework')}</span>
                <span class="section-count">({coreFrameworkSections.length})</span>
                <span class="toggle-arrow" class:rotated={coreFrameworkOpen}>▼</span>
              </button>
              {#if coreFrameworkOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each coreFrameworkSections as section}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">{getSectionIcon(section)}</span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Implementation Accordion -->
          {#if implementationSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={implementationOpen}
                class:has-active={implementationSections.some(section => activeSection === section)}
                on:click={toggleImplementation}
              >
                <span class="accordion-icon">⚙️</span>
                <span class="accordion-title">{getSectionCategoryTitle('implementation')}</span>
                <span class="section-count">({implementationSections.length})</span>
                <span class="toggle-arrow" class:rotated={implementationOpen}>▼</span>
              </button>
              {#if implementationOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each implementationSections as section}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">{getSectionIcon(section)}</span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
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
              class:has-active={isResourcesActive}
              on:click={toggleResources}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
              <span class="section-count">(3)</span>
              <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
            </button>
            {#if resourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#if data?.sections?.['glossary']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'glossary'}
                    on:click={() => setActiveSection('glossary')}
                  >
                    <span class="nav-icon">{getSectionIcon('glossary')}</span>
                    <span class="nav-title">{getSectionTitle('glossary')}</span>
                  </button>
                {/if}
                {#if data?.sections?.['appendices']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'appendices'}
                    on:click={() => setActiveSection('appendices')}
                  >
                    <span class="nav-icon">{getSectionIcon('appendices')}</span>
                    <span class="nav-title">{getSectionTitle('appendices')}</span>
                  </button>
                {/if}
                {#if data?.sections?.['conclusion']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'conclusion'}
                    on:click={() => setActiveSection('conclusion')}
                  >
                    <span class="nav-icon">{getSectionIcon('conclusion')}</span>
                    <span class="nav-title">{getSectionTitle('conclusion')}</span>
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Progress indicator for core sections -->
      {#if !isPrintMode && (isCoreSection || isImplementationSection)}
        {@const allMainSections = [...coreFrameworkSections, ...implementationSections]}
        {@const currentIndex = allMainSections.indexOf(activeSection)}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((currentIndex + 1) / allMainSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{migration.progress?.text?.replace('{current}', currentIndex + 1).replace('{total}', allMainSections.length) || `Section ${currentIndex + 1} of ${allMainSections.length}`}</span>
        </div>
      {/if}

      <!-- Show active section, or all sections in print mode -->
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && section !== 'index' && section !== 'preamble'}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{migration.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{migration.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={translationFunction} />

            <!-- Section navigation at bottom of main sections -->
            {#if (isCoreSection || isImplementationSection) && !isPrintMode}
              {@const allMainSections = [...coreFrameworkSections, ...implementationSections]}
              <div class="section-navigation">
                {#if allMainSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = allMainSections.indexOf(activeSection);
                    const prevSection = allMainSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← {migration.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if allMainSections.indexOf(activeSection) < allMainSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = allMainSections.indexOf(activeSection);
                    const nextSection = allMainSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {migration.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{migration.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
            <p>{migration.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{migration.loading?.text || 'Loading Migration & Human Mobility framework...'}</p>
  </div>
{/if}

<style>
  /* Migration Framework color scheme - Sacred circulation/planetary healing theme */
  :root {
    --migration-primary: #2563EB;        /* Deep ocean blue */
    --migration-secondary: #059669;      /* Healing green */
    --migration-accent: #F59E0B;         /* Golden sunrise */
    --migration-sacred: #7C3AED;         /* Sacred purple */
    --migration-indigenous: #DC2626;     /* Earth red */
    --migration-youth: #10B981;          /* Future green */
    --migration-hearts: #EC4899;         /* Hearts pink */
    --migration-light: #F0F9FF;          /* Sky light */
    --migration-dark: #0F172A;           /* Deep night */
    --migration-flow: #06B6D4;           /* Flow cyan */
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
    border-top: 4px solid var(--migration-primary);
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

  /* Sacred Circulation Badges */
  .circulation-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(5, 150, 105, 0.05));
    border-radius: 0.75rem;
    border: 1px solid rgba(37, 99, 235, 0.1);
  }

  .badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    background: white;
    border: 1px solid;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .badge:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .badge.sacred-circulation {
    border-color: var(--migration-primary);
    color: var(--migration-primary);
  }

  .badge.indigenous-sovereignty {
    border-color: var(--migration-indigenous);
    color: var(--migration-indigenous);
  }

  .badge.hearts-currency {
    border-color: var(--migration-hearts);
    color: var(--migration-hearts);
  }

  .badge.youth-authority {
    border-color: var(--migration-youth);
    color: var(--migration-youth);
  }

  .badge-icon {
    font-size: 1rem;
  }

  /* Section Navigation */
  .section-nav {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .nav-section {
    margin-bottom: 1rem;
  }

  .nav-accordion {
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    overflow: hidden;
    background: white;
  }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
    font-weight: 500;
    color: #374151;
    text-align: left;
  }

  .accordion-header:hover {
    background-color: rgba(37, 99, 235, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--migration-primary);
    outline-offset: 2px;
    background-color: rgba(37, 99, 235, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(37, 99, 235, 0.1);
    color: var(--migration-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(5, 150, 105, 0.1);
    border-bottom: 1px solid #e5e7eb;
  }

  .accordion-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .accordion-title {
    flex-grow: 1;
    font-weight: 600;
  }

  .section-count {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 400;
  }

  .toggle-arrow {
    font-size: 0.8rem;
    color: #6b7280;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .toggle-arrow.rotated {
    transform: rotate(180deg);
  }

  .accordion-content {
    border-top: 1px solid #e5e7eb;
    background-color: #fafafa;
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    color: #4b5563;
    text-align: left;
    margin-bottom: 0.25rem;
  }

  .nav-item:last-child {
    margin-bottom: 0;
  }

  .nav-item:hover {
    background-color: rgba(37, 99, 235, 0.05);
    color: #374151;
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--migration-primary);
    outline-offset: 2px;
    background-color: rgba(37, 99, 235, 0.1);
  }

  .nav-item.active {
    background-color: var(--migration-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--migration-secondary);
  }

  .preamble-item {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(245, 158, 11, 0.1));
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .preamble-item.active {
    background: var(--migration-sacred);
    color: white;
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(5, 150, 105, 0.1));
    border: 1px solid rgba(37, 99, 235, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--migration-primary);
    color: white;
  }

  .subsection-item {
    padding-left: 1.5rem;
  }

  .nav-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .nav-title {
    flex-grow: 1;
    text-align: left;
  }

  /* Progress indicator */
  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.1), rgba(5, 150, 105, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--migration-primary);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--migration-primary), var(--migration-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--migration-primary);
    font-weight: 500;
  }

  /* Section navigation */
  .section-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-btn {
    background-color: var(--migration-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--migration-secondary);
    transform: translateY(-1px);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--migration-accent);
    outline-offset: 2px;
    background-color: var(--migration-secondary);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(5, 150, 105, 0.1);
    border: 1px solid rgba(5, 150, 105, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--migration-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--migration-secondary);
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
    color: var(--migration-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--migration-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--migration-accent);
  }

  .content :global(h4) {
    font-size: 1.2rem;
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }

  /* Blockquotes - sacred circulation theme */
  .content :global(blockquote) {
    background-color: rgba(5, 150, 105, 0.1);
    border-left: 4px solid var(--migration-secondary);
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

  .content :global(ul li:not(.section-nav li))::before {
    content: "🌊";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1rem;
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
    color: var(--migration-secondary);
    font-weight: 600;
  }

  /* Links */
  .content :global(a) {
    color: var(--migration-primary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--migration-secondary);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .documentation-container {
      grid-template-columns: 1fr;
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

    .circulation-badges {
      justify-content: center;
    }

    .badge {
      font-size: 0.8rem;
      padding: 0.375rem 0.75rem;
    }

    .section-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .section-navigation button {
      width: 100%;
    }

    .loading-container {
      padding: 2rem 1rem;
    }
  }
</style>
