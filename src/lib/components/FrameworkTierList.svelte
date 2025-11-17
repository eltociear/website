<!-- src/lib/components/FrameworkTierList.svelte -->
<script>
  import { 
    getFrameworksByTier, 
    getFrameworksByTierAndGroup, 
    getGroupsForTier, 
    tierMetadata, 
    statusMapping, 
    groupMetadata 
  } from '$lib/stores/frameworkNav.js';
  import { onMount } from 'svelte';
  
  export let tier;
  export let showHeader = true;
  export let className = '';
  export let t;
  
  // STATIC: Compute data once
  const frameworks = getFrameworksByTier(tier);
  const tierInfo = tierMetadata[tier];
  const groups = getGroupsForTier(tier);
  const ungroupedFrameworks = getFrameworksByTierAndGroup(tier, null);
  
  // STABLE TRANSLATIONS: Snapshot translations once when component mounts
  let stableTranslations = {};
  let translationsReady = false;
  
  // Function to get translation without reactive updates
  function getStableTranslation(key) {
    if (!key) return key;
    
    // First try stable translations
    if (stableTranslations[key]) {
      return stableTranslations[key];
    }
    
    // If not in stable cache and t function exists, try direct call
    if (t) {
      const result = t(key);
      // Only cache non-empty results
      if (result && result !== '' && result !== key) {
        stableTranslations[key] = result;
        return result;
      }
    }
    
    // Fallback to key itself
    return key;
  }
  
  // Pre-cache all translations we need when component mounts
  onMount(() => {
    if (t) {
      // Wait a short moment for translations to load
      setTimeout(() => {
        const keysToCache = [];
        
        // Tier translations
        if (tierInfo) {
          keysToCache.push(tierInfo.titleKey);
          if (tierInfo.descriptionKey) {
            keysToCache.push(tierInfo.descriptionKey);
          }
        }
        
        // Framework translations
        frameworks.forEach(framework => {
          if (framework.titleKey) {
            keysToCache.push(framework.titleKey);
          }
        });
        
        // Group translations
        groups.forEach(group => {
          const groupInfo = groupMetadata[group];
          if (groupInfo && groupInfo.titleKey) {
            keysToCache.push(groupInfo.titleKey);
          }
          if (groupInfo && groupInfo.descriptionKey) {
            keysToCache.push(groupInfo.descriptionKey);
          }
        });
        
        // Status translations
        Object.values(statusMapping).forEach(statusKey => {
          keysToCache.push(statusKey);
        });
        
        // Other common keys
        keysToCache.push('framework.groups.other.title');
        keysToCache.push('framework.tier.noFrameworks');
        
        // Cache all translations
        keysToCache.forEach(key => {
          const translation = t(key);
          if (translation && translation !== '' && translation !== key) {
            stableTranslations[key] = translation;
          }
        });
        
        translationsReady = true;
        console.log('Cached translations:', Object.keys(stableTranslations).length);
        
        // Force a re-render now that we have stable translations
        if (Object.keys(stableTranslations).length > 0) {
          // This will trigger a single re-render with proper translations
          translationsReady = translationsReady; // Svelte reactivity trigger
        }
      }, 100); // Small delay to let translations load
    }
  });
  
  function getStatusText(status) {
    const statusKey = statusMapping[status];
    if (statusKey) {
      const translated = getStableTranslation(statusKey);
      if (translated && translated !== statusKey) {
        return translated;
      }
    }
    switch (status) {
      case 'ready': return 'Ready';
      case 'review': return 'In Review';
      case 'planned': return 'Planned';
      case 'coming-soon': return 'Coming Soon';
      default: return status;
    }
  }
  
  function getStatusClass(status) {
    switch (status) {
      case 'ready': return 'status-ready';
      case 'review': return 'status-review';
      case 'planned': return 'status-planned';
      case 'coming-soon': return 'status-coming-soon';
      default: 'status-default';
    }
  }

  function getGroupInfo(groupKey) {
    return groupMetadata[groupKey] || { titleKey: groupKey, descriptionKey: null };
  }
</script>

