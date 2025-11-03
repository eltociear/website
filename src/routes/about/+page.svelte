<!-- src/routes/about/+page.svelte -->
<script>
  import { t, locale, loadTranslations } from '$lib/i18n';
  import { base } from '$app/paths';
import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let translationsLoaded = false;
onMount(async () => {
    if (browser) {
      // Explicitly load translations for the about page
      await loadTranslations($locale, '/about');
      translationsLoaded = true;
    }
  });
// React to locale changes
  $: if (browser && $locale) {
    loadTranslations($locale, '/about').then(() => {
      translationsLoaded = true;
    });
}

  // Debug logging
  $: if (browser) {
    console.log('About page translations loaded:', translationsLoaded);
console.log('About translations:', $t('about'));
  }
</script>

<svelte:head>
  <title>About - Global Governance Frameworks</title>
  <meta name="description" content="Learn about the Global Governance Frameworks project" />
</svelte:head>

<section style="padding: 3rem 0; background: linear-gradient(to bottom right, #2B4B8C, #6B5CA5); color: white;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
    <div style="max-width: 42rem; margin: 0 auto;">
      <h1 style="font-size: 2.5rem; line-height: 1.2; font-weight: 700; margin-bottom: 1rem;">{$t('about.hero.title')}</h1>
      <p style="font-size: 1.25rem; color: #ffffff;">{$t('about.hero.subtitle')}</p>
    </div>
  </div>

</section>


<section style="padding: 3rem 0; background-color: white;">
  <div style="max-width: 1200px; margin: 0 auto; 
padding: 0 1rem;">
    <div style="max-width: 42rem; margin: 0 auto;">
      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 1rem; color: #2B4B8C;">{$t('about.vision.title')}</h2>
        <p style="margin-bottom: 1.5rem; color: #4b5563; line-height: 1.7;
font-size: 1.125rem;">
          {$t('about.vision.paragraph1')}
        </p>
        <p style="color: #4b5563;
line-height: 1.7; font-size: 1.125rem;">
          {$t('about.vision.paragraph2')}
        </p>
      </div>

      <div style="margin-bottom: 3rem;
background-color: #f0f9ff; border-left: 4px solid #2B4B8C; padding: 1.5rem; border-radius: 0.5rem;">
        <h3 style="font-size: 1.25rem;
font-weight: 600; margin-bottom: 1rem; color: #2B4B8C;">
          📘 {$t('about.globalGovernanceDownload.title')}
        </h3>
        <p style="margin-bottom: 1.5rem; color: #4b5563;
line-height: 1.7; font-size: 1rem;">
          {$t('about.globalGovernanceDownload.description')}
        </p>
        <a 
          href="{base}/Global-Governance-Natural-Steps-Toward-A-Thriving-World.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          style="display: inline-block; background-color: #2B4B8C; color: white; padding: 0.75rem 1.5rem;
border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: background-color 0.2s;" 
          on:mouseover="{e => e.target.style.backgroundColor = '#1e3a6b'}" 
          on:mouseout="{e => e.target.style.backgroundColor = '#2B4B8C'}"
        >
          {$t('about.globalGovernanceDownload.button')}
        </a>
      </div>

      <div style="margin-bottom: 3rem;
background-color: #fef3c7; border-left: 4px solid #DAA520; padding: 1.5rem; border-radius: 0.5rem;">
        <h3 style="font-size: 1.25rem;
font-weight: 600; margin-bottom: 1rem; color: #92400e;">
          📚 {$t('about.moreResources.title')}
        </h3>
        <p style="margin-bottom: 1.5rem; color: #78350f;
line-height: 1.7; font-size: 1rem;">
          {$t('about.moreResources.description')}
        </p>
        <a 
          href="{base}/resources" 
          style="display: inline-block; background-color: #DAA520; color: white; padding: 0.75rem 1.5rem;
border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: background-color 0.2s;" 
          on:mouseover="{e => e.target.style.backgroundColor = '#B8860B'}" 
          on:mouseout="{e => e.target.style.backgroundColor = '#DAA520'}"
        >
          {$t('about.moreResources.button')}
        </a>
      </div>

      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 1rem; color: #2B4B8C;">{$t('about.interconnectedness.title')}</h2>
        <p style="margin-bottom: 1.5rem; color: #4b5563; line-height: 1.7;
font-size: 1.125rem;">
          {$t('about.interconnectedness.paragraph1')}
        </p>
        <p style="margin-bottom: 1.5rem;
color: #4b5563; line-height: 1.7; font-size: 1.125rem;">
          {$t('about.interconnectedness.paragraph2')}
        </p>
        <p style="color: #4b5563;
line-height: 1.7; font-size: 1.125rem;">
          {$t('about.interconnectedness.paragraph3')}
        </p>
      </div>

      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 1rem; color: #2B4B8C;">{$t('about.acceleration.title')}</h2>
        <p style="margin-bottom: 1.5rem; color: #4b5563; line-height: 1.7;
