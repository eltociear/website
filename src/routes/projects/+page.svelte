<!-- src/routes/active-projects/+page.svelte -->
<script>
  import { t } from '$lib/i18n';
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>{$t('activeProjects.pageTitle')} - Global Governance Frameworks</title>
  <meta name="description" content={$t('activeProjects.pageDescription')} />
</svelte:head>

<div class="active-projects-page">
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1 class="hero-title">{$t('activeProjects.hero.title')}</h1>
      <p class="hero-subtitle">{$t('activeProjects.hero.subtitle')}</p>
      <p class="hero-description">{$t('activeProjects.hero.description')}</p>
    </div>
  </section>

  <!-- Three Layers Section -->
  <section class="layers">
    <div class="container">
      <h2 class="section-heading">{$t('activeProjects.layers.title')}</h2>
      <p class="section-intro">{$t('activeProjects.layers.intro')}</p>
      
      <div class="layers-grid">
        <div class="layer-card">
          <div class="layer-icon">📖</div>
          <h3 class="layer-title">{$t('activeProjects.layers.social.title')}</h3>
          <p class="layer-description">{$t('activeProjects.layers.social.description')}</p>
        </div>
        
        <div class="layer-card">
          <div class="layer-icon">⚡</div>
          <h3 class="layer-title">{$t('activeProjects.layers.technical.title')}</h3>
          <p class="layer-description">{$t('activeProjects.layers.technical.description')}</p>
        </div>
        
        <div class="layer-card">
          <div class="layer-icon">🏠</div>
          <h3 class="layer-title">{$t('activeProjects.layers.application.title')}</h3>
          <p class="layer-description">{$t('activeProjects.layers.application.description')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Communize Section -->
  <section class="project-detail project-communize">
    <div class="container">
      <div class="project-header">
        <div class="project-icon-large">📖</div>
        <div class="project-header-content">
          <span class="project-tag">{$t('activeProjects.communize.tagline')}</span>
          <h2 class="project-title">{$t('activeProjects.communize.title')}</h2>
          <p class="project-intro">{$t('activeProjects.communize.intro')}</p>
        </div>
      </div>

      <div class="project-content">
        <div class="content-section">
          <h3>{$t('activeProjects.communize.inquiry.title')}</h3>
          <p>{$t('activeProjects.communize.inquiry.description')}</p>
          <ul>
            <li>{$t('activeProjects.communize.inquiry.point1')}</li>
            <li>{$t('activeProjects.communize.inquiry.point2')}</li>
            <li>{$t('activeProjects.communize.inquiry.point3')}</li>
            <li>{$t('activeProjects.communize.inquiry.point4')}</li>
          </ul>
        </div>

        <div class="content-section">
          <h3>{$t('activeProjects.communize.pillars.title')}</h3>
          
          <div class="pillar">
            <h4>{$t('activeProjects.communize.pillars.philosophical.title')}</h4>
            <p>{$t('activeProjects.communize.pillars.philosophical.description')}</p>
          </div>

          <div class="pillar">
            <h4>{$t('activeProjects.communize.pillars.models.title')}</h4>
            <p>{$t('activeProjects.communize.pillars.models.description')}</p>
          </div>

          <div class="pillar">
            <h4>{$t('activeProjects.communize.pillars.toolkit.title')}</h4>
            <p>{$t('activeProjects.communize.pillars.toolkit.description')}</p>
          </div>

          <div class="pillar">
            <h4>{$t('activeProjects.communize.pillars.knowledge.title')}</h4>
            <p>{$t('activeProjects.communize.pillars.knowledge.description')}</p>
          </div>
        </div>

        <div class="content-section">
          <h3>{$t('activeProjects.communize.approach.title')}</h3>
          <p>{$t('activeProjects.communize.approach.description')}</p>
        </div>

        <div class="project-cta">
          <a href="https://communize.org" target="_blank" class="btn btn-primary">
            {$t('activeProjects.communize.cta')} →
          </a>
          <a href="https://github.com/BjornKennethHolmstrom/Communize" target="_blank" class="btn btn-secondary">
            {$t('activeProjects.communize.github')} →
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- CivicBase Section -->
  <section class="project-detail project-civicbase">
    <div class="container">
      <div class="project-header">
        <div class="project-icon-large">⚡</div>
        <div class="project-header-content">
          <span class="project-tag">{$t('activeProjects.civicbase.tagline')}</span>
          <h2 class="project-title">{$t('activeProjects.civicbase.title')}</h2>
          <p class="project-intro">{$t('activeProjects.civicbase.intro')}</p>
        </div>
      </div>

      <div class="project-content">
        <div class="content-section problem-solution">
          <div class="problem">
            <h3>{$t('activeProjects.civicbase.problem.title')}</h3>
            <p class="highlight-text">{$t('activeProjects.civicbase.problem.incident')}</p>
            <ul>
              <li>{$t('activeProjects.civicbase.problem.point1')}</li>
              <li>{$t('activeProjects.civicbase.problem.point2')}</li>
              <li>{$t('activeProjects.civicbase.problem.point3')}</li>
              <li>{$t('activeProjects.civicbase.problem.point4')}</li>
            </ul>
            <p class="emphasis">{$t('activeProjects.civicbase.problem.conclusion')}</p>
          </div>

          <div class="solution">
            <h3>{$t('activeProjects.civicbase.solution.title')}</h3>
            <p>{$t('activeProjects.civicbase.solution.description')}</p>
            <ul>
              <li><strong>{$t('activeProjects.civicbase.solution.offline.title')}</strong> – {$t('activeProjects.civicbase.solution.offline.description')}</li>
              <li><strong>{$t('activeProjects.civicbase.solution.sovereignty.title')}</strong> – {$t('activeProjects.civicbase.solution.sovereignty.description')}</li>
              <li><strong>{$t('activeProjects.civicbase.solution.resilient.title')}</strong> – {$t('activeProjects.civicbase.solution.resilient.description')}</li>
              <li><strong>{$t('activeProjects.civicbase.solution.ready.title')}</strong> – {$t('activeProjects.civicbase.solution.ready.description')}</li>
            </ul>
          </div>
        </div>

        <div class="content-section">
          <h3>{$t('activeProjects.civicbase.principles.title')}</h3>
          
          <div class="principle">
            <h4>{$t('activeProjects.civicbase.principles.privacy.title')}</h4>
            <p>{$t('activeProjects.civicbase.principles.privacy.description')}</p>
          </div>

          <div class="principle">
            <h4>{$t('activeProjects.civicbase.principles.sovereign.title')}</h4>
            <p>{$t('activeProjects.civicbase.principles.sovereign.description')}</p>
          </div>

          <div class="principle">
            <h4>{$t('activeProjects.civicbase.principles.resilience.title')}</h4>
            <p>{$t('activeProjects.civicbase.principles.resilience.description')}</p>
          </div>

          <div class="principle">
            <h4>{$t('activeProjects.civicbase.principles.dualUse.title')}</h4>
            <p>{$t('activeProjects.civicbase.principles.dualUse.description')}</p>
          </div>
        </div>

        <div class="content-section">
          <h3>{$t('activeProjects.civicbase.applications.title')}</h3>
          <p>{$t('activeProjects.civicbase.applications.intro')}</p>
          
          <div class="application">
            <h4>{$t('activeProjects.civicbase.applications.tak405.title')}</h4>
            <p>{$t('activeProjects.civicbase.applications.tak405.description')}</p>
          </div>

          <div class="application">
            <h4>{$t('activeProjects.civicbase.applications.dpop.title')}</h4>
            <p>{$t('activeProjects.civicbase.applications.dpop.description')}</p>
          </div>

          <div class="application">
            <h4>{$t('activeProjects.civicbase.applications.didis.title')}</h4>
            <p>{$t('activeProjects.civicbase.applications.didis.description')}</p>
          </div>

          <p class="future-note">{$t('activeProjects.civicbase.applications.future')}</p>
        </div>

        <div class="content-section status-section">
          <h3>{$t('activeProjects.civicbase.status.title')}</h3>
          <div class="status-grid">
            <div class="status-item">
              <span class="status-label">{$t('activeProjects.civicbase.status.phase')}</span>
              <span class="status-value">{$t('activeProjects.civicbase.status.phaseValue')}</span>
            </div>
            <div class="status-item">
              <span class="status-label">{$t('activeProjects.civicbase.status.timeline')}</span>
              <span class="status-value">{$t('activeProjects.civicbase.status.timelineValue')}</span>
            </div>
            <div class="status-item">
              <span class="status-label">{$t('activeProjects.civicbase.status.funding')}</span>
              <span class="status-value">{$t('activeProjects.civicbase.status.fundingValue')}</span>
            </div>
          </div>
        </div>

        <div class="project-cta">
          <a href="https://github.com/GlobalGovernanceFrameworks/CivicBase" target="_blank" class="btn btn-primary">
            {$t('activeProjects.civicbase.cta')} →
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Stuga Section -->
  <section class="project-detail project-stuga">
    <div class="container">
      <div class="project-header">
        <div class="project-icon-large">🏠</div>
        <div class="project-header-content">
          <span class="project-tag">{$t('activeProjects.stuga.tagline')}</span>
          <h2 class="project-title">{$t('activeProjects.stuga.title')}</h2>
          <p class="project-intro">{$t('activeProjects.stuga.intro')}</p>
        </div>
      </div>

      <div class="project-content">
        <div class="content-section">
          <h3>{$t('activeProjects.stuga.purpose.title')}</h3>
          <p>{$t('activeProjects.stuga.purpose.description')}</p>
        </div>

        <div class="content-section">
          <h3>{$t('activeProjects.stuga.features.title')}</h3>
          <ul>
            <li><strong>{$t('activeProjects.stuga.features.coordination.title')}</strong> – {$t('activeProjects.stuga.features.coordination.description')}</li>
            <li><strong>{$t('activeProjects.stuga.features.resources.title')}</strong> – {$t('activeProjects.stuga.features.resources.description')}</li>
            <li><strong>{$t('activeProjects.stuga.features.crisis.title')}</strong> – {$t('activeProjects.stuga.features.crisis.description')}</li>
            <li><strong>{$t('activeProjects.stuga.features.mutual.title')}</strong> – {$t('activeProjects.stuga.features.mutual.description')}</li>
          </ul>
        </div>

        <div class="content-section">
          <h3>{$t('activeProjects.stuga.integration.title')}</h3>
          <p>{$t('activeProjects.stuga.integration.description')}</p>
        </div>

        <div class="project-cta">
          <a href="https://github.com/GlobalGovernanceFrameworks/stuga" target="_blank" class="btn btn-primary">
            {$t('activeProjects.stuga.cta')} →
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Integration Section -->
  <section class="integration-section">
    <div class="container">
      <h2 class="section-heading">{$t('activeProjects.integration.title')}</h2>
      <p class="section-intro">{$t('activeProjects.integration.intro')}</p>
      
      <div class="integration-flow">
        <div class="flow-step">
          <div class="step-number">1</div>
          <h3>{$t('activeProjects.integration.step1.title')}</h3>
          <p>{$t('activeProjects.integration.step1.description')}</p>
        </div>

        <div class="flow-arrow">↓</div>

        <div class="flow-step">
          <div class="step-number">2</div>
          <h3>{$t('activeProjects.integration.step2.title')}</h3>
          <p>{$t('activeProjects.integration.step2.description')}</p>
        </div>

        <div class="flow-arrow">↓</div>

        <div class="flow-step">
          <div class="step-number">3</div>
          <h3>{$t('activeProjects.integration.step3.title')}</h3>
          <p>{$t('activeProjects.integration.step3.description')}</p>
        </div>
      </div>

      <p class="integration-summary">{$t('activeProjects.integration.summary')}</p>
    </div>
  </section>

  <!-- Call to Action -->
  <section class="final-cta">
    <div class="container">
      <h2 class="cta-heading">{$t('activeProjects.finalCta.title')}</h2>
      <p class="cta-description">{$t('activeProjects.finalCta.description')}</p>
      
      <div class="cta-buttons">
        <a href="{base}/get-involved" class="btn btn-primary btn-large">
          {$t('activeProjects.finalCta.getInvolved')} →
        </a>
        <a href="{base}/frameworks" class="btn btn-secondary btn-large">
          {$t('activeProjects.finalCta.exploreFrameworks')} →
        </a>
      </div>
    </div>
  </section>
</div>

<style>
  .active-projects-page {
    background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Hero Section */
  .hero {
    padding: 6rem 0 4rem;
    text-align: center;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    color: #4a5568;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .hero-description {
    font-size: 1.125rem;
    color: #6b7280;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* Layers Section */
  .layers {
    padding: 4rem 0;
    background: white;
  }

  .section-heading {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .section-intro {
    font-size: 1.125rem;
    text-align: center;
    color: #6b7280;
    max-width: 700px;
    margin: 0 auto 3rem;
    line-height: 1.7;
  }

  .layers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .layer-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
  }

  .layer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }

  .layer-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .layer-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .layer-description {
    color: #6b7280;
    line-height: 1.6;
  }

  /* Project Detail Sections */
  .project-detail {
    padding: 5rem 0;
    border-top: 1px solid #e5e7eb;
  }

  .project-detail:nth-child(even) {
    background: #f8f9fa;
  }

  .project-header {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .project-icon-large {
    font-size: 5rem;
    flex-shrink: 0;
  }

  .project-header-content {
    flex: 1;
  }

  .project-tag {
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #3b82f6;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .project-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .project-intro {
    font-size: 1.25rem;
    color: #4a5568;
    line-height: 1.7;
  }

  .project-content {
    max-width: 900px;
  }

  .content-section {
    margin-bottom: 3rem;
  }

  .content-section h3 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .content-section h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #2d3748;
  }

  .content-section p {
    color: #4a5568;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  .content-section ul {
    list-style: none;
    padding-left: 0;
  }

  .content-section ul li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    color: #4a5568;
    line-height: 1.7;
  }

  .content-section ul li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: #3b82f6;
    font-weight: 600;
  }

  .pillar, .principle, .application {
    background: rgba(59, 130, 246, 0.05);
    border-left: 4px solid #3b82f6;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
  }

  /* Problem/Solution Layout */
  .problem-solution {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  .problem, .solution {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .project-civicbase .problem {
    background: #fef2f2;
    border: 2px solid #fee2e2;
  }

  .project-civicbase .solution {
    background: #f0fdf4;
    border: 2px solid #dcfce7;
  }

  .highlight-text {
    background: #fef3c7;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 500;
    margin: 1rem 0;
  }

  .emphasis {
    font-weight: 600;
    color: #dc2626;
    margin-top: 1rem;
  }

  /* Status Section */
  .status-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    border-radius: 12px;
    color: white;
  }

  .status-section h3 {
    color: white;
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
  }

  .status-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .status-label {
    font-size: 0.875rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-value {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .future-note {
    margin-top: 1.5rem;
    font-style: italic;
    color: #6b7280;
  }

  /* Integration Section */
  .integration-section {
    padding: 5rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .integration-section .section-heading,
  .integration-section .section-intro {
    color: white;
  }

  .integration-flow {
    margin: 3rem 0;
  }

  .flow-step {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1rem;
  }

  .step-number {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: white;
    color: #667eea;
    border-radius: 50%;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .flow-step h3 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .flow-step p {
    opacity: 0.95;
    line-height: 1.7;
  }

  .flow-arrow {
    text-align: center;
    font-size: 2rem;
    margin: 1rem 0;
    opacity: 0.6;
  }

  .integration-summary {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 3rem;
    opacity: 0.95;
  }

  /* CTA Section */
  .final-cta {
    padding: 6rem 0;
    text-align: center;
    background: white;
  }

  .cta-heading {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a1a1a;
  }

  .cta-description {
    font-size: 1.125rem;
    color: #6b7280;
    max-width: 700px;
    margin: 0 auto 2rem;
    line-height: 1.7;
  }

  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .project-cta {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .btn-secondary {
    background: transparent;
    color: #3b82f6;
    border-color: #3b82f6;
  }

  .btn-secondary:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-2px);
  }

  .btn-large {
    padding: 1rem 3rem;
    font-size: 1.125rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero {
      padding: 4rem 0 3rem;
    }

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .section-heading {
      font-size: 2rem;
    }

    .project-title {
      font-size: 2rem;
    }

    .project-header {
      flex-direction: column;
      text-align: center;
    }

    .problem-solution {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .layers-grid {
      grid-template-columns: 1fr;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: stretch;
    }

    .project-cta {
      flex-direction: column;
    }

    .btn {
      text-align: center;
    }
  }
</style>
