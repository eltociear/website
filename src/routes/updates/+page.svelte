<!-- src/routes/updates/+page.svelte -->
<script>
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import Follow from '$lib/components/Follow.svelte';
  import ShareButtons from '$lib/components/ShareButtons.svelte';
  
  export let data; // SvelteKit provides data from +page.js
  
  // Get the current language from load data
  $: currentLang = data.currentLocale || 'en';
  
  // Helper function for translations with fallbacks
  function getUpdatesTranslation(key, fallback) {
    if (browser) {
      return $t(`updates.${key}`) || fallback;
    }
    return fallback;
  }
  
  // Scroll to follow section
  function scrollToFollow() {
    const followSection = document.getElementById('follow-section');
    if (followSection) {
      followSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
</script>

<svelte:head>
  <title>{getUpdatesTranslation('title', 'Project Updates')} - Global Governance Framework</title>
  <meta name="description" content="Follow the latest updates on global governance framework development and project milestones." />
  <meta property="og:title" content="{getUpdatesTranslation('title', 'Project Updates')} - Global Governance Framework" />
  <meta property="og:description" content="Stay updated with our latest framework releases and project milestones." />
</svelte:head>

<div class="container">
  <div class="updates-header">
    <h1>{getUpdatesTranslation('title', 'Project Updates')}</h1>
    <p class="updates-subtitle">
      {getUpdatesTranslation('subtitle', 'A changelog of new framework drafts, milestones, and project news')}
    </p>
  </div>
  
  {#if data.posts.length === 0}
    <!-- No Updates State: Include full Follow component here since it's the primary action -->
    <div class="no-posts">
      <div class="no-posts-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3>
        {getUpdatesTranslation('noPosts.title', 'No updates found')}
      </h3>
      <p>
        {getUpdatesTranslation('noPosts.message', `No project updates found for the selected language (${currentLang}). Try switching to a different language using the language selector in the header.`).replace('{language}', currentLang)}
      </p>
      <p class="follow-prompt">
        {getUpdatesTranslation('noPosts.followPrompt', 'Follow us to get notified when we publish new updates!')}
      </p>
    </div>
    
    <!-- Follow component for no-posts state -->
    <Follow />
    
  {:else}
    <!-- Updates exist: Show strategic Follow placement -->
    <div class="posts-section">
      <div class="posts-count">
        {data.posts.length} {data.posts.length === 1 ? getUpdatesTranslation('postsCount.single', 'update') : getUpdatesTranslation('postsCount.plural', 'updates')} {getUpdatesTranslation('postsCount.found', 'found')}
      </div>
      
      <div class="posts-list">
        {#each data.posts as post, index}
          <article class="post-card" class:featured={index === 0}>
            <a href="{base}/blog/{post.slug}?lang={currentLang}" class="post-link">
              <div class="post-content">
                <div class="post-header">
                  <h2>{post.meta.title}</h2>
                  {#if index === 0}
                    <span class="featured-badge">
                      {getUpdatesTranslation('latestBadge', 'Latest')}
                    </span>
                  {/if}
                </div>
                
                <p class="post-meta">
                  <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {getUpdatesTranslation('meta.publishedOn', 'Published on')} {new Date(post.meta.date).toLocaleDateString(currentLang === 'sv' ? 'sv-SE' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} {getUpdatesTranslation('meta.by', 'by')} {post.meta.author}
                </p>
                
                <p class="post-description">{post.meta.description}</p>

                {#if post.meta.tags && post.meta.tags.length > 0}
                  <div class="post-tags">
                    {#each post.meta.tags as tag}
                      <span class="tag">{tag}</span>
                    {/each}
                  </div>
                {/if}
                
                <div class="read-more">
                  {getUpdatesTranslation('readMore', 'Read update →')}
                </div>
              </div>
            </a>

          </article>

          <!-- Strategic Follow placement: After first few updates (when user has seen value) -->
          {#if index === Math.min(2, data.posts.length - 1) && data.posts.length > 1}
            <div class="strategic-follow" id="follow-section">
              <div class="follow-intro">
                <h3>{getUpdatesTranslation('strategicFollow.title', 'Want to follow the progress?')}</h3>
                <p>{getUpdatesTranslation('strategicFollow.subtitle', 'Stay connected to never miss our latest framework releases.')}</p>
              </div>
              <Follow />
            </div>
          {/if}
        {/each}
      </div>
      
      <!-- If only one update, place Follow component after the single update -->
      {#if data.posts.length === 1}
        <div class="strategic-follow" id="follow-section">
          <div class="follow-intro">
            <h3>{getUpdatesTranslation('strategicFollow.title', 'Want to follow the progress?')}</h3>
            <p>{getUpdatesTranslation('strategicFollow.subtitle', 'Stay connected to never miss our latest framework releases.')}</p>
          </div>
          <Follow />
        </div>
      {/if}
    </div>
    
    <!-- Lightweight bottom prompt: Points to the main Follow section -->
    <div class="bottom-prompt">
      <div class="prompt-content">
        <span class="prompt-text">
          {getUpdatesTranslation('bottomPrompt.text', 'Want to stay updated?')}
        </span>
        <button type="button" class="prompt-link" on:click={scrollToFollow}>
          {getUpdatesTranslation('bottomPrompt.link', 'See all follow options →')}
        </button>
      </div>
    </div>
  {/if}
</div>

<ShareButtons 
  title="Global Governance Framework Project Updates"
  hashtags="GlobalGovernance,FrameworkDevelopment,SystemicChange"
  position="left"
/>

<style>
  /* Reuse the blog page styles with updates-specific tweaks */
  .container {
    max-width: 900px;
    margin: 2rem auto 4rem;
    padding: 0 20px;
  }
  
  .updates-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .updates-header h1 {
    font-size: 2.5rem;
    color: #2B4B8C;
    margin-bottom: 0.5rem;
  }
  
  .updates-subtitle {
    font-size: 1.125rem;
    color: #6B7280;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  .no-posts {
    text-align: center;
    padding: 3rem 2rem;
    background-color: #f9fafb;
    border-radius: 0.75rem;
    margin: 2rem 0;
    border: 2px dashed #d1d5db;
  }
  
  .no-posts-icon {
    width: 4rem;
    height: 4rem;
    color: #9CA3AF;
    margin: 0 auto 1rem;
  }
  
  .no-posts h3 {
    font-size: 1.5rem;
    color: #374151;
    margin-bottom: 1rem;
  }
  
  .no-posts p {
    color: #6b7280;
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .follow-prompt {
    font-weight: 500;
    color: #2B4B8C !important;
    margin-top: 1rem !important;
  }
  
  .posts-section {
    margin: 2rem 0;
  }
  
  .posts-count {
    font-size: 0.875rem;
    color: #6B7280;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 500;
  }
  
  .posts-list {
    display: grid;
    gap: 2rem;
  }
  
  .post-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    position: relative;
  }
  
  .post-card:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #DAA520;
  }
  
  .post-card.featured {
    border: 2px solid #16a34a; /* Green for updates instead of gold */
    background: linear-gradient(135deg, #fff 0%, #f0fdf4 100%);
  }
  
  .post-card.featured::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #16a34a, #22c55e, #16a34a);
  }
  
  .post-link {
    display: block;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }
  
  .post-content {
    padding: 2rem;
  }
  
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }
  
  .post-card h2 {
    font-size: 1.5rem;
    color: #2B4B8C;
    margin: 0;
    line-height: 1.3;
    flex: 1;
  }
  
  .post-card.featured h2 {
    font-size: 1.75rem;
  }
  
  .featured-badge {
    background-color: #16a34a; /* Green for latest update */
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .post-meta {
    font-size: 0.875rem;
    color: #6B7280;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .meta-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
  
  .post-description {
    color: #4B5563;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }
  
  .post-card.featured .post-description {
    font-size: 1.1rem;
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .tag {
    background: rgba(43, 75, 140, 0.1);
    color: #2B4B8C;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .read-more {
    color: #16a34a; /* Green for updates */
    font-weight: 600;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s;
  }
  
  .post-card:hover .read-more {
    gap: 0.5rem;
  }
  
  /* Strategic Follow Section */
  .strategic-follow {
    margin: 3rem 0;
    scroll-margin-top: 2rem;
  }
  
  .follow-intro {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .follow-intro h3 {
    font-size: 1.5rem;
    color: #2B4B8C;
    margin-bottom: 0.5rem;
  }
  
  .follow-intro p {
    color: #6B7280;
    font-size: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  /* Bottom Prompt */
  .bottom-prompt {
    margin-top: 3rem;
    padding: 1rem 0;
    border-top: 1px solid #e5e7eb;
  }
  
  .prompt-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .prompt-text {
    color: #6B7280;
    font-size: 0.875rem;
  }
  
  .prompt-link {
    background: none;
    border: none;
    color: #2B4B8C;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s;
  }
  
  .prompt-link:hover {
    color: #16a34a;
  }
    
  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      margin: 1rem auto 2rem;
      padding: 0 1rem;
    }
    
    .updates-header h1 {
      font-size: 2rem;
    }
    
    .updates-subtitle {
      font-size: 1rem;
    }
    
    .post-content {
      padding: 1.5rem;
    }
    
    .post-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .post-card h2 {
      font-size: 1.25rem;
    }
    
    .post-card.featured h2 {
      font-size: 1.5rem;
    }
    
    .featured-badge {
      align-self: flex-start;
    }
    
    .no-posts {
      padding: 2rem 1rem;
    }
    
    .strategic-follow {
      margin: 2rem 0;
    }
    
    .prompt-content {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .updates-header h1 {
      font-size: 1.75rem;
    }
    
    .post-content {
      padding: 1rem;
    }
  }
</style>
