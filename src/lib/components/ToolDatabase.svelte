<!-- src/lib/components/ToolDatabase.svelte -->
<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';
  
  const dispatch = createEventDispatcher();
  
  export let tools = {};
  export let selectedJourney = null;
  export let searchQuery = '';
  export let selectedFilters = {};
  
  let filteredTools = [];
  let activeView = 'grid'; // 'grid' or 'list'
  let sortBy = 'name'; // 'name', 'complexity', 'cultural-adaptation'
  let showFilters = false;
  
  // Filter options
  const filterOptions = {
    journey: [
      { value: 'getting-started', label: 'Getting Started' },
      { value: 'crisis-response', label: 'Crisis Response' },
      { value: 'building-capacity', label: 'Building Capacity' },
      { value: 'deepening-practice', label: 'Deepening Practice' },
      { value: 'evolution-transition', label: 'Evolution & Transition' }
    ],
    complexity: [
      { value: 'basic', label: 'Basic' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'advanced', label: 'Advanced' }
    ],
    culturalAdaptation: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' }
    ],
    tags: [
      { value: 'governance', label: 'Governance' },
      { value: 'councils', label: 'Councils' },
      { value: 'cultural-protocols', label: 'Cultural Protocols' },
      { value: 'crisis', label: 'Crisis' },
      { value: 'emergency', label: 'Emergency' },
      { value: 'participation', label: 'Participation' },
      { value: 'democracy', label: 'Democracy' },
      { value: 'decision-making', label: 'Decision Making' },
      { value: 'indigenous', label: 'Indigenous' },
      { value: 'technology', label: 'Technology' }
    ]
  };

  // Initialize filters
  onMount(() => {
    selectedFilters = {
      journey: [],
      complexity: [],
      culturalAdaptation: [],
      tags: []
    };
    updateFilteredTools();
  });

  // Reactive updates
  $: {
    updateFilteredTools();
  }

  function updateFilteredTools() {
    let filtered = Object.values(tools);
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply journey filter (including selected journey)
    if (selectedJourney) {
      filtered = filtered.filter(tool => tool.journey === selectedJourney.id);
    } else if (selectedFilters.journey?.length > 0) {
      filtered = filtered.filter(tool => 
        selectedFilters.journey.includes(tool.journey)
      );
    }
    
    // Apply complexity filter
    if (selectedFilters.complexity?.length > 0) {
      filtered = filtered.filter(tool => 
        selectedFilters.complexity.includes(tool.complexity.toLowerCase())
      );
    }
    
    // Apply cultural adaptation filter
    if (selectedFilters.culturalAdaptation?.length > 0) {
      filtered = filtered.filter(tool => 
        selectedFilters.culturalAdaptation.includes(tool.culturalAdaptation.toLowerCase())
      );
    }
    
    // Apply tags filter
    if (selectedFilters.tags?.length > 0) {
      filtered = filtered.filter(tool => 
        tool.tags.some(tag => selectedFilters.tags.includes(tag))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'complexity':
          const complexityOrder = { 'basic': 0, 'medium': 1, 'high': 2, 'advanced': 3 };
          return (complexityOrder[a.complexity.toLowerCase()] || 999) - 
                 (complexityOrder[b.complexity.toLowerCase()] || 999);
        case 'cultural-adaptation':
          const adaptationOrder = { 'low': 0, 'medium': 1, 'high': 2 };
          return (adaptationOrder[a.culturalAdaptation.toLowerCase()] || 999) - 
                 (adaptationOrder[b.culturalAdaptation.toLowerCase()] || 999);
        default:
          return 0;
      }
    });
    
    filteredTools = filtered;
  }

  function toggleFilter(category, value) {
    if (!selectedFilters[category]) {
      selectedFilters[category] = [];
    }
    
    const index = selectedFilters[category].indexOf(value);
    if (index > -1) {
      selectedFilters[category].splice(index, 1);
    } else {
      selectedFilters[category].push(value);
    }
    
    selectedFilters = { ...selectedFilters };
  }

  function clearAllFilters() {
    selectedFilters = {
      journey: [],
      complexity: [],
      culturalAdaptation: [],
      tags: []
    };
    searchQuery = '';
  }

  function getComplexityColor(complexity) {
    switch (complexity.toLowerCase()) {
      case 'basic': return '#16a34a';
      case 'medium': return '#ca8a04';
      case 'high': return '#dc2626';
      case 'advanced': return '#7c3aed';
      default: return '#64748b';
    }
  }

  function getCulturalAdaptationColor(adaptation) {
    switch (adaptation.toLowerCase()) {
      case 'low': return '#64748b';
      case 'medium': return '#ca8a04';
      case 'high': return '#16a34a';
      default: return '#64748b';
    }
  }

  function formatEstimatedTime(time) {
    return time || 'Variable';
  }

  function getActiveFilterCount() {
    return Object.values(selectedFilters).reduce((count, filterArray) => 
      count + (filterArray?.length || 0), 0
    );
  }

  function handleToolClick(tool) {
    dispatch('toolSelected', tool);
  }
