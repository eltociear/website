<script>
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Developmental Debt Audit Tool - Global Governance Frameworks</title>
  <meta name="description" content="A forensic accounting tool to calculate the hidden liabilities of Tier 1 thinking in your organization." />
</svelte:head>

<div class="tool-page-container">
  <div class="content-wrapper">
    <div class="header">
      <div class="icon">🧾</div>
      <h1>Developmental Debt Audit</h1>
      <p class="subtitle">A forensic tool for the "Great Restructuring"</p>
    </div>

    <div class="main-card">
      <div class="grid-layout">
        <div class="info-section">
          <h2>Why Audit Your Debt?</h2>
          <p>
            Just as software projects accumulate "Technical Debt" when they prioritize speed over stability, 
            civilizations and organizations accumulate <strong>Developmental Debt</strong> when they use 
            outdated operating systems to manage complex realities.
          </p>
          <p>
            This Excel-based tool helps you move from vague anxiety to concrete accounting. 
            It guides you to calculate three specific liabilities hidden on your balance sheet:
          </p>
          <ul class="benefit-list">
            <li><strong>The Avoidance Cost:</strong> What you spend to ignore reality (Lobbying, turnover, delays).</li>
            <li><strong>The Cleanup Cost:</strong> The projected cost of fixing the mess later (Fines, restructuring).</li>
            <li><strong>The Opportunity Cost:</strong> The value lost by not adapting sooner.</li>
          </ul>
        </div>

        <div class="download-section">
          <div class="file-preview">
            <div class="file-icon">XLSX</div>
            <div class="file-details">
              <span class="filename">Developmental_Debt_Audit_Tool.xlsx</span>
              <span class="filesize">~15 KB • Excel Template</span>
            </div>
          </div>
          
          <a href="{base}/assets/xlsx/Developmental_Debt_Audit_Tool.xlsx" download class="download-button">
            Download the Audit Tool
            <span class="arrow">↓</span>
          </a>
          <p class="license-note">Open Source • CC BY 4.0</p>
        </div>
      </div>
    </div>

    <div class="context-link">
      <p>Need context? <a href="{base}/essays/the-bill-is-coming-due">Read the Manifesto first →</a></p>
    </div>
  </div>
</div>

<style>
  .tool-page-container {
    min-height: 100vh;
    background: #f8fafc;
    padding: 4rem 1rem;
    display: flex;
    justify-content: center;
  }

  .content-wrapper {
    max-width: 900px;
    width: 100%;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #64748b;
    font-weight: 500;
  }

  .main-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .grid-layout {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 3rem;
  }

  h2 {
    font-size: 1.5rem;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  p {
    color: #475569;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  .benefit-list {
    list-style: none;
    padding: 0;
  }

  .benefit-list li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    color: #334155;
  }

  .benefit-list li::before {
    content: "•";
    color: #7c3aed;
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  .download-section {
    background: #f1f5f9;
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .file-preview {
    margin-bottom: 1.5rem;
  }

  .file-icon {
    font-size: 2rem;
    font-weight: 900;
    color: #10b981; /* Excel Green */
    margin-bottom: 0.5rem;
  }

  .file-details {
    display: flex;
    flex-direction: column;
    font-size: 0.875rem;
    color: #64748b;
  }

  .download-button {
    background: #1e293b;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    font-weight: 700;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .download-button:hover {
    background: #7c3aed; /* GGF Purple accent */
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }

  .license-note {
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .context-link {
    text-align: center;
    margin-top: 2rem;
  }

  .context-link a {
    color: #7c3aed;
    text-decoration: none;
    font-weight: 600;
  }

  .context-link a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .grid-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .header {
      margin-bottom: 2rem;
    }
  }
</style>
