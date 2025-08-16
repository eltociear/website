<!-- src/lib/components/ToolStackVisualizer.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';
  
  const dispatch = createEventDispatcher();
  
  export let toolStacks = {};
  export let tools = {};
  export let recommendedStack = null;
  
  let selectedStack = null;
  let activeView = 'overview'; // 'overview', 'detailed', 'comparison'
  let expandedTools = new Set();
  
  // Initialize with recommended stack if available
  $: {
    if (recommendedStack && !selectedStack) {
      selectedStack = recommendedStack;
    }
  }

  function selectStack(stack) {
    selectedStack = stack;
    activeView = 'detailed';
  }

  function handleToolClick(tool) {
    dispatch('toolSelected', tool);
  }

  // Helper function to render markdown content
  function renderStackMarkdown(stackContent) {
    if (!stackContent || !stackContent.default) {
      return null;
    }
    
    try {
      const component = stackContent.default;
      if (typeof component === 'function') {
        const result = component();
        if (result && result.render) {
          return result.render().html;
        }
      }
      return null;
    } catch (error) {
      console.error('Error rendering stack markdown:', error);
      return null;
    }
  }

  function toggleToolExpansion(toolId) {
    if (expandedTools.has(toolId)) {
      expandedTools.delete(toolId);
    } else {
      expandedTools.add(toolId);
    }
    expandedTools = new Set(expandedTools);
  }

  function getStackComplexityColor(complexity) {
    switch (complexity.toLowerCase()) {
      case 'basic': return '#16a34a';
      case 'medium': return '#ca8a04';
      case 'high': return '#dc2626';
      case 'advanced': return '#7c3aed';
      default: return '#64748b';
    }
  }

  function getToolFromId(toolId) {
    return tools[toolId] || {
      id: toolId,
      name: toolId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: 'Tool description not available',
      complexity: 'Medium',
      culturalAdaptation: 'Medium',
      tags: [],
      estimatedTime: 'Variable'
    };
  }

  function calculateStackStats(stack) {
    const stackTools = stack.tools.map(toolId => getToolFromId(toolId));
    
    const complexityMap = { 'basic': 1, 'medium': 2, 'high': 3, 'advanced': 4 };
    const avgComplexity = stackTools.reduce((sum, tool) => 
      sum + (complexityMap[tool.complexity.toLowerCase()] || 2), 0) / stackTools.length;
    
    const culturalMap = { 'low': 1, 'medium': 2, 'high': 3 };
    const avgCultural = stackTools.reduce((sum, tool) => 
      sum + (culturalMap[tool.culturalAdaptation.toLowerCase()] || 2), 0) / stackTools.length;
    
    return {
      toolCount: stackTools.length,
      avgComplexity: Math.round(avgComplexity),
      avgCultural: Math.round(avgCultural),
      allTags: [...new Set(stackTools.flatMap(tool => tool.tags || []))]
    };
  }

  function getStackStages(stack) {
    // Organize tools into logical implementation stages
    const stages = [
      {
        name: 'Foundation',
        tools: stack.tools.slice(0, Math.ceil(stack.tools.length / 3)),
        description: 'Essential setup and initial implementation'
      },
      {
        name: 'Development',
        tools: stack.tools.slice(Math.ceil(stack.tools.length / 3), Math.ceil(2 * stack.tools.length / 3)),
        description: 'Building capacity and expanding scope'
      },
      {
        name: 'Integration',
        tools: stack.tools.slice(Math.ceil(2 * stack.tools.length / 3)),
        description: 'Advanced features and full integration'
      }
    ].filter(stage => stage.tools.length > 0);
    
    return stages;
  }
</script>