<div class="framework-tier-list {className}">
  {#if showHeader && tierInfo}
    <h2>
      {getStableTranslation(tierInfo.titleKey)}
    </h2>
    {#if tierInfo.descriptionKey}
      <p class="tier-description">
        {getStableTranslation(tierInfo.descriptionKey)}
      </p>
    {/if}
  {/if}
  
  {#if frameworks.length > 0}
    {#if groups.length > 0}
      {#each groups as group}
        {@const groupFrameworks = getFrameworksByTierAndGroup(tier, group)}
        {@const groupInfo = getGroupInfo(group)}
        
        <div class="framework-group">
          <h3 class="group-title">
            {groupInfo.emoji || '📁'} {getStableTranslation(groupInfo.titleKey)}
          </h3>
          {#if groupInfo.descriptionKey}
            <p class="group-description">
              {getStableTranslation(groupInfo.descriptionKey)}
            </p>
          {/if}
          
          <ul class="framework-list">
            {#each groupFrameworks as framework (framework.slug)}
              <li class="framework-item">
                <a href={framework.path} class="framework-link" data-sveltekit-preload-data="hover">
                  <div class="framework-title">
                    <span class="emoji-wrapper">{framework.emoji || '📋'}</span>
                    <span>{getStableTranslation(framework.titleKey)}</span>
                  </div>
                  {#if framework.status || framework.version}
                    <div class="framework-meta">
                      {#if framework.status}
                        <span class="status {getStatusClass(framework.status)}">
                          {getStatusText(framework.status)}
                        </span>
                      {/if}
                      {#if framework.version}
                        <span class="version">{framework.version}</span>
                      {/if}
                    </div>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
      
      {#if ungroupedFrameworks.length > 0}
        <div class="framework-group">
          <h3 class="group-title">
            🗂️ {getStableTranslation('framework.groups.other.title') || 'Other Frameworks'}
          </h3>
          
          <ul class="framework-list">
            {#each ungroupedFrameworks as framework (framework.slug)}
              <li class="framework-item">
                <a href={framework.path} class="framework-link" data-sveltekit-preload-data="hover">
                  <div class="framework-title">
                    <span class="emoji-wrapper">{framework.emoji || '📋'}</span>
                    <span>{getStableTranslation(framework.titleKey)}</span>
                  </div>
                  {#if framework.status || framework.version}
                    <div class="framework-meta">
                      {#if framework.status}
                        <span class="status {getStatusClass(framework.status)}">
                          {getStatusText(framework.status)}
                        </span>
                      {/if}
                      {#if framework.version}
                        <span class="version">{framework.version}</span>
                      {/if}
                    </div>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {:else}
      <ul class="framework-list">
        {#each frameworks as framework (framework.slug)}
          <li class="framework-item">
            <a href={framework.path} class="framework-link" data-sveltekit-preload-data="hover">
              <div class="framework-title">
                <span class="emoji-wrapper">{framework.emoji || '📋'}</span>
                <span>{getStableTranslation(framework.titleKey)}</span>
              </div>
              {#if framework.status || framework.version}
                <div class="framework-meta">
                  {#if framework.status}
                    <span class="status {getStatusClass(framework.status)}">
                      {getStatusText(framework.status)}
                    </span>
                  {/if}
                  {#if framework.version}
                    <span class="version">{framework.version}</span>
                  {/if}
                </div>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  {:else}
    <p class="no-frameworks">
      {getStableTranslation('framework.tier.noFrameworks') || `No frameworks defined for Tier ${tier} yet.`}
    </p>
  {/if}
</div>

<style>
  .framework-tier-list {
    margin: 1.5rem 0;
  }
  
  .tier-description {
    color: #666;
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .framework-group {
    margin-bottom: 2.5rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    position: relative;
  }

  .framework-group:last-child {
    margin-bottom: 0;
  }

  .group-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .group-description {
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    font-style: italic;
  }
  
  .framework-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }
  
  .framework-item {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: 
      box-shadow 0.3s ease,
      transform 0.3s ease;
    display: flex;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .framework-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .framework-link {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-decoration: none;
    color: inherit;
    padding: 1.25rem;
    height: 100%;
    position: relative;
    z-index: 2;
  }
  
  .framework-title {
    flex: 1;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.4;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .emoji-wrapper {
    display: inline-block;
    width: 1.5em;
    text-align: center;
    flex-shrink: 0;
  }

  .framework-item:hover .framework-title {
    color: #4338ca;
  }
  
  .framework-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: auto;
    flex-wrap: wrap;
    padding-top: 0.75rem;
  }
  
  .status {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }
  
  .status-ready { background-color: #dcfce7; color: #166534; }
  .status-review { background-color: #fef3c7; color: #92400e; }
  .status-planned { background-color: #e0e7ff; color: #3730a3; }
  .status-coming-soon { background-color: #f3e8ff; color: #6b21a8; }
  .status-default { background-color: #f3f4f6; color: #374151; }
  
  .version {
    font-size: 0.7rem;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    color: #475569;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-weight: 600;
    border: 1px solid #cbd5e1;
  }
  
  .no-frameworks {
    color: #6b7280;
    font-style: italic;
    padding: 2rem;
    text-align: center;
    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
    border-radius: 0.75rem;
    border: 2px dashed #d1d5db;
    margin: 1rem 0;
  }
  
  h2 {
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .framework-list {
      grid-template-columns: 1fr;
    }

    .framework-group {
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .group-title {
      font-size: 1.125rem;
    }

    .framework-link {
      padding: 1rem;
    }
  }
</style>
