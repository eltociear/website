<!-- src/lib/components/Follow.svelte -->
<script>
  import { t } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  
  // Helper function for translations with fallbacks
  function getTranslation(key, fallback) {
    if (browser) {
      return $t(`common.follow.${key}`) || fallback;
    }
    return fallback;
  }
  
  function copyRSSUrl() {
    const rssUrl = `${window.location.origin}${base}/rss.xml`;
    navigator.clipboard.writeText(rssUrl).then(() => {
      alert('RSS URL copied to clipboard!');
    }).catch(() => {
      prompt('Copy this RSS URL:', rssUrl);
    });
  }
  
  function addBookmark() {
    if (navigator.userAgent.includes('Mac')) {
      alert('Press Cmd+D to bookmark this page!');
    } else {
      alert('Press Ctrl+D to bookmark this page!');
    }
  }
</script>

<div class="follow-compact">
  <div class="follow-header">
    <svg class="follow-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-5a7.07 7.07 0 00-1-3.73l.73-.73A8 8 0 0115 12v5z" />
    </svg>
    <div class="header-text">
      <h3>{getTranslation('title', 'Stay Connected')}</h3>
      <p>{getTranslation('description', 'Follow updates - no email required')}</p>
    </div>
  </div>
  
  <div class="follow-actions">
    <!-- RSS -->
    <div class="action-group">
      <div class="action-label">
        <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
        <span>{getTranslation('rss.title', 'RSS')}</span>
      </div>
      <div class="action-buttons">
        <a href="{base}/rss.xml" class="btn btn-primary" target="_blank" title="Subscribe to RSS feed">
          {getTranslation('rss.subscribe', 'Subscribe')}
        </a>
        <button type="button" class="btn btn-secondary" on:click={copyRSSUrl} title="Copy RSS URL">
          {getTranslation('rss.copy', 'Copy')}
        </button>
      </div>
    </div>

    <!-- Social -->
    <div class="action-group">
      <div class="action-label">
        <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>{getTranslation('social.title', 'Social')}</span>
      </div>
      <div class="action-buttons social-buttons">
        <a href="https://github.com/GlobalGovernanceFramework" target="_blank" rel="noopener noreferrer" class="social-btn" title="Follow on GitHub" aria-label="GitHub">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
        </a>
        <a href="https://discord.gg/MjnzCfh4mM" target="_blank" rel="noopener noreferrer" class="social-btn" title="Join Discord" aria-label="Discord">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.210 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Bookmark -->
    <div class="action-group">
      <div class="action-label">
        <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span>{getTranslation('bookmark.title', 'Bookmark')}</span>
      </div>
      <div class="action-buttons">
        <button type="button" class="btn btn-primary" on:click={addBookmark} title="Add bookmark">
          {getTranslation('bookmark.add', 'Add')}
        </button>
      </div>
    </div>
  </div>
  
  <div class="follow-footer">
    <span class="global-note">
      {getTranslation('global.note', 'Open for everyone - no tracking')}
    </span>
  </div>
</div>

<style>
  .follow-compact {
    background: linear-gradient(135deg, #2B4B8C 0%, #6B5CA5 100%);
    color: white;
    padding: 1.25rem;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .follow-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .follow-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #DAA520;
    flex-shrink: 0;
  }
  
  .header-text h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: #DAA520;
    line-height: 1.2;
  }
  
  .header-text p {
    font-size: 0.8rem;
    margin: 0;
    opacity: 0.9;
    line-height: 1.2;
  }
  
  .follow-actions {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .action-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem 0;
  }
  
  .action-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;
  }
  
  .action-icon {
    width: 1rem;
    height: 1rem;
    color: #DAA520;
    flex-shrink: 0;
  }
  
  .action-label span {
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }
  
  .social-buttons {
    gap: 0.375rem;
  }
  
  .btn {
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    font-weight: 500;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
    border: none;
    white-space: nowrap;
    line-height: 1;
  }
  
  .btn-primary {
    background-color: #DAA520;
    color: #2B4B8C;
  }
  
  .btn-primary:hover {
    background-color: #B8860B;
    transform: translateY(-1px);
  }
  
  .btn-secondary {
    background-color: transparent;
    color: #DAA520;
    border: 1px solid #DAA520;
  }
  
  .btn-secondary:hover {
    background-color: #DAA520;
    color: #2B4B8C;
  }
  
  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.25rem;
    color: white;
    text-decoration: none;
    transition: all 0.2s;
  }
  
  .social-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  .social-btn svg {
    width: 1rem;
    height: 1rem;
  }
  
  .follow-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 0.75rem;
    text-align: center;
  }
  
  .global-note {
    font-size: 0.75rem;
    opacity: 0.8;
    font-style: italic;
  }
  
  /* Responsive design */
  @media (max-width: 640px) {
    .follow-compact {
      padding: 1rem;
    }
    
    .action-group {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .action-buttons {
      width: 100%;
      justify-content: flex-start;
    }
    
    .social-buttons {
      justify-content: flex-start;
    }
    
    .btn {
      flex: 1;
      text-align: center;
      min-width: 60px;
    }
  }
  
  @media (min-width: 768px) {
    .follow-actions {
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    
    .action-group {
      flex-direction: column;
      text-align: center;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.375rem;
      justify-content: center;
      min-height: 80px;
    }
    
    .action-label {
      flex-direction: column;
      gap: 0.25rem;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
    
    .action-buttons {
      justify-content: center;
    }
  }
</style>
