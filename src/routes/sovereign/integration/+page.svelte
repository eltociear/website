<!-- src/routes/sovereign/integration/+page.svelte -->
<script>
  import { t } from '$lib/i18n';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  
  let activeConnection = null;
  
  const connections = [
    {
      id: 'crew',
      chapter: 9,
      chapterTitle: 'Your Arsenal',
      sovereignConcept: 'Building Your Core Crew',
      gfFramework: 'Meta-Governance Framework',
      frameworkPath: '/frameworks/meta-governance',
      icon: '👥',
      color: '#2B4B8C',
      
      whatYouBuilt: 'You designed principles for your crew. You established loyalty protocols. You delegated authority. You built bench strength.',
      
      whatItActuallyIs: 'You\'ve created a miniature Coordination Council with distributed decision-making, principle-based governance, and resilience mechanisms.',
      
      whyItMatters: 'The same architecture that coordinates your 5-person crew can coordinate 50 organizations or 500 communities. You\'re not just managing people—you\'re designing governance systems.',
      
      nextSteps: [
        'Formalize your principles as a written charter',
        'Document your decision-making protocols',
        'Map how your crew structure could scale',
        'Connect with other crews using similar models'
      ],
      
      gfConcepts: [
        'Polycentric Coordination',
        'Subsidiarity (decisions at lowest effective level)',
        'Dynamic Interoperability',
        'Power-Aware Design'
      ]
    },
    
    {
      id: 'economics',
      chapter: 10,
      chapterTitle: 'The Sovereign\'s Economy',
      sovereignConcept: 'Platform Economics',
      gfFramework: 'Financial Systems & AUBI Frameworks',
      frameworkPath: '/frameworks/financial-systems',
      icon: '💰',
      color: '#2D5F2D',
      
      whatYouBuilt: 'You shifted from mercenary extraction to platform creation. You built systems where everyone you touch gets richer and you capture a small percentage of massive growth.',
      
      whatItActuallyIs: 'You\'ve implemented the core economic principles of Hearts (care economy) and Leaves (ecological economy). Your "platform percentage" is how Hearts/Leaves flow through communities.',
      
      whyItMatters: 'Your economics aren\'t just good business—they\'re a pilot implementation of regenerative currency systems. You\'re proving the model works at your scale before it scales globally.',
      
      nextSteps: [
        'Calculate your value creation vs. value capture ratio',
        'Implement Hearts-compatible compensation (War Chest + Bonuses)',
        'Document your platform\'s compounding mechanisms',
        'Pilot actual Hearts/Leaves currency in your network'
      ],
      
      gfConcepts: [
        'Hearts (care work currency)',
        'Leaves (ecological restoration currency)',
        'AUBI (Adaptive Universal Basic Income)',
        'Platform vs. Extraction Economics'
      ]
    },
    
    {
      id: 'alliance',
      chapter: 11,
      chapterTitle: 'The Inner Circle',
      sovereignConcept: 'Your Alliance Network',
      gfFramework: 'Nested Economies Framework',
      frameworkPath: '/frameworks/nested-economies',
      icon: '🤝',
      color: '#B8860B',
      
      whatYouBuilt: 'You formed strategic alliances. You created an Inner Circle with complementary strengths. You established Operating Agreements and Council structures.',
      
      whatItActuallyIs: 'You\'ve created a Bioregional Network—multiple sovereign entities cooperating without central authority. Your Council is a coordination mechanism for nested autonomy.',
      
      whyItMatters: 'This is how planetary governance actually works: not top-down control, but networked sovereignty with clear protocols for cooperation. Your five allies are a microcosm of global coordination.',
      
      nextSteps: [
        'Formalize your Operating Agreement as a reusable template',
        'Map your network\'s collective capabilities',
        'Establish inter-organization resource sharing protocols',
        'Create a coordination currency (Hearts) for the network'
      ],
      
      gfConcepts: [
        'Nested Sovereignty (autonomy at every scale)',
        'Polycentric Networks',
        'Inter-Currency Translation',
        'Force Multiplication Through Alliance'
      ]
    },
    
    {
      id: 'protocols',
      chapter: 15,
      chapterTitle: 'Rewriting Reality',
      sovereignConcept: 'Protocol Design',
      gfFramework: 'Meta-Governance (Protocol Library)',
      frameworkPath: '/frameworks/meta-governance',
      icon: '⚙️',
      color: '#6B5CA5',
      
      whatYouBuilt: 'You designed protocols that shape behavior automatically. You created rules that others follow because they work, not because you enforce them.',
      
      whatItActuallyIs: 'You\'re contributing to the Global Protocol Library. Every protocol you design and test becomes a building block that other communities can adopt and adapt.',
      
      whyItMatters: 'Governance doesn\'t scale through control—it scales through protocols. Your Sunday Sync or Decision Template might become the standard for thousands of organizations.',
      
      nextSteps: [
        'Document your protocols in the standard format',
        'Submit successful protocols to the library',
        'Adopt proven protocols from other practitioners',
        'Design protocols explicitly for interoperability'
      ],
      
      gfConcepts: [
        'Protocol-Based Governance',
        'Modular Interoperability',
        'Open-Source Governance Standards',
        'Distributed Innovation'
      ]
    },
    
    {
      id: 'legacy',
      chapter: 12,
      chapterTitle: 'Dynasty Building',
      sovereignConcept: 'Succession & Legacy',
      gfFramework: 'Indigenous Governance Framework',
      frameworkPath: '/frameworks/indigenous-governance-and-traditional-knowledge',
      icon: '🌳',
      color: '#8B4513',
      
      whatYouBuilt: 'You designed succession systems. You created knowledge transfer protocols. You built structures that outlast you.',
      
      whatItActuallyIs: 'You\'re practicing Seven-Generation Thinking—the core principle of Indigenous governance. Your legacy structures implement intergenerational accountability.',
      
      whyItMatters: 'Modern institutions fail because they optimize for quarterly returns. You\'re building for decades. That\'s the same timeframe that creates resilient civilizations.',
      
      nextSteps: [
        'Write your Legacy Document using Seven-Generation framework',
        'Establish an Elder Council for long-term wisdom',
        'Create ceremonies that transfer knowledge and values',
        'Design institutions that can gracefully evolve or sunset'
      ],
      
      gfConcepts: [
        'Seven-Generation Accountability',
        'Intergenerational Knowledge Transfer',
        'Cultural Preservation Protocols',
        'Ceremonial Governance'
      ]
    },
    
    {
      id: 'myth',
      chapter: 13,
      chapterTitle: 'From Warlord to World-Builder',
      sovereignConcept: 'Creating Organizational Myth',
      gfFramework: 'Cultural & Meaning Infrastructure',
      frameworkPath: '/frameworks/meta-governance',
      icon: '📖',
      color: '#8B0000',
      
      whatYouBuilt: 'You created origin stories. You defined enemies, quests, and codes. You built myth that holds people together beyond transactions.',
      
      whatItActuallyIs: 'You\'ve created a Cultural Operating System—the meaning infrastructure that makes cooperation natural rather than forced.',
      
      whyItMatters: 'Systems without meaning die. Systems with meaning persist across generations. You\'re not just building organizations—you\'re building civilizations in miniature.',
      
      nextSteps: [
        'Document your origin story formally',
        'Establish regular rituals that reinforce the myth',
        'Train cultural historians to preserve stories',
        'Connect your myth to larger planetary narratives'
      ],
      
      gfConcepts: [
        'Meaning Infrastructure',
        'Cultural Resilience',
        'Shared Purpose Alignment',
        'Narrative Coherence Across Scales'
      ]
    }
  ];
  
  function toggleConnection(id) {
    activeConnection = activeConnection === id ? null : id;
  }
