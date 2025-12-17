<!-- src/routes/sovereign/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';

  let isVisible = false;
  
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });
</script>

<svelte:head>
  <title>{$t('sovereign.title')}</title>
  <meta name="description" content="{$t('sovereign.subtitle')}" />
</svelte:head>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-container">
    <div class="hero-content">
      <div class="hero-icon">👑</div>
      <h1 class="hero-title">{$t('sovereign.hero.title')}</h1>
      <p class="hero-subtitle">{$t('sovereign.hero.subtitle')}</p>
      <p class="hero-tagline">{$t('sovereign.hero.tagline')}</p>
    </div>
  </div>
</section>

<!-- Three Cards Section -->
<section class="three-cards-section">
  <div class="container">
    <div class="cards-grid">
      
      <!-- Card 1: Protocols Library -->
      <div class="resource-card card-protocols">
        <div class="card-header">
          <div class="card-icon">📋</div>
          <h3 class="card-title">{$t('sovereign.cards.protocols.title')}</h3>
        </div>
        <p class="card-description">
          {$t('sovereign.cards.protocols.description')}
        </p>
        <ul class="card-features">
          <li>{$t('sovereign.cards.protocols.feature1')}</li>
          <li>{$t('sovereign.cards.protocols.feature2')}</li>
          <li>{$t('sovereign.cards.protocols.feature3')}</li>
        </ul>
        <a href="{base}/sovereign/protocols" class="card-link">
          {$t('sovereign.cards.protocols.cta')} →
        </a>
      </div>

      <!-- Card 2: From Personal to Systemic -->
      <div class="resource-card card-systemic">
        <div class="card-header">
          <div class="card-icon">🔄</div>
          <h3 class="card-title">{$t('sovereign.cards.systemic.title')}</h3>
        </div>
        <p class="card-description">
          {$t('sovereign.cards.systemic.description')}
        </p>
        <ul class="card-features">
          <li>{$t('sovereign.cards.systemic.feature1')}</li>
          <li>{$t('sovereign.cards.systemic.feature2')}</li>
          <li>{$t('sovereign.cards.systemic.feature3')}</li>
        </ul>
        <a href="{base}/sovereign/integration" class="card-link">
          {$t('sovereign.cards.systemic.cta')} →
        </a>
      </div>

      <!-- Card 3: The Architect's Network -->
      <div class="resource-card card-network">
        <div class="card-header">
          <div class="card-icon">🤝</div>
          <h3 class="card-title">{$t('sovereign.cards.network.title')}</h3>
        </div>
        <p class="card-description">
          {$t('sovereign.cards.network.description')}
        </p>
        <ul class="card-features">
          <li>{$t('sovereign.cards.network.feature1')}</li>
          <li>{$t('sovereign.cards.network.feature2')}</li>
          <li>{$t('sovereign.cards.network.feature3')}</li>
        </ul>
        <a href="{base}/sovereign/network" class="card-link">
          {$t('sovereign.cards.network.cta')} →
        </a>
      </div>

    </div>
  </div>
</section>

