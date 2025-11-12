<!-- src/routes/frameworks/tools/+page.svelte -->
<script>
  import { t, locale, setLocale } from '$lib/i18n';
  import { base } from '$app/paths';

  // Subscribe to stores
  $: currentT = $t;
  $: currentLocale = $locale;

  // Helper function for language button styles
  function getLanguageButtonStyle(lang) {
    const isActive = currentLocale === lang;
    return `padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid #e5e7eb; background-color: ${isActive ? '#2B4B8C' : 'white'}; color: ${isActive ? 'white' : '#2B4B8C'}; font-weight: 500; text-decoration: none;`;
  }

  // Translations for this page
  const translations = {
    en: {
      title: "Framework Tools Overview",
      subtitle: "Implementation resources for Global Governance Frameworks",
      intro: "Access tools, templates, and resources to help implement various governance frameworks. Each framework has its own set of specialized tools tailored to its unique focus and requirements.",
      availableResources: "Currently Available Resources",
      treatyTitle: "Treaty for Our Only Home Tools",
      treatyDesc: "Top-down resources for systemic change. This kit provides the tools for implementing the Treaty's high-level reforms of our global architecture. It includes UNSC reform guides, carbon tax templates, and advocacy materials for building the Global Stewardship Alliance.",
      treatyButton: "Access Treaty Tools",
      governanceTitle: "Community & Local Governance Tools",
      governanceDesc: "Bottom-up tools demonstrating the Treaty's principles in action. This collection offers practical resources for applying the principle of subsidiarity at the local level. It includes digital democracy platforms, stakeholder engagement templates, and community well-being frameworks.",
      governanceButton: "Access Community Tools",
      climateTitle: "Climate & Energy Governance Framework Tools",
      climateDesc: "Tools for implementing the Climate & Energy Governance Framework, including assessment tools, transition planning templates, and advocacy resources for climate policy.",
      climateButton: "Access Climate & Energy Tools",
      peaceTitle: "Peace & Conflict Resolution Framework Tools",
      peaceDesc: "Resources for implementing peace governance at multiple levels, including conflict analysis templates, dialogue protocols, and tools for transitional justice, early warning systems, and trauma-informed facilitation.",
      peaceButton: "Access Peace & Conflict Tools",
      planetaryHealthTitle: "Planetary Health Framework Tools",
      planetaryHealthDesc: "Resources for health equity, community empowerment, and planetary healing, including Community Health Legions, AI-powered health systems, blockchain health records, One Health surveillance, and tools for creating equitable healthcare for all by 2035.",
      planetaryHealthButton: "Access Planetary Health Tools",
      financialTitle: "Financial Systems Framework Tools",
      financialDesc: "Resources for implementing financial systems that prioritize human and ecological flourishing, including Hearts currency implementation, Love Ledger guides, validator training, and tools for integrating with traditional financial systems.",
      financialButton: "Access Financial Systems Tools",
      workInLiberationTitle: "Work in Liberation Framework Tools",
      workInLiberationDesc: "Resources for transforming work from exploitation to meaningful contribution through Community Work Teams, Hearts & Leaves currencies, democratic governance, and just transition from extractive industries to regenerative alternatives.",
      workInLiberationButton: "Access Work in Liberation Tools",
      educationTitle: "Education Framework Tools",
      educationDesc: "Tools for implementing the Educational Systems Framework, including project guides, assessment tools, and advocacy resources.",
      educationButton: "Access Education Tools",
      mentalHealthTitle: "Mental Health Framework Tools",
      mentalHealthDesc: "Resources for implementing community-led mental health transformation through consciousness-inclusive healing, traditional medicine integration, and rights-based care that positions mental health as a transcultural human right fostering collective flourishing.",
      mentalHealthButton: "Access Mental Health Tools",
      waterTitle: "Water & Sanitation (WASH) Governance Framework Tools",
      waterDesc: "Resources for implementing water justice transformation through community control, regenerative technologies, and rights-based governance, including sacred waters kits, microgrid planning, sovereign wealth funds, and tools for establishing water assemblies and legal frameworks.",
      waterButton: "Access Water & Sanitation Tools",
      mosTitle: "Moral Operating System Tools",
      mosDesc: "Ethical frameworks and practical tools for recognizing rights and dignity across all beings, including the Rights Seed Kit for community dialogue, spiral translation guides, and AI consciousness assessment protocols.",
      mosButton: "Access Moral Operating System Tools",
      environmentalTitle: "Environmental Stewardship Framework Tools",
      environmentalDesc: "Resources for regenerative environmental governance, including sacred seed kits for interfaith restoration, ecosystem health monitoring, rights recognition for all beings, and tools for climate adaptation and biodiversity protection.",
      environmentalButton: "Access Environmental Stewardship Tools",
      digitalTitle: "Digital Commons Framework Tools",
      digitalDesc: "Tools for implementing the Digital Commons Framework, including governance templates, node setup guides, data sovereignty protocols, and resources for establishing ethical AI systems and knowledge commons in diverse contexts.",
      digitalButton: "Access Digital Commons Tools",
      biodiversityTitle: "Biodiversity Framework Tools",
      biodiversityDesc: "Resources for planetary healing and regenerative biodiversity governance, including Indigenous Digital Sovereignty Hubs, Bio-Arts Residencies, ecosystem rights recognition, hybrid UBES systems, and tools for creating a regenerative biosphere by 2045.",
      biodiversityButton: "Access Biodiversity Tools",
      animalWelfareTitle: "Global Guardian Framework Tools",
      animalWelfareDesc: "Resources for implementing animal welfare transformation through community-led guardianship, sentience protection, and regenerative systems that position animals as beings deserving compassion rather than commodities, including welfare assessments, anti-speciesism training, alternative protein development, and just transition support.",
      animalWelfareButton: "Access Animal Welfare Tools",
      foodTitle: "Food Systems & Agriculture Framework Tools",
      foodDesc: "Resources for implementing sustainable food systems, including regenerative agriculture guides, stakeholder engagement templates, and policy harmonization tools.",
      foodButton: "Access Food Systems Tools",
      economicTitle: "Economic Integration Framework Tools",
      economicDesc: "Resources for implementing the Nested Sovereignty Framework, including community currency templates, ethical trade zone charters, universal basic income guides, and commons governance tools for equitable, sustainable economies.",
      economicButton: "Access Economic Integration Tools",
      justiceTitle: "Justice Systems Framework Tools",
      justiceDesc: "Resources for implementing equitable justice systems, including restorative justice guides, stakeholder engagement templates, and tools for integrating indigenous legal traditions to create more transparent and effective systems.",
      justiceButton: "Access Justice Systems Tools",
      spiritualTitle: "Religious & Spiritual Dialogue Framework Tools",
      spiritualDesc: "Resources for fostering meaningful dialogue among religious, spiritual, and non-theistic communities, including facilitation guides, ethics charters, wisdom documentation templates, and tools for policy translation that honor diverse spiritual perspectives.",
      spiritualButton: "Access Spiritual Dialogue Tools",
      agingTitle: "Aging Population Support Framework Tools",
      agingDesc: "Resources for implementing elder-led transformation through AUBI pilots, innovation hubs, political organizing, and regenerative aging economics that position elders as wisdom keepers and community leaders.",
      agingButton: "Access Aging Support Tools",
      consciousnessTitle: "Consciousness & Inner Development Framework Tools",
      consciousnessDesc: "Resources for implementing conscious governance through personal transformation, collective wisdom, and systemic integration, including wisdom council setup, mindfulness training, cultural sensitivity protocols, and tools for building governance that honors interconnectedness and planetary well-being.",
      consciousnessButton: "Access Consciousness Tools",
      comingSoon: "Coming Soon",
      otherFrameworks: "Other Framework Resources",
      otherFrameworksDesc: "Implementation tools for the following frameworks are currently in development and will be made available soon:",
      technologyTitle: "Technology Governance Framework",
      metaTitle: "Integrated Meta-Governance Framework",
      requestTitle: "Request Tools or Provide Feedback",
      requestDesc: "Need implementation resources for a specific framework? Have suggestions for improvements? We welcome your input to make these tools more useful.",
      contactLink: "Contact us",
      languagesTitle: "Available Languages"
    },
    sv: {
      title: "Översikt över ramverksverktyg",
      subtitle: "Implementeringsresurser för globala styrningsramverk",
      intro: "Få tillgång till verktyg, mallar och resurser för att implementera olika styrningsramverk. Varje ramverk har sin egen uppsättning specialiserade verktyg anpassade efter dess unika fokus och krav.",
      availableResources: "Tillgängliga resurser",
      treatyTitle: "Verktyg för Fördraget för Vårt Enda Hem",
      treatyDesc: "Top-down-resurser för systemförändring. Detta kit tillhandahåller verktygen för att genomföra fördragets övergripande reformer av vår globala arkitektur. Det innehåller reformguider för FN:s säkerhetsråd, mallar för koldioxidskatter och påverkansmaterial för att bygga den globala förvaltningsalliansen.",
      treatyButton: "Öppna fördragsverktyg",
      mosTitle: "Verktyg för det moraliska operativsystemet",
      mosDesc: "Etiska ramverk och praktiska verktyg för att erkänna rättigheter och värdighet för alla varelser, inklusive rättighetsfrösatsen för samhällsdialog, spiralöversättningsguider och AI-medvetandebedömningsprotokoll.",
      mosButton: "Öppna verktyg för det moraliska operativsystemet",
      governanceTitle: "Verktyg för samhälls- och lokalstyrning",
      governanceDesc: "Bottom-up-verktyg som demonstrerar fördragets principer i praktiken. Denna samling erbjuder praktiska resurser för att tillämpa subsidiaritetsprincipen på lokal nivå. Den inkluderar plattformar för digital demokrati, mallar för intressentengagemang och ramverk för samhällets välbefinnande.",
      governanceButton: "Få tillgång till communityverktyg",
      climateTitle: "Verktyg för klimat- och energistyrningsramverk",
      climateDesc: "Verktyg för att implementera ramverket för klimat- och energistyrning, inklusive bedömningsverktyg, mallar för omställningsplanering och opinionsbildningsresurser för klimatpolitik.",
      climateButton: "Öppna klimat- och energiverktyg",
      peaceTitle: "Verktyg för fred och konfliktlösningsramverk",
      peaceDesc: "Resurser för att implementera fredsarbete på flera nivåer, inklusive mallar för konfliktanalys, dialogprotokoll och verktyg för övergångsrättvisa, tidiga varningssystem och traumamedveten facilitering.",
      peaceButton: "Öppna freds- och konfliktverktyg",
      planetaryHealthTitle: "Planetär Hälsa Ramverk Verktyg",
      planetaryHealthDesc: "Resurser för hälsorättvisa, samhällsstärkande och planetär läkning, inklusive Gemenskapshälsa Legioner, AI-drivna hälsosystem, blockchain hälsoregister, En Hälsa övervakning och verktyg för att skapa rättvis hälsovård för alla till 2035.",
      planetaryHealthButton: "Öppna verktyg för planetär hälsa",
      financialTitle: "Verktyg för Finansiella Systems Ramverk",
      financialDesc: "Resurser för implementering av finansiella system som prioriterar mänskligt och ekologiskt välbefinnande, inklusive Hearts valutaimplementering, Love Ledger-guider, validatorträning och verktyg för integrering med traditionella finansiella system.",
      financialButton: "Öppna finansiella systemverktyg",
      workInLiberationTitle: "Verktyg för ramverket för frigjort arbete, ",
      workInLiberationDesc: "Resurser för att omvandla arbete från exploatering till meningsfulla bidrag genom Gemenskapliga Arbetslag, Hearts & Leaves valutor, demokratisk styrning och rättvis övergång från utvinningsindustrier till regenerativa alternativ.",
      workInLiberationButton: "Öppna Arbete i Befrielse Verktyg",
      educationTitle: "Verktyg för utbildningsramverket",
      educationDesc: "Verktyg för att implementera utbildningsramverket, inklusive projektguider, bedömningsverktyg och opinionsbildningsresurser.",
      educationButton: "Öppna utbildningsverktyg",
      mentalHealthTitle: "Mental Hälsa Ramverk Verktyg",
      mentalHealthDesc: "Resurser för att implementera samhällsledd mental hälsa transformation genom medvetenhetsinnefattande helande, traditionell medicin integration och rättighetsbaserad vård som positionerar mental hälsa som en transkulturell mänsklig rättighet som främjar kollektiv blomstring.",
      mentalHealthButton: "Öppna Mental Hälsa Verktyg",
      waterTitle: "Vatten & Sanitet (WASH) Styrningsramverk Verktyg",
      waterDesc: "Resurser för att implementera vattenrättvisetransformation genom samhällskontroll, regenerativ teknik och rättighetsbaserad styrning, inklusive heliga vattenkit, mikronätplanering, statliga förmögenhetsfonder och verktyg för att etablera vattenförsamlingar och juridiska ramverk.",
      waterButton: "Öppna vatten- och sanitetsverktyg",
      environmentalTitle: "Verktyg för Miljöförvaltningsramverk",
      environmentalDesc: "Resurser för regenerativ miljöstyrning, inklusive heliga fröpaket för interfaith-restaurering, övervakning av ekosystemhälsa, rättighetserkännande för alla varelser och verktyg för klimatanpassning och biologisk mångfaldsskydd.",
      environmentalButton: "Öppna miljöförvaltningsverktyg",
      digitalTitle: "Verktyg för digitalt allmänningsramverk",
      digitalDesc: "Verktyg för att implementera ramverket för digitala allmänningar, inklusive styrningsmallar, guider för nodkonfiguration, protokoll för datasuveränitet och resurser för att upprätta etiska AI-system och kunskapsallmänningar i olika sammanhang.",
      digitalButton: "Öppna digitala allmänningsverktyg",
      biodiversityTitle: "Biodiversitetsramverk Verktyg",
      biodiversityDesc: "Resurser för planetär läkning och regenerativ biodiversitetsstyrning, inklusive Ursprungsdigital Suveränitetshubbar, Bio-Konstresidenser, erkännande av ekosystemrättigheter, hybrid UBES-system och verktyg för att skapa en regenerativ biosfär till 2045.",
      biodiversityButton: "Öppna biodiversitetsverktyg",
      animalWelfareTitle: "Global Guardian Ramverk Verktyg",
      animalWelfareDesc: "Resurser för att implementera djurvälfärdstransformation genom samhällslett förmyndarskap, kännande skydd och regenerativa system som positionerar djur som varelser som förtjänar medkänsla snarare än varor, inklusive välfärdsbedömningar, anti-speciesism träning, alternativ proteinutveckling och rättvis övergångsstöd.",
      animalWelfareButton: "Öppna djurvälfärdsverktyg",
      foodTitle: "Verktyg för matsystem och jordbruksramverk",
      foodDesc: "Resurser för att implementera hållbara matsystem, inklusive guider för regenerativt jordbruk, mallar för intressentengagemang och verktyg för policyharmonisering.",
      foodButton: "Öppna matsystemverktyg",
      economicTitle: "Verktyg för ekonomisk integrationsramverk",
      economicDesc: "Resurser för att implementera ramverket för nästlad suveränitet, inklusive mallar för gemenskapsvaluta, stadgar för etiska handelszoner, guider för universell basinkomst och verktyg för allmänningsstyrning för rättvisa, hållbara ekonomier.",
      economicButton: "Öppna ekonomiska integrationsverktyg",
      justiceTitle: "Verktyg för rättssystemsramverk",
      justiceDesc: "Resurser för att implementera rättvisa rättssystem, inklusive guider för restaurativ rättvisa, mallar för intressentengagemang och verktyg för att integrera urfolkens rättstraditioner för att skapa mer transparenta och effektiva system.",
      justiceButton: "Öppna rättssystemverktyg",
      spiritualTitle: "Verktyg för ramverket för religiös och andlig dialog",
      spiritualDesc: "Resurser för att främja meningsfull dialog mellan religiösa, andliga och icke-teistiska gemenskaper, inklusive faciliteringsguider, etiska stadgar, mallar för visdomsdokumentation och verktyg för policyöversättning som hedrar olika andliga perspektiv.",
      spiritualButton: "Öppna verktyg för andlig dialog",
      agingTitle: "Verktyg för Åldrande Befolkningsstöd Ramverk",
      agingDesc: "Resurser för att implementera äldreledda transformationer genom AUBI-piloter, innovationshubbar, politisk organisering och regenerativ åldrandeekonomi som positionerar äldre som visdomsbevarare och samhällsledare.",
      agingButton: "Öppna åldrandestödverktyg",
      consciousnessTitle: "Verktyg för Medvetenhet & Inre Utveckling Ramverk",
      consciousnessDesc: "Resurser för att implementera medveten styrning genom personlig transformation, kollektiv visdom och systemisk integration, inklusive uppsättning av visdomsråd, mindfulnessträning, kulturella känslighetsprotokoll och verktyg för att bygga styrning som hedrar sammankoppling och planetärt välbefinnande.",
      consciousnessButton: "Öppna medvetenhetsverktyg",
      comingSoon: "Kommer snart",
      otherFrameworks: "Övriga ramverksresurser",
      otherFrameworksDesc: "Implementeringsverktyg för följande ramverk är för närvarande under utveckling och kommer att göras tillgängliga inom kort:",
      technologyTitle: "Styrningsramverk för teknik",
      metaTitle: "Integrerat meta-styrningsramverk",
      requestTitle: "Begär verktyg eller ge feedback",
      requestDesc: "Behöver du implementeringsresurser för ett specifikt ramverk? Har du förslag på förbättringar? Vi välkomnar dina synpunkter för att göra dessa verktyg mer användbara.",
      contactLink: "Kontakta oss",
      languagesTitle: "Tillgängliga språk"
    }
  };

  // Get current translations based on active locale
  $: texts = translations[currentLocale] || translations.en;