font-size: 1.125rem;">
          {$t('about.acceleration.paragraph1')}
        </p>
        <ul style="margin-bottom: 1.5rem;
padding-left: 1.5rem;">
          {#each $t('about.acceleration.examples') as example}
            <li style="margin-bottom: 1rem;">
              <strong style="color: #2B4B8C;">{example.title}:</strong>
              <span style="color: #4b5563;">{example.description}</span>
            </li>
          {/each}
        </ul>
        <p style="margin-bottom: 1rem; color: #4b5563;
line-height: 1.7; font-size: 1.125rem;">
          {$t('about.acceleration.paragraph2')}
        </p>
        <ul style="padding-left: 1.5rem;">
          {#each $t('about.acceleration.benefits') as benefit}
            <li style="margin-bottom: 0.5rem; color: #4b5563;">{benefit}</li>
          {/each}
        </ul>
      </div>

      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 1rem; color: #2B4B8C;">{$t('about.principles.title')}</h2>
        <ul style="padding-left: 0;">
          {#each $t('about.principles.list') as principle}
            <li style="margin-bottom: 1.5rem; list-style: none;">
              <strong style="color: #2B4B8C; font-size: 1.125rem;">{principle.name}:</strong>
              <span style="color: #4b5563;">{principle.description}</span>
            </li>
          {/each}
        </ul>
      </div>

      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 1rem; color: #2B4B8C;">{$t('about.approach.title')}</h2>
        <p style="margin-bottom: 1rem; color: #4b5563;
line-height: 1.7; font-size: 1.125rem;">
          {$t('about.approach.intro')}
        </p>
        <ul style="padding-left: 1.5rem;">
          {#each $t('about.approach.list') as item}
            <li style="margin-bottom: 0.5rem; color: #4b5563;">{item}</li>
          {/each}
        </ul>
      </div>
      
      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 1rem; color: #2B4B8C;">{$t('about.origins.title')}</h2>
        <p style="margin-bottom: 1.5rem; color: #4b5563; line-height: 1.7;
font-size: 1.125rem;">
          {$t('about.origins.paragraph1')}
        </p>
        <p style="color: #4b5563;
line-height: 1.7; font-size: 1.125rem;">
          {$t('about.origins.paragraph2')}
        </p>
      </div>

      <!-- NEW: Current Reality Section -->
      <div style="margin-bottom: 3rem; background-color: #fef3e2; border-left: 4px solid #f59e0b; padding: 1.5rem; border-radius: 0.5rem;">
        <h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; color: #92400e;">
          {$t('about.currentReality.title')}
        </h2>
        <p style="margin-bottom: 1.5rem; color: #78350f; line-height: 1.7; font-size: 1.125rem;">
          {$t('about.currentReality.paragraph1')}
        </p>
        <p style="margin-bottom: 1.5rem; color: #78350f; line-height: 1.7; font-size: 1.125rem;">
          {$t('about.currentReality.paragraph2')}
        </p>
        <p style="color: #78350f; line-height: 1.7; font-size: 1.125rem;">
          {$t('about.currentReality.paragraph3')}
        </p>
      </div>

    <div style="margin-bottom: 3rem;">
      <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 1rem; color: #2B4B8C;">{$t('about.development.title')}</h2>
      <p style="margin-bottom: 1.5rem; color: #4b5563; line-height: 1.7;
font-size: 1.125rem;">
        {$t('about.development.paragraph1')}
      </p>
      <p style="margin-bottom: 1.5rem;
color: #4b5563; line-height: 1.7; font-size: 1.125rem;">
        {$t('about.development.paragraph2')}
      </p>
      <p style="color: #4b5563;
line-height: 1.7; font-size: 1.125rem;">
        {$t('about.development.paragraph3')}
      </p>
    </div>

    <!-- NEW: Seeking Collaborators Section -->
    <div style="margin-bottom: 3rem; background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 1.5rem; border-radius: 0.5rem;">
      <h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; color: #1e40af;">
        {$t('about.seekingCollaborators.title')}
      </h2>
      <p style="margin-bottom: 1.5rem; color: #1e3a8a; line-height: 1.7; font-size: 1.125rem;">
        {$t('about.seekingCollaborators.paragraph1')}
      </p>
      <p style="margin-bottom: 1.5rem; color: #1e3a8a; line-height: 1.7; font-size: 1.125rem;">
        {$t('about.seekingCollaborators.paragraph2')}
      </p>
      <p style="color: #1e3a8a; line-height: 1.7; font-size: 1.125rem;">
        {$t('about.seekingCollaborators.paragraph3')}
      </p>
    </div>

    <div class="founder-note">
      <h3>{$t('about.foundersNote.title')}</h3>
      <p>
        {$t('about.foundersNote.paragraph1')}
      </p>
      <p>
        {$t('about.foundersNote.paragraph2')}
      </p>
      <p>
        {$t('about.foundersNote.paragraph3')}
      </p>
      <p class="founder-signature">
        {$t('about.foundersNote.signature')}
      </p>
    </div>

    <!-- NEW: What We Need Section -->
    <div style="margin-bottom: 3rem; background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 1.5rem; border-radius: 0.5rem;">
      <h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; color: #065f46;">
        {$t('about.whatWeNeed.title')}
      </h2>
      <p style="margin-bottom: 1.5rem; color: #064e3b; line-height: 1.7; font-size: 1.125rem;">
        {$t('about.whatWeNeed.paragraph1')}
      </p>
      <div style="margin-bottom: 1.5rem;">
        {#each $t('about.whatWeNeed.needs') as need}
          <div style="margin-bottom: 1rem; padding: 1rem; background-color: white; border-radius: 0.5rem;">
            <strong style="color: #065f46; font-size: 1.125rem;">{need.category}:</strong>
            <span style="color: #064e3b; display: block; margin-top: 0.25rem;">{need.description}</span>
          </div>
        {/each}
      </div>
      <p style="color: #064e3b; line-height: 1.7; font-size: 1.125rem;">
        {$t('about.whatWeNeed.paragraph2')}
      </p>
    </div>
  </div>

</section>

<section style="padding: 3rem 0;
background-color: #e9f2e9;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
    <div style="max-width: 42rem;
margin: 0 auto;">
      <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 2rem;
text-align: center; color: #2B4B8C;">{$t('about.getInvolved.title')}</h2>
      
      <div style="display: grid; grid-template-columns: 1fr;
gap: 2rem; margin-bottom: 2rem;">
        <div style="background-color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h3 style="font-size: 1.25rem;
font-weight: 600; margin-bottom: 0.75rem; color: #2B4B8C;">{$t('about.getInvolved.contribute.title')}</h3>
          <p style="margin-bottom: 1rem;
color: #4b5563;">{$t('about.getInvolved.contribute.description')}</p>
          <a href="{base}/contact" style="color: #DAA520; text-decoration: none; font-weight: 500;
transition: color 0.2s;" on:mouseover="{e => e.target.style.color = '#B8860B'}" on:mouseout="{e => e.target.style.color = '#DAA520'}">{$t('about.getInvolved.contribute.link')}</a>
        </div>

        <div style="background-color: white;
padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h3 style="font-size: 1.25rem;
font-weight: 600; margin-bottom: 0.75rem; color: #2B4B8C;">{$t('about.getInvolved.join.title')}</h3>
          <p style="margin-bottom: 1rem;
color: #4b5563;">{$t('about.getInvolved.join.description')}</p>
          <div style="display: flex; flex-direction: column;
gap: 0.5rem;">
            <a href="{base}/get-involved" style="color: #DAA520; text-decoration: none; font-weight: 500;
transition: color 0.2s;" on:mouseover="{e => e.target.style.color = '#B8860B'}" on:mouseout="{e => e.target.style.color = '#DAA520'}">{$t('about.getInvolved.join.primaryLink')}</a>
            <a href="https://github.com/BjornKennethHolmstrom/global-governance-frameworks" target="_blank" rel="noopener noreferrer" style="color: #6b7280; text-decoration: none;
font-weight: 500; font-size: 0.9rem; transition: color 0.2s;" on:mouseover="{e => e.target.style.color = '#374151'}" on:mouseout="{e => e.target.style.color = '#6b7280'}">{$t('about.getInvolved.join.secondaryLink')}</a>
          </div>
        </div>

        <div style="background-color: white;
padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h3 style="font-size: 1.25rem;
font-weight: 600; margin-bottom: 0.75rem; color: #2B4B8C;">{$t('about.getInvolved.apply.title')}</h3>
          <p style="margin-bottom: 1rem;
color: #4b5563;">{$t('about.getInvolved.apply.description')}</p>
          <a href="{base}/frameworks" style="color: #DAA520; text-decoration: none; font-weight: 500;
transition: color 0.2s;" on:mouseover="{e => e.target.style.color = '#B8860B'}" on:mouseout="{e => e.target.style.color = '#DAA520'}">{$t('about.getInvolved.apply.link')}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .founder-note {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-left: 4px solid #2B4B8C;
    padding: 2rem;
    border-radius: 0.5rem;
    margin: 3rem 0;
    font-style: italic;
  }

  .founder-note h3 {
    color: #2B4B8C;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-style: normal;
  }

  .founder-note p {
    color: #1e3a8a;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 1.125rem;
  }

  .founder-signature {
    text-align: right;
    font-weight: 600;
    color: #2B4B8C;
    margin-top: 1.5rem;
    font-style: normal;
  }
</style>
