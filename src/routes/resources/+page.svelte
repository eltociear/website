<!-- src/routes/resources/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';

  // Animation states
  let isVisible = false;
  let hoveredCard = null;
  
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  // Handle card hover
  function handleCardHover(cardId) {
    hoveredCard = cardId;
  }

  function handleCardLeave() {
    hoveredCard = null;
  }

  // Resource sections data
  $: resourceSections = [
    {
      id: 'books',
      title: $t('resources.sections.books.title'),
      description: $t('resources.sections.books.description'),
      icon: '📚',
      color: '#2563eb',
      lightColor: 'rgba(37, 99, 235, 0.1)',
      href: '/resources/books',
      stats: {
        count: 8,
        label: $t('resources.sections.books.stats')
      }
    },
    {
      id: 'whitepapers',
      title: $t('resources.sections.whitepapers.title'),
      description: $t('resources.sections.whitepapers.description'),
      icon: '📋',
      color: '#059669',
      lightColor: 'rgba(5, 150, 105, 0.1)',
      href: '/resources/whitepapers',
      stats: {
        count: 3,
        label: $t('resources.sections.whitepapers.stats')
      }
    }
  ];

  function trackNavigation(section, destination) {
    // Analytics tracking would go here
    console.log(`Navigated from ${section} to ${destination}`);
  }
</script>

<svelte:head>
  <title>{$t('resources.meta.title')}</title>
  <meta name="description" content="{$t('resources.meta.description')}" />
  <meta property="og:title" content="{$t('resources.meta.title')}" />
  <meta property="og:description" content="{$t('resources.meta.description')}" />
  <meta property="og:type" content="website" />
</svelte:head>

