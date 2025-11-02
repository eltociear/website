<script>
  import { t, translations } from '$lib/i18n';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
</script>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .hero {
    background: linear-gradient(to bottom right, #2B4B8C, #6B5CA5);
    color: white;
    padding: 4rem 1rem;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .hero h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .hero p {
    font-size: 1.25rem;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .section {
    margin-bottom: 4rem;
  }
  
  .section-title {
    color: #2B4B8C;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #DAA520;
  }
  
  .section-subtitle {
    color: #2D5F2D;
    font-size: 1.5rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    background-color: #f9fafb;
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2B4B8C;
    margin-bottom: 0.5rem;
  }
  
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .cta {
    background-color: #2D5F2D;
    color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    text-align: center;
    margin-top: 2rem;
  }
  
  .cta-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .btn {
    display: inline-block;
    background-color: #DAA520;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
    font-weight: 600;
    margin-top: 1rem;
    transition: background-color 0.2s;
  }
  
  .btn:hover {
    background-color: #B8860B;
  }
  
  .quote {
    font-style: italic;
    padding: 1rem;
    border-left: 3px solid #DAA520;
    margin: 1.5rem 0;
    background-color: #f9fafb;
  }
</style>

<div class="hero">
  <h1>{$t('aiFutures.hero.title')}</h1>
  <p>{$t('aiFutures.hero.subtitle')}</p>
</div>

<div class="container">
  <div class="section">
    <h2 class="section-title">{$t('aiFutures.overview.title')}</h2>
    <p>{$t('aiFutures.overview.paragraph1')}</p>
    <p>{$t('aiFutures.overview.paragraph2')}</p>
    <p>{$t('aiFutures.overview.paragraph3')}</p>
  </div>

  <div class="section">
    <h2 class="section-title">{$t('aiFutures.dystopia.title')}</h2>
    <p>{$t('aiFutures.dystopia.intro')}</p><br>
    <p>{$t('aiFutures.dystopia.note')}</p><br>
    
    <div class="grid">
      <div class="card">
        <h3 class="card-title">{$t('aiFutures.dystopia.models.autocracy.title')}</h3>
        <p>{$t('aiFutures.dystopia.models.autocracy.description')}</p>
      </div>
      
      <div class="card">
        <h3 class="card-title">{$t('aiFutures.dystopia.models.oligarchy.title')}</h3>
        <p>{$t('aiFutures.dystopia.models.oligarchy.description')}</p>
      </div>
      
      <div class="card">
        <h3 class="card-title">{$t('aiFutures.dystopia.models.fractured.title')}</h3>
        <p>{$t('aiFutures.dystopia.models.fractured.description')}</p>
      </div>
      
      <div class="card">
        <h3 class="card-title">{$t('aiFutures.dystopia.models.custodianship.title')}</h3>
        <p>{$t('aiFutures.dystopia.models.custodianship.description')}</p>
      </div>
    </div>
    
    <div class="quote">
      <p>{$t('aiFutures.dystopia.quote')}</p>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">{$t('aiFutures.alternative.title')}</h2>
    <p>{$t('aiFutures.alternative.intro')}</p>
    
    <h3 class="section-subtitle">{$t('aiFutures.alternative.models.distributed.title')}</h3>
    <p>{$t('aiFutures.alternative.models.distributed.description')}</p>
    
    <h3 class="section-subtitle">{$t('aiFutures.alternative.models.purpose.title')}</h3>
    <p>{$t('aiFutures.alternative.models.purpose.description')}</p>
    
    <h3 class="section-subtitle">{$t('aiFutures.alternative.models.renaissance.title')}</h3>
    <p>{$t('aiFutures.alternative.models.renaissance.description')}</p>
    
    <h3 class="section-subtitle">{$t('aiFutures.alternative.models.ecological.title')}</h3>
    <p>{$t('aiFutures.alternative.models.ecological.description')}</p>
  </div>

  <div class="section">
    <h2 class="section-title">{$t('aiFutures.implementation.title')}</h2>
    <p>{$t('aiFutures.implementation.intro')}</p><br>
    
    <div class="grid">
      <div class="card">
        <h3 class="card-title">{$t('aiFutures.implementation.approaches.technical.title')}</h3>
        <p>{$t('aiFutures.implementation.approaches.technical.description')}</p>
      </div>
      
      <div class="card">
        <h3 class="card-title">{$t('aiFutures.implementation.approaches.economic.title')}</h3>
        <p>{$t('aiFutures.implementation.approaches.economic.description')}</p>
      </div>
      
      <div class="card">
        <h3 class="card-title">{$t('aiFutures.implementation.approaches.governance.title')}</h3>
        <p>{$t('aiFutures.implementation.approaches.governance.description')}</p>
      </div>
      
      <div class="card">
        <h3 class="card-title">{$t('aiFutures.implementation.approaches.spiritual.title')}</h3>
        <p>{$t('aiFutures.implementation.approaches.spiritual.description')}</p>
      </div>
    </div>
    
    <p>{$t('aiFutures.implementation.connection')}</p>
  </div>

  <div class="section">
    <h2 class="section-title">{$t('aiFutures.action.title')}</h2>
    <p>{$t('aiFutures.action.intro')}</p>
    
    <h3 class="section-subtitle">{$t('aiFutures.action.levels.individual.title')}</h3>
    <p>{$t('aiFutures.action.levels.individual.description')}</p>
    
    <h3 class="section-subtitle">{$t('aiFutures.action.levels.community.title')}</h3>
    <p>{$t('aiFutures.action.levels.community.description')}</p>
    
    <h3 class="section-subtitle">{$t('aiFutures.action.levels.policy.title')}</h3>
    <p>{$t('aiFutures.action.levels.policy.description')}</p>
    
    <div class="cta">
      <h3 class="cta-title">{$t('aiFutures.action.cta.title')}</h3>
      <p>{$t('aiFutures.action.cta.description')}</p>
      <a href="{base}/frameworks/technology-governance" class="btn">{$t('aiFutures.action.cta.button')}</a>
    </div>
  </div>
</div>
