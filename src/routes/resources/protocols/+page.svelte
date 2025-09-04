<!-- src/routes/resources/protocols/+page.svelte -->
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
  let hoveredProtocol = null;
  let expandedProtocol = null;
  
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  // Protocol data from translations
  $: protocols = $t('resourcesProtocols.protocols') || {};
  $: categories = $t('resourcesProtocols.categories') || {};
  $: stats = $t('resourcesProtocols.stats') || {};
  $: principles = $t('resourcesProtocols.principles') || {};

  // Filter protocols based on selected criteria
  $: filteredProtocols = Object.entries(protocols).filter(([key, protocol]) => {
    const categoryMatch = selectedCategory === 'all' || protocol.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || protocol.status === selectedStatus;
    const searchMatch = searchQuery === '' || 
      protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && statusMatch && searchMatch;
  });

  // Get category icon
  function getCategoryIcon(category) {
    const icons = {
      cultural: '🌍',
      implementation: '🏗️',
      governance: '⚖️',
      justice: '🔄'
    };
    return icons[category] || '📋';
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

  // Get complexity color
  function getComplexityColor(complexity) {
    const colors = {
      'Beginner-friendly': '#10b981',
      'Intermediate': '#f59e0b',
      'High': '#ef4444',
      'Advanced': '#dc2626'
    };
    return colors[complexity] || '#6b7280';
  }

  // Handle protocol card hover
  function handleProtocolHover(protocolKey) {
    hoveredProtocol = protocolKey;
  }

  function handleProtocolLeave() {
    hoveredProtocol = null;
  }

  // Toggle protocol expansion
  function toggleProtocol(protocolKey) {
    expandedProtocol = expandedProtocol === protocolKey ? null : protocolKey;
  }

  // Clear all filters
  function clearFilters() {
    selectedCategory = 'all';
    selectedStatus = 'all';
    searchQuery = '';
  }

  // Track navigation
  function trackNavigation(protocol, action) {
    console.log(`Protocol interaction: ${protocol} - ${action}`);
  }

  function downloadProtocolPDF(protocolKey, protocol) {
    const currentLocale = $locale || 'en';
    const availableLocales = ['en', 'sv'];
    const targetLocale = availableLocales.includes(currentLocale) ? currentLocale : 'en';
    
    // Map protocol keys to their actual PDF filenames
    const protocolFilenames = {
      'culturalTranslation': 'cultural-translation-protocol',
      'fpic2': 'fpic-2-protocol',
      'consensusBuilding': 'regenerative-consensus-protocol',
      'powerAnalysis': 'power-dynamics-assessment-protocol'
    };
    
    // Get the actual filename, fallback to the key if not mapped
    const baseFilename = protocolFilenames[protocolKey] || protocolKey;
    
    // Try different URL patterns
    const possibleUrls = [
      `${base}/downloads/${targetLocale}/${baseFilename}.pdf`,
      `${base}/downloads/${baseFilename}-${targetLocale}.pdf`,
      `${base}/downloads/en/${baseFilename}.pdf`,
      `${base}/downloads/${baseFilename}-en.pdf`,
      `${base}/downloads/${baseFilename}.pdf`
    ];
    
    tryDownloadUrls(possibleUrls, 0, baseFilename, targetLocale);
  }

  async function tryDownloadUrls(urls, index, filename, requestedLocale) {
    if (index >= urls.length) {
      console.error(`Could not find PDF for ${filename} in any format`);
      return;
    }
    
    const url = urls[index];
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        const downloadFilename = url.split('/').pop();
        downloadFile(url, downloadFilename);
        
        if (!url.includes(requestedLocale) && requestedLocale !== 'en') {
          console.log(`PDF not available in ${getLanguageName(requestedLocale)}, downloaded English version`);
        }
        return;
      }
    } catch (error) {
      // URL doesn't exist, try next one
    }
    
    // Try next URL
    tryDownloadUrls(urls, index + 1, filename, requestedLocale);
  }

  async function checkFileExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  function downloadFile(url, filename) {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  }

  function getLanguageName(locale) {
    const languageNames = {
      'en': 'English',
      'sv': 'Svenska'
    };
    return languageNames[locale] || locale;
  }
</script>

