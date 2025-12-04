<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  
  // Data comes from +page.js
  export let data;

  // Simple fade-in animation on mount
  let isVisible = false;
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });
</script>

<svelte:head>
  <title>Visual Assets | The Omega Proof</title>
  <meta name="description" content="Key architectural diagrams and data visualizations from The Omega Proof white paper." />
</svelte:head>

<section class="visuals-hero">
  <div class="container">
    <div class="hero-content" class:visible={isVisible}>
      <div class="breadcrumbs">
        <a href="{base}/resources/whitepapers/omega-proof" class="back-link">
          ← Back to White Paper
        </a>
      </div>
      <h1 class="hero-title">Visual Intelligence</h1>
      <p class="hero-subtitle">
        Architectural diagrams and data visualizations from the Omega Proof simulation.
      </p>
    </div>
  </div>
</section>

<section class="visuals-stream">
  <div class="container">
    
    <div class="visuals-grid">
      {#each data.visuals as visual, i}
        <article class="visual-card" id={visual.id} style="animation-delay: {i * 100}ms" class:visible={isVisible}>
          
          <div class="image-wrapper">
            <div class="image-container">
              <img 
                src="{base}/images/omega-proof/{visual.file}" 
                alt={visual.title}
                class="visual-img"
              />
            </div>
            <div class="image-actions">
              <a href="{base}/images/omega-proof/{visual.file}" download class="download-btn">
                <span class="icon">⬇️</span> Download SVG
              </a>
              <a href="{base}/images/omega-proof/{visual.file}" target="_blank" class="expand-btn">
                <span class="icon">🔍</span> Full Screen
              </a>
            </div>
          </div>

          <div class="content-wrapper">
            <div class="header-row">
              <span class="visual-number">Fig {i + 1}</span>
              <h2 class="visual-title">{visual.title}</h2>
            </div>
            
            <p class="visual-description">{visual.description}</p>
            
            <div class="insights-box">
              <h3 class="insights-label">Key Insights</h3>
              <ul class="insights-list">
                {#each visual.insights as insight}
                  <li class="insight-item">
                    <span class="bullet">•</span>
                    <span class="text">{insight}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <div class="source-row">
              <span class="source-label">Source Context:</span>
              <span class="source-value">{visual.dataSource}</span>
            </div>
          </div>

        </article>
      {/each}
    </div>

  </div>
</section>

<section class="nav-footer">
  <div class="container">
    <div class="nav-box">
      <h3>Ready to explore the full analysis?</h3>
      <div class="nav-buttons">
        <a href="{base}/resources/whitepapers/omega-proof" class="primary-btn">
          Read The Omega Proof
        </a>
        <a href="{base}/frameworks" class="secondary-btn">
          View the Replacement Architecture
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  /* --- Base & Layout --- */
  .container {
    max-width: 1000px; /* Slightly narrower for readability */
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* --- Hero Section (Matches Landing Page Gradient) --- */
  .visuals-hero {
    padding: 4rem 0 6rem 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%);
    color: white;
    text-align: center;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
    margin-bottom: -4rem; /* Overlap effect */
  }

  .hero-content {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .hero-content.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .breadcrumbs {
    margin-bottom: 2rem;
  }

  .back-link {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2rem;
    transition: all 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .back-link:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateX(-2px);
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: #e2e8f0;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* --- Visuals Stream --- */
  .visuals-stream {
    padding-bottom: 6rem;
    background-color: #f8fafc;
  }

  .visuals-grid {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  /* --- Visual Card --- */
  .visual-card {
    background: white;
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .visual-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Image Area */
  .image-wrapper {
    background: #0a0e14; /* Match SVG dark background */
    position: relative;
    padding: 2rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .image-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .visual-img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
  }

  .image-actions {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .image-wrapper:hover .image-actions {
    opacity: 1;
  }

  .download-btn, .expand-btn {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.2s;
  }

  .download-btn:hover, .expand-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  /* Content Area */
  .content-wrapper {
    padding: 2.5rem;
  }

  .header-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .visual-number {
    background: #eff6ff;
    color: #1e40af;
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .visual-title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;
  }

  .visual-description {
    font-size: 1.15rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .insights-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .insights-label {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin: 0 0 1rem 0;
    font-weight: 600;
  }

  .insights-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .insight-item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .bullet {
    color: #DAA520; /* Gold */
    font-size: 1.2rem;
    line-height: 1;
  }

  .text {
    font-size: 1rem;
    color: #334155;
    line-height: 1.5;
  }

  .source-row {
    display: flex;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #94a3b8;
    padding-top: 1.5rem;
    border-top: 1px solid #f1f5f9;
  }

  .source-label {
    font-weight: 600;
  }

  .source-value {
    font-style: italic;
  }

  /* --- Navigation Footer --- */
  .nav-footer {
    padding: 4rem 0;
    background: white;
    border-top: 1px solid #e2e8f0;
  }

  .nav-box {
    text-align: center;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 3rem;
    border-radius: 1.5rem;
    border: 1px solid #e2e8f0;
  }

  .nav-box h3 {
    font-size: 1.5rem;
    color: #1e293b;
    margin-bottom: 2rem;
  }

  .nav-buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .primary-btn {
    background: linear-gradient(135deg, #2B4B8C 0%, #312e81 100%);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(43, 75, 140, 0.3);
    transition: all 0.2s;
  }

  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(43, 75, 140, 0.4);
  }

  .secondary-btn {
    background: white;
    color: #2B4B8C;
    border: 2px solid #2B4B8C;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }

  .secondary-btn:hover {
    background: #f0f9ff;
    transform: translateY(-2px);
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.25rem;
    }
    
    .content-wrapper {
      padding: 1.5rem;
    }

    .image-wrapper {
      padding: 1rem;
    }

    .header-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .image-actions {
      opacity: 1; /* Always show on mobile */
      position: static;
      margin-top: 1rem;
      justify-content: center;
    }
  }
</style>
