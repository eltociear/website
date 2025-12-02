<!-- src/routes/tools/radical-competence/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';

  let isVisible = false;
  let downloadMethod = 'google'; // 'google' or 'excel'
  let copyStatus = '';
  let activeTab = 'rigged-board'; // 'rigged-board' or 'scorecard'
  
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  // Rigged Board Diagnostic URLs
  const googleSheetsTemplateUrl = 'https://docs.google.com/spreadsheets/d/1DLkHOec7g7ySYZ3wTpZmLlzwKnDoPyklPJcfeh2H7Sw/copy';
  const excelDownloadUrl = `${base}/tools/radical-competence/rigged-board-diagnostic.xlsx`;
  
  // Integration Scorecard URL
  const scorecardTemplateUrl = `${base}/tools/radical-competence/integration-scorecard-template.html`;

  function handleGoogleSheetsCopy() {
    if (!browser) return;
    window.open(googleSheetsTemplateUrl, '_blank');
  }

  async function handleExcelDownload() {
    if (!browser) return;
    
    try {
      const response = await fetch(excelDownloadUrl, { method: 'HEAD' });
      if (response.ok) {
        window.location.href = excelDownloadUrl;
      } else {
        alert('Download not available yet. Please use the Google Sheets version.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download not available yet. Please use the Google Sheets version.');
    }
  }

  function handleScorecardOpen() {
    if (!browser) return;
    window.open(scorecardTemplateUrl, '_blank');
  }

  function copyToClipboard(text) {
    if (!browser) return;
    
    navigator.clipboard.writeText(text).then(() => {
      copyStatus = 'Copied!';
      setTimeout(() => {
        copyStatus = '';
      }, 2000);
    });
  }
</script>

<svelte:head>
  <title>Radical Competence Tools - Strategic Templates for Organizers</title>
  <meta name="description" content="Strategic tools for organizing: Rigged Board Diagnostic for power mapping and Integration Scorecard for evaluating interventions across six domains." />
  <meta property="og:title" content="Radical Competence Tools - Strategic Templates for Organizers" />
  <meta property="og:description" content="Strategic tools for organizing: Rigged Board Diagnostic for power mapping and Integration Scorecard for evaluating interventions across six domains." />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="tool-page" class:visible={isVisible}>
  
  <!-- Hero Section -->
  <section class="tool-hero">
    <div class="hero-container">
      <div class="breadcrumb">
        <a href="{base}/resources">Resources</a>
        <span>›</span>
        <a href="{base}/resources/tools">Tools</a>
        <span>›</span>
        <span>Radical Competence</span>
      </div>
      
      <h1 class="hero-title">Radical Competence Tools</h1>
      <p class="hero-subtitle">Strategic Templates for Community Organizers</p>
      <p class="hero-description">
        Two comprehensive tools for strategic organizing: map power structures with the Rigged Board Diagnostic, 
        then evaluate your interventions with the Integration Scorecard. Complete in one weekend, use Monday morning.
      </p>
      
      <div class="hero-badges">
        <span class="badge">📋 2 Core Tools</span>
        <span class="badge">⏱️ Ready to Use</span>
        <span class="badge">🎯 Evidence-Based</span>
        <span class="badge">✅ Action-Ready</span>
      </div>
    </div>
  </section>

  <!-- Tool Selection Tabs -->
  <section class="tool-tabs">
    <div class="container">
      <div class="tabs-container">
        <button 
          class="tab-button" 
          class:active={activeTab === 'rigged-board'}
          on:click={() => activeTab = 'rigged-board'}
        >
          <span class="tab-icon">🗺️</span>
          <span class="tab-title">Rigged Board Diagnostic</span>
          <span class="tab-subtitle">Power Mapping</span>
        </button>
        <button 
          class="tab-button" 
          class:active={activeTab === 'scorecard'}
          on:click={() => activeTab = 'scorecard'}
        >
          <span class="tab-icon">✅</span>
          <span class="tab-title">Integration Scorecard</span>
          <span class="tab-subtitle">Intervention Assessment</span>
        </button>
      </div>
    </div>
  </section>

  <!-- Download Section - Rigged Board Diagnostic -->
  {#if activeTab === 'rigged-board'}
  <section class="download-section">
    <div class="container">
      <h2 class="section-title">The Rigged Board Diagnostic</h2>
      <p class="section-subtitle">Map power structures, money flows, and leverage points in your city</p>
      
      <div class="download-options">
        <!-- Google Sheets Option -->
        <div class="download-card" class:selected={downloadMethod === 'google'}>
          <div class="card-header">
            <div class="card-icon">📊</div>
            <h3 class="card-title">Google Sheets</h3>
            <span class="recommended-badge">Recommended</span>
          </div>
          
          <div class="card-features">
            <div class="feature">✓ Works in browser</div>
            <div class="feature">✓ Auto-saves your progress</div>
            <div class="feature">✓ Share with your team</div>
            <div class="feature">✓ Updates automatically</div>
            <div class="feature">✓ Formulas calculate totals</div>
          </div>
          
          <button 
            class="download-button primary"
            on:click={handleGoogleSheetsCopy}
          >
            <span class="button-icon">📑</span>
            Make a Copy in Google Sheets
          </button>
          
          <p class="card-note">Opens in new tab. You'll need a Google account (free).</p>
        </div>

        <!-- Excel Option -->
        <div class="download-card" class:selected={downloadMethod === 'excel'}>
          <div class="card-header">
            <div class="card-icon">📥</div>
            <h3 class="card-title">Excel Download</h3>
          </div>
          
          <div class="card-features">
            <div class="feature">✓ Works offline</div>
            <div class="feature">✓ Excel, LibreOffice, Numbers</div>
            <div class="feature">✓ Complete control</div>
            <div class="feature">✓ No account needed</div>
            <div class="feature">✓ Professional formatting</div>
          </div>
          
          <button 
            class="download-button secondary"
            on:click={handleExcelDownload}
          >
            <span class="button-icon">⬇️</span>
            Download Excel File
          </button>
          
          <p class="card-note">~150KB file. Compatible with all spreadsheet apps.</p>
        </div>
      </div>
    </div>
  </section>
  {/if}

  <!-- Download Section - Integration Scorecard -->
  {#if activeTab === 'scorecard'}
  <section class="download-section">
    <div class="container">
      <h2 class="section-title">Integration Scorecard</h2>
      <p class="section-subtitle">Six-domain assessment for evaluating organizing interventions</p>
      
      <div class="download-options">
        <!-- Scorecard Template Option -->
        <div class="download-card selected">
          <div class="card-header">
            <div class="card-icon">📝</div>
            <h3 class="card-title">Interactive Template</h3>
            <span class="recommended-badge">Recommended</span>
          </div>
          
          <div class="card-features">
            <div class="feature">✓ Fill out in your browser</div>
            <div class="feature">✓ Print to PDF when complete</div>
            <div class="feature">✓ Save as HTML for later</div>
            <div class="feature">✓ All six domains included</div>
            <div class="feature">✓ Auto-calculating analysis</div>
          </div>
          
          <button 
            class="download-button primary"
            on:click={handleScorecardOpen}
          >
            <span class="button-icon">🔗</span>
            Open Interactive Template
          </button>
          
          <p class="card-note">Opens in new tab. Fill out online, then Print → Save as PDF.</p>
        </div>

        <!-- What It Does -->
        <div class="download-card">
          <div class="card-header">
            <div class="card-icon">🎯</div>
            <h3 class="card-title">What It Does</h3>
          </div>
          
          <div class="card-features">
            <div class="feature-text">
              <p><strong>Before launch:</strong> Evaluate proposed campaigns across six domains to identify integration failures</p>
              <p><strong>During work:</strong> Diagnose why existing interventions aren't landing</p>
              <p><strong>Strategic planning:</strong> Assess your organization's overall integration capacity</p>
              <p style="margin-top: 15px;"><strong>Prevents common failures:</strong></p>
              <ul style="margin: 5px 0; padding-left: 20px; font-size: 0.9rem;">
                <li>Activist performance (passion without logistics)</li>
                <li>Single-issue hammers (ignoring systemic connections)</li>
                <li>Hero organizer dependence</li>
                <li>Extractive solidarity (demanding sacrifice)</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px 0; color: #64748b; font-size: 0.95rem;">
            <p><strong>From "Radical Competence" Appendix D</strong></p>
            <p style="margin-top: 5px;">The difference between effective organizing and activist theater</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/if}

  <!-- What's Included Section -->
  {#if activeTab === 'rigged-board'}
  <section class="whats-included">
    <div class="container">
      <h2 class="section-title">What's Included</h2>
      <p class="section-subtitle">8 comprehensive worksheets for strategic mapping</p>
      
      <div class="worksheets-grid">
        <div class="worksheet-card">
          <div class="worksheet-number">1</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Power Holders</h3>
            <p class="worksheet-description">
              Map official councillors and informal brokers. Red/green flags for quick triage. 
              Companies House PSC register tips included.
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">2</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Money Flows</h3>
            <p class="worksheet-description">
              Council budget breakdown, major developments, funding sources. 
              Shows where money flows and who controls it.
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">3</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Extraction Mapping</h3>
            <p class="worksheet-description">
              Housing Quick Math and Extraction Index calculators. Quantify where 
              value leaves your city (housing, retail, employment, etc.).
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">4</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Crisis Points</h3>
            <p class="worksheet-description">
              Severity scorecard with auto-calculating totals. Objectively rank crises 
              to find your entry point.
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">5</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Allies</h3>
            <p class="worksheet-description">
              Map existing organizers (your Ring 2). Competition vs. allies test 
              included. Find your partners.
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">6</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Leverage Points</h3>
            <p class="worksheet-description">
              Ranked analysis of where small input creates big change. 
              Effort vs. impact scoring.
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">7</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Synthesis</h3>
            <p class="worksheet-description">
              One-page battle map. Distills everything into actionable intelligence 
              for Monday morning.
            </p>
          </div>
        </div>

        <div class="worksheet-card highlight">
          <div class="worksheet-number">📋</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Instructions</h3>
            <p class="worksheet-description">
              Week 0 Protocol, critical rules, data sources, and 3-hour time limit. 
              Prevents analysis paralysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How to Use Section -->
  <section class="how-to-use">
    <div class="container">
      <h2 class="section-title">Week 0 Protocol</h2>
      <p class="section-subtitle">Complete over one weekend, use Monday morning</p>
      
      <div class="protocol-timeline">
        <div class="timeline-item">
          <div class="timeline-marker">
            <span class="marker-icon">🗓️</span>
            <span class="marker-label">Saturday AM</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">Power & Money (1 hour)</h3>
            <p class="timeline-description">
              Complete worksheets 1-2: Power Holders and Money Flows. 
              Use council website, local news archives.
            </p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">
            <span class="marker-icon">🗓️</span>
            <span class="marker-label">Saturday PM</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">Extraction & Crisis (1 hour)</h3>
            <p class="timeline-description">
              Complete worksheets 3-4: Extraction Mapping and Crisis Points. 
              Use Housing Quick Math calculator.
            </p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">
            <span class="marker-icon">🗓️</span>
            <span class="marker-label">Sunday AM</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">Allies & Leverage (30 min)</h3>
            <p class="timeline-description">
              Complete worksheets 5-6: Allies and Leverage Points. 
              Search for existing community groups.
            </p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">
            <span class="marker-icon">🗓️</span>
            <span class="marker-label">Sunday PM</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">Synthesis (30 min)</h3>
            <p class="timeline-description">
              Complete worksheet 7: One-page summary. Email yourself: 
              "Battle Map - [Your City] - [Date]"
            </p>
          </div>
        </div>

        <div class="timeline-item final">
          <div class="timeline-marker">
            <span class="marker-icon">✅</span>
            <span class="marker-label">Monday AM</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">Execute Week 1 Protocol</h3>
            <p class="timeline-description">
              Email the councillor. Schedule the coffee. Start organizing. 
              No delay.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/if}

  <!-- Critical Rules Section -->
  {#if activeTab === 'rigged-board'}
  <section class="critical-rules">
    <div class="container">
      <h2 class="section-title">⚠️ Critical Rules</h2>
      
      <div class="rules-grid">
        <div class="rule-card">
          <div class="rule-icon">⏱️</div>
          <h3 class="rule-title">3 Hours Maximum</h3>
          <p class="rule-description">
            Strategic orientation, not a PhD. If you spend more than 3 hours, 
            you're avoiding action. Close the spreadsheet and send the first email.
          </p>
        </div>

        <div class="rule-card">
          <div class="rule-icon">📊</div>
          <h3 class="rule-title">Approximate Data</h3>
          <p class="rule-description">
            Better rough numbers now than perfect data never. Use the Housing Quick Math. 
            Direction matters more than precision.
          </p>
        </div>

        <div class="rule-card">
          <div class="rule-icon">🎯</div>
          <h3 class="rule-title">Action Over Analysis</h3>
          <p class="rule-description">
            This is orientation, not comprehensive research. Map enough to know 
            who to email Monday. Done is better than perfect.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Examples Section -->
  <section class="examples-section">
    <div class="container">
      <h2 class="section-title">Example: Reading, UK</h2>
      <p class="section-subtitle">What a completed diagnostic looks like</p>
      
      <div class="example-box">
        <div class="example-field">
          <span class="field-label">Key Councillor:</span>
          <span class="field-value">Cllr Rachel Eden (Cabinet Member for Housing)</span>
        </div>
        
        <div class="example-field">
          <span class="field-label">Council Budget:</span>
          <span class="field-value">£181M annually (Housing: £47M)</span>
        </div>
        
        <div class="example-field">
          <span class="field-label">Annual Extraction:</span>
          <span class="field-value">£180M/year (Housing £140M, Retail £25M, Employment £15M)</span>
        </div>
        
        <div class="example-field">
          <span class="field-label">Extraction Index:</span>
          <span class="field-value">0.60 (60% of take-home pay to landlords)</span>
        </div>
        
        <div class="example-field">
          <span class="field-label">Crisis Point:</span>
          <span class="field-value">14,000 on housing waiting list, average wait 7 years</span>
        </div>
        
        <div class="example-field">
          <span class="field-label">Intervention:</span>
          <span class="field-value">Community Land Trust (CLT) - permanently affordable housing</span>
        </div>
        
        <div class="example-field">
          <span class="field-label">Allies:</span>
          <span class="field-value">Reading Refugee Support, University Students' Union, Friends of the Earth</span>
        </div>
        
        <div class="example-field">
          <span class="field-label">First Move:</span>
          <span class="field-value">Email Cllr Eden about CLT pilot on Whitley council site. Reference Preston model.</span>
        </div>
      </div>
    </div>
  </section>
  {/if}

  <!-- Integration Scorecard: What's Included -->
  {#if activeTab === 'scorecard'}
  <section class="whats-included">
    <div class="container">
      <h2 class="section-title">Six Domains of Integration</h2>
      <p class="section-subtitle">Comprehensive assessment framework for organizing work</p>
      
      <div class="worksheets-grid">
        <div class="worksheet-card">
          <div class="worksheet-number">🧬</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Biological</h3>
            <p class="worksheet-description">
              Does this support physical health, safety, and material security? Or demand 
              heroic effort from people struggling with survival?
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">🧠</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Cognitive</h3>
            <p class="worksheet-description">
              Does this build strategic thinking capacity? Or create cognitive overload 
              with jargon and information bombardment?
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">❤️</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Emotional</h3>
            <p class="worksheet-description">
              Does this support emotional health and resilience? Or exploit emotional labor 
              and use guilt as motivation?
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">🎯</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Behavioral</h3>
            <p class="worksheet-description">
              Does this align actions with values and build lasting skills? Or create 
              unsustainable patterns and values-behavior gaps?
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">🤝</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Social</h3>
            <p class="worksheet-description">
              Does this strengthen community bonds and collective power? Or fragment people 
              and treat them as fungible activists?
            </p>
          </div>
        </div>

        <div class="worksheet-card">
          <div class="worksheet-number">⭐</div>
          <div class="worksheet-content">
            <h3 class="worksheet-title">Spiritual/Existential</h3>
            <p class="worksheet-description">
              Does this connect to deeper meaning and purpose? Or feel meaningless despite 
              being "important"?
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How to Use Section - Scorecard -->
  <section class="how-to-use">
    <div class="container">
      <h2 class="section-title">How to Use the Scorecard</h2>
      <p class="section-subtitle">Three strategic applications for organizing work</p>
      
      <div class="protocol-timeline">
        <div class="timeline-item">
          <div class="timeline-marker">
            <span class="marker-icon">🔍</span>
            <span class="marker-label">Use Case 1</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">Before Launch: Evaluate New Interventions</h3>
            <p class="timeline-description">
              Score your proposed campaign across all six domains. Average below 3.5? 
              Redesign before wasting energy on a campaign that will collapse.
            </p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">
            <span class="marker-icon">🩺</span>
            <span class="marker-label">Use Case 2</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">During Work: Diagnose What's Not Landing</h3>
            <p class="timeline-description">
              Campaign feels off but can't pinpoint why? Score it. You'll find the domains 
              where you're succeeding at cost of others (e.g., high spiritual, low biological).
            </p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-marker">
            <span class="marker-icon">📊</span>
            <span class="marker-label">Use Case 3</span>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">Strategic Planning: Assess Overall Capacity</h3>
            <p class="timeline-description">
              Score your organization's entire body of work. Find patterns in what domains 
              you consistently neglect. That's your strategic blind spot.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Critical Rules Section - Scorecard -->
  <section class="critical-rules">
    <div class="container">
      <h2 class="section-title">⚠️ Common Integration Failures</h2>
      
      <div class="rules-grid">
        <div class="rule-card">
          <div class="rule-icon">🎭</div>
          <h3 class="rule-title">Activist Performance</h3>
          <p class="rule-description">
            High spiritual/social, low biological/cognitive. All passion, no logistics. 
            Collapses when enthusiasm meets material reality.
          </p>
        </div>

        <div class="rule-card">
          <div class="rule-icon">📄</div>
          <h3 class="rule-title">Think Tank Syndrome</h3>
          <p class="rule-description">
            High cognitive, low behavioral/social. Brilliant analysis nobody reads. 
            Smart papers gathering dust while problems persist.
          </p>
        </div>

        <div class="rule-card">
          <div class="rule-icon">🔨</div>
          <h3 class="rule-title">Single-Issue Hammer</h3>
          <p class="rule-description">
            One domain scored 5, others scored 1-2. Treats complex systemic problems 
            as if they're simple single-variable issues.
          </p>
        </div>

        <div class="rule-card">
          <div class="rule-icon">🦸</div>
          <h3 class="rule-title">Hero Organizer</h3>
          <p class="rule-description">
            High across all domains but only when one person holds it together. 
            Collapses immediately when they burn out or leave.
          </p>
        </div>

        <div class="rule-card">
          <div class="rule-icon">💔</div>
          <h3 class="rule-title">Extractive Solidarity</h3>
          <p class="rule-description">
            High spiritual/social, low biological/emotional. Demands sacrifice "for the cause" 
            from people who can't afford to sacrifice more.
          </p>
        </div>

        <div class="rule-card">
          <div class="rule-icon">🔥</div>
          <h3 class="rule-title">Burnout Factory</h3>
          <p class="rule-description">
            Chronic imbalance where short-term wins come at cost of long-term sustainability. 
            People keep leaving but leadership doesn't ask why.
          </p>
        </div>
      </div>
    </div>
  </section>
  {/if}

  <!-- Related Resources Section -->
  <section class="related-resources">
    <div class="container">
      <h2 class="section-title">Related Resources</h2>
      
      <div class="resources-grid">
        <a href="{base}/resources/books" class="resource-card">
          <div class="resource-icon">📖</div>
          <h3 class="resource-title">Radical Competence</h3>
          <p class="resource-description">
            The complete book. This diagnostic is Appendix A.
          </p>
        </a>

        <a href="{base}/resources/tools" class="resource-card">
          <div class="resource-icon">🛠️</div>
          <h3 class="resource-title">More Tools</h3>
          <p class="resource-description">
            Other strategic tools for organizing and systems change.
          </p>
        </a>

        <a href="{base}/about" class="resource-card">
          <div class="resource-icon">ℹ️</div>
          <h3 class="resource-title">About GGF</h3>
          <p class="resource-description">
            Learn more about Global Governance Frameworks.
          </p>
        </a>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="container">
      <div class="cta-box">
        <h2 class="cta-title">Ready to Map Your City?</h2>
        <p class="cta-description">
          Get the diagnostic, complete it this weekend, start organizing Monday.
        </p>
        <div class="cta-buttons">
          <button 
            class="cta-button primary"
            on:click={handleGoogleSheetsCopy}
          >
            Get Google Sheets Version
          </button>
          <button 
            class="cta-button secondary"
            on:click={handleExcelDownload}
          >
            Download Excel File
          </button>
        </div>
      </div>
    </div>
  </section>

</div>

<style>
  /* Base Styles */
  .tool-page {
    min-height: 100vh;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .tool-page.visible {
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

  /* Tool Tabs Section */
  .tool-tabs {
    padding: 0;
    background: white;
    border-bottom: 2px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .tabs-container {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    gap: 0;
  }

  .tab-button {
    flex: 1;
    padding: 1.5rem 2rem;
    background: #f8fafc;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .tab-button:hover {
    background: #f1f5f9;
  }

  .tab-button.active {
    background: white;
    border-bottom-color: #7c3aed;
  }

  .tab-icon {
    font-size: 2rem;
  }

  .tab-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
  }

  .tab-subtitle {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 400;
  }

  .tab-button.active .tab-title {
    color: #7c3aed;
  }

  /* Hero Section */
  .tool-hero {
    padding: 3rem 0 4rem 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #7c3aed 100%);
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
    font-size: 3rem;
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
    margin: 0 auto 2rem auto;
    opacity: 0.9;
  }

  .hero-badges {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .badge {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  /* Download Section */
  .download-section {
    padding: 4rem 0;
    background: white;
  }

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

  .download-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .download-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    transition: all 0.3s ease;
  }

  .download-card:hover {
    border-color: #7c3aed;
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.15);
    transform: translateY(-4px);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    position: relative;
  }

  .card-icon {
    font-size: 2.5rem;
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    flex: 1;
  }

  .recommended-badge {
    position: absolute;
    top: -1rem;
    right: 0;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .card-features {
    margin-bottom: 1.5rem;
  }

  .feature {
    padding: 0.5rem 0;
    color: #475569;
    font-size: 0.95rem;
  }

  .feature-text {
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .feature-text p {
    margin: 0.75rem 0;
  }

  .feature-text strong {
    color: #1e293b;
    font-weight: 700;
  }

  .feature-text ul {
    margin: 0.5rem 0;
  }

  .feature-text li {
    margin: 0.25rem 0;
  }

  .download-button {
    width: 100%;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    font-weight: 700;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .download-button.primary {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
  }

  .download-button.primary:hover {
    background: linear-gradient(135deg, #6d28d9, #5b21b6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  .download-button.secondary {
    background: white;
    color: #7c3aed;
    border: 2px solid #7c3aed;
  }

  .download-button.secondary:hover {
    background: #7c3aed;
    color: white;
    transform: translateY(-2px);
  }

  .button-icon {
    font-size: 1.2rem;
  }

  .card-note {
    margin-top: 1rem;
    font-size: 0.85rem;
    color: #64748b;
    text-align: center;
  }

  /* What's Included Section */
  .whats-included {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .worksheets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .worksheet-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
  }

  .worksheet-card:hover {
    border-color: #7c3aed;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .worksheet-card.highlight {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-color: #fbbf24;
  }

  .worksheet-number {
    font-size: 2rem;
    font-weight: 800;
    color: #7c3aed;
    min-width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
    border-radius: 0.5rem;
  }

  .worksheet-card.highlight .worksheet-number {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #92400e;
  }

  .worksheet-content {
    flex: 1;
  }

  .worksheet-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .worksheet-description {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.5;
  }

  /* How to Use Section */
  .how-to-use {
    padding: 4rem 0;
    background: white;
  }

  .protocol-timeline {
    max-width: 800px;
    margin: 0 auto;
  }

  .timeline-item {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    position: relative;
  }

  .timeline-item::before {
    content: '';
    position: absolute;
    left: 2rem;
    top: 4rem;
    bottom: -2rem;
    width: 2px;
    background: linear-gradient(180deg, #e2e8f0, transparent);
  }

  .timeline-item.final::before {
    display: none;
  }

  .timeline-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 4rem;
  }

  .marker-icon {
    font-size: 2rem;
    background: white;
    border: 3px solid #7c3aed;
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .marker-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #7c3aed;
    text-align: center;
  }

  .timeline-content {
    flex: 1;
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
  }

  .timeline-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .timeline-description {
    color: #475569;
    line-height: 1.6;
  }

  /* Critical Rules Section */
  .critical-rules {
    padding: 4rem 0;
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
  }

  .rules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .rule-card {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    border: 2px solid #fca5a5;
    text-align: center;
  }

  .rule-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .rule-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #991b1b;
    margin-bottom: 0.5rem;
  }

  .rule-description {
    color: #475569;
    line-height: 1.6;
  }

  /* Examples Section */
  .examples-section {
    padding: 4rem 0;
    background: white;
  }

  .example-box {
    max-width: 800px;
    margin: 0 auto;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 2rem;
  }

  .example-field {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .example-field:last-child {
    border-bottom: none;
  }

  .field-label {
    font-weight: 700;
    color: #475569;
    min-width: 150px;
  }

  .field-value {
    color: #1e293b;
    flex: 1;
  }

  /* Related Resources */
  .related-resources {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .resource-card {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    text-decoration: none;
    transition: all 0.3s ease;
    text-align: center;
  }

  .resource-card:hover {
    border-color: #7c3aed;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .resource-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .resource-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .resource-description {
    color: #64748b;
    font-size: 0.95rem;
  }

  /* CTA Section */
  .cta-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #1e1b4b, #7c3aed);
  }

  .cta-box {
    text-align: center;
    color: white;
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
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-button {
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-weight: 700;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cta-button.primary {
    background: white;
    color: #7c3aed;
  }

  .cta-button.primary:hover {
    background: #f3e8ff;
    transform: translateY(-2px);
  }

  .cta-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
  }

  .cta-button.secondary:hover {
    background: white;
    color: #7c3aed;
    transform: translateY(-2px);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .tab-button {
      padding: 1rem;
    }

    .tab-icon {
      font-size: 1.5rem;
    }

    .tab-title {
      font-size: 0.95rem;
    }

    .tab-subtitle {
      font-size: 0.75rem;
    }

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.2rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .download-options {
      grid-template-columns: 1fr;
    }

    .worksheets-grid {
      grid-template-columns: 1fr;
    }

    .timeline-item {
      flex-direction: column;
      gap: 1rem;
    }

    .timeline-item::before {
      display: none;
    }

    .rules-grid {
      grid-template-columns: 1fr;
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
</style>
