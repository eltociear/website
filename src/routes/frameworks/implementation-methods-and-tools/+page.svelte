<!-- Enhanced +page.svelte that fixes component placement and markdown processing -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { t, translations } from '$lib/i18n';
  import { base } from '$app/paths';
  import ContextAssessmentRubric from '$lib/components/ContextAssessmentRubric.svelte';
  import ToolDatabase from '$lib/components/ToolDatabase.svelte';
  import JourneySelector from '$lib/components/JourneySelector.svelte';
  import ToolStackVisualizer from '$lib/components/ToolStackVisualizer.svelte';
  import ToolDetailModal from '$lib/components/ToolDetailModal.svelte';
  
  // Get page data including loaded markdown content
  export let data;
  
  // Extract content and metadata from data
  $: ({ content, tools, toolStacks, debug } = data);
  
  // Debug logging to see what we're getting
  $: if (mounted) {
    console.log('Data extracted:', { content: !!content, tools: !!tools, toolStacks: !!toolStacks });
    console.log('Tools data:', tools);
    console.log('ToolStacks data:', toolStacks);
  }
  
  // Get translation namespaces - with fallbacks to prevent empty text
  $: implementationT = $translations?.implementationTools || {};
  $: assessmentT = $translations?.assessment || {};
  $: journeysT = $translations?.journeys || {};
  $: toolDatabaseT = $translations?.toolDatabase || {};
  $: stackVisualizerT = $translations?.stackVisualizer || {};
  $: commonT = $translations?.common || {};
  
  // Page state
  let currentSection = 'overview';
  let mounted = false;
  
  // Interactive component state
  let assessmentResults = {};
  let isAssessmentComplete = false;
  let recommendedStack = null;
  let selectedJourney = null;
  let selectedTool = null;
  let isToolModalOpen = false;
  let searchQuery = '';
  let selectedFilters = [];

  // Define sections with proper integration points
  const sections = [
    { id: 'overview', name: 'Overview', icon: '🏠' },
    { id: 'assessment', name: 'Assessment', icon: '🎯' },
    { id: 'journeys', name: 'Journeys', icon: '🗺️' },
    { id: 'tools', name: 'Tools', icon: '🔧' },
    { id: 'stacks', name: 'Tool Stacks', icon: '📦' },
    { id: 'guidance', name: 'Guidance', icon: '📚' },
    { id: 'appendices', name: 'Resources', icon: '📄' }
  ];

  // Enhanced displayMarkdownContent function with link support
  function displayMarkdownContent(markdownData) {
    if (!markdownData || !markdownData.rawMarkdown) {
      return '<p>Content not available</p>';
    }
    
    let markdown = markdownData.rawMarkdown;
    
    // Remove YAML frontmatter (between --- delimiters)
    markdown = markdown.replace(/^---[\s\S]*?---\n*/m, '');
    
    // Process markdown features in order to avoid conflicts
    
    // 1. Code blocks first (preserve content)
    markdown = markdown.replace(/```([^`]*?)```/gs, '<pre><code>$1</code></pre>');
    
    // 2. Inline code
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 3. FIXED: Process links with better internal/external detection
    // Handle internal anchor links (stay on same page)
    markdown = markdown.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, '<a href="#$2" data-internal="true">$1</a>');
    
    // Handle relative internal links (same site)
    markdown = markdown.replace(/\[([^\]]+)\]\(\/([^)]+)\)/g, '<a href="/$2" data-internal="true">$1</a>');
    
    // Handle external links (open in new window)
    markdown = markdown.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Handle bare URLs
    markdown = markdown.replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // 4. Images
    markdown = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" style="max-width: 100%; height: auto;" />');
    
    // 5. Headers (process from h6 to h1 to avoid conflicts)
    markdown = markdown.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
    markdown = markdown.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
    markdown = markdown.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
    markdown = markdown.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    markdown = markdown.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
    
    // 6. Bold and italic text
    markdown = markdown.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 7. Strikethrough
    markdown = markdown.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // 8. Blockquotes
    markdown = markdown.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');
    
    // 9. Horizontal rules
    markdown = markdown.replace(/^---+$/gm, '<hr>');
    markdown = markdown.replace(/^\*\*\*+$/gm, '<hr>');
    
    // 10. Lists - improved processing
    markdown = markdown.replace(/^\*\s+(.*)$/gm, '<li>$1</li>');
    markdown = markdown.replace(/^-\s+(.*)$/gm, '<li>$1</li>');
    markdown = markdown.replace(/^\d+\.\s+(.*)$/gm, '<oli>$1</oli>');
    
    // 11. Paragraphs - wrap non-block content
    const paragraphs = markdown.split(/\n\s*\n/);
    markdown = paragraphs
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => {
        // Don't wrap if it's already a block element
        if (p.match(/^<(h[1-6]|blockquote|pre|hr|div|ul|ol|li)/)) {
          return p;
        }
        return `<p>${p}</p>`;
      })
      .join('\n');
    
    // 12. Wrap list items in proper containers
    markdown = markdown.replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/gs, '<ul>$1</ul>');
    markdown = markdown.replace(/<oli>/g, '<li>');
    markdown = markdown.replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/gs, (match) => {
      if (markdown.includes('<oli>')) return `<ol>${match}</ol>`;
      return match;
    });
    
    // Clean up
    markdown = markdown.replace(/<p>(<h[1-6][^>]*>.*?<\/h[1-6]>)<\/p>/g, '$1');
    markdown = markdown.replace(/\n+/g, '\n');
    
    return markdown;
  }
  
  // Helper function for implementation tools translations
  function implT(key, fallback = '') {
    if (!implementationT || typeof implementationT !== 'object') {
      console.warn('implementationT not available:', implementationT);
      return fallback;
    }
    
    const keys = key.split('.');
    let result = implementationT;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: implementationTools.${key}`, 'Available keys:', Object.keys(implementationT));
        return fallback;
      }
    }
    
    return result || fallback;
  }
  
  // Helper for common translations
  function commonT_helper(key, fallback = '') {
    if (!commonT || typeof commonT !== 'object') {
      return fallback;
    }
    
    const keys = key.split('.');
    let result = commonT;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return fallback;
      }
    }
    
    return result || fallback;
  }

  // Component interaction functions
  function handleAssessmentComplete(event) {
    assessmentResults = event.detail;
    isAssessmentComplete = true;
    
    // Simple scoring logic to determine recommended stack
    const scores = Object.values(assessmentResults);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (avgScore <= 2) {
      recommendedStack = toolStacks?.['getting-started-stack'];
    } else if (avgScore <= 3) {
      recommendedStack = toolStacks?.['building-capacity-stack'];
    } else if (avgScore <= 4) {
      recommendedStack = toolStacks?.['deepening-practice-stack'];
    } else {
      recommendedStack = toolStacks?.['evolution-transition-stack'];
    }
    
    // Save to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('implementationAssessment', JSON.stringify(assessmentResults));
    }
    
    // Navigate to results
    currentSection = 'stacks';
  }

  function resetAssessment() {
    assessmentResults = {};
    isAssessmentComplete = false;
    recommendedStack = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('implementationAssessment');
    }
    currentSection = 'assessment';
  }

  function selectSection(sectionId) {
    currentSection = sectionId;
    // Update URL hash without page reload
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, null, `#${sectionId}`);
    }
  }

  function selectJourney(journey) {
    selectedJourney = journey;
    currentSection = 'tools';
  }

  function openToolDetail(tool) {
    selectedTool = tool;
    isToolModalOpen = true;
  }

  function closeToolDetail() {
    selectedTool = null;
    isToolModalOpen = false;
  }

  // Mount logic
  onMount(() => {
    mounted = true;
    
    // Set initial section from URL hash
    const hash = window.location.hash.substring(1);
    if (hash && sections.find(s => s.id === hash)) {
      currentSection = hash;
    }
    
    // Load saved assessment if available
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('implementationAssessment');
      if (saved) {
        try {
          assessmentResults = JSON.parse(saved);
          isAssessmentComplete = Object.keys(assessmentResults).length > 0;
        } catch (e) {
          console.warn('Could not parse saved assessment:', e);
        }
      }
    }

    // CRITICAL FIX: Handle internal anchor link clicks
    const handleAnchorClicks = (event) => {
      const target = event.target;
      
      // Check if it's an internal anchor link
      if (target.tagName === 'A' && target.getAttribute('data-internal') === 'true') {
        const href = target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
          event.preventDefault(); // Prevent default browser behavior
          
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Smooth scroll to the target element
            targetElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
            
            // Update the URL hash without triggering a page reload
            window.history.pushState(null, null, href);
          } else {
            console.warn(`Target element with id "${targetId}" not found`);
          }
        }
      }
    };

    // Add click listener to the document
    document.addEventListener('click', handleAnchorClicks);
    
    // Cleanup function
    return () => {
      document.removeEventListener('click', handleAnchorClicks);
    };
  });
