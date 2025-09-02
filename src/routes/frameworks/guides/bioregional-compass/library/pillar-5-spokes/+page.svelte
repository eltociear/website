<!-- src/routes/frameworks/guides/bioregional-compass/library/pillar-5-spokes/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Translation state
  $: translationsReady = $isLocaleLoaded;
  $: lib = translationsReady ? ($t('guidesBioregionalCompassLibrary') || {}) : {};
  $: bc = translationsReady ? ($t('guidesBioregionalCompass') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let mounted = false;
  let activeResource = 'ggf-integration-handbook'; // Start with GGF integration
  let activeSection = null; // For multi-section resources
  let expandedOverviews = new Set(['ggf-integration-handbook']); // Default expand first

  // Computed values
  $: currentResource = data.resources.find(r => r.id === activeResource);
  $: hasSubsections = currentResource?.sections && currentResource.sections.length > 0;
  $: sectionsToShow = hasSubsections ? [activeSection || currentResource.sections[0]] : [activeResource];

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser && !translationsReady) {
      try {
        await loadTranslations($locale, '/frameworks/guides/bioregional-compass/library');
      } catch (e) {
        console.error('Failed to reload translations:', e);
      }
    }

    // Set initial section for multi-section resources
    if (hasSubsections && !activeSection) {
      // Start with overview if available, otherwise first section
      const overviewIndex = currentResource.sections.indexOf('overview');
      activeSection = overviewIndex >= 0 ? 'overview' : currentResource.sections[0];
    }
  });

  // Functions
  function setActiveResource(resourceId) {
    activeResource = resourceId;
    const resource = data.resources.find(r => r.id === resourceId);
    
    // Reset section for new resource
    if (resource?.sections && resource.sections.length > 0) {
      const overviewIndex = resource.sections.indexOf('overview');
      activeSection = overviewIndex >= 0 ? 'overview' : resource.sections[0];
    } else {
      activeSection = null;
    }

    // Scroll to content
    if (browser) {
      setTimeout(() => {
        const contentElement = document.querySelector('.resource-content');
        if (contentElement) {
          contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  function setActiveSection(sectionId) {
    activeSection = sectionId;
    
    if (browser) {
      setTimeout(() => {
        const contentElement = document.querySelector('.resource-content');
        if (contentElement) {
          contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  function toggleOverview(resourceId) {
    if (expandedOverviews.has(resourceId)) {
      expandedOverviews.delete(resourceId);
    } else {
      expandedOverviews.add(resourceId);
    }
    expandedOverviews = expandedOverviews; // Trigger reactivity
  }

  function getDifficultyColor(difficulty) {
    switch (difficulty) {
      case 'beginner': return '#228B22';
      case 'intermediate': return '#DAA520';
      case 'advanced': return '#CD853F';
      default: return '#6b7280';
    }
  }

  function getCategoryColor(category) {
    switch (category) {
      case 'integration': return '#00CED1';
      case 'technical': return '#4169E1';
      case 'knowledge': return '#9932CC';
      default: return '#6b7280';
    }
  }

  function formatSectionTitle(sectionId) {
    return sectionId.replace(/[-_]/g, ' ')
                   .replace(/guide$/, '')
                   .replace(/protocols$/, '')
                   .replace(/framework$/, '')
                   .split(' ')
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                   .join(' ');
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
  <title>{getTextWithFallback('guidesBioregionalCompassLibrary.pillar5Spokes.title', 'Pillar 5: Installing the OS - Bioregional Compass')}</title>
  <meta name="description" content="{getTextWithFallback('guidesBioregionalCompassLibrary.pillar5Spokes.description', 'GGF framework integration, digital commons setup, and epistemic infrastructure for BAZ communities')}" />
</svelte:head>

{#if mounted}
  <!-- Breadcrumb Navigation -->
  <div class="breadcrumb-nav">
    <nav class="breadcrumb-container">
      <a href="/resources" class="breadcrumb-link">
        <span class="breadcrumb-icon">🌍</span>
        <span class="breadcrumb-text">{lib.navigation?.resources || 'Resources'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <a href="/frameworks/guides" class="breadcrumb-link">
        <span class="breadcrumb-icon">📖</span>
        <span class="breadcrumb-text">{lib.navigation?.guides || 'Implementation Guides'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <a href="/frameworks/guides/bioregional-compass" class="breadcrumb-link">
        <span class="breadcrumb-icon">🧭</span>
        <span class="breadcrumb-text">{lib.navigation?.bioregionalCompass || 'Bioregional Compass'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <a href="/frameworks/guides/bioregional-compass/library" class="breadcrumb-link">
        <span class="breadcrumb-icon">📚</span>
        <span class="breadcrumb-text">{lib.navigation?.library || 'Resource Library'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-current">Pillar 5: Installing the OS</span>
    </nav>
  </div>

  <div class="page-container">
    <!-- Page Header -->
    <header class="page-header">
      <div class="pillar-badge">
        <span class="pillar-number">Pillar 5</span>
      </div>
      <h1 class="page-title">
        <span class="title-icon">🌐</span>
        Installing the OS
      </h1>
      <p class="page-subtitle">
        {bc.pillars?.pillar5?.subtitle || 'Integrating Core GGF Framework Protocols'}
      </p>
      <p class="page-description">
        GGF framework integration, digital commons setup, and epistemic infrastructure for BAZ communities
      </p>
    </header>

    <div class="content-layout">
      <!-- Resource Navigation Sidebar -->
      <aside class="resource-nav">
        <div class="nav-header">
          <h2 class="nav-title">GGF Integration Resources</h2>
          <p class="nav-subtitle">{data.totalResources} framework toolkits</p>
        </div>

        <div class="resource-list">
          {#each data.resources as resource}
            <div class="resource-item" class:active={activeResource === resource.id}>
              <!-- Resource Header -->
              <button 
                class="resource-header"
                class:expanded={expandedOverviews.has(resource.id)}
                on:click={() => toggleOverview(resource.id)}
              >
                <span class="resource-icon">{resource.icon}</span>
                <div class="resource-info">
                  <h3 class="resource-title">{resource.title}</h3>
                  <div class="resource-meta">
                    <span class="resource-category" style="color: {getCategoryColor(resource.category)}">
                      {resource.category}
                    </span>
                    <span class="resource-difficulty" style="color: {getDifficultyColor(resource.difficulty)}">
                      {resource.difficulty}
                    </span>
                  </div>
                </div>
                <span class="expand-arrow" class:rotated={expandedOverviews.has(resource.id)}>▼</span>
              </button>

              <!-- Resource Overview (Expandable) -->
              {#if expandedOverviews.has(resource.id)}
                <div class="resource-overview" transition:slide={{ duration: 200 }}>
                  <p class="overview-description">{resource.description}</p>
                  <div class="overview-meta">
                    <div class="meta-item">
                      <span class="meta-label">Time:</span>
                      <span class="meta-value">{resource.estimatedTime}</span>
                    </div>
                    {#if resource.sections && resource.sections.length > 0}
                      <div class="meta-item">
                        <span class="meta-label">Sections:</span>
                        <span class="meta-value">{resource.sections.length}</span>
                      </div>
                    {/if}
                  </div>
                  
                  <button 
                    class="select-resource-btn"
                    class:active={activeResource === resource.id}
                    on:click={() => setActiveResource(resource.id)}
                  >
                    {activeResource === resource.id ? 'Currently Viewing' : 'View Resource'}
                  </button>
                </div>
              {/if}

              <!-- Subsection Navigation (for active resource with sections) -->
              {#if activeResource === resource.id && resource.sections && resource.sections.length > 0}
                <div class="subsection-nav" transition:slide={{ duration: 200 }}>
                  <h4 class="subsection-title">Sections:</h4>
                  <div class="subsection-list">
                    {#each resource.sections as section}
                      <button 
                        class="subsection-btn"
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="subsection-icon">
                          {#if section === 'overview'}📖
                          {:else if section.includes('media') || section.includes('node')}📡
                          {:else if section.includes('data') || section.includes('sovereignty')}🔐
                          {:else if section.includes('delegate') || section.includes('representation')}🗳️
                          {:else if section.includes('earth') || section.includes('council')}🌍
                          {:else if section.includes('treaty') || section.includes('adoption')}📜
                          {:else}🌐{/if}
                        </span>
                        <span class="subsection-text">{formatSectionTitle(section)}</span>
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Resource Content -->
        <div class="resource-content">
          {#if currentResource}
            <!-- Content Header -->
            <div class="content-header">
              <div class="content-title-section">
                <h2 class="content-title">
                  <span class="content-icon">{currentResource.icon}</span>
                  {currentResource.title}
                </h2>
                {#if hasSubsections && activeSection}
                  <h3 class="content-section-title">
                    {formatSectionTitle(activeSection)}
                  </h3>
                {/if}
              </div>
              
              <div class="content-badges">
                <span class="difficulty-badge" style="background-color: {getDifficultyColor(currentResource.difficulty)}">
                  {currentResource.difficulty}
                </span>
                <span class="category-badge" style="background-color: {getCategoryColor(currentResource.category)}">
                  {currentResource.category}
                </span>
                <span class="time-badge">
                  ⏱️ {currentResource.estimatedTime}
                </span>
              </div>
            </div>

            <!-- Language Fallback Notice -->
            {#if hasSubsections ? data.sectionsUsingEnglishFallback?.includes(`${activeResource}/${activeSection}`) : data.sectionsUsingEnglishFallback?.includes(activeResource)}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌍</div>
                <div class="notice-content">
                  <strong>Content in your language coming soon</strong>
                  <p>This section is currently displayed in English until translation is complete.</p>
                </div>
              </div>
            {/if}

            <!-- Render Content -->
            <div class="markdown-content">
              {#each sectionsToShow as sectionKey}
                {#if hasSubsections}
                  {#if data.loadedContent[activeResource]?.[sectionKey]}
                    <svelte:component this={data.loadedContent[activeResource][sectionKey].default} t={$t} />
                  {:else}
                    <div class="missing-content">
                      <h3>Section not found</h3>
                      <p>The section "{sectionKey}" is still being developed.</p>
                    </div>
                  {/if}
                {:else}
                  {#if data.loadedContent[activeResource]}
                    <svelte:component this={data.loadedContent[activeResource].default} t={$t} />
                  {:else}
                    <div class="missing-content">
                      <h3>Resource not found</h3>
                      <p>The resource "{activeResource}" is still being developed.</p>
                    </div>
                  {/if}
                {/if}
              {/each}
            </div>

            <!-- Section Navigation for Multi-Section Resources -->
            {#if hasSubsections && currentResource.sections.length > 1}
              {#if currentResource}
                {@const currentIndex = currentResource.sections.indexOf(activeSection)}
                <div class="section-navigation">
                  {#if currentIndex > 0}
                    <button 
                      class="nav-btn prev-btn" 
                      on:click={() => setActiveSection(currentResource.sections[currentIndex - 1])}
                    >
                      ← Previous: {formatSectionTitle(currentResource.sections[currentIndex - 1])}
                    </button>
                  {/if}
                  
                  {#if currentIndex < currentResource.sections.length - 1}
                    <button 
                      class="nav-btn next-btn" 
                      on:click={() => setActiveSection(currentResource.sections[currentIndex + 1])}
                    >
                      Next: {formatSectionTitle(currentResource.sections[currentIndex + 1])} →
                    </button>
                  {/if}
                </div>
              {/if}
            {/if}
          {:else}
            <div class="no-resource">
              <h3>Select a GGF Integration Resource</h3>
              <p>Choose a resource from the sidebar to view its content and integration guidance.</p>
            </div>
          {/if}
        </div>
      </main>
    </div>
  </div>
{:else}
  <!-- Loading state -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading GGF integration resources...</p>
  </div>
{/if}

<style>
  /* Pillar 5 color scheme - technology/systems integration theme */
  :root {
    --guide-primary: #2D5016;
    --guide-secondary: #8B5A2B;
    --guide-accent: #CD853F;
    --guide-light: #F5F5DC;
    --pillar-5: #00CED1;
    
    /* Category colors */
    --integration-cyan: #00CED1;
    --technical-blue: #4169E1;
    --knowledge-purple: #9932CC;
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
    border-top: 4px solid var(--guide-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Breadcrumb Navigation */
  .breadcrumb-nav {
    background-color: rgba(45, 80, 22, 0.05);
    border-bottom: 1px solid rgba(45, 80, 22, 0.1);
    padding: 1rem 0;
  }

  .breadcrumb-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--guide-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .breadcrumb-link:hover {
    color: var(--guide-primary);
    background-color: rgba(45, 80, 22, 0.1);
  }

  .breadcrumb-separator {
    color: #6b7280;
    font-weight: 300;
  }

  .breadcrumb-current {
    color: var(--guide-primary);
    font-weight: 600;
  }

  /* Main Layout */
  .page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
    background: linear-gradient(135deg, var(--guide-light), rgba(0, 206, 209, 0.1));
    border-radius: 1rem;
    padding: 3rem 2rem;
    border: 1px solid rgba(0, 206, 209, 0.2);
  }

  .pillar-badge {
    display: inline-block;
    margin-bottom: 1rem;
  }

  .pillar-number {
    background: var(--pillar-5);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .title-icon {
    font-size: 2.2rem;
  }

  .page-subtitle {
    font-size: 1.25rem;
    color: var(--pillar-5);
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-style: italic;
  }

  .page-description {
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }

  .content-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 2rem;
    align-items: start;
  }

  /* Resource Navigation Sidebar */
  .resource-nav {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .nav-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .nav-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin-bottom: 0.25rem;
  }

  .nav-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .resource-list {
    padding: 1rem;
  }

  .resource-item {
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: all 0.2s;
  }

  .resource-item.active {
    border-color: var(--pillar-5);
    box-shadow: 0 0 0 1px var(--pillar-5);
  }

  .resource-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .resource-header:hover {
    background-color: rgba(0, 206, 209, 0.05);
  }

  .resource-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .resource-info {
    flex: 1;
  }

  .resource-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }

  .resource-meta {
    display: flex;
    gap: 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .resource-category,
  .resource-difficulty {
    text-transform: capitalize;
  }

  .expand-arrow {
    font-size: 0.8rem;
    color: #6b7280;
    transition: transform 0.2s;
  }

  .expand-arrow.rotated {
    transform: rotate(180deg);
  }

  .resource-overview {
    padding: 1rem;
    background-color: rgba(245, 245, 220, 0.5);
    border-top: 1px solid #e5e7eb;
  }

  .overview-description {
    color: #4b5563;
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .overview-meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .meta-label {
    font-weight: 600;
    color: #6b7280;
    font-size: 0.85rem;
  }

  .meta-value {
    color: #4b5563;
    font-size: 0.85rem;
  }

  .select-resource-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--guide-primary);
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }

  .select-resource-btn:hover {
    background: var(--guide-secondary);
    transform: translateY(-1px);
  }

  .select-resource-btn.active {
    background: var(--pillar-5);
    cursor: default;
  }

  .select-resource-btn.active:hover {
    transform: none;
  }

  .subsection-nav {
    padding: 1rem;
    background-color: rgba(0, 206, 209, 0.05);
    border-top: 1px solid rgba(0, 206, 209, 0.1);
  }

  .subsection-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin-bottom: 0.75rem;
  }

  .subsection-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .subsection-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }

  .subsection-btn:hover {
    background-color: rgba(0, 206, 209, 0.1);
    border-color: var(--pillar-5);
  }

  .subsection-btn.active {
    background: var(--pillar-5);
    border-color: var(--pillar-5);
    color: white;
  }

  .subsection-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .subsection-text {
    font-size: 0.85rem;
    font-weight: 500;
    line-height: 1.3;
  }

  /* Main Content Area */
  .main-content {
    flex: 1;
    min-width: 0;
  }

  .resource-content {
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .content-header {
    background: linear-gradient(135deg, var(--guide-light), rgba(0, 206, 209, 0.1));
    padding: 2rem;
    border-bottom: 1px solid rgba(0, 206, 209, 0.1);
  }

  .content-title-section {
    margin-bottom: 1.5rem;
  }

  .content-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    line-height: 1.3;
  }

  .content-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .content-section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--pillar-5);
    margin: 0;
    font-style: italic;
  }

  .content-badges {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .difficulty-badge,
  .category-badge,
  .time-badge {
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }

  .time-badge {
    background: #6b7280;
  }

  .language-fallback-notice {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 2rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: #1e40af;
    font-weight: 600;
    display: block;
    margin-bottom: 0.25rem;
  }

  .notice-content p {
    color: #3b82f6;
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.4;
  }

  /* Markdown Content with :global() selectors */
  .markdown-content {
    padding: 2rem;
    line-height: 1.7;
    color: #374151;
  }

  .markdown-content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
    border-bottom: 3px solid var(--pillar-5);
    padding-bottom: 0.75rem;
  }

  .markdown-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin: 2rem 0 1rem 0;
    line-height: 1.3;
    border-bottom: 2px solid rgba(0, 206, 209, 0.3);
    padding-bottom: 0.5rem;
  }

  .markdown-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--guide-secondary);
    margin: 1.5rem 0 0.75rem 0;
    line-height: 1.3;
  }

  .markdown-content :global(h4) {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--guide-secondary);
    margin: 1.25rem 0 0.5rem 0;
    line-height: 1.4;
  }

  .markdown-content :global(h5),
  .markdown-content :global(h6) {
    font-size: 1rem;
    font-weight: 600;
    color: #4b5563;
    margin: 1rem 0 0.5rem 0;
    line-height: 1.4;
  }

  .markdown-content :global(p) {
    margin: 0 0 1.25rem 0;
    line-height: 1.7;
    color: #374151;
  }

  .markdown-content :global(strong) {
    font-weight: 600;
    color: var(--guide-primary);
  }

  .markdown-content :global(em) {
    font-style: italic;
    color: var(--guide-secondary);
  }

  .markdown-content :global(a) {
    color: var(--pillar-5);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    transition: all 0.2s;
  }

  .markdown-content :global(a:hover) {
    color: var(--guide-secondary);
    text-decoration-thickness: 2px;
  }

  /* Lists */
  .markdown-content :global(ul) {
    margin: 0 0 1.25rem 0;
    padding-left: 1.5rem;
  }

  .markdown-content :global(ol) {
    margin: 0 0 1.25rem 0;
    padding-left: 1.5rem;
  }

  .markdown-content :global(li) {
    margin: 0.5rem 0;
    line-height: 1.6;
    color: #374151;
  }

  .markdown-content :global(li > ul),
  .markdown-content :global(li > ol) {
    margin: 0.5rem 0;
  }

  .markdown-content :global(ul li) {
    list-style-type: disc;
  }

  .markdown-content :global(ul ul li) {
    list-style-type: circle;
  }

  .markdown-content :global(ul ul ul li) {
    list-style-type: square;
  }

  .markdown-content :global(ol li) {
    list-style-type: decimal;
  }

  /* Blockquotes */
  .markdown-content :global(blockquote) {
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid var(--pillar-5);
    background: rgba(0, 206, 209, 0.05);
    border-radius: 0 0.5rem 0.5rem 0;
  }

  .markdown-content :global(blockquote p) {
    margin: 0;
    font-style: italic;
    color: var(--guide-secondary);
  }

  .markdown-content :global(blockquote p:last-child) {
    margin-bottom: 0;
  }

  /* Code */
  .markdown-content :global(code) {
    background: #f3f4f6;
    color: #d97706;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .markdown-content :global(pre) {
    background: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .markdown-content :global(pre code) {
    background: none;
    color: inherit;
    padding: 0;
  }

  /* Tables */
  .markdown-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .markdown-content :global(th) {
    background: var(--guide-light);
    color: var(--guide-primary);
    font-weight: 600;
    padding: 0.75rem;
    text-align: left;
    border-bottom: 2px solid #e5e7eb;
  }

  .markdown-content :global(td) {
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
  }

  .markdown-content :global(tr:last-child td) {
    border-bottom: none;
  }

  .markdown-content :global(tr:nth-child(even)) {
    background: rgba(245, 245, 220, 0.3);
  }

  /* Horizontal Rules */
  .markdown-content :global(hr) {
    border: none;
    height: 2px;
    background: linear-gradient(to right, transparent, var(--pillar-5), transparent);
    margin: 2rem 0;
  }

  /* Special Content Boxes */
  .markdown-content :global(.tip),
  .markdown-content :global(.warning),
  .markdown-content :global(.info),
  .markdown-content :global(.integration) {
    margin: 1.5rem 0;
    padding: 1rem 1.25rem;
    border-radius: 0.5rem;
    border-left: 4px solid;
  }

  .markdown-content :global(.tip) {
    background: rgba(34, 197, 94, 0.05);
    border-left-color: #22c55e;
  }

  .markdown-content :global(.warning) {
    background: rgba(245, 158, 11, 0.05);
    border-left-color: #f59e0b;
  }

  .markdown-content :global(.info) {
    background: rgba(59, 130, 246, 0.05);
    border-left-color: #3b82f6;
  }

  .markdown-content :global(.integration) {
    background: rgba(0, 206, 209, 0.05);
    border-left-color: var(--pillar-5);
  }

  /* Images */
  .markdown-content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Caption support */
  .markdown-content :global(figure) {
    margin: 1.5rem 0;
    text-align: center;
  }

  .markdown-content :global(figcaption) {
    font-size: 0.9rem;
    color: #6b7280;
    font-style: italic;
    margin-top: 0.5rem;
  }

  .missing-content {
    text-align: center;
    padding: 3rem 2rem;
    color: #6b7280;
  }

  .missing-content h3 {
    color: var(--guide-primary);
    margin-bottom: 1rem;
  }

  .missing-content p {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  /* Section Navigation */
  .section-navigation {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .nav-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--guide-primary);
    border-radius: 0.5rem;
    background: white;
    color: var(--guide-primary);
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-btn:hover {
    background: var(--guide-primary);
    color: white;
    transform: translateY(-2px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }

  .no-resource {
    text-align: center;
    padding: 4rem 2rem;
    color: #6b7280;
  }

  .no-resource h3 {
    color: var(--guide-primary);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .no-resource p {
    font-size: 1rem;
    line-height: 1.6;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .content-layout {
      grid-template-columns: 300px 1fr;
      gap: 1.5rem;
    }

    .resource-nav {
      position: static;
      max-height: none;
    }
  }

  @media (max-width: 768px) {
    .page-container {
      padding: 1rem 0.5rem;
    }

    .breadcrumb-container {
      padding: 0 1rem;
    }

    .page-header {
      padding: 2rem 1.5rem;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .title-icon {
      font-size: 1.8rem;
    }

    .content-layout {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .resource-nav {
      order: 2;
    }

    .main-content {
      order: 1;
    }

    .content-header {
      padding: 1.5rem;
    }

    .content-title {
      font-size: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .content-badges {
      gap: 0.5rem;
    }

    .markdown-content {
      padding: 1.5rem;
    }

    .section-navigation {
      padding: 1rem;
      flex-direction: column;
    }

    .nav-btn {
      width: 100%;
      justify-content: center;
      margin: 0 !important;
    }

    .resource-header {
      padding: 0.75rem;
    }

    .resource-title {
      font-size: 0.9rem;
    }

    .resource-meta {
      font-size: 0.8rem;
      gap: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .breadcrumb-container {
      font-size: 0.85rem;
      gap: 0.25rem;
    }

    .page-title {
      font-size: 1.75rem;
    }

    .pillar-number {
      font-size: 0.8rem;
      padding: 0.375rem 0.75rem;
    }

    .content-title {
      font-size: 1.25rem;
    }

    .content-section-title {
      font-size: 1.1rem;
    }

    .difficulty-badge,
    .category-badge,
    .time-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }

    .resource-overview {
      padding: 0.75rem;
    }

    .subsection-nav {
      padding: 0.75rem;
    }

    .overview-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
