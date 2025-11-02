<!-- src/routes/frameworks/consciousness-and-inner-development/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import SectionNotice from '$lib/components/SectionNotice.svelte';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Extract consciousness framework translations for shorter references
  $: cs = $t('consciousnessFramework') || {};
  $: translationFunction = $t;
  
  // Keep track of which section is active (for sub-navigation)
  let activeSection = 'index';

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
  let transformationOpen = false;
  let integrationOpen = false;
  let applicationOpen = false;
  let resourcesOpen = false;

  // Initialize accordion states after mount
  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    if (data?.foundationSections?.includes(activeSection)) {
      foundationOpen = true;
    } else if (data?.transformationSections?.includes(activeSection)) {
      transformationOpen = true;
    } else if (data?.integrationSections?.includes(activeSection)) {
      integrationOpen = true;
    } else if (data?.applicationSections?.includes(activeSection)) {
      applicationOpen = true;
    } else if (data?.resourceSections?.includes(activeSection)) {
      resourcesOpen = true;
    } else {
      // Default state for overview
      foundationOpen = true;
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
    return cs.sections?.[section] || section;
  }

  // Group sections logically with multi-lingual support using short references
  function getSectionCategoryTitle(category) {
    return cs.categories?.[category] || category;
  }

  // Function to get shortened section titles for navigation using short references
  function getShortSectionTitle(section) {
    return cs.sectionsShort?.[section] || getSectionTitle(section);
  }

  // Function to download the framework PDF
  function downloadFramework(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/consciousness-guide${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `consciousness-guide${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Computed values - add safety checks
  $: isLiteActive = activeSection === 'consciousness-accord-lite';
  $: isSupplementaryActive = data?.resourceSections?.includes(activeSection);
  
  // Get all core framework sections for progress
  $: allCoreFrameworkSections = [
    ...(data?.foundationSections || []),
    ...(data?.transformationSections || []),
    ...(data?.integrationSections || []),
    ...(data?.applicationSections || [])
  ];
  $: isCoreSection = allCoreFrameworkSections.includes(activeSection);

  function toggleFoundation() {
    foundationOpen = !foundationOpen;
  }

  function toggleTransformation() {
    transformationOpen = !transformationOpen;
  }

  function toggleIntegration() {
    integrationOpen = !integrationOpen;
  }

  function toggleApplication() {
    applicationOpen = !applicationOpen;
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
  <title>{cs.meta?.title || 'Consciousness & Inner Development Framework - Global Governance Framework'}</title>
  <meta name="description" content="{cs.meta?.description || 'A transformative framework weaving together personal transformation, collective wisdom, and systemic integration for conscious governance'}" />
</svelte:head>

<SectionNotice 
  type="warning" 
  customContent={true}
>
  <p>{$t('common.notices.section.frameworks.q32026redraft')}</p>
</SectionNotice>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Consciousness Framework -->
      {#if !isPrintMode && !isLiteActive && activeSection === 'index'}
        <div class="consciousness-guide-card">
          <div class="card-content">
            <div class="card-icon">🧘</div>
            <div class="card-text">
              <h3>{cs.guideCard?.title || 'New to Consciousness Governance?'}</h3>
              <p>{cs.guideCard?.description || 'Start with our accessible summary that explains the framework\'s core principles and transformation pathway.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('consciousness-accord-lite')}>
                {cs.guideCard?.buttonText || 'Read the Consciousness Accord Lite'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for framework sections -->
      {#if !isPrintMode && !initializing} 
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

          <!-- Resources Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={resourcesOpen}
              class:has-active={isSupplementaryActive}
              on:click={toggleResources}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
              <span class="section-count">({data?.resourceSections?.length || 0})</span>
              <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
            </button>
            {#if resourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each (data?.resourceSections || []) as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'consciousness-accord-lite'}🧘
                        {:else if section === 'executive-core-overview'}📊
                        {:else if section === 'youth-governance-comic'}📚
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Foundation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={foundationOpen}
              class:has-active={data?.foundationSections?.some(section => activeSection === section)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">🌟</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">({data?.foundationSections?.length || 0})</span>
              <span class="toggle-arrow" class:rotated={foundationOpen}>▼</span>
            </button>
            {#if foundationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each (data?.foundationSections || []) as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'manifesto'}📜
                        {:else if section === 'governance-structure'}🏛️
                        {:else if section === 'spiral-dynamics'}🌀
                        {:else}⭐{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Transformation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={transformationOpen}
              class:has-active={data?.transformationSections?.some(section => activeSection === section)}
              on:click={toggleTransformation}
            >
              <span class="accordion-icon">🌱</span>
              <span class="accordion-title">{getSectionCategoryTitle('transformation')}</span>
              <span class="section-count">({data?.transformationSections?.length || 0})</span>
              <span class="toggle-arrow" class:rotated={transformationOpen}>▼</span>
            </button>
            {#if transformationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each (data?.transformationSections || []) as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'personal-transformation'}🧘
                        {:else if section === 'collective-consciousness'}🌊
                        {:else if section === 'cross-cultural-translation'}🌍
                        {:else}✨{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Integration Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={integrationOpen}
              class:has-active={data?.integrationSections?.some(section => activeSection === section)}
              on:click={toggleIntegration}
            >
              <span class="accordion-icon">🔗</span>
              <span class="accordion-title">{getSectionCategoryTitle('integration')}</span>
              <span class="section-count">({data?.integrationSections?.length || 0})</span>
              <span class="toggle-arrow" class:rotated={integrationOpen}>▼</span>
            </button>
            {#if integrationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each (data?.integrationSections || []) as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'systemic-integration'}🌐
                        {:else if section === 'economic-realignment'}💰
                        {:else if section === 'community-engagement'}🤝
                        {:else if section === 'digital-platforms'}💻
                        {:else if section === 'ethical-ai-governance'}🤖
                        {:else}🔧{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Application Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={applicationOpen}
              class:has-active={data?.applicationSections?.some(section => activeSection === section)}
              on:click={toggleApplication}
            >
              <span class="accordion-icon">🚀</span>
              <span class="accordion-title">{getSectionCategoryTitle('application')}</span>
              <span class="section-count">({data?.applicationSections?.length || 0})</span>
              <span class="toggle-arrow" class:rotated={applicationOpen}>▼</span>
            </button>
            {#if applicationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each (data?.applicationSections || []) as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'crisis-response'}🚨
                        {:else if section === 'metrics-accountability'}📊
                        {:else if section === 'implementation-roadmap'}🗺️
                        {:else if section === 'visual-architecture-map'}🎨
                        {:else if section === 'conclusion'}📝
                        {:else}⚡{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Progress indicator for core sections -->
      {#if !isPrintMode && isCoreSection && allCoreFrameworkSections.length > 0}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((allCoreFrameworkSections.indexOf(activeSection) + 1) / allCoreFrameworkSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{cs.progress?.text?.replace('{current}', allCoreFrameworkSections.indexOf(activeSection) + 1).replace('{total}', allCoreFrameworkSections.length) || `Section ${allCoreFrameworkSections.indexOf(activeSection) + 1} of ${allCoreFrameworkSections.length}`}</span>
        </div>
      {/if}

      <!-- Show active section, or all sections in print mode -->
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section)}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{cs.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{cs.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={translationFunction} />
            
            <!-- Navigation buttons at bottom of resource sections -->
            {#if isSupplementaryActive && !isPrintMode && section === activeSection}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadFramework(section)}>
                  {cs.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('manifesto')}>
                  {cs.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}

            <!-- Section navigation at bottom of core sections -->
            {#if isCoreSection && !isPrintMode && allCoreFrameworkSections.length > 0}
              <div class="section-navigation">
                {#if allCoreFrameworkSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = allCoreFrameworkSections.indexOf(activeSection);
                    const prevSection = allCoreFrameworkSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← {cs.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if allCoreFrameworkSections.indexOf(activeSection) < allCoreFrameworkSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = allCoreFrameworkSections.indexOf(activeSection);
                    const nextSection = allCoreFrameworkSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {cs.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{cs.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
            <p>{cs.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{cs.loading?.text || 'Loading framework content...'}</p>
  </div>
{/if}

<style>
  /* Consciousness & Inner Development Framework color scheme - wisdom purples, consciousness blues, transformation golds */
  :root {
    --consciousness-primary: #4c1d95; /* Deep Purple - wisdom, spiritual depth, consciousness */
    --consciousness-secondary: #1e40af; /* Royal Blue - trust, clarity, mental awareness */
    --consciousness-accent: #7c3aed; /* Bright Purple - transformation, insight, awakening */
    --consciousness-wisdom: #312e81; /* Indigo - deep knowing, intuition, inner guidance */
    --consciousness-light: #a78bfa; /* Light Purple - accessibility, openness, flow */
    --consciousness-transformation: #f59e0b; /* Warm Gold - change, illumination, growth */
    --consciousness-earth: #059669; /* Earth Green - grounding, nature connection, balance */
    --consciousness-compassion: #ec4899; /* Warm Pink - love, empathy, heart wisdom */
  }

  .section-nav {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .nav-section {
    margin-bottom: 0.5rem;
  }

  .nav-accordion {
    margin-bottom: 0.5rem;
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
    background-color: rgba(76, 29, 149, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(76, 29, 149, 0.1);
    color: var(--consciousness-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(76, 29, 149, 0.1);
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
    border-bottom: 1px solid #e5e7eb;
  }

  .nav-item:last-child {
    border-bottom: none;
  }

  .nav-item:hover {
    background-color: rgba(76, 29, 149, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--consciousness-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--consciousness-accent);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(76, 29, 149, 0.1), rgba(167, 139, 250, 0.1));
    border: 1px solid rgba(76, 29, 149, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--consciousness-primary);
    color: white;
  }

  .subsection-item {
    padding-left: 1.5rem;
  }

  .nav-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .nav-number {
    font-size: 0.8rem;
    background-color: rgba(76, 29, 149, 0.1);
    color: var(--consciousness-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 600;
    min-width: 2rem;
    text-align: center;
    flex-shrink: 0;
  }

  .nav-item.active .nav-number {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .nav-title {
    flex-grow: 1;
    text-align: left;
  }

  /* Progress indicator */
  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(90deg, rgba(76, 29, 149, 0.1), rgba(167, 139, 250, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--consciousness-primary);
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
    background: linear-gradient(90deg, var(--consciousness-primary), var(--consciousness-accent));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--consciousness-primary);
    font-weight: 500;
  }
  
  .section-content {
    padding-top: 1rem;
    scroll-margin-top: 2rem;
  }

  .documentation-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
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

    .card-content {
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem;
      gap: 0.75rem;
    }
    
    .card-text {
      width: 100%;
    }
    
    .card-actions {
      width: 100%;
    }
    
    .primary-btn {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .card-content {
      padding: 0.75rem;
    }
    
    .card-icon {
      font-size: 1.5rem;
    }
    
    .card-text h3 {
      font-size: 1rem;
    }
    
    .card-text p {
      font-size: 0.85rem;
    }
  }
  
  .content {
    min-width: 0;
  }
  
  .map-container {
    margin: 2rem 0;
  }
  
  /* Additional styles for markdown content */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--consciousness-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--consciousness-secondary);
  }
  
  .content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--consciousness-accent);
  }

  /* Styling for h4 headers (#### in Markdown) */
  :global(h4) {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--consciousness-accent);
  }

  /* Styling for the inset box (blockquote) */
  :global(blockquote) {
    background-color: rgba(167, 139, 250, 0.1);
    border-left: 4px solid var(--consciousness-wisdom);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--consciousness-wisdom);
    display: block;
    margin-bottom: 0.75rem;
  }

  :global(blockquote ul) {
    margin-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }

  :global(blockquote li) {
    margin-bottom: 0.5rem;
  }

  :global(blockquote p:last-child) {
    margin-top: 0.75rem;
    font-style: italic;
  }

  :global(blockquote a) {
    color: var(--consciousness-secondary);
    text-decoration: underline;
    font-weight: 500;
  }

  :global(blockquote a:hover) {
    color: var(--consciousness-primary);
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }
  
  /* Lists with consciousness-themed bullets */
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

  /* Apply consciousness symbols to all ul li EXCEPT those in section-nav */
  .content :global(ul li:not(.section-nav li))::before {
    content: "🧘";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 0.9rem;
  }

  .content :global(ol) {
    list-style-type: decimal;
  }

  .content :global(ol li) {
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
  }

  .content :global(ol li::marker) {
    color: var(--consciousness-secondary);
    font-weight: 600;
  }

  /* Nested lists */
  .content :global(ul ul), .content :global(ol ul) {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .content :global(ul ul li::before) {
    content: "✨";
    color: var(--consciousness-light);
  }

  /* Table styles for consciousness framework */
  :global(.content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.95rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 0.375rem;
    overflow: hidden;
  }

  :global(.content thead) {
    background: linear-gradient(to right, var(--consciousness-primary), var(--consciousness-secondary));
  }

  :global(.content th) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    color: #ffffff;
    border: none;
    border-bottom: 2px solid var(--consciousness-primary);
  }

  :global(.content td) {
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    vertical-align: top;
  }

  :global(.content tr:nth-child(odd)) {
    background-color: rgba(167, 139, 250, 0.05);
  }

  :global(.content tr:nth-child(even)) {
    background-color: #ffffff;
  }

  :global(.content tr:hover) {
    background-color: rgba(167, 139, 250, 0.1);
  }

  :global(.content tbody tr:last-child td) {
    border-bottom: none;
  }

  /* For responsive tables on small screens */
  @media (max-width: 640px) {
    :global(.content table) {
      display: block;
      overflow-x: auto;
    }
    
    :global(.content th),
    :global(.content td) {
      white-space: nowrap;
    }
  }
  
  /* Consciousness guide card */
  .consciousness-guide-card {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(76, 29, 149, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(76, 29, 149, 0.1);
    border: 1px solid rgba(76, 29, 149, 0.2);
    overflow: visible !important;
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
    color: var(--consciousness-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--consciousness-primary);
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
    background-color: var(--consciousness-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--consciousness-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--consciousness-primary);
    border: 1px solid var(--consciousness-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(167, 139, 250, 0.1);
    transform: translateY(-1px);
  }
  
  .download-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }
  
  .arrow-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }

  /* Link styles for content */
  .content :global(a) {
    color: var(--consciousness-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--consciousness-primary);
    text-decoration: underline;
  }

  .content :global(a:active) {
    color: var(--consciousness-primary);
  }

  /* External link styles with a subtle indicator */
  .content :global(a[href^="http"]):after, 
  .content :global(a[href^="https://"]):after {
    content: " ↗";
    font-size: 0.8em;
    vertical-align: super;
  }

  /* PDF link styles with download indicator */
  .content :global(a[href$=".pdf"]):after {
    content: " ↓";
    font-size: 0.8em;
  }

  /* Section link styles - more subtle but still distinct */
  .content :global(a[href^="#"]) {
    color: var(--consciousness-accent);
    text-decoration: none;
    border-bottom: 1px dotted var(--consciousness-accent);
  }

  .content :global(a[href^="#"]):hover {
    color: var(--consciousness-secondary);
    border-bottom-color: var(--consciousness-secondary);
  }

  /* Make sure links in tables are readable against the background */
  .content :global(table a) {
    color: var(--consciousness-secondary);
    font-weight: 600;
  }

  /* Links in the section navigation */
  .section-nav a {
    color: #4b5563;
    text-decoration: none;
    transition: color 0.2s;
  }

  .section-nav a:hover {
    color: var(--consciousness-primary);
  }

  /* Styles for navigation at bottom of guide */
  .guide-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  /* Section navigation for core framework sections */
  .section-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-btn {
    background-color: var(--consciousness-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--consciousness-accent);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }
  
  /* Responsive styles */
  @media (max-width: 640px) {
    .card-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .card-actions {
      width: 100%;
      justify-content: center;
    }
    
    .guide-navigation {
      flex-direction: column;
      gap: 1rem;
    }
    
    .guide-navigation button {
      width: 100%;
    }

    .section-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .section-navigation button {
      width: 100%;
    }
  }

  /* Consciousness Framework specific theme elements */

  /* Special callouts for consciousness concepts */
  .content :global(.personal-transformation-callout) {
    background-color: rgba(245, 158, 11, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--consciousness-transformation);
  }

  .content :global(.collective-wisdom-callout) {
    background-color: rgba(124, 58, 237, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--consciousness-accent);
  }

  .content :global(.systems-thinking-callout) {
    background-color: rgba(30, 64, 175, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--consciousness-secondary);
  }

  .content :global(.spiritual-callout) {
    background-color: rgba(49, 46, 129, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--consciousness-wisdom);
  }

  /* Special styling for case studies */
  .content :global(.case-study) {
    background-color: rgba(5, 150, 105, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--consciousness-earth);
  }

  .content :global(.case-study-title) {
    color: var(--consciousness-earth);
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* Alert/warning styling */
  .content :global(.alert) {
    background-color: rgba(196, 59, 59, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-left: 4px solid #C43B3B;
  }

  .content :global(.alert-title) {
    color: #C43B3B;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* Highlight boxes for important consciousness concepts */
  .content :global(.concept-highlight) {
    background-color: rgba(167, 139, 250, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(167, 139, 250, 0.3);
  }

  .content :global(.concept-highlight-title) {
    color: var(--consciousness-secondary);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(167, 139, 250, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Wisdom principles styling */
  .content :global(.wisdom-highlight) {
    background-color: rgba(76, 29, 149, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(76, 29, 149, 0.3);
  }

  .content :global(.wisdom-highlight-title) {
    color: var(--consciousness-primary);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(76, 29, 149, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Transformation practices styling */
  .content :global(.transformation-highlight) {
    background-color: rgba(245, 158, 11, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .content :global(.transformation-highlight-title) {
    color: var(--consciousness-transformation);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(245, 158, 11, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Cultural wisdom styling */
  .content :global(.cultural-highlight) {
    background-color: rgba(236, 72, 153, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(236, 72, 153, 0.3);
  }

  .content :global(.cultural-highlight-title) {
    color: var(--consciousness-compassion);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(236, 72, 153, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Shadow work and inner development styling */
  .content :global(.shadow-work-highlight) {
    background-color: rgba(49, 46, 129, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(49, 46, 129, 0.3);
  }

  .content :global(.shadow-work-highlight-title) {
    color: var(--consciousness-wisdom);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(49, 46, 129, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--consciousness-accent);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--consciousness-accent);
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

  /* Responsive notice */
  @media (max-width: 640px) {
    .language-fallback-notice {
      padding: 0.75rem 1rem;
    }
    
    .notice-icon {
      font-size: 1.1rem;
    }
    
    .notice-content strong {
      font-size: 0.9rem;
    }
    
    .notice-content p {
      font-size: 0.8rem;
    }
  }
</style>
