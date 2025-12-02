<!-- src/routes/tools/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let isVisible = false;
  
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  // Tools data - will expand as more tools are added
  $: tools = [
    {
      id: 'radical-competence',
      title: 'The Rigged Board Diagnostic',
      subtitle: 'From Radical Competence',
      description: 'Strategic power mapping for community organizers. Map decision-makers, money flows, extraction patterns, and leverage points in your city. Complete in one weekend, use Monday morning.',
      icon: '🗺️',
      color: '#7c3aed',
      lightColor: 'rgba(124, 58, 237, 0.1)',
      href: `${base}/tools/radical-competence`,
      badges: [
        { text: '8 Worksheets', icon: '📋' },
        { text: '3 Hours', icon: '⏱️' },
        { text: 'Week 0 Protocol', icon: '🎯' },
        { text: 'Action-Ready', icon: '✅' }
      ],
      tags: ['Organizing', 'Strategy', 'Power Mapping', 'Community'],
      featured: true,
      available: true
    },
    // Placeholder for future tools
    {
      id: 'coming-soon-1',
      title: 'Integration Scorecard',
      subtitle: 'Project Janus Framework',
      description: 'Evaluate interventions across biological, cognitive, emotional, behavioral, social, and existential dimensions. Six-domain analysis for holistic solutions.',
      icon: '🧭',
      color: '#2563eb',
      lightColor: 'rgba(37, 99, 235, 0.1)',
      href: `${base}/tools/integration-scorecard`,
      badges: [
        { text: 'Coming Soon', icon: '🚧' }
      ],
      tags: ['Analysis', 'Systems', 'Integration', 'Framework'],
      featured: false,
      available: false
    },
    {
      id: 'coming-soon-2',
      title: 'Developmental Stage Assessment',
      subtitle: 'Spiral Dynamics Tool',
      description: 'Identify your current operating system and understand developmental transitions. Map consciousness stages for individuals and organizations.',
      icon: '🌀',
      color: '#059669',
      lightColor: 'rgba(5, 150, 105, 0.1)',
      href: `${base}/tools/developmental-assessment`,
      badges: [
        { text: 'Coming Soon', icon: '🚧' }
      ],
      tags: ['Development', 'Consciousness', 'Assessment', 'Growth'],
      featured: false,
      available: false
    }
  ];

  $: availableTools = tools.filter(t => t.available);
  $: comingSoonTools = tools.filter(t => !t.available);
</script>

