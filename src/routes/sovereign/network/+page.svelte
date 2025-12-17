<!-- src/routes/sovereign/network/+page.svelte -->
<script>
  import { t } from '$lib/i18n';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  
  // Real showcases will be added here as they come in from Discord
  const showcaseExamples = [];
  // const showcaseExamples = [
  //  {
  //    name: 'Alex M.',
  //    location: 'Toronto, Canada',
  //    focus: 'Consulting Firm Transformation',
  //    description: 'Implemented Sunday Sync with 8-person team. Cut meeting time 60%, increased project completion 45%.',
  //    protocols: ['Sunday Sync', '24-Hour Rule'],
  //    chapter: 9,
  //    image: '💼',
  //    status: 'Active'
  //  }
  //]; 

</script>

<svelte:head>
  <title>{$t('sovereign.network.title')}</title>
  <meta name="description" content="{$t('sovereign.network.subtitle')}" />
</svelte:head>

<!-- Header -->
<section class="network-header">
  <div class="container">
    <a href="{base}/sovereign" class="back-link">← {$t('sovereign.network.backToSovereign')}</a>
    <h1 class="page-title">{$t('sovereign.network.title')}</h1>
    <p class="page-subtitle">{$t('sovereign.network.subtitle')}</p>
  </div>
</section>

<!-- Discord CTA -->
<section class="discord-section">
  <div class="container">
    <div class="discord-card">
      <div class="discord-icon">
        <svg width="80" height="80" viewBox="0 0 71 55" fill="none">
          <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
        </svg>
      </div>
      
      <div class="discord-content">
        <h2>{$t('sovereign.network.discord.title')}</h2>
        <p class="discord-description">{$t('sovereign.network.discord.description')}</p>
        
        <div class="discord-features">
          <div class="feature-item">
            <span class="feature-icon">💬</span>
            <span>{$t('sovereign.network.discord.feature1')}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <span>{$t('sovereign.network.discord.feature2')}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🤝</span>
            <span>{$t('sovereign.network.discord.feature3')}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📚</span>
            <span>{$t('sovereign.network.discord.feature4')}</span>
          </div>
        </div>
        
        <a href="https://discord.gg/MjnzCfh4mM" target="_blank" rel="noopener noreferrer" class="discord-join-btn">
          {$t('sovereign.network.discord.joinButton')}
        </a>
        
        <p class="discord-note">{$t('sovereign.network.discord.note')}</p>
      </div>
    </div>
  </div>
</section>

<!-- What Happens in Discord -->
<section class="discord-details-section">
  <div class="container">
    <h2 class="section-title">{$t('sovereign.network.inside.title')}</h2>
    
    <div class="channels-grid">
      <div class="channel-card">
        <div class="channel-icon">💭</div>
        <h3>{$t('sovereign.network.inside.introductions.title')}</h3>
        <p>{$t('sovereign.network.inside.introductions.description')}</p>
      </div>
      
      <div class="channel-card">
        <div class="channel-icon">📋</div>
        <h3>{$t('sovereign.network.inside.protocols.title')}</h3>
        <p>{$t('sovereign.network.inside.protocols.description')}</p>
      </div>
      
      <div class="channel-card">
        <div class="channel-icon">🚧</div>
        <h3>{$t('sovereign.network.inside.problems.title')}</h3>
        <p>{$t('sovereign.network.inside.problems.description')}</p>
      </div>
      
      <div class="channel-card">
        <div class="channel-icon">🏆</div>
        <h3>{$t('sovereign.network.inside.wins.title')}</h3>
        <p>{$t('sovereign.network.inside.wins.description')}</p>
      </div>
      
      <div class="channel-card">
        <div class="channel-icon">🤔</div>
        <h3>{$t('sovereign.network.inside.questions.title')}</h3>
        <p>{$t('sovereign.network.inside.questions.description')}</p>
      </div>
      
      <div class="channel-card">
        <div class="channel-icon">🌐</div>
        <h3>{$t('sovereign.network.inside.gff.title')}</h3>
        <p>{$t('sovereign.network.inside.gff.description')}</p>
      </div>
    </div>
  </div>
</section>

