<!-- src/routes/frameworks/guides/bioregional-compass/library/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { onMount, tick } from 'svelte';

  export let data;

  // Translation state
  $: translationsReady = $isLocaleLoaded;
  $: bc = translationsReady ? ($t('guidesBioregionalCompass') || {}) : {};
  $: lib = translationsReady ? ($t('guidesBioregionalCompassLibrary') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let mounted = false;
  let selectedCategory = 'all';

  // Computed values
  $: filteredSections = selectedCategory === 'all' 
    ? data.librarySections 
    : data.librarySections.filter(section => section.category === selectedCategory);

  $: sectionsGroupedByCategory = data.librarySections.reduce((groups, section) => {
    const category = section.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(section);
    return groups;
  }, {});

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
  });

  // Translation helper functions
  function getSectionTitle(sectionId) {
    return translationsReady ? (lib.sections?.[sectionId]?.title || formatSectionId(sectionId)) 
                             : formatSectionId(sectionId);
  }

  function getSectionDescription(sectionId) {
    return translationsReady ? (lib.sections?.[sectionId]?.description || 'Detailed resources and tools for this topic') 
                             : 'Detailed resources and tools for this topic';
  }

  function getCategoryTitle(categoryId) {
    return translationsReady ? (lib.categories?.[categoryId]?.title || data.categories[categoryId]?.title) 
                             : data.categories[categoryId]?.title;
  }

  function getCategoryDescription(categoryId) {
    return translationsReady ? (lib.categories?.[categoryId]?.description || data.categories[categoryId]?.description) 
                             : data.categories[categoryId]?.description;
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  function formatSectionId(id) {
    return id.replace(/[-_]/g, ' ')
             .replace(/pillar (\d+) spokes/, 'Pillar $1 Resources')
             .replace(/spokes$/, 'Resources')
             .split(' ')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
             .join(' ');
  }

  function getPillarNumber(sectionId) {
    const match = sectionId.match(/pillar-(\d+)-spokes/);
    return match ? parseInt(match[1]) : null;
  }

  function getPillarTitle(pillarNum) {
    const pillarKey = `pillar${pillarNum}`;
    return translationsReady ? (bc.pillars?.[pillarKey]?.title || `Pillar ${pillarNum}`) 
                             : `Pillar ${pillarNum}`;
  }

  function getPillarSubtitle(pillarNum) {
    const pillarKey = `pillar${pillarNum}`;
    return translationsReady ? (bc.pillars?.[pillarKey]?.subtitle || '') : '';
  }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('guidesBioregionalCompassLibrary.meta.title', 'Resource Library - Bioregional Compass')}</title>
  <meta name="description" content="{getTextWithFallback('guidesBioregionalCompassLibrary.meta.description', 'Comprehensive toolkits and detailed resources for BAZ formation organized by implementation pillar')}" />
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
      <span class="breadcrumb-current">{lib.navigation?.library || 'Resource Library'}</span>
    </nav>
  </div>

  <div class="library-container">
    <!-- Library Header -->
    <header class="library-header">
      <div class="header-content">
        <h1 class="library-title">
          <span class="title-icon">📚</span>
          {lib.title || 'Resource Library'}
        </h1>
        <p class="library-subtitle">
          {lib.subtitle || 'Comprehensive toolkits and detailed resources organized by implementation pillar'}
        </p>
        
        <!-- Library Stats -->
        <div class="library-stats">
          <div class="stat-item">
            <span class="stat-number">{data.totalSections}</span>
            <span class="stat-label">{lib.stats?.sections || 'Sections'}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{data.totalSubsections}+</span>
            <span class="stat-label">{lib.stats?.resources || 'Resources'}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{Object.keys(data.categories).length}</span>
            <span class="stat-label">{lib.stats?.categories || 'Categories'}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Category Filter -->
    <section class="category-filter">
      <h2 class="filter-title">{lib.filter?.title || 'Browse by Category'}</h2>
      <div class="filter-buttons">
        <button 
          class="filter-btn" 
          class:active={selectedCategory === 'all'}
          on:click={() => selectedCategory = 'all'}
        >
          <span class="filter-icon">🌟</span>
          <span class="filter-text">{lib.filter?.all || 'All Resources'}</span>
        </button>
        
        {#each Object.entries(data.categories) as [categoryId, categoryData]}
          <button 
            class="filter-btn" 
            class:active={selectedCategory === categoryId}
            on:click={() => selectedCategory = categoryId}
          >
            <span class="filter-icon">
              {#if categoryId === 'foundation'}🏗️
              {:else if categoryId === 'pillars'}🏛️
              {:else if categoryId === 'advanced'}⚡
              {:else if categoryId === 'development'}📈
              {:else if categoryId === 'operations'}⚙️
              {:else}📁{/if}
            </span>
            <span class="filter-text">{getCategoryTitle(categoryId)}</span>
          </button>
        {/each}
      </div>
    </section>

    <!-- Library Sections -->
    <section class="library-sections">
      {#if selectedCategory === 'all'}
        <!-- Show grouped by category -->
        {#each Object.entries(data.categories) as [categoryId, categoryData]}
          <div class="category-group">
            <div class="category-header">
              <h3 class="category-title">
                <span class="category-icon">
                  {#if categoryId === 'foundation'}🏗️
                  {:else if categoryId === 'pillars'}🏛️
                  {:else if categoryId === 'advanced'}⚡
                  {:else if categoryId === 'development'}📈
                  {:else if categoryId === 'operations'}⚙️
                  {:else}📁{/if}
                </span>
                {getCategoryTitle(categoryId)}
              </h3>
              <p class="category-description">{getCategoryDescription(categoryId)}</p>
            </div>
            
            <div class="section-grid">
              {#each sectionsGroupedByCategory[categoryId] || [] as section}
                <a href="/frameworks/guides/bioregional-compass/library/{section.id}" class="section-card {section.category}-card">
                  <div class="card-header">
                    <span class="card-icon">{section.icon}</span>
                    <h4 class="card-title">
                      {#if section.id.includes('pillar-')}
                        {@const pillarNum = getPillarNumber(section.id)}
                        <span class="pillar-number">Pillar {pillarNum}:</span>
                        <span class="pillar-name">{getPillarTitle(pillarNum)}</span>
                        {#if getPillarSubtitle(pillarNum)}
                          <span class="pillar-subtitle">{getPillarSubtitle(pillarNum)}</span>
                        {/if}
                      {:else}
                        {getSectionTitle(section.id)}
                      {/if}
                    </h4>
                  </div>
                  
                  <p class="card-description">
                    {getSectionDescription(section.id)}
                  </p>
                  
                  <div class="card-footer">
                    <span class="resource-count">{section.subsectionCount} {lib.sections?.resourceCount || 'Resources'}</span>
                    <span class="card-cta">{lib.actions?.explore || 'Explore'} →</span>
                  </div>
                </a>
              {/each}
            </div>
          </div>
        {/each}
      {:else}
        <!-- Show filtered sections -->
        <div class="filtered-sections">
          <div class="section-grid">
            {#each filteredSections as section}
              <a href="/frameworks/guides/bioregional-compass/library/{section.id}" class="section-card {section.category}-card">
                <div class="card-header">
                  <span class="card-icon">{section.icon}</span>
                  <h4 class="card-title">
                    {#if section.id.includes('pillar-')}
                      {@const pillarNum = getPillarNumber(section.id)}
                      <span class="pillar-number">Pillar {pillarNum}:</span>
                      <span class="pillar-name">{getPillarTitle(pillarNum)}</span>
                      {#if getPillarSubtitle(pillarNum)}
                        <span class="pillar-subtitle">{getPillarSubtitle(pillarNum)}</span>
                      {/if}
                    {:else}
                      {getSectionTitle(section.id)}
                    {/if}
                  </h4>
                </div>
                
                <p class="card-description">
                  {getSectionDescription(section.id)}
                </p>
                
                <div class="card-footer">
                  <span class="resource-count">{section.subsectionCount} {lib.sections?.resourceCount || 'Resources'}</span>
                  <span class="card-cta">{lib.actions?.explore || 'Explore'} →</span>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </section>

    <!-- Help Section -->
    <section class="help-section">
      <div class="help-content">
        <h3 class="help-title">{lib.help?.title || 'Need Guidance?'}</h3>
        <p class="help-text">
          {lib.help?.text || 'Start with the Assessment & Support section if you\'re new to BAZ formation, or browse the Six Pillars for implementation guidance.'}
        </p>
        <div class="help-links">
          <a href="/frameworks/guides/bioregional-compass" class="help-link primary">
            {lib.help?.backToGuide || 'Back to Guide Overview'}
          </a>
          <a href="/frameworks/guides/bioregional-compass/library/assessment-and-support-spokes" class="help-link secondary">
            {lib.help?.startAssessment || 'Start with Assessment'}
          </a>
        </div>
      </div>
    </section>
  </div>
{:else}
  <!-- Loading state -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('guidesBioregionalCompassLibrary.loading.text', 'Loading library content...')}</p>
  </div>
{/if}

<style>
  /* Bioregional Compass Library color scheme */
  :root {
    --guide-primary: #2D5016;
    --guide-secondary: #8B5A2B;
    --guide-accent: #CD853F;
    --guide-success: #228B22;
    --guide-warning: #DAA520;
    --guide-light: #F5F5DC;
    --guide-dark: #1C2E0A;
    
    /* Category colors */
    --category-foundation: #8B4513;
    --category-pillars: #228B22;
    --category-advanced: #4169E1;
    --category-development: #9932CC;
    --category-operations: #FF8C00;
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
    max-width: 1200px;
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
  .library-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  /* Library Header */
  .library-header {
    background: linear-gradient(135deg, var(--guide-light), rgba(45, 80, 22, 0.1));
    border-radius: 1rem;
    padding: 3rem 2rem;
    margin-bottom: 3rem;
    border: 1px solid rgba(45, 80, 22, 0.2);
    text-align: center;
  }

  .library-title {
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

  .library-subtitle {
    font-size: 1.1rem;
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .library-stats {
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

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--guide-primary);
  }

  .stat-label {
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Category Filter */
  .category-filter {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    margin-bottom: 3rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .filter-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }

  .filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    color: #4b5563;
  }

  .filter-btn:hover {
    border-color: var(--guide-accent);
    background-color: rgba(205, 133, 63, 0.1);
  }

  .filter-btn.active {
    background: var(--guide-primary);
    border-color: var(--guide-primary);
    color: white;
  }

  /* Library Sections */
  .library-sections {
    margin-bottom: 4rem;
  }

  .category-group {
    margin-bottom: 4rem;
  }

  .category-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .category-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .category-icon {
    font-size: 1.5rem;
  }

  .category-description {
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.6;
  }

  .section-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .section-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 2px solid #e5e7eb;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .section-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(45, 80, 22, 0.15);
  }

  /* Category-specific card styling */
  .foundation-card {
    border-color: rgba(139, 69, 19, 0.3);
  }

  .foundation-card:hover {
    border-color: var(--category-foundation);
  }

  .pillars-card {
    border-color: rgba(34, 139, 34, 0.3);
  }

  .pillars-card:hover {
    border-color: var(--category-pillars);
  }

  .advanced-card {
    border-color: rgba(65, 105, 225, 0.3);
  }

  .advanced-card:hover {
    border-color: var(--category-advanced);
  }

  .development-card {
    border-color: rgba(153, 50, 204, 0.3);
  }

  .development-card:hover {
    border-color: var(--category-development);
  }

  .operations-card {
    border-color: rgba(255, 140, 0, 0.3);
  }

  .operations-card:hover {
    border-color: var(--category-operations);
  }

  .card-header {
    margin-bottom: 1rem;
  }

  .card-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    display: block;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin: 0;
    line-height: 1.3;
  }

  .pillar-number {
    color: var(--guide-secondary);
    font-size: 0.9rem;
    display: block;
  }

  .pillar-name {
    color: var(--guide-primary);
    font-weight: 700;
    display: block;
  }

  .pillar-subtitle {
    color: #6b7280;
    font-size: 0.9rem;
    font-weight: 400;
    font-style: italic;
    display: block;
    margin-top: 0.25rem;
  }

  .card-description {
    color: #4b5563;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .resource-count {
    font-size: 0.85rem;
    color: #6b7280;
    font-weight: 500;
  }

  .card-cta {
    color: var(--guide-secondary);
    font-weight: 600;
    font-size: 0.9rem;
  }

  /* Help Section */
  .help-section {
    background: linear-gradient(135deg, rgba(45, 80, 22, 0.05), rgba(139, 90, 43, 0.05));
    border-radius: 0.75rem;
    padding: 2rem;
    border: 1px solid rgba(45, 80, 22, 0.1);
    text-align: center;
  }

  .help-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin-bottom: 1rem;
  }

  .help-text {
    color: #4b5563;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .help-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .help-link {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
  }

  .help-link.primary {
    background: var(--guide-primary);
    color: white;
  }

  .help-link.primary:hover {
    background: var(--guide-secondary);
    transform: translateY(-2px);
  }

  .help-link.secondary {
    background: white;
    color: var(--guide-primary);
    border: 2px solid var(--guide-primary);
  }

  .help-link.secondary:hover {
    background: var(--guide-primary);
    color: white;
    transform: translateY(-2px);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .library-container {
      padding: 1rem 0.5rem;
    }

    .breadcrumb-container {
      padding: 0 1rem;
    }

    .library-header {
      padding: 2rem 1.5rem;
      margin-bottom: 2rem;
    }

    .library-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .title-icon {
      font-size: 1.8rem;
    }

    .library-stats {
      gap: 2rem;
    }

    .stat-number {
      font-size: 1.5rem;
    }

    .category-filter {
      padding: 1.5rem;
    }

    .filter-title {
      font-size: 1.25rem;
    }

    .filter-buttons {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-btn {
      justify-content: center;
      padding: 1rem;
    }

    .category-title {
      font-size: 1.5rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .section-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .section-card {
      padding: 1.25rem;
    }

    .help-links {
      flex-direction: column;
      align-items: stretch;
    }
  }

  @media (max-width: 480px) {
    .breadcrumb-container {
      font-size: 0.85rem;
      gap: 0.25rem;
    }

    .library-title {
      font-size: 1.75rem;
    }

    .library-stats {
      flex-direction: column;
      gap: 1rem;
    }

    .filter-btn {
      font-size: 0.9rem;
      padding: 0.75rem;
    }

    .card-title {
      font-size: 1.1rem;
    }
  }
</style>
