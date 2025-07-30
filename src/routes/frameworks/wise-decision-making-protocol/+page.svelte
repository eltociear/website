<!-- src/routes/frameworks/wise-decision-making-protocol/+page.svelte -->
<script>
  import { page } from '$app/stores';
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import FrameworkComingSoon from '$lib/components/FrameworkComingSoon.svelte';
     
  export let data;

  $: if (browser && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>Wise Decision-Making & Integration Protocol (WDIP) | Global Governance Framework</title>
  <meta name="description" content="The universal methodology providing the 'How' for wise decision-making across complex, multi-domain issues - integrating diverse wisdom to arrive at choices that are wise, just, and regenerative." />
  <meta name="keywords" content="decision-making, governance methodology, wisdom integration, seven-generation thinking, Indigenous knowledge, systems thinking, future generations" />
</svelte:head>

<div class="documentation-container">
  <FrameworkSidebar />

  <div class="content">
    <!-- WDIP Coming Soon Card -->
    <FrameworkComingSoon 
      frameworkName="wdip"
      icon="🧭"
      expectedQuarter="Q2 2026"
      themeColors={{
        primary: '#7c3aed',
        secondary: '#a855f7', 
        accent: '#fbbf24',
        light: '#faf5ff'
      }}
      contactEmail="globalgovernanceframework@gmail.com"
      frameworksPageUrl="{base}/frameworks"
    />

    <!-- Wisdom Philosophy Section -->
    <div class="philosophy-section">
      <h2>🧠 The Philosophy of Wise Decision-Making</h2>
      <div class="philosophy-grid">
        <div class="philosophy-card">
          <h3>🌀 Beyond Linear Thinking</h3>
          <p>Complex civilizational challenges require decision-making processes that honor the interconnected nature of reality. WDIP moves beyond reductionist approaches to embrace holistic sensemaking.</p>
        </div>
        
        <div class="philosophy-card">
          <h3>🌳 Seven-Generation Perspective</h3>
          <p>Every decision is evaluated through a 200+ year lens, asking: "What choice would our ancestors be proud of and our descendants thank us for?" This radical shift from short-term gains to long-term flourishing.</p>
        </div>
        
        <div class="philosophy-card">
          <h3>❤️ Relational Accountability</h3>
          <p>Decisions are assessed based on their impact on relationships - among humans, between humans and non-human beings, and with Earth itself. The goal is to heal and strengthen bonds.</p>
        </div>
        
        <div class="philosophy-card">
          <h3>✨ Emergent Coherence</h3>
          <p>Wise outcomes emerge from deep, authentic dialogue and integration of diverse truths, rather than being imposed through top-down authority or forced compromise.</p>
        </div>
      </div>
    </div>

    <!-- Five-Phase Process Section -->
    <div class="process-section">
      <h2>🔄 The Five-Phase Wise Decision Process</h2>
      <div class="process-phases">
        <div class="phase-card phase-1">
          <div class="phase-header">
            <span class="phase-number">1</span>
            <h3>The Invitation & Framing</h3>
            <span class="phase-subtitle">The Question</span>
          </div>
          <div class="phase-content">
            <p><strong>Goal:</strong> Arrive at shared understanding of the <em>true</em> question being asked.</p>
            <ul>
              <li>Issue triage and system mapping via AI Assistant</li>
              <li>Seven-generation framing by Global Council for the Future</li>
              <li>Formal public invitation for engagement</li>
            </ul>
          </div>
        </div>

        <div class="phase-card phase-2">
          <div class="phase-header">
            <span class="phase-number">2</span>
            <h3>Deep Inquiry & Sensemaking</h3>
            <span class="phase-subtitle">The Listening</span>
          </div>
          <div class="phase-content">
            <p><strong>Goal:</strong> Gather and honor all relevant knowledge and wisdom without premature judgment.</p>
            <ul>
              <li>Scientific & technical synthesis</li>
              <li>Indigenous & spiritual council consultation</li>
              <li>Lived experience testimony</li>
              <li>Non-human consultation via Rights of Nature</li>
            </ul>
          </div>
        </div>

        <div class="phase-card phase-3">
          <div class="phase-header">
            <span class="phase-number">3</span>
            <h3>Synthesis & Possibility</h3>
            <span class="phase-subtitle">The Weaving</span>
          </div>
          <div class="phase-content">
            <p><strong>Goal:</strong> Generate diverse set of integrated, life-affirming potential pathways.</p>
            <ul>
              <li>Integration via Transdisciplinary Foresight Labs</li>
              <li>AI-mediated scenario modeling</li>
              <li>3-5 distinct, holistic pathway generation</li>
            </ul>
          </div>
        </div>

        <div class="phase-card phase-4">
          <div class="phase-header">
            <span class="phase-number">4</span>
            <h3>Deliberation & Choice</h3>
            <span class="phase-subtitle">The Turning Point</span>
          </div>
          <div class="phase-content">
            <p><strong>Goal:</strong> Make collective choice with full awareness of weight and consequences.</p>
            <ul>
              <li>Meta-Governance Council deliberation</li>
              <li>Principle-based assessment</li>
              <li>Consensus seeking with cultural mediation</li>
              <li>Transparent documentation of choice</li>
            </ul>
          </div>
        </div>

        <div class="phase-card phase-5">
          <div class="phase-header">
            <span class="phase-number">5</span>
            <h3>Embodiment & Learning</h3>
            <span class="phase-subtitle">The Living</span>
          </div>
          <div class="phase-content">
            <p><strong>Goal:</strong> Implement chosen path as living experiment and continuously learn.</p>
            <ul>
              <li>Adaptive implementation</li>
              <li>Real-time reflexivity engines</li>
              <li>Regular learning loops and reviews</li>
              <li>Knowledge sharing via Global Meaning Infrastructure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Use Cases Section -->
    <div class="use-cases-section">
      <h2>⚡ Protocol Activation & Use Cases</h2>
      <div class="use-cases-grid">
        <div class="use-case-card existential">
          <h4>🤖 Emerging Technologies</h4>
          <p>Governance of technologies with existential potential - Artificial General Intelligence, synthetic biology, quantum computing applications</p>
        </div>
        
        <div class="use-case-card planetary">
          <h4>🌍 Planetary Rights</h4>
          <p>Amendments to Charter for Planetary Rights & Responsibilities, global commons governance decisions</p>
        </div>
        
        <div class="use-case-card crisis">
          <h4>🚨 Global Crises</h4>
          <p>Responses to crises crossing multiple planetary boundaries - climate tipping points, ecosystem collapse</p>
        </div>
        
        <div class="use-case-card resources">
          <h4>⛏️ Resource Conflicts</h4>
          <p>Decisions involving Global Commons - deep sea mining, lunar development, atmospheric geoengineering</p>
        </div>
        
        <div class="use-case-card migration">
          <h4>🗺️ Climate Migration</h4>
          <p>Large-scale Climate Migration and Sanctuary Protocols affecting multiple bioregions</p>
        </div>
        
        <div class="use-case-card governance">
          <h4>🏛️ Governance Evolution</h4>
          <p>Fundamental changes to Meta-Governance structures, new framework integration decisions</p>
        </div>
      </div>
    </div>

    <!-- Integration Preview -->
    <div class="integration-section">
      <h2>🔗 Integration with Global Governance Ecosystem</h2>
      <div class="integration-flow">
        <div class="integration-step">
          <h4>📡 Information Layer</h4>
          <p>Global Institutional AI Assistant, Knowledge Stewardship Council, Indigenous AI Oracles</p>
        </div>
        <div class="flow-arrow">→</div>
        <div class="integration-step">
          <h4>🏛️ Governance Layer</h4>
          <p>Meta-Governance Councils, UN Parliamentary Assembly, Youth & Indigenous Councils</p>
        </div>
        <div class="flow-arrow">→</div>
        <div class="integration-step">
          <h4>⚖️ Justice Layer</h4>
          <p>Digital Justice Tribunal, Rights enforcement, Accountability mechanisms</p>
        </div>
        <div class="flow-arrow">→</div>
        <div class="integration-step">
          <h4>🌱 Implementation Layer</h4>
          <p>BAZ-level adaptation, Community Work Teams, Reflexivity engines</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .documentation-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  @media (max-width: 768px) {
    .documentation-container {
      grid-template-columns: 1fr;
    }
  }
  
  .content {
    min-width: 0;
  }

  /* Philosophy Section */
  .philosophy-section {
    margin: 3rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
    border-radius: 1rem;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .philosophy-section h2 {
    color: #7c3aed;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .philosophy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .philosophy-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(124, 58, 237, 0.1);
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
  }

  .philosophy-card h3 {
    color: #7c3aed;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  .philosophy-card p {
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }

  /* Process Section */
  .process-section {
    margin: 3rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%);
    border-radius: 1rem;
    border: 1px solid rgba(16, 185, 129, 0.1);
  }

  .process-section h2 {
    color: #059669;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    text-align: center;
  }

  .process-phases {
    display: grid;
    gap: 1.5rem;
  }

  .phase-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    border: 1px solid rgba(16, 185, 129, 0.2);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  }

  .phase-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    color: white;
  }

  .phase-number {
    background: rgba(255, 255, 255, 0.2);
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .phase-header h3 {
    margin: 0;
    flex: 1;
    font-size: 1.2rem;
  }

  .phase-subtitle {
    font-style: italic;
    opacity: 0.9;
    font-size: 0.9rem;
  }

  .phase-content {
    padding: 1.5rem;
  }

  .phase-content p {
    margin: 0 0 1rem 0;
    color: #374151;
    font-weight: 500;
  }

  .phase-content ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #6b7280;
  }

  .phase-content li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  /* Use Cases Section */
  .use-cases-section {
    margin: 3rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.05) 100%);
    border-radius: 1rem;
    border: 1px solid rgba(239, 68, 68, 0.1);
  }

  .use-cases-section h2 {
    color: #dc2626;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .use-cases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .use-case-card {
    background: white;
    padding: 1.25rem;
    border-radius: 0.75rem;
    border-left: 4px solid;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .existential { border-left-color: #7c3aed; }
  .planetary { border-left-color: #059669; }
  .crisis { border-left-color: #dc2626; }
  .resources { border-left-color: #d97706; }
  .migration { border-left-color: #0891b2; }
  .governance { border-left-color: #4338ca; }

  .use-case-card h4 {
    margin: 0 0 0.5rem 0;
    color: #374151;
    font-size: 1rem;
  }

  .use-case-card p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  /* Integration Section */
  .integration-section {
    margin: 3rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(67, 56, 202, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%);
    border-radius: 1rem;
    border: 1px solid rgba(67, 56, 202, 0.1);
  }

  .integration-section h2 {
    color: #4338ca;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .integration-flow {
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow-x: auto;
    padding: 1rem 0;
  }

  .integration-step {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(67, 56, 202, 0.1);
    min-width: 200px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(67, 56, 202, 0.1);
  }

  .integration-step h4 {
    margin: 0 0 0.5rem 0;
    color: #4338ca;
    font-size: 1rem;
  }

  .integration-step p {
    margin: 0;
    color: #6b7280;
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .flow-arrow {
    color: #4338ca;
    font-size: 1.5rem;
    font-weight: bold;
    flex-shrink: 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .philosophy-grid,
    .use-cases-grid {
      grid-template-columns: 1fr;
    }
    
    .philosophy-section,
    .process-section,
    .use-cases-section,
    .integration-section {
      padding: 1.5rem;
      margin: 2rem 0;
    }
    
    .integration-flow {
      flex-direction: column;
    }
    
    .flow-arrow {
      transform: rotate(90deg);
    }
    
    .phase-header {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
  }
</style>