</script>

<svelte:head>
  <title>{$t('framework.docs.nav.frameworkTitles.implementationMethodsAndTools', 'Implementation Methods & Tools Framework')}</title>
  <meta name="description" content="{$t('framework.implementationTools.meta.description', 'The GGF\'s comprehensive toolkit for implementing governance frameworks')}" />
</svelte:head>

<div class="implementation-tools-page">
  <!-- Header Section -->
  <section class="page-header">
    <div class="container">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">
            🧰 {$t('framework.docs.nav.frameworkTitles.implementationMethodsAndTools', 'Implementation Methods & Tools Framework')}
          </h1>
          <p class="page-subtitle">
            {$t('framework.implementationTools.subtitle', 'Your comprehensive toolkit for bringing governance frameworks to life')}
          </p>
          <div class="framework-meta">
            <span class="tier-badge tier-4">
              {$t('framework.tier.4.title', 'Tier 4: Meta-Framework')}
            </span>
            <span class="status-badge status-review">
              {typeof $t('framework.status.review') === 'string' ? $t('framework.status.review') : 'Under Review'}
            </span>
          </div>
        </div>
        <div class="header-visual">
          <div class="toolkit-icon">🧰</div>
          <div class="connection-lines">
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Navigation Tabs -->
  <nav class="section-nav">
    <div class="container">
      <div class="nav-tabs">
        {#each sections as section}
          <button 
            class="nav-tab"
            class:active={currentSection === section.id}
            on:click={() => selectSection(section.id)}
          >
            <span class="tab-icon">{section.icon}</span>
            <span class="tab-text">{section.name}</span>
          </button>
        {/each}
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="main-content">
    <div class="container">
      
      {#if currentSection === 'overview'}
        <section class="content-section overview-section">
          <div class="section-grid">
            <div class="section-content">
              
              <!-- Render markdown content for overview -->
              {#if content?.sections?.overview}
                <div class="markdown-content">
                  {@html displayMarkdownContent(content.sections.overview)}
                </div>
              {:else if content?.sections?.index}
                <div class="markdown-content">
                  {@html displayMarkdownContent(content.sections.index)}
                </div>
              {:else}
                <!-- Fallback content if markdown not loaded -->
                <h2>{implT('overview.title', 'The GGF\'s Operating Manual')}</h2>
                
                <div class="intro-text">
                  <p>{implT('overview.intro', 'Visionary frameworks fail without practical, adaptable tools. This meta-framework provides standardized playbooks, modular tools, and culturally adaptable methodologies for implementing all other GGF frameworks.')}</p>
                </div>

                <div class="overview-grid">
                  <div class="overview-card">
                    <h3>🎯 Context Assessment</h3>
                    <p>Understand your community's readiness, resources, and cultural context before choosing tools.</p>
                    <button class="card-button" on:click={() => selectSection('assessment')}>Start Assessment</button>
                  </div>

                  <div class="overview-card">
                    <h3>🗺️ Implementation Journeys</h3>
                    <p>Follow proven pathways tailored to your situation and goals.</p>
                    <button class="card-button" on:click={() => selectSection('journeys')}>Explore Journeys</button>
                  </div>

                  <div class="overview-card">
                    <h3>🔧 Tool Database</h3>
                    <p>Access our comprehensive library of governance transformation tools.</p>
                    <button class="card-button" on:click={() => selectSection('tools')}>Browse Tools</button>
                  </div>

                  <div class="overview-card">
                    <h3>📦 Tool Stacks</h3>
                    <p>Get pre-configured tool combinations for common implementation scenarios.</p>
                    <button class="card-button" on:click={() => selectSection('stacks')}>View Stacks</button>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </section>
      {/if}

      {#if currentSection === 'assessment'}
        <!-- Assessment Section with integrated component -->
        <section class="content-section assessment-section">
          <div class="section-header">
            <h2>{$t('framework.implementationTools.assessment.title', 'Context Assessment')}</h2>
            <p>{$t('framework.implementationTools.assessment.description', 'Understand your implementation context and get personalized recommendations')}</p>
          </div>

          <!-- Display assessment rubric markdown content BEFORE the interactive component -->
          {#if content?.sections?.['assessment-rubric']}
            <div class="markdown-content methodology-content">
              {@html displayMarkdownContent(content.sections['assessment-rubric'])}
            </div>
          {/if}

          <!-- Interactive Assessment Component -->
          <div class="interactive-section">
            <h3>🎯 Take the Assessment</h3>
            {#if !isAssessmentComplete}
              <ContextAssessmentRubric on:complete={handleAssessmentComplete} />
            {:else}
              <div class="assessment-results">
                <h4>Your Assessment Results</h4>
                <div class="results-grid">
                  <div class="result-item">
                    <h5>Governance Maturity</h5>
                    <div class="result-value">{assessmentResults.governanceMaturity}/5</div>
                  </div>
                  <div class="result-item">
                    <h5>Conflict Intensity</h5>
                    <div class="result-value">{assessmentResults.conflictIntensity}/5</div>
                  </div>
                  <div class="result-item">
                    <h5>Resource Availability</h5>
                    <div class="result-value">{assessmentResults.resourceAvailability}/5</div>
                  </div>
                  <div class="result-item">
                    <h5>Cultural Coherence</h5>
                    <div class="result-value">{assessmentResults.culturalCoherence}/5</div>
                  </div>
                </div>

                {#if recommendedStack}
                  <div class="recommendation">
                    <h4>Recommended Tool Stack</h4>
                    <div class="recommended-stack">
                      <div class="stack-header">
                        <h5>{recommendedStack.name}</h5>
                        <span class="complexity-badge">{recommendedStack.complexity}</span>
                      </div>
                      <p>{recommendedStack.description}</p>
                      <button class="view-stack-button" on:click={() => selectSection('stacks')}>
                        View Tool Stack →
                      </button>
                    </div>
                  </div>
                {/if}

                <div class="action-buttons">
                  <button class="secondary-button" on:click={resetAssessment}>
                    Retake Assessment
                  </button>
                  <button class="primary-button" on:click={() => selectSection('journeys')}>
                    Continue to Journeys →
                  </button>
                </div>
              </div>
            {/if}
          </div>
        </section>
      {/if}

      {#if currentSection === 'journeys'}
        <!-- Journey Selection Section -->
        <section class="content-section journeys-section">
          <div class="section-header">
            <h2>{$t('framework.implementationTools.journeys.title', 'Implementation Journeys')}</h2>
            <p>{$t('framework.implementationTools.journeys.description', 'Choose your path based on your situation and goals')}</p>
          </div>

          <!-- Display journey pathways markdown content BEFORE the interactive component -->
          {#if content?.sections?.['journey-pathways']}
            <div class="markdown-content methodology-content">
              {@html displayMarkdownContent(content.sections['journey-pathways'])}
            </div>
          {/if}

          <!-- Interactive Journey Selector -->
          <div class="interactive-section">
            <h3>🗺️ Select Your Journey</h3>
            <JourneySelector 
              on:journeySelected={(e) => selectJourney(e.detail)}
              {recommendedStack}
            />
          </div>
        </section>
      {/if}

      {#if currentSection === 'tools'}
        <!-- Tool Database Section -->
        <section class="content-section tools-section">
          <div class="section-header">
            <h2>{$t('framework.implementationTools.tools.title', 'Tool Database')}</h2>
            <p>{$t('framework.implementationTools.tools.description', 'Explore our comprehensive library of implementation tools')}</p>
          </div>

          <!-- Display tool database markdown content BEFORE the interactive component -->
          {#if content?.sections?.['tool-database']}
            <div class="markdown-content methodology-content">
              {@html displayMarkdownContent(content.sections['tool-database'])}
            </div>
          {/if}

          <!-- Interactive Tool Database -->
          <div class="interactive-section">
            <h3>🔧 Explore Tools</h3>
            {#if tools && Object.keys(tools).length > 0}
              <ToolDatabase 
                {tools}
                {selectedJourney}
                bind:searchQuery
                bind:selectedFilters
                on:toolSelected={(e) => openToolDetail(e.detail)}
              />
            {:else}
              <div class="no-data-message">
                <p>Tool database is loading or no tools are available.</p>
                <p><em>Debug: tools = {JSON.stringify(tools)}</em></p>
              </div>
            {/if}
          </div>
        </section>
      {/if}

      {#if currentSection === 'stacks'}
        <!-- Tool Stacks Section -->
        <section class="content-section stacks-section">
          <div class="section-header">
            <h2>{$t('framework.implementationTools.stacks.title', 'Tool Stacks')}</h2>
            <p>{$t('framework.implementationTools.stacks.description', 'Pre-configured tool combinations for common scenarios')}</p>
          </div>

          <!-- Interactive Tool Stack Visualizer -->
          <div class="interactive-section">
            <h3>📦 Tool Stack Configurations</h3>
            {#if toolStacks && Object.keys(toolStacks).length > 0}
              <ToolStackVisualizer 
                {toolStacks}
                {tools}
                {recommendedStack}
                on:toolSelected={(e) => openToolDetail(e.detail)}
              />
            {:else}
              <div class="no-data-message">
                <p>Tool stacks are loading or no stacks are available.</p>
                <p><em>Debug: toolStacks = {JSON.stringify(toolStacks)}</em></p>
              </div>
            {/if}
          </div>
        </section>
      {/if}

      {#if currentSection === 'guidance'}
        <section class="content-section guidance-section">
          <div class="section-header">
            <h2>{implT('guidance.title', 'Implementation Guidance')}</h2>
            <p>{implT('guidance.description', 'Best practices and lessons learned from global implementations')}</p>
          </div>

          <!-- Display implementation guidance markdown content -->
          {#if content?.sections?.['implementation-guidance']}
            <div class="markdown-content">
              {@html displayMarkdownContent(content.sections['implementation-guidance'])}
            </div>
          {:else}
            <!-- Fallback content -->
            <div class="guidance-content">
              <div class="guidance-grid">
                <div class="guidance-card">
                  <h3>{implT('guidance.principles.title', 'Guiding Principles')}</h3>
                  <ul>
                    <li>{implT('guidance.principles.polycentric', 'Polycentric & Subsidiarity-First')}</li>
                    <li>{implT('guidance.principles.anticolonial', 'Anti-Colonial by Design')}</li>
                    <li>{implT('guidance.principles.lowtech', 'Low-Tech First & High-Tech Enabled')}</li>
                    <li>{implT('guidance.principles.modular', 'Modular & Interoperable')}</li>
                    <li>{implT('guidance.principles.humanloop', 'Human-in-the-Loop')}</li>
                  </ul>
                </div>

                <div class="guidance-card">
                  <h3>{implT('guidance.phases.title', 'Implementation Phases')}</h3>
                  <div class="phase-list">
                    <div class="phase-item">
                      <h4>{implT('guidance.phases.foundation', 'Phase 1: Foundation (Years 1-3)')}</h4>
                      <p>{implT('guidance.phases.foundationDesc', 'Council convening, BAZ formation, crisis response capabilities')}</p>
                    </div>
                    <div class="phase-item">
                      <h4>{implT('guidance.phases.integration', 'Phase 2: Integration (Years 4-7)')}</h4>
                      <p>{implT('guidance.phases.integrationDesc', 'Economic modeling, participatory processes, system coordination')}</p>
                    </div>
                    <div class="phase-item">
                      <h4>{implT('guidance.phases.evolution', 'Phase 3: Evolution (Years 8-15)')}</h4>
                      <p>{implT('guidance.phases.evolutionDesc', 'Consciousness development, AI symbiosis, graceful transitions')}</p>
                    </div>
                  </div>
                </div>

                <div class="guidance-card">
                  <h3>{implT('guidance.support.title', 'Support Infrastructure')}</h3>
                  <ul>
                    <li>{implT('guidance.support.facilitators', 'Certified Tool Facilitators')}</li>
                    <li>{implT('guidance.support.networks', 'Peer Learning Networks')}</li>
                    <li>{implT('guidance.support.technical', 'Technical Support Protocols')}</li>
                    <li>{implT('guidance.support.mediation', 'Conflict Mediation Services')}</li>
                  </ul>
                </div>

                <div class="guidance-card">
                  <h3>{implT('guidance.monitoring.title', 'Monitoring & Learning')}</h3>
                  <ul>
                    <li>{implT('guidance.monitoring.reflexive', 'Reflexive Cycle Protocol')}</li>
                    <li>{implT('guidance.monitoring.effectiveness', 'Tool Effectiveness Ratings')}</li>
                    <li>{implT('guidance.monitoring.failure', 'GGF Failure Library')}</li>
                    <li>{implT('guidance.monitoring.adaptation', 'Real-Time Adaptation Protocols')}</li>
                  </ul>
                </div>
              </div>
            </div>
          {/if}
        </section>
      {/if}

      {#if currentSection === 'appendices'}
        <section class="content-section appendices-section">
          <div class="section-header">
            <h2>📚 Appendices & Resources</h2>
            <p>Supporting documentation, templates, and reference materials</p>
          </div>

          <div class="appendices-grid">
            <!-- Anti-Colonial Evaluation Template -->
            {#if content?.appendices?.['anti-colonial-evaluation-template']}
              <div class="appendix-card">
                <h3>🌍 Anti-Colonial Evaluation Template</h3>
                <div class="markdown-content">
                  {@html displayMarkdownContent(content.appendices['anti-colonial-evaluation-template'])}
                </div>
              </div>
            {/if}

            <!-- Glossary -->
            {#if content?.appendices?.glossary}
              <div class="appendix-card">
                <h3>📖 Glossary</h3>
                <div class="markdown-content">
                  {@html displayMarkdownContent(content.appendices.glossary)}
                </div>
              </div>
            {/if}

            <!-- Resource Calculator -->
            {#if content?.appendices?.['resource-calculator']}
              <div class="appendix-card">
                <h3>🧮 Resource Calculator</h3>
                <div class="markdown-content">
                  {@html displayMarkdownContent(content.appendices['resource-calculator'])}
                </div>
              </div>
            {/if}

            <!-- Success Patterns -->
            {#if content?.appendices?.['success-patterns']}
              <div class="appendix-card">
                <h3>✨ Success Patterns</h3>
                <div class="markdown-content">
                  {@html displayMarkdownContent(content.appendices['success-patterns'])}
                </div>
              </div>
            {/if}

            <!-- Failure Library Examples -->
            {#if content?.appendices?.['failure-library-examples']}
              <div class="appendix-card">
                <h3>📋 Failure Library Examples</h3>
                <div class="markdown-content">
                  {@html displayMarkdownContent(content.appendices['failure-library-examples'])}
                </div>
              </div>
            {/if}
          </div>

          <!-- Integration Documents -->
          {#if content?.integrations && Object.keys(content.integrations).length > 0}
            <div class="integration-section">
              <h3>🔗 Framework Integrations</h3>
              <div class="integration-grid">
                {#each Object.keys(content.integrations) as integrationKey}
                  <div class="integration-card">
                    <h4>{integrationKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                    <div class="markdown-content">
                      {@html displayMarkdownContent(content.integrations[integrationKey])}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Quickstart Guides -->
          {#if content?.quickstart && Object.keys(content.quickstart).length > 0}
            <div class="quickstart-section">
              <h3>🚀 Quick Start Guides</h3>
              <div class="quickstart-grid">
                {#each Object.keys(content.quickstart) as guideKey}
                  <div class="quickstart-card">
                    <h4>{guideKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                    <div class="markdown-content">
                      {@html displayMarkdownContent(content.quickstart[guideKey])}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </section>
      {/if}

    </div>
  </main>

  <!-- Tool Detail Modal -->
  <ToolDetailModal 
    tool={selectedTool}
    bind:isOpen={isToolModalOpen}
    on:close={closeToolDetail}
  />

  <!-- Footer CTA -->
  <section class="footer-cta">
    <div class="container">
      <div class="cta-content">
        <h3>{$t('framework.implementationTools.cta.title', 'Ready to Start Implementing?')}</h3>
        <p>{$t('framework.implementationTools.cta.description', 'Join our community of practitioners and start building better governance today.')}</p>
        <div class="cta-buttons">
          {#if !isAssessmentComplete}
            <button class="primary-button" on:click={() => selectSection('assessment')}>
              {$t('common.ui.takeAssessment', 'Take Assessment')}
            </button>
          {:else}
            <button class="primary-button" on:click={() => selectSection('tools')}>
              {$t('common.ui.exploreTools', 'Explore Tools')}
            </button>
          {/if}
          <a href="{base}/get-involved" class="secondary-button">
            {$t('common.ui.joinCommunity', 'Join Community')}
          </a>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .implementation-tools-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Header Section */
  .page-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 3rem 0;
  }

  .header-content {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
    align-items: center;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
  }

  .page-subtitle {
    font-size: 1.25rem;
    margin: 0 0 1.5rem 0;
    opacity: 0.9;
  }

  .framework-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .tier-badge, .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .tier-4 {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .status-review {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  }

  .header-visual {
    position: relative;
  }

  .toolkit-icon {
    font-size: 4rem;
    opacity: 0.8;
  }

  /* Navigation */
  .section-nav {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .nav-tabs {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .nav-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    background: #f8fafc;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    font-size: 0.875rem;
    color: #64748b;
  }

  .nav-tab:hover {
    background: #e2e8f0;
    color: #334155;
  }

  .nav-tab.active {
    background: #3b82f6;
    color: white;
  }

  .tab-icon {
    font-size: 1.1rem;
  }

  /* Main Content */
  .main-content {
    padding: 2rem 0;
  }

  .content-section {
    margin-bottom: 3rem;
  }

  .section-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .section-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  .section-header p {
    font-size: 1.125rem;
    color: #64748b;
    margin: 0;
  }

  /* Markdown Content Styling - ENHANCED WITH PROPER LINK SUPPORT */
  .markdown-content {
    color: #374151;
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  .markdown-content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
    margin-top: 2rem;
  }

  .markdown-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
  }

  .markdown-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
    margin-top: 1.25rem;
  }

  .markdown-content :global(h4) {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }

  .markdown-content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
  }

  .markdown-content :global(ul), 
  .markdown-content :global(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .markdown-content :global(li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  .markdown-content :global(blockquote) {
    border-left: 4px solid #3b82f6;
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #64748b;
  }

  .markdown-content :global(code) {
    background: #f1f5f9;
    color: #1e293b;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  }

  .markdown-content :global(pre) {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  .markdown-content :global(pre code) {
    background: none;
    color: inherit;
    padding: 0;
  }

  /* CRITICAL: Proper link styling - this makes links clickable and styled */
  .markdown-content :global(a) {
    color: #3b82f6;
    text-decoration: underline;
    font-weight: 500;
    transition: color 0.2s;
  }

  .markdown-content :global(a:hover) {
    color: #1d4ed8;
    text-decoration: none;
  }

  .markdown-content :global(a:focus) {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 0.25rem;
  }

  /* Images */
  .markdown-content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  /* Interactive Sections */
  .interactive-section {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    margin: 2rem 0;
  }

  .interactive-section h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1.5rem 0;
  }

  .methodology-content {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 1.5rem;
    border-left: 4px solid #3b82f6;
    margin-bottom: 2rem;
  }

  /* Overview Grid */
  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .overview-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .overview-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  .overview-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.75rem 0;
  }

  .overview-card p {
    color: #64748b;
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }

  .card-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .card-button:hover {
    background: #2563eb;
  }

  /* Assessment Results */
  .assessment-results {
    background: #f0f9ff;
    border-radius: 0.75rem;
    padding: 2rem;
    border: 1px solid #bae6fd;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .result-item {
    text-align: center;
    background: white;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e0f2fe;
  }

  .result-item h5 {
    font-size: 0.875rem;
    font-weight: 500;
    color: #0369a1;
    margin: 0 0 0.5rem 0;
  }

  .result-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0c4a6e;
  }

  .recommendation {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    border: 1px solid #e0f2fe;
    margin-top: 1.5rem;
  }

  .recommended-stack {
    margin-top: 0.75rem;
  }

  .stack-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .stack-header h5 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .complexity-badge {
    background: #fef3c7;
    color: #92400e;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .view-stack-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 0.75rem;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .primary-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .primary-button:hover {
    background: #2563eb;
  }

  .secondary-button {
    background: white;
    color: #3b82f6;
    border: 1px solid #3b82f6;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }

  .secondary-button:hover {
    background: #eff6ff;
  }

  /* Appendices and Resources */
  .appendices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .appendix-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }

  .appendix-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  /* Guidance Content */
  .guidance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .guidance-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }

  .guidance-card h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
  }

  .guidance-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .guidance-card li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
    color: #64748b;
  }

  .guidance-card li:last-child {
    border-bottom: none;
  }

  .phase-list {
    space-y: 1rem;
  }

  .phase-item {
    margin-bottom: 1rem;
  }

  .phase-item h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  .phase-item p {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }

  /* Footer CTA */
  .footer-cta {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 3rem 0;
    text-align: center;
  }

  .cta-content h3 {
    font-size: 1.875rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
  }

  .cta-content p {
    font-size: 1.125rem;
    margin: 0 0 2rem 0;
    opacity: 0.9;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .header-content {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .page-title {
      font-size: 2rem;
    }

    .nav-tabs {
      justify-content: flex-start;
    }

    .overview-grid {
      grid-template-columns: 1fr;
    }

    .results-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .appendices-grid {
      grid-template-columns: 1fr;
    }

    .guidance-grid {
      grid-template-columns: 1fr;
    }

    .action-buttons {
      flex-direction: column;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .interactive-section {
      padding: 1rem;
    }
  }
</style>