</script>

<svelte:head>
  <title>{$t('sovereign.integration.title')}</title>
  <meta name="description" content="{$t('sovereign.integration.subtitle')}" />
</svelte:head>

<!-- Header -->
<section class="integration-header">
  <div class="container">
    <a href="{base}/sovereign" class="back-link">← {$t('sovereign.integration.backToSovereign')}</a>
    <h1 class="page-title">{$t('sovereign.integration.title')}</h1>
    <p class="page-subtitle">{$t('sovereign.integration.subtitle')}</p>
    
    <div class="header-insight">
      <div class="insight-icon">💡</div>
      <div class="insight-content">
        <h3>{$t('sovereign.integration.insight.title')}</h3>
        <p>{$t('sovereign.integration.insight.text')}</p>
      </div>
    </div>
  </div>
</section>

<!-- The Bridge Section -->
<section class="bridge-section">
  <div class="container">
    <h2 class="section-title">{$t('sovereign.integration.bridge.title')}</h2>
    <p class="section-intro">{$t('sovereign.integration.bridge.intro')}</p>
    
    <div class="bridge-diagram">
      <div class="bridge-side personal">
        <h3>{$t('sovereign.integration.bridge.personal')}</h3>
        <p>{$t('sovereign.integration.bridge.personalDesc')}</p>
      </div>
      
      <div class="bridge-arrow">
        <span>→</span>
        <span class="bridge-label">{$t('sovereign.integration.bridge.same')}</span>
        <span>→</span>
      </div>
      
      <div class="bridge-side systemic">
        <h3>{$t('sovereign.integration.bridge.systemic')}</h3>
        <p>{$t('sovereign.integration.bridge.systemicDesc')}</p>
      </div>
    </div>
  </div>
