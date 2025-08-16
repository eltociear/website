<!-- src/lib/components/ToolDetailModal.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';
  
  const dispatch = createEventDispatcher();
  
  export let tool = null;
  export let isOpen = false;
  
  // Helper function to display markdown content
  function displayMarkdownContent(markdownData) {
    if (!markdownData || !markdownData.rawMarkdown) {
      return '<p>Content not available</p>';
    }
    
    // Basic markdown-to-HTML conversion
    const markdown = markdownData.rawMarkdown;
    
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><li>/g, '<ul><li>')
      .replace(/<\/li><\/p>/g, '</li></ul>')
      .replace(/<\/ul><ul>/g, '');
  }

  function close() {
    isOpen = false;
    dispatch('close');
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      close();
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  function getComplexityColor(complexity) {
    switch (complexity?.toLowerCase()) {
      case 'basic': return '#16a34a';
      case 'medium': return '#ca8a04';
      case 'high': return '#dc2626';
      case 'advanced': return '#7c3aed';
      default: return '#64748b';
    }
  }

  function getCulturalAdaptationColor(adaptation) {
    switch (adaptation?.toLowerCase()) {
      case 'low': return '#64748b';
      case 'medium': return '#ca8a04';
      case 'high': return '#16a34a';
      default: return '#64748b';
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen && tool}
  <div class="modal-backdrop" on:click={handleBackdropClick}>
    <div class="modal-container">
      <div class="modal-header">
        <div class="header-content">
          <h2 class="tool-title">{tool.name}</h2>
          <div class="tool-badges">
            <span 
              class="complexity-badge" 
              style="background-color: {getComplexityColor(tool.complexity)}"
            >
              {tool.complexity}
            </span>
            <span 
              class="cultural-badge"
              style="background-color: {getCulturalAdaptationColor(tool.culturalAdaptation)}"
            >
              {tool.culturalAdaptation} Cultural Adaptation
            </span>
          </div>
        </div>
        <button class="close-button" on:click={close}>
          ✕
        </button>
      </div>

      <div class="modal-body">
        <!-- Tool Meta Information -->
        <div class="tool-meta-section">
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">🗺️ Journey:</span>
              <span class="meta-value">{tool.journey?.replace('-', ' ') || 'Not specified'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">⏱️ Estimated Time:</span>
              <span class="meta-value">{tool.estimatedTime || 'Variable'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">🎯 Complexity:</span>
              <span class="meta-value">{tool.complexity}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">🌍 Cultural Adaptation:</span>
              <span class="meta-value">{tool.culturalAdaptation}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="tool-description">
            <p>{tool.description}</p>
          </div>

          <!-- Tags -->
          {#if tool.tags && tool.tags.length > 0}
            <div class="tool-tags">
              <span class="tags-label">Tags:</span>
              <div class="tags-list">
                {#each tool.tags as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Quick Wins -->
          {#if tool.quickWins && tool.quickWins.length > 0}
            <div class="quick-wins">
              <h4>🎯 Quick Wins</h4>
              <ul>
                {#each tool.quickWins as win}
                  <li>{win}</li>
                {/each}
              </ul>
            </div>
          {/if}

          <!-- Prerequisites -->
          {#if tool.prerequisites && tool.prerequisites.length > 0}
            <div class="prerequisites">
              <h4>📋 Prerequisites</h4>
              <ul>
                {#each tool.prerequisites as prereq}
                  <li>{prereq}</li>
                {/each}
              </ul>
            </div>
          {/if}

          <!-- Resources -->
          {#if tool.resources && tool.resources.length > 0}
            <div class="resources">
              <h4>📦 Included Resources</h4>
              <ul>
                {#each tool.resources as resource}
                  <li>{resource}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>

        <!-- Markdown Content -->
        {#if tool.content && tool.content.rawMarkdown}
          <div class="markdown-section">
            <h3>📚 Detailed Implementation Guide</h3>
            <div class="markdown-content">
              {@html displayMarkdownContent(tool.content)}
            </div>
          </div>
        {:else}
          <div class="content-placeholder">
            <div class="placeholder-icon">📖</div>
            <h4>Detailed Content Coming Soon</h4>
            <p>The full implementation guide for this tool is being developed. In the meantime, you can use the meta information above to get started.</p>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <div class="footer-actions">
          <button class="action-button primary">
            🚀 Start Implementation
          </button>
          <button class="action-button secondary">
            📥 Download Guide
          </button>
          <button class="action-button tertiary" on:click={close}>
            👁️ Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-container {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Modal Header */
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .header-content {
    flex: 1;
  }

  .tool-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .tool-badges {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .complexity-badge, .cultural-badge {
    padding: 0.375rem 0.875rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
    margin-left: 1rem;
  }

  .close-button:hover {
    background: #f1f5f9;
    color: #374151;
  }

  /* Modal Body */
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }

  .tool-meta-section {
    margin-bottom: 2rem;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .meta-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
  }

  .meta-value {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    text-transform: capitalize;
  }

  .tool-description {
    margin-bottom: 1.5rem;
  }

  .tool-description p {
    font-size: 1.125rem;
    color: #374151;
    line-height: 1.7;
    margin: 0;
  }

  .tool-tags {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .tags-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background: #dbeafe;
    color: #1e40af;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .quick-wins, .prerequisites, .resources {
    background: #f9fafb;
    padding: 1.25rem;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    margin-bottom: 1.5rem;
  }

  .quick-wins h4, .prerequisites h4, .resources h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .quick-wins ul, .prerequisites ul, .resources ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .quick-wins li, .prerequisites li, .resources li {
    padding: 0.5rem 0;
    color: #374151;
    border-bottom: 1px solid #f1f5f9;
    position: relative;
    padding-left: 1.25rem;
    line-height: 1.5;
  }

  .quick-wins li:last-child, .prerequisites li:last-child, .resources li:last-child {
    border-bottom: none;
  }

  .quick-wins li:before {
    content: "✓";
    color: #16a34a;
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  .prerequisites li:before {
    content: "•";
    color: #f59e0b;
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  .resources li:before {
    content: "📄";
    position: absolute;
    left: 0;
    font-size: 0.875rem;
  }

  /* Markdown Section */
  .markdown-section {
    border-top: 1px solid #e2e8f0;
    padding-top: 1.5rem;
  }

  .markdown-section h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .markdown-content {
    color: #374151;
    line-height: 1.7;
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
  }

  .markdown-content :global(h1) {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
    margin-top: 0;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5rem;
  }

  .markdown-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.875rem;
    margin-top: 1.25rem;
  }

  .markdown-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
    margin-top: 1rem;
  }

  .markdown-content :global(h4) {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
    margin-top: 0.875rem;
  }

  .markdown-content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
  }

  .markdown-content :global(ul), 
  .markdown-content :global(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .markdown-content :global(li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  .markdown-content :global(strong) {
    font-weight: 600;
    color: #1e293b;
  }

  .markdown-content :global(em) {
    font-style: italic;
    color: #64748b;
  }

  /* Content Placeholder */
  .content-placeholder {
    text-align: center;
    padding: 3rem 1.5rem;
    color: #64748b;
  }

  .placeholder-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .content-placeholder h4 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .content-placeholder p {
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
  }

  /* Modal Footer */
  .modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .footer-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .action-button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .action-button.primary {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    color: white;
  }

  .action-button.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  }

  .action-button.secondary {
    background: #3b82f6;
    color: white;
  }

  .action-button.secondary:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .action-button.tertiary {
    background: transparent;
    color: #64748b;
    border: 2px solid #e2e8f0;
  }

  .action-button.tertiary:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 0.5rem;
    }

    .modal-container {
      max-height: 95vh;
    }

    .modal-header {
      padding: 1rem;
      flex-direction: column;
      align-items: stretch;
    }

    .header-content {
      margin-bottom: 1rem;
    }

    .close-button {
      align-self: flex-end;
      margin-left: 0;
    }

    .tool-title {
      font-size: 1.25rem;
    }

    .tool-badges {
      justify-content: flex-start;
    }

    .modal-body {
      padding: 1rem;
    }

    .meta-grid {
      grid-template-columns: 1fr;
    }

    .tool-tags {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .footer-actions {
      flex-direction: column;
      align-items: center;
    }

    .action-button {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .modal-container {
      border-radius: 0.5rem;
    }

    .tool-title {
      font-size: 1.125rem;
    }

    .complexity-badge, .cultural-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
    }

    .tool-description p {
      font-size: 1rem;
    }

    .quick-wins, .prerequisites, .resources {
      padding: 1rem;
    }

    .content-placeholder {
      padding: 2rem 1rem;
    }

    .placeholder-icon {
      font-size: 3rem;
    }
  }

  /* Animation */
  .modal-backdrop {
    animation: fadeIn 0.2s ease-out;
  }

  .modal-container {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Focus states for accessibility */
  .close-button:focus,
  .action-button:focus {
    outline: 3px solid rgba(59, 130, 246, 0.1);
    outline-offset: 2px;
  }

  /* Print styles */
  @media print {
    .modal-backdrop {
      position: static;
      background: none;
      padding: 0;
    }

    .modal-container {
      box-shadow: none;
      max-height: none;
      border: 1px solid #ccc;
    }

    .modal-footer {
      display: none;
    }

    .close-button {
      display: none;
    }
  }
</style>
