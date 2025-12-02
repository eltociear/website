<!-- src/routes/tools/radical-competence/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';

  let isVisible = false;
  let downloadMethod = 'google'; // 'google' or 'excel'
  let copyStatus = '';
  
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  // Google Sheets template URL (you'll replace this after publishing the template)
  const googleSheetsTemplateUrl = 'https://docs.google.com/spreadsheets/d/1DLkHOec7g7ySYZ3wTpZmLlzwKnDoPyklPJcfeh2H7Sw/copy';
  
  // Excel download path
  const excelDownloadUrl = `${base}/tools/radical-competence/rigged-board-diagnostic.xlsx`;

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
  <title>Rigged Board Diagnostic - Radical Competence Tools</title>
  <meta name="description" content="Strategic power mapping tool for organizing. Map decision-makers, money flows, extraction patterns, and leverage points in your city." />
  <meta property="og:title" content="Rigged Board Diagnostic - Radical Competence Tools" />
  <meta property="og:description" content="Strategic power mapping tool for organizing. Map decision-makers, money flows, extraction patterns, and leverage points in your city." />
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
      
      <h1 class="hero-title">The Rigged Board Diagnostic</h1>
      <p class="hero-subtitle">Strategic Power Mapping for Community Organizers</p>
      <p class="hero-description">
        A comprehensive worksheet for mapping power structures, money flows, extraction patterns, 
        and leverage points in your city. Complete in one weekend, use Monday morning.
      </p>
      
      <div class="hero-badges">
        <span class="badge">📋 8 Worksheets</span>
        <span class="badge">⏱️ 3 Hours</span>
        <span class="badge">🎯 Week 0 Protocol</span>
        <span class="badge">✅ Action-Ready</span>
      </div>
    </div>
  </section>

  <!-- Download Section -->
  <section class="download-section">
    <div class="container">
      <h2 class="section-title">Get Your Copy</h2>
      <p class="section-subtitle">Choose your preferred format</p>
      
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

  <!-- What's Included Section -->
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

  <!-- Critical Rules Section -->
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
