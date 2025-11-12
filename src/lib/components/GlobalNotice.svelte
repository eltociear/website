<!-- src/lib/components/GlobalNotice.svelte -->
<script>
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import { browser } from '$app/environment';
  
  let visible = false;

  onMount(() => {
    // Only show the banner if it hasn't been dismissed this session
    if (browser && !sessionStorage.getItem('globalNoticeDismissed')) {
      visible = true;
    }
  });

  function dismiss() {
    if (browser) {
      sessionStorage.setItem('globalNoticeDismissed', 'true');
    }
    visible = false;
  }
</script>

{#if visible}
  <div class="global-notice" role="alert">
    <div class="notice-content">
      <div class="notice-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <span class="notice-text">
        {$t('common.notices.global.text') || 
         $t('notices.global.text') || 
         'This is a living project in its earliest, formative stages—an invitation to co-create. You may encounter unfinished sections or broken links; these are the spaces where new voices and ideas are welcome. Thank you for your patience as this work grows.'}
      </span>
    </div>
    <button 
      on:click={dismiss} 
      class="dismiss-button" 
      aria-label={$t('common.notices.global.dismiss') || $t('notices.global.dismiss') || 'Dismiss notice'}
      title={$t('common.notices.global.dismiss') || $t('notices.global.dismiss') || 'Dismiss notice'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
{/if}

<style>
  .global-notice {
    background: linear-gradient(to right, #eff6ff, #dbeafe);
    border-bottom: 1px solid #93c5fd;
    color: #1e40af;
    padding: 0.75rem 1rem;
    position: relative;
    font-size: 0.875rem;
    line-height: 1.4;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 30;
  }

  .notice-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    max-width: 1200px;
    margin: 0 auto;
    padding-right: 2rem;
  }

  .notice-icon {
    flex-shrink: 0;
    color: #2563eb;
  }

  .notice-text {
    text-align: center;
    font-weight: 500;
  }

  .dismiss-button {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dismiss-button:hover {
    background-color: rgba(59, 130, 246, 0.1);
    color: #1e40af;
  }

  .dismiss-button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .global-notice {
      padding: 0.625rem 0.75rem;
      font-size: 0.8125rem;
    }

    .notice-content {
      padding-right: 2.5rem;
    }

    .notice-text {
      text-align: left;
    }

    .dismiss-button {
      right: 0.75rem;
    }
  }

  /* Ensure notice appears above other content */
  .global-notice {
    position: sticky;
    top: 0;
  }
</style>
