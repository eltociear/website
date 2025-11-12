<!-- src/routes/frameworks/+page.svelte -->
<script>
  import { t } from '$lib/i18n';
  import { base } from '$app/paths';
  import AllFrameworksList from '$lib/components/AllFrameworksList.svelte';

  function scrollToTier(tierNumber) {
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      const element = document.getElementById(`tier-${tierNumber}`);
      if (element) {
        // Temporarily disable smooth scrolling during animation
        element.style.scrollBehavior = 'auto';
        element.scrollIntoView({ block: 'start' });
        
        // Re-enable smooth scrolling after a short delay
        setTimeout(() => {
          element.style.scrollBehavior = 'smooth';
        }, 100);
      }
    });
  }
</script>

<svelte:head>
  <title>{$t('framework.page.title')} - {$t('common.siteName')}</title>
  <meta name="description" content="{$t('framework.page.description')}" />
</svelte:head>

<main>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <div class="hero-content">
        <h1>{$t('framework.hero.title')}</h1>
        <p class="hero-subtitle">{$t('framework.hero.subtitle')}</p>
      </div>
    </div>
  </section>

  <!-- Three Pillars Blueprint Bridge Section -->
  <section class="blueprint-bridge-section">
    <div class="container">
      <div class="blueprint-content">
        <h2 class="blueprint-title">{$t('framework.blueprintBridge.title')}</h2>
        <p class="blueprint-intro">
          {$t('framework.blueprintBridge.intro')}
        </p>
        
        <!-- Compact 3-Pillar Reminder -->
        <div class="pillars-reminder">
          <div class="pillar-card pillar-hardware">
            <div class="pillar-icon">⚖️</div>
            <div class="pillar-content">
              <h3>{$t('framework.blueprintBridge.pillars.hardware.title')}</h3>
              <p>{$t('framework.blueprintBridge.pillars.hardware.framework')}</p>
            </div>
          </div>
          
          <div class="pillar-card pillar-heart">
            <div class="pillar-icon">🪶</div>
            <div class="pillar-content">
              <h3>{$t('framework.blueprintBridge.pillars.heart.title')}</h3>
              <p>{$t('framework.blueprintBridge.pillars.heart.framework')}</p>
            </div>
          </div>
          
          <div class="pillar-card pillar-nervous-system">
            <div class="pillar-icon">🌐</div>
            <div class="pillar-content">
              <h3>{$t('framework.blueprintBridge.pillars.nervousSystem.title')}</h3>
              <p>{$t('framework.blueprintBridge.pillars.nervousSystem.framework')}</p>
            </div>
          </div>
        </div>
        
        <div class="transition-explanation">
          <p>{$t('framework.blueprintBridge.transition')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Implementation Frameworks Section -->
  <section class="implementation-section">
    <div class="container">
      
      <!-- Section Header -->
      <div class="section-header">
        <h2 class="section-title">{$t('framework.implementation.title')}</h2>
        <p class="section-intro">{$t('framework.implementation.intro')}</p>
      </div>
      
      <!-- Tiered Roadmap Explanation -->
      <div class="roadmap-explanation">
        <div class="roadmap-header">
          <div class="roadmap-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3>{$t('framework.implementation.roadmap.title')}</h3>
        </div>
        <p class="roadmap-description">{$t('framework.implementation.roadmap.description')}</p>
        
        <!-- Tier Navigation Buttons -->
        <div class="tier-navigation">
          <button 
            class="tier-nav-button tier-0-button"
            on:click={() => scrollToTier(0)}
          >
            <div class="tier-badge tier-0-badge">
              {$t('framework.implementation.roadmap.tierLabel')} 0
            </div>
            <span class="tier-name">{$t('framework.implementation.roadmap.tiers.tier0')}</span>
          </button>
          
          <button 
            class="tier-nav-button tier-1-button"
            on:click={() => scrollToTier(1)}
          >
            <div class="tier-badge tier-1-badge">
              {$t('framework.implementation.roadmap.tierLabel')} 1
            </div>
            <span class="tier-name">{$t('framework.implementation.roadmap.tiers.tier1')}</span>
          </button>
          
          <button 
            class="tier-nav-button tier-2-button"
            on:click={() => scrollToTier(2)}
          >
            <div class="tier-badge tier-2-badge">
              {$t('framework.implementation.roadmap.tierLabel')} 2
            </div>
            <span class="tier-name">{$t('framework.implementation.roadmap.tiers.tier2')}</span>
          </button>
          
          <button 
            class="tier-nav-button tier-3-button"
            on:click={() => scrollToTier(3)}
          >
            <div class="tier-badge tier-3-badge">
              {$t('framework.implementation.roadmap.tierLabel')} 3
            </div>
            <span class="tier-name">{$t('framework.implementation.roadmap.tiers.tier3')}</span>
          </button>
          
          <button 
            class="tier-nav-button tier-4-button"
            on:click={() => scrollToTier(4)}
          >
            <div class="tier-badge tier-4-badge">
              {$t('framework.implementation.roadmap.tierLabel')} 4
            </div>
            <span class="tier-name">{$t('framework.implementation.roadmap.tiers.tier4')}</span>
          </button>
        </div>
      </div>

      <!-- Framework Groups Overview -->
      <div class="groups-overview">
        <h3 class="groups-title">{$t('framework.implementation.groups.title')}</h3>
        <p class="groups-intro">{$t('framework.implementation.groups.intro')}</p>
        
        <div class="groups-grid card-grid">
          <div class="group-card planetaryhealth">
            <div class="group-icon">🌱</div>
            <div class="group-content">
              <h4>{$t('framework.groups.planetaryHealthResilience.title')}</h4>
              <p>{$t('framework.groups.planetaryHealthResilience.description')}</p>
            </div>
          </div>
          
          <div class="group-card socialfabric">
            <div class="group-icon">⚖️</div>
            <div class="group-content">
              <h4>{$t('framework.groups.socialFabricJustice.title')}</h4>
              <p>{$t('framework.groups.socialFabricJustice.description')}</p>
            </div>
          </div>
          
          <div class="group-card economicsystems">
            <div class="group-icon">💱</div>
            <div class="group-content">
              <h4>{$t('framework.groups.globalEconomicSystems.title')}</h4>
              <p>{$t('framework.groups.globalEconomicSystems.description')}</p>
            </div>
          </div>
          
          <div class="group-card ecological">
            <div class="group-icon">🌿</div>
            <div class="group-content">
              <h4>{$t('framework.groups.ecologicalSystems.title')}</h4>
              <p>{$t('framework.groups.ecologicalSystems.description')}</p>
            </div>
          </div>
          
          <div class="group-card humansocial">
            <div class="group-icon">🎓</div>
            <div class="group-content">
              <h4>{$t('framework.groups.humanSocialSystems.title')}</h4>
              <p>{$t('framework.groups.humanSocialSystems.description')}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Complete Frameworks Directory -->
      <div class="frameworks-directory">
        <h3 class="directory-title subsection-title">{$t('framework.implementation.directory.title')}</h3>
        <p class="directory-intro subsection-intro">{$t('framework.implementation.directory.intro')}</p>
        
        <!-- Dynamic Frameworks List using existing component -->
        <AllFrameworksList t={$t} showTierHeaders={true} className="implementation-frameworks" addTierIds={true} />
      </div>

      <!-- Getting Started Section -->
      <div class="getting-started">
        <div class="getting-started-content">
          <h3 class="getting-started-title">{$t('framework.implementation.gettingStarted.title')}</h3>
          <p class="getting-started-description">{$t('framework.implementation.gettingStarted.description')}</p>
          
          <div class="getting-started-actions">
            <a href="{base}/frameworks/docs/implementation" class="primary-action">
              {$t('framework.implementation.gettingStarted.implementationButton')}
            </a>
            <a href="{base}/frameworks/docs/case-studies" class="secondary-action">
              {$t('framework.implementation.gettingStarted.caseStudiesButton')}
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Quick Access to Documentation -->
  <section class="documentation-access">
    <div class="container">
      <div class="documentation-content">
        <h2 class="documentation-title section-title">{$t('framework.documentation.title')}</h2>
        <p class="documentation-intro section-intro">{$t('framework.documentation.intro')}</p>
        
        <div class="documentation-grid card-grid">
          <a href="{base}/frameworks/docs/principles" class="doc-card principles">
            <div class="doc-icon">📜</div>
            <div class="doc-content">
              <h4>{$t('framework.documentation.cards.principles.title')}</h4>
              <p>{$t('framework.documentation.cards.principles.description')}</p>
            </div>
          </a>
          
          <a href="{base}/frameworks/docs/implementation" class="doc-card implementation">
            <div class="doc-icon">🛠️</div>
            <div class="doc-content">
              <h4>{$t('framework.documentation.cards.implementation.title')}</h4>
              <p>{$t('framework.documentation.cards.implementation.description')}</p>
            </div>
          </a>
          
          <a href="{base}/frameworks/tools" class="doc-card tools">
            <div class="doc-icon">🧰</div>
            <div class="doc-content">
              <h4>{$t('framework.documentation.cards.tools.title')}</h4>
              <p>{$t('framework.documentation.cards.tools.description')}</p>
            </div>
          </a>
          
          <a href="{base}/frameworks/docs/case-studies" class="doc-card casestudies">
            <div class="doc-icon">📚</div>
            <div class="doc-content">
              <h4>{$t('framework.documentation.cards.caseStudies.title')}</h4>
              <p>{$t('framework.documentation.cards.caseStudies.description')}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* ==========================================================================
     VARIABLES & UTILITIES
     ========================================================================== */

  :root {
    --primary-blue: #2B4B8C;
    --primary-gold: #DAA520;
    --primary-gold-hover: #B8860B;
    --primary-green: #065F46;
    --primary-brown: #7C2D12;
    --forest-green: #2D5F2D;
    
    --text-primary: #1f2937;
    --text-secondary: #4b5563;
    --text-muted: #6b7280;
    --text-light: #e2e8f0;
    
    --bg-primary: #f8fafc;
    --bg-secondary: #f9fafb;
    --bg-white: white;
    --border-light: #e2e8f0;
    --border-medium: #cbd5e1;
    
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 20px rgba(0, 0, 0, 0.12);
    --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.1);
    
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    
    --transition-fast: all 0.2s ease;
    --transition-normal: all 0.3s ease;
  }

  /* FIXED: Simplified animation approach */
  .group-card,
  .pillar-card,
  .doc-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    transform: translateZ(0);
  }

  .group-card:hover,
  .pillar-card:hover,
  .doc-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  /* ==========================================================================
     LAYOUT & CONTAINERS
     ========================================================================== */

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* ==========================================================================
     HERO SECTION
     ========================================================================== */

  .hero-section {
    padding: 3rem 0;
    background: linear-gradient(135deg, var(--primary-blue) 0%, #6B5CA5 100%);
    color: white;
  }

  .hero-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-content h1 {
    font-size: 2.5rem;
    line-height: 1.2;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-light);
    margin: 0;
  }

  /* ==========================================================================
     BLUEPRINT BRIDGE SECTION
     ========================================================================== */

  .blueprint-bridge-section {
    padding: 3rem 0;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  }

  .blueprint-content {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
  }

  .blueprint-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 1rem;
  }

  .blueprint-intro {
    font-size: 1.125rem;
    color: #1e40af;
    margin-bottom: 2.5rem;
    line-height: 1.6;
  }

  /* ==========================================================================
     PILLAR CARDS
     ========================================================================== */

  .pillars-reminder {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .pillar-card {
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    overflow: hidden;
  }

  .pillar-hardware { border-top: 4px solid var(--primary-blue); }
  .pillar-heart { border-top: 4px solid var(--primary-green); }
  .pillar-nervous-system { border-top: 4px solid var(--primary-brown); }

  .pillar-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .pillar-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .pillar-content p {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0;
  }

  /* ==========================================================================
     TRANSITION EXPLANATION
     ========================================================================== */

  .transition-explanation {
    background: rgba(59, 130, 246, 0.1);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    border-left: 4px solid #3b82f6;
  }

  .transition-explanation p {
    font-size: 1rem;
    color: #1e40af;
    margin: 0;
    font-style: italic;
  }

  /* ==========================================================================
     SHARED SECTION STYLES
     ========================================================================== */

  .section-padding {
    padding: 4rem 0;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--primary-blue);
    margin-bottom: 1rem;
  }

  .section-intro {
    font-size: 1.125rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0;
  }

  .subsection-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--primary-blue);
    margin-bottom: 1rem;
    text-align: center;
  }

  .subsection-intro {
    font-size: 1rem;
    color: var(--text-secondary);
    text-align: center;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /* ==========================================================================
     IMPLEMENTATION SECTION
     ========================================================================== */

  .implementation-section {
    padding: 4rem 0;
    background-color: var(--bg-primary);
  }

  /* Roadmap Explanation */
  .roadmap-explanation {
    background: linear-gradient(135deg, #e9f2e9 0%, #eaf5ea 100%);
    border-radius: var(--radius-xl);
    padding: 2.5rem;
    margin-bottom: 3rem;
    border-left: 4px solid var(--forest-green);
  }

  .roadmap-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .roadmap-icon {
    background: var(--forest-green);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .roadmap-header h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--forest-green);
    margin: 0;
  }

  .roadmap-description {
    color: var(--forest-green);
    line-height: 1.7;
    margin-bottom: 2rem;
    font-size: 1rem;
  }

  /* ==========================================================================
     TIER NAVIGATION
     ========================================================================== */

  .tier-navigation {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .tier-nav-button {
    background: rgba(255, 255, 255, 0.7);
    border: none;
    cursor: pointer;
    text-align: center;
    padding: 1rem;
    border-radius: var(--radius-lg);
    transition: var(--transition-fast);
  }

  .tier-nav-button:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }

  .tier-nav-button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .tier-badge {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    color: white;
    margin-bottom: 0.5rem;
    transition: var(--transition-fast);
    display: inline-block;
  }

  .tier-nav-button:hover .tier-badge {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  /* Tier Badge Colors */
  .tier-0-badge { background-color: #fbbf24; }
  .tier-1-badge { background-color: #60a5fa; }
  .tier-2-badge { background-color: #34d399; }
  .tier-3-badge { background-color: #a78bfa; }
  .tier-4-badge { background-color: #f472b6; }

  .tier-name {
    font-size: 0.875rem;
    color: #374151;
    display: block;
    line-height: 1.3;
  }

  /* ==========================================================================
     CARD GRIDS & GROUPS
     ========================================================================== */

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .groups-overview {
    margin-bottom: 3rem;
  }

  .groups-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--primary-blue);
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .groups-intro {
    font-size: 1rem;
    color: var(--text-secondary);
    text-align: center;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .group-card {
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--border-light);
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    text-align: left;
  }

  .group-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  .group-content h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .group-content p {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0;
  }

  /* ==========================================================================
     DOCUMENTATION SECTION
     ========================================================================== */

  .documentation-access {
    padding: 4rem 0;
    background: linear-gradient(135deg, var(--bg-secondary) 0%, #f3f4f6 100%);
  }

  .documentation-content {
    text-align: center;
    max-width: 1000px;
    margin: 0 auto;
  }

  .doc-card {
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--border-light);
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .doc-card:hover {
    border-color: var(--primary-gold);
  }

  .doc-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .doc-content h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .doc-content p {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0;
  }

  /* ==========================================================================
     GETTING STARTED SECTION
     ========================================================================== */

  .frameworks-directory {
    margin-top: 3rem;
  }

  .getting-started {
    background: var(--bg-white);
    border-radius: var(--radius-xl);
    padding: 2.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: center;
    margin-top: 3rem;
  }

  .getting-started-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-blue);
    margin-bottom: 1rem;
  }

  .getting-started-description {
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .getting-started-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    max-width: 300px;
    margin: 0 auto;
  }

  /* ==========================================================================
     BUTTONS & ACTIONS
     ========================================================================== */

  .btn {
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    text-align: center;
    transition: var(--transition-fast);
    cursor: pointer;
    border: none;
    display: inline-block;
  }

  .btn--primary {
    background-color: var(--primary-gold);
    color: #1f2937;
    box-shadow: var(--shadow-md);
  }

  .btn--primary:hover {
    background-color: var(--primary-gold-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .btn--secondary {
    background-color: transparent;
    border: 2px solid var(--primary-blue);
    color: var(--primary-blue);
  }

  .btn--secondary:hover {
    background-color: var(--primary-blue);
    color: white;
  }

  .btn--full {
    width: 100%;
  }

  .primary-action {
    composes: btn btn--primary btn--full;
  }

  .secondary-action {
    composes: btn btn--primary btn--full;
    background-color: transparent;
    border: 2px solid var(--primary-blue);
    color: var(--primary-blue);
  }

  .secondary-action:hover {
    background-color: var(--primary-blue);
    color: white;
  }

  /* ==========================================================================
     FRAMEWORK LIST INTEGRATION STYLES (CRITICAL FIX)
     ========================================================================== */
  
  /* REMOVED: All conflicting global styles that were causing interference */
  /* Let the component handle its own styling completely */
  
  :global(.implementation-frameworks .tier-section) {
    background: white;
    border-radius: 1rem;
    padding: 2.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
  }

  /* ==========================================================================
     RESPONSIVE DESIGN
     ========================================================================== */

  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2rem;
    }

    .blueprint-title, .section-title {
      font-size: 1.75rem;
    }

    .pillars-reminder, .tier-navigation, .card-grid {
      grid-template-columns: 1fr;
    }

    .pillar-card {
      flex-direction: column;
      text-align: center;
      gap: 0.75rem;
    }

    .getting-started-actions {
      max-width: 100%;
    }

    .roadmap-explanation, .getting-started {
      padding: 1.5rem;
    }

    :global(.implementation-frameworks .framework-list) {
      grid-template-columns: 1fr;
    }

    :global(.implementation-frameworks .tier-section) {
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }
</style>