<svelte:head>
  <title>Tools - Global Governance Frameworks</title>
  <meta name="description" content="Strategic tools for systemic change. Power mapping, integration frameworks, and developmental assessments for organizers and systems thinkers." />
  <meta property="og:title" content="Tools - Global Governance Frameworks" />
  <meta property="og:description" content="Strategic tools for systemic change. Power mapping, integration frameworks, and developmental assessments for organizers and systems thinkers." />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="tools-page" class:visible={isVisible}>
  
  <!-- Hero Section -->
  <section class="tools-hero">
    <div class="hero-container">
      <div class="breadcrumb">
        <a href="{base}/resources">Resources</a>
        <span>›</span>
        <span>Tools</span>
      </div>
      
      <h1 class="hero-title">Strategic Tools</h1>
      <p class="hero-subtitle">Practical frameworks for organizing and systems change</p>
      <p class="hero-description">
        Operational tools built from the Global Governance Frameworks. 
        Worksheets, assessments, and strategic diagnostics for building alternative infrastructure.
      </p>
      
      <div class="hero-stats">
        <div class="stat">
          <div class="stat-number">{availableTools.length}</div>
          <div class="stat-label">Available Now</div>
        </div>
        <div class="stat">
          <div class="stat-number">{comingSoonTools.length}</div>
          <div class="stat-label">Coming Soon</div>
        </div>
        <div class="stat">
          <div class="stat-number">Free</div>
          <div class="stat-label">Always</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Available Tools Section -->
  {#if availableTools.length > 0}
  <section class="available-tools">
    <div class="container">
      <h2 class="section-title">Available Tools</h2>
      <p class="section-subtitle">Ready to use today</p>
      
      <div class="tools-grid">
        {#each availableTools as tool (tool.id)}
          <a 
            href={tool.href}
            class="tool-card"
            class:featured={tool.featured}
          >
            {#if tool.featured}
              <div class="featured-badge">Featured</div>
            {/if}
            
            <div class="tool-header">
              <div class="tool-icon" style="background: {tool.color};">
                {tool.icon}
              </div>
              <div class="tool-header-content">
                <h3 class="tool-title">{tool.title}</h3>
                <p class="tool-subtitle">{tool.subtitle}</p>
              </div>
            </div>
            
            <p class="tool-description">{tool.description}</p>
            
            <div class="tool-badges">
              {#each tool.badges as badge}
                <span class="badge">
                  <span class="badge-icon">{badge.icon}</span>
                  {badge.text}
                </span>
              {/each}
            </div>
            
            <div class="tool-tags">
              {#each tool.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
            
            <div class="tool-action">
              <span class="action-text">Explore Tool</span>
              <span class="action-arrow">→</span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
  {/if}

  <!-- Coming Soon Section -->
  {#if comingSoonTools.length > 0}
  <section class="coming-soon-tools">
    <div class="container">
      <h2 class="section-title">In Development</h2>
      <p class="section-subtitle">Tools being built for future release</p>
      
      <div class="tools-grid-compact">
        {#each comingSoonTools as tool (tool.id)}
          <div class="tool-card-compact">
            <div class="compact-header">
              <div class="tool-icon-small" style="background: {tool.color};">
                {tool.icon}
              </div>
              <h3 class="compact-title">{tool.title}</h3>
            </div>
            <p class="compact-subtitle">{tool.subtitle}</p>
            <p class="compact-description">{tool.description}</p>
            <div class="compact-tags">
              {#each tool.tags as tag}
                <span class="tag-small">{tag}</span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  {/if}

  <!-- What Makes These Different Section -->
  <section class="philosophy-section">
    <div class="container">
      <h2 class="section-title">What Makes These Tools Different</h2>
      
      <div class="philosophy-grid">
        <div class="philosophy-card">
          <div class="philosophy-icon">🎯</div>
          <h3 class="philosophy-title">Action-Oriented</h3>
          <p class="philosophy-description">
            Not theory. Not inspiration. Operational tools you can use Monday morning. 
            Time-boxed, with clear outputs and next steps.
          </p>
        </div>

        <div class="philosophy-card">
          <div class="philosophy-icon">🔗</div>
          <h3 class="philosophy-title">Systems-Integrated</h3>
          <p class="philosophy-description">
            Built on Project Janus multi-domain framework. Address root causes, 
            not symptoms. Integration across biological, cognitive, emotional, social, existential layers.
          </p>
        </div>

        <div class="philosophy-card">
          <div class="philosophy-icon">📊</div>
          <h3 class="philosophy-title">Strategically Rigorous</h3>
          <p class="philosophy-description">
            Power mapping. Resource analysis. Leverage identification. 
            Competence over inspiration. Intelligence over enthusiasm.
          </p>
        </div>

        <div class="philosophy-card">
          <div class="philosophy-icon">🌍</div>
          <h3 class="philosophy-title">Context-Aware</h3>
          <p class="philosophy-description">
            Templates, not blueprints. Adapt to your city, culture, constraints. 
            Tested in real-world organizing across UK municipalities.
          </p>
        </div>

        <div class="philosophy-card">
          <div class="philosophy-icon">🔓</div>
          <h3 class="philosophy-title">Freely Available</h3>
          <p class="philosophy-description">
            No paywalls. No gatekeeping. Commons-based sharing. 
            Tools belong to the movement, not to consultants.
          </p>
        </div>

        <div class="philosophy-card">
          <div class="philosophy-icon">🔄</div>
          <h3 class="philosophy-title">Iteratively Refined</h3>
          <p class="philosophy-description">
            Built through practice, refined through feedback. 
            Living documents updated as we learn what works in the field.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- How to Use Section -->
  <section class="how-to-use-section">
    <div class="container">
      <h2 class="section-title">How to Use These Tools</h2>
      
      <div class="usage-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3 class="step-title">Choose Your Tool</h3>
            <p class="step-description">
              Start with the Rigged Board Diagnostic if you're beginning organizing work. 
              It maps your territory and identifies leverage points.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3 class="step-title">Follow the Protocol</h3>
            <p class="step-description">
              Each tool has time limits and clear steps. Don't overthink. 
              Strategic orientation beats perfect analysis.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3 class="step-title">Take Action</h3>
            <p class="step-description">
              Tools produce actionable outputs: emails to send, people to contact, 
              first moves to make. Execute immediately.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3 class="step-title">Share & Iterate</h3>
            <p class="step-description">
              Use with your organizing squad. Share what works. 
              Adapt to your context. Help us improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="container">
      <div class="cta-box">
        <h2 class="cta-title">Start Mapping Your Territory</h2>
        <p class="cta-description">
          The Rigged Board Diagnostic helps you map power, money, and leverage in your city. 
          Complete over one weekend. Start organizing Monday morning.
        </p>
        <a href="{base}/tools/radical-competence" class="cta-button">
          Get the Diagnostic Tool
          <span class="button-arrow">→</span>
        </a>
      </div>
    </div>
  </section>

</div>

<style>
  /* Base Styles */
  .tools-page {
    min-height: 100vh;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .tools-page.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .hero-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Hero Section */
  .tools-hero {
    padding: 3rem 0 4rem 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #a855f7 100%);
    color: white;
    text-align: center;
  }

  .breadcrumb {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }

  .breadcrumb a {
    color: white;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .breadcrumb a:hover {
    opacity: 0.7;
  }

  .breadcrumb span {
    margin: 0 0.5rem;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    opacity: 0.95;
  }

  .hero-description {
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto 2.5rem auto;
    opacity: 0.9;
  }

  .hero-stats {
    display: flex;
    gap: 3rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Section Styles */
  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .section-subtitle {
    font-size: 1.2rem;
    color: #64748b;
    text-align: center;
    margin-bottom: 3rem;
  }

  /* Available Tools Section */
  .available-tools {
    padding: 4rem 0;
    background: white;
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 2rem;
  }

  .tool-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .tool-card:hover {
    border-color: #7c3aed;
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(124, 58, 237, 0.15);
  }

  .tool-card.featured {
    border-color: #fbbf24;
    background: linear-gradient(135deg, #fffbeb 0%, white 100%);
  }

  .tool-card.featured:hover {
    border-color: #f59e0b;
  }

  .featured-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .tool-header {
    display: flex;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
    align-items: flex-start;
  }

  .tool-icon {
    font-size: 2.5rem;
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    color: white;
    flex-shrink: 0;
  }

  .tool-header-content {
    flex: 1;
  }

  .tool-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  .tool-subtitle {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 600;
    margin: 0;
  }

  .tool-description {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1.25rem;
    flex: 1;
  }

  .tool-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .badge {
    background: #f1f5f9;
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .badge-icon {
    font-size: 1rem;
  }

  .tool-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .tag {
    background: transparent;
    border: 1px solid #e2e8f0;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    color: #64748b;
  }

  .tool-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    color: #7c3aed;
    font-weight: 700;
  }

  .action-arrow {
    font-size: 1.5rem;
    transition: transform 0.2s;
  }

  .tool-card:hover .action-arrow {
    transform: translateX(4px);
  }

  /* Coming Soon Section */
  .coming-soon-tools {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .tools-grid-compact {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .tool-card-compact {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    opacity: 0.8;
  }

  .compact-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .tool-icon-small {
    font-size: 1.75rem;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    color: white;
  }

  .compact-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .compact-subtitle {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
  }

  .compact-description {
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .compact-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tag-small {
    background: #f1f5f9;
    padding: 0.25rem 0.625rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    color: #64748b;
  }

  /* Philosophy Section */
  .philosophy-section {
    padding: 4rem 0;
    background: white;
  }

  .philosophy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .philosophy-card {
    text-align: center;
  }

  .philosophy-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .philosophy-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }

  .philosophy-description {
    color: #475569;
    line-height: 1.6;
  }

  /* How to Use Section */
  .how-to-use-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  }

  .usage-steps {
    max-width: 900px;
    margin: 0 auto;
  }

  .step {
    display: flex;
    gap: 2rem;
    margin-bottom: 2.5rem;
    align-items: flex-start;
  }

  .step:last-child {
    margin-bottom: 0;
  }

  .step-number {
    font-size: 2rem;
    font-weight: 800;
    color: #7c3aed;
    background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
    width: 4rem;
    height: 4rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .step-description {
    color: #475569;
    line-height: 1.6;
  }

  /* CTA Section */
  .cta-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #1e1b4b, #7c3aed);
  }

  .cta-box {
    text-align: center;
    color: white;
    max-width: 800px;
    margin: 0 auto;
  }

  .cta-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  .cta-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.95;
    line-height: 1.6;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 2.5rem;
    background: white;
    color: #7c3aed;
    text-decoration: none;
    border-radius: 0.75rem;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.2s;
  }

  .cta-button:hover {
    background: #f3e8ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
  }

  .button-arrow {
    font-size: 1.5rem;
    transition: transform 0.2s;
  }

  .cta-button:hover .button-arrow {
    transform: translateX(4px);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.2rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .tools-grid {
      grid-template-columns: 1fr;
    }

    .tools-grid-compact {
      grid-template-columns: 1fr;
    }

    .philosophy-grid {
      grid-template-columns: 1fr;
    }

    .step {
      flex-direction: column;
      gap: 1rem;
    }

    .step-number {
      width: 3rem;
      height: 3rem;
      font-size: 1.5rem;
    }

    .cta-title {
      font-size: 2rem;
    }

    .cta-description {
      font-size: 1.1rem;
    }
  }

  /* Accessibility */
  .tool-card:focus-visible {
    outline: 3px solid #7c3aed;
    outline-offset: 2px;
  }

  .cta-button:focus-visible {
    outline: 3px solid white;
    outline-offset: 2px;
  }
</style>
