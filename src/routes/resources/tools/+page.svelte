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

  // Hardcoded Radical Competence tools (always available)
  const radicalCompetenceTools = {
    riggedBoard: {
      id: 'rigged-board',
      title: 'Rigged Board Diagnostic',
      subtitle: 'Strategic Power Mapping',
      description: 'Map power structures, money flows, extraction patterns, and leverage points in your city. Complete in one weekend, use Monday morning.',
      category: 'templates',
      status: 'available',
      features: [
        '8 comprehensive worksheets for strategic mapping',
        'Power holders and money flow analysis',
        'Extraction index calculators',
        'Crisis point severity scoring',
        'Ally mapping and leverage point identification'
      ],
      timeToComplete: '3 hours',
      difficulty: 'Intermediate',
      useCase: 'For organizers starting new campaigns or diagnosing why existing efforts aren\'t working',
      links: {
        interactive: `${base}/resources/tools/radical-competence`,
        guide: `${base}/resources/tools/radical-competence#how-to-use`
      }
    },
    integrationScorecard: {
      id: 'integration-scorecard',
      title: 'Integration Scorecard',
      subtitle: 'Six-Domain Assessment',
      description: 'Evaluate organizing interventions across biological, cognitive, emotional, behavioral, social, and spiritual/existential domains to prevent common failures.',
      category: 'templates',
      status: 'available',
      features: [
        'Six-domain integration analysis',
        'Prevents activist performance and hero organizer patterns',
        'Diagnoses extractive solidarity',
        'Before-launch and during-work assessments',
        'Strategic planning capacity evaluation'
      ],
      timeToComplete: '1 hour per assessment',
      difficulty: 'Intermediate',
      useCase: 'For evaluating proposed campaigns, diagnosing existing work, or assessing organizational capacity',
      links: {
        interactive: `${base}/resources/tools/radical-competence`,
        template: `${base}/resources/tools/radical-competence/integration-scorecard-template.html`
      }
    }
  };

  // Tool data from translations + hardcoded Radical Competence tools
  $: translatedTools = $t('resourcesTools.tools') || {};
  $: allTools = { ...radicalCompetenceTools, ...translatedTools };
  $: categories = $t('resourcesTools.categories') || {};
  $: stats = $t('resourcesTools.stats') || {};

  // Filter tools based on selected criteria
  $: filteredTools = Object.entries(allTools).filter(([key, tool]) => {
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
  <title>Strategic Tools for Organizers - Global Governance Frameworks</title>
  <meta name="description" content="Comprehensive collection of strategic tools for community organizing, policy advocacy, and systemic change. Templates, frameworks, and interactive tools for effective action." />
  <meta property="og:title" content="Strategic Tools for Organizers - Global Governance Frameworks" />
  <meta property="og:description" content="Comprehensive collection of strategic tools for community organizing, policy advocacy, and systemic change." />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="tools-page" class:visible={isVisible}>
  
  <!-- Breadcrumb -->
  <div class="breadcrumb-nav">
    <a href="{base}/resources" class="breadcrumb-link">
      <span class="breadcrumb-text">← Back to Resources</span>
    </a>
  </div>

  <!-- Hero Section -->
  <section class="tools-hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">Strategic Tools for Organizers</h1>
        <p class="hero-subtitle">Templates, frameworks, and diagnostics for effective organizing</p>
        <p class="hero-description">
          Practical tools for mapping power structures, evaluating interventions, and building 
          campaigns that actually work. From "Radical Competence" and the Global Governance Frameworks project.
        </p>
      </div>
      
      <div class="hero-stats">
        <div class="stat-card">
          <div class="stat-number">{Object.keys(allTools).length}</div>
          <div class="stat-label">Total Tools</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{Object.values(allTools).filter(t => t.status === 'available').length}</div>
          <div class="stat-label">Available Now</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{Object.values(allTools).filter(t => t.status === 'inDevelopment').length}</div>
          <div class="stat-label">In Development</div>
        </div>
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
            placeholder="Search tools..."
            bind:value={searchQuery}
            class="search-input"
          />
        </div>
        
        <div class="filter-controls">
          <select bind:value={selectedCategory} class="filter-select">
            <option value="all">All Categories</option>
            <option value="templates">Templates</option>
            <option value="interactive">Interactive Tools</option>
            <option value="frameworks">Frameworks</option>
          </select>
          
          <select bind:value={selectedStatus} class="filter-select">
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="inDevelopment">In Development</option>
            <option value="planned">Planned</option>
          </select>
          
          {#if selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery !== ''}
            <button on:click={clearFilters} class="clear-filters-btn">
              Clear Filters
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
                  <span class="category-label">
                    {tool.category === 'templates' ? 'Templates' : 
                     tool.category === 'interactive' ? 'Interactive' : 
                     tool.category === 'frameworks' ? 'Frameworks' : 'Tools'}
                  </span>
                </div>
                <div class="tool-status" style="background-color: {getStatusColor(tool.status)};">
                  {tool.status === 'available' ? 'Available' : 
                   tool.status === 'inDevelopment' ? 'In Development' : 'Planned'}
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

                {#if tool.useCase}
                  <div class="tool-use-case">
                    <strong>Use Case:</strong> {tool.useCase}
                  </div>
                {/if}
              </div>

              <div class="tool-actions">
                {#if tool.status === 'available'}
                  {#if tool.links?.interactive}
                    <a 
                      href={tool.links.interactive} 
                      class="tool-button primary"
                      on:click={() => trackNavigation(toolKey, 'interactive')}
                    >
                      View Tool
                    </a>
                  {/if}
                  {#if tool.links?.template}
                    <a 
                      href={tool.links.template} 
                      class="tool-button secondary"
                      target="_blank"
                      on:click={() => trackNavigation(toolKey, 'template')}
                    >
                      Download Template
                    </a>
                  {/if}
                  {#if tool.links?.guide}
                    <a 
                      href={tool.links.guide} 
                      class="tool-button tertiary"
                      on:click={() => trackNavigation(toolKey, 'guide')}
                    >
                      Read Guide
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
                      Request Early Access
                    </a>
                  {/if}
                  {#if tool.links?.whitepaper}
                    <a 
                      href={tool.links.whitepaper} 
                      class="tool-button tertiary"
                      on:click={() => trackNavigation(toolKey, 'whitepaper')}
                    >
                      Read Whitepaper
                    </a>
                  {/if}
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No tools found</h3>
          <p>Try adjusting your filters or search query</p>
          <button on:click={clearFilters} class="clear-filters-btn">
            Clear All Filters
          </button>
        </div>
      {/if}
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="container">
      <div class="cta-box">
        <h2 class="cta-title">Need a specific tool?</h2>
        <p class="cta-description">
          These tools are developed based on real organizing needs. If you're working on systemic change 
          and need a tool that doesn't exist yet, let us know.
        </p>
        <a href="{base}/contact" class="cta-button">
          Suggest a Tool
        </a>
      </div>
    </div>
  </section>
</div>

<style>
  /* Base Styles */
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

  /* Breadcrumb */
  .breadcrumb-nav {
    padding: 1.5rem 0;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 1rem;
  }

  .breadcrumb-link {
    color: #7c3aed;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }

  .breadcrumb-link:hover {
    color: #6d28d9;
  }

  /* Hero Section */
  .tools-hero {
    padding: 3rem 0 4rem 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #7c3aed 100%);
    color: white;
  }

  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .hero-content {
    text-align: center;
    margin-bottom: 3rem;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    opacity: 0.95;
  }

  .hero-description {
    font-size: 1.1rem;
    max-width: 800px;
    margin: 0 auto;
    opacity: 0.9;
    line-height: 1.6;
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
  }

  .stat-number {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 1rem;
    opacity: 0.9;
  }

  /* Filters Section */
  .filters-section {
    padding: 2rem 0;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .filters-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-container {
    flex: 1;
    min-width: 250px;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #7c3aed;
  }

  .filter-controls {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .filter-select {
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    background: white;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .filter-select:focus {
    outline: none;
    border-color: #7c3aed;
  }

  .clear-filters-btn {
    padding: 0.75rem 1.5rem;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .clear-filters-btn:hover {
    background: #6d28d9;
  }

  /* Tools Section */
  .tools-section {
    padding: 4rem 0;
    min-height: 400px;
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .tool-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .tool-card:hover,
  .tool-card.hovered {
    border-color: #7c3aed;
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.15);
    transform: translateY(-4px);
  }

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .tool-category {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-icon {
    font-size: 1.5rem;
  }

  .category-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tool-status {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tool-content {
    flex: 1;
    margin-bottom: 1.5rem;
  }

  .tool-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .tool-subtitle {
    font-size: 1rem;
    color: #7c3aed;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .tool-description {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .tool-features {
    margin: 1rem 0;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
  }

  .tool-features h4 {
    font-size: 0.875rem;
    font-weight: 700;
    color: #475569;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tool-features ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .tool-features li {
    padding: 0.25rem 0;
    color: #64748b;
    font-size: 0.9rem;
  }

  .tool-features li::before {
    content: "✓ ";
    color: #10b981;
    font-weight: 700;
    margin-right: 0.5rem;
  }

  .tool-meta {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    font-size: 0.9rem;
  }

  .meta-icon {
    font-size: 1.2rem;
  }

  .tool-use-case {
    margin-top: 1rem;
    padding: 1rem;
    background: #fef3c7;
    border-left: 4px solid #fbbf24;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    color: #78350f;
  }

  .tool-use-case strong {
    color: #92400e;
  }

  .tool-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .tool-button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    transition: all 0.2s;
    border: 2px solid transparent;
  }

  .tool-button.primary {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
  }

  .tool-button.primary:hover {
    background: linear-gradient(135deg, #6d28d9, #5b21b6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  .tool-button.secondary {
    background: white;
    color: #7c3aed;
    border-color: #7c3aed;
  }

  .tool-button.secondary:hover {
    background: #f3e8ff;
  }

  .tool-button.tertiary {
    background: #f8fafc;
    color: #475569;
  }

  .tool-button.tertiary:hover {
    background: #e2e8f0;
  }

  .expected-release {
    padding: 0.75rem;
    background: #fef3c7;
    border-radius: 0.5rem;
    color: #78350f;
    font-size: 0.9rem;
    text-align: center;
    font-weight: 600;
  }

  /* No Results */
  .no-results {
    text-align: center;
    padding: 4rem 2rem;
  }

  .no-results-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .no-results h3 {
    font-size: 1.5rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .no-results p {
    color: #64748b;
    margin-bottom: 2rem;
  }

  /* CTA Section */
  .cta-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #1e1b4b, #7c3aed);
  }

  .cta-box {
    text-align: center;
    color: white;
  }

  .cta-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  .cta-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.95;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-button {
    display: inline-block;
    padding: 1rem 2rem;
    background: white;
    color: #7c3aed;
    border-radius: 0.75rem;
    font-weight: 700;
    font-size: 1.1rem;
    text-decoration: none;
    transition: all 0.2s;
  }

  .cta-button:hover {
    background: #f3e8ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.2rem;
    }

    .hero-stats {
      grid-template-columns: 1fr;
    }

    .filters-container {
      flex-direction: column;
    }

    .search-container {
      width: 100%;
    }

    .filter-controls {
      width: 100%;
      flex-direction: column;
    }

    .filter-select,
    .clear-filters-btn {
      width: 100%;
    }

    .tools-grid {
      grid-template-columns: 1fr;
    }

    .cta-title {
      font-size: 1.75rem;
    }

    .cta-description {
      font-size: 1rem;
    }
  }
</style>
