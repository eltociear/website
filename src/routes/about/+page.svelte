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
        <p style="margin-bottom: 1.5rem;
color: #4b5563; line-height: 1.7; font-size: 1.125rem;">
          {$t('about.vision.paragraph2')}
        </p>
      </div>

      <div style="background-color: #eef2ff;
border-left: 6px solid #2B4B8C; padding: 2rem; border-radius: 0.75rem; margin-bottom: 1.5rem;
box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e3a8a;
margin-bottom: 1rem;">
          📘 {$t('about.globalGovernanceDownload.title')}
        </h2>
        <p style="font-size: 1.125rem;
line-height: 1.6; color: #374151; margin-bottom: 1.5rem;">
          {$t('about.globalGovernanceDownload.description')}
        </p>
        <a 
          href="/resources/Global_Governance_-_Natural_Steps_Toward_a_Thriving_World.pdf"
          class="inline-block px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-base font-medium rounded-lg transition"
          download
        >
          {$t('about.globalGovernanceDownload.button')}
        </a>
   
   </div>

      <div style="background-color: #e9f2e9;
 border-left: 6px solid #2D5F2D; padding: 2rem; border-radius: 0.75rem; margin-bottom: 3rem;
 box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #164e2d;
 margin-bottom: 1rem;">
          📚 {$t('about.moreResources.title')}
        </h2>
        <p style="font-size: 1.125rem;
 line-height: 1.6; color: #374151; margin-bottom: 1.5rem;">
          {$t('about.moreResources.description')}
        </p>
        <a 
          href="{base}/resources"
          class="inline-block px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-base font-medium rounded-lg transition"
        >
          {$t('about.moreResources.button')}
        </a>
      </div>
      
      <div style="margin-bottom: 3rem;
background-color: #f9fafb; padding: 2rem; border-radius: 0.75rem; border-left: 4px solid #2D5F2D;">
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
        <div style="display: grid;
grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          {#each $t('about.acceleration.examples') as example}
            <div style="background-color: white;
padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
              <h3 style="font-size: 1.25rem;
font-weight: 600; margin-bottom: 0.5rem; color: #B8860B;">{example.title}</h3>
              <p style="color: #4b5563;
line-height: 1.6;">{example.description}</p>
            </div>
          {/each}
        </div>
        <p style="margin-bottom: 1rem;
color: #4b5563; line-height: 1.7; font-size: 1.125rem;">
          {$t('about.acceleration.paragraph2')}
        </p>
        <ul style="margin-left: 1.5rem;
margin-bottom: 1.5rem; list-style-type: disc; color: #4b5563;">
          {#each $t('about.acceleration.benefits') as benefit}
            <li style="margin-bottom: 0.5rem;">{benefit}</li>
          {/each}
        </ul>
      </div>
      
      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 1rem; color: #2B4B8C;">{$t('about.principles.title')}</h2>
        <ul style="margin-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc;
color: #4b5563;">
          {#each $t('about.principles.list') as principle}
            <li style="margin-bottom: 0.5rem;"><strong>{principle.name}:</strong> {principle.description}</li>
          {/each}
        </ul>
      </div>
      
      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.875rem;
font-weight: 700; margin-bottom: 1rem; color: #2B4B8C;">{$t('about.approach.title')}</h2>
        <p style="margin-bottom: 1rem; color: #4b5563; line-height: 1.7;
font-size: 1.125rem;">
          {$t('about.approach.intro')}
        </p>
        <ul style="margin-left: 1.5rem;
margin-bottom: 1.5rem; list-style-type: disc; color: #4b5563;">
          {#each $t('about.approach.list') as item}
            <li style="margin-bottom: 0.5rem;">{item}</li>
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
  </div>

</section>

<section style="padding: 3rem 0;
background-color: #e9f2e9;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
    <div style="max-width: 42rem;
margin: 0 auto;">
      <h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 2rem; text-align: center;
color: #2B4B8C;">{$t('about.getInvolved.title')}</h2>
      
      <div style="display: grid; grid-template-columns: repeat(1, minmax(0, 1fr));
gap: 1.5rem;">
        <div style="background-color: white;
padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #2D5F2D;">
          <h3 style="font-size: 1.25rem;
font-weight: 600; margin-bottom: 0.75rem; color: #2B4B8C;">{$t('about.getInvolved.contribute.title')}</h3>
          <p style="margin-bottom: 1rem;
color: #4b5563;">{$t('about.getInvolved.contribute.description')}</p>
          <a href="{base}/contact" style="color: #DAA520; font-weight: 500;
transition: color 0.2s;" on:mouseover="{e => e.target.style.color = '#B8860B'}" on:mouseout="{e => e.target.style.color = '#DAA520'}">{$t('about.getInvolved.contribute.link')}</a>
        </div>
        
        <div style="background-color: white;
padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #2D5F2D;">
          <h3 style="font-size: 1.25rem;
font-weight: 600; margin-bottom: 0.75rem; color: #2B4B8C;">{$t('about.getInvolved.join.title')}</h3>
          <p style="margin-bottom: 1rem;
color: #4b5563;">{$t('about.getInvolved.join.description')}</p>
          <div style="display: flex; flex-direction: column;
gap: 0.5rem;">
            <a href="{base}/get-involved" style="color: #DAA520; font-weight: 500;
transition: color 0.2s;" on:mouseover="{e => e.target.style.color = '#B8860B'}" on:mouseout="{e => e.target.style.color = '#DAA520'}">{$t('about.getInvolved.join.primaryLink')}</a>
            <a href="https://github.com/GlobalGovernanceFrameworks" target="_blank" rel="noopener noreferrer" style="color: #6b7280;
font-weight: 500; font-size: 0.9rem; transition: color 0.2s;" on:mouseover="{e => e.target.style.color = '#374151'}" on:mouseout="{e => e.target.style.color = '#6b7280'}">{$t('about.getInvolved.join.secondaryLink')}</a>
          </div>
        </div>
        
        <div style="background-color: white;
padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #2D5F2D;">
          <h3 style="font-size: 1.25rem;
font-weight: 600; margin-bottom: 0.75rem; color: #2B4B8C;">{$t('about.getInvolved.apply.title')}</h3>
          <p style="margin-bottom: 1rem;
color: #4b5563;">{$t('about.getInvolved.apply.description')}</p>
          <a href="{base}/frameworks" style="color: #DAA520; font-weight: 500;
transition: color 0.2s;" on:mouseover="{e => e.target.style.color = '#B8860B'}" on:mouseout="{e => e.target.style.color = '#DAA520'}">{$t('about.getInvolved.apply.link')}</a>
        </div>
      </div>
    </div>
  </div>
</section>
