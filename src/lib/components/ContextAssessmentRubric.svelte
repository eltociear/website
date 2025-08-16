<!-- src/lib/components/ContextAssessmentRubric.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';
  
  const dispatch = createEventDispatcher();
  
  // Assessment state
  let currentStep = 0;
  let responses = {
    governanceMaturity: null,
    conflictIntensity: null,
    resourceAvailability: null,
    culturalCoherence: null,
    digitalAccess: null,
    scale: null,
    urgency: null,
    primaryTradition: null
  };

  // Assessment questions with culturally sensitive options
  const assessmentSteps = [
    {
      id: 'governance-maturity',
      titleKey: 'assessment.steps.governanceMaturity.title',
      title: 'Governance Maturity',
      descriptionKey: 'assessment.steps.governanceMaturity.description',
      description: 'How developed are your current governance systems?',
      field: 'governanceMaturity',
      options: [
        {
          value: 'emerging',
          labelKey: 'assessment.options.governanceMaturity.emerging.label',
          label: 'Emerging',
          descriptionKey: 'assessment.options.governanceMaturity.emerging.description',
          description: 'Just starting to organize or reform governance systems'
        },
        {
          value: 'developing',
          labelKey: 'assessment.options.governanceMaturity.developing.label',
          label: 'Developing',
          descriptionKey: 'assessment.options.governanceMaturity.developing.description',
          description: 'Have basic governance structures, seeking improvement'
        },
        {
          value: 'established',
          labelKey: 'assessment.options.governanceMaturity.established.label',
          label: 'Established',
          descriptionKey: 'assessment.options.governanceMaturity.established.description',
          description: 'Functioning governance systems, looking to enhance'
        },
        {
          value: 'advanced',
          labelKey: 'assessment.options.governanceMaturity.advanced.label',
          label: 'Advanced',
          descriptionKey: 'assessment.options.governanceMaturity.advanced.description',
          description: 'Sophisticated systems, pioneering new approaches'
        }
      ]
    },
    {
      id: 'conflict-intensity',
      titleKey: 'assessment.steps.conflictIntensity.title',
      title: 'Conflict Intensity',
      descriptionKey: 'assessment.steps.conflictIntensity.description',
      description: 'What level of conflict or tension exists in your context?',
      field: 'conflictIntensity',
      options: [
        {
          value: 'low',
          labelKey: 'assessment.options.conflictIntensity.low.label',
          label: 'Low',
          descriptionKey: 'assessment.options.conflictIntensity.low.description',
          description: 'Peaceful environment with minor disagreements'
        },
        {
          value: 'moderate',
          labelKey: 'assessment.options.conflictIntensity.moderate.label',
          label: 'Moderate',
          descriptionKey: 'assessment.options.conflictIntensity.moderate.description',
          description: 'Some tension and polarization, but manageable'
        },
        {
          value: 'high',
          labelKey: 'assessment.options.conflictIntensity.high.label',
          label: 'High',
          descriptionKey: 'assessment.options.conflictIntensity.high.description',
          description: 'Significant tensions, divisions, or ongoing disputes'
        },
        {
          value: 'crisis',
          labelKey: 'assessment.options.conflictIntensity.crisis.label',
          label: 'Crisis',
          descriptionKey: 'assessment.options.conflictIntensity.crisis.description',
          description: 'Active conflict, emergency, or breakdown of systems'
        }
      ]
    },
    {
      id: 'resource-availability',
      titleKey: 'assessment.steps.resourceAvailability.title',
      title: 'Resource Availability',
      descriptionKey: 'assessment.steps.resourceAvailability.description',
      description: 'What resources do you have available for implementation?',
      field: 'resourceAvailability',
      options: [
        {
          value: 'minimal',
          labelKey: 'assessment.options.resourceAvailability.minimal.label',
          label: 'Minimal',
          descriptionKey: 'assessment.options.resourceAvailability.minimal.description',
          description: 'Volunteer time and community goodwill mainly'
        },
        {
          value: 'limited',
          labelKey: 'assessment.options.resourceAvailability.limited.label',
          label: 'Limited',
          descriptionKey: 'assessment.options.resourceAvailability.limited.description',
          description: 'Some funding, part-time coordination capacity'
        },
        {
          value: 'moderate',
          labelKey: 'assessment.options.resourceAvailability.moderate.label',
          label: 'Moderate',
          descriptionKey: 'assessment.options.resourceAvailability.moderate.description',
          description: 'Dedicated staff, modest budget, basic infrastructure'
        },
        {
          value: 'substantial',
          labelKey: 'assessment.options.resourceAvailability.substantial.label',
          label: 'Substantial',
          descriptionKey: 'assessment.options.resourceAvailability.substantial.description',
          description: 'Significant funding, skilled team, established systems'
        }
      ]
    },
    {
      id: 'cultural-coherence',
      titleKey: 'assessment.steps.culturalCoherence.title',
      title: 'Cultural Coherence',
      descriptionKey: 'assessment.steps.culturalCoherence.description',
      description: 'How aligned is your community around shared values and practices?',
      field: 'culturalCoherence',
      options: [
        {
          value: 'diverse',
          labelKey: 'assessment.options.culturalCoherence.diverse.label',
          label: 'Highly Diverse',
          descriptionKey: 'assessment.options.culturalCoherence.diverse.description',
          description: 'Many different cultural backgrounds and traditions'
        },
        {
          value: 'mixed',
          labelKey: 'assessment.options.culturalCoherence.mixed.label',
          label: 'Mixed',
          descriptionKey: 'assessment.options.culturalCoherence.mixed.description',
          description: 'Some shared values with notable differences'
        },
        {
          value: 'aligned',
          labelKey: 'assessment.options.culturalCoherence.aligned.label',
          label: 'Well Aligned',
          descriptionKey: 'assessment.options.culturalCoherence.aligned.description',
          description: 'Strong shared values and cultural practices'
        },
        {
          value: 'cohesive',
          labelKey: 'assessment.options.culturalCoherence.cohesive.label',
          label: 'Highly Cohesive',
          descriptionKey: 'assessment.options.culturalCoherence.cohesive.description',
          description: 'Deep cultural unity and shared worldview'
        }
      ]
    },
    {
      id: 'digital-access',
      titleKey: 'assessment.steps.digitalAccess.title',
      title: 'Digital Access',
      descriptionKey: 'assessment.steps.digitalAccess.description',
      description: 'What level of digital technology access does your community have?',
      field: 'digitalAccess',
      options: [
        {
          value: 'none',
          labelKey: 'assessment.options.digitalAccess.none.label',
          label: 'Minimal/None',
          descriptionKey: 'assessment.options.digitalAccess.none.description',
          description: 'Limited internet, mostly analog communication'
        },
        {
          value: 'basic',
          labelKey: 'assessment.options.digitalAccess.basic.label',
          label: 'Basic',
          descriptionKey: 'assessment.options.digitalAccess.basic.description',
          description: 'Mobile phones, occasional internet access'
        },
        {
          value: 'moderate',
          labelKey: 'assessment.options.digitalAccess.moderate.label',
          label: 'Moderate',
          descriptionKey: 'assessment.options.digitalAccess.moderate.description',
          description: 'Regular internet, some digital tools'
        },
        {
          value: 'high',
          labelKey: 'assessment.options.digitalAccess.high.label',
          label: 'High',
          descriptionKey: 'assessment.options.digitalAccess.high.description',
          description: 'Reliable broadband, digital literacy, tech resources'
        }
      ]
    },
    {
      id: 'scale',
      titleKey: 'assessment.steps.scale.title',
      title: 'Scale of Initiative',
      descriptionKey: 'assessment.steps.scale.description',
      description: 'What is the geographic or population scale of your initiative?',
      field: 'scale',
      options: [
        {
          value: 'local',
          labelKey: 'assessment.options.scale.local.label',
          label: 'Local',
          descriptionKey: 'assessment.options.scale.local.description',
          description: 'Community, neighborhood, or small town level'
        },
        {
          value: 'municipal',
          labelKey: 'assessment.options.scale.municipal.label',
          label: 'Municipal',
          descriptionKey: 'assessment.options.scale.municipal.description',
          description: 'City or municipal government level'
        },
        {
          value: 'regional',
          labelKey: 'assessment.options.scale.regional.label',
          label: 'Regional',
          descriptionKey: 'assessment.options.scale.regional.description',
          description: 'State, province, or bioregional level'
        },
        {
          value: 'national',
          labelKey: 'assessment.options.scale.national.label',
          label: 'National',
          descriptionKey: 'assessment.options.scale.national.description',
          description: 'Country or nation-state level'
        },
        {
          value: 'international',
          labelKey: 'assessment.options.scale.international.label',
          label: 'International',
          descriptionKey: 'assessment.options.scale.international.description',
          description: 'Multi-national or global initiative'
        }
      ]
    }
  ];

  $: currentStepData = assessmentSteps[currentStep];
  $: isComplete = currentStep >= assessmentSteps.length;
  $: canProceed = responses[currentStepData?.field] !== null;

  function selectOption(value) {
    responses[currentStepData.field] = value;
  }

  function nextStep() {
    if (currentStep < assessmentSteps.length - 1) {
      currentStep++;
    } else {
      completeAssessment();
    }
  }

  function previousStep() {
    if (currentStep > 0) {
      currentStep--;
    }
  }

  function completeAssessment() {
    dispatch('complete', responses);
  }

  function restartAssessment() {
    currentStep = 0;
    responses = {
      governanceMaturity: null,
      conflictIntensity: null,
      resourceAvailability: null,
      culturalCoherence: null,
      digitalAccess: null,
      scale: null
    };
  }
