<!-- src/lib/components/JourneySelector.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';
  
  const dispatch = createEventDispatcher();
  
  export let recommendedStack = null;
  
  let selectedJourney = null;
  
  // Journey definitions with comprehensive metadata
  const journeys = [
    {
      id: 'getting-started',
      titleKey: 'journeys.gettingStarted.title',
      title: 'Getting Started',
      icon: '🚀',
      complexity: 'Basic',
      timeframe: '3-6 months',
      descriptionKey: 'journeys.gettingStarted.description',
      description: 'Perfect for new initiatives and communities just beginning their governance journey',
      targetAudience: [
        'New community organizations',
        'Grassroots movements',
        'Reform-minded groups',
        'Early-stage initiatives'
      ],
      keyTools: [
        'Council Convening Playbook',
        'Institution Chartering Kit',
        'Bioregional Mapping Guide',
        'FPIC 2.0 Implementation Guide'
      ],
      outcomes: [
        'Established governance structure',
        'Clear decision-making processes',
        'Community engagement protocols',
        'Cultural integration framework'
      ],
      prerequisites: [
        'Community commitment',
        'Basic organizational capacity',
        'Willingness to learn'
      ],
      culturalFit: 'Universal - adapts to all traditions',
      resourceLevel: 'Low to Medium',
      recommended: false
    },
    {
      id: 'crisis-response',
      titleKey: 'journeys.crisisResponse.title',
      title: 'Crisis Response',
      icon: '🚨',
      complexity: 'High',
      timeframe: '72 hours - 3 months',
      descriptionKey: 'journeys.crisisResponse.description',
      description: 'Rapid deployment tools for emergency governance situations and system breakdowns',
      targetAudience: [
        'Emergency response teams',
        'Communities in crisis',
        'Post-conflict regions',
        'Climate disaster areas'
      ],
      keyTools: [
        'Rapid Governance Activation',
        'Emergency Legitimacy Frameworks',
        '72-Hour Activation Kit',
        'Trauma-Informed Facilitation'
      ],
      outcomes: [
        'Stabilized governance',
        'Emergency coordination',
        'Community cohesion',
        'Transition planning'
      ],
      prerequisites: [
        'Crisis situation',
        'Immediate action needed',
        'Basic communication capacity'
      ],
      culturalFit: 'Adaptable with cultural trauma protocols',
      resourceLevel: 'High urgency, variable resources',
      recommended: false
    },
    {
      id: 'building-capacity',
      titleKey: 'journeys.buildingCapacity.title',
      title: 'Building Capacity',
      icon: '🏗️',
      complexity: 'Medium',
      timeframe: '6-18 months',
      descriptionKey: 'journeys.buildingCapacity.description',
      description: 'Comprehensive tools for growing and strengthening existing governance initiatives',
      targetAudience: [
        'Established organizations',
        'Municipal governments',
        'NGOs seeking improvement',
        'Scaling initiatives'
      ],
      keyTools: [
        'Citizen Assembly Module',
        'Participatory Budgeting Module',
        'Consensus-Building & Dialogue',
        'AUBI Pilot Program Guide'
      ],
      outcomes: [
        'Enhanced participation',
        'Improved decision-making',
        'Economic integration',
        'Scaled impact'
      ],
      prerequisites: [
        'Existing governance structure',
        'Community trust',
        'Dedicated resources'
      ],
      culturalFit: 'High adaptability with cultural protocols',
      resourceLevel: 'Medium to High',
      recommended: false
    },
    {
      id: 'deepening-practice',
      titleKey: 'journeys.deepeningPractice.title',
      title: 'Deepening Practice',
      icon: '🌱',
      complexity: 'Advanced',
      timeframe: '1-3 years',
      descriptionKey: 'journeys.deepeningPractice.description',
      description: 'Advanced tools for mature initiatives ready to pioneer new approaches',
      targetAudience: [
        'Advanced practitioners',
        'Pioneer communities',
        'Research institutions',
        'Innovation hubs'
      ],
      keyTools: [
        'AI Ethical Implementation',
        'Digital Sovereignty Toolkit',
        'Community Sensor Networks',
        'Cultural Innovation Protocols'
      ],
      outcomes: [
        'Cutting-edge practices',
        'Technology integration',
        'Cultural innovation',
        'Model development'
      ],
      prerequisites: [
        'Mature governance systems',
        'Technical capacity',
        'Innovation mindset'
      ],
      culturalFit: 'Requires strong cultural foundation',
      resourceLevel: 'High',
      recommended: false
    },
    {
      id: 'evolution-transition',
      titleKey: 'journeys.evolutionTransition.title',
      title: 'Evolution & Transition',
      icon: '🦋',
      complexity: 'Expert',
      timeframe: '2-5 years',
      descriptionKey: 'journeys.evolutionTransition.description',
      description: 'Tools for fundamental system transformation and graceful transitions',
      targetAudience: [
        'System change leaders',
        'Transitioning institutions',
        'Regional governments',
        'International bodies'
      ],
      keyTools: [
        'Graceful Sunsetting Protocol',
        'Legacy System Integration',
        'Consciousness Development',
        'Metamorphosis Frameworks'
      ],
      outcomes: [
        'System transformation',
        'Smooth transitions',
        'Legacy preservation',
        'Future readiness'
      ],
      prerequisites: [
        'Extensive experience',
        'System-level thinking',
        'Long-term commitment'
      ],
      culturalFit: 'Deep cultural wisdom integration',
      resourceLevel: 'Very High',
      recommended: false
    }
  ];

  // Set recommended journey based on assessment results
  $: {
    if (recommendedStack) {
      journeys.forEach(journey => {
        journey.recommended = journey.id === recommendedStack.id;
      });
    }
  }

  function selectJourney(journey) {
    selectedJourney = journey;
    dispatch('journeySelected', journey);
  }

  function getComplexityColor(complexity) {
    switch (complexity) {
      case 'Basic': return '#16a34a';
      case 'Medium': return '#ca8a04';
      case 'High': return '#dc2626';
      case 'Advanced': return '#7c3aed';
      case 'Expert': return '#be123c';
      default: return '#64748b';
    }
  }

  function getComplexityBadgeClass(complexity) {
    switch (complexity) {
      case 'Basic': return 'complexity-basic';
      case 'Medium': return 'complexity-medium';
      case 'High': return 'complexity-high';
      case 'Advanced': return 'complexity-advanced';
      case 'Expert': return 'complexity-expert';
      default: return 'complexity-default';
    }
  }
