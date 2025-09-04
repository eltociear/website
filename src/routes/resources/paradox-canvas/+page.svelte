<script>
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let canvasData = {
    coreParadox: '',
    poleA: '',
    poleB: '',
    sharedAim: '',
    thirdWay: '',
    powerChecks: '',
    safeguards: ''
  };

  let currentStep = 1;
  const totalSteps = 4;
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  function nextStep() {
    if (currentStep < totalSteps) currentStep++;
  }

  function prevStep() {
    if (currentStep > 1) currentStep--;
  }

  function exportCanvas() {
    const currentLocale = $locale || 'en';
    
    // Use the reactive canvasData instead of trying to read from DOM
    const exportData = {
      coreParadox: canvasData.coreParadox || '',
      poleA: canvasData.poleA || '',
      poleB: canvasData.poleB || '',
      sharedAim: canvasData.sharedAim || '',
      thirdWay: canvasData.thirdWay || '',
      powerChecks: canvasData.powerChecks || '',
      safeguards: canvasData.safeguards || ''
    };

    // Create a formatted text version
    const exportText = `
  PARADOX DECISION CANVAS
  Generated on: ${new Date().toLocaleDateString()}

  CORE PARADOX/TENSION:
  ${exportData.coreParadox || 'Not filled in'}

  POLE A:
  ${exportData.poleA || 'Not filled in'}

  POLE B:
  ${exportData.poleB || 'Not filled in'}

  SHARED DEEPER GOAL:
  ${exportData.sharedAim || 'Not filled in'}

  THIRD WAY SOLUTION:
  ${exportData.thirdWay || 'Not filled in'}

  POWER ANALYSIS:
  ${exportData.powerChecks || 'Not filled in'}

  SAFEGUARDS:
  ${exportData.safeguards || 'Not filled in'}

  ---
  Generated with the Paradox Decision Canvas
  Global Governance Frameworks - globalgovernanceframeworks.org
    `.trim();

    // Option 1: Download as text file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `paradox-canvas-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Option 2: Print version (opens print dialog)
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Paradox Decision Canvas</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 40px auto; 
            padding: 20px;
            color: #374151;
          }
          h1 { 
            color: #1e293b; 
            border-bottom: 3px solid #6366f1; 
            padding-bottom: 10px; 
            margin-bottom: 30px;
          }
          h2 { 
            color: #374151; 
            margin-top: 30px; 
            margin-bottom: 10px; 
            font-size: 1.2rem;
            font-weight: 600;
          }
          .section { 
            margin-bottom: 25px; 
            padding: 15px 20px; 
            background: #f8fafc; 
            border-left: 4px solid #6366f1;
            border-radius: 0 8px 8px 0;
          }
          .content { 
            white-space: pre-wrap; 
            font-size: 1rem;
            line-height: 1.6;
            margin-top: 8px;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 0.9em; 
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .poles-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
          }
          .pole-section {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
          }
          @media print {
            body { margin: 20px; }
            .section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>Paradox Decision Canvas</h1>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
        
        <div class="section">
          <h2>Core Paradox/Tension</h2>
          <div class="content">${exportData.coreParadox || 'Not filled in'}</div>
        </div>
        
        <div class="section">
          <h2>Competing Positions</h2>
          <div class="poles-grid">
            <div class="pole-section">
              <h3 style="margin-top: 0; color: #6366f1;">Position A</h3>
              <div class="content">${exportData.poleA || 'Not filled in'}</div>
            </div>
            <div class="pole-section">
              <h3 style="margin-top: 0; color: #d97706;">Position B</h3>
              <div class="content">${exportData.poleB || 'Not filled in'}</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Shared Deeper Goal</h2>
          <div class="content">${exportData.sharedAim || 'Not filled in'}</div>
        </div>
        
        <div class="section">
          <h2>Third Way Solution</h2>
          <div class="content">${exportData.thirdWay || 'Not filled in'}</div>
        </div>
        
        <div class="section">
          <h2>Power Analysis</h2>
          <div class="content">${exportData.powerChecks || 'Not filled in'}</div>
        </div>
        
        <div class="section">
          <h2>Safeguards</h2>
          <div class="content">${exportData.safeguards || 'Not filled in'}</div>
        </div>
        
        <div class="footer">
          Generated with the Paradox Decision Canvas<br>
          Global Governance Frameworks - globalgovernanceframeworks.org
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  function resetCanvas() {
    canvasData = {
      coreParadox: '',
      poleA: '',
      poleB: '',
      sharedAim: '',
      thirdWay: '',
      powerChecks: '',
      safeguards: ''
    };
    currentStep = 1;
    
    // Force update of any bound input elements
    if (browser) {
      // Optional: Clear any DOM elements if needed for backup
      const inputs = ['coreParadox', 'poleA', 'poleB', 'sharedAim', 'thirdWay', 'powerChecks', 'safeguards'];
      inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
      });
    }
  }

  function exportTemplate() {
    const currentLocale = $locale || 'en';
    
    // Create template version with blank fields instead of "Not filled in"
    const templateText = `
  PARADOX DECISION CANVAS
  Template Version

  CORE PARADOX/TENSION:
  _____________________________________________________________________________
  _____________________________________________________________________________
  _____________________________________________________________________________

  POLE A:
  _____________________________________________________________________________
  _____________________________________________________________________________
  _____________________________________________________________________________

  POLE B:
  _____________________________________________________________________________
  _____________________________________________________________________________
  _____________________________________________________________________________

  SHARED DEEPER GOAL:
  _____________________________________________________________________________
  _____________________________________________________________________________
  _____________________________________________________________________________

  THIRD WAY SOLUTION:
  _____________________________________________________________________________
  _____________________________________________________________________________
  _____________________________________________________________________________

  POWER ANALYSIS:
  _____________________________________________________________________________
  _____________________________________________________________________________
  _____________________________________________________________________________

  SAFEGUARDS:
  _____________________________________________________________________________
  _____________________________________________________________________________
  _____________________________________________________________________________

  ---
  Paradox Decision Canvas Template
  Global Governance Frameworks - globalgovernanceframeworks.org
    `.trim();

    // Create template print version
    const printTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Paradox Decision Canvas - Template</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.8; 
            max-width: 800px; 
            margin: 40px auto; 
            padding: 20px;
            color: #374151;
          }
          h1 { 
            color: #1e293b; 
            border-bottom: 3px solid #6366f1; 
            padding-bottom: 10px; 
            margin-bottom: 30px;
            text-align: center;
          }
          h2 { 
            color: #374151; 
            margin-top: 30px; 
            margin-bottom: 15px; 
            font-size: 1.2rem;
            font-weight: 600;
          }
          .section { 
            margin-bottom: 35px; 
            padding: 20px; 
            background: #f8fafc; 
            border-left: 4px solid #6366f1;
            border-radius: 0 8px 8px 0;
            min-height: 120px;
          }
          .fill-area {
            border-bottom: 1px solid #cbd5e1;
            min-height: 25px;
            margin-bottom: 8px;
            width: 100%;
          }
          .poles-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
          }
          .pole-section {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            min-height: 120px;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 0.9em; 
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .template-note {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 30px;
            text-align: center;
            font-style: italic;
          }
          @media print {
            body { margin: 20px; font-size: 12pt; }
            .section { break-inside: avoid; }
            .template-note { background: #f9f9f9; }
          }
        </style>
      </head>
      <body>
        <div class="template-note">
          <strong>Instructions:</strong> Print this template and fill in by hand, or use it as a guide for digital completion at globalgovernanceframeworks.org/paradox-canvas
        </div>
        
        <h1>Paradox Decision Canvas</h1>
        <p><strong>Date:</strong> ________________ <strong>Facilitator:</strong> ________________</p>
        
        <div class="section">
          <h2>Core Paradox/Tension</h2>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
        </div>
        
        <div class="section">
          <h2>Competing Positions</h2>
          <div class="poles-grid">
            <div class="pole-section">
              <h3 style="margin-top: 0; color: #6366f1;">Position A</h3>
              <div class="fill-area"></div>
              <div class="fill-area"></div>
              <div class="fill-area"></div>
              <div class="fill-area"></div>
            </div>
            <div class="pole-section">
              <h3 style="margin-top: 0; color: #d97706;">Position B</h3>
              <div class="fill-area"></div>
              <div class="fill-area"></div>
              <div class="fill-area"></div>
              <div class="fill-area"></div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Shared Deeper Goal</h2>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
        </div>
        
        <div class="section">
          <h2>Third Way Solution</h2>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
        </div>
        
        <div class="section">
          <h2>Power Analysis</h2>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
        </div>
        
        <div class="section">
          <h2>Safeguards</h2>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
          <div class="fill-area"></div>
        </div>
        
        <div class="footer">
          Paradox Decision Canvas Template<br>
          Global Governance Frameworks - globalgovernanceframeworks.org
        </div>
      </body>
      </html>
    `;

    // Open print dialog for template
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printTemplate);
    printWindow.document.close();
    printWindow.print();
  }

  // Add this button to your UI
  function addTemplateButton() {
    return `
      <button on:click={exportTemplate} class="action-button primary">
        <span class="button-icon">📄</span>
        Export Blank Template
      </button>
    `;
  }

  $: stepConfig = [
    {
      number: 1,
      title: $t('resourcesParadoxCanvas.steps.mapPoles.title'),
      icon: '🗺️'
    },
    {
      number: 2,
      title: $t('resourcesParadoxCanvas.steps.sharedAim.title'),
      icon: '🎯'
    },
    {
      number: 3,
      title: $t('resourcesParadoxCanvas.steps.thirdWay.title'),
      icon: '💡'
    },
    {
      number: 4,
      title: $t('resourcesParadoxCanvas.steps.powerProof.title'),
      icon: '⚖️'
    }
  ];
</script>

<svelte:head>
  <title>{$t('resourcesParadoxCanvas.meta.title')}</title>
  <meta name="description" content="{$t('resourcesParadoxCanvas.meta.description')}" />
  <meta property="og:title" content="{$t('resourcesParadoxCanvas.meta.title')}" />
  <meta property="og:description" content="{$t('resourcesParadoxCanvas.meta.description')}" />
  <meta property="og:type" content="website" />
</svelte:head>

{#if mounted}
  <div class="canvas-page">
    <div class="breadcrumb-nav">
      <a href="/resources" class="breadcrumb-link">
        <span class="breadcrumb-icon">←</span>
        <span class="breadcrumb-text">{$t('resourcesParadoxCanvas.navigation.backToResources')}</span>
      </a>
    </div>

    <div class="canvas-header">
      <h1>{$t('resourcesParadoxCanvas.header.title')}</h1>
      <p class="header-subtitle">{$t('resourcesParadoxCanvas.header.subtitle')}</p>
      <p class="header-description">{$t('resourcesParadoxCanvas.header.description')}</p>
    </div>

    <div class="canvas-container">
      <div class="steps-sidebar">
        <div class="step-indicator">
          {#each stepConfig as step}
            <div class="step" 
                 class:active={currentStep === step.number} 
                 class:completed={currentStep > step.number}>
              <span class="step-icon">{step.icon}</span>
              <div class="step-info">
                <span class="step-number">{step.number}</span>
                <span class="step-title">{step.title}</span>
              </div>
            </div>
          {/each}
        </div>

        <div class="sidebar-actions">
          <button on:click={exportTemplate} class="action-button primary">
            <span class="button-icon">📄</span>
            Export Blank Template
          </button>
          <button on:click={resetCanvas} class="action-button secondary">
            <span class="button-icon">🔄</span>
            {$t('resourcesParadoxCanvas.actions.reset')}
          </button>
        </div>
      </div>

      <div class="canvas-content">
        {#if currentStep === 1}
          <div class="step-content">
            <h2>{$t('resourcesParadoxCanvas.steps.mapPoles.title')}</h2>
            <p class="step-description">{$t('resourcesParadoxCanvas.steps.mapPoles.description')}</p>
            
            <div class="input-group">
              <label for="coreParadox">{$t('resourcesParadoxCanvas.steps.mapPoles.coreParadox.label')}</label>
              <textarea id="coreParadox" 
                       bind:value={canvasData.coreParadox} 
                       placeholder="{$t('resourcesParadoxCanvas.steps.mapPoles.coreParadox.placeholder')}"></textarea>
            </div>

            <div class="poles-container">
              <div class="pole-input">
                <label for="poleA">{$t('resourcesParadoxCanvas.steps.mapPoles.poleA.label')}</label>
                <textarea id="poleA" 
                         bind:value={canvasData.poleA} 
                         placeholder="{$t('resourcesParadoxCanvas.steps.mapPoles.poleA.placeholder')}"></textarea>
              </div>

              <div class="pole-input">
                <label for="poleB">{$t('resourcesParadoxCanvas.steps.mapPoles.poleB.label')}</label>
                <textarea id="poleB" 
                         bind:value={canvasData.poleB} 
                         placeholder="{$t('resourcesParadoxCanvas.steps.mapPoles.poleB.placeholder')}"></textarea>
              </div>
            </div>
          </div>

        {:else if currentStep === 2}
          <div class="step-content">
            <h2>{$t('resourcesParadoxCanvas.steps.sharedAim.title')}</h2>
            <p class="step-description">{$t('resourcesParadoxCanvas.steps.sharedAim.description')}</p>
            
            <div class="input-group">
              <label for="sharedAim">{$t('resourcesParadoxCanvas.steps.sharedAim.label')}</label>
              <textarea id="sharedAim" 
                       bind:value={canvasData.sharedAim} 
                       placeholder="{$t('resourcesParadoxCanvas.steps.sharedAim.placeholder')}"></textarea>
            </div>

            <div class="help-section">
              <h3>{$t('resourcesParadoxCanvas.steps.sharedAim.helpTitle')}</h3>
              <ul>
                <li>{$t('resourcesParadoxCanvas.steps.sharedAim.helpTips.tip1')}</li>
                <li>{$t('resourcesParadoxCanvas.steps.sharedAim.helpTips.tip2')}</li>
                <li>{$t('resourcesParadoxCanvas.steps.sharedAim.helpTips.tip3')}</li>
              </ul>
            </div>
          </div>

        {:else if currentStep === 3}
          <div class="step-content">
            <h2>{$t('resourcesParadoxCanvas.steps.thirdWay.title')}</h2>
            <p class="step-description">{$t('resourcesParadoxCanvas.steps.thirdWay.description')}</p>
            
            <div class="input-group">
              <label for="thirdWay">{$t('resourcesParadoxCanvas.steps.thirdWay.label')}</label>
              <textarea id="thirdWay" 
                       bind:value={canvasData.thirdWay} 
                       placeholder="{$t('resourcesParadoxCanvas.steps.thirdWay.placeholder')}"></textarea>
            </div>

            <div class="help-section">
              <h3>{$t('resourcesParadoxCanvas.steps.thirdWay.helpTitle')}</h3>
              <ul>
                <li>{$t('resourcesParadoxCanvas.steps.thirdWay.helpTips.tip1')}</li>
                <li>{$t('resourcesParadoxCanvas.steps.thirdWay.helpTips.tip2')}</li>
                <li>{$t('resourcesParadoxCanvas.steps.thirdWay.helpTips.tip3')}</li>
              </ul>
            </div>
          </div>

        {:else if currentStep === 4}
          <div class="step-content">
            <h2>{$t('resourcesParadoxCanvas.steps.powerProof.title')}</h2>
            <p class="step-description">{$t('resourcesParadoxCanvas.steps.powerProof.description')}</p>
            
            <div class="input-group">
              <label for="powerChecks">{$t('resourcesParadoxCanvas.steps.powerProof.powerChecks.label')}</label>
              <textarea id="powerChecks" 
                       bind:value={canvasData.powerChecks} 
                       placeholder="{$t('resourcesParadoxCanvas.steps.powerProof.powerChecks.placeholder')}"></textarea>
            </div>

            <div class="input-group">
              <label for="safeguards">{$t('resourcesParadoxCanvas.steps.powerProof.safeguards.label')}</label>
              <textarea id="safeguards" 
                       bind:value={canvasData.safeguards} 
                       placeholder="{$t('resourcesParadoxCanvas.steps.powerProof.safeguards.placeholder')}"></textarea>
            </div>

            <div class="help-section">
              <h3>{$t('resourcesParadoxCanvas.steps.powerProof.helpTitle')}</h3>
              <ul>
                <li>{$t('resourcesParadoxCanvas.steps.powerProof.helpTips.tip1')}</li>
                <li>{$t('resourcesParadoxCanvas.steps.powerProof.helpTips.tip2')}</li>
                <li>{$t('resourcesParadoxCanvas.steps.powerProof.helpTips.tip3')}</li>
              </ul>
            </div>
          </div>
        {/if}

        <div class="navigation-buttons">
          {#if currentStep > 1}
            <button on:click={prevStep} class="nav-button secondary">
              ← {$t('resourcesParadoxCanvas.navigation.previous')}
            </button>
          {/if}
          
          {#if currentStep < totalSteps}
            <button on:click={nextStep} class="nav-button primary">
              {$t('resourcesParadoxCanvas.navigation.next')} →
            </button>
          {:else}
            <button on:click={exportCanvas} class="nav-button success">
              <span class="button-icon">📥</span>
              {$t('resourcesParadoxCanvas.navigation.export')}
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Canvas Output (for export) -->
    <div id="canvas-output" class="canvas-output">
      <h2>{$t('resourcesParadoxCanvas.output.title')}</h2>
      <div class="output-section">
        <h3>{$t('resourcesParadoxCanvas.output.coreParadox')}</h3>
        <p>{canvasData.coreParadox || $t('resourcesParadoxCanvas.output.notFilled')}</p>
      </div>
      <div class="output-section">
        <h3>{$t('resourcesParadoxCanvas.output.poles')}</h3>
        <div class="poles-output">
          <div>
            <h4>{$t('resourcesParadoxCanvas.output.poleA')}</h4>
            <p>{canvasData.poleA || $t('resourcesParadoxCanvas.output.notFilled')}</p>
          </div>
          <div>
            <h4>{$t('resourcesParadoxCanvas.output.poleB')}</h4>
            <p>{canvasData.poleB || $t('resourcesParadoxCanvas.output.notFilled')}</p>
          </div>
        </div>
      </div>
      <div class="output-section">
        <h3>{$t('resourcesParadoxCanvas.output.sharedAim')}</h3>
        <p>{canvasData.sharedAim || $t('resourcesParadoxCanvas.output.notFilled')}</p>
      </div>
      <div class="output-section">
        <h3>{$t('resourcesParadoxCanvas.output.thirdWay')}</h3>
        <p>{canvasData.thirdWay || $t('resourcesParadoxCanvas.output.notFilled')}</p>
      </div>
      <div class="output-section">
        <h3>{$t('resourcesParadoxCanvas.output.powerAnalysis')}</h3>
        <p>{canvasData.powerChecks || $t('resourcesParadoxCanvas.output.notFilled')}</p>
      </div>
      <div class="output-section">
        <h3>{$t('resourcesParadoxCanvas.output.safeguards')}</h3>
        <p>{canvasData.safeguards || $t('resourcesParadoxCanvas.output.notFilled')}</p>
      </div>
    </div>
  </div>
{:else}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{$t('resourcesParadoxCanvas.loading.text')}</p>
  </div>
{/if}

<style>
  /* Canvas page styling */
  .canvas-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .breadcrumb-nav {
    margin-bottom: 1.5rem;
    padding: 0.75rem 0;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
  }

  .breadcrumb-link:hover {
    color: #4f46e5;
    transform: translateX(-2px);
  }

  .canvas-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .canvas-header h1 {
    font-size: 2.5rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  .header-subtitle {
    font-size: 1.25rem;
    color: #64748b;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .header-description {
    font-size: 1rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .canvas-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 3rem;
    align-items: start;
  }

  .steps-sidebar {
    position: sticky;
    top: 2rem;
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  .step-indicator {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    transition: all 0.3s;
    border: 2px solid transparent;
  }

  .step.active {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-color: #6366f1;
  }

  .step.completed {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border-color: #10b981;
  }

  .step-icon {
    font-size: 1.5rem;
  }

  .step-info {
    display: flex;
    flex-direction: column;
  }

  .step-number {
    font-size: 0.875rem;
    font-weight: 600;
    opacity: 0.8;
  }

  .step-title {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .sidebar-actions {
    border-top: 1px solid #e2e8f0;
    padding-top: 1rem;
  }

  .canvas-content {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  .step-content h2 {
    font-size: 1.75rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .step-description {
    color: #64748b;
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  .input-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
    font-size: 1rem;
  }

  .input-group textarea {
    width: 100%;
    min-height: 120px;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
  }

  .input-group textarea:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .poles-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .help-section {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-top: 2rem;
    border-left: 4px solid #6366f1;
  }

  .help-section h3 {
    color: #1e293b;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .help-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .help-section li {
    color: #475569;
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;
    line-height: 1.5;
  }

  .help-section li::before {
    content: "💡";
    position: absolute;
    left: 0;
    top: 0;
  }

  .navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
  }

  .nav-button, .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }

  .nav-button.primary, .action-button.primary {
    background: #6366f1;
    color: white;
  }

  .nav-button.secondary, .action-button.secondary {
    background: #6b7280;
    color: white;
  }

  .nav-button.success {
    background: #10b981;
    color: white;
  }

  .nav-button:hover, .action-button:hover {
    transform: translateY(-1px);
  }

  .nav-button.primary:hover {
    background: #5b5bd6;
  }

  .nav-button.secondary:hover, .action-button.secondary:hover {
    background: #4b5563;
  }

  .nav-button.success:hover {
    background: #059669;
  }

  .button-icon {
    font-size: 1rem;
  }

  .canvas-output {
    display: none;
    margin-top: 3rem;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
  }

  .output-section {
    margin-bottom: 2rem;
  }

  .output-section h3 {
    color: #1e293b;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .output-section h4 {
    color: #374151;
    margin-bottom: 0.25rem;
    font-weight: 500;
  }

  .poles-output {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 1rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* Enhanced styling for pole containers */
  .poles-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 1.5rem;
  }

  .pole-input {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(217, 119, 6, 0.05));
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
  }

  .pole-input:hover {
      border-color: #6366f1;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
      transform: translateY(-2px);
  }

  .pole-input:focus-within {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  /* Add visual indicators for pole sides */
  .pole-input:first-child::before {
      content: "A";
      position: absolute;
      top: -10px;
      left: 20px;
      background: #6366f1;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.875rem;
  }

  .pole-input:last-child::before {
      content: "B";
      position: absolute;
      top: -10px;
      left: 20px;
      background: #d97706;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.875rem;
  }

  .pole-input label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #374151;
      font-size: 1rem;
      margin-top: 0.5rem;
  }

  .pole-input textarea {
      width: 100%;
      min-height: 120px;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      resize: vertical;
      font-family: inherit;
      line-height: 1.5;
      background: white;
      transition: border-color 0.2s;
  }

  .pole-input textarea:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }

  /* Enhanced input group styling */
  .input-group {
      margin-bottom: 2rem;
      background: rgba(248, 250, 252, 0.8);
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 1.5rem;
      transition: all 0.3s ease;
  }

  .input-group:hover {
      background: rgba(248, 250, 252, 1);
      border-color: #cbd5e1;
  }

  .input-group:focus-within {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .input-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #374151;
      font-size: 1.05rem;
  }

  .input-group textarea {
      width: 100%;
      min-height: 140px;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      resize: vertical;
      font-family: inherit;
      line-height: 1.6;
      background: white;
      transition: border-color 0.2s;
  }

  .input-group textarea:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .sidebar-actions {
    border-top: 1px solid #e2e8f0;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .nav-button, .action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
    text-align: center;
    min-height: 44px;
    white-space: nowrap;
  }

  .nav-button.primary, .action-button.primary {
    background: #6366f1;
    color: white;
  }

  .nav-button.secondary, .action-button.secondary {
    background: #6b7280;
    color: white;
  }

  .nav-button.success {
    background: #10b981;
    color: white;
  }

  .nav-button:hover, .action-button:hover {
    transform: translateY(-1px);
  }

  .nav-button.primary:hover, .action-button.primary:hover {
    background: #5b5bd6;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  }

  .nav-button.secondary:hover, .action-button.secondary:hover {
    background: #4b5563;
    box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
  }

  .nav-button.success:hover {
    background: #059669;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .button-icon {
    font-size: 1rem;
  }

  /* Responsive fixes */
  @media (max-width: 768px) {
      .poles-container {
          grid-template-columns: 1fr;
          gap: 1.5rem;
      }
      
      .pole-input,
      .input-group {
          padding: 1rem;
      }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive design */
  @media (max-width: 1024px) {
    .canvas-container {
      grid-template-columns: 280px 1fr;
    }
  }

  @media (max-width: 768px) {
    .canvas-container {
      grid-template-columns: 1fr;
    }

    .steps-sidebar {
      position: static;
    }

    .step-indicator {
      flex-direction: row;
      overflow-x: auto;
      margin-bottom: 1rem;
    }

    .step {
      min-width: 200px;
    }

    .poles-container, .poles-output {
      grid-template-columns: 1fr;
    }

    .navigation-buttons {
      flex-direction: column;
      gap: 1rem;
    }

    .canvas-header h1 {
      font-size: 2rem;
    }
  }
</style>