</section>

<!-- Connections Grid -->
<section class="connections-section">
  <div class="container">
    <h2 class="section-title">{$t('sovereign.integration.connections.title')}</h2>
    
    <div class="connections-grid">
      {#each connections as connection}
        <div class="connection-card" style="border-left-color: {connection.color}">
          <div class="connection-header" on:click={() => toggleConnection(connection.id)} on:keypress={(e) => e.key === 'Enter' && toggleConnection(connection.id)} role="button" tabindex="0">
            <div class="header-left">
              <span class="connection-icon">{connection.icon}</span>
              <div class="header-text">
                <span class="chapter-label">{$t('sovereign.integration.chapter')} {connection.chapter}</span>
                <h3 class="connection-title">{connection.chapterTitle}</h3>
                <p class="sovereign-concept">{connection.sovereignConcept}</p>
              </div>
            </div>
            <div class="expand-icon" class:active={activeConnection === connection.id}>
              {activeConnection === connection.id ? '−' : '+'}
            </div>
          </div>
          
          {#if activeConnection === connection.id}
            <div class="connection-details">
              
              <div class="detail-block">
                <h4>{$t('sovereign.integration.whatYouBuilt')}</h4>
                <p>{connection.whatYouBuilt}</p>
              </div>
              
              <div class="detail-block highlight">
                <h4>{$t('sovereign.integration.whatItActuallyIs')}</h4>
                <p>{connection.whatItActuallyIs}</p>
              </div>
              
              <div class="detail-block">
                <h4>{$t('sovereign.integration.whyItMatters')}</h4>
                <p>{connection.whyItMatters}</p>
              </div>
              
              <div class="detail-block">
                <h4>{$t('sovereign.integration.gfConcepts')}</h4>
                <ul class="concepts-list">
                  {#each connection.gfConcepts as concept}
                    <li>{concept}</li>
                  {/each}
                </ul>
              </div>
              
              <div class="detail-block">
                <h4>{$t('sovereign.integration.nextSteps')}</h4>
                <ol class="steps-list">
                  {#each connection.nextSteps as step}
                    <li>{step}</li>
                  {/each}
                </ol>
              </div>
              
              <div class="connection-footer">
                <a href="{base}{connection.frameworkPath}" class="framework-link">
                  {$t('sovereign.integration.exploreFramework')}: {connection.gfFramework} →
                </a>
              </div>
              
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Implementation Path -->
<section class="implementation-section">
  <div class="container">
    <h2 class="section-title">{$t('sovereign.integration.implementation.title')}</h2>
    <p class="section-intro">{$t('sovereign.integration.implementation.intro')}</p>
    
    <div class="implementation-steps">
      
      <div class="step-card">
        <div class="step-number">1</div>
        <div class="step-content">
          <h3>{$t('sovereign.integration.implementation.step1.title')}</h3>
          <p>{$t('sovereign.integration.implementation.step1.description')}</p>
          <a href="{base}/sovereign/protocols" class="step-link">{$t('sovereign.integration.implementation.step1.action')} →</a>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">2</div>
        <div class="step-content">
          <h3>{$t('sovereign.integration.implementation.step2.title')}</h3>
          <p>{$t('sovereign.integration.implementation.step2.description')}</p>
          <a href="{base}/frameworks" class="step-link">{$t('sovereign.integration.implementation.step2.action')} →</a>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">3</div>
        <div class="step-content">
          <h3>{$t('sovereign.integration.implementation.step3.title')}</h3>
          <p>{$t('sovereign.integration.implementation.step3.description')}</p>
          <a href="{base}/sovereign/network" class="step-link">{$t('sovereign.integration.implementation.step3.action')} →</a>
        </div>
      </div>
      
      <div class="step-card highlight">
        <div class="step-number">4</div>
        <div class="step-content">
          <h3>{$t('sovereign.integration.implementation.step4.title')}</h3>
          <p>{$t('sovereign.integration.implementation.step4.description')}</p>
          <a href="{base}/contact" class="step-link">{$t('sovereign.integration.implementation.step4.action')} →</a>
        </div>
      </div>
      
    </div>
  </div>
</section>

<style>
  /* Header */
  .integration-header {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    padding: 3rem 2rem 2rem;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .back-link {
    display: inline-block;
    color: #DAA520;
    text-decoration: none;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .page-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 1.25rem;
    color: #e0e0e0;
    margin-bottom: 2rem;
  }

  .header-insight {
    display: flex;
    gap: 1.5rem;
    background: rgba(218, 165, 32, 0.1);
    border: 2px solid #DAA520;
    border-radius: 1rem;
    padding: 2rem;
    margin-top: 2rem;
  }

  .insight-icon {
    font-size: 3rem;
    flex-shrink: 0;
  }

  .insight-content h3 {
    color: #DAA520;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .insight-content p {
    color: #e0e0e0;
    line-height: 1.7;
  }

  /* Bridge Section */
  .bridge-section {
    padding: 4rem 2rem;
    background-color: #f8f9fa;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 1rem;
  }

  .section-intro {
    font-size: 1.125rem;
    color: #555;
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem;
    line-height: 1.7;
  }

  .bridge-diagram {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
  }

  .bridge-side {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .bridge-side h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .personal {
    border-top: 4px solid #2B4B8C;
  }

  .personal h3 {
    color: #2B4B8C;
  }

  .systemic {
    border-top: 4px solid #2D5F2D;
  }

  .systemic h3 {
    color: #2D5F2D;
  }

  .bridge-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 2rem;
    color: #DAA520;
    font-weight: bold;
  }

  .bridge-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #666;
  }

  /* Connections Section */
  .connections-section {
    padding: 4rem 2rem;
    background-color: white;
  }

  .connections-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .connection-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-left: 6px solid;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: box-shadow 0.2s;
  }

  .connection-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .connection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    cursor: pointer;
    user-select: none;
  }

  .connection-header:hover {
    background-color: #f8f9fa;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }

  .connection-icon {
    font-size: 2.5rem;
  }

  .chapter-label {
    display: block;
    font-size: 0.875rem;
    color: #666;
    font-weight: 600;
  }

  .connection-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0.25rem 0;
  }

  .sovereign-concept {
    font-size: 0.95rem;
    color: #666;
    font-style: italic;
  }

  .expand-icon {
    font-size: 2rem;
    color: #DAA520;
    font-weight: bold;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f8f9fa;
    transition: transform 0.2s;
  }

  .expand-icon.active {
    transform: rotate(180deg);
  }

  .connection-details {
    padding: 0 1.5rem 1.5rem;
    border-top: 2px solid #f0f0f0;
  }

  .detail-block {
    margin-top: 1.5rem;
    padding: 1.25rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
  }

  .detail-block.highlight {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: white;
  }

  .detail-block h4 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.75rem;
  }

  .detail-block.highlight h4 {
    color: white;
  }

  .detail-block p {
    line-height: 1.6;
    color: #555;
  }

  .detail-block.highlight p {
    color: white;
  }

  .concepts-list,
  .steps-list {
    margin: 0;
    padding-left: 1.5rem;
  }

  .concepts-list li,
  .steps-list li {
    margin: 0.5rem 0;
    line-height: 1.5;
    color: #555;
  }

  .connection-footer {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #f0f0f0;
  }

  .framework-link {
    display: inline-block;
    background-color: #2B4B8C;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .framework-link:hover {
    background-color: #1a3a6b;
  }

  /* Implementation Section */
  .implementation-section {
    padding: 4rem 2rem;
    background-color: #f8f9fa;
  }

  .implementation-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .step-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .step-card.highlight {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: white;
  }

  .step-number {
    width: 4rem;
    height: 4rem;
    background-color: #DAA520;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
  }

  .step-card.highlight .step-number {
    background-color: white;
    color: #DAA520;
  }

  .step-content h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }

  .step-card.highlight .step-content h3 {
    color: white;
  }

  .step-content p {
    line-height: 1.6;
    color: #555;
    margin-bottom: 1rem;
  }

  .step-card.highlight .step-content p {
    color: white;
  }

  .step-link {
    display: inline-block;
    color: #2B4B8C;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
  }

  .step-link:hover {
    color: #DAA520;
  }

  .step-card.highlight .step-link {
    color: white;
    text-decoration: underline;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .bridge-diagram {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
    }

    .bridge-arrow {
      transform: rotate(90deg);
    }

    .header-left {
      flex-direction: column;
      align-items: flex-start;
    }

    .connection-icon {
      font-size: 2rem;
    }

    .implementation-steps {
      grid-template-columns: 1fr;
    }

    .header-insight {
      flex-direction: column;
    }
  }

  @media (max-width: 640px) {
    .connection-header {
      padding: 1rem;
    }

    .connection-details {
      padding: 0 1rem 1rem;
    }

    .section-title {
      font-size: 2rem;
    }
  }
</style>
