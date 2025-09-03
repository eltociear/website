<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import Follow from '$lib/components/Follow.svelte';
  import ShareButtons from '$lib/components/ShareButtons.svelte';
  
  export let data;
  
  let ContentComponent = null;
  let loading = true;
  let error = null;

  // Destructure the post data and the current URL from server load
  const { post, currentUrl, currentLocale } = data;

  // Helper function for translations with fallbacks
  function getBlogTranslation(key, fallback) {
    if (browser) {
      return $t(`blog.${key}`) || fallback;
    }
    return fallback;
  }

  // Generate hashtags for sharing
  $: shareHashtags = generateShareHashtags(post.meta);

  function generateShareHashtags(metadata) {
    let hashtags = [];
    
    // Add custom hashtags from post metadata if they exist
    if (metadata.hashtags && Array.isArray(metadata.hashtags)) {
      hashtags.push(...metadata.hashtags);
    }
    
    // Add tag-based hashtags if tags exist and no custom hashtags
    if (metadata.tags && Array.isArray(metadata.tags) && hashtags.length === 0) {
      // Convert tags to hashtags (remove spaces, capitalize)
      hashtags.push(...metadata.tags.map(tag => 
        tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')
      ));
    }
    
    // Always include default hashtags
    const defaultHashtags = ['GlobalGovernance', 'Polycrisis', 'SystemicChange'];
    
    // Merge custom hashtags with defaults, avoiding duplicates
    const allHashtags = [...new Set([...hashtags, ...defaultHashtags])];
    
    // Limit to reasonable number for sharing (max 5-6)
    return allHashtags.slice(0, 6).join(',');
  }

  onMount(async () => {
    try {
      console.log('Client-side loading post:', post.slug, 'for locale:', currentLocale);
      
      // Dynamically import the MDSveX component on the client
      // Use the locale from the server data to ensure consistency
      const postModule = await import(`../../../lib/posts/${currentLocale}/${post.slug}.md`);
      ContentComponent = postModule.default;
      loading = false;
    } catch (e) {
      console.error('Error loading post content:', e);
      console.error('Attempted path:', `../../../lib/posts/${currentLocale}/${post.slug}.md`);
      error = 'Failed to load post content';
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{post.meta.title} - Global Governance Framework</title>
  <meta name="description" content={post.meta.description} />
  <meta property="og:title" content={post.meta.title} />
  <meta property="og:description" content={post.meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={currentUrl} />
  
  <!-- Add this to handle external referrals better -->
  <meta name="robots" content="index, follow" />
  
  <!-- Canonical URL to prevent duplicate content issues -->
  <link rel="canonical" href={currentUrl} />
</svelte:head>

<div class="container post-page">
  <article>
    <!-- Back to blog link -->
    <nav class="breadcrumb">
      <a href="{base}/blog?lang={currentLocale}" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {getBlogTranslation('backToBlog', 'Back to Blog')}
      </a>
    </nav>

    <h1>{post.meta.title}</h1>
    <p class="post-meta">
      {getBlogTranslation('meta.publishedOn', 'Published on')} {new Date(post.meta.date).toLocaleDateString(currentLocale === 'sv' ? 'sv-SE' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })} {getBlogTranslation('meta.by', 'by')} {post.meta.author}
    </p>
    {#if post.meta.tags && post.meta.tags.length > 0}
      <div class="post-tags">
        {#each post.meta.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}

    <div class="post-content">
      {#if loading}
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>{getBlogTranslation('loading', 'Loading content...')}</p>
        </div>
      {:else if error}
        <div class="error-state">
          <p class="error">{error}</p>
          <p class="debug-info">
            Attempted to load: {post.slug} in {currentLocale}
          </p>
        </div>
      {:else if ContentComponent}
        <svelte:component this={ContentComponent} />
      {:else}
        <p class="no-content">{getBlogTranslation('noContent', 'No content available')}</p>
      {/if}
    </div>
  </article>

  <!-- Follow section after post content -->
  {#if !loading && !error && ContentComponent}
    <div class="post-follow-section">
      <div class="follow-intro">
        <h3>{getBlogTranslation('postFollow.title', 'Enjoyed this post?')}</h3>
        <p>{getBlogTranslation('postFollow.subtitle', 'Stay connected for more insights like this - choose your preferred method below.')}</p>
      </div>
      <Follow />
    </div>

    <!-- Related posts or back to blog -->
    <div class="post-navigation">
      <div class="nav-content">
        <div class="nav-item">
          <a href="{base}/blog?lang={currentLocale}" class="nav-link primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            {getBlogTranslation('navigation.readMore', 'Read More Posts')}
          </a>
        </div>
        <div class="nav-item">
          <a href="{base}/" class="nav-link secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {getBlogTranslation('navigation.backHome', 'Back to Home')}
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- ShareButtons component with post-specific hashtags -->
<ShareButtons 
  title={post.meta.title}
  description={post.meta.description}
  url={currentUrl}
  hashtags={shareHashtags}
  position="right"
/>

<style>
  /* Container and basic layout */
  .container {
    max-width: 800px;
    margin: 2rem auto 4rem;
    padding: 0 20px;
  }

  /* Breadcrumb navigation */
  .breadcrumb {
    margin-bottom: 2rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #6B7280;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: #2B4B8C;
  }

  .back-link svg {
    width: 1rem;
    height: 1rem;
  }

  /* Article header */
  h1 {
    font-size: 2.8rem;
    color: #2B4B8C;
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .post-meta {
    font-size: 1rem;
    color: #6B7280;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 1rem;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .tag {
    background: rgba(43, 75, 140, 0.1);
    color: #2B4B8C;
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  /* Loading and error states */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 0;
    color: #6B7280;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #2B4B8C;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-state {
    padding: 2rem 0;
  }

  .error {
    color: #dc2626;
    padding: 1rem;
    background-color: #fef2f2;
    border-radius: 0.5rem;
    border: 1px solid #fecaca;
    margin-bottom: 1rem;
  }

  .debug-info {
    color: #6b7280;
    font-size: 0.875rem;
    font-style: italic;
  }

  .no-content {
    text-align: center;
    color: #6B7280;
    padding: 2rem 0;
  }

  /* Post content */
  .post-content {
    margin-bottom: 3rem;
  }

  /* Follow section after post */
  .post-follow-section {
    margin: 4rem 0 3rem;
    padding-top: 2rem;
    border-top: 2px solid #f3f4f6;
  }

  .follow-intro {
    text-align: center;
    margin-bottom: 1.5rem;
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

  /* Post navigation */
  .post-navigation {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    justify-content: center;
  }

  .nav-link svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .nav-link.primary {
    background-color: #2B4B8C;
    color: white;
  }

  .nav-link.primary:hover {
    background-color: #1e3a8a;
    transform: translateY(-1px);
  }

  .nav-link.secondary {
    background-color: #f9fafb;
    color: #6B7280;
    border: 1px solid #e5e7eb;
  }

  .nav-link.secondary:hover {
    background-color: #f3f4f6;
    color: #2B4B8C;
    transform: translateY(-1px);
  }

  /* Global styles for rendered markdown content - ONLY apply to .post-content */
  .post-content :global(h2) {
    font-size: 2rem;
    color: #2B4B8C;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .post-content :global(h3) {
    font-size: 1.6rem;
    color: #4B5563;
    margin-top: 1.8rem;
    margin-bottom: 0.8rem;
  }

  .post-content :global(p) {
    color: #4B5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    color: #4B5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    padding-left: 20px;
  }

  .post-content :global(li) {
    margin-bottom: 0.5rem;
  }

  .post-content :global(strong) {
    font-weight: 600;
    color: #2B4B8C;
  }

  .post-content :global(a) {
    color: #DAA520;
    text-decoration: underline;
  }

  .post-content :global(a:hover) {
    color: #8B4513;
  }

  .post-content :global(img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.5rem auto;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }

  .post-content :global(button) {
    background-color: #2B4B8C;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .post-content :global(button:hover) {
    background-color: #1e3a8a;
  }

  .post-content :global(blockquote) {
    border-left: 4px solid #DAA520;
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    background-color: #fffef7;
    font-style: italic;
  }

  .post-content :global(code) {
    background-color: #f3f4f6;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: #2B4B8C;
  }

  .post-content :global(pre) {
    background-color: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .post-content :global(pre code) {
    background: none;
    padding: 0;
    color: inherit;
  }

  /* Ensure Follow component is NOT affected by post styles */
  .post-follow-section :global(.follow-compact) {
    /* Reset any potential overrides */
    font-size: initial !important;
    line-height: initial !important;
    color: white !important;
  }

  .post-follow-section :global(.follow-compact *) {
    /* Ensure all Follow component elements maintain their original styling */
    color: inherit !important;
  }

  /* Specifically target Follow component text elements */
  .post-follow-section :global(.follow-compact h3) {
    color: #DAA520 !important;
    font-size: 1.125rem !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
  }

  .post-follow-section :global(.follow-compact p) {
    color: white !important;
    font-size: 0.8rem !important;
    line-height: 1.2 !important;
    opacity: 0.9 !important;
  }

  .post-follow-section :global(.follow-compact .action-label span) {
    color: white !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
  }

  .post-follow-section :global(.follow-compact .action-icon) {
    color: #DAA520 !important;
  }

  .post-follow-section :global(.follow-compact .social-btn) {
    color: white !important;
  }

  .post-follow-section :global(.follow-compact .social-btn svg) {
    color: white !important;
  }

  .post-follow-section :global(.follow-compact .global-note) {
    color: white !important;
    opacity: 0.8 !important;
    font-size: 0.75rem !important;
    font-style: italic !important;
  }

  .post-follow-section :global(.follow-compact .btn) {
    color: #2B4B8C !important;
  }

  .post-follow-section :global(.follow-compact .btn-secondary) {
    color: #DAA520 !important;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .container {
      margin: 1rem auto 2rem;
      padding: 0 1rem;
    }

    h1 {
      font-size: 2.2rem;
    }

    .post-page :global(h2) {
      font-size: 1.7rem;
    }

    .post-page :global(h3) {
      font-size: 1.4rem;
    }

    .post-page :global(p) {
      font-size: 1rem;
    }

    .nav-content {
      grid-template-columns: 1fr;
    }

    .post-follow-section {
      margin: 2rem 0;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.8rem;
    }

    .nav-link {
      padding: 0.625rem 0.75rem;
      font-size: 0.875rem;
    }
  }

  /* Enhanced bullet point styling for blog posts */
  .post-content :global(ul) {
    color: #4B5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    padding-left: 30px; /* Increased from 20px */
    list-style-type: disc; /* Explicitly set bullet type */
    list-style-position: outside; /* Ensure bullets are outside the text */
  }

  .post-content :global(ol) {
    color: #4B5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    padding-left: 30px; /* Increased from 20px */
    list-style-type: decimal; /* Explicitly set number type */
    list-style-position: outside; /* Ensure numbers are outside the text */
  }

  .post-content :global(li) {
    margin-bottom: 0.5rem;
    display: list-item; /* Explicitly set to list-item */
    color: #4B5563; /* Ensure text color is visible */
  }

  /* Nested lists */
  .post-content :global(ul ul) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding-left: 25px;
    list-style-type: circle; /* Different bullet for nested lists */
  }

  .post-content :global(ol ol) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding-left: 25px;
    list-style-type: lower-alpha; /* Letters for nested numbered lists */
  }

  .post-content :global(ul ul ul) {
    list-style-type: square; /* Third level bullets */
  }

  /* Ensure bullets are colored properly */
  .post-content :global(li::marker) {
    color: #2B4B8C; /* Blue color for bullets/numbers */
    font-weight: bold;
  }

  /* Alternative approach if ::marker doesn't work in all browsers */
  .post-content :global(ul) {
    list-style-image: none; /* Reset any custom bullet images */
  }

  /* Fix for any potential CSS reset that might be hiding bullets */
  .post-content :global(ul),
  .post-content :global(ol) {
    list-style: initial !important; /* Force list styles to appear */
    margin-left: 0 !important;
    padding-left: 30px !important;
  }

  /* Ensure proper spacing and visibility */
  .post-content :global(li) {
    position: relative;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* Fallback custom bullets if browser issues persist */
  .post-content :global(ul.custom-bullets) {
    list-style: none;
    padding-left: 20px;
  }

  .post-content :global(ul.custom-bullets li::before) {
    content: "•";
    color: #2B4B8C;
    font-weight: bold;
    position: absolute;
    left: -20px;
  }

  /* Table styling for markdown content */
  .post-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .post-content :global(th) {
    background-color: #2B4B8C;
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .post-content :global(td) {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    color: #4B5563;
    vertical-align: top;
  }

  .post-content :global(tr:nth-child(even)) {
    background-color: #f9fafb;
  }

  .post-content :global(tr:hover) {
    background-color: #f3f4f6;
  }

  .post-content :global(thead tr:hover) {
    background-color: #2B4B8C; /* Keep header color on hover */
  }

  /* Responsive table handling */
  @media (max-width: 768px) {
    .post-content :global(table) {
      font-size: 0.875rem;
    }
    
    .post-content :global(th),
    .post-content :global(td) {
      padding: 0.6rem 0.8rem;
    }
  }

  /* For very small screens, consider horizontal scrolling */
  @media (max-width: 480px) {
    .post-content :global(table) {
      display: block;
      overflow-x: auto;
      white-space: nowrap;
    }
  }
</style>