</script>

<div class="tool-database">
  
  <!-- Header Controls -->
  <div class="database-header">
    <div class="header-left">
      <h3 class="database-title">
        {$t('toolDatabase.title', 'Tool Database')}
        <span class="tool-count">({filteredTools.length} {$t('toolDatabase.tools', 'tools')})</span>
      </h3>
      
      {#if selectedJourney}
        <div class="journey-context">
          <span class="context-label">{$t('toolDatabase.showingFor', 'Showing tools for:')}</span>
          <span class="context-value">{$t(selectedJourney.titleKey, selectedJourney.title)}</span>
          <button 
            class="clear-context" 
            on:click={() => selectedJourney = null}
            title="{$t('toolDatabase.showAllTools', 'Show all tools')}"
          >
            ✕
          </button>
        </div>
      {/if}
    </div>

    <div class="header-controls">
      <!-- Search -->
      <div class="search-container">
        <input 
          type="text" 
          placeholder="{$t('toolDatabase.searchPlaceholder', 'Search tools...')}"
          bind:value={searchQuery}
          class="search-input"
        />
        <div class="search-icon">🔍</div>
      </div>

      <!-- View Toggle -->
      <div class="view-toggle">
        <button 
          class="view-button"
          class:active={activeView === 'grid'}
          on:click={() => activeView = 'grid'}
          title="{$t('toolDatabase.gridView', 'Grid View')}"
        >
          ⊞
        </button>
        <button 
          class="view-button"
          class:active={activeView === 'list'}
          on:click={() => activeView = 'list'}
          title="{$t('toolDatabase.listView', 'List View')}"
        >
          ☰
        </button>
      </div>

      <!-- Sort -->
      <select bind:value={sortBy} class="sort-select">
        <option value="name">{$t('toolDatabase.sortByName', 'Sort by Name')}</option>
        <option value="complexity">{$t('toolDatabase.sortByComplexity', 'Sort by Complexity')}</option>
        <option value="cultural-adaptation">{$t('toolDatabase.sortByCultural', 'Sort by Cultural Adaptation')}</option>
      </select>

      <!-- Filter Toggle -->
      <button 
        class="filter-toggle"
        class:active={showFilters}
        on:click={() => showFilters = !showFilters}
      >
        🔽 {$t('toolDatabase.filters', 'Filters')}
        {#if getActiveFilterCount() > 0}
          <span class="filter-count">{getActiveFilterCount()}</span>
        {/if}
      </button>
    </div>
  </div>

  <!-- Filter Panel -->
  {#if showFilters}
    <div class="filter-panel">
      <div class="filter-header">
        <h4>{$t('toolDatabase.filterTools', 'Filter Tools')}</h4>
        <button class="clear-filters" on:click={clearAllFilters}>
          {$t('toolDatabase.clearAll', 'Clear All')}
        </button>
      </div>

      <div class="filter-sections">
        
        <!-- Journey Filter -->
        {#if !selectedJourney}
          <div class="filter-section">
            <h5 class="filter-title">{$t('toolDatabase.filterByJourney', 'Journey')}</h5>
            <div class="filter-options">
              {#each filterOptions.journey as option}
                <label class="filter-option">
                  <input 
                    type="checkbox" 
                    checked={selectedFilters.journey?.includes(option.value)}
                    on:change={() => toggleFilter('journey', option.value)}
                  />
                  <span class="option-label">{$t(`journeys.${option.value}.title`, option.label)}</span>
                </label>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Complexity Filter -->
        <div class="filter-section">
          <h5 class="filter-title">{$t('toolDatabase.filterByComplexity', 'Complexity')}</h5>
          <div class="filter-options">
            {#each filterOptions.complexity as option}
              <label class="filter-option">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.complexity?.includes(option.value)}
                  on:change={() => toggleFilter('complexity', option.value)}
                />
                <span class="option-label" style="color: {getComplexityColor(option.value)}">
                  {$t(`toolDatabase.complexity.${option.value}`, option.label)}
                </span>
              </label>
            {/each}
          </div>
        </div>

        <!-- Cultural Adaptation Filter -->
        <div class="filter-section">
          <h5 class="filter-title">{$t('toolDatabase.filterByCultural', 'Cultural Adaptation')}</h5>
          <div class="filter-options">
            {#each filterOptions.culturalAdaptation as option}
              <label class="filter-option">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.culturalAdaptation?.includes(option.value)}
                  on:change={() => toggleFilter('culturalAdaptation', option.value)}
                />
                <span class="option-label" style="color: {getCulturalAdaptationColor(option.value)}">
                  {$t(`toolDatabase.culturalAdaptation.${option.value}`, option.label)}
                </span>
              </label>
            {/each}
          </div>
        </div>

        <!-- Tags Filter -->
        <div class="filter-section">
          <h5 class="filter-title">{$t('toolDatabase.filterByTags', 'Tags')}</h5>
          <div class="filter-options tag-options">
            {#each filterOptions.tags as option}
              <label class="filter-option tag-option">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.tags?.includes(option.value)}
                  on:change={() => toggleFilter('tags', option.value)}
                />
                <span class="tag-label">{$t(`toolDatabase.tags.${option.value}`, option.label)}</span>
              </label>
            {/each}
          </div>
        </div>

      </div>
    </div>
  {/if}

  <!-- Tools Display -->
  <div class="tools-container">
    {#if filteredTools.length === 0}
      <!-- Empty State -->
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h4>{$t('toolDatabase.noToolsFound', 'No tools found')}</h4>
        <p>{$t('toolDatabase.noToolsDescription', 'Try adjusting your search terms or filters to find relevant tools.')}</p>
        <button class="clear-search" on:click={clearAllFilters}>
          {$t('toolDatabase.clearFilters', 'Clear Filters')}
        </button>
      </div>
    {:else}
      <!-- Tools Grid/List -->
      <div class="tools-display" class:grid-view={activeView === 'grid'} class:list-view={activeView === 'list'}>
        {#each filteredTools as tool}
          <div class="tool-card" class:list-item={activeView === 'list'}>
            
            <!-- Tool Header -->
            <div class="tool-header">
              <h4 class="tool-name">{tool.name}</h4>
              <div class="tool-badges">
                <span 
                  class="complexity-badge" 
                  style="background-color: {getComplexityColor(tool.complexity)}"
                >
                  {$t(`toolDatabase.complexity.${tool.complexity.toLowerCase()}`, tool.complexity)}
                </span>
                <span 
                  class="cultural-badge"
                  style="background-color: {getCulturalAdaptationColor(tool.culturalAdaptation)}"
                >
                  {$t(`toolDatabase.culturalAdaptation.${tool.culturalAdaptation.toLowerCase()}`, tool.culturalAdaptation)} Cultural
                </span>
              </div>
            </div>

            <!-- Tool Content -->
            <div class="tool-content">
              <p class="tool-description">{tool.description}</p>
              
              <div class="tool-meta">
                <div class="meta-item">
                  <span class="meta-label">⏱️ {$t('toolDatabase.estimatedTime', 'Time')}:</span>
                  <span class="meta-value">{formatEstimatedTime(tool.estimatedTime)}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">🗺️ {$t('toolDatabase.journey', 'Journey')}:</span>
                  <span class="meta-value">{$t(`journeys.${tool.journey}.title`, tool.journey)}</span>
                </div>
              </div>

              <!-- Tags -->
              {#if tool.tags && tool.tags.length > 0}
                <div class="tool-tags">
                  {#each tool.tags.slice(0, 3) as tag}
                    <span class="tag">{$t(`toolDatabase.tags.${tag}`, tag)}</span>
                  {/each}
                  {#if tool.tags.length > 3}
                    <span class="tag more-tags">+{tool.tags.length - 3}</span>
                  {/if}
                </div>
              {/if}
            </div>

            <!-- Tool Actions -->
            <div class="tool-actions">
              <button class="tool-action primary" on:click={() => handleToolClick(tool)}>
                {$t('toolDatabase.learnMore', 'Learn More')} →
              </button>
              <button class="tool-action secondary">
                {$t('toolDatabase.addToStack', 'Add to Stack')}
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  /* ... All the existing styles remain the same ... */
  .tool-database {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  /* Database Header */
  .database-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .database-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tool-count {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 400;
  }

  .journey-context {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  .context-label {
    color: #1e40af;
    font-weight: 500;
  }

  .context-value {
    color: #1e293b;
    font-weight: 600;
  }

  .clear-context {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
  }

  .clear-context:hover {
    background: rgba(100, 116, 139, 0.1);
    color: #374151;
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* Search */
  .search-container {
    position: relative;
    min-width: 200px;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .search-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }

  /* View Toggle */
  .view-toggle {
    display: flex;
    background: #f1f5f9;
    border-radius: 0.375rem;
    padding: 0.25rem;
  }

  .view-button {
    padding: 0.5rem;
    background: none;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s ease;
    font-size: 1rem;
  }

  .view-button.active {
    background: white;
    color: #1e293b;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Sort Select */
  .sort-select {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .sort-select:focus {
    outline: none;
    border-color: #3b82f6;
  }

  /* Filter Toggle */
  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
  }

  .filter-toggle:hover {
    background: #f1f5f9;
  }

  .filter-toggle.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .filter-count {
    background: #dc2626;
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
  }

  /* Filter Panel */
  .filter-panel {
    border-bottom: 1px solid #e2e8f0;
    background: #f9fafb;
    padding: 1.5rem;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .filter-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .clear-filters {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: underline;
  }

  .clear-filters:hover {
    color: #1d4ed8;
  }

  .filter-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .filter-section {
    background: white;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .filter-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    margin-top: 0;
  }

  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .filter-option input[type="checkbox"] {
    margin: 0;
    cursor: pointer;
  }

  .option-label {
    color: #374151;
    cursor: pointer;
  }

  .tag-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
  }

  .tag-option {
    display: flex !important;
    align-items: center;
    gap: 0.25rem;
  }

  .tag-label {
    font-size: 0.8rem;
    color: #374151;
    cursor: pointer;
  }

  /* Tools Container */
  .tools-container {
    padding: 1.5rem;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state h4 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .clear-search {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .clear-search:hover {
    background: #2563eb;
  }

  /* Tools Display */
  .tools-display.grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .tools-display.list-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Tool Card */
  .tool-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tool-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }

  .tool-card.list-item {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 1.5rem;
  }

  .tool-card.list-item .tool-content {
    flex: 1;
  }

  .tool-card.list-item .tool-actions {
    flex-shrink: 0;
    flex-direction: row;
    gap: 0.75rem;
  }

  /* Tool Header */
  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .tool-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    line-height: 1.3;
  }

  .tool-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .complexity-badge, .cultural-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
    white-space: nowrap;
  }

  /* Tool Content */
  .tool-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tool-description {
    color: #374151;
    line-height: 1.6;
    margin: 0;
    font-size: 0.95rem;
  }

  .tool-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .meta-label {
    color: #64748b;
    font-weight: 500;
  }

  .meta-value {
    color: #1e293b;
    font-weight: 500;
  }

  .tool-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background: #f1f5f9;
    color: #475569;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid #e2e8f0;
  }

  .more-tags {
    background: #e2e8f0;
    color: #64748b;
    font-style: italic;
  }

  /* Tool Actions */
  .tool-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .tool-action {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    text-align: center;
  }

  .tool-action.primary {
    background: #3b82f6;
    color: white;
  }

  .tool-action.primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

.tool-action.secondary {
   background: transparent;
   color: #3b82f6;
   border: 1px solid #e2e8f0;
 }

 .tool-action.secondary:hover {
   background: #f8fafc;
   border-color: #cbd5e1;
 }

 /* Responsive Design */
 @media (max-width: 1024px) {
   .database-header {
     flex-direction: column;
     align-items: stretch;
   }

   .header-controls {
     justify-content: space-between;
   }

   .filter-sections {
     grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
   }

   .tools-display.grid-view {
     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
     gap: 1rem;
   }
 }

 @media (max-width: 768px) {
   .tool-database {
     margin: 0 -1rem;
     border-radius: 0;
   }

   .database-header {
     padding: 1rem;
   }

   .header-controls {
     flex-direction: column;
     align-items: stretch;
     gap: 0.75rem;
   }

   .search-container {
     min-width: auto;
   }

   .filter-sections {
     grid-template-columns: 1fr;
   }

   .tools-display.grid-view {
     grid-template-columns: 1fr;
   }

   .tool-card.list-item {
     flex-direction: column;
     align-items: stretch;
   }

   .tool-card.list-item .tool-actions {
     flex-direction: column;
   }

   .tool-header {
     flex-direction: column;
     align-items: stretch;
   }

   .tool-badges {
     justify-content: flex-start;
   }
 }

 @media (max-width: 480px) {
   .database-header {
     padding: 0.75rem;
   }

   .filter-panel {
     padding: 1rem;
   }

   .tools-container {
     padding: 1rem;
   }

   .tool-card {
     padding: 1rem;
   }

   .tool-name {
     font-size: 1rem;
   }

   .tool-badges {
     flex-direction: column;
     align-items: flex-start;
   }

   .tag-options {
     grid-template-columns: 1fr;
   }
 }

 /* Focus states for accessibility */
 .search-input:focus,
 .sort-select:focus,
 .filter-toggle:focus,
 .tool-action:focus {
   outline: 3px solid rgba(59, 130, 246, 0.1);
   outline-offset: 2px;
 }

 /* Print styles */
 @media print {
   .database-header,
   .filter-panel,
   .tool-actions {
     display: none;
   }
   
   .tool-card {
     break-inside: avoid;
     box-shadow: none;
     border: 1px solid #ccc;
   }
 }
</style>