</script>

<svelte:head>
  <title>{texts.title} - Global Governance Framework</title>
  <meta name="description" content={texts.subtitle} />
</svelte:head>

<!-- Hero Section -->
<section style="padding: 3rem 0; background: linear-gradient(to bottom right, #2B4B8C, #6B5CA5); color: white;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
    <div style="max-width: 42rem; margin: 0 auto;">
      <h1 style="font-size: 2.5rem; line-height: 1.2; font-weight: 700; margin-bottom: 1rem;">
        {texts.title}
      </h1>
      <p style="font-size: 1.25rem; color: #ffffff;">
        {texts.subtitle}
      </p>
    </div>
  </div>
</section>

<!-- Main Content Section -->
<section style="padding: 3rem 0; background-color: white;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
    <div style="max-width: 42rem; margin: 0 auto;">
      <p style="margin-bottom: 2rem; color: #4b5563; line-height: 1.7; font-size: 1.125rem;">
        {texts.intro}
      </p>

      <!-- Available Resources Section -->
      <h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 1.5rem; color: #2B4B8C;">{texts.availableResources}</h2>

      <!-- Treaty for Our Only Home Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #0A2540; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #0A2540;">🌐</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #0A2540;">{texts.treatyTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.treatyDesc}
            </p>
            <a href="{base}/frameworks/tools/treaty-for-our-only-home" style="display: inline-flex; align-items: center; background-color: #0A2540; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.treatyButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Governance Tools Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #2B4B8C; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #2B4B8C;">🌍</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #2B4B8C;">{texts.governanceTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.governanceDesc}
            </p>
            <a href="{base}/frameworks/tools/governance" style="display: inline-flex; align-items: center; background-color: #2B4B8C; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.governanceButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Moral Operating System Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #6B46C1; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #6B46C1;">🦋</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #6B46C1;">{texts.mosTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.mosDesc}
            </p>
            <a href="{base}/frameworks/tools/moral-operating-system" style="display: inline-flex; align-items: center; background-color: #6B46C1; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.mosButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Food Systems Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #2e7d32; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #2e7d32;">🌱</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #2e7d32;">{texts.foodTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.foodDesc}
            </p>
            <a href="{base}/frameworks/tools/food-systems-and-agriculture" style="display: inline-flex; align-items: center; background-color: #2e7d32; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.foodButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Peace Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #6B5CA5; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #6B5CA5;">🕊️</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #6B5CA5;">{texts.peaceTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.peaceDesc}
            </p>
            <a href="{base}/frameworks/tools/peace-and-conflict-resolution" style="display: inline-flex; align-items: center; background-color: #6B5CA5; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.peaceButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Justice Systems Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #1e40af; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #1e40af;">⚖️</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #1e40af;">{texts.justiceTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.justiceDesc}
            </p>
            <a href="{base}/frameworks/tools/justice-systems" style="display: inline-flex; align-items: center; background-color: #1e40af; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.justiceButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Financial Systems Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #3A6EA5; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #3A6EA5;">❤️</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #3A6EA5;">{texts.financialTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.financialDesc}
            </p>
            <a href="{base}/frameworks/tools/financial-systems" style="display: inline-flex; align-items: center; background-color: #3A6EA5; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.financialButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Work in Liberation Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #2C5282; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #2C5282;">🤝</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #2C5282;">{texts.workInLiberationTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.workInLiberationDesc}
            </p>
            <a href="{base}/frameworks/tools/work-in-liberation" style="display: inline-flex; align-items: center; background-color: #2C5282; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.workInLiberationButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Economic Framework Card (to be added to Available Resources section) -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #088F8F; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #088F8F;">💱</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #088F8F;">{texts.economicTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.economicDesc}
            </p>
            <a href="{base}/frameworks/tools/economic-integration" style="display: inline-flex; align-items: center; background-color: #088F8F; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.economicButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Planetary Health Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #1e3a8a; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #1e3a8a;">🩺</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #1e3a8a;">{texts.planetaryHealthTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.planetaryHealthDesc}
            </p>
            <a href="{base}/frameworks/tools/healthcare-governance" style="display: inline-flex; align-items: center; background-color: #1e3a8a; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.planetaryHealthButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Environmental Stewardship Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #6DAA3F; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #6DAA3F;">🌿</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #6DAA3F;">{texts.environmentalTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.environmentalDesc}
            </p>
            <a href="{base}/frameworks/tools/environmental-stewardship" style="display: inline-flex; align-items: center; background-color: #6DAA3F; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.environmentalButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Climate & Energy Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #2C8A78; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #2C8A78;">⚡</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #2C8A78;">{texts.climateTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.climateDesc}
            </p>
            <a href="{base}/frameworks/tools/climate-and-energy-governance" style="display: inline-flex; align-items: center; background-color: #2C8A78; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.climateButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Water & Sanitation Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #0369a1; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #0369a1;">💧</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #0369a1;">{texts.waterTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.waterDesc}
            </p>
            <a href="{base}/frameworks/tools/water-and-sanitation-governance" style="display: inline-flex; align-items: center; background-color: #0369a1; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.waterButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Biodiversity Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #2d5016; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #2d5016;">🦅</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #2d5016;">{texts.biodiversityTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.biodiversityDesc}
            </p>
            <a href="{base}/frameworks/tools/biodiversity-governance" style="display: inline-flex; align-items: center; background-color: #2d5016; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.biodiversityButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Animal-Welfare Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #1e40af; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #1e40af;">🐾</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #1e40af;">{texts.animalWelfareTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.animalWelfareDesc}
            </p>
            <a href="{base}/frameworks/tools/animal-welfare-governance" style="display: inline-flex; align-items: center; background-color: #1e40af; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.animalWelfareButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Education Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #2D5F2D; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #2D5F2D;">🎓</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #2D5F2D;">{texts.educationTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.educationDesc}
            </p>
            <a href="{base}/frameworks/tools/educational-systems" style="display: inline-flex; align-items: center; background-color: #2D5F2D; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.educationButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Mental Health Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #1e3a8a; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #1e3a8a;">🧠</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #1e3a8a;">{texts.mentalHealthTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.mentalHealthDesc}
            </p>
            <a href="{base}/frameworks/tools/mental-health-governance" style="display: inline-flex; align-items: center; background-color: #1e3a8a; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.mentalHealthButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Aging Population Support Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #7c2d12; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #7c2d12;">🌳</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #7c2d12;">{texts.agingTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.agingDesc}
            </p>
            <a href="{base}/frameworks/tools/aging-population-support-governance" style="display: inline-flex; align-items: center; background-color: #7c2d12; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.agingButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Digital Commons Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #6d28d9; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #6d28d9;">💻</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #6d28d9;">{texts.digitalTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.digitalDesc}
            </p>
            <a href="{base}/frameworks/tools/digital-commons" style="display: inline-flex; align-items: center; background-color: #6d28d9; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.digitalButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Religious & Spiritual Dialogue Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #9B6A8F; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #9B6A8F;">🕯️</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #9B6A8F;">{texts.spiritualTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.spiritualDesc}
            </p>
            <a href="{base}/frameworks/tools/religious-and-spiritual-dialogue-governance" style="display: inline-flex; align-items: center; background-color: #9B6A8F; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.spiritualButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Consciousness & Inner Development Framework Card -->
      <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #4c1d95; margin-bottom: 2rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center;">
          <div style="font-size: 2.5rem; color: #4c1d95;">🧘</div>
          <div style="flex: 1; min-width: 200px;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #4c1d95;">{texts.consciousnessTitle}</h2>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              {texts.consciousnessDesc}
            </p>
            <a href="{base}/frameworks/tools/consciousness-and-inner-development" style="display: inline-flex; align-items: center; background-color: #4c1d95; color: white; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
              {texts.consciousnessButton}
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Coming Soon Section -->
      <h2 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 1.5rem; color: #2B4B8C;">{texts.comingSoon}</h2>
      
      <!-- Other Frameworks Section -->
      <div style="background-color: #f0f4ff; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #2B4B8C;">{texts.otherFrameworks}</h3>
        <p style="color: #4b5563; margin-bottom: 1.5rem;">
          {texts.otherFrameworksDesc}
        </p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          
          <!-- Technology Framework -->
          <div style="background-color: white; padding: 1rem; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border-left: 3px solid #4B8AC2;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1.5rem; color: #4B8AC2;">🤖</span>
              <h4 style="font-size: 1.125rem; font-weight: 600; color: #4B8AC2; margin: 0;">{texts.technologyTitle}</h4>
            </div>
          </div>
          
          <!-- Meta-Governance Framework -->
          <div style="background-color: white; padding: 1rem; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border-left: 3px solid #5E4B8B;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1.5rem; color: #5E4B8B;">🔄</span>
              <h4 style="font-size: 1.125rem; font-weight: 600; color: #5E4B8B; margin: 0;">{texts.metaTitle}</h4>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Request & Feedback Section -->
      <div style="background-color: #e9f2e9; padding: 1.5rem; border-radius: 0.5rem; margin-top: 2rem; margin-bottom: 2rem;">
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: #2D5F2D;">{texts.requestTitle}</h3>
        <p style="color: #4b5563; margin-bottom: 1rem;">
          {texts.requestDesc} <a href="{base}/contact" style="color: #DAA520; text-decoration: underline; font-weight: 500;">{texts.contactLink}</a>
        </p>
      </div>
      
      <!-- Language switcher section -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 2rem; margin-top: 2rem;">
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #2B4B8C;">{texts.languagesTitle}</h3>
        <div style="display: flex; gap: 1rem;">
          <button on:click={() => setLocale('en')} style={getLanguageButtonStyle('en')}>
            English
          </button>
          <button on:click={() => setLocale('sv')} style={getLanguageButtonStyle('sv')}>
            Svenska
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
