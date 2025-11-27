<!-- src/routes/integration-scorecard/+page.svelte -->
<script>
  import { t } from '$lib/i18n';
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>{$t('integrationScorecard.meta.title')}</title>
  <meta name="description" content="{$t('integrationScorecard.meta.description')}" />
</svelte:head>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-container">
    <div class="hero-content">
      <div class="icon-container">
        <span class="hero-icon">📊</span>
      </div>
      <h1 class="hero-title">{$t('integrationScorecard.hero.title')}</h1>
      <p class="hero-subtitle">{$t('integrationScorecard.hero.subtitle')}</p>
    </div>
  </div>
</section>

<!-- Introduction Section -->
<section class="intro-section">
  <div class="container">
    <div class="intro-content">
      <h2 class="section-title">{$t('integrationScorecard.intro.title')}</h2>
      <p class="intro-text">{$t('integrationScorecard.intro.text1')}</p>
      <p class="intro-text">{$t('integrationScorecard.intro.text2')}</p>
    </div>
  </div>
</section>

<!-- Six Domains Section -->
<section class="domains-section">
  <div class="container">
    <h2 class="section-title">{$t('integrationScorecard.domains.title')}</h2>
    
    <div class="domains-grid">
      <!-- Biological Domain -->
      <div class="domain-card">
        <div class="domain-header">
          <span class="domain-icon">🧬</span>
          <h3 class="domain-title">{$t('integrationScorecard.domains.biological.title')}</h3>
        </div>
        <p class="domain-description">{$t('integrationScorecard.domains.biological.description')}</p>
        <ul class="domain-list">
          <li>{$t('integrationScorecard.domains.biological.point1')}</li>
          <li>{$t('integrationScorecard.domains.biological.point2')}</li>
          <li>{$t('integrationScorecard.domains.biological.point3')}</li>
        </ul>
      </div>

      <!-- Cognitive Domain -->
      <div class="domain-card">
        <div class="domain-header">
          <span class="domain-icon">🧠</span>
          <h3 class="domain-title">{$t('integrationScorecard.domains.cognitive.title')}</h3>
        </div>
        <p class="domain-description">{$t('integrationScorecard.domains.cognitive.description')}</p>
        <ul class="domain-list">
          <li>{$t('integrationScorecard.domains.cognitive.point1')}</li>
          <li>{$t('integrationScorecard.domains.cognitive.point2')}</li>
          <li>{$t('integrationScorecard.domains.cognitive.point3')}</li>
        </ul>
      </div>

      <!-- Emotional Domain -->
      <div class="domain-card">
        <div class="domain-header">
          <span class="domain-icon">❤️</span>
          <h3 class="domain-title">{$t('integrationScorecard.domains.emotional.title')}</h3>
        </div>
        <p class="domain-description">{$t('integrationScorecard.domains.emotional.description')}</p>
        <ul class="domain-list">
          <li>{$t('integrationScorecard.domains.emotional.point1')}</li>
          <li>{$t('integrationScorecard.domains.emotional.point2')}</li>
          <li>{$t('integrationScorecard.domains.emotional.point3')}</li>
        </ul>
      </div>

      <!-- Behavioral Domain -->
      <div class="domain-card">
        <div class="domain-header">
          <span class="domain-icon">⚡</span>
          <h3 class="domain-title">{$t('integrationScorecard.domains.behavioral.title')}</h3>
        </div>
        <p class="domain-description">{$t('integrationScorecard.domains.behavioral.description')}</p>
        <ul class="domain-list">
          <li>{$t('integrationScorecard.domains.behavioral.point1')}</li>
          <li>{$t('integrationScorecard.domains.behavioral.point2')}</li>
          <li>{$t('integrationScorecard.domains.behavioral.point3')}</li>
        </ul>
      </div>

      <!-- Social Domain -->
      <div class="domain-card">
        <div class="domain-header">
          <span class="domain-icon">🤝</span>
          <h3 class="domain-title">{$t('integrationScorecard.domains.social.title')}</h3>
        </div>
        <p class="domain-description">{$t('integrationScorecard.domains.social.description')}</p>
        <ul class="domain-list">
          <li>{$t('integrationScorecard.domains.social.point1')}</li>
          <li>{$t('integrationScorecard.domains.social.point2')}</li>
          <li>{$t('integrationScorecard.domains.social.point3')}</li>
        </ul>
      </div>

      <!-- Spiritual/Existential Domain -->
      <div class="domain-card">
        <div class="domain-header">
          <span class="domain-icon">🌟</span>
          <h3 class="domain-title">{$t('integrationScorecard.domains.spiritual.title')}</h3>
        </div>
        <p class="domain-description">{$t('integrationScorecard.domains.spiritual.description')}</p>
        <ul class="domain-list">
          <li>{$t('integrationScorecard.domains.spiritual.point1')}</li>
          <li>{$t('integrationScorecard.domains.spiritual.point2')}</li>
          <li>{$t('integrationScorecard.domains.spiritual.point3')}</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- How to Use Section -->