<div class="stack-visualizer">
  
  <!-- Header -->
  <div class="visualizer-header">
    <div class="header-content">
      <h3 class="visualizer-title">
        {$t('stackVisualizer.title', 'Tool Stack Visualizer')}
      </h3>
      <p class="visualizer-subtitle">
        {$t('stackVisualizer.subtitle', 'Explore pre-configured tool combinations designed to work together effectively')}
      </p>
    </div>

    <!-- View Selector -->
    <div class="view-selector">
      <button 
        class="view-option"
        class:active={activeView === 'overview'}
        on:click={() => activeView = 'overview'}
      >
        {$t('stackVisualizer.overview', 'Overview')}
      </button>
      {#if selectedStack}
        <button 
          class="view-option"
          class:active={activeView === 'detailed'}
          on:click={() => activeView = 'detailed'}
        >
          {$t('stackVisualizer.detailed', 'Detailed View')}
        </button>
      {/if}
    </div>
  </div>

  <!-- Overview View -->
  {#if activeView === 'overview'}
    <div class="overview-section">
      
      {#if recommendedStack}
        <!-- Recommended Stack Highlight -->
        <div class="recommended-highlight">
          <div class="highlight-header">
            <h4>⭐ {$t('stackVisualizer.recommendedForYou', 'Recommended for You')}</h4>
            <p>{$t('stackVisualizer.basedOnAssessment', 'Based on your context assessment')}</p>
          </div>
          
          <div class="recommended-stack-card">
            <div class="stack-overview">
              <div class="stack-header">
                <h5 class="stack-name">{recommendedStack.name}</h5>
                <span 
                  class="complexity-indicator"
                  style="background-color: {getStackComplexityColor(recommendedStack.complexity)}"
                >
                  {$t(`stackVisualizer.complexity.${recommendedStack.complexity.toLowerCase()}`, recommendedStack.complexity)}
                </span>
              </div>
              
              <p class="stack-description">{recommendedStack.description}</p>
              
              <div class="stack-quick-stats">
                <span class="stat-item">
                  🔧 {recommendedStack.tools.length} {$t('stackVisualizer.tools', 'tools')}
                </span>
                <span class="stat-item">
                  ⏱️ {recommendedStack.timeframe}
                </span>
                <span class="stat-item">
                  💰 {recommendedStack.resources}
                </span>
              </div>
            </div>
            
            <button 
              class="select-recommended"
              on:click={() => selectStack(recommendedStack)}
            >
              {$t('stackVisualizer.exploreStack', 'Explore This Stack')} →
            </button>
          </div>
        </div>
      {/if}

      <!-- All Stacks Grid -->
      <div class="stacks-grid">
        {#each Object.values(toolStacks) as stack}
          {@const stats = calculateStackStats(stack)}
          
          <div 
            class="stack-card"
            class:recommended={stack.id === recommendedStack?.id}
            class:selected={stack.id === selectedStack?.id}
          >
            
            {#if stack.id === recommendedStack?.id}
              <div class="recommended-badge">⭐</div>
            {/if}

            <!-- Stack Header -->
            <div class="card-header">
              <h4 class="stack-title">{stack.name}</h4>
              <span 
                class="complexity-badge"
                style="background-color: {getStackComplexityColor(stack.complexity)}"
              >
                {$t(`stackVisualizer.complexity.${stack.complexity.toLowerCase()}`, stack.complexity)}
              </span>
            </div>

            <!-- Stack Description -->
            <p class="stack-description">{stack.description}</p>

            <!-- Stack Stats -->
            <div class="stack-stats">
              <div class="stat-row">
                <span class="stat-label">{$t('stackVisualizer.toolCount', 'Tools')}:</span>
                <span class="stat-value">{stats.toolCount}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">{$t('stackVisualizer.timeframe', 'Timeframe')}:</span>
                <span class="stat-value">{stack.timeframe}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">{$t('stackVisualizer.resources', 'Resources')}:</span>
                <span class="stat-value">{stack.resources}</span>
              </div>
            </div>

            <!-- Tool Preview -->
            <div class="tools-preview">
              <h5 class="preview-title">{$t('stackVisualizer.includedTools', 'Included Tools')}:</h5>
              <div class="tool-chips">
                {#each stack.tools.slice(0, 3) as toolId}
                  {@const tool = getToolFromId(toolId)}
                  <span class="tool-chip">{tool.name}</span>
                {/each}
                {#if stack.tools.length > 3}
                  <span class="tool-chip more">+{stack.tools.length - 3}</span>
                {/if}
              </div>
            </div>

            <!-- Card Actions -->
            <div class="card-actions">
              <button 
                class="explore-button"
                class:primary={stack.id === recommendedStack?.id}
                on:click={() => selectStack(stack)}
              >
                {$t('stackVisualizer.exploreStack', 'Explore Stack')}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Detailed View -->
  {#if activeView === 'detailed' && selectedStack}
    <div class="detailed-section">
      
      <!-- Stack Header -->
      <div class="detailed-header">
        <button class="back-button" on:click={() => activeView = 'overview'}>
          ← {$t('common.ui.back', 'Back')}
        </button>
        
        <div class="stack-info">
          <h4 class="stack-name">{selectedStack.name}</h4>
          <p class="stack-description">{selectedStack.description}</p>
          
          <!-- Render stack markdown content if available -->
          {#if selectedStack.content}
            {@const stackMarkdown = renderStackMarkdown(selectedStack.content)}
            {#if stackMarkdown}
              <div class="stack-markdown-content">
                {@html stackMarkdown}
              </div>
            {/if}
          {/if}
          
          <div class="stack-metadata">
            <div class="metadata-item">
              <span class="metadata-label">{$t('stackVisualizer.complexity', 'Complexity')}:</span>
              <span 
                class="metadata-value complexity"
                style="color: {getStackComplexityColor(selectedStack.complexity)}"
              >
                {$t(`stackVisualizer.complexity.${selectedStack.complexity.toLowerCase()}`, selectedStack.complexity)}
              </span>
            </div>
            <div class="metadata-item">
              <span class="metadata-label">{$t('stackVisualizer.timeframe', 'Timeframe')}:</span>
              <span class="metadata-value">{selectedStack.timeframe}</span>
            </div>
            <div class="metadata-item">
              <span class="metadata-label">{$t('stackVisualizer.resources', 'Resources')}:</span>
              <span class="metadata-value">{selectedStack.resources}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Implementation Stages -->
      <div class="implementation-stages">
        <h5 class="stages-title">{$t('stackVisualizer.implementationStages', 'Implementation Stages')}</h5>
        
        <div class="stages-timeline">
          {#each getStackStages(selectedStack) as stage, index}
            <div class="stage-item">
              <div class="stage-header">
                <div class="stage-number">{index + 1}</div>
                <div class="stage-info">
                  <h6 class="stage-name">{stage.name}</h6>
                  <p class="stage-description">{stage.description}</p>
                </div>
              </div>
              
              <div class="stage-tools">
                {#each stage.tools as toolId}
                  {@const tool = getToolFromId(toolId)}
                  
                  <div class="stage-tool">
                    <button 
                      class="tool-header"
                      class:expanded={expandedTools.has(toolId)}
                      on:click={() => toggleToolExpansion(toolId)}
                    >
                      <div class="tool-basic-info">
                        <h6 class="tool-name">{tool.name}</h6>
                        <div class="tool-badges">
                          <span 
                            class="complexity-mini"
                            style="background-color: {getStackComplexityColor(tool.complexity)}"
                          >
                            {tool.complexity}
                          </span>
                        </div>
                      </div>
                      <div class="expand-icon">
                        {expandedTools.has(toolId) ? '▼' : '▶'}
                      </div>
                    </button>
                    
                    {#if expandedTools.has(toolId)}
                      <div class="tool-details">
                        <p class="tool-description">{tool.description}</p>
                        
                        <div class="tool-meta">
                          <div class="meta-row">
                            <span class="meta-label">⏱️ {$t('stackVisualizer.estimatedTime', 'Time')}:</span>
                            <span class="meta-value">{tool.estimatedTime || 'Variable'}</span>
                          </div>
                          <div class="meta-row">
                            <span class="meta-label">🌍 {$t('stackVisualizer.culturalAdaptation', 'Cultural Adaptation')}:</span>
                            <span class="meta-value">{tool.culturalAdaptation}</span>
                          </div>
                        </div>
                        
                        {#if tool.tags && tool.tags.length > 0}
                          <div class="tool-tags">
                            {#each tool.tags as tag}
                              <span class="tag">{tag}</span>
                            {/each}
                          </div>
                        {/if}
                        
                        <div class="tool-actions">
                          <button class="tool-action primary" on:click={() => handleToolClick(tool)}>
                            {$t('stackVisualizer.learnMore', 'Learn More')}
                          </button>
                          <button class="tool-action secondary">
                            {$t('stackVisualizer.quickstart', 'Quick Start Guide')}
                          </button>
                        </div>
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
            
            {#if index < getStackStages(selectedStack).length - 1}
              <div class="stage-connector">⬇</div>
            {/if}
          {/each}
        </div>
      </div>

      <!-- Implementation Guidance -->
      <div class="implementation-guidance">
        <h5 class="guidance-title">{$t('stackVisualizer.implementationGuidance', 'Implementation Guidance')}</h5>
        
        <div class="guidance-cards">
          <div class="guidance-card">
            <div class="guidance-icon">📋</div>
            <h6>{$t('stackVisualizer.gettingStarted', 'Getting Started')}</h6>
            <p>{$t('stackVisualizer.gettingStartedDesc', 'Begin with the Foundation stage tools. Ensure community buy-in and establish basic governance structures before proceeding.')}</p>
          </div>
          
          <div class="guidance-card">
            <div class="guidance-icon">🤝</div>
            <h6>{$t('stackVisualizer.culturalIntegration', 'Cultural Integration')}</h6>
            <p>{$t('stackVisualizer.culturalIntegrationDesc', 'Adapt each tool to your community\'s cultural context. Consult with cultural leaders and traditional knowledge keepers.')}</p>
          </div>
          
          <div class="guidance-card">
            <div class="guidance-icon">📊</div>
            <h6>{$t('stackVisualizer.monitoringProgress', 'Monitoring Progress')}</h6>
            <p>{$t('stackVisualizer.monitoringProgressDesc', 'Use the built-in evaluation protocols to track implementation success and make adjustments as needed.')}</p>
          </div>
          
          <div class="guidance-card">
            <div class="guidance-icon">🔄</div>
            <h6>{$t('stackVisualizer.iterativeApproach', 'Iterative Approach')}</h6>
            <p>{$t('stackVisualizer.iterativeApproachDesc', 'Implement tools gradually, learn from each deployment, and adapt your approach based on community feedback.')}</p>
          </div>
        </div>
      </div>

      <!-- Stack Actions -->
      <div class="stack-actions">
        <button class="action-button primary">
          {$t('stackVisualizer.startImplementation', 'Start Implementation')} →
        </button>
        <button class="action-button secondary">
          {$t('stackVisualizer.downloadGuide', 'Download Implementation Guide')}
        </button>
        <button class="action-button tertiary">
          {$t('stackVisualizer.customizeStack', 'Customize This Stack')}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .stack-visualizer {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  /* Header */
  .visualizer-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .visualizer-subtitle {
    color: #64748b;
    font-size: 0.95rem;
    margin: 0;
    line-height: 1.5;
  }

  .view-selector {
    display: flex;
    background: #f1f5f9;
    border-radius: 0.5rem;
    padding: 0.25rem;
  }

  .view-option {
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    transition: all 0.2s ease;
  }

  .view-option.active {
    background: white;
    color: #1e293b;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Overview Section */
  .overview-section {
    padding: 1.5rem;
  }

  /* Recommended Highlight */
  .recommended-highlight {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 2px solid #f59e0b;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .highlight-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .highlight-header h4 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 0.5rem;
  }

  .highlight-header p {
    font-size: 0.95rem;
    color: #92400e;
    margin: 0;
  }

  .recommended-stack-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
  }

  .stack-overview {
    flex: 1;
  }

  .stack-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .stack-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .complexity-indicator {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
  }

  .stack-description {
    color: #374151;
    line-height: 1.5;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .stack-quick-stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .stat-item {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  .select-recommended {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .select-recommended:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }

  /* Stacks Grid */
  .stacks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .stack-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
  }

  .stack-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .stack-card.recommended {
    border-color: #f59e0b;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  }

  .stack-card.selected {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
  }

  .recommended-badge {
    position: absolute;
    top: -8px;
    right: 1rem;
    background: #f59e0b;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .stack-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .complexity-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
  }

  .stack-stats {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .stat-row:last-child {
    margin-bottom: 0;
  }

  .stat-label {
    color: #64748b;
    font-weight: 500;
  }

  .stat-value {
    color: #1e293b;
    font-weight: 600;
  }

  .tools-preview {
    margin: 1rem 0;
  }

  .preview-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .tool-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tool-chip {
    background: #f1f5f9;
    color: #475569;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid #e2e8f0;
  }

  .tool-chip.more {
    background: #e2e8f0;
    color: #64748b;
    font-style: italic;
  }

  .card-actions {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .explore-button {
    width: 100%;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    background: #f8fafc;
    color: #3b82f6;
    border-color: #e2e8f0;
  }

.explore-button:hover {
   background: #3b82f6;
   color: white;
   border-color: #3b82f6;
 }

 .explore-button.primary {
   background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
   color: white;
   border-color: #f59e0b;
 }

 .explore-button.primary:hover {
   transform: translateY(-1px);
   box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
 }

 /* Detailed Section */
 .detailed-section {
   padding: 1.5rem;
 }

 .detailed-header {
   margin-bottom: 2rem;
 }

 .back-button {
   background: none;
   border: none;
   color: #3b82f6;
   cursor: pointer;
   font-size: 0.875rem;
   font-weight: 500;
   margin-bottom: 1rem;
   transition: color 0.2s ease;
 }

 .back-button:hover {
   color: #1d4ed8;
 }

 .stack-info {
   margin-bottom: 1rem;
 }

 .stack-info .stack-name {
   font-size: 1.5rem;
   font-weight: 700;
   color: #1e293b;
   margin-bottom: 0.75rem;
 }

 .stack-info .stack-description {
   font-size: 1.125rem;
   color: #374151;
   line-height: 1.6;
   margin-bottom: 1.5rem;
 }

 .stack-markdown-content {
   margin: 1.5rem 0;
   padding: 1.5rem;
   background: #f8fafc;
   border-radius: 0.75rem;
   border: 1px solid #e2e8f0;
 }

 .stack-markdown-content :global(h1),
 .stack-markdown-content :global(h2),
 .stack-markdown-content :global(h3),
 .stack-markdown-content :global(h4) {
   color: #1e293b;
   margin-top: 1rem;
   margin-bottom: 0.75rem;
 }

 .stack-markdown-content :global(p) {
   color: #374151;
   line-height: 1.6;
   margin-bottom: 1rem;
 }

 .stack-markdown-content :global(ul),
 .stack-markdown-content :global(ol) {
   margin-bottom: 1rem;
   padding-left: 1.5rem;
 }

 .stack-markdown-content :global(li) {
   color: #374151;
   margin-bottom: 0.5rem;
   line-height: 1.5;
 }

 .stack-metadata {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
   gap: 1rem;
 }

 .metadata-item {
   display: flex;
   align-items: center;
   gap: 0.5rem;
   font-size: 0.875rem;
 }

 .metadata-label {
   color: #64748b;
   font-weight: 500;
 }

 .metadata-value {
   color: #1e293b;
   font-weight: 600;
 }

 .metadata-value.complexity {
   font-weight: 700;
 }

 /* Implementation Stages */
 .implementation-stages {
   margin-bottom: 2rem;
 }

 .stages-title {
   font-size: 1.25rem;
   font-weight: 600;
   color: #1e293b;
   margin-bottom: 1.5rem;
 }

 .stages-timeline {
   display: flex;
   flex-direction: column;
   gap: 1rem;
 }

 .stage-item {
   background: #f8fafc;
   border: 1px solid #e2e8f0;
   border-radius: 0.75rem;
   padding: 1.5rem;
 }

 .stage-header {
   display: flex;
   gap: 1rem;
   align-items: flex-start;
   margin-bottom: 1.5rem;
 }

 .stage-number {
   width: 40px;
   height: 40px;
   background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
   color: white;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   font-weight: 700;
   flex-shrink: 0;
 }

 .stage-info {
   flex: 1;
 }

 .stage-name {
   font-size: 1.125rem;
   font-weight: 600;
   color: #1e293b;
   margin-bottom: 0.5rem;
 }

 .stage-description {
   color: #64748b;
   margin: 0;
   line-height: 1.5;
 }

 .stage-tools {
   display: flex;
   flex-direction: column;
   gap: 0.75rem;
 }

 .stage-tool {
   background: white;
   border: 1px solid #e2e8f0;
   border-radius: 0.5rem;
   overflow: hidden;
 }

 .tool-header {
   width: 100%;
   background: none;
   border: none;
   padding: 1rem 1.5rem;
   cursor: pointer;
   display: flex;
   justify-content: space-between;
   align-items: center;
   transition: background-color 0.2s ease;
   text-align: left;
 }

 .tool-header:hover {
   background: #f8fafc;
 }

 .tool-header.expanded {
   background: #f0f9ff;
   border-bottom: 1px solid #e2e8f0;
 }

 .tool-basic-info {
   display: flex;
   align-items: center;
   gap: 1rem;
   flex: 1;
 }

 .tool-name {
   font-size: 1rem;
   font-weight: 600;
   color: #1e293b;
   margin: 0;
 }

 .tool-badges {
   display: flex;
   gap: 0.5rem;
 }

 .complexity-mini {
   padding: 0.25rem 0.5rem;
   border-radius: 0.75rem;
   font-size: 0.7rem;
   font-weight: 500;
   color: white;
 }

 .expand-icon {
   color: #64748b;
   font-size: 0.875rem;
   transition: transform 0.2s ease;
 }

 .tool-header.expanded .expand-icon {
   transform: rotate(90deg);
 }

 .tool-details {
   padding: 1rem 1.5rem 1.5rem 1.5rem;
   background: #f9fafb;
   border-top: 1px solid #e2e8f0;
 }

 .tool-description {
   color: #374151;
   line-height: 1.6;
   margin-bottom: 1rem;
 }

 .tool-meta {
   display: flex;
   flex-direction: column;
   gap: 0.5rem;
   margin-bottom: 1rem;
 }

 .meta-row {
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
   margin-bottom: 1rem;
 }

 .tag {
   background: #e0f2fe;
   color: #0369a1;
   padding: 0.25rem 0.75rem;
   border-radius: 1rem;
   font-size: 0.75rem;
   font-weight: 500;
 }

 .tool-actions {
   display: flex;
   gap: 0.75rem;
   flex-wrap: wrap;
 }

 .tool-action {
   padding: 0.5rem 1rem;
   border-radius: 0.375rem;
   font-size: 0.875rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s ease;
   border: none;
 }

 .tool-action.primary {
   background: #3b82f6;
   color: white;
 }

 .tool-action.primary:hover {
   background: #2563eb;
 }

 .tool-action.secondary {
   background: transparent;
   color: #3b82f6;
   border: 1px solid #e2e8f0;
 }

 .tool-action.secondary:hover {
   background: #f8fafc;
 }

 .stage-connector {
   text-align: center;
   font-size: 1.5rem;
   color: #94a3b8;
   margin: 0.5rem 0;
 }

 /* Implementation Guidance */
 .implementation-guidance {
   margin-bottom: 2rem;
 }

 .guidance-title {
   font-size: 1.25rem;
   font-weight: 600;
   color: #1e293b;
   margin-bottom: 1.5rem;
 }

 .guidance-cards {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
   gap: 1rem;
 }

 .guidance-card {
   background: #f8fafc;
   border: 1px solid #e2e8f0;
   border-radius: 0.75rem;
   padding: 1.5rem;
   text-align: center;
 }

 .guidance-icon {
   font-size: 2rem;
   margin-bottom: 1rem;
 }

 .guidance-card h6 {
   font-size: 1rem;
   font-weight: 600;
   color: #1e293b;
   margin-bottom: 0.75rem;
 }

 .guidance-card p {
   font-size: 0.875rem;
   color: #64748b;
   line-height: 1.5;
   margin: 0;
 }

 /* Stack Actions */
 .stack-actions {
   display: flex;
   gap: 1rem;
   justify-content: center;
   flex-wrap: wrap;
   padding-top: 2rem;
   border-top: 1px solid #e2e8f0;
 }

 .action-button {
   padding: 0.75rem 1.5rem;
   border-radius: 0.5rem;
   font-weight: 600;
   cursor: pointer;
   transition: all 0.2s ease;
   border: none;
   font-size: 0.95rem;
 }

 .action-button.primary {
   background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
   color: white;
 }

 .action-button.primary:hover {
   transform: translateY(-2px);
   box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
 }

 .action-button.secondary {
   background: #3b82f6;
   color: white;
 }

 .action-button.secondary:hover {
   background: #2563eb;
   transform: translateY(-1px);
 }

 .action-button.tertiary {
   background: transparent;
   color: #64748b;
   border: 2px solid #e2e8f0;
 }

 .action-button.tertiary:hover {
   background: #f8fafc;
   border-color: #cbd5e1;
 }

 /* Responsive Design */
 @media (max-width: 1024px) {
   .visualizer-header {
     flex-direction: column;
     align-items: stretch;
   }

   .recommended-stack-card {
     flex-direction: column;
     text-align: center;
   }

   .stacks-grid {
     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
   }

   .stack-metadata {
     grid-template-columns: 1fr;
   }

   .guidance-cards {
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
   }
 }

 @media (max-width: 768px) {
   .stack-visualizer {
     margin: 0 -1rem;
     border-radius: 0;
   }

   .visualizer-header,
   .overview-section,
   .detailed-section {
     padding: 1rem;
   }

   .recommended-highlight {
     padding: 1rem;
   }

   .stacks-grid {
     grid-template-columns: 1fr;
   }

   .stack-card {
     padding: 1rem;
   }

   .stage-header {
     flex-direction: column;
     align-items: center;
     text-align: center;
   }

   .tool-basic-info {
     flex-direction: column;
     align-items: flex-start;
     gap: 0.5rem;
   }

   .tool-actions {
     flex-direction: column;
   }

   .tool-action {
     width: 100%;
   }

   .guidance-cards {
     grid-template-columns: 1fr;
   }

   .stack-actions {
     flex-direction: column;
     align-items: center;
   }

   .action-button {
     width: 100%;
     max-width: 300px;
   }
 }

 @media (max-width: 480px) {
   .stack-info .stack-name {
     font-size: 1.25rem;
   }

   .stack-info .stack-description {
     font-size: 1rem;
   }

   .guidance-card {
     padding: 1rem;
   }

   .stage-item {
     padding: 1rem;
   }
 }

 /* Focus states for accessibility */
 .view-option:focus,
 .explore-button:focus,
 .tool-header:focus,
 .action-button:focus {
   outline: 3px solid rgba(59, 130, 246, 0.1);
   outline-offset: 2px;
 }

 /* Animation for card selection */
 @keyframes selectCard {
   0% { transform: scale(1); }
   50% { transform: scale(1.02); }
   100% { transform: scale(1); }
 }

 .stack-card.selected {
   animation: selectCard 0.3s ease-out;
 }

 /* Print styles */
 @media print {
   .visualizer-header,
   .stack-actions,
   .tool-actions {
     display: none;
   }
   
   .stack-card {
     break-inside: avoid;
     box-shadow: none;
     border: 1px solid #ccc;
   }
 }
</style>