</script>

<div class="journey-selector">
  <!-- Introduction -->
  <div class="selector-intro">
    <p class="intro-text">
      {$t('journeys.intro', 'Choose your implementation journey based on your context, experience level, and goals. Each journey provides a curated set of tools designed to work together effectively.')}
    </p>
    
    {#if recommendedStack}
      <div class="recommendation-notice">
        <div class="notice-icon">💡</div>
        <div class="notice-content">
          <h4>{$t('journeys.recommendationNotice.title', 'Recommended for You')}</h4>
          <p>{$t('journeys.recommendationNotice.description', 'Based on your assessment, we recommend starting with the highlighted journey below.')}</p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Journey Cards Grid -->
  <div class="journeys-grid">
    {#each journeys as journey}
      <div 
        class="journey-card"
        class:recommended={journey.recommended}
        class:selected={selectedJourney?.id === journey.id}
      >
        
        <!-- Recommended Badge -->
        {#if journey.recommended}
          <div class="recommended-badge">
            ⭐ {$t('journeys.recommended', 'Recommended')}
          </div>
        {/if}

        <!-- Card Header -->
        <div class="card-header">
          <div class="journey-icon">{journey.icon}</div>
          <div class="header-content">
            <h3 class="journey-title">
              {$t(journey.titleKey, journey.title)}
            </h3>
            <div class="journey-meta">
              <span class="complexity-badge {getComplexityBadgeClass(journey.complexity)}">
                {$t(`journeys.complexity.${journey.complexity.toLowerCase()}`, journey.complexity)}
              </span>
              <span class="timeframe">⏱️ {journey.timeframe}</span>
            </div>
          </div>
        </div>

        <!-- Card Content -->
        <div class="card-content">
          <p class="journey-description">
            {$t(journey.descriptionKey, journey.description)}
          </p>

          <!-- Key Information Tabs -->
          <div class="info-tabs">
            <div class="tab-content">
              
              <!-- Target Audience -->
              <div class="info-section">
                <h4 class="section-title">
                  🎯 {$t('journeys.targetAudience', 'Target Audience')}
                </h4>
                <ul class="info-list compact">
                  {#each journey.targetAudience as audience}
                    <li>{audience}</li>
                  {/each}
                </ul>
              </div>

              <!-- Key Tools Preview -->
              <div class="info-section">
                <h4 class="section-title">
                  🔧 {$t('journeys.keyTools', 'Key Tools')}
                </h4>
                <ul class="info-list compact">
                  {#each journey.keyTools.slice(0, 3) as tool}
                    <li>{tool}</li>
                  {/each}
                  {#if journey.keyTools.length > 3}
                    <li class="more-indicator">
                      + {journey.keyTools.length - 3} {$t('journeys.moreTools', 'more tools')}
                    </li>
                  {/if}
                </ul>
              </div>

              <!-- Expected Outcomes -->
              <div class="info-section">
                <h4 class="section-title">
                  🎯 {$t('journeys.expectedOutcomes', 'Expected Outcomes')}
                </h4>
                <ul class="info-list compact">
                  {#each journey.outcomes.slice(0, 3) as outcome}
                    <li>{outcome}</li>
                  {/each}
                </ul>
              </div>

            </div>
          </div>

          <!-- Resource & Cultural Information -->
          <div class="journey-details">
            <div class="detail-item">
              <span class="detail-label">{$t('journeys.resourceLevel', 'Resources')}:</span>
              <span class="detail-value">{journey.resourceLevel}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{$t('journeys.culturalFit', 'Cultural Fit')}:</span>
              <span class="detail-value">{journey.culturalFit}</span>
            </div>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <button 
            class="select-journey-button"
            class:primary={journey.recommended}
            on:click={() => selectJourney(journey)}
          >
            {#if selectedJourney?.id === journey.id}
              ✓ {$t('journeys.selected', 'Selected')}
            {:else}
              {$t('journeys.selectJourney', 'Select This Journey')}
            {/if}
          </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Journey Selection Confirmation -->
  {#if selectedJourney}
    <div class="selection-confirmation">
      <div class="confirmation-content">
        <h4>
          🎉 {$t('journeys.confirmation.title', 'Journey Selected!')}
        </h4>
        <p>
          {$t('journeys.confirmation.description', 'You\'ve selected the {journey} journey. You can now explore the specific tools and begin your implementation.', { journey: $t(selectedJourney.titleKey, selectedJourney.title) })}
        </p>
        <div class="confirmation-actions">
          <button class="primary-action" on:click={() => dispatch('journeySelected', selectedJourney)}>
            {$t('journeys.confirmation.exploreTools', 'Explore Tools')} →
          </button>
          <button class="secondary-action" on:click={() => selectedJourney = null}>
            {$t('journeys.confirmation.changeSelection', 'Change Selection')}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .journey-selector {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Introduction */
  .selector-intro {
    margin-bottom: 2rem;
  }

  .intro-text {
    font-size: 1.125rem;
    color: #64748b;
    line-height: 1.6;
    text-align: center;
    max-width: 800px;
    margin: 0 auto 1.5rem auto;
  }

  .recommendation-notice {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 1px solid #f59e0b;
    border-radius: 0.75rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .notice-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .notice-content h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 0.5rem;
  }

  .notice-content p {
    font-size: 0.875rem;
    color: #92400e;
    margin: 0;
    line-height: 1.5;
  }

  /* Journey Grid */
  .journeys-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .journey-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .journey-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .journey-card.recommended {
    border-color: #f59e0b;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  }

  .journey-card.selected {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
  }

  .recommended-badge {
    position: absolute;
    top: -8px;
    right: 1rem;
    background: #f59e0b;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    z-index: 10;
  }

  /* Card Header */
  .card-header {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .journey-icon {
    font-size: 3rem;
    flex-shrink: 0;
    line-height: 1;
  }

  .header-content {
    flex: 1;
  }

  .journey-title {
    font-size: 1.375rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.75rem;
    line-height: 1.2;
  }

  .journey-meta {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .complexity-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
  }

  .complexity-basic { background: #16a34a; }
  .complexity-medium { background: #ca8a04; }
  .complexity-high { background: #dc2626; }
  .complexity-advanced { background: #7c3aed; }
  .complexity-expert { background: #be123c; }
  .complexity-default { background: #64748b; }

  .timeframe {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  /* Card Content */
  .card-content {
    margin-bottom: 1.5rem;
  }

  .journey-description {
    font-size: 1rem;
    color: #374151;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .info-tabs {
    margin-bottom: 1.5rem;
  }

  .tab-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  .info-section {
    background: rgba(248, 250, 252, 0.8);
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #f1f5f9;
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .info-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .info-list.compact li {
    font-size: 0.8rem;
    color: #64748b;
    padding: 0.25rem 0;
    line-height: 1.4;
    position: relative;
    padding-left: 1rem;
  }

  .info-list.compact li:before {
    content: "•";
    color: #3b82f6;
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  .more-indicator {
    font-style: italic;
    color: #94a3b8 !important;
  }

  .journey-details {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(241, 245, 249, 0.5);
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
  }

  .detail-label {
    font-weight: 500;
    color: #64748b;
  }

  .detail-value {
    color: #1e293b;
    font-weight: 500;
    text-align: right;
    flex: 1;
    margin-left: 1rem;
  }

  /* Card Actions */
  .card-actions {
    display: flex;
    justify-content: center;
  }

  .select-journey-button {
    width: 100%;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    font-size: 0.95rem;
  }

  .select-journey-button:not(.primary) {
    background: #f8fafc;
    color: #3b82f6;
    border-color: #e2e8f0;
  }

  .select-journey-button:not(.primary):hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .select-journey-button.primary {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border-color: #f59e0b;
  }

  .select-journey-button.primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }

  .journey-card.selected .select-journey-button {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    color: white;
    border-color: #16a34a;
  }

  /* Selection Confirmation */
  .selection-confirmation {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border: 2px solid #16a34a;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    margin-top: 2rem;
  }

  .confirmation-content h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #166534;
    margin-bottom: 1rem;
  }

  .confirmation-content p {
    font-size: 1.125rem;
    color: #166534;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .confirmation-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .primary-action, .secondary-action {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-size: 1rem;
  }

  .primary-action {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    color: white;
  }

  .primary-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  }

  .secondary-action {
    background: transparent;
    color: #166534;
    border: 2px solid #bbf7d0;
  }

  .secondary-action:hover {
    background: #bbf7d0;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .journeys-grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .tab-content {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
  }

  @media (max-width: 768px) {
    .journey-selector {
      padding: 0 1rem;
    }

    .journeys-grid {
      grid-template-columns: 1fr;
    }

    .journey-card {
      padding: 1rem;
    }

    .card-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.75rem;
    }

    .journey-icon {
      font-size: 2.5rem;
    }

    .journey-title {
      font-size: 1.25rem;
    }

    .journey-meta {
      justify-content: center;
    }

    .detail-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .detail-value {
      text-align: left;
      margin-left: 0;
    }

    .recommendation-notice {
      flex-direction: column;
      text-align: center;
    }

    .confirmation-actions {
      flex-direction: column;
      align-items: center;
    }

    .primary-action, .secondary-action {
      width: 100%;
      max-width: 300px;
    }
  }

  @media (max-width: 480px) {
    .journey-card {
      padding: 1rem 0.75rem;
    }

    .journey-title {
      font-size: 1.125rem;
    }

    .intro-text {
      font-size: 1rem;
    }

    .info-section {
      padding: 0.75rem;
    }

    .section-title {
      font-size: 0.8rem;
    }

    .info-list.compact li {
      font-size: 0.75rem;
    }

    .confirmation-content h4 {
      font-size: 1.25rem;
    }

    .confirmation-content p {
      font-size: 1rem;
    }
  }

  /* Animation for card selection */
  @keyframes selectCard {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  .journey-card.selected {
    animation: selectCard 0.3s ease-out;
  }

  /* Accessibility improvements */
  .select-journey-button:focus {
    outline: 3px solid #60a5fa;
    outline-offset: 2px;
  }

  .journey-card:focus-within {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Print styles */
  @media print {
    .journey-card {
      break-inside: avoid;
      box-shadow: none;
      border: 1px solid #ccc;
    }
    
    .select-journey-button {
      display: none;
    }
  }
</style>