<svelte:head>
  <title>{$t('resourcesProtocols.meta.title')}</title>
  <meta name="description" content="{$t('resourcesProtocols.meta.description')}" />
  <meta property="og:title" content="{$t('resourcesProtocols.meta.title')}" />
  <meta property="og:description" content="{$t('resourcesProtocols.meta.description')}" />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="protocols-page" class:visible={isVisible}>
  
  <!-- Breadcrumb -->
  <div class="breadcrumb-nav">
    <a href="/resources" class="breadcrumb-link">
      <span class="breadcrumb-text">{$t('resourcesProtocols.navigation.backToResources')}</span>
    </a>
  </div>

  <!-- Hero Section -->
  <section class="protocols-hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">{$t('resourcesProtocols.hero.title')}</h1>
        <p class="hero-subtitle">{$t('resourcesProtocols.hero.subtitle')}</p>
        <p class="hero-description">{$t('resourcesProtocols.hero.description')}</p>
      </div>
    </div>
  </section>

  <!-- Principles Section -->
  {#if principles?.list}
    <section class="principles-section">
      <div class="container">
        <h2 class="principles-title">{principles.title}</h2>
        <p class="principles-description">{principles.description}</p>
        
        <div class="principles-grid">
          {#each principles.list as principle}
            <div class="principle-card">
              <h3 class="principle-name">{principle.name}</h3>
              <p class="principle-description">{principle.description}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- Filters Section -->
  <section class="filters-section">
    <div class="container">
      <div class="filters-container">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="{$t('resourcesProtocols.filters.search')}"
            bind:value={searchQuery}
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select bind:value={selectedCategory} class="filter-select">
            <option value="all">{$t('resourcesProtocols.filters.allCategories')}</option>
            {#each Object.entries(categories) as [key, label]}
              <option value={key}>{label}</option>
            {/each}
          </select>
          
          <select bind:value={selectedStatus} class="filter-select">
            <option value="all">{$t('resourcesProtocols.filters.allStatuses')}</option>
            <option value="available">{stats.available}</option>
            <option value="inDevelopment">{stats.inDevelopment}</option>
          </select>
          
          {#if selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery !== ''}
            <button on:click={clearFilters} class="clear-filters-btn">
              {$t('resourcesProtocols.filters.clearFilters')}
            </button>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Protocols Grid -->
  <section class="protocols-section">
    <div class="container">
      {#if filteredProtocols.length > 0}
        <div class="protocols-grid">
          {#each filteredProtocols as [protocolKey, protocol] (protocolKey)}
            <div 
              class="protocol-card"
              class:hovered={hoveredProtocol === protocolKey}
              class:expanded={expandedProtocol === protocolKey}
              on:mouseenter={() => handleProtocolHover(protocolKey)}
              on:mouseleave={handleProtocolLeave}
            >
              <div class="protocol-header">
                <div class="protocol-category">
                  <span class="category-icon">{getCategoryIcon(protocol.category)}</span>
                  <span class="category-label">{categories[protocol.category]}</span>
                </div>
                <div class="protocol-status" style="background-color: {getStatusColor(protocol.status)};">
                  {protocol.status === 'available' ? stats.available : stats.inDevelopment}
                </div>
              </div>

              <div class="protocol-content">
                <h2 class="protocol-title">{protocol.title}</h2>
                <p class="protocol-subtitle">{protocol.subtitle}</p>
                <p class="protocol-description">{protocol.description}</p>

                <div class="protocol-meta">
                  {#if protocol.complexity}
                    <div class="meta-item">
                      <span class="meta-icon">📊</span>
                      <span class="complexity-badge" style="color: {getComplexityColor(protocol.complexity)};">
                        {protocol.complexity}
                      </span>
                    </div>
                  {/if}
                  {#if protocol.phases?.length}
                    <div class="meta-item">
                      <span class="meta-icon">🔄</span>
                      <span>{protocol.phases.length} Phases</span>
                    </div>
                  {/if}
                </div>

                <div class="protocol-use-case">
                  <strong>{protocol.useCase}</strong>
                </div>

                {#if expandedProtocol === protocolKey}
                  <div class="protocol-details">
                    {#if protocol.phases?.length}
                      <div class="phases-section">
                        <h4>Implementation Phases:</h4>
                        <div class="phases-list">
                          {#each protocol.phases as phase, index}
                            <div class="phase-item">
                              <div class="phase-header">
                                <span class="phase-number">{index + 1}</span>
                                <div class="phase-info">
                                  <h5 class="phase-name">{phase.name}</h5>
                                  <span class="phase-duration">{phase.duration}</span>
                                </div>
                              </div>
                              <p class="phase-description">{phase.description}</p>
                            </div>
                          {/each}
                        </div>
                      </div>
                    {/if}

                    {#if protocol.principles?.length}
                      <div class="principles-section-detail">
                        <h4>Core Principles:</h4>
                        <ul class="principles-list">
                          {#each protocol.principles as principle}
                            <li>{principle}</li>
                          {/each}
                        </ul>
                      </div>
                    {/if}

                    {#if protocol.safeguards?.length}
                      <div class="safeguards-section">
                        <h4>Key Safeguards:</h4>
                        <ul class="safeguards-list">
                          {#each protocol.safeguards as safeguard}
                            <li>{safeguard}</li>
                          {/each}
                        </ul>
                      </div>
                    {/if}

                    {#if protocol.prerequisites?.length}
                      <div class="prerequisites-section">
                        <h4>Prerequisites:</h4>
                        <ul class="prerequisites-list">
                          {#each protocol.prerequisites as prerequisite}
                            <li>{prerequisite}</li>
                          {/each}
                        </ul>
                      </div>
                    {/if}
                  </div>
                {/if}

                <button 
                  class="expand-button"
                  on:click={() => toggleProtocol(protocolKey)}
                >
                  {expandedProtocol === protocolKey ? 'Show Less' : 'Show Details'}
                  <span class="expand-arrow" class:rotated={expandedProtocol === protocolKey}>▼</span>
                </button>
              </div>

              <div class="protocol-actions">
                {#if protocol.status === 'available'}
                  {#if protocol.links?.fullProtocol}
                    <a 
                      href={protocol.links.fullProtocol} 
                      class="protocol-button primary"
                      on:click={() => trackNavigation(protocolKey, 'fullProtocol')}
                    >
                      {$t('resourcesProtocols.navigation.readFullGuide')}
                    </a>
                  {/if}
                  {#if protocol.links?.pdf}
                    <button 
                      class="protocol-button secondary"
                      on:click={() => {
                        downloadProtocolPDF(protocolKey, protocol);
                        trackNavigation(protocolKey, 'pdf');
                      }}
                    >
                      {$t('resourcesProtocols.navigation.downloadProtocol')}
                    </button>
                  {/if}
                  {#if protocol.links?.examples}
                    <a 
                      href={protocol.links.examples} 
                      class="protocol-button tertiary"
                      on:click={() => trackNavigation(protocolKey, 'examples')}
                    >
                      {$t('resourcesProtocols.navigation.viewExamples')}
                    </a>
                  {/if}
                {:else}
                  {#if protocol.expectedRelease}
                    <div class="expected-release">
                      Expected: {protocol.expectedRelease}
                    </div>
                  {/if}
                  {#if protocol.links?.earlyAccess}
                    <a 
                      href={protocol.links.earlyAccess} 
                      class="protocol-button secondary"
                      on:click={() => trackNavigation(protocolKey, 'earlyAccess')}
                    >
                      {$t('resourcesProtocols.navigation.requestEarlyAccess')}
                    </a>
                  {/if}
                  {#if protocol.links?.earlyDraft}
                    <a 
                      href={protocol.links.earlyDraft} 
                      class="protocol-button tertiary"
                      on:click={() => trackNavigation(protocolKey, 'earlyDraft')}
                    >
                      Early Draft
                    </a>
                  {/if}
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-results">
          <h3>No protocols found</h3>
          <p>Try adjusting your filters or search terms.</p>
          <button on:click={clearFilters} class="clear-filters-btn">
            Clear all filters
          </button>
        </div>
      {/if}
    </div>
  </section>

  <!-- 
  {#if $t('resourcesProtocols.implementation')}
    <section class="implementation-section">
      <div class="container">
        <div class="implementation-content">
          <h2 class="implementation-title">{$t('resourcesProtocols.implementation.title')}</h2>
          <p class="implementation-description">{$t('resourcesProtocols.implementation.description')}</p>
          
          <div class="support-grid">
            {#each $t('resourcesProtocols.implementation.support') as supportItem}
              <div class="support-item">
                <h3 class="support-type">{supportItem.type}</h3>
                <p class="support-description">{supportItem.description}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>
  {/if} Implementation Support Section -->

  <!-- Get Involved Section -->
  <section class="get-involved-section">
    <div class="container">
      <div class="get-involved-content">
        <h2 class="get-involved-title">{$t('resourcesProtocols.getInvolved.title')}</h2>
        <p class="get-involved-description">{$t('resourcesProtocols.getInvolved.description')}</p>
        
        <div class="get-involved-actions">
          <a href="/contact" class="get-involved-button primary">
            {$t('resourcesProtocols.getInvolved.pilot')}
          </a>
          <a href="/contact" class="get-involved-button secondary">
            {$t('resourcesProtocols.getInvolved.feedback')}
          </a>
          <a href="/get-involved" class="get-involved-button tertiary">
            {$t('resourcesProtocols.getInvolved.contribute')}
          </a>
        </div>
      </div>
    </div>
  </section>

</div>

<style>
  /* Base styles */
  .protocols-page {
    min-height: 100vh;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .protocols-page.visible {
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
  .protocols-hero {
    padding: 4rem 0 2rem 0;
    background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
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

  /* Principles Section */
  .principles-section {
    padding: 4rem 0;
    background: white;
  }

  .principles-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
    text-align: center;
  }

  .principles-description {
    font-size: 1.1rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 3rem;
    text-align: center;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .principle-card {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #059669;
  }

  .principle-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }

  .principle-description {
    color: #475569;
    line-height: 1.5;
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
    border-color: #059669;
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
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
    border-color: #059669;
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

  /* Protocols Section */
  .protocols-section {
    padding: 3rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .protocols-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 2rem;
  }

  .protocol-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .protocol-card:hover,
  .protocol-card.hovered {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: #059669;
  }

  .protocol-card.expanded {
    transform: none;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .protocol-header {
    padding: 1.5rem 1.5rem 0 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .protocol-category {
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

  .protocol-status {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .protocol-content {
    padding: 1.5rem;
    flex: 1;
  }

  .protocol-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .protocol-subtitle {
    font-size: 1rem;
    color: #059669;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .protocol-description {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .protocol-meta {
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

  .complexity-badge {
    font-weight: 600;
  }

  .protocol-use-case {
    background: rgba(5, 150, 105, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid #059669;
    font-size: 0.9rem;
    color: #374151;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .expand-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 1rem;
  }

  .expand-button:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .expand-arrow {
    transition: transform 0.2s;
  }

  .expand-arrow.rotated {
    transform: rotate(180deg);
  }

  .protocol-details {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
  }

  .protocol-details h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  .phases-section {
    margin-bottom: 2rem;
  }

  .phases-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .phase-item {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border-left: 4px solid #059669;
  }

  .phase-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .phase-number {
    width: 2rem;
    height: 2rem;
    background: #059669;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.875rem;
  }

  .phase-info {
    flex: 1;
  }

  .phase-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .phase-duration {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .phase-description {
    color: #475569;
    line-height: 1.5;
    margin: 0;
  }

  .principles-section-detail,
  .safeguards-section,
  .prerequisites-section {
    margin-bottom: 1.5rem;
  }

  .principles-list,
  .safeguards-list,
  .prerequisites-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .principles-list li,
  .safeguards-list li,
  .prerequisites-list li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: #475569;
    line-height: 1.5;
  }

  .principles-list li::before {
    content: "◆";
    position: absolute;
    left: 0;
    color: #059669;
    font-weight: bold;
  }

  .safeguards-list li::before {
    content: "🛡️";
    position: absolute;
    left: 0;
  }

  .prerequisites-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #f59e0b;
    font-weight: bold;
  }

  .protocol-actions {
    padding: 1.5rem;
    border-top: 1px solid #f1f5f9;
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .protocol-button {
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
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  .protocol-button:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .protocol-button.primary {
    background: #059669;
    color: white;
  }

  .protocol-button.primary:hover {
    background: #047857;
    transform: translateY(-1px);
  }

  .protocol-button.secondary {
    background: #f59e0b;
    color: white;
  }

  .protocol-button.secondary:hover {
    background: #d97706;
    transform: translateY(-1px);
  }

  .protocol-button.tertiary {
    background: transparent;
    color: #059669;
    border: 2px solid #059669;
  }

  .protocol-button.tertiary:hover {
    background: #059669;
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

  /* Implementation Support Section */
  .implementation-section {
    padding: 4rem 0;
    background: white;
    border-top: 1px solid #e2e8f0;
  }

  .implementation-content {
    text-align: center;
  }

  .implementation-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  .implementation-description {
    font-size: 1.1rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .support-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .support-item {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    text-align: left;
  }

  .support-type {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }

  .support-description {
    color: #475569;
    line-height: 1.5;
  }

  /* Get Involved Section */
  .get-involved-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
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
    color: #059669;
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

    .protocols-grid {
      grid-template-columns: 1fr;
    }

    .principles-grid {
      grid-template-columns: 1fr;
    }

    .protocol-actions {
      flex-direction: column;
    }

    .protocol-button {
      width: 100%;
    }

    .support-grid {
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

    .protocol-card {
      margin: 0 auto;
      max-width: 100%;
    }

    .phase-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .phase-number {
      align-self: flex-start;
    }
  }
</style>
