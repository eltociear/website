<!-- src/routes/frameworks/guides/bioregional-compass/library/assessment-and-support-spokes/+page.svelte -->
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
  $: currentLocale = $locale;

  // Component state
  let mounted = false;
  let activeResource = 'pre-formation-assessment-suite'; // Start with assessment
  let activeSection = null; // For multi-section resources
  let expandedOverviews = new Set(['pre-formation-assessment-suite']); // Default expand first

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
      case 'planning': return '#8B4513';
      case 'support': return '#228B22';
      case 'monitoring': return '#4169E1';
      default: return '#6b7280';
    }
  }

  function formatSectionTitle(sectionId) {
    return sectionId.replace(/[-_]/g, ' ')
                   .replace(/module$/, '')
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
  <title>{getTextWithFallback('guidesBioregionalCompassLibrary.assessmentSupport.title', 'Assessment & Support Resources - Bioregional Compass')}</title>
  <meta name="description" content="{getTextWithFallback('guidesBioregionalCompassLibrary.assessmentSupport.description', 'Essential planning tools, mentorship networks, and monitoring systems for BAZ formation')}" />
</svelte:head>

{#if mounted}
  <!-- Breadcrumb Navigation -->
  <div class="breadcrumb-nav">
    <nav class="breadcrumb-container">
      <a href="/resources" class="breadcrumb-link">
        <span class="breadcrumb-icon">🌐</span>
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
      <span class="breadcrumb-current">Assessment & Support</span>
    </nav>
  </div>

  <div class="page-container">
    <!-- Page Header -->
    <header class="page-header">
      <h1 class="page-title">
        <span class="title-icon">📋</span>
        Assessment & Support Resources
      </h1>
      <p class="page-subtitle">
        Essential planning tools, mentorship networks, and monitoring systems for successful BAZ formation
      </p>
    </header>

    <div class="content-layout">
      <!-- Resource Navigation Sidebar -->
      <aside class="resource-nav">
        <div class="nav-header">
          <h2 class="nav-title">Resources</h2>
          <p class="nav-subtitle">{data.totalResources} available tools</p>
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
                          {:else if section.includes('calculator')}🧮
                          {:else if section.includes('mapping')}🗺️
                          {:else if section.includes('legal')}⚖️
                          {:else if section.includes('resource')}📊
                          {:else if section.includes('network')}🌐
                          {:else if section.includes('mentor')}👥
                          {:else if section.includes('professional')}💼
                          {:else if section.includes('regional')}🌍
                          {:else}📄{/if}
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
          {:else}
            <div class="no-resource">
              <h3>Select a Resource</h3>
              <p>Choose a resource from the sidebar to view its content and tools.</p>
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
    <p>Loading assessment resources...</p>
  </div>
{/if}

<style>
  /* Assessment & Support color scheme */
  :root {
    --guide-primary: #2D5016;
    --guide-secondary: #8B5A2B;
    --guide-accent: #CD853F;
    --guide-light: #F5F5DC;
    --assessment-blue: #4169E1;
    --planning-brown: #8B4513;
    --support-green: #228B22;
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
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .title-icon {
    font-size: 2.2rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
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
    border-color: var(--guide-primary);
    box-shadow: 0 0 0 1px var(--guide-primary);
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
    background-color: rgba(45, 80, 22, 0.05);
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
    margin-bottom: 0.25rem;
  }

  .resource-meta {
    display: flex;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .expand-arrow {
    font-size: 0.8rem;
    color: #6b7280;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .expand-arrow.rotated {
    transform: rotate(180deg);
  }

  .resource-overview {
    padding: 0 1rem 1rem 1rem;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
  }

  .overview-description {
    font-size: 0.9rem;
    color: #4b5563;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .overview-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .meta-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .meta-value {
    font-size: 0.8rem;
    color: var(--guide-primary);
    font-weight: 600;
  }

  .select-resource-btn {
    width: 100%;
    padding: 0.5rem 1rem;
    background: white;
    border: 2px solid var(--guide-primary);
    border-radius: 0.375rem;
    color: var(--guide-primary);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
  }

  .select-resource-btn:hover {
    background: var(--guide-primary);
    color: white;
  }

  .select-resource-btn.active {
    background: var(--guide-primary);
    color: white;
  }

  /* Subsection Navigation */
  .subsection-nav {
    padding: 1rem;
    background-color: #f3f4f6;
    border-top: 1px solid #e5e7eb;
  }

  .subsection-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin-bottom: 0.75rem;
  }

  .subsection-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
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
    font-size: 0.85rem;
  }

  .subsection-btn:hover {
    border-color: var(--guide-accent);
    background-color: rgba(205, 133, 63, 0.1);
  }

  .subsection-btn.active {
    background: var(--guide-primary);
    border-color: var(--guide-primary);
    color: white;
  }

  .subsection-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .subsection-text {
    flex: 1;
    font-weight: 500;
  }

  /* Main Content Area */
  .main-content {
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
    padding: 2rem;
    background: linear-gradient(135deg, var(--guide-light), rgba(45, 80, 22, 0.1));
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .content-title-section {
    flex: 1;
    min-width: 300px;
  }

  .content-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .content-icon {
    font-size: 1.5rem;
  }

  .content-section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--guide-secondary);
    margin: 0;
  }

  .content-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .difficulty-badge,
  .category-badge,
  .time-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }

  .time-badge {
    background-color: #6b7280;
  }

  /* Language Fallback Notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(218, 165, 32, 0.1);
    border: 1px solid rgba(218, 165, 32, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin: 2rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: #DAA520;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--guide-secondary);
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

  /* Markdown Content */
  .markdown-content {
    padding: 2rem;
  }

  .missing-content {
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  .missing-content h3 {
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .no-resource {
    padding: 4rem 2rem;
    text-align: center;
    color: #6b7280;
  }

  .no-resource h3 {
    color: #374151;
    margin-bottom: 0.5rem;
  }

  /* Section Navigation */
  .section-navigation {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }

  .nav-btn {
    background-color: var(--guide-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }

  .nav-btn:hover {
    background-color: var(--guide-secondary);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }

  /* Content Styling */
  .markdown-content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--guide-primary);
  }
  
  .markdown-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--guide-secondary);
  }
  
  .markdown-content :global(h3),
  .markdown-content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--guide-accent);
  }

  .markdown-content :global(h4) {
    font-size: 1.2rem;
  }
  
  .markdown-content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }

  .markdown-content :global(blockquote) {
    background-color: rgba(139, 90, 43, 0.1);
    border-left: 4px solid var(--guide-secondary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .markdown-content :global(ul), .markdown-content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1rem;
    color: #4b5563;
  }

  .markdown-content :global(ul) {
    list-style-type: none;
  }

  .markdown-content :global(ul li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }

  .markdown-content :global(ul li::before) {
    content: "📋";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1rem;
  }

  .markdown-content :global(ol) {
    list-style-type: decimal;
    counter-reset: item;
  }

  .markdown-content :global(ol li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
    color: #4b5563;
  }

  .markdown-content :global(ol li::marker) {
    color: var(--guide-secondary);
    font-weight: 600;
  }

  .markdown-content :global(a) {
    color: var(--guide-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .markdown-content :global(a:hover) {
    color: var(--guide-primary);
  }

  /* Tables */
  .markdown-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .markdown-content :global(th),
  .markdown-content :global(td) {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .markdown-content :global(th) {
    background-color: var(--guide-light);
    font-weight: 600;
    color: var(--guide-primary);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .content-layout {
      grid-template-columns: 1fr;
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

    .content-header {
      padding: 1.5rem;
      flex-direction: column;
      align-items: stretch;
    }

    .content-title {
      font-size: 1.5rem;
    }

    .content-badges {
      justify-content: flex-start;
    }

    .markdown-content {
      padding: 1.5rem;
    }

    .section-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .section-navigation button {
      width: 100%;
    }

    .resource-list {
      padding: 0.5rem;
    }

    .resource-header {
      padding: 0.75rem;
    }

    .resource-overview {
      padding: 0 0.75rem 0.75rem 0.75rem;
    }

    .subsection-nav {
      padding: 0.75rem;
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

    .content-title {
      font-size: 1.25rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .content-icon {
      font-size: 1.25rem;
    }

    .overview-meta {
      flex-direction: column;
      gap: 0.5rem;
    }

    .subsection-list {
      gap: 0.5rem;
    }

    .subsection-btn {
      padding: 0.75rem;
    }
  }
</style>
