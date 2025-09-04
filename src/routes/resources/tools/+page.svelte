<!-- src/routes/resources/tools/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';

  // Animation and filter states
  let isVisible = false;
  let selectedCategory = 'all';
  let selectedStatus = 'all';
  let searchQuery = '';
  let hoveredTool = null;
  
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  // Tool data from translations
  $: tools = $t('resourcesTools.tools') || {};
  $: categories = $t('resourcesTools.categories') || {};
  $: stats = $t('resourcesTools.stats') || {};

  // Filter tools based on selected criteria
  $: filteredTools = Object.entries(tools).filter(([key, tool]) => {
    const categoryMatch = selectedCategory === 'all' || tool.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || tool.status === selectedStatus;
    const searchMatch = searchQuery === '' || 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && statusMatch && searchMatch;
  });

  // Get category icon
  function getCategoryIcon(category) {
    const icons = {
      interactive: '🧭',
      templates: '📋',
      frameworks: '🏗️',
      comingSoon: '🚀'
    };
    return icons[category] || '🛠️';
  }

  // Get status badge color
  function getStatusColor(status) {
    const colors = {
      available: '#10b981',
      inDevelopment: '#f59e0b',
      planned: '#6366f1'
    };
    return colors[status] || '#6b7280';
  }

  // Handle tool card hover
  function handleToolHover(toolKey) {
    hoveredTool = toolKey;
  }

  function handleToolLeave() {
    hoveredTool = null;
  }

  // Clear all filters
  function clearFilters() {
    selectedCategory = 'all';
    selectedStatus = 'all';
    searchQuery = '';
  }

  // Track navigation
  function trackNavigation(tool, action) {
    console.log(`Tool interaction: ${tool} - ${action}`);
  }
</script>

