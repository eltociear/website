<!-- src/routes/frameworks/guides/bioregional-compass/playbooks/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { onMount, tick } from 'svelte';

  export let data;

  // Translation state
  $: translationsReady = $isLocaleLoaded;
  $: playbooks = translationsReady ? ($t('guidesBioregionalCompassPlaybooks') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let mounted = false;
  let selectedCategory = 'all';

  // Computed values
  $: filteredPlaybooks = selectedCategory === 'all' 
    ? data.playbooks 
    : data.playbooks.filter(playbook => playbook.category === selectedCategory);

  $: playbooksGroupedByCategory = data.playbooks.reduce((groups, playbook) => {
    const category = playbook.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(playbook);
    return groups;
  }, {});

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

  // Translation helper functions
  function getPlaybookTitle(playbookId) {
    return translationsReady ? (playbooks.playbooks?.[playbookId]?.title || formatPlaybookId(playbookId)) 
                             : formatPlaybookId(playbookId);
  }

  function getPlaybookDescription(playbookId) {
    return translationsReady ? (playbooks.playbooks?.[playbookId]?.description || 'Strategic guidance for complex BAZ challenges') 
                             : 'Strategic guidance for complex BAZ challenges';
  }

  function getCategoryTitle(categoryId) {
    return translationsReady ? (playbooks.categories?.[categoryId]?.title || data.categories[categoryId]?.title) 
                             : data.categories[categoryId]?.title;
  }

  function getCategoryDescription(categoryId) {
    return translationsReady ? (playbooks.categories?.[categoryId]?.description || data.categories[categoryId]?.description) 
                             : data.categories[categoryId]?.description;
  }

  function getCategoryIcon(categoryId) {
    return translationsReady ? (playbooks.categories?.[categoryId]?.icon || data.categories[categoryId]?.icon) 
                             : data.categories[categoryId]?.icon;
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  function formatPlaybookId(id) {
    return id.replace(/[-_]/g, ' ')
             .replace(/playbook$/, 'Playbook')
             .split(' ')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
             .join(' ');
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
      case 'legal': return '#8B0000';
      case 'governance': return '#4169E1';
      case 'relationships': return '#9932CC';
      case 'adaptation': return '#228B22';
      default: return '#6b7280';
    }
  }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('guidesBioregionalCompassPlaybooks.meta.title', 'Specialized Playbooks - Bioregional Compass')}</title>
  <meta name="description" content="{getTextWithFallback('guidesBioregionalCompassPlaybooks.meta.description', 'Advanced strategies and problem-solving guides for complex BAZ challenges organized by domain')}" />
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
      <span class="breadcrumb-current">{playbooks.navigation?.playbooks || 'Specialized Playbooks'}</span>
    </nav>
  </div>

  <div class="playbooks-container">
    <!-- Playbooks Header -->
    <header class="playbooks-header">
      <div class="header-content">
        <h1 class="playbooks-title">
          <span class="title-icon">📚</span>
          {playbooks.title || 'Specialized Playbooks'}
        </h1>
        <p class="playbooks-subtitle">
          {playbooks.subtitle || 'Advanced strategies and problem-solving guides for complex BAZ challenges'}
        </p>
        
        <!-- Playbooks Stats -->
        <div class="playbooks-stats">
          <div class="stat-item">
            <span class="stat-number">{data.totalPlaybooks}</span>
            <span class="stat-label">{playbooks.stats?.playbooks || 'Playbooks'}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{Object.keys(data.categories).length}</span>
            <span class="stat-label">{playbooks.stats?.categories || 'Categories'}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{data.totalStrategies}+</span>
            <span class="stat-label">{playbooks.stats?.strategies || 'Strategies'}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Category Filter -->
    <section class="category-filter">
      <h2 class="filter-title">{playbooks.filter?.title || 'Browse by Challenge Type'}</h2>
      <div class="filter-buttons">
        <button 
          class="filter-btn" 
          class:active={selectedCategory === 'all'}
          on:click={() => selectedCategory = 'all'}
        >
          <span class="filter-icon">🌟</span>
          <span class="filter-text">{playbooks.filter?.all || 'All Playbooks'}</span>
        </button>
        
        {#each Object.entries(data.categories) as [categoryId, categoryData]}
          <button 
            class="filter-btn" 
            class:active={selectedCategory === categoryId}
            on:click={() => selectedCategory = categoryId}
          >
            <span class="filter-icon">{getCategoryIcon(categoryId)}</span>
            <span class="filter-text">{getCategoryTitle(categoryId)}</span>
          </button>
        {/each}
      </div>
    </section>

    <!-- Playbooks Sections -->
    <section class="playbooks-sections">
      {#if selectedCategory === 'all'}
        <!-- Show grouped by category -->
        {#each Object.entries(data.categories) as [categoryId, categoryData]}
          <div class="category-group">
            <div class="category-header">
              <h3 class="category-title">
                <span class="category-icon">{getCategoryIcon(categoryId)}</span>
                {getCategoryTitle(categoryId)}
              </h3>
              <p class="category-description">{getCategoryDescription(categoryId)}</p>
            </div>
            
            <div class="playbooks-grid">
              {#each playbooksGroupedByCategory[categoryId] || [] as playbook}
                <a href="/frameworks/guides/bioregional-compass/playbooks/{playbook.id}" class="playbook-card {playbook.category}-card">
                  <div class="card-header">
                    <span class="card-icon">{getCategoryIcon(playbook.category)}</span>
                    <h4 class="card-title">{getPlaybookTitle(playbook.id)}</h4>
                  </div>
                  
                  <p class="card-description">
                    {getPlaybookDescription(playbook.id)}
                  </p>
                  
                  <div class="card-meta">
                    <div class="meta-badges">
                      <span class="difficulty-badge" style="background-color: {getDifficultyColor(playbook.difficulty)}">
                        {playbook.difficulty}
                      </span>
                      <span class="time-badge">
                        ⏱️ {playbook.estimatedTime}
                      </span>
                    </div>
                    
                    {#if playbook.challenges && playbook.challenges.length > 0}
                      <div class="challenge-tags">
                        {#each playbook.challenges.slice(0, 2) as challenge}
                          <span class="challenge-tag">{challenge}</span>
                        {/each}
                        {#if playbook.challenges.length > 2}
                          <span class="challenge-tag more">+{playbook.challenges.length - 2} more</span>
                        {/if}
                      </div>
                    {/if}
                  </div>
                  
                  <div class="card-footer">
                    <span class="card-cta">{playbooks.ui?.explore || 'Explore'} →</span>
                  </div>
                </a>
              {/each}
            </div>
          </div>
        {/each}
      {:else}
        <!-- Show filtered playbooks -->
        <div class="filtered-playbooks">
          <div class="playbooks-grid">
            {#each filteredPlaybooks as playbook}
              <a href="/frameworks/guides/bioregional-compass/playbooks/{playbook.id}" class="playbook-card {playbook.category}-card">
                <div class="card-header">
                  <span class="card-icon">{getCategoryIcon(playbook.category)}</span>
                  <h4 class="card-title">{getPlaybookTitle(playbook.id)}</h4>
                </div>
                
                <p class="card-description">
                  {getPlaybookDescription(playbook.id)}
                </p>
                
                <div class="card-meta">
                  <div class="meta-badges">
                    <span class="difficulty-badge" style="background-color: {getDifficultyColor(playbook.difficulty)}">
                      {playbook.difficulty}
                    </span>
                    <span class="time-badge">
                      ⏱️ {playbook.estimatedTime}
                    </span>
                  </div>
                  
                  {#if playbook.challenges && playbook.challenges.length > 0}
                    <div class="challenge-tags">
                      {#each playbook.challenges.slice(0, 2) as challenge}
                        <span class="challenge-tag">{challenge}</span>
                      {/each}
                      {#if playbook.challenges.length > 2}
                        <span class="challenge-tag more">+{playbook.challenges.length - 2} more</span>
                      {/if}
                    </div>
                  {/if}
                </div>
                
                <div class="card-footer">
                  <span class="card-cta">{playbooks.ui?.explore || 'Explore'} →</span>
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
        <h3 class="help-title">{playbooks.help?.title || 'Need Strategic Guidance?'}</h3>
        <p class="help-text">
          {playbooks.help?.text || 'These playbooks address complex challenges that may arise during BAZ formation. Start with playbooks that match your current challenges or anticipated needs.'}
        </p>
        <div class="help-links">
          <a href="/frameworks/guides/bioregional-compass" class="help-link primary">
            {playbooks.help?.backToGuide || 'Back to Main Guide'}
          </a>
          <a href="/frameworks/guides/bioregional-compass/playbooks/legal-strategy-and-resilience-playbook" class="help-link secondary">
            {playbooks.help?.startWithBasics || 'Start with Legal Strategy'}
          </a>
        </div>
      </div>
    </section>
  </div>
{:else}
  <!-- Loading state -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('guidesBioregionalCompassPlaybooks.loading.text', 'Loading specialized playbooks...')}</p>
  </div>
{/if}

<style>
  /* Bioregional Compass Playbooks color scheme */
  :root {
    --guide-primary: #2D5016;
    --guide-secondary: #8B5A2B;
    --guide-accent: #CD853F;
    --guide-success: #228B22;
    --guide-warning: #DAA520;
    --guide-light: #F5F5DC;
    --guide-dark: #1C2E0A;
    
    /* Category colors */
    --category-legal: #8B0000;
    --category-governance: #4169E1;
    --category-relationships: #9932CC;
    --category-adaptation: #228B22;
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
  .playbooks-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  /* Playbooks Header */
  .playbooks-header {
    background: linear-gradient(135deg, var(--guide-light), rgba(45, 80, 22, 0.1));
    border-radius: 1rem;
    padding: 3rem 2rem;
    margin-bottom: 3rem;
    border: 1px solid rgba(45, 80, 22, 0.2);
    text-align: center;
  }

  .playbooks-title {
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

  .playbooks-subtitle {
    font-size: 1.1rem;
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .playbooks-stats {
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

  /* Playbooks Sections */
  .playbooks-sections {
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

  .playbooks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .playbook-card {
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

  .playbook-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(45, 80, 22, 0.15);
  }

  /* Category-specific card styling */
  .legal-card {
    border-color: rgba(139, 0, 0, 0.3);
  }

  .legal-card:hover {
    border-color: var(--category-legal);
  }

  .governance-card {
    border-color: rgba(65, 105, 225, 0.3);
  }

  .governance-card:hover {
    border-color: var(--category-governance);
  }

  .relationships-card {
    border-color: rgba(153, 50, 204, 0.3);
  }

  .relationships-card:hover {
    border-color: var(--category-relationships);
  }

  .adaptation-card {
    border-color: rgba(34, 139, 34, 0.3);
  }

  .adaptation-card:hover {
    border-color: var(--category-adaptation);
  }

  .card-header {
    margin-bottom: 1rem;
  }

  .card-icon {
    font-size: 1.8rem;
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

  .card-description {
    color: #4b5563;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }

  .card-meta {
    margin-bottom: 1.5rem;
  }

  .meta-badges {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .difficulty-badge,
  .time-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }

  .time-badge {
    background: #6b7280;
  }

  .challenge-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .challenge-tag {
    background: rgba(45, 80, 22, 0.1);
    color: var(--guide-primary);
    padding: 0.125rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .challenge-tag.more {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
    font-style: italic;
  }

  .card-footer {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    text-align: right;
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
    .playbooks-container {
      padding: 1rem 0.5rem;
    }

    .breadcrumb-container {
      padding: 0 1rem;
    }

    .playbooks-header {
      padding: 2rem 1.5rem;
      margin-bottom: 2rem;
    }

    .playbooks-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .title-icon {
      font-size: 1.8rem;
    }

    .playbooks-stats {
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

    .playbooks-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .playbook-card {
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

    .playbooks-title {
      font-size: 1.75rem;
    }

    .playbooks-stats {
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

    .meta-badges {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }
</style>