<section class="howto-section">
  <div class="container">
    <h2 class="section-title">{$t('integrationScorecard.howto.title')}</h2>
    <div class="howto-content">
      <p class="howto-intro">{$t('integrationScorecard.howto.intro')}</p>
      
      <div class="use-cases">
        <div class="use-case">
          <h4 class="use-case-title">👤 {$t('integrationScorecard.howto.individuals.title')}</h4>
          <p>{$t('integrationScorecard.howto.individuals.description')}</p>
        </div>
        
        <div class="use-case">
          <h4 class="use-case-title">🏢 {$t('integrationScorecard.howto.organizations.title')}</h4>
          <p>{$t('integrationScorecard.howto.organizations.description')}</p>
        </div>
        
        <div class="use-case">
          <h4 class="use-case-title">🏙️ {$t('integrationScorecard.howto.cities.title')}</h4>
          <p>{$t('integrationScorecard.howto.cities.description')}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Download Section -->
<section class="download-section">
  <div class="container">
    <div class="download-card">
      <div class="download-icon">📥</div>
      <h2 class="download-title">{$t('integrationScorecard.download.title')}</h2>
      <p class="download-description">{$t('integrationScorecard.download.description')}</p>
      
      <div class="download-buttons">
        <a 
          href="{base}/resources/Integration-Scorecard-EN.pdf" 
          class="download-button primary"
          download
        >
          📄 {$t('integrationScorecard.download.buttonEnglish')}
        </a>
        <a 
          href="{base}/resources/Integration-Scorecard-SV.pdf" 
          class="download-button secondary"
          download
        >
          📄 {$t('integrationScorecard.download.buttonSwedish')}
        </a>
      </div>
      
      <p class="download-note">{$t('integrationScorecard.download.note')}</p>
    </div>
  </div>
</section>

<!-- Related Resources Section -->
<section class="resources-section">
  <div class="container">
    <h2 class="section-title">{$t('integrationScorecard.resources.title')}</h2>
    
    <div class="resources-grid">
      <a href="{base}/frameworks/consciousness-and-inner-development" class="resource-card">
        <div class="resource-icon">🧘</div>
        <h3 class="resource-title">{$t('integrationScorecard.resources.consciousness.title')}</h3>
        <p class="resource-description">{$t('integrationScorecard.resources.consciousness.description')}</p>
      </a>
      
      <a href="{base}/frameworks/regenerative-enterprise" class="resource-card">
        <div class="resource-icon">🌱</div>
        <h3 class="resource-title">{$t('integrationScorecard.resources.enterprise.title')}</h3>
        <p class="resource-description">{$t('integrationScorecard.resources.enterprise.description')}</p>
      </a>
      
      <a href="{base}/frameworks/bioregional-polis" class="resource-card">
        <div class="resource-icon">🏘️</div>
        <h3 class="resource-title">{$t('integrationScorecard.resources.bioregional.title')}</h3>
        <p class="resource-description">{$t('integrationScorecard.resources.bioregional.description')}</p>
      </a>
    </div>
  </div>