<svelte:head>
  <title>{$t('resourcesTools.meta.title')}</title>
  <meta name="description" content="{$t('resourcesTools.meta.description')}" />
  <meta property="og:title" content="{$t('resourcesTools.meta.title')}" />
  <meta property="og:description" content="{$t('resourcesTools.meta.description')}" />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="tools-page" class:visible={isVisible}>
  
  <!-- Breadcrumb -->
  <div class="breadcrumb-nav">
    <a href="/resources" class="breadcrumb-link">
      <span class="breadcrumb-text">{$t('resourcesTools.navigation.backToResources')}</span>
    </a>
  </div>

  <!-- Hero Section -->
  <section class="tools-hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">{$t('resourcesTools.hero.title')}</h1>
        <p class="hero-subtitle">{$t('resourcesTools.hero.subtitle')}</p>
        <p class="hero-description">{$t('resourcesTools.hero.description')}</p>
      </div>
    </div>
  </section>

  <!-- Filters Section -->
  <section class="filters-section">
    <div class="container">
      <div class="filters-container">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="{$t('resourcesTools.filters.search')}"
            bind:value={searchQuery}
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select bind:value={selectedCategory} class="filter-select">
            <option value="all">{$t('resourcesTools.filters.allCategories')}</option>
            {#each Object.entries(categories) as [key, label]}
              <option value={key}>{label}</option>
            {/each}
          </select>
          
          <select bind:value={selectedStatus} class="filter-select">
            <option value="all">{$t('resourcesTools.filters.allStatuses')}</option>
            <option value="available">{stats.available}</option>
            <option value="inDevelopment">{stats.inDevelopment}</option>
          </select>
          
          {#if selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery !== ''}
            <button on:click={clearFilters} class="clear-filters-btn">
              {$t('resourcesTools.filters.clearFilters')}
            </button>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Tools Grid -->
  <section class="tools-section">
    <div class="container">
      {#if filteredTools.length > 0}
        <div class="tools-grid">
          {#each filteredTools as [toolKey, tool] (toolKey)}
            <div 
              class="tool-card"
              class:hovered={hoveredTool === toolKey}
              on:mouseenter={() => handleToolHover(toolKey)}
              on:mouseleave={handleToolLeave}
            >
              <div class="tool-header">
                <div class="tool-category">
                  <span class="category-icon">{getCategoryIcon(tool.category)}</span>
                  <span class="category-label">{categories[tool.category]}</span>
                </div>
                <div class="tool-status" style="background-color: {getStatusColor(tool.status)};">
                  {tool.status === 'available' ? stats.available : stats.inDevelopment}
                </div>
              </div>

              <div class="tool-content">
                <h2 class="tool-title">{tool.title}</h2>
                <p class="tool-subtitle">{tool.subtitle}</p>
                <p class="tool-description">{tool.description}</p>

                {#if tool.features}
                  <div class="tool-features">
                    <h4>Key Features:</h4>
                    <ul>
                      {#each tool.features as feature}
                        <li>{feature}</li>
                      {/each}
                    </ul>
                  </div>
                {/if}

                <div class="tool-meta">
                  {#if tool.timeToComplete}
                    <div class="meta-item">
                      <span class="meta-icon">⏱️</span>
                      <span>{tool.timeToComplete}</span>
                    </div>
                  {/if}
                  {#if tool.difficulty}
                    <div class="meta-item">
                      <span class="meta-icon">📊</span>
                      <span>{tool.difficulty}</span>
                    </div>
                  {/if}
                </div>

                <div class="tool-use-case">
                  <strong>{tool.useCase}</strong>
                </div>
              </div>

              <div class="tool-actions">
                {#if tool.status === 'available'}
                  {#if tool.links?.interactive}
                    <a 
                      href={tool.links.interactive} 
                      class="tool-button primary"
                      on:click={() => trackNavigation(toolKey, 'interactive')}
                    >
                      {$t('resourcesTools.navigation.useInteractive')}
                    </a>
                  {/if}
                  {#if tool.links?.template}
                    <a 
                      href={tool.links.template} 
                      class="tool-button secondary"
                      on:click={() => trackNavigation(toolKey, 'template')}
                    >
                      {$t('resourcesTools.navigation.downloadTemplate')}
                    </a>
                  {/if}
                  {#if tool.links?.guide}
                    <a 
                      href={tool.links.guide} 
                      class="tool-button tertiary"
                      on:click={() => trackNavigation(toolKey, 'guide')}
                    >
                      {$t('resourcesTools.navigation.readGuide')}
                    </a>
                  {/if}
                {:else}
                  {#if tool.expectedRelease}
                    <div class="expected-release">
                      Expected: {tool.expectedRelease}
                    </div>
                  {/if}
                  {#if tool.links?.earlyAccess}
                    <a 
                      href={tool.links.earlyAccess} 
                      class="tool-button secondary"
                      on:click={() => trackNavigation(toolKey, 'earlyAccess')}
                    >
                      {$t('resourcesTools.navigation.requestEarlyAccess')}
                    </a>
                  {/if}
                  {#if tool.links?.whitepaper}
                    <a 
                      href={tool.links.whitepaper} 
                      class="tool-button tertiary"
                      on:click={() => trackNavigation(toolKey, 'whitepaper')}
                    >
                      {$t('resourcesTools.navigation.readGuide')}
                    </a>
                  {/if}
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-results">
          <h3>No tools found</h3>
          <p>Try adjusting your filters or search terms.</p>
          <button on:click={clearFilters} class="clear-filters-btn">
            Clear all filters
          </button>
        </div>
      {/if}
    </div>
  </section>

  <!-- Coming Soon Section -->
  {#if $t('resourcesTools.comingSoon')}
    <section class="coming-soon-section">
      <div class="container">
        <div class="coming-soon-content">
          <h2 class="coming-soon-title">{$t('resourcesTools.comingSoon.title')}</h2>
          <p class="coming-soon-description">{$t('resourcesTools.comingSoon.description')}</p>
          
          <div class="coming-soon-grid">
            {#each $t('resourcesTools.comingSoon.items') as item}
              <div class="coming-soon-item">
                <h3 class="item-name">{item.name}</h3>
                <p class="item-description">{item.description}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Get Involved Section -->
  <section class="get-involved-section">
    <div class="container">
      <div class="get-involved-content">
        <h2 class="get-involved-title">{$t('resourcesTools.getInvolved.title')}</h2>
        <p class="get-involved-description">{$t('resourcesTools.getInvolved.description')}</p>
        
        <div class="get-involved-actions">
          <a href="/contact" class="get-involved-button primary">
            {$t('resourcesTools.getInvolved.feedback')}
          </a>
          <a href="/get-involved" class="get-involved-button secondary">
            {$t('resourcesTools.getInvolved.contribute')}
          </a>
          <a href="/contact" class="get-involved-button tertiary">
            {$t('resourcesTools.getInvolved.pilot')}
          </a>
        </div>
      </div>
    </div>
  </section>

</div>

<style>
  /* Base styles */
  .tools-page {
    min-height: 100vh;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .tools-page.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .hero-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Breadcrumb */
  .breadcrumb-nav {
    padding: 1rem 0;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 1rem;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
  }

  .breadcrumb-link:hover {
    color: #4f46e5;
    transform: translateX(-2px);
  }

  /* Hero Section */
  .tools-hero {
    padding: 4rem 0 2rem 0;
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%);
    color: white;
    text-align: center;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    color: #cbd5e1;
    margin-bottom: 1.5rem;
    font-weight: 300;
  }

  .hero-description {
    font-size: 1.1rem;
    color: #e2e8f0;
    line-height: 1.6;
    margin: 0 auto;
    max-width: 700px;
  }

  /* Filters Section */
  .filters-section {
    padding: 2rem 0;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .filters-container {
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-container {
    flex: 1;
    min-width: 300px;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .filter-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .filter-select {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    background: white;
    font-size: 0.9rem;
    min-width: 150px;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .filter-select:focus {
    outline: none;
    border-color: #6366f1;
  }

  .clear-filters-btn {
    padding: 0.75rem 1.5rem;
    background: #f59e0b;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .clear-filters-btn:hover {
    background: #d97706;
    transform: translateY(-1px);
  }

  /* Tools Section */
  .tools-section {
    padding: 3rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }

  .tool-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .tool-card:hover,
  .tool-card.hovered {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: #6366f1;
  }

  .tool-header {
    padding: 1.5rem 1.5rem 0 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .tool-category {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-icon {
    font-size: 1.25rem;
  }

  .category-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tool-status {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tool-content {
    padding: 1.5rem;
    flex: 1;
  }

  .tool-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .tool-subtitle {
    font-size: 1rem;
    color: #6366f1;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .tool-description {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .tool-features {
    margin-bottom: 1.5rem;
  }

  .tool-features h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .tool-features ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .tool-features li {
    padding: 0.25rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .tool-features li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #10b981;
    font-weight: bold;
  }

  .tool-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .meta-icon {
    font-size: 1rem;
  }

  .tool-use-case {
    background: rgba(99, 102, 241, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid #6366f1;
    font-size: 0.9rem;
    color: #374151;
    line-height: 1.5;
  }

  .tool-actions {
    padding: 1.5rem;
    border-top: 1px solid #f1f5f9;
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .tool-button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    text-align: center;
  }

  .tool-button.primary {
    background: #6366f1;
    color: white;
  }

  .tool-button.primary:hover {
    background: #5b5bd6;
    transform: translateY(-1px);
  }

  .tool-button.secondary {
    background: #f59e0b;
    color: white;
  }

  .tool-button.secondary:hover {
    background: #d97706;
    transform: translateY(-1px);
  }

  .tool-button.tertiary {
    background: transparent;
    color: #6366f1;
    border: 2px solid #6366f1;
  }

  .tool-button.tertiary:hover {
    background: #6366f1;
    color: white;
    transform: translateY(-1px);
  }

  .expected-release {
    padding: 0.5rem 1rem;
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1rem;
  }

  /* No Results */
  .no-results {
    text-align: center;
    padding: 4rem 2rem;
  }

  .no-results h3 {
    font-size: 1.5rem;
    color: #374151;
    margin-bottom: 1rem;
  }

  .no-results p {
    color: #6b7280;
    margin-bottom: 2rem;
  }

  /* Coming Soon Section */
  .coming-soon-section {
    padding: 4rem 0;
    background: white;
    border-top: 1px solid #e2e8f0;
  }

  .coming-soon-content {
    text-align: center;
  }

  .coming-soon-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  .coming-soon-description {
    font-size: 1.1rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .coming-soon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .coming-soon-item {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    text-align: left;
  }

  .item-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }

  .item-description {
    color: #475569;
    line-height: 1.5;
  }

  /* Get Involved Section */
  .get-involved-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
  }

  .get-involved-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .get-involved-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .get-involved-description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .get-involved-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .get-involved-button {
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.2s;
    min-width: 160px;
    text-align: center;
  }

  .get-involved-button.primary {
    background: #fbbf24;
    color: #1e40af;
  }

  .get-involved-button.primary:hover {
    background: #f59e0b;
    transform: translateY(-2px);
  }

  .get-involved-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .get-involved-button.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .get-involved-button.tertiary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid transparent;
  }

  .get-involved-button.tertiary:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .filters-container {
      flex-direction: column;
      align-items: stretch;
    }

    .search-container {
      min-width: auto;
    }

    .filter-controls {
      justify-content: center;
    }

    .tools-grid {
      grid-template-columns: 1fr;
    }

    .tool-actions {
      flex-direction: column;
    }

    .tool-button {
      width: 100%;
    }

    .coming-soon-grid {
      grid-template-columns: 1fr;
    }

    .get-involved-actions {
      flex-direction: column;
      align-items: center;
    }

    .get-involved-button {
      width: 100%;
      max-width: 250px;
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: 2rem;
    }

    .tool-card {
      margin: 0 auto;
      max-width: 100%;
    }

    .meta-item {
      font-size: 0.8rem;
    }
  }
</style>