<!-- Journey Section -->
<section class="journey-section">
  <div class="container">
    <h2 class="journey-title">{$t('sovereign.journey.title')}</h2>
    <p class="journey-intro">{$t('sovereign.journey.intro')}</p>

    <div class="journey-stages">
      
      <div class="stage-item">
        <div class="stage-number">1</div>
        <div class="stage-content">
          <h3 class="stage-title">{$t('sovereign.journey.stage1.title')}</h3>
          <p class="stage-description">{$t('sovereign.journey.stage1.description')}</p>
        </div>
      </div>

      <div class="stage-arrow">↓</div>

      <div class="stage-item">
        <div class="stage-number">2</div>
        <div class="stage-content">
          <h3 class="stage-title">{$t('sovereign.journey.stage2.title')}</h3>
          <p class="stage-description">{$t('sovereign.journey.stage2.description')}</p>
        </div>
      </div>

      <div class="stage-arrow">↓</div>

      <div class="stage-item">
        <div class="stage-number">3</div>
        <div class="stage-content">
          <h3 class="stage-title">{$t('sovereign.journey.stage3.title')}</h3>
          <p class="stage-description">{$t('sovereign.journey.stage3.description')}</p>
        </div>
      </div>

      <div class="stage-arrow">↓</div>

      <div class="stage-item stage-highlight">
        <div class="stage-number">4</div>
        <div class="stage-content">
          <h3 class="stage-title">{$t('sovereign.journey.stage4.title')}</h3>
          <p class="stage-description">{$t('sovereign.journey.stage4.description')}</p>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
  <div class="container">
    <div class="cta-content">
      <h2 class="cta-title">{$t('sovereign.cta.title')}</h2>
      <p class="cta-description">{$t('sovereign.cta.description')}</p>
      <div class="cta-buttons">
        <a href="{base}/sovereign/protocols" class="cta-button cta-primary">
          {$t('sovereign.cta.primary')}
        </a>
        <a href="{base}/contact" class="cta-button cta-secondary">
          {$t('sovereign.cta.secondary')}
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    padding: 6rem 2rem;
    text-align: center;
  }

  .hero-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .hero-icon {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 0 20px rgba(218, 165, 32, 0.3));
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: #e0e0e0;
  }

  .hero-tagline {
    font-size: 1.125rem;
    line-height: 1.7;
    color: #b0b0b0;
    max-width: 700px;
    margin: 0 auto;
  }

  /* Three Cards Section */
  .three-cards-section {
    padding: 5rem 2rem;
    background-color: #f8f9fa;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
  }

  .resource-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    border-top: 4px solid;
  }

  .resource-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .card-protocols {
    border-top-color: #2B4B8C;
  }

  .card-systemic {
    border-top-color: #2D5F2D;
  }

  .card-network {
    border-top-color: #B8860B;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .card-icon {
    font-size: 3rem;
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
  }

  .card-description {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
    margin-bottom: 1.5rem;
  }

  .card-features {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
  }

  .card-features li {
    padding: 0.75rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: #333;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .card-features li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: #DAA520;
    font-weight: bold;
  }

  .card-link {
    display: inline-block;
    background-color: #DAA520;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .card-link:hover {
    background-color: #B8860B;
  }

  /* Journey Section */
  .journey-section {
    padding: 5rem 2rem;
    background-color: white;
  }

  .journey-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 1rem;
  }

  .journey-intro {
    font-size: 1.125rem;
    line-height: 1.7;
    color: #555;
    text-align: center;
    max-width: 700px;
    margin: 0 auto 3rem;
  }

  .journey-stages {
    max-width: 800px;
    margin: 0 auto;
  }

  .stage-item {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 1rem;
    margin-bottom: 1rem;
  }

  .stage-highlight {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: white;
  }

  .stage-highlight .stage-title,
  .stage-highlight .stage-description {
    color: white;
  }

  .stage-number {
    flex-shrink: 0;
    width: 4rem;
    height: 4rem;
    background: #DAA520;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stage-highlight .stage-number {
    background: white;
    color: #DAA520;
  }

  .stage-content {
    flex: 1;
  }

  .stage-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }

  .stage-description {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
  }

  .stage-arrow {
    text-align: center;
    font-size: 2rem;
    color: #DAA520;
    margin: 1rem 0;
  }

  /* CTA Section */
  .cta-section {
    padding: 5rem 2rem;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
  }

  .cta-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .cta-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .cta-description {
    font-size: 1.125rem;
    line-height: 1.7;
    color: #e0e0e0;
    margin-bottom: 2rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-button {
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.125rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .cta-primary {
    background-color: #DAA520;
    color: white;
  }

  .cta-primary:hover {
    background-color: #FFD700;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(218, 165, 32, 0.3);
  }

  .cta-secondary {
    background-color: transparent;
    color: white;
    border: 2px solid #DAA520;
  }

  .cta-secondary:hover {
    background-color: rgba(218, 165, 32, 0.1);
    transform: translateY(-2px);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .cards-grid {
      grid-template-columns: 1fr;
    }

    .stage-item {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stage-number {
      width: 3rem;
      height: 3rem;
      font-size: 1.25rem;
    }

    .journey-title,
    .cta-title {
      font-size: 2rem;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .cta-button {
      width: 100%;
      max-width: 300px;
    }
  }

  @media (max-width: 640px) {
    .hero-icon {
      font-size: 3.5rem;
    }

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.125rem;
    }

    .hero-tagline {
      font-size: 1rem;
    }

    .journey-title,
    .cta-title {
      font-size: 1.75rem;
    }
  }
</style>
