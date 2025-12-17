<!-- src/routes/sovereign/protocols/+page.svelte -->
<script>
  import { t } from '$lib/i18n';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let selectedChapter = 'all';
  let showSubmitForm = false;
  
  // Protocol examples organized by chapter
  // Example protocols from the book
  // Note: Downloads and success rates are illustrative examples to show
  // what successful protocols look like. Real implementations may vary.
  const protocolExamples = [
    {
      chapter: 9,
      chapterTitle: 'Your Arsenal',
      name: 'The Sunday Sync',
      description: 'Weekly alignment protocol for core crew',
      trigger: 'Every Sunday, 7pm',
      process: 'Everyone shares: (1) One win from the week, (2) One lesson learned, (3) One challenge for upcoming week',
      output: 'Shared context, mutual support, learning captured',
      enforcement: 'Calendar reminder, peer expectation, visible value'
    },
    {
      chapter: 9,
      chapterTitle: 'Your Arsenal',
      name: 'The 24-Hour Rule',
      description: 'Conflict resolution protocol preventing resentment',
      trigger: 'When you have a problem with someone',
      process: 'Address it within 24 hours directly, or consciously let it go',
      output: 'No festering resentment, quick resolution, or conscious release',
      enforcement: 'Cultural norm, leadership modeling'
    },
    {
      chapter: 10,
      chapterTitle: 'The Sovereign\'s Economy',
      name: 'The Platform Revenue Model',
      description: 'Shift from extraction to creation economics',
      trigger: 'Quarterly business model review',
      process: 'Calculate: (1) What value did we create? (2) How many people benefited? (3) What percentage did we capture?',
      output: 'Clear metrics on platform vs. mercenary economics',
      enforcement: 'Board review, compensation tied to platform metrics'
    },
    {
      chapter: 11,
      chapterTitle: 'The Inner Circle',
      name: 'The Council Meeting',
      description: 'Monthly Inner Circle coordination protocol',
      trigger: 'First Monday of each month, 2 hours',
      process: '(1) Round: Wins & challenges (30 min), (2) Deep dive: One person\'s major problem (60 min), (3) Opportunities & requests (30 min)',
      output: 'Strategic alignment, problem-solving, resource coordination',
      enforcement: 'Rotating facilitator, written Operating Agreement'
    },
    {
      chapter: 15,
      chapterTitle: 'Rewriting Reality',
      name: 'The Decision Template',
      description: 'Structured thinking protocol for major decisions',
      trigger: 'Before any major decision (>$10K or >10 person-hours)',
      process: 'Answer: (1) Desired outcome? (2) Options? (3) Risks? (4) What\'s reversible? (5) Who approves?',
      output: 'Documented reasoning, reduced decision regret',
      enforcement: 'Template in shared docs, expected in all proposals'
    }
  ];
  
  // Form state
  let formData = {
    name: '',
    email: '',
    chapter: '',
    protocolName: '',
    description: '',
    trigger: '',
    process: '',
    output: '',
    enforcement: '',
    resultsPositive: '',
    resultsNegative: '',
    willingToShare: true
  };
  
  let formSubmitted = false;
  let isSubmitting = false;
  let submitError = null;
  
  // Close modal on Escape key
  function handleKeydown(event) {
    if (event.key === 'Escape' && showSubmitForm) {
      toggleSubmitForm();
    }
  }
  
  onMount(() => {
    if (browser) {
      window.addEventListener('keydown', handleKeydown);
      return () => {
        window.removeEventListener('keydown', handleKeydown);
      };
    }
  });
  
  // Reactive filtering - updates automatically when selectedChapter changes
  $: filteredProtocols = selectedChapter === 'all' 
    ? protocolExamples 
    : protocolExamples.filter(p => p.chapter === parseInt(selectedChapter));
  
  function toggleSubmitForm() {
    showSubmitForm = !showSubmitForm;
    submitError = null;
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    isSubmitting = true;
    submitError = null;
    
    try {
      const response = await fetch('https://formspree.io/f/xrbnweje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _subject: `New Protocol Submission: ${formData.protocolName}`,
          _replyto: formData.email
        })
      });
      
      if (response.ok) {
        formSubmitted = true;
        showSubmitForm = false;
        
        // Auto-dismiss success message after 5 seconds
        setTimeout(() => {
          formSubmitted = false;
        }, 5000);
        
        // Reset form
        formData = {
          name: '',
          email: '',
          chapter: '',
          protocolName: '',
          description: '',
          trigger: '',
          process: '',
          output: '',
          enforcement: '',
          resultsPositive: '',
          resultsNegative: '',
          willingToShare: true
        };
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      submitError = 'Failed to submit protocol. Please try again or email us directly.';
      console.error('Submission error:', error);
    } finally {
      isSubmitting = false;
    }
  }
  
  function downloadProtocol(protocol) {
    // Generate a downloadable template file
    const template = `SOVEREIGNTY PROTOCOL TEMPLATE
================================

Protocol Name: ${protocol.name}
Chapter: ${protocol.chapter} - ${protocol.chapterTitle}
Description: ${protocol.description}

PROTOCOL STRUCTURE
==================

TRIGGER (When does this activate?)
${protocol.trigger}

PROCESS (What happens? Who does what, in what order?)
${protocol.process}

OUTPUT (What's the result?)
${protocol.output}

ENFORCEMENT (How is this maintained?)
${protocol.enforcement}

YOUR IMPLEMENTATION TRACKER
============================

Date Started: _______________
Team/Crew Size: _______________
Context/Situation:


Week 1 Implementation:
Date: _______________
What worked:


What didn't work:


Adjustments made:


Week 2 Implementation:
Date: _______________
What worked:


What didn't work:


Adjustments made:


Week 3 Implementation:
Date: _______________
What worked:


What didn't work:


Adjustments made:


Week 4 Implementation:
Date: _______________
What worked:


What didn't work:


Adjustments made:


FINAL ASSESSMENT
================

Success Metrics:
- Goal 1: _______________
- Goal 2: _______________
- Goal 3: _______________

Overall Success Rating (1-10): _______________

Would you implement this protocol again? Y / N

What would you change?


What would you keep the same?


Would you recommend this protocol to others? Y / N
If yes, what type of situation/crew is this best for?


---
Generated from globalgovernanceframeworks.org/sovereign/protocols
Field-tested protocol from the Sovereign practitioner community
`;
    
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${protocol.name.replace(/\s+/g, '-').toLowerCase()}-protocol-template.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>{$t('sovereign.protocols.title')}</title>
  <meta name="description" content="{$t('sovereign.protocols.subtitle')}" />
</svelte:head>

<!-- Header Section -->
<section class="protocols-header">
  <div class="container">
    <a href="{base}/sovereign" class="back-link">← {$t('sovereign.protocols.backToSovereign')}</a>
    <h1 class="page-title">{$t('sovereign.protocols.title')}</h1>
    <p class="page-subtitle">{$t('sovereign.protocols.subtitle')}</p>
    
    <div class="header-actions">
      <button class="submit-protocol-btn" on:click={toggleSubmitForm}>
        {$t('sovereign.protocols.submitYourProtocol')}
      </button>
    </div>
  </div>
</section>

<!-- Filter Section -->
<section class="filter-section">
  <div class="container">
    <div class="filter-controls">
      <label for="chapter-filter">{$t('sovereign.protocols.filterByChapter')}:</label>
      <select id="chapter-filter" bind:value={selectedChapter} class="chapter-select">
        <option value="all">{$t('sovereign.protocols.allChapters')}</option>
        <option value="9">{$t('sovereign.protocols.chapter9')}</option>
        <option value="10">{$t('sovereign.protocols.chapter10')}</option>
        <option value="11">{$t('sovereign.protocols.chapter11')}</option>
        <option value="12">{$t('sovereign.protocols.chapter12')}</option>
        <option value="13">{$t('sovereign.protocols.chapter13')}</option>
        <option value="14">{$t('sovereign.protocols.chapter14')}</option>
        <option value="15">{$t('sovereign.protocols.chapter15')}</option>
      </select>
    </div>
    
    <div class="stats-summary">
      <div class="stat-item">
        <span class="stat-number">{filteredProtocols.length}</span>
        <span class="stat-label">{filteredProtocols.length === protocolExamples.length ? $t('sovereign.protocols.totalProtocols') : $t('sovereign.protocols.showingProtocols')}</span>
      </div>
    </div>
  </div>
</section>

<!-- Protocols Grid -->
<section class="protocols-grid-section">
  <div class="container">
    {#if filteredProtocols.length === 0}
      <div class="no-results">
        <p>{$t('sovereign.protocols.noProtocolsFound')}</p>
      </div>
    {:else}
      <div class="protocols-grid">
        {#each filteredProtocols as protocol}
          <div class="protocol-card">
            <div class="protocol-header">
              <div class="protocol-meta">
                <span class="chapter-badge">{$t('sovereign.protocols.chapterLabel')} {protocol.chapter}</span>
                <span class="chapter-title">{protocol.chapterTitle}</span>
              </div>
              <h3 class="protocol-name">{protocol.name}</h3>
              <p class="protocol-description">{protocol.description}</p>
            </div>
            
            <div class="protocol-details">
              <div class="detail-item">
                <strong>{$t('sovereign.protocols.trigger')}:</strong>
                <span>{protocol.trigger}</span>
              </div>
              
              <div class="detail-item">
                <strong>{$t('sovereign.protocols.process')}:</strong>
                <span>{protocol.process}</span>
              </div>
              
              <div class="detail-item">
                <strong>{$t('sovereign.protocols.output')}:</strong>
                <span>{protocol.output}</span>
              </div>
              
              <div class="detail-item">
                <strong>{$t('sovereign.protocols.enforcement')}:</strong>
                <span>{protocol.enforcement}</span>
              </div>
            </div>
            
            <div class="protocol-footer">
              <button class="download-btn" on:click={() => downloadProtocol(protocol)}>
                {$t('sovereign.protocols.downloadTemplate')}
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- Submit Form Modal -->
{#if showSubmitForm}
  <div class="modal-overlay" on:click={toggleSubmitForm}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>{$t('sovereign.protocols.submitForm.title')}</h2>
        <button class="close-btn" on:click={toggleSubmitForm}>×</button>
      </div>
      
      <form on:submit={handleSubmit} class="submit-form">
        {#if submitError}
          <div class="error-message">
            <p>{submitError}</p>
          </div>
        {/if}
        
        <div class="form-section">
          <h3>{$t('sovereign.protocols.submitForm.yourInfo')}</h3>
          
          <div class="form-group">
            <label for="name">{$t('sovereign.protocols.submitForm.name')}*</label>
            <input type="text" id="name" bind:value={formData.name} required />
          </div>
          
          <div class="form-group">
            <label for="email">{$t('sovereign.protocols.submitForm.email')}*</label>
            <input type="email" id="email" bind:value={formData.email} required />
          </div>
        </div>
        
        <div class="form-section">
          <h3>{$t('sovereign.protocols.submitForm.protocolDetails')}</h3>
          
          <div class="form-group">
            <label for="chapter">{$t('sovereign.protocols.submitForm.chapter')}*</label>
            <select id="chapter" bind:value={formData.chapter} required>
              <option value="">{$t('sovereign.protocols.submitForm.selectChapter')}</option>
              <option value="9">Chapter 9: Your Arsenal</option>
              <option value="10">Chapter 10: The Sovereign's Economy</option>
              <option value="11">Chapter 11: The Inner Circle</option>
              <option value="12">Chapter 12: Dynasty Building</option>
              <option value="13">Chapter 13: From Warlord to World-Builder</option>
              <option value="14">Chapter 14: The Architect's Eye</option>
              <option value="15">Chapter 15: Rewriting Reality</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="protocolName">{$t('sovereign.protocols.submitForm.protocolName')}*</label>
            <input type="text" id="protocolName" bind:value={formData.protocolName} required 
                   placeholder="e.g., The Sunday Sync" />
          </div>
          
          <div class="form-group">
            <label for="description">{$t('sovereign.protocols.submitForm.description')}*</label>
            <textarea id="description" bind:value={formData.description} required rows="3"
                      placeholder="Brief description of what this protocol does"></textarea>
          </div>
          
          <div class="form-group">
            <label for="trigger">{$t('sovereign.protocols.submitForm.trigger')}*</label>
            <input type="text" id="trigger" bind:value={formData.trigger} required 
                   placeholder="When does this activate?" />
          </div>
          
          <div class="form-group">
            <label for="process">{$t('sovereign.protocols.submitForm.process')}*</label>
            <textarea id="process" bind:value={formData.process} required rows="4"
                      placeholder="What happens? Who does what, in what order?"></textarea>
          </div>
          
          <div class="form-group">
            <label for="output">{$t('sovereign.protocols.submitForm.output')}*</label>
            <input type="text" id="output" bind:value={formData.output} required 
                   placeholder="What's the result?" />
          </div>
          
          <div class="form-group">
            <label for="enforcement">{$t('sovereign.protocols.submitForm.enforcement')}*</label>
            <input type="text" id="enforcement" bind:value={formData.enforcement} required 
                   placeholder="How is this maintained?" />
          </div>
        </div>
        
        <div class="form-section">
          <h3>{$t('sovereign.protocols.submitForm.results')}</h3>
          
          <div class="form-group">
            <label for="resultsPositive">{$t('sovereign.protocols.submitForm.whatWorked')}</label>
            <textarea id="resultsPositive" bind:value={formData.resultsPositive} rows="3"
                      placeholder="What worked well? What were the positive outcomes?"></textarea>
          </div>
          
          <div class="form-group">
            <label for="resultsNegative">{$t('sovereign.protocols.submitForm.whatDidnt')}</label>
            <textarea id="resultsNegative" bind:value={formData.resultsNegative} rows="3"
                      placeholder="What didn't work? What would you change?"></textarea>
          </div>
          
          <div class="form-group checkbox-group">
            <input type="checkbox" id="willingToShare" bind:checked={formData.willingToShare} />
            <label for="willingToShare">{$t('sovereign.protocols.submitForm.willingToShare')}</label>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="cancel-btn" on:click={toggleSubmitForm} disabled={isSubmitting}>
            {$t('sovereign.protocols.submitForm.cancel')}
          </button>
          <button type="submit" class="submit-btn" disabled={isSubmitting}>
            {#if isSubmitting}
              {$t('sovereign.protocols.submitForm.submitting')}
            {:else}
              {$t('sovereign.protocols.submitForm.submit')}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Success Message -->
{#if formSubmitted}
  <div class="success-banner">
    <div class="container">
      <p>{$t('sovereign.protocols.submitForm.successMessage')}</p>
      <button on:click={() => formSubmitted = false}>×</button>
    </div>
  </div>
{/if}

<style>
  /* Header Section */
  .protocols-header {
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
    margin-bottom: 2rem;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .submit-protocol-btn {
    background-color: #DAA520;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-protocol-btn:hover {
    background-color: #B8860B;
  }

  /* Filter Section */
  .filter-section {
    background-color: #f8f9fa;
    padding: 2rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .filter-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .filter-controls label {
    font-weight: 600;
    color: #333;
  }

  .chapter-select {
    padding: 0.5rem 1rem;
    border: 2px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
    background-color: white;
    cursor: pointer;
  }

  .stats-summary {
    display: flex;
    gap: 3rem;
    justify-content: center;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #DAA520;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #666;
  }

  /* Protocols Grid */
  .protocols-grid-section {
    padding: 3rem 2rem;
    background-color: white;
  }

  .protocols-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 2rem;
  }

  .protocol-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 1rem;
    padding: 1.5rem;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .protocol-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }

  .protocol-header {
    margin-bottom: 1.5rem;
  }

  .protocol-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .chapter-badge {
    background-color: #DAA520;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .chapter-title {
    color: #666;
    font-size: 0.9rem;
  }

  .protocol-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }

  .protocol-description {
    color: #555;
    line-height: 1.5;
  }

  .protocol-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-item strong {
    color: #DAA520;
    font-size: 0.9rem;
  }

  .detail-item span {
    color: #555;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .protocol-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  .download-btn {
    background-color: #1a1a2e;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .download-btn:hover {
    background-color: #DAA520;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    overflow-y: auto;
    padding: 2rem;
  }

  .modal-content {
    background: white;
    border-radius: 1rem;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .modal-header h2 {
    font-size: 2rem;
    color: #1a1a2e;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: #666;
    cursor: pointer;
    line-height: 1;
  }

  .close-btn:hover {
    color: #DAA520;
  }

  /* Form */
  .submit-form {
    padding: 2rem;
  }

  .form-section {
    margin-bottom: 2rem;
  }

  .form-section h3 {
    font-size: 1.25rem;
    color: #1a1a2e;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #DAA520;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: #DAA520;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .checkbox-group input {
    width: auto;
  }

  .error-message {
    background-color: #fee;
    border: 2px solid #c33;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    color: #c33;
    font-weight: 500;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 2px solid #e0e0e0;
  }

  .cancel-btn,
  .submit-btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .cancel-btn {
    background-color: #e0e0e0;
    color: #333;
  }

  .cancel-btn:hover {
    background-color: #d0d0d0;
  }

  .submit-btn {
    background-color: #DAA520;
    color: white;
  }

  .submit-btn:hover {
    background-color: #B8860B;
  }

  .cancel-btn:disabled,
  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Success Banner */
  .success-banner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #2D5F2D;
    color: white;
    padding: 1rem 2rem;
    z-index: 2000;
  }

  .success-banner .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .success-banner button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
    font-size: 1.125rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .protocols-grid {
      grid-template-columns: 1fr;
    }

    .stats-summary {
      flex-direction: column;
      gap: 1.5rem;
    }

    .filter-controls {
      flex-direction: column;
      align-items: flex-start;
    }

    .protocol-footer {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .modal-overlay {
      padding: 1rem;
    }

    .modal-header,
    .submit-form {
      padding: 1.5rem;
    }

    .form-actions {
      flex-direction: column;
    }

    .cancel-btn,
    .submit-btn {
      width: 100%;
    }
  }
</style>