<!-- Resources Page -->
<div class="resources-page" class:visible={isVisible}>
  
  <!-- Hero Section -->
  <section class="resources-hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">{$t('resources.hero.title')}</h1>
        <p class="hero-subtitle">{$t('resources.hero.subtitle')}</p>
        <p class="hero-description">{$t('resources.hero.description')}</p>
      </div>
    </div>
  </section>

  <!-- Resource Sections -->
  <section class="resource-sections">
    <div class="container">
      <div class="sections-grid">
        {#each resourceSections as section (section.id)}
          <a 
            href={section.href}
            class="section-card"
            class:hovered={hoveredCard === section.id}
            on:mouseenter={() => handleCardHover(section.id)}
            on:mouseleave={handleCardLeave}
            on:click={() => trackNavigation('resources', section.href)}
            role="button"
            tabindex="0"
          >
            <div class="card-header" style="background: {section.lightColor};">
              <div class="card-icon-container" style="background: {section.color};">
                <span class="card-icon">{section.icon}</span>
              </div>
              <div class="card-stats">
                <span class="stats-count">{section.stats.count}</span>
                <span class="stats-label">{section.stats.label}</span>
              </div>
            </div>
            
            <div class="card-content">
              <h2 class="card-title">{section.title}</h2>
              <p class="card-description">{section.description}</p>
              
              <div class="card-action">
                <span class="action-text">{$t('resources.sections.explore')}</span>
                <span class="action-arrow">→</span>
              </div>
            </div>

            <div class="card-hover-overlay" style="background: {section.lightColor};"></div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- Future Possibilities Section -->
  <section class="future-possibilities">
    <div class="container">
      <div class="future-content">
        <h2 class="future-title">{$t('resources.future.title')}</h2>
        <p class="future-description">{$t('resources.future.description')}</p>
        
        <div class="possibility-types">
          <div class="possibility-type">
            <div class="type-icon">🎥</div>
            <h3 class="type-title">{$t('resources.future.types.videos.title')}</h3>
            <p class="type-description">{$t('resources.future.types.videos.description')}</p>
          </div>
          
          <div class="possibility-type">
            <div class="type-icon">🎧</div>
            <h3 class="type-title">{$t('resources.future.types.podcasts.title')}</h3>
            <p class="type-description">{$t('resources.future.types.podcasts.description')}</p>
          </div>
          
          <div class="possibility-type">
            <div class="type-icon">📰</div>
            <h3 class="type-title">{$t('resources.future.types.articles.title')}</h3>
            <p class="type-description">{$t('resources.future.types.articles.description')}</p>
          </div>
        </div>

        <div class="get-involved-cta">
          <h3 class="cta-title">{$t('resources.getInvolved.title')}</h3>
          <p class="cta-description">{$t('resources.getInvolved.description')}</p>
          <div class="cta-buttons">
            <a href="{base}/get-involved" class="cta-button primary">
              {$t('resources.getInvolved.button')}
            </a>
            <a href="{base}/about" class="cta-button secondary">
              {$t('resources.getInvolved.learnMore')}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>

<style>
  /* Base Styles */
  .resources-page {
    min-height: 100vh;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .resources-page.visible {
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

  /* Hero Section */
  .resources-hero {
    padding: 4rem 0 2rem 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%);
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
    margin: 0;
    max-width: 700px;
    margin: 0 auto;
  }

  /* Resource Sections */
  .resource-sections {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .sections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .section-card {
    background: white;
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.4s ease;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    position: relative;
    display: block;
  }

  .section-card:hover,
  .section-card.hovered {
    transform: translateY(-12px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    border-color: #3b82f6;
  }

  .section-card:focus {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
  }

  .card-header {
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .card-icon-container {
    width: 4rem;
    height: 4rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-icon {
    font-size: 2rem;
    color: white;
  }

  .card-stats {
    text-align: right;
  }

  .stats-count {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    line-height: 1;
  }

  .stats-label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }

  .card-content {
    padding: 0 2rem 2rem 2rem;
    position: relative;
    z-index: 2;
  }

  .card-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .card-description {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }

  .card-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: rgba(37, 99, 235, 0.05);
    border-radius: 0.75rem;
    border: 1px solid rgba(37, 99, 235, 0.1);
    transition: all 0.3s ease;
  }

  .section-card:hover .card-action {
    background: rgba(37, 99, 235, 0.1);
    border-color: rgba(37, 99, 235, 0.2);
    transform: translateX(4px);
  }

  .action-text {
    font-weight: 600;
    color: #2563eb;
    font-size: 1rem;
  }

  .action-arrow {
    font-size: 1.25rem;
    color: #2563eb;
    transition: transform 0.3s ease;
  }

  .section-card:hover .action-arrow {
    transform: translateX(4px);
  }

  .card-hover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .section-card:hover .card-hover-overlay {
    opacity: 0.05;
  }

  /* Future Possibilities Section */
  .future-possibilities {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-top: 1px solid #e2e8f0;
  }

  .future-content {
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
  }

  .future-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  .future-description {
    font-size: 1.1rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 3rem;
  }

  .possibility-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .possibility-type {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    position: relative;
  }

  .possibility-type::before {
    content: '';
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  }

  .type-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .type-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .type-description {
    color: #64748b;
    line-height: 1.5;
    font-size: 0.95rem;
  }

  /* Get Involved CTA */
  .get-involved-cta {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
    padding: 2.5rem;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(30, 64, 175, 0.2);
  }

  .cta-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .cta-description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.2s ease;
    min-width: 160px;
    justify-content: center;
  }

  .cta-button.primary {
    background: #fbbf24;
    color: #1e40af;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
  }

  .cta-button.primary:hover {
    background: #f59e0b;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(251, 191, 36, 0.4);
  }

  .cta-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .cta-button.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .sections-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .sections-grid {
      grid-template-columns: 1fr;
    }

    .section-card {
      margin: 0 auto;
      max-width: 400px;
    }

    .card-header {
      padding: 1.5rem;
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .card-stats {
      text-align: center;
    }

    .card-content {
      padding: 0 1.5rem 1.5rem 1.5rem;
    }

    .card-title {
      font-size: 1.5rem;
      text-align: center;
    }

    .card-description {
      text-align: center;
    }

    .possibility-types {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .future-possibilities {
      padding: 3rem 0;
    }

    .get-involved-cta {
      padding: 2rem;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .cta-button {
      width: 100%;
      max-width: 250px;
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .hero-description {
      font-size: 1rem;
    }

    .card-icon-container {
      width: 3rem;
      height: 3rem;
    }

    .card-icon {
      font-size: 1.5rem;
    }

    .stats-count {
      font-size: 2rem;
    }

    .card-title {
      font-size: 1.25rem;
    }

    .future-title {
      font-size: 1.75rem;
    }

    .cta-title {
      font-size: 1.25rem;
    }

    .cta-description {
      font-size: 1rem;
    }
  }

  /* Focus and accessibility improvements */
  .section-card:focus-visible {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
  }

  .cta-button:focus-visible {
    outline: 3px solid #fbbf24;
    outline-offset: 2px;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .resources-page,
    .section-card,
    .card-action,
    .action-arrow,
    .card-hover-overlay,
    .cta-button {
      transition: none;
    }

    .section-card:hover {
      transform: none;
    }

    .section-card:hover .card-action {
      transform: none;
    }

    .section-card:hover .action-arrow {
      transform: none;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .section-card {
      border-width: 2px;
    }

    .card-action {
      border-width: 2px;
    }
  }

  /* Print styles */
  @media print {
    .resources-page {
      background: white !important;
    }

    .resources-hero,
    .resource-sections,
    .future-possibilities {
      background: white !important;
      color: black !important;
    }

    .section-card {
      break-inside: avoid;
      box-shadow: none !important;
      border: 1px solid #ccc !important;
    }

    .cta-button {
      display: none;
    }
  }
</style>
