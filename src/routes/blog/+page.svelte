<!-- src/routes/blog/+page.svelte -->
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
  function getBlogTranslation(key, fallback) {
    if (browser) {
      return $t(`blog.${key}`) || fallback;
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
  <title>{getBlogTranslation('title', 'Blog')} - Global Governance Framework</title>
  <meta name="description" content="Read the latest news and insights on global governance and the Treaty for Our Only Home. Follow us for updates." />
  <meta property="og:title" content="{getBlogTranslation('title', 'Blog')} - Global Governance Framework" />
  <meta property="og:description" content="Stay updated with our latest insights on global governance." />
</svelte:head>

<div class="container">
  <div class="blog-header">
    <h1>{getBlogTranslation('title', 'Blog Posts')}</h1>
    <p class="blog-subtitle">
      {getBlogTranslation('subtitle', 'Latest news and insights on global governance and the Treaty for Our Only Home')}
    </p>
  </div>
  
  {#if data.posts.length === 0}
    <!-- No Posts State: Include full Follow component here since it's the primary action -->
    <div class="no-posts">
      <div class="no-posts-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <h3>
        {getBlogTranslation('noPosts.title', 'No blog posts found')}
      </h3>
      <p>
        {getBlogTranslation('noPosts.message', `No blog posts found for the selected language (${currentLang}). Try switching to a different language using the language selector in the header.`).replace('{language}', currentLang)}
      </p>
      <p class="follow-prompt">
        {getBlogTranslation('noPosts.followPrompt', 'Follow us to get notified when we publish new posts!')}
      </p>
    </div>
    
    <!-- Follow component for no-posts state -->
    <Follow />
    
  {:else}
    <!-- Posts exist: Show strategic Follow placement -->
    <div class="posts-section">
      <div class="posts-count">
        {data.posts.length} {data.posts.length === 1 ? getBlogTranslation('postsCount.single', 'post') : getBlogTranslation('postsCount.plural', 'posts')} {getBlogTranslation('postsCount.found', 'found')}
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
                      {getBlogTranslation('latestBadge', 'Latest')}
                    </span>
                  {/if}
                </div>
                
                <p class="post-meta">
                  <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {getBlogTranslation('meta.publishedOn', 'Published on')} {new Date(post.meta.date).toLocaleDateString(currentLang === 'sv' ? 'sv-SE' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} {getBlogTranslation('meta.by', 'by')} {post.meta.author}
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
                  {getBlogTranslation('readMore', 'Read more →')}
                </div>
              </div>
            </a>

          </article>

          <!-- Strategic Follow placement: After first few posts (when user has seen value) -->
          {#if index === Math.min(2, data.posts.length - 1) && data.posts.length > 1}
            <div class="strategic-follow" id="follow-section">
              <div class="follow-intro">
                <h3>{getBlogTranslation('strategicFollow.title', 'Found something interesting?')}</h3>
                <p>{getBlogTranslation('strategicFollow.subtitle', 'Stay connected to never miss our latest insights on global governance.')}</p>
              </div>
              <Follow />
            </div>
          {/if}
        {/each}
      </div>
      
      <!-- If only one post, place Follow component after the single post -->
      {#if data.posts.length === 1}
        <div class="strategic-follow" id="follow-section">
          <div class="follow-intro">
            <h3>{getBlogTranslation('strategicFollow.title', 'Found something interesting?')}</h3>
            <p>{getBlogTranslation('strategicFollow.subtitle', 'Stay connected to never miss our latest insights on global governance.')}</p>
          </div>
          <Follow />
        </div>
      {/if}
    </div>
    
    <!-- Lightweight bottom prompt: Points to the main Follow section -->
    <div class="bottom-prompt">
      <div class="prompt-content">
        <span class="prompt-text">
          {getBlogTranslation('bottomPrompt.text', 'Want to stay updated?')}
        </span>
        <button type="button" class="prompt-link" on:click={scrollToFollow}>
          {getBlogTranslation('bottomPrompt.link', 'See all follow options ↑')}
        </button>
      </div>
    </div>
  {/if}
</div>

<ShareButtons 
  title="Global Governance Framworks Blog"
  hashtags="PlanetaryGovernance, Polycrisis"
  position="left"
/>

<style>
  .container {
    max-width: 900px;
    margin: 2rem auto 4rem;
    padding: 0 20px;
  }
  
  .blog-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .blog-header h1 {
    font-size: 2.5rem;
    color: #2B4B8C;
    margin-bottom: 0.5rem;
  }
  
  .blog-subtitle {
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
    border: 2px solid #DAA520;
    background: linear-gradient(135deg, #fff 0%, #fffef7 100%);
  }
  
  .post-card.featured::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #DAA520, #FFD700, #DAA520);
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
    background-color: #DAA520;
    color: #2B4B8C;
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
    color: #DAA520;
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
    scroll-margin-top: 2rem; /* For smooth scrolling */
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
    color: #DAA520;
  }
    
  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      margin: 1rem auto 2rem;
      padding: 0 1rem;
    }
    
    .blog-header h1 {
      font-size: 2rem;
    }
    
    .blog-subtitle {
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
    .blog-header h1 {
      font-size: 1.75rem;
    }
    
    .post-content {
      padding: 1rem;
    }
  }
</style>