</section>

<style>
  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, #2B4B8C 0%, #6B5CA5 100%);
    color: white;
    padding: 5rem 1rem 4rem;
    text-align: center;
  }

  .hero-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .icon-container {
    margin-bottom: 1.5rem;
  }

  .hero-icon {
    font-size: 4rem;
    display: inline-block;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    opacity: 0.95;
    max-width: 700px;
    margin: 0 auto;
  }

  /* Container */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* Section Titles */
  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2B4B8C;
    margin-bottom: 2rem;
    text-align: center;
  }

  /* Introduction Section */
  .intro-section {
    padding: 4rem 1rem;
    background-color: #f8f9fa;
  }

  .intro-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .intro-text {
    font-size: 1.125rem;
    line-height: 1.8;
    color: #333;
    margin-bottom: 1.5rem;
  }

  /* Domains Section */
  .domains-section {
    padding: 4rem 1rem;
    background-color: white;
  }

  .domains-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .domain-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 1rem;
    padding: 2rem;
    transition: all 0.3s ease;
  }

  .domain-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(43, 75, 140, 0.15);
    border-color: #2B4B8C;
  }

  .domain-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .domain-icon {
    font-size: 2.5rem;
  }

  .domain-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2B4B8C;
  }

  .domain-description {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
    margin-bottom: 1rem;
  }

  .domain-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .domain-list li {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #666;
    padding-left: 1.5rem;
    position: relative;
    margin-bottom: 0.5rem;
  }

  .domain-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #6B5CA5;
    font-weight: bold;
  }

  /* How To Section */
  .howto-section {
    padding: 4rem 1rem;
    background-color: #f8f9fa;
  }

  .howto-content {
    max-width: 900px;
    margin: 0 auto;
  }

  .howto-intro {
    font-size: 1.125rem;
    line-height: 1.8;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
  }

  .use-cases {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .use-case {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .use-case-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2B4B8C;
    margin-bottom: 1rem;
  }

  .use-case p {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
  }

  /* Download Section */
  .download-section {
    padding: 4rem 1rem;
    background: linear-gradient(135deg, #6B5CA5 0%, #2B4B8C 100%);
  }

  .download-card {
    max-width: 700px;
    margin: 0 auto;
    background: white;
    border-radius: 1.5rem;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .download-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  .download-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2B4B8C;
    margin-bottom: 1rem;
  }

  .download-description {
    font-size: 1.125rem;
    line-height: 1.7;
    color: #555;
    margin-bottom: 2rem;
  }

  .download-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
    margin: 0 auto 1.5rem;
  }

  .download-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .download-button.primary {
    background-color: #DAA520;
    color: white;
  }

  .download-button.primary:hover {
    background-color: #B8860B;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(218, 165, 32, 0.3);
  }

  .download-button.secondary {
    background-color: #2B4B8C;
    color: white;
  }

  .download-button.secondary:hover {
    background-color: #1e3567;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(43, 75, 140, 0.3);
  }

  .download-note {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }

  /* Resources Section */
  .resources-section {
    padding: 4rem 1rem;
    background-color: white;
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .resource-card {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .resource-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: #6B5CA5;
  }

  .resource-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .resource-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2B4B8C;
    margin-bottom: 0.75rem;
  }

  .resource-description {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .domains-grid {
      grid-template-columns: 1fr;
    }

    .use-cases {
      grid-template-columns: 1fr;
    }

    .resources-grid {
      grid-template-columns: 1fr;
    }

    .download-card {
      padding: 2rem 1.5rem;
    }

    .download-buttons {
      flex-direction: column;
    }
  }

  @media (max-width: 640px) {
    .hero-section {
      padding: 3rem 1rem 2rem;
    }

    .hero-icon {
      font-size: 3rem;
    }

    .hero-title {
      font-size: 1.75rem;
    }

    .hero-subtitle {
      font-size: 1.125rem;
    }

    .domain-card {
      padding: 1.5rem;
    }

    .download-title {
      font-size: 1.5rem;
    }
  }
</style>
