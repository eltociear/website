<!-- src/routes/+page.svelte -->
<script>
  import InfoBox from '$lib/components/InfoBox.svelte';
  import EthicalImpactDashboard from '$lib/components/EthicalImpactDashboard.svelte';
  import FrameworkConstellation from '$lib/components/FrameworkConstellation.svelte';
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { allFrameworks, getFrameworksByTier, getFrameworkBySlug } from '$lib/stores/frameworkNav.js';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  let ref_ubtk = false;

  // Animation states
  let isVisible = false;
  let hoveredFramework = null;
  let activeFramework = null;
  let isMobile = false;
  
  // Collapsible sections state
  let whyExistsExpanded = false;
  let languageExpanded = false;
  
  // Quiz state
  let hasCompletedQuiz = false;
  let quizResults = null;
  
  onMount(() => {
    if (browser) {
      ref_ubtk = $page.url.searchParams.get('ref') === 'ubtk';
    }

    isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    
    // Check if user has completed the quiz
    const savedQuiz = localStorage.getItem('globalCitizenshipQuiz');
    if (savedQuiz) {
      hasCompletedQuiz = true;
      quizResults = JSON.parse(savedQuiz);
    }
    
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  // Featured frameworks data (using frameworkNav.js with i18n)
  $: featuredFrameworks = [
    {
      ...getFrameworkBySlug('treaty-for-our-only-home'),
      tagline: $t('home.constellation.taglines.treatyforouronlyhome'),
      points: [
        $t('home.treatyFeature.point1'),
        $t('home.treatyFeature.point2'), 
        $t('home.treatyFeature.point3')
      ],
      icon: '⚖️',
      color: '#2B4B8C'
    },
    {
      ...getFrameworkBySlug('gaian-trade-framework'),
      tagline: $t('home.constellation.taglines.gaiantradeframework'),
      points: [
        $t('home.constellation.points.gaiantrade1'),
        $t('home.constellation.points.gaiantrade2'),
        $t('home.constellation.points.gaiantrade3')
      ],
      icon: '🌍',
      color: '#2D5F2D'
    },
    {
      ...getFrameworkBySlug('nested-economies'),
      tagline: $t('home.constellation.taglines.economicintegration'),
      points: [
        $t('home.constellation.points.economic1'),
        $t('home.constellation.points.economic2'), 
        $t('home.constellation.points.economic3')
      ],
      icon: '💰',
      color: '#B8860B'
    }
  ];

  // Constellation event handlers
  function handleNodeClick(event) {
    const framework = event.detail;
    if (isMobile) {
      if (activeFramework === framework.slug) {
        if (framework.path) {
          window.location.href = base + framework.path;
        }
      } else {
        activeFramework = framework.slug;
        hoveredFramework = framework.slug;
      }
    } else {
      if (framework.path) {
        window.location.href = base + framework.path;
      }
    }
  }

  function handleNodeHover(event) {
    if (!isMobile) {
      hoveredFramework = event.detail.slug;
    }
  }

  function handleNodeLeave() {
    if (!isMobile) {
      hoveredFramework = null;
    }
  }

  function handleBackgroundClick() {
    if (isMobile) {
      activeFramework = null;
      hoveredFramework = null;
    }
  }

  // Toggle functions for collapsible sections
  function toggleWhyExists() {
    whyExistsExpanded = !whyExistsExpanded;
  }

  function toggleLanguage() {
    languageExpanded = !languageExpanded;
  }

  // Get current hovered framework data for the description panel
  $: currentHoveredFramework = hoveredFramework ? 
    [...getFrameworksByTier(0), ...getFrameworksByTier(1), ...getFrameworksByTier(2), ...getFrameworksByTier(3), ...getFrameworksByTier(4)]
      .find(f => f.slug === hoveredFramework) : null;

  // Get framework description with i18n
  function getFrameworkDescription(slug) {
    const translationKey = `home.constellation.descriptions.${slug.replace(/-/g, '')}`;
    const description = $t(translationKey);
    return description || $t('common.fallback.frameworkDescription');
  }

  // Get framework tagline with i18n
  function getFrameworkTagline(slug) {
    const translationKey = `home.constellation.taglines.${slug.replace(/-/g, '')}`;
    const tagline = $t(translationKey);
    return tagline !== translationKey ? tagline : null; // Return null if no tagline exists
  }
</script>

<svelte:head>
  <title>{$t('home.title')}</title>
  <meta name="description" content="{$t('home.subtitle')}" />
</svelte:head>

{#if ref_ubtk}
  <div class="welcome-banner">
    <p>Welcome, explorer from Unity Beyond the Known! The Aegis Protocol, featured below, is the GGF's blueprint for making that vision a reality.</p>
  </div>
{/if}

<!-- Hero Section with Core Message -->
<section class="hero-section">
  <div class="hero-container">
    
    <!-- Hero Content -->
    <div class="hero-content">
      <img src="{base}/logo.svg" alt="{$t('home.title')} Logo" class="hero-logo">
      
      <h1 class="hero-title">{$t('home.title')}</h1>
      <p class="hero-subtitle">{$t('home.intro.heading')}</p>
      <p class="hero-tagline">{$t('home.intro.text')}</p>
    </div>

  </div>
</section>

<!-- Three Pillars Section - The Core Architecture -->
<section class="three-pillars-section">
  <div class="container">
    <div class="pillars-header">
      <h2 class="pillars-title">{$t('home.threePillars.title')}</h2>
      <p class="pillars-intro">
        {$t('home.threePillars.intro')}
      </p>
    </div>

    <div class="pillars-grid">
      
      <!-- Pillar 1: Treaty for Our Only Home -->
      <div class="pillar-card pillar-hardware">
        <div class="pillar-header">
          <div class="pillar-icon">⚖️</div>
          <div class="pillar-number">1</div>
          <div class="pillar-label">{$t('home.threePillars.pillar1.label')}</div>
        </div>
        <h3 class="pillar-title">{$t('home.threePillars.pillar1.title')}</h3>
        <p class="pillar-description">
          {$t('home.threePillars.pillar1.description')}
        </p>
        <a href="{base}/frameworks/treaty-for-our-only-home" class="pillar-link">
          {$t('home.threePillars.pillar1.link')}
        </a>
      </div>

      <!-- Pillar 2: Indigenous Governance -->
      <div class="pillar-card pillar-heart">
        <div class="pillar-header">
          <div class="pillar-icon">🪶</div>
          <div class="pillar-number">2</div>
          <div class="pillar-label">{$t('home.threePillars.pillar2.label')}</div>
        </div>
        <h3 class="pillar-title">{$t('home.threePillars.pillar2.title')}</h3>
        <p class="pillar-description">
          {$t('home.threePillars.pillar2.description')}
        </p>
        <a href="{base}/frameworks/indigenous-governance-and-traditional-knowledge" class="pillar-link">
          {$t('home.threePillars.pillar2.link')}
        </a>
      </div>

      <!-- Pillar 3: Meta-Governance -->
      <div class="pillar-card pillar-nervous-system">
        <div class="pillar-header">
          <div class="pillar-icon">🌐</div>
          <div class="pillar-number">3</div>
          <div class="pillar-label">{$t('home.threePillars.pillar3.label')}</div>
        </div>
        <h3 class="pillar-title">{$t('home.threePillars.pillar3.title')}</h3>
        <p class="pillar-description">
          {$t('home.threePillars.pillar3.description')}
        </p>
        <a href="{base}/frameworks/meta-governance" class="pillar-link">
          {$t('home.threePillars.pillar3.link')}
        </a>
      </div>

    </div>

    <div class="pillars-integration">
      <h3 class="integration-title">{$t('home.threePillars.integration.title')}</h3>
      <div class="integration-flow">
        <div class="flow-item">
          <span class="flow-emoji">🪶</span>
          <span class="flow-text">{$t('home.threePillars.integration.flow1')}</span>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-item">
          <span class="flow-emoji">⚖️</span>
          <span class="flow-text">{$t('home.threePillars.integration.flow2')}</span>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-item">
          <span class="flow-emoji">🌐</span>
          <span class="flow-text">{$t('home.threePillars.integration.flow3')}</span>
        </div>
      </div>
      <p class="integration-note">
        {$t('home.threePillars.integration.note')}
      </p>
    </div>

  </div>
</section>

{#if ref_ubtk}
  <!-- Featured Framework: Aegis Protocol Section -->
  <section class="featured-framework-section">
    <div class="container">
      <div class="featured-framework-container">
        
        <!-- Header -->
        <div class="featured-header">
          <h2 class="featured-title">{$t('home.featuredFramework.heading')}</h2>
          <p class="featured-intro">{$t('home.featuredFramework.intro')}</p>
        </div>

        <!-- Content Grid -->
        <div class="featured-content-grid">
          
          <!-- Left Column: Key Points -->
          <div class="featured-points">
            <div class="point-item">
              <div class="point-icon">🌍</div>
              <p class="point-text">{$t('home.featuredFramework.point1')}</p>
            </div>
            
            <div class="point-item">
              <div class="point-icon">🛰️</div>
              <p class="point-text">{$t('home.featuredFramework.point2')}</p>
            </div>
            
            <div class="point-item">
              <div class="point-icon">⚖️</div>
              <p class="point-text">{$t('home.featuredFramework.point3')}</p>
            </div>
            
            <div class="point-item">
              <div class="point-icon">🤝</div>
              <p class="point-text">{$t('home.featuredFramework.point4')}</p>
            </div>
          </div>

          <!-- Right Column: Highlight & CTA -->
          <div class="featured-action">
            <div class="highlight-box">
              <div class="highlight-icon">⚡</div>
              <p class="highlight-text">{$t('home.featuredFramework.highlight')}</p>
            </div>
            
            <div class="cta-container">
              <a 
                href="https://www.globalgovernanceframeworks.org/frameworks/aegis-protocol"
                target="_blank"
                rel="noopener noreferrer"
                class="featured-cta-button"
              >
                {$t('home.featuredFramework.cta')}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <p class="cta-subtitle">{$t('home.featuredFramework.ctaSubtitle')}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
{/if}

<!-- Interactive Framework Constellation Section -->
<section class="constellation-section">
  <div class="hero-container">
    
    <div class="constellation-header">
      <h2 class="constellation-title">{$t('home.constellation.title')}</h2>
      <p class="constellation-subtitle">
        {$t('home.constellation.subtitle')}
      </p>
    </div>

    <!-- Constellation Layout: Legend + Chart + Info Panel -->
    <div class="constellation-layout">
      
      <!-- Left Column: Legend + Explore Button -->
      <div class="left-column">
        <!-- Tier Legend -->
        <div class="tier-legend">
          <h3 class="legend-title">{$t('common.ui.frameworkTiers') || 'Framework Tiers'}</h3>
          <div class="legend-item">
            <div class="legend-dot tier-0-dot"></div>
            <div class="legend-content">
              <div class="legend-name tier-0-text">{$t('framework.tier.0.title') || 'Tier 0: Global Institutional Reform'}</div>
            </div>
          </div>
          <div class="legend-item">
            <div class="legend-dot tier-1-dot"></div>
            <div class="legend-content">
              <div class="legend-name tier-1-text">{$t('framework.tier.1.title') || 'Tier 1: Urgent Global Stability & Justice'}</div>
            </div>
          </div>
          <div class="legend-item">
            <div class="legend-dot tier-2-dot"></div>
            <div class="legend-content">
              <div class="legend-name tier-2-text">{$t('framework.tier.2.title') || 'Tier 2: Systems for Long-Term Thriving'}</div>
            </div>
          </div>
          <div class="legend-item">
            <div class="legend-dot tier-3-dot"></div>
            <div class="legend-content">
              <div class="legend-name tier-3-text">{$t('framework.tier.3.title') || 'Tier 3: Equity, Culture & Future Generations'}</div>
            </div>
          </div>
          <div class="legend-item">
            <div class="legend-dot tier-4-dot"></div>
            <div class="legend-content">
              <div class="legend-name tier-4-text">{$t('framework.tier.4.title') || 'Tier 4: Visionary & Meta Governance'}</div>
            </div>
          </div>
        </div>

        <!-- Explore Button -->
        <div class="explore-button-container">
          <a href="{base}/frameworks" class="explore-button">
            {$t('home.cta') || 'Explore the Frameworks'}
          </a>
        </div>
      </div>

      <!-- Right Column: Interactive Framework Constellation -->
      <div class="constellation-column">
        <FrameworkConstellation 
          {hoveredFramework} 
          {activeFramework} 
          {isMobile}
          on:nodeClick={handleNodeClick}
          on:nodeHover={handleNodeHover}
          on:nodeLeave={handleNodeLeave}
          on:backgroundClick={handleBackgroundClick}
        />
      </div>

    </div>

    <!-- Wide Description Panel - Below the constellation -->
    {#if currentHoveredFramework}
      <div class="wide-description-panel">
        <!-- Show golden tagline with click instruction if available -->
        {#if getFrameworkTagline(currentHoveredFramework.slug.replace(/-/g, ''))}
          <p class="framework-tagline">
            {getFrameworkTagline(currentHoveredFramework.slug.replace(/-/g, ''))}
            <span class="click-instruction-inline">
              ({$t('common.ui.clickToVisit') || 'click to visit'})
            </span>
          </p>
        {:else}
          <!-- If no tagline, show click instruction as the tagline -->
          <p class="framework-tagline click-instruction-only">
            {$t('common.ui.clickOnTheNode') || 'Click on the node to visit the framework'}
          </p>
        {/if}
        <div class="description-content">
          <p class="framework-description">{getFrameworkDescription(currentHoveredFramework.slug.replace(/-/g, ''))}</p>
          
          {#if isMobile && activeFramework === currentHoveredFramework.slug}
            <p class="mobile-hint">👆 {$t('common.ui.tapAgainToExplore') || 'Tap again to explore this framework'}</p>
          {/if}
        </div>
      </div>
    {:else}
      <div class="wide-description-placeholder">
        <p>{$t('common.ui.hoverToExplore') || 'Hover to explore frameworks'}</p>
      </div>
    {/if}

  </div>
</section>

<!-- Enhanced Find Your Place Section -->
<section class="findyourplace-section">
  <div class="container">
    <div class="findyourplace-layout">
      
      <!-- Content Column -->
      <div class="findyourplace-content">
        <h2 class="findyourplace-title">{$t('home.findYourPlace.title')}</h2>
        <p class="citizenship-lead">{$t('home.findYourPlace.lead')}</p>
        
        <!-- Quick Quiz Starter or Results -->
        <div class="quick-quiz-starter">
          {#if !hasCompletedQuiz}
            <h3 class="quiz-starter-title">{$t('home.findYourPlace.quickStart.title', 'Start Your Global Citizenship Journey')}</h3>
            <p class="quiz-starter-subtitle">{$t('home.findYourPlace.quickStart.subtitle', 'Answer a quick question to discover your personalized path')}</p>
            
            <div class="quiz-question-preview">
              <h4 class="question-text">{$t('findYourPlace.quiz.questions.values.question', 'What global challenges matter most to you?')}</h4>
              
              <div class="quiz-options-grid">
                <a href="{base}/quiz?start=climate" class="quiz-option climate">
                  <div class="option-icon">🌍</div>
                  <div class="option-content">
                    <h5>{$t('findYourPlace.quiz.questions.values.options.climate.title', 'Climate & Environment')}</h5>
                    <p>{$t('findYourPlace.quiz.questions.values.options.climate.description', 'Protecting our planet and building sustainable systems')}</p>
                  </div>
                </a>
                
                <a href="{base}/quiz?start=justice" class="quiz-option justice">
                  <div class="option-icon">⚖️</div>
                  <div class="option-content">
                    <h5>{$t('findYourPlace.quiz.questions.values.options.justice.title', 'Justice & Equality')}</h5>
                    <p>{$t('findYourPlace.quiz.questions.values.options.justice.description', 'Fighting for fairness and human rights globally')}</p>
                  </div>
                </a>
                
                <a href="{base}/quiz?start=technology" class="quiz-option technology">
                  <div class="option-icon">⚡</div>
                  <div class="option-content">
                    <h5>{$t('findYourPlace.quiz.questions.values.options.technology.title', 'Technology & Innovation')}</h5>
                    <p>{$t('findYourPlace.quiz.questions.values.options.technology.description', 'Using technology to solve global challenges')}</p>
                  </div>
                </a>
                
                <a href="{base}/quiz?start=community" class="quiz-option community">
                  <div class="option-icon">🤝</div>
                  <div class="option-content">
                    <h5>{$t('findYourPlace.quiz.questions.values.options.community.title', 'Community & Culture')}</h5>
                    <p>{$t('findYourPlace.quiz.questions.values.options.community.description', 'Building strong communities and preserving culture')}</p>
                  </div>
                </a>
                
                <a href="{base}/quiz?start=systems" class="quiz-option systems highlighted">
                  <div class="option-icon">🏛️</div>
                  <div class="option-content">
                    <h5>{$t('findYourPlace.quiz.questions.values.options.systems.title', 'Systems Thinking')}</h5>
                    <p>{$t('findYourPlace.quiz.questions.values.options.systems.description', 'Understanding how everything connects globally')}</p>
                  </div>
                  <div class="highlight-badge">
                    ⭐ {$t('findYourPlace.quiz.foundationBadge', 'Foundation')}
                  </div>
                </a>
              </div>
              
              <div class="quiz-starter-footer">
                <p class="quiz-progress-text">{$t('home.findYourPlace.quickStart.progressText', 'This is question 1 of 3 - takes less than 2 minutes')}</p>
              </div>
            </div>
          {:else}
            <!-- Quiz Completed State -->
            <div class="quiz-completed-state">
              <div class="completed-header">
                <div class="completed-icon">🎯</div>
                <h3 class="completed-title">{$t('home.findYourPlace.completed.title', 'Your Global Citizenship Path')}</h3>
                <p class="completed-subtitle">{$t('home.findYourPlace.completed.subtitle', 'You\'ve discovered your personalized framework recommendations')}</p>
              </div>
              
              {#if quizResults?.recommendedFrameworks?.length > 0}
                <div class="top-recommendations">
                  <h4 class="recommendations-title">{$t('home.findYourPlace.completed.topRecommendations', 'Your Top Recommendations:')}</h4>
                  <div class="recommendation-chips">
                    {#each quizResults.recommendedFrameworks.slice(0, 3) as framework}
                      <div class="recommendation-chip">
                        <span class="chip-icon">{framework.emoji || '📋'}</span>
                        <span class="chip-title">{$t(framework.titleKey, framework.slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
              
              <div class="completed-actions">
                <a href="{base}/quiz" class="view-results-button">
                  {$t('home.findYourPlace.completed.viewResults', 'View Full Results')} →
                </a>
                <button 
                  class="retake-quiz-button" 
                  on:click={() => {
                    localStorage.removeItem('globalCitizenshipQuiz');
                    hasCompletedQuiz = false;
                    quizResults = null;
                  }}
                >
                  {$t('home.findYourPlace.completed.retakeQuiz', 'Retake Quiz')}
                </button>
              </div>
            </div>
          {/if}
        </div>

        <p class="citizenship-description">{$t('home.findYourPlace.description')}</p>
      </div>
    </div>
  </div>
</section>

<!-- Emerging Global Possibilities Section -->
<section class="possibilities-section">
  <div class="container">
    <div class="possibilities-header">
      <h2 class="possibilities-title">{$t('home.emergingPossibilities.heading')}</h2>
      <p class="possibilities-intro">{$t('home.emergingPossibilities.intro')}</p>
    </div>
    
    <div class="possibilities-grid">
      {#if $t('home.emergingPossibilities.possibilities')}
        {#each Array.isArray($t('home.emergingPossibilities.possibilities')) ? $t('home.emergingPossibilities.possibilities') : [] as possibility, i}
          <div class="possibility-card">
            <div class="possibility-content">
              <div class="possibility-icon possibility-icon-{i}">
                {#if i === 0}
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg blue-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                {:else if i === 1}
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg green-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                {:else if i === 2}
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg orange-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg purple-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                {/if}
              </div>
              <div class="possibility-text">
                <h3 class="possibility-heading">{possibility.title}</h3>
                <p class="possibility-description">{possibility.description}</p>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="loading-state">
          <p>{$t('common.ui.loading')}...</p>
        </div>
      {/if}
    </div>
  </div>
</section>

<!-- Performance Teaser Section 
<section class="performance-section">
  <div class="performance-container">
    <h2 class="performance-title">{$t('home.performanceTeaser.heading')}</h2>
    <p class="performance-text">{$t('home.performanceTeaser.text')}</p>

    <a href="{base}/frameworks-performance" class="performance-button">
      {$t('home.performanceTeaser.button')}
    </a>
  </div>
</section> -->

<!-- Call to Action Section -->

<!-- Collapsible Info Sections -->
<section class="info-sections">
  <div class="container">
    <InfoBox 
      title={$t('home.whyExists.title')} 
      isExpanded={whyExistsExpanded}
      on:toggle={toggleWhyExists}
    >
      <p>{$t('home.whyExists.content')}</p>
    </InfoBox>

    <InfoBox 
      title={$t('home.language.title')} 
      isExpanded={languageExpanded}
      on:toggle={toggleLanguage}
    >
      <p>{$t('home.language.content')}</p>
    </InfoBox>
  </div>
</section>

<!-- Additional Info Section -->
<section class="additional-info-section">
  <div class="container">
    <h2 class="section-heading">{$t('home.additionalInfo.heading')}</h2>
    <p class="section-intro">{$t('home.additionalInfo.paragraph1')}</p>
    <p class="section-text">{$t('home.additionalInfo.paragraph2')}</p>
    <ul class="info-list">
      {#each $t('home.additionalInfo.listItems') as item}
        <li>{item}</li>
      {/each}
    </ul>
    <p class="section-text">{$t('home.additionalInfo.paragraph3')}</p>
  </div>
</section>

<!-- Get Involved Section -->
<section class="get-involved-section">
  <div class="container">
    <h2 class="section-heading">{$t('home.getInvolved.title')}</h2>
    <p class="section-subtitle">{$t('home.getInvolved.subtitle')}</p>
    <p class="section-intro">{$t('home.getInvolved.intro')}</p>
    
    <div class="involvement-grid">
      <div class="involvement-card">
        <h3>{$t('home.getInvolved.translate.title')}</h3>
        <p>{$t('home.getInvolved.translate.description')}</p>
        <a href="{base}/get-involved/translations" class="involvement-cta">
          {$t('home.getInvolved.translate.cta')}
        </a>
      </div>
      
      <div class="involvement-card">
        <h3>{$t('home.getInvolved.develop.title')}</h3>
        <p>{$t('home.getInvolved.develop.description')}</p>
        <a href="{base}/get-involved/website" class="involvement-cta">
          {$t('home.getInvolved.develop.cta')}
        </a>
      </div>
      
      <div class="involvement-card">
        <h3>{$t('home.getInvolved.advocate.title')}</h3>
        <p>{$t('home.getInvolved.advocate.description')}</p>
        <a href="{base}/get-involved/outreach" class="involvement-cta">
          {$t('home.getInvolved.advocate.cta')}
        </a>
      </div>
      
      <div class="involvement-card">
        <h3>{$t('home.getInvolved.implement.title')}</h3>
        <p>{$t('home.getInvolved.implement.description')}</p>
        <a href="{base}/frameworks" class="involvement-cta">
          {$t('home.getInvolved.implement.cta')}
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Ethical Impact Dashboard Section
<section class="ethical-impact-section">
  <div class="container">
    <h2 class="section-heading">{$t('home.ethicalImpact.title')}</h2>
    <p class="section-intro">{$t('home.ethicalImpact.intro')}</p>
    <EthicalImpactDashboard />
  </div>
</section> -->

<!-- Final Call to Action Section -->
<section class="final-cta-section">
  <div class="container">
    <div class="final-cta-content">
      <h2 class="final-cta-title">{$t('home.finalCTA.title')}</h2>
      <p class="final-cta-text">{$t('home.finalCTA.description')}</p>
      <div class="final-cta-buttons">
        <a href="{base}/overview" class="primary-cta-button">
          {$t('home.finalCTA.primaryButton')}
        </a>
        <a href="{base}/frameworks" class="secondary-cta-button">
          {$t('home.finalCTA.secondaryButton')}
        </a>
        <a href="{base}/get-involved" class="tertiary-cta-button">
          {$t('home.finalCTA.tertiaryButton')}
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  /* Unity Beyond the Known Welcome Banner */
  .welcome-banner {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%);
    color: white;
    padding: 1rem 2rem;
    margin-bottom: 2rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
    border: 2px solid rgba(251, 191, 36, 0.3);
    box-shadow: 0 4px 20px rgba(30, 27, 75, 0.3);
    animation: welcomeGlow 3s ease-in-out infinite alternate;
  }

  .welcome-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
    animation: shimmer 3s infinite;
  }

  .welcome-banner::after {
    content: '🌟';
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    font-size: 1.5rem;
    animation: twinkle 2s ease-in-out infinite alternate;
  }

  .welcome-banner p {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 1.6;
    position: relative;
    z-index: 2;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    padding-right: 3rem; /* Space for the star */
  }

  /* Subtle glow animation */
  @keyframes welcomeGlow {
    0% {
      box-shadow: 0 4px 20px rgba(30, 27, 75, 0.3), 0 0 20px rgba(251, 191, 36, 0.2);
    }
    100% {
      box-shadow: 0 6px 25px rgba(30, 27, 75, 0.4), 0 0 30px rgba(251, 191, 36, 0.3);
    }
  }

  /* Shimmer effect */
  @keyframes shimmer {
    0% {
      left: -100%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: 100%;
    }
  }

  /* Star twinkle */
  @keyframes twinkle {
    0% {
      opacity: 0.6;
      transform: scale(1);
    }
    100% {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .welcome-banner {
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 0.75rem;
    }

    .welcome-banner p {
      font-size: 1rem;
      padding-right: 2.5rem;
    }

    .welcome-banner::after {
      top: 0.75rem;
      right: 1rem;
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    .welcome-banner {
      padding: 0.875rem 1rem;
      margin-bottom: 1rem;
    }

    .welcome-banner p {
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }

  /* Base Styles */
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

  /* Hero Section - Simplified */
  .hero-section {
    padding: 3rem 0 2rem 0; /* Reduced padding since main content moved below */
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%);
    color: white;
  }

  .hero-content {
    text-align: center;
  }

  .hero-logo {
    height: 80px; /* Slightly smaller */
    width: 80px;
    margin: 0 auto 1.5rem auto;
    opacity: 0.9;
  }

  .hero-title {
    font-size: 2.25rem; /* Slightly smaller */
    line-height: 1.2;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    font-size: 1.35rem;
    color: #ddd6fe;
    margin-bottom: 1rem;
    font-weight: 300;
  }

  .hero-tagline {
    font-size: 1.6rem;
    color: #fbbf24;
    margin-bottom: 0;
    font-weight: 600;
  }

  /* NEW: Three Pillars Section */
  .three-pillars-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .pillars-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .pillars-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #2B4B8C 0%, #6B5CA5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .pillars-intro {
    font-size: 1.25rem;
    color: #475569;
    line-height: 1.7;
    margin-bottom: 0;
  }

  .pillars-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  @media (min-width: 768px) {
    .pillars-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
  }

  .pillar-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .pillar-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--pillar-color-1), var(--pillar-color-2));
  }

  .pillar-hardware {
    --pillar-color-1: #2B4B8C;
    --pillar-color-2: #3B82F6;
  }

  .pillar-heart {
    --pillar-color-1: #065F46;
    --pillar-color-2: #059669;
  }

  .pillar-nervous-system {
    --pillar-color-1: #7C2D12;
    --pillar-color-2: #EA580C;
  }

  .pillar-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  .pillar-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .pillar-icon {
    font-size: 2rem;
  }

  .pillar-number {
    background: linear-gradient(135deg, var(--pillar-color-1), var(--pillar-color-2));
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .pillar-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pillar-title {
    font-size: 1.375rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .pillar-description {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .pillar-link {
    color: var(--pillar-color-1);
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s ease;
  }

  .pillar-link:hover {
    color: var(--pillar-color-2);
    transform: translateX(4px);
  }

  /* Pillars Integration Flow */
  .pillars-integration {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  .integration-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .integration-flow {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  /* Featured Framework Section */
  .featured-framework-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    color: white;
    position: relative;
    overflow: hidden;
  }

  .featured-framework-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/stars-pattern.svg') repeat;
    opacity: 0.1;
    pointer-events: none;
  }

  .featured-framework-container {
    position: relative;
    z-index: 2;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border-radius: 1.5rem;
    padding: 3rem;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .featured-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .featured-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
  }

  .featured-intro {
    font-size: 1.25rem;
    color: #e2e8f0;
    line-height: 1.7;
    margin: 0;
  }

  .featured-content-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: start;
  }

  @media (min-width: 1024px) {
    .featured-content-grid {
      grid-template-columns: 1.2fr 0.8fr;
      gap: 4rem;
    }
  }

  /* Featured Points */
  .featured-points {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .point-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .point-item:hover {
    transform: translateX(8px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
    border-color: rgba(251, 191, 36, 0.3);
  }

  .point-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
  }

  .point-text {
    color: #f1f5f9;
    line-height: 1.6;
    margin: 0;
    font-size: 1.05rem;
  }

  /* Featured Action Column */
  .featured-action {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }

  .highlight-box {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e293b;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 8px 20px rgba(251, 191, 36, 0.3);
    position: relative;
    overflow: hidden;
  }

  .highlight-box::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  }

  .highlight-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .highlight-text {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.5;
    margin: 0;
    position: relative;
    z-index: 2;
  }

  .cta-container {
    text-align: center;
    width: 100%;
  }

  .featured-cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    text-decoration: none;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .featured-cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  .featured-cta-button:hover::before {
    left: 100%;
  }

  .featured-cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(59, 130, 246, 0.4);
    border-color: rgba(251, 191, 36, 0.5);
  }

  .featured-cta-button svg {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.3s ease;
  }

  .featured-cta-button:hover svg {
    transform: translateX(4px);
  }

  .cta-subtitle {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #cbd5e1;
    font-style: italic;
    margin-bottom: 0;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .featured-framework-container {
      padding: 2rem;
    }

    .featured-title {
      font-size: 2rem;
    }

    .featured-intro {
      font-size: 1.1rem;
    }

    .featured-content-grid {
      gap: 2rem;
    }
  }

  @media (max-width: 640px) {
    .featured-framework-container {
      padding: 1.5rem;
    }

    .featured-title {
      font-size: 1.75rem;
    }

    .featured-intro {
      font-size: 1rem;
    }

    .point-item {
      padding: 1rem;
    }

    .point-icon {
      width: 35px;
      height: 35px;
      font-size: 1.25rem;
    }

    .point-text {
      font-size: 0.95rem;
    }

    .highlight-box {
      padding: 1.5rem;
    }

    .highlight-text {
      font-size: 1rem;
    }

    .featured-cta-button {
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
    }
  }

  @media (min-width: 768px) {
    .integration-flow {
      flex-direction: row;
      justify-content: center;
      gap: 1.5rem;
    }
  }

  .flow-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 200px;
  }

  @media (min-width: 768px) {
    .flow-item {
      flex-direction: row;
      max-width: none;
      text-align: left;
    }
  }

  .flow-emoji {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 768px) {
    .flow-emoji {
      margin-bottom: 0;
      margin-right: 0.5rem;
    }
  }

  .flow-text {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.4;
  }

  .flow-arrow {
    font-size: 1.5rem;
    color: #94a3b8;
    transform: rotate(90deg);
  }

  @media (min-width: 768px) {
    .flow-arrow {
      transform: rotate(0deg);
    }
  }

  .integration-note {
    color: #64748b;
    text-align: center;
    font-style: italic;
    margin: 0;
    line-height: 1.6;
  }

  /* Constellation Section - Updated */
  .constellation-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%);
    color: white;
  }

  .constellation-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .constellation-title {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
  }

  .constellation-subtitle {
    font-size: 1.2rem;
    color: #cbd5e1;
    line-height: 1.6;
    margin: 0;
  }

  /* Constellation Layout */
  .constellation-layout {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .left-column {
    min-width: 300px;
    flex: 0 0 320px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .constellation-column {
    flex: 1;
    min-width: 600px;
  }

  .tier-legend {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .legend-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #e2e8f0;
  }

  .legend-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .legend-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 0.1rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }

  .tier-0-dot { background-color: #fbbf24; }
  .tier-1-dot { background-color: #60a5fa; }
  .tier-2-dot { background-color: #34d399; }
  .tier-3-dot { background-color: #a78bfa; }
  .tier-4-dot { background-color: #f472b6; }

  .legend-content {
    flex: 1;
  }

  .legend-name {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }

  .tier-0-text { color: #fbbf24 !important; }
  .tier-1-text { color: #60a5fa !important; }
  .tier-2-text { color: #34d399 !important; }
  .tier-3-text { color: #a78bfa !important; }
  .tier-4-text { color: #f472b6 !important; }

  /* Explore Button Container */
  .explore-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .explore-button {
    display: inline-block;
    background-color: #fbbf24;
    color: #1e1b4b;
    font-weight: 700;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
    transition: all 0.3s ease;
    font-size: 1.1rem;
    text-align: center;
    min-width: 200px;
    border: 2px solid #fbbf24;
  }

  .explore-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
    background-color: #f59e0b;
    border-color: #f59e0b;
  }

  /* Wide Description Panel */
  .wide-description-panel {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 2rem;
    transition: all 0.3s ease-out;
    max-width: 100%;
    min-height: 140px;
  }

  .wide-description-placeholder {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.6);
    padding: 2rem;
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    text-align: center;
    margin-top: 2rem;
    font-style: italic;
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-out;
  }

  .wide-description-placeholder p {
    margin: 0;
    font-size: 1.1rem;
  }

  .description-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .framework-tagline {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #fbbf24;
    font-style: italic;
    line-height: 1.4;
    text-align: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(251, 191, 36, 0.4);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transition: color 0.3s ease;
  }

  .framework-description {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.95);
    text-align: left;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    transition: color 0.3s ease;
  }

  .mobile-hint {
    margin-top: 1rem !important;
    font-size: 0.9rem !important;
    color: #fbbf24 !important;
    font-style: italic;
    text-align: center;
    padding: 0.75rem;
    background: rgba(251, 191, 36, 0.15);
    border-radius: 0.5rem;
    border: 1px solid rgba(251, 191, 36, 0.3);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  /* Info Boxes Section - Moved and simplified */
  .info-boxes-section {
    padding: 2rem 0;
    background-color: #f8fafc;
  }

  .collapsible-info-box {
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: white;
    border: 1px solid #e5e7eb;
    margin-bottom: 1rem;
  }

  .info-box-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .info-box-header:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .why-exists-header {
    background-color: #eff6ff;
    border-bottom: 1px solid #dbeafe;
  }

  .why-exists-header:hover {
    background-color: #eef5ff;
  }

  .language-header {
    background-color: #fffbeb;
    border-bottom: 1px solid #fef3c7;
  }

  .language-header:hover {
    background-color: #fffaeb;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-content .icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .header-content h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
  }

  .why-exists-header h3 {
    color: #1e40af;
  }

  .language-header h3 {
    color: #92400e;
  }

  .toggle-icon {
    font-size: 0.875rem;
    color: #6b7280;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .toggle-icon.rotated {
    transform: rotate(180deg);
  }

  .info-box-content {
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    animation: slideDown 0.3s ease-out;
  }

  .why-exists-content {
    background-color: #eff6ff;
    border-top-color: #dbeafe;
  }

  .language-content {
    background-color: #fffbeb;
    border-top-color: #fef3c7;
  }

  .info-box-content p {
    margin-bottom: 1rem;
    color: #374151;
    line-height: 1.6;
  }

  .info-box-content p:last-child {
    margin-bottom: 0;
  }

  .treaty-link {
    color: #1e40af !important;
    text-decoration: underline !important;
    font-weight: 500 !important;
  }

  .treaty-link-alt {
    color: #92400e !important;
    text-decoration: underline !important;
    font-weight: 500 !important;
  }

  .button-center {
    text-align: center;
    margin-top: 1.5rem;
  }

  .translation-button {
    display: inline-block;
    background-color: #B8860B;
    color: white;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.2s;
  }

  /* Find Your Place Section */
  .findyourplace-section {
    padding: 4rem 0;
    background: linear-gradient(to right, #f0f9ff, #e0f2fe);
  }

  .findyourplace-layout {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 3rem;
  }

  .findyourplace-content {
    flex: 1 1 50%;
    min-width: 320px;
  }

  .findyourplace-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }

  .citizenship-lead {
    font-size: 1.25rem;
    color: #1e40af;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .citizenship-description {
    color: #1e293b;
    font-size: 1rem;
    line-height: 1.6;
  }

  .citizenship-visual {
    flex: 1 1 40%;
    min-width: 320px;
    text-align: center;
  }

  .citizenship-image {
    max-width: 100%;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }

  /* Quiz Styles */
  .quick-quiz-starter {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 1rem;
    padding: 2rem;
    margin: 2rem 0;
    border: 2px solid rgba(59, 130, 246, 0.2);
  }

  .quiz-starter-title {
    font-size: 1.375rem;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .quiz-starter-subtitle {
    font-size: 1rem;
    color: #1e40af;
    text-align: center;
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }

  .quiz-question-preview {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .question-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .quiz-options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .quiz-option {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    position: relative;
    display: block;
  }

  .quiz-option:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .quiz-option.highlighted {
    border-color: #fbbf24;
    background: linear-gradient(135deg, #fef7ed 0%, #fdf2e9 100%);
  }

  .quiz-option.highlighted:hover {
    border-color: #f59e0b;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.25);
  }

  .option-icon {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 0.75rem;
  }

  .option-content h5 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .option-content p {
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.4;
    text-align: center;
    margin: 0;
  }

  .highlight-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #fbbf24;
    color: white;
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
  }

  .quiz-starter-footer {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .quiz-progress-text {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .alternative-link {
    font-size: 0.9rem;
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .alternative-link:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }

  /* Quiz Completed State */
  .quiz-completed-state {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    text-align: center;
  }

  .completed-header {
    margin-bottom: 1.5rem;
  }

  .completed-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .completed-title {
    font-size: 1.375rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .completed-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }

  .top-recommendations {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    border-radius: 0.75rem;
    border: 1px solid #bbf7d0;
  }

  .recommendations-title {
    font-size: 1rem;
    font-weight: 600;
    color: #166534;
    margin-bottom: 1rem;
  }

  .recommendation-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }

  .recommendation-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    border: 1px solid #16a34a;
    border-radius: 1.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #166534;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .chip-icon {
    font-size: 1rem;
  }

  .chip-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  .completed-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .view-results-button {
    background: #2563eb;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .view-results-button:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  }

  .retake-quiz-button {
    background: transparent;
    color: #6b7280;
    border: 2px solid #e5e7eb;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retake-quiz-button:hover {
    border-color: #d1d5db;
    color: #374151;
    background: #f9fafb;
  }

  /* Possibilities Section */
  .possibilities-section {
    padding: 4rem 0;
    background-color: white;
  }

  .possibilities-header {
    max-width: 56rem;
    margin: 0 auto;
    text-align: center;
    margin-bottom: 3rem;
  }

  .possibilities-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2B4B8C;
    margin-bottom: 1rem;
  }

 .possibilities-intro {
    font-size: 1.125rem;
    color: #4b5563;
    max-width: 42rem;
    margin: 0 auto;
  }

  .possibilities-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .possibility-card {
    background-color: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border: 1px solid #e5e7eb;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .possibility-content {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .possibility-icon {
    flex-shrink: 0;
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .possibility-icon-0 { background-color: #e9ecf6; }
  .possibility-icon-1 { background-color: #e9f2e9; }
  .possibility-icon-2 { background-color: #f7f1e3; }
  .possibility-icon-3 { background-color: #e9ecf6; }

  .icon-svg {
    width: 2rem;
    height: 2rem;
  }

  .blue-icon { color: #2B4B8C; }
  .green-icon { color: #2D5F2D; }
  .orange-icon { color: #B8860B; }
  .purple-icon { color: #6B5CA5; }

  .possibility-text {
    flex: 1;
  }

  .possibility-heading {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #111827;
  }

  .possibility-description {
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }

  .loading-state {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  /* Performance Section */
  .performance-section {
    padding: 4rem 1rem;
    background-color: #f9fafb;
  }

  .performance-container {
    max-width: 42rem;
    margin: 0 auto;
    text-align: center;
    background-color: white;
    padding: 2.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border: 1px solid #e5e7eb;
  }

  .performance-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2B4B8C;
    margin-bottom: 1rem;
  }

  .performance-text {
    font-size: 1.125rem;
    color: #4b5563;
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  .performance-button {
    display: inline-block;
    background-color: #2B4B8C;
    color: white;
    font-weight: 600;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.2s;
  }

  /* Final CTA Section */
  .final-cta-section {
    padding: 4rem 0;
    background: linear-gradient(to bottom right, #2B4B8C, #4B5CA5, #6B5CA5);
    color: white;
  }

  .final-cta-content {
    max-width: 42rem;
    margin: 0 auto;
    text-align: center;
  }

  .final-cta-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .final-cta-text {
    font-size: 1.25rem;
    color: #ffffff;
    margin-bottom: 2.5rem;
  }

  .final-cta-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }

  /* PRIMARY BUTTON - Most important action (Read the Overview) */
  .primary-cta-button {
    width: 100%;
    max-width: 20rem;
    display: inline-block;
    background: linear-gradient(135deg, #2B4B8C 0%, #6B5CA5 100%);
    color: white;
    font-weight: 700;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(43, 75, 140, 0.3);
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .primary-cta-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .primary-cta-button:hover::before {
    left: 100%;
  }

  .primary-cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(43, 75, 140, 0.4);
  }

  /* SECONDARY BUTTON - Important secondary action (Explore the Frameworks) */
  .secondary-cta-button {
    width: 100%;
    max-width: 20rem;
    display: inline-block;
    background-color: #DAA520;
    color: #2B4B8C;
    font-weight: 700;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(218, 165, 32, 0.2);
    transition: all 0.2s;
  }

  .secondary-cta-button:hover {
    background-color: #B8860B;
    color: #1e3a6b;
    transform: translateY(-1px);
    box-shadow: 0 6px 10px rgba(218, 165, 32, 0.3);
  }

  /* TERTIARY BUTTON - Supportive action (Get Involved) */
  .tertiary-cta-button {
    width: 100%;
    max-width: 20rem;
    display: inline-block;
    background-color: white;
    border: 2px solid #6B5CA5;
    color: #6B5CA5;
    font-weight: 700;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(107, 92, 165, 0.1);
  }

  .tertiary-cta-button:hover {
    background-color: #6B5CA5;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(107, 92, 165, 0.2);
  }

  /* Focus states for accessibility */
  .primary-cta-button:focus-visible,
  .secondary-cta-button:focus-visible,
  .tertiary-cta-button:focus-visible,
  .tertiary-cta-button-alt:focus-visible {
    outline: 3px solid #DAA520;
    outline-offset: 2px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .primary-cta-button,
    .secondary-cta-button,
    .tertiary-cta-button,
    .tertiary-cta-button-alt {
      max-width: 100%;
      padding: 0.875rem 1.5rem;
      font-size: 0.95rem;
    }
  }

  /* Animations */
  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      max-height: 1000px;
      transform: translateY(0);
    }
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .left-column {
      min-width: 280px;
      flex: 0 0 300px;
    }
    
    .constellation-column {
      min-width: 500px;
    }
  }

  @media (max-width: 900px) {
    .constellation-layout {
      flex-direction: column;
      align-items: center;
    }
    
    .left-column {
      min-width: 100%;
      max-width: 600px;
      flex: none;
    }

    .constellation-column {
      min-width: 100%;
      flex: none;
    }

    .findyourplace-layout {
      flex-direction: column;
    }

    .explore-button {
      max-width: 100%;
    }

    .wide-description-panel,
    .wide-description-placeholder {
      margin: 1rem auto 0;
      padding: 1.5rem;
    }

    .framework-tagline {
      font-size: 1.1rem;
    }

    .framework-description {
      font-size: 1rem;
    }

    .quiz-options-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .quick-quiz-starter {
      padding: 1.5rem;
    }

    .recommendation-chips {
      flex-direction: column;
      align-items: center;
    }

    .completed-actions {
      flex-direction: column;
      align-items: center;
    }

    .view-results-button,
    .retake-quiz-button {
      width: 100%;
      max-width: 250px;
      justify-content: center;
    }

    .pillars-grid {
      grid-template-columns: 1fr;
    }

    .integration-flow {
      flex-direction: column;
    }

    .flow-arrow {
      transform: rotate(90deg);
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .hero-tagline {
      font-size: 1.5rem;
    }

    .pillars-title {
      font-size: 2rem;
    }

    .constellation-title {
      font-size: 2rem;
    }

    .findyourplace-title       {
      font-size: 2rem;
    }

    .wide-description-panel,
    .wide-description-placeholder {
      padding: 1rem;
    }

    .framework-tagline {
      font-size: 1rem;
    }

    .framework-description {
      font-size: 0.95rem;
    }

    .quick-quiz-starter {
      padding: 1rem;
    }

    .quiz-starter-title {
      font-size: 1.25rem;
    }

    .question-text {
      font-size: 1rem;
    }

    .option-content h5 {
      font-size: 0.9rem;
    }

    .option-content p {
      font-size: 0.75rem;
    }

    .chip-title {
      max-width: 120px;
      font-size: 0.8rem;
    }

    .completed-actions {
      gap: 0.75rem;
    }

    .pillar-card {
      padding: 1.5rem;
    }

    .pillars-integration {
      padding: 1.5rem;
    }
  }

  /* Focus styles for accessibility */
  .info-box-header:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .explore-button:focus {
    outline: 2px solid #fbbf24;
    outline-offset: 2px;
  }

  .pillar-link:focus {
    outline: 2px solid var(--pillar-color-1);
    outline-offset: 2px;
  }

  /* Info Sections Styles */
  .info-sections {
    padding: 4rem 0;
    background-color: #f8f9fa;
  }

  .info-sections .container {
    max-width: 800px;
    margin: 0 auto;
  }

  /* Additional Info Section */
  .additional-info-section {
    padding: 4rem 0;
    background-color: white;
  }

  .additional-info-section .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .section-heading {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2B4B8C;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .section-subtitle {
    font-size: 1.25rem;
    color: #6B5CA5;
    margin-bottom: 1rem;
    text-align: center;
  }

  .section-intro {
    font-size: 1.125rem;
    line-height: 1.8;
    color: #333;
    margin-bottom: 1.5rem;
  }

  .section-text {
    font-size: 1rem;
    line-height: 1.7;
    color: #555;
    margin-bottom: 1rem;
  }

  .info-list {
    list-style-type: disc;
    padding-left: 2rem;
    margin: 1.5rem 0;
  }

  .info-list li {
    font-size: 1rem;
    line-height: 1.7;
    color: #555;
    margin-bottom: 0.5rem;
  }

  /* Get Involved Section */
  .get-involved-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }

  .involvement-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .involvement-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .involvement-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  .involvement-card h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2B4B8C;
    margin-bottom: 1rem;
  }

  .involvement-card p {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
    margin-bottom: 1.5rem;
  }

  .involvement-cta {
    display: inline-block;
    background-color: #DAA520;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .involvement-cta:hover {
    background-color: #B8860B;
  }

  /* Ethical Impact Section */
  .ethical-impact-section {
    padding: 4rem 0;
    background-color: white;
  }

  .ethical-impact-section .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .section-heading {
      font-size: 2rem;
    }

    .involvement-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .info-sections,
    .additional-info-section,
    .get-involved-section,
    .ethical-impact-section {
      padding: 2rem 0;
    }
  }

</style>