</script>

<div class="assessment-container">
  {#if !isComplete}
    <!-- Progress Bar -->
    <div class="progress-section">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          style="width: {((currentStep + 1) / assessmentSteps.length) * 100}%"
        ></div>
      </div>
      <div class="progress-text">
        {$t('assessment.progress', 'Step {current} of {total}', { 
          current: currentStep + 1, 
          total: assessmentSteps.length 
        })}
      </div>
    </div>

    <!-- Question Section -->
    <div class="question-section">
      <div class="question-header">
        <h3 class="question-title">
          {$t(currentStepData.titleKey, currentStepData.title)}
        </h3>
        <p class="question-description">
          {$t(currentStepData.descriptionKey, currentStepData.description)}
        </p>
      </div>

      <!-- Options -->
      <div class="options-grid">
        {#each currentStepData.options as option}
          <button
            class="option-card"
            class:selected={responses[currentStepData.field] === option.value}
            on:click={() => selectOption(option.value)}
          >
            <div class="option-header">
              <h4 class="option-label">
                {$t(option.labelKey, option.label)}
              </h4>
              {#if responses[currentStepData.field] === option.value}
                <div class="selected-indicator">✓</div>
              {/if}
            </div>
            <p class="option-description">
              {$t(option.descriptionKey, option.description)}
            </p>
          </button>
        {/each}
      </div>

      <!-- Navigation -->
      <div class="navigation-section">
        <button 
          class="nav-button secondary"
          class:disabled={currentStep === 0}
          on:click={previousStep}
          disabled={currentStep === 0}
        >
          ← {$t('common.ui.previous', 'Previous')}
        </button>

        <button 
          class="nav-button primary"
          class:disabled={!canProceed}
          on:click={nextStep}
          disabled={!canProceed}
        >
          {#if currentStep === assessmentSteps.length - 1}
            {$t('assessment.complete', 'Complete Assessment')} ✓
          {:else}
            {$t('common.ui.next', 'Next')} →
          {/if}
        </button>
      </div>
    </div>

    <!-- Cultural Sensitivity Notice -->
    <div class="cultural-notice">
      <div class="notice-icon">🌍</div>
      <div class="notice-content">
        <h4>{$t('assessment.culturalNotice.title', 'Cultural Sensitivity')}</h4>
        <p>{$t('assessment.culturalNotice.description', 'This assessment adapts to different cultural contexts. All governance traditions are equally valid, and recommendations will respect your community\'s values and practices.')}</p>
      </div>
    </div>

  {:else}
    <!-- Assessment Complete -->
    <div class="completion-section">
      <div class="completion-header">
        <div class="completion-icon">🎯</div>
        <h3>{$t('assessment.completion.title', 'Assessment Complete!')}</h3>
        <p>{$t('assessment.completion.description', 'Based on your responses, we\'ll recommend the most suitable tools and implementation approach for your context.')}</p>
      </div>

      <div class="results-preview">
        <h4>{$t('assessment.completion.yourResponses', 'Your Context Profile:')}</h4>
        <div class="response-grid">
          {#each assessmentSteps as step}
            <div class="response-item">
              <span class="response-label">{$t(step.titleKey, step.title)}:</span>
              <span class="response-value">{responses[step.field]}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="completion-actions">
        <button class="primary-action" on:click={completeAssessment}>
          {$t('assessment.completion.viewRecommendations', 'View Recommendations')} →
        </button>
        <button class="secondary-action" on:click={restartAssessment}>
          {$t('assessment.completion.retake', 'Retake Assessment')}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .assessment-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  /* Progress Section */
  .progress-section {
    margin-bottom: 2rem;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #f1f5f9;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  /* Question Section */
  .question-section {
    margin-bottom: 2rem;
  }

  .question-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .question-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }

  .question-description {
    font-size: 1rem;
    color: #64748b;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }

  /* Options */
  .options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .option-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    display: block;
    width: 100%;
  }

  .option-card:hover {
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .option-card.selected {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .option-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .option-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .selected-indicator {
    width: 24px;
    height: 24px;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .option-description {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.5;
    margin: 0;
  }

  .option-card.selected .option-description {
    color: #0369a1;
  }

  /* Navigation */
  .navigation-section {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .nav-button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-size: 1rem;
    min-width: 120px;
  }

  .nav-button.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
  }

  .nav-button.primary:hover:not(.disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .nav-button.secondary {
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
  }

  .nav-button.secondary:hover:not(.disabled) {
    background: #e2e8f0;
  }

  .nav-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Cultural Notice */
  .cultural-notice {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    border: 1px solid #bbf7d0;
    border-radius: 0.75rem;
    margin-top: 2rem;
  }

  .notice-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .notice-content h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #166534;
    margin-bottom: 0.5rem;
  }

  .notice-content p {
    font-size: 0.875rem;
    color: #166534;
    line-height: 1.5;
    margin: 0;
  }

  /* Completion Section */
  .completion-section {
    text-align: center;
  }

  .completion-header {
    margin-bottom: 2rem;
  }

  .completion-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .completion-header h3 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  .completion-header p {
    font-size: 1.125rem;
    color: #64748b;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }

  .results-preview {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: left;
  }

  .results-preview h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
    text-align: center;
  }

  .response-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  .response-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    background: white;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .response-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .response-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    text-transform: capitalize;
  }

  .completion-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .primary-action, .secondary-action {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-size: 1rem;
  }

  .primary-action {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    color: white;
  }

  .primary-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  }

  .secondary-action {
    background: transparent;
    color: #64748b;
    border: 2px solid #e2e8f0;
  }

  .secondary-action:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .assessment-container {
      padding: 1.5rem;
      margin: 1rem;
    }

    .options-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .option-card {
      padding: 1rem;
    }

    .navigation-section {
      flex-direction: column;
      gap: 0.75rem;
    }

    .nav-button {
      width: 100%;
    }

    .cultural-notice {
      flex-direction: column;
      text-align: center;
    }

    .response-grid {
      grid-template-columns: 1fr;
    }

    .completion-actions {
      flex-direction: column;
      align-items: center;
    }

    .primary-action, .secondary-action {
      width: 100%;
      max-width: 300px;
    }
  }

  @media (max-width: 480px) {
    .assessment-container {
      padding: 1rem;
      margin: 0.5rem;
    }

    .question-title {
      font-size: 1.25rem;
    }

    .question-description {
      font-size: 0.875rem;
    }

    .option-label {
      font-size: 1rem;
    }

    .completion-header h3 {
      font-size: 1.5rem;
    }

    .completion-icon {
      font-size: 3rem;
    }
  }
</style>
