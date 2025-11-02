<!-- src/routes/frameworks/religious-and-spiritual-dialogue-governance/+page.svelte -->
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

  // Extract religious spiritual framework translations for shorter references
  $: rs = $t('religiousSpiritualFramework') || {};
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
  let implementationOpen = false;
  let resourcesOpen = false;
  let appendicesOpen = false;

  // Initialize accordion states after mount
  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    if (['introduction', 'core-principles', 'objectives'].includes(activeSection)) {
      foundationOpen = true;
    } else if (['governance-structure', 'implementation-mechanisms', 'key-activities', 'funding-and-resources', 'challenges-and-mitigation-strategies', 'timeline', 'conclusion'].includes(activeSection)) {
      implementationOpen = true;
    } else if (['executive-brief', 'policy-guide', 'youth-and-broad-audiences-guide', 'adaptive-facilitation-tools', 'digital-feedback-dashboard'].includes(activeSection)) {
      resourcesOpen = true;
    } else if (activeSection.startsWith('appendix-')) {
      appendicesOpen = true;
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
    return rs.sections?.[section] || section;
  }

  // Group sections logically with multi-lingual support using short references
  function getSectionCategoryTitle(category) {
    return rs.categories?.[category] || category;
  }

  // Function to get shortened section titles for navigation using short references
  function getShortSectionTitle(section) {
    return rs.sectionsShort?.[section] || getSectionTitle(section);
  }

  // Function to download the framework PDF
  function downloadFramework(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/spiritual-dialogue-framework${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `spiritual-dialogue-framework${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Computed values - add safety checks
  $: isGuideActive = ['executive-brief', 'policy-guide', 'youth-and-broad-audiences-guide'].includes(activeSection);
  $: isToolActive = ['adaptive-facilitation-tools', 'digital-feedback-dashboard'].includes(activeSection);
  $: isSupplementaryActive = isGuideActive || isToolActive;
  
  // Define section groups
  $: foundationSections = ['introduction', 'core-principles', 'objectives'];
  $: implementationSections = ['governance-structure', 'implementation-mechanisms', 'key-activities', 'funding-and-resources', 'challenges-and-mitigation-strategies', 'timeline', 'conclusion'];
  $: guideSections = ['executive-brief', 'policy-guide', 'youth-and-broad-audiences-guide'];
  $: toolSections = ['adaptive-facilitation-tools', 'digital-feedback-dashboard'];
  $: appendixSections = Object.keys(data?.sections || {}).filter(section => section.startsWith('appendix-'));
  
  $: coreFrameworkSections = [...foundationSections, ...implementationSections];
  $: isCoreSection = coreFrameworkSections.includes(activeSection);
  $: isAppendixActive = appendixSections.includes(activeSection);

  function toggleFoundation() {
    foundationOpen = !foundationOpen;
  }

  function toggleImplementation() {
    implementationOpen = !implementationOpen;
  }

  function toggleResources() {
    resourcesOpen = !resourcesOpen;
  }

  function toggleAppendices() {
    appendicesOpen = !appendicesOpen;
  }

  // For guide selector
  let selectedGuide = 'youth-and-broad-audiences-guide';
  
  function selectGuide(guide) {
    selectedGuide = guide;
    setActiveSection(guide);
  }

  // Handle locale changes - add safety check
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{rs.meta?.title || 'Religious & Spiritual Dialogue Governance Framework - Global Governance Framework'}</title>
  <meta name="description" content="{rs.meta?.description || 'A comprehensive framework for integrating religious, spiritual, and non-theistic ethical perspectives into global governance'}" />
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
      <!-- Quick Access Card for Guides -->
      {#if !isPrintMode && !isSupplementaryActive && activeSection === 'index'}
        <div class="guide-intro-card">
          <div class="card-content">
            <div class="card-icon">📘</div>
            <div class="card-text">
              <h3>{rs.guideCard?.title || 'New to the Spiritual Dialogue Framework?'}</h3>
              <p>{rs.guideCard?.description || 'Start with one of our guides that explain the principles for different audiences.'}</p>
            </div>
            <div class="card-actions">
              <div class="dropdown">
                <button class="primary-btn dropdown-toggle">
                  {rs.guideCard?.buttonText || 'Choose a Guide'} <span class="arrow-icon">▾</span>
                </button>
                <div class="dropdown-menu">
                  {#each (rs.guides || []) as guide}
                    <button class="dropdown-item" on:click={() => selectGuide(guide.id)}>
                      <span class="guide-icon">{guide.icon}</span>
                      <div class="guide-info">
                        <span class="guide-title">{guide.title}</span>
                        <span class="guide-desc">{guide.description}</span>
                      </div>
                    </button>
                  {/each}
                </div>
              </div>
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

          <!-- Resources/Guides Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={resourcesOpen}
              class:has-active={isSupplementaryActive}
              on:click={toggleResources}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
              <span class="section-count">({guideSections.length + toolSections.length})</span>
              <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
            </button>
            {#if resourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                <!-- Guides subsection -->
                <div class="subsection-divider">{getSectionCategoryTitle('guides')}</div>
                {#each guideSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'executive-brief'}📊
                        {:else if section === 'policy-guide'}⚖️
                        {:else if section === 'youth-and-broad-audiences-guide'}🌿
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
                
                <!-- Implementation Tools subsection -->
                <div class="subsection-divider">{getSectionCategoryTitle('implementationTools')}</div>
                {#each toolSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'adaptive-facilitation-tools'}🛠️
                        {:else if section === 'digital-feedback-dashboard'}📊
                        {:else}🔧{/if}
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
              class:has-active={foundationSections.some(section => activeSection === section)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">🌟</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">({foundationSections.length})</span>
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
                      <span class="nav-icon">
                        {#if section === 'introduction'}🚪
                        {:else if section === 'core-principles'}⭐
                        {:else if section === 'objectives'}🎯
                        {:else}📋{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Implementation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={implementationOpen}
              class:has-active={implementationSections.some(section => activeSection === section)}
              on:click={toggleImplementation}
            >
              <span class="accordion-icon">🚀</span>
              <span class="accordion-title">{getSectionCategoryTitle('implementation')}</span>
              <span class="section-count">({implementationSections.length})</span>
              <span class="toggle-arrow" class:rotated={implementationOpen}>▼</span>
            </button>
            {#if implementationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each implementationSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'governance-structure'}🏛️
                        {:else if section === 'implementation-mechanisms'}⚙️
                        {:else if section === 'key-activities'}🔑
                        {:else if section === 'funding-and-resources'}💰
                        {:else if section === 'challenges-and-mitigation-strategies'}🛡️
                        {:else if section === 'timeline'}📅
                        {:else if section === 'conclusion'}📜
                        {:else}🔧{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Appendices Accordion -->
          {#if appendixSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={appendicesOpen}
                class:has-active={isAppendixActive}
                on:click={toggleAppendices}
              >
                <span class="accordion-icon">📄</span>
                <span class="accordion-title">{getSectionCategoryTitle('appendices')}</span>
                <span class="section-count">({appendixSections.length})</span>
                <span class="toggle-arrow" class:rotated={appendicesOpen}>▼</span>
              </button>
              {#if appendicesOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each appendixSections as section}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">📄</span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Progress indicator for core sections -->
      {#if !isPrintMode && isCoreSection && coreFrameworkSections.length > 0}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((coreFrameworkSections.indexOf(activeSection) + 1) / coreFrameworkSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{rs.progress?.text?.replace('{current}', coreFrameworkSections.indexOf(activeSection) + 1).replace('{total}', coreFrameworkSections.length) || `Section ${coreFrameworkSections.indexOf(activeSection) + 1} of ${coreFrameworkSections.length}`}</span>
        </div>
      {/if}

      <!-- Show active section, or all sections in print mode -->
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && section !== 'index'}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{rs.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{rs.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}

            <!-- Guide selector if we're in one of the guides and not in print mode -->
            {#if isGuideActive && section === activeSection && !isPrintMode}
              <div class="guide-selector">
                <h2>{rs.guideSelector?.title || 'Spiritual Dialogue Framework Guides'}</h2>
                <p>{rs.guideSelector?.description || 'Choose the guide version that best matches your needs:'}</p>
                
                <div class="guide-cards">
                  {#each (rs.guides || []) as guide}
                    <div 
                      class="guide-card" 
                      class:active={activeSection === guide.id}
                      on:click={() => selectGuide(guide.id)}
                    >
                      <div class="guide-icon">{guide.icon}</div>
                      <div class="guide-title">{guide.title}</div>
                      <div class="guide-desc">{guide.description}</div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={translationFunction} />
            
            <!-- Navigation buttons at bottom of guides/tools -->
            {#if isSupplementaryActive && !isPrintMode && section === activeSection}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadFramework(section)}>
                  {rs.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                  {rs.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}

            <!-- Section navigation at bottom of core sections -->
            {#if isCoreSection && !isPrintMode && coreFrameworkSections.length > 0}
              <div class="section-navigation">
                {#if coreFrameworkSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const prevSection = coreFrameworkSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← {rs.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if coreFrameworkSections.indexOf(activeSection) < coreFrameworkSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const nextSection = coreFrameworkSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {rs.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{rs.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
            <p>{rs.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{rs.loading?.text || 'Loading framework content...'}</p>
  </div>
{/if}

<style>
  /* Purple and Gold color scheme for spiritual framework */
  :root {
    --spiritual-primary: #6a3ea1; /* Purple for spiritual framework */
    --spiritual-secondary: #6b7280; /* Grounding Gray */
    --spiritual-accent: #9f7aea; /* Medium purple */
    --spiritual-gold: #b78846; /* Gold accent */
    --spiritual-light: #f8f5ff; /* Light purple */
    --spiritual-medium: #f0e6ff; /* Medium light purple */
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
    background-color: rgba(106, 62, 161, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(106, 62, 161, 0.1);
    color: var(--spiritual-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(106, 62, 161, 0.1);
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

  .subsection-divider {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
    background-color: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
    background-color: rgba(106, 62, 161, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--spiritual-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--spiritual-accent);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(106, 62, 161, 0.1), rgba(159, 122, 234, 0.1));
    border: 1px solid rgba(106, 62, 161, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--spiritual-primary);
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
    background-color: rgba(106, 62, 161, 0.1);
    color: var(--spiritual-primary);
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
    background: linear-gradient(90deg, rgba(106, 62, 161, 0.1), rgba(159, 122, 234, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--spiritual-primary);
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
    background: linear-gradient(90deg, var(--spiritual-primary), var(--spiritual-accent));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--spiritual-primary);
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
  
  /* Additional styles for markdown content */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--spiritual-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--spiritual-primary);
  }
  
  .content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--spiritual-primary);
  }

  /* Styling for h4 headers (#### in Markdown) */
  :global(h4) {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--spiritual-primary);
  }

  /* Styling for the inset box (blockquote) */
  :global(blockquote) {
    background-color: var(--spiritual-light);
    border-left: 4px solid var(--spiritual-accent);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--spiritual-primary);
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
    color: var(--spiritual-primary);
    text-decoration: underline;
    font-weight: 500;
  }

  :global(blockquote a:hover) {
    color: #553086;
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }
  
  /* Lists with spiritual themed symbols */
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

  /* Apply stars to all ul li EXCEPT those in section-nav */
  .content :global(ul li:not(.section-nav li))::before {
    content: "✦";
    position: absolute;
    left: 0;
    top: 0.1em;
    color: var(--spiritual-accent);
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
    color: var(--spiritual-accent);
    font-weight: 600;
  }

  /* Nested lists */
  .content :global(ul ul), .content :global(ol ul) {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .content :global(ul ul li::before) {
    content: "✧";
    color: #b794f4;
  }

  /* Table styles */
  .content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.95rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .content :global(thead) {
    background-color: var(--spiritual-primary);
    color: #ffffff;
  }

  .content :global(th) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    color: #ffffff;
    border: none;
    border-bottom: 2px solid var(--spiritual-primary);
  }

  .content :global(td) {
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    vertical-align: top;
  }

  .content :global(tr:nth-child(odd)) {
    background-color: var(--spiritual-light);
  }

  .content :global(tr:nth-child(even)) {
    background-color: #ffffff;
  }

  .content :global(tr:hover) {
    background-color: var(--spiritual-medium);
  }

  .content :global(tbody tr:last-child td) {
    border-bottom: none;
  }

  /* For responsive tables on small screens */
  @media (max-width: 640px) {
    .content :global(table) {
      display: block;
      overflow-x: auto;
    }
    
    .content :global(th),
    .content :global(td) {
      white-space: nowrap;
    }
  }

  .guide-intro-card {
    background: linear-gradient(135deg, var(--spiritual-light) 0%, var(--spiritual-medium) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(106, 62, 161, 0.1);
    border: 1px solid rgba(106, 62, 161, 0.2);
    overflow: visible !important;
    position: relative;
    z-index: 1;
    width: 100%; /* Full width like the other frameworks */
  }

  .guide-intro-card .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1001;
    min-width: 300px;
    max-width: 350px;
    overflow: hidden;
    border: 1px solid rgba(106, 62, 161, 0.3);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
  }

  /* Keep the existing .guide-card styles for the selector cards */
  .guide-card {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .guide-card:hover {
    box-shadow: 0 4px 6px rgba(106, 62, 161, 0.1);
    transform: translateY(-2px);
    border-color: var(--spiritual-primary);
  }

  .guide-card.active {
    border-color: var(--spiritual-primary);
    background-color: var(--spiritual-light);
  }
  
  .guide-card .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1001;
    min-width: 300px;
    max-width: 350px;
    overflow: hidden;
    border: 1px solid rgba(106, 62, 161, 0.3);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
  }

  .card-content {
    display: flex;
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
    padding: 1.5rem;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

  .card-icon {
    font-size: 2.5rem;
    color: var(--spiritual-primary);
    flex-shrink: 0;
  }

  .card-text {
    flex: 1;
    min-width: 200px; /* Minimum width before wrapping */
  }

  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--spiritual-primary);
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
    background-color: var(--spiritual-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary-btn:hover {
    background-color: #553086;
    transform: translateY(-1px);
  }

  .arrow-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--spiritual-primary);
    border: 1px solid var(--spiritual-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: var(--spiritual-light);
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
    color: var(--spiritual-primary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: #553086;
    text-decoration: underline;
  }

  .content :global(a:active) {
    color: #553086;
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
    color: var(--spiritual-accent);
    text-decoration: none;
    border-bottom: 1px dotted var(--spiritual-accent);
  }

  .content :global(a[href^="#"]):hover {
    color: var(--spiritual-primary);
    border-bottom-color: var(--spiritual-primary);
  }

  /* Make sure links in tables are readable against the background */
  .content :global(table a) {
    color: var(--spiritual-primary);
    font-weight: 600;
  }

  /* Links in the section navigation */
  .section-nav a {
    color: #4b5563;
    text-decoration: none;
    transition: color 0.2s;
  }

  .section-nav a:hover {
    color: var(--spiritual-primary);
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
    background-color: var(--spiritual-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--spiritual-accent);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }
  
  /* Dropdown styles for guides */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    overflow: visible !important;
    width: auto !important;
    min-width: 300px !important;
    padding: 0.5rem 0;
    margin: 0.125rem 0 0;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
    margin-top: 0;
    padding-top: 10px;
    white-space: normal !important;
  }

  .dropdown:hover .dropdown-menu {
    display: block;
  }

  .dropdown::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 10px;
    background: transparent;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1.5rem;
    clear: both;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    white-space: normal !important;
    background-color: transparent;
    border: 0;
    cursor: pointer;
  }
  
  .dropdown-item:hover, .dropdown-item:focus {
    color: #16181b;
    text-decoration: none;
    background-color: var(--spiritual-light);
  }
  
  /* Guide selector styles */
  .guide-selector {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .guide-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .guide-card {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .guide-card:hover {
    box-shadow: 0 4px 6px rgba(106, 62, 161, 0.1);
    transform: translateY(-2px);
    border-color: var(--spiritual-primary);
  }
  
  .guide-card.active {
    border-color: var(--spiritual-primary);
    background-color: var(--spiritual-light);
  }
  
  .guide-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .guide-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--spiritual-primary);
  }
  
  .guide-desc {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .guide-info {
    display: flex;
    flex-direction: column;
  }
  
  /* For dropdown guide items */
  .dropdown-item .guide-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    margin-bottom: 0;
  }
  
  .dropdown-item .guide-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .dropdown-item .guide-desc {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  /* Styles for gold accents */
  .content :global(strong) {
    color: var(--spiritual-gold);
    font-weight: 600;
  }
  
  .content :global(hr) {
    border: 0;
    height: 1px;
    background: linear-gradient(to right, rgba(183, 136, 70, 0.1), rgba(183, 136, 70, 0.5), rgba(183, 136, 70, 0.1));
    margin: 2rem 0;
  }
  
  .content :global(code) {
    background-color: var(--spiritual-light);
    color: var(--spiritual-primary);
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: monospace;
    border: 1px solid rgba(106, 62, 161, 0.2);
  }
  
  .content :global(pre) {
    background-color: #1e1e1e;
    border-radius: 0.375rem;
    padding: 1rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    border-left: 4px solid var(--spiritual-accent);
  }
  
  .content :global(pre code) {
    background-color: transparent;
    color: var(--spiritual-light);
    padding: 0;
    border: none;
    font-size: 0.875rem;
    display: block;
    line-height: 1.6;
  }
  
  /* Special styles for spiritual quotes */
  .content :global(blockquote.spiritual-quote) {
    background: linear-gradient(135deg, rgba(106, 62, 161, 0.05) 0%, rgba(183, 136, 70, 0.05) 100%);
    border-left: 4px solid var(--spiritual-gold);
    font-style: italic;
    margin: 2rem 0;
    padding: 1.5rem;
    border-radius: 0.5rem;
    position: relative;
  }
  
  .content :global(blockquote.spiritual-quote::before) {
    content: '"';
    font-size: 4rem;
    position: absolute;
    left: 0.5rem;
    top: -1rem;
    color: rgba(183, 136, 70, 0.2);
    font-family: Georgia, serif;
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
    
    .guide-cards {
      flex-direction: column;
    }
    
    .guide-card {
      max-width: none;
    }
  }

  /* Language fallback notice */
   .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(106, 62, 161, 0.1);
    border: 1px solid rgba(106, 62, 161, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--spiritual-primary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--spiritual-primary);
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
