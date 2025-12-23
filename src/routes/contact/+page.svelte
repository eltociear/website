<!-- src/routes/contact/+page.svelte -->
<script>
  import { t } from '$lib/i18n';
  import { page } from '$app/stores'; // <-- Add this import

  let name = '';
  let email = '';
  let message = '';
  let subject = 'general';
  let isSubmitting = false;
  let submitSuccess = false;
  let submitError = false;
  const FORMSPREE_ID = "xldjbjgl"; // [cite: 3]

  $: {
    const paramSubject = $page.url.searchParams.get('subject');
    if (paramSubject) {
      // Map "Funding Pledge" (from url) to "funding" (value in select)
      if (paramSubject.toLowerCase().includes('funding')) {
        subject = 'funding';
      } else {
        // Try to match other params directly (e.g. ?subject=collaboration)
        subject = paramSubject.toLowerCase();
      }
    }
  }

  async function handleSubmit() {
    isSubmitting = true;
    submitSuccess = false;
    submitError = false;
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (response.ok) {
        submitSuccess = true;
        name = '';
        email = '';
        message = '';
        subject = 'general'; // Reset to general after success
      } else {
        submitError = true;
      }
    } catch (error) {
      submitError = true;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Contact - Global Governance Framework</title>
  <meta name="description" content="Get in touch with the Global Governance Framework project" />
</svelte:head>

<!-- Hero Section with Adjusted Theme -->
<section style="padding: 4rem 0; background: linear-gradient(to bottom right, #6B5CA5, #4B5CA5); color: #FFF; text-align: center;">
  <div style="max-width: 800px; margin: auto;">
    <h1 style="font-size: 2.5rem; font-weight: 700;">{$t('contact.hero.title')}</h1>
    <p style="font-size: 1.25rem; margin-top: 1rem;">{$t('contact.hero.subtitle')}</p>
  </div>
</section>

<!-- Contact Form Section -->
<section style="padding: 4rem 0; background-color: #F4E5D4;">
  <div style="max-width: 900px; margin: auto; padding: 0 1rem;">
    <div style="display: flex; flex-direction: column; gap: 2rem; align-items: center;">
      
      <!-- Discord Card 
      <div style="background: linear-gradient(135deg, #5865F2, #4752C4); padding: 2rem; border-radius: 15px; width: 100%; max-width: 600px; box-shadow: 0px 6px 20px rgba(88, 101, 242, 0.3); color: white; text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.210 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <h2 style="font-size: 1.75rem; font-weight: 700; margin: 0;">{$t('contact.discord.title')}</h2>
        </div>
        <p style="font-size: 1.1rem; margin-bottom: 1.5rem; opacity: 0.9;">{$t('contact.discord.description')}</p>
        <a href="{$t('contact.discord.inviteLink')}" target="_blank" rel="noopener noreferrer" 
           style="background: white; color: #5865F2; padding: 0.75rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 1rem; display: inline-block; transition: all 0.3s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"
           on:mouseenter={(e) => {
             e.target.style.transform = 'translateY(-2px)';
             e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
           }}
           on:mouseleave={(e) => {
             e.target.style.transform = 'translateY(0)';
             e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
           }}>
          {$t('contact.discord.button')}
        </a>
      </div> -->

      <!-- Contact Form -->
      <form on:submit|preventDefault={handleSubmit} style="background: #FFF3E0; padding: 2rem; border-radius: 10px; width: 100%; max-width: 600px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
        <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; color: #4A3228;">{$t('contact.form.title')}</h2>
        {#if submitSuccess}
          <p style="color: #2D6A4F; background: #A3B18A; padding: 1rem; border-radius: 8px;">{$t('contact.form.success')}</p>
        {/if}
        {#if submitError}
          <p style="color: #8B0000; background: #F28F8F; padding: 1rem; border-radius: 8px;">{$t('contact.form.error')}</p>
        {/if}
        <label style="display: block; margin-bottom: 0.5rem; color: #4A3228;">{$t('contact.form.fields.name.label')}</label>
        <input type="text" bind:value={name} required style="width: 100%; padding: 0.75rem; border: 1px solid #A3B18A; border-radius: 5px;">

        <label style="display: block; margin-top: 1rem; color: #4A3228;">{$t('contact.form.fields.email.label')}</label>
        <input type="email" bind:value={email} required style="width: 100%; padding: 0.75rem; border: 1px solid #A3B18A; border-radius: 5px;">

        <label style="display: block; margin-top: 1rem; color: #4A3228;">
          {$t('contact.form.fields.subject.label')}
        </label>
        <select bind:value={subject} style="width: 100%; padding: 0.75rem; border: 1px solid #A3B18A; border-radius: 5px;">
          <option value="general">{$t('contact.form.fields.subject.options.general')}</option>
          <option value="feedback">{$t('contact.form.fields.subject.options.feedback')}</option>
          <option value="collaboration">{$t('contact.form.fields.subject.options.collaboration')}</option>
          <option value="report">{$t('contact.form.fields.subject.options.report')}</option>
          <option value="funding">{$t('contact.form.fields.subject.options.funding') || 'Funding / Support'}</option>
        </select>

        <label style="display: block; margin-top: 1rem; color: #4A3228;">{$t('contact.form.fields.message.label')}</label>
        <textarea bind:value={message} required rows="5" style="width: 100%; padding: 0.75rem; border: 1px solid #A3B18A; border-radius: 5px;"></textarea>

        <button type="submit" disabled={isSubmitting} style="width: 100%; background-color: #6B5CA5; color: #FFF3E0; font-weight: 700; padding: 1rem; border-radius: 10px; margin-top: 1rem; border: none; cursor: pointer; transition: 0.2s;">
          {isSubmitting ? $t('contact.form.sending') : $t('contact.form.submit')}
        </button>
      </form>
    </div>
  </div>
</section>