<!-- Showcase -->
<section class="showcase-section">
  <div class="container">
    <h2 class="section-title">{$t('sovereign.network.showcase.title')}</h2>
    <p class="section-intro">{$t('sovereign.network.showcase.intro')}</p>
    
    {#if showcaseExamples.length === 0}
      <div class="empty-showcase">
        <div class="empty-icon">🏗️</div>
        <h3>{$t('sovereign.network.showcase.empty.title')}</h3>
        <p>{$t('sovereign.network.showcase.empty.description')}</p>
      </div>
    {:else}
      <div class="showcase-grid">
        {#each showcaseExamples as example}
          <div class="showcase-card">
            <div class="showcase-header">
              <div class="showcase-image">{example.image}</div>
              <div class="showcase-meta">
                <h3 class="showcase-name">{example.name}</h3>
                <p class="showcase-location">📍 {example.location}</p>
                <span class="showcase-status">{example.status}</span>
              </div>
            </div>
            
            <div class="showcase-content">
              <h4 class="showcase-focus">{example.focus}</h4>
              <p class="showcase-description">{example.description}</p>
              
              <div class="showcase-protocols">
                <strong>{$t('sovereign.network.showcase.protocolsUsed')}:</strong>
                <div class="protocol-tags">
                  {#each example.protocols as protocol}
                    <span class="protocol-tag">{protocol}</span>
                  {/each}
                </div>
              </div>
              
              <div class="showcase-footer">
                <span class="chapter-badge">{$t('sovereign.network.showcase.chapter')} {example.chapter}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    
    <div class="showcase-cta">
      <h3>{$t('sovereign.network.showcase.yourTurn.title')}</h3>
      <p>{$t('sovereign.network.showcase.yourTurn.description')}</p>
      <a href="https://discord.gg/MjnzCfh4mM" target="_blank" rel="noopener noreferrer" class="showcase-submit-btn">
        {$t('sovereign.network.showcase.yourTurn.button')}
      </a>
    </div>
  </div>
</section>

<!-- Community Principles -->
<section class="principles-section">
  <div class="container">
    <h2 class="section-title">{$t('sovereign.network.principles.title')}</h2>
    
    <div class="principles-grid">
      <div class="principle-card">
        <div class="principle-icon">🎯</div>
        <h3>{$t('sovereign.network.principles.operators.title')}</h3>
        <p>{$t('sovereign.network.principles.operators.description')}</p>
      </div>
      
      <div class="principle-card">
        <div class="principle-icon">🤝</div>
        <h3>{$t('sovereign.network.principles.mutual.title')}</h3>
        <p>{$t('sovereign.network.principles.mutual.description')}</p>
      </div>
      
      <div class="principle-card">
        <div class="principle-icon">📊</div>
        <h3>{$t('sovereign.network.principles.results.title')}</h3>
        <p>{$t('sovereign.network.principles.results.description')}</p>
      </div>
      
      <div class="principle-card">
        <div class="principle-icon">🌉</div>
        <h3>{$t('sovereign.network.principles.bridge.title')}</h3>
        <p>{$t('sovereign.network.principles.bridge.description')}</p>
      </div>
    </div>
  </div>
</section>

<style>
  /* Header */
  .network-header {
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
    max-width: 800px;
  }

  /* Discord Section */
  .discord-section {
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%);
  }

  .discord-card {
    background: white;
    border-radius: 1.5rem;
    padding: 3rem;
    max-width: 900px;
    margin: 0 auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  .discord-icon {
    text-align: center;
    margin-bottom: 2rem;
  }

  .discord-content h2 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 1rem;
  }

  .discord-description {
    font-size: 1.25rem;
    color: #555;
    text-align: center;
    margin-bottom: 2rem;
    line-height: 1.7;
  }

  .discord-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 0.5rem;
  }

  .feature-icon {
    font-size: 1.5rem;
  }

  .feature-item span:last-child {
    font-weight: 500;
    color: #333;
  }

  .discord-join-btn {
    display: block;
    background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%);
    color: white;
    padding: 1.25rem 2rem;
    border-radius: 0.75rem;
    text-align: center;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.25rem;
    margin: 2rem auto;
    max-width: 400px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .discord-join-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(88, 101, 242, 0.4);
  }

  .discord-note {
    text-align: center;
    color: #666;
    font-size: 0.95rem;
    font-style: italic;
    margin-top: 1rem;
  }

  /* Discord Details */
  .discord-details-section {
    padding: 4rem 2rem;
    background-color: #f8f9fa;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 3rem;
  }

  .channels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .channel-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .channel-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  .channel-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .channel-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.75rem;
  }

  .channel-card p {
    color: #555;
    line-height: 1.6;
  }

  /* Showcase Section */
  .showcase-section {
    padding: 4rem 2rem;
    background-color: white;
  }

  .section-intro {
    font-size: 1.125rem;
    color: #555;
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem;
    line-height: 1.7;
  }

  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .empty-showcase {
    background: white;
    border: 3px dashed #e0e0e0;
    border-radius: 1rem;
    padding: 4rem 2rem;
    text-align: center;
    max-width: 600px;
    margin: 0 auto 3rem;
  }

  .empty-icon {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }

  .empty-showcase h3 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1rem;
  }

  .empty-showcase p {
    font-size: 1.125rem;
    color: #666;
    line-height: 1.7;
  }

  .showcase-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 1rem;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .showcase-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }

  .showcase-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }

  .showcase-image {
    font-size: 4rem;
    flex-shrink: 0;
  }

  .showcase-meta {
    flex: 1;
  }

  .showcase-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.25rem;
  }

  .showcase-location {
    color: #666;
    margin-bottom: 0.5rem;
  }

  .showcase-status {
    display: inline-block;
    background-color: #2D5F2D;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .showcase-content {
    padding: 2rem;
  }

  .showcase-focus {
    font-size: 1.25rem;
    font-weight: 700;
    color: #DAA520;
    margin-bottom: 1rem;
  }

  .showcase-description {
    color: #555;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  .showcase-protocols {
    margin-bottom: 1rem;
  }

  .showcase-protocols strong {
    display: block;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .protocol-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .protocol-tag {
    background-color: #f0f0f0;
    color: #555;
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .showcase-footer {
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  .chapter-badge {
    background-color: #DAA520;
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .showcase-cta {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: white;
    padding: 3rem;
    border-radius: 1rem;
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }

  .showcase-cta h3 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .showcase-cta p {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    line-height: 1.7;
  }

  .showcase-submit-btn {
    display: inline-block;
    background-color: white;
    color: #DAA520;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.125rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .showcase-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  /* Principles Section */
  .principles-section {
    padding: 4rem 2rem;
    background-color: #f8f9fa;
  }

  .principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .principle-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .principle-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .principle-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.75rem;
  }

  .principle-card p {
    color: #555;
    line-height: 1.6;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .discord-card {
      padding: 2rem;
    }

    .discord-content h2 {
      font-size: 2rem;
    }

    .discord-features {
      grid-template-columns: 1fr;
    }

    .channels-grid {
      grid-template-columns: 1fr;
    }

    .showcase-grid {
      grid-template-columns: 1fr;
    }

    .principles-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .section-title {
      font-size: 2rem;
    }

    .showcase-header {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
