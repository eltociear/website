<!-- src/routes/frameworks/guides/bioregional-compass/playbooks/scale-specific-governance-pathways/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Translation state
  $: translationsReady = $isLocaleLoaded;
  $: playbooks = translationsReady ? ($t('guidesBioregionalCompassPlaybooks') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let mounted = false;
  let activeSection = 'overview'; // Start with overview
  let sidebarExpanded = true;

  // Computed values
  $: currentSectionData = data.sections.find(s => s.id === activeSection);

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser && !translationsReady) {
      try {
        await loadTranslations($locale, '/frameworks/guides/bioregional-compass/playbooks');
      } catch (e) {
        console.error('Failed to reload translations:', e);
      }
    }
  });

  // Functions
  function setActiveSection(sectionId) {
    activeSection = sectionId;
    
    if (browser) {
      setTimeout(() => {
        const contentElement = document.querySelector('.playbook-content');
        if (contentElement) {
          contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  function toggleSidebar() {
    sidebarExpanded = !sidebarExpanded;
  }

  function formatSectionTitle(sectionId) {
    return sectionId.replace(/[-_]/g, ' ')
                   .split(' ')
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                   .join(' ');
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  function getSectionIcon(sectionId) {
    switch (sectionId) {
      case 'overview': return '📋';
      case 'homestead-to-village-transition-guide': return '🏘️';
      case 'village-to-bioregional-transition-guide': return '🌄';
      default: return '📊';
    }
  }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>Scale-Specific Governance Pathways - Bioregional Compass</title>
  <meta name="description" content="Tailored governance approaches for different scales of BAZ development, from homestead to bioregional levels" />
</svelte:head>

{#if mounted}
  <!-- Breadcrumb Navigation -->
  <div class="breadcrumb-nav">
    <nav class="breadcrumb-container">
      <a href="/resources" class="breadcrumb-link">
        <span class="breadcrumb-icon">🌍</span>
        <span class="breadcrumb-text">{playbooks.navigation?.resources || 'Resources'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <a href="/frameworks/guides" class="breadcrumb-link">
        <span class="breadcrumb-icon">📖</span>
        <span class="breadcrumb-text">{playbooks.navigation?.guides || 'Implementation Guides'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <a href="/frameworks/guides/bioregional-compass" class="breadcrumb-link">
        <span class="breadcrumb-icon">🧭</span>
        <span class="breadcrumb-text">{playbooks.navigation?.bioregionalCompass || 'Bioregional Compass'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <a href="/frameworks/guides/bioregional-compass/playbooks" class="breadcrumb-link">
        <span class="breadcrumb-icon">📚</span>
        <span class="breadcrumb-text">{playbooks.navigation?.playbooks || 'Specialized Playbooks'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-current">Scale-Specific Governance</span>
    </nav>
  </div>

  <div class="playbook-container">
    <!-- Playbook Header -->
    <header class="playbook-header">
      <div class="header-content">
        <div class="playbook-meta">
          <span class="category-badge governance">Governance & Leadership</span>
          <span class="difficulty-badge intermediate">Intermediate</span>
        </div>
        
        <h1 class="playbook-title">
          <span class="title-icon">📊</span>
          Scale-Specific Governance Pathways
        </h1>
        
        <p class="playbook-description">
          Tailored governance approaches for different scales of BAZ development, from homestead to bioregional levels
        </p>
        
        <div class="playbook-stats">
          <div class="stat-item">
            <span class="stat-label">Pathways</span>
            <span class="stat-number">{data.sections.length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Study Time</span>
            <span class="stat-number">2-3 weeks</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Difficulty</span>
            <span class="stat-number">Intermediate</span>
          </div>
        </div>
      </div>
    </header>

    <div class="content-layout">
      <!-- Section Navigation Sidebar -->
      <aside class="section-nav" class:expanded={sidebarExpanded}>
        <div class="nav-header">
          <h2 class="nav-title">Scale Pathways</h2>
          <button class="sidebar-toggle" on:click={toggleSidebar} aria-label="Toggle sidebar">
            <span class="toggle-icon" class:rotated={!sidebarExpanded}>▼</span>
          </button>
        </div>

        {#if sidebarExpanded}
          <div class="section-list" transition:slide={{ duration: 200 }}>
            {#each data.sections as section, index}
              <button 
                class="section-btn"
                class:active={activeSection === section.id}
                on:click={() => setActiveSection(section.id)}
              >
                <span class="section-number">{index + 1}</span>
                <span class="section-icon">{getSectionIcon(section.id)}</span>
                <div class="section-info">
                  <span class="section-title">{formatSectionTitle(section.id)}</span>
                  <span class="section-description">{section.description}</span>
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Current Section Content -->
        <div class="playbook-content">
          {#if currentSectionData}
            <!-- Section Header -->
            <div class="section-header">
              <div class="section-title-section">
                <h2 class="section-title">
                  <span class="section-icon-large">{getSectionIcon(activeSection)}</span>
                  {formatSectionTitle(activeSection)}
                </h2>
                <p class="section-subtitle">{currentSectionData.description}</p>
              </div>
              
              <div class="section-badges">
                <span class="progress-badge">
                  Section {data.sections.findIndex(s => s.id === activeSection) + 1} of {data.sections.length}
                </span>
              </div>
            </div>

            <!-- Language Fallback Notice -->
            {#if data.sectionsUsingEnglishFallback?.includes(activeSection)}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌍</div>
                <div class="notice-content">
                  <strong>Content in your language coming soon</strong>
                  <p>This section is currently displayed in English until translation is complete.</p>
                </div>
              </div>
            {/if}

            <!-- Render Section Content -->
            <div class="markdown-content">
              {#if data.loadedContent[activeSection]}
                <svelte:component this={data.loadedContent[activeSection].default} t={$t} />
              {:else}
                <div class="missing-content">
                  <h3>Section not found</h3>
                  <p>The section "{activeSection}" is still being developed.</p>
                </div>
              {/if}
            </div>

            <!-- Section Navigation -->
            {#if data.sections.length > 1}
              {@const currentIndex = data.sections.findIndex(s => s.id === activeSection)}
              <div class="section-navigation">
                {#if currentIndex > 0}
                  <button 
                    class="nav-btn prev-btn" 
                    on:click={() => setActiveSection(data.sections[currentIndex - 1].id)}
                  >
                    ← Previous: {formatSectionTitle(data.sections[currentIndex - 1].id)}
                  </button>
                {/if}
                
                {#if currentIndex < data.sections.length - 1}
                  <button 
                    class="nav-btn next-btn" 
                    on:click={() => setActiveSection(data.sections[currentIndex + 1].id)}
                  >
                    Next: {formatSectionTitle(data.sections[currentIndex + 1].id)} →
                  </button>
                {/if}
              </div>
            {/if}
          {:else}
            <div class="no-section">
              <h3>Section not available</h3>
              <p>Please select a section from the sidebar to view its content.</p>
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
    <p>Loading scale-specific governance pathways...</p>
  </div>
{/if}

<style>
  /* Scale-specific governance color scheme */
  :root {
    --guide-primary: #2D5016;
    --guide-secondary: #8B5A2B;
    --guide-accent: #CD853F;
    --guide-light: #F5F5DC;
    --scale-primary: #228B22; /* Forest green for scale/growth */
    --scale-secondary: #32CD32; /* Lime green */
    --scale-light: rgba(34, 139, 34, 0.1);
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
  .playbook-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  /* Playbook Header */
  .playbook-header {
    background: linear-gradient(135deg, var(--guide-light), var(--scale-light));
    border-radius: 1rem;
    padding: 3rem 2rem;
    margin-bottom: 3rem;
    border: 1px solid rgba(34, 139, 34, 0.2);
    text-align: center;
  }

  .playbook-meta {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .category-badge,
  .difficulty-badge {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .category-badge.governance {
    background: var(--scale-primary);
    color: white;
  }

  .difficulty-badge.intermediate {
    background: #DAA520;
    color: white;
  }

  .playbook-title {
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

  .playbook-description {
    font-size: 1.1rem;
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .playbook-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--scale-primary);
  }

  .content-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    align-items: start;
  }

  /* Section Navigation Sidebar - with fixed navigation */
  .section-nav {
    position: sticky;
    top: 2rem;
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    max-height: calc(100vh - 4rem);
    display: flex;
    flex-direction: column;
  }

  .nav-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .nav-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin: 0;
  }

  .sidebar-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    color: #6b7280;
    transition: color 0.2s;
  }

  .sidebar-toggle:hover {
    color: var(--guide-primary);
  }

  .toggle-icon {
    font-size: 0.875rem;
    transition: transform 0.2s;
  }

  .toggle-icon.rotated {
    transform: rotate(-90deg);
  }

  .section-list {
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .section-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    margin-bottom: 0.5rem;
  }

  .section-btn:hover {
    background-color: var(--scale-light);
    border-color: var(--scale-primary);
  }

  .section-btn.active {
    background: var(--scale-primary);
    border-color: var(--scale-primary);
    color: white;
  }

  .section-number {
    font-size: 0.875rem;
    font-weight: 600;
    background: rgba(34, 139, 34, 0.1);
    color: var(--scale-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    min-width: 1.5rem;
    text-align: center;
  }

  .section-btn.active .section-number {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .section-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .section-info {
    flex: 1;
    min-width: 0;
  }

  .section-info .section-title {
    font-size: 1.3rem !important;
    font-weight: 600;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }

  .section-description {
    font-size: 0.75rem;
    opacity: 0.8;
    line-height: 1.3;
  }

  /* Main Content Area */
  .main-content {
    flex: 1;
    min-width: 0;
  }

  .playbook-content {
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .section-header {
    background: linear-gradient(135deg, var(--guide-light), var(--scale-light));
    padding: 2rem;
    border-bottom: 1px solid rgba(34, 139, 34, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
  }

  .section-title-section {
    flex: 1;
  }

  .section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    line-height: 1.3;
  }

  .section-icon-large {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .section-subtitle {
    color: #4b5563;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }

  .section-badges {
    flex-shrink: 0;
  }

  .progress-badge {
    background: var(--scale-primary);
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
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

  /* Markdown Content */
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
    border-bottom: 3px solid var(--scale-primary);
    padding-bottom: 0.75rem;
  }

  .markdown-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin: 2rem 0 1rem 0;
    line-height: 1.3;
    border-bottom: 2px solid rgba(34, 139, 34, 0.3);
    padding-bottom: 0.5rem;
  }

  .markdown-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--guide-secondary);
    margin: 1.5rem 0 0.75rem 0;
    line-height: 1.3;
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

  .markdown-content :global(a) {
    color: var(--scale-primary);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    transition: all 0.2s;
  }

  .markdown-content :global(a:hover) {
    color: var(--scale-secondary);
    text-decoration-thickness: 2px;
  }

  .markdown-content :global(ul) {
    margin: 0 0 1.25rem 0;
    padding-left: 1.5rem;
    list-style-type: disc;
  }

  .markdown-content :global(ol) {
    margin: 0 0 1.25rem 0;
    padding-left: 1.5rem;
    list-style-type: decimal; /* For numbered lists */
  }

  .markdown-content :global(li) {
    margin: 0.5rem 0;
    line-height: 1.6;
    color: #374151;
    display: list-item;
  }

  /* For nested lists */
  .markdown-content :global(ul ul) {
    margin: 0.25rem 0 0.5rem 0;
    list-style-type: circle;
  }

  .markdown-content :global(ul ul ul) {
    list-style-type: square;
  }

  .markdown-content :global(blockquote) {
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid var(--scale-primary);
    background: var(--scale-light);
    border-radius: 0 0.5rem 0.5rem 0;
  }

  .markdown-content :global(.scale) {
    margin: 1.5rem 0;
    padding: 1rem 1.25rem;
    border-radius: 0.5rem;
    border-left: 4px solid var(--scale-primary);
    background: var(--scale-light);
  }

  .missing-content,
  .no-section {
    text-align: center;
    padding: 3rem 2rem;
    color: #6b7280;
  }

  .missing-content h3,
  .no-section h3 {
    color: var(--guide-primary);
    margin-bottom: 1rem;
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

  /* Responsive Design */
  @media (max-width: 1024px) {
    .content-layout {
      grid-template-columns: 250px 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .playbook-container {
      padding: 1rem 0.5rem;
    }

    .playbook-header {
      padding: 2rem 1.5rem;
      margin-bottom: 2rem;
    }

    .playbook-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .playbook-stats {
      gap: 2rem;
    }

    .content-layout {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .section-nav {
      position: static;
      order: 2;
    }

    .main-content {
      order: 1;
    }

    .section-header {
      padding: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .section-title {
      font-size: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
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
  }
</style>
