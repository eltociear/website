<!-- lib/components/FrameworkComingSoon.svelte -->
<script>
  import { locale } from '$lib/i18n';
  
  // Required props
  export let frameworkName; // e.g., 'migration', 'urban', 'oceans', etc.
  export let icon = '🚧'; // Default construction icon
  
  // Optional props with defaults
  export let expectedQuarter = 'Q4 2025';
  export let features = [];
  export let description = '';
  export let themeColors = {
    primary: '#2B4B8C',
    secondary: '#6B5CA5', 
    accent: '#DAA520',
    light: '#f8f9fc'
  };
  export let contactEmail = 'frameworks@yourcompany.com';
  export let frameworksPageUrl = '/frameworks';
  
  // Track current locale
  $: currentLocale = $locale;
  
  // Framework-specific translations
  const frameworkTranslations = {
    migration: {
      en: {
        title: 'Migration & Human Mobility Framework',
        defaultDescription: "We're developing a revolutionary framework treating migration as a natural planetary force, creating fluid sovereignty systems that honor movement as life itself.",
        defaultFeatures: [
          'Global Mobility Passport and Hearts currency integration',
          'Climate Resilience Visas and ecological stewardship migration',
          'Regenerative resettlement and planetary healing programs',
          'Decolonized borders and Indigenous transit corridors',
          'Migration Justice Tribunals and reparative mobility policies'
        ]
      },
      sv: {
        title: 'Migration & mänsklig rörlighet ramverk',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som behandlar migration som en naturlig planetär kraft och skapar flytande suveränitetssystem som hedrar rörelse som själva livet.",
        defaultFeatures: [
          'Globalt rörlighetspass och Hearts-valutaintegration',
          'Klimatmotståndskraftvisa och ekologisk förvaltarmigration',
          'Regenerativ återbosättning och planetära läkningsprogram',
          'Avkoloniserade gränser och ursprungsbefolknings-transitkorridorer',
          'Migrationsrättvisetribunaler och reparativa rörlighetspolicys'
        ]
      }
    },
    gaianTrade: {
      en: {
        title: 'The Gaian Trade Framework',
        defaultDescription: "We're developing a revolutionary framework that transforms global trade from colonial extraction to regenerative exchange, treating commerce as a sacred covenant with Earth through planetary resource stewardship.",
        defaultFeatures: [
          'Digital Product & Material Passports with blockchain-verified ecological and labor justice scores',
          'Regenerative Trade Zones (RTZs) replacing extractive agreements with planetary boundary compliance',
          'Global Trade and Resource Council with Indigenous veto power and youth representation',
          'Bioregional Trade and Resource Hubs managing zero-emission ports and circular infrastructure',
          'Planetary Boundary Tariffs pricing embodied carbon, biodiversity impact, and resource depletion',
          'Global Commons Contribution system funding restoration through resource royalties',
          'Just Transition Corps supporting fossil fuel regions in developing regenerative economies',
          'Hearts currency integration enabling trade incentives within the regenerative economy'
        ]
      },
      sv: {
        title: 'Det Gaianska Handelsramverket',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som transformerar global handel från kolonialt utvinning till regenerativt utbyte, och behandlar handel som ett heligt förbund med jorden genom planetär resursförvaltning.",
        defaultFeatures: [
          'Digitala produkt- och materialpass med blockchain-verifierade ekologiska och arbetarättvisepoäng',
          'Regenerativa handelszoner (RTZ) som ersätter utvinningsavtal med planetära gränsefterlevnad',
          'Globalt handels- och resursråd med ursprungsbefolknings vetorätt och ungdomsrepresentation',
          'Bioregionala handels- och resurshub som förvaltar utsläppsfria hamnar och cirkulär infrastruktur',
          'Planetära gränstariffer som prissätter förkroppsligat kol, biologisk mångfaldseffekt och resursutarmning',
          'Globalt allmänningsbidragssystem som finansierar återställning genom resursroyalties',
          'Rättvis övergångskår som stödjer fossilbränsleregioner i att utveckla regenerativa ekonomier',
          'Hearts-valutaintegration som möjliggör handelsincitament inom den regenerativa ekonomin'
        ]
      }
    },
    synbio: {
      en: {
        title: 'Synthetic Biology & Advanced Biotech Governance',
        defaultDescription: "We're developing a comprehensive framework for governing synthetic biology and biotechnology that balances innovation with safety, equity, and respect for life's sacred complexity.",
        defaultFeatures: [
          'Global Biosafety Council with mandatory safety protocols and containment systems for engineered organisms',
          'Democratic Oversight Assembly with citizen juries and Indigenous councils holding veto power over high-risk research',
          'Universal Access Mandate ensuring life-saving biotechnology reaches all communities through compulsory licensing',
          'Rights of Nature Integration requiring ecosystem consent and integrity assessment for all bioengineering projects',
          'Biopiracy Prevention Protocols protecting traditional knowledge and genetic resources with Indigenous sovereignty',
          'Real-time Global Monitoring Network tracking engineered organisms with AI-powered early warning systems',
          'Open Knowledge Commons sharing essential research while respecting Indigenous knowledge sovereignty',
          'Precautionary Innovation Standards requiring extensive safety testing and reversibility mechanisms'
        ]
      },
      sv: {
        title: 'Syntetisk biologi & avancerad bioteknikstyrning',
        defaultDescription: "Vi utvecklar ett omfattande ramverk för att styra syntetisk biologi och bioteknik som balanserar innovation med säkerhet, rättvisa och respekt för livets heliga komplexitet.",
        defaultFeatures: [
          'Globalt biosäkerhetsråd med obligatoriska säkerhetsprotokoll och inneslutningssystem för konstruerade organismer',
          'Demokratisk tillsynsförsamling med medborgarjurys och ursprungsbefolkningsråd med vetorätt över högriskforskning',
          'Universellt tillgångsmandat som säkerställer att livräddande bioteknik når alla samhällen genom tvångslicensiering',
          'Integration av naturens rättigheter som kräver ekosystemsamtycke och integritetsbedömning för alla biotekniska projekt',
          'Protokoll för förebyggande av biopiratkopiering som skyddar traditionell kunskap och genetiska resurser med ursprungsbefolknings suveränitet',
          'Realtids globalt övervakningsnätverk som spårar konstruerade organismer med AI-drivna förvarningssystem',
          'Öppna kunskapsallmänningar som delar väsentlig forskning samtidigt som de respekterar ursprungsbefolknings kunskapssuveränitet',
          'Försiktighetsstandarder för innovation som kräver omfattande säkerhetstestning och reversiblitetsmekanismer'
        ]
      }
    },
    aubi: {
      en: {
        title: 'Adaptive Universal Basic Income (AUBI)',
        defaultDescription: "We're developing a revolutionary framework that transforms traditional UBI into a living system for enacting the Treaty for Our Only Home's social promises, channeling Hearts and Leaves currencies to nurture Right Relationship, human flourishing, and ecological restoration.",
        defaultFeatures: [
          'Four-layer payout system rooted in Indigenous wisdom: relational wealth, universal baseline, contribution bonuses, and equity supplements',
          'Hearts & Leaves dual currency rewarding care work and ecological restoration through blockchain-verified Love Ledger',
          'Social Resilience Council with 40% Indigenous representation, FPIC 2.0 protocols, and Earth Council veto power',
          'Love, Meaning & Connection Index (LMCI) replacing GDP with metrics of Right Relationship and human-land connections',
          'Hybrid fiat/Hearts baseline (70/30) ensuring economic dignity while building regenerative economy',
          'Indigenous-guided governance with ceremonial decision-making and Red Lines Clause protections',
          'Treaty integration delivering social contract promises through Pillar 4 planetary health mechanisms',
          'Global pilot program starting in Indigenous-led Bioregional Autonomous Zones with community sovereignty'
        ]
      },
      sv: {
        title: 'Adaptiv Universell Basinkomst (AUBI)',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som transformerar traditionell UBI till ett levande system för att förverkliga Fördraget för vårt enda hems sociala löften, genom att kanalisera Hearts och Leaves-valutor för att vårda rätta relationer, mänskligt välmående och ekologisk återställning.",
        defaultFeatures: [
          'Fyralagers utbetalningssystem rotat i ursprungsbefolknings visdom: relationell rikedom, universell grundnivå, bidragsbonusar och rättviseförstärkningar',
          'Hearts & Leaves dubbelvaluta som belönar omsorgsarbete och ekologisk återställning genom blockchain-verifierad Kärleksregister',
          'Social Motståndskraftsråd med 40% ursprungsbefolkningsrepresentation, FPIC 2.0-protokoll och Jordråds vetorätt',
          'Kärlek, Mening & Anknytningsindex (LMCI) som ersätter BNP med mätvärden för rätta relationer och människa-land-förbindelser',
          'Hybrid fiat/Hearts grundnivå (70/30) som säkerställer ekonomisk värdighet samtidigt som den bygger regenerativ ekonomi',
          'Ursprungsbefolknings-guidat styre med ceremoniellt beslutsfattande och Red Lines Clause-skydd',
          'Fördragsintegration som levererar sociala kontraktslöften genom Pelare 4 planetära hälsomekanismer',
          'Globalt pilotprogram som startar i ursprungsbefolknings-ledda Bioregionala Autonoma Zoner med gemenskapssuveränitet'
        ]
      }
    },
    sanctuary: {
      en: {
        title: 'The Sanctuary Accord',
        defaultDescription: "We're developing a revolutionary framework treating rest, silence, and metabolic restoration as fundamental human rights and essential civic infrastructure—protecting cognitive diversity and sacred time from extractive acceleration.",
        defaultFeatures: [
          'Four Core Pillars: Temporal sanctuaries (sacred time), Spatial sanctuaries (protected places), Attention Defense Shield (cognitive sovereignty), and Anti-Acceleration Protocols (right to slowness)',
          'Metabolic Rights Charter recognizing differential metabolic costs of neurodivergence and guaranteeing restoration access based on documented need',
          'Temporal Sanctuaries including 11-hour daily disconnect, full weekends, and quarterly Metabolic Debt Forgiveness Periods',
          'Spatial Sanctuaries with analog-only transit zones, Third Place Protection Act ensuring loitering-permitted public spaces, and sensory-friendly design standards',
          'Attention Defense Shield banning addiction architecture, requiring Cognitive Environmental Impact Assessments, and establishing Attention Reparations Fund',
          'Right to Slowness protecting professional integrity, establishing slow infrastructure standards, and anti-hustle labor protections',
          'Sanctuary Certification System (Bronze-Silver-Gold) with independent audit authority and Right of Private Action for violations',
          'Indigenous Temporal Sovereignty recognizing non-Gregorian calendars and Baseline Sanctuary Zones with full autonomy'
        ]
      },
      sv: {
        title: 'Frirumsavtalet',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som behandlar vila, tystnad och metabolisk återhämtning som grundläggande mänskliga rättigheter och väsentlig samhällsinfrastruktur—som skyddar kognitiv mångfald och helig tid från utvinningsacceleration.",
        defaultFeatures: [
          'Fyra kärnpelare: Temporala frirum (helig tid), Rumsliga frirum (skyddade platser), Uppmärksamhetsförsvarssköld (kognitiv suveränitet) och Anti-accelerationsprotokoll (rätt till långsamhet)',
          'Metabolisk rättighetsstadga som erkänner differentiella metaboliska kostnader av neurodivergering och garanterar återhämtningstillgång baserad på dokumenterat behov',
          'Temporala frirum inklusive 11-timmars daglig frånkoppling, hela helger och kvartalsvisa metaboliska skuldförlåtelseperioder',
          'Rumsliga frirum med analog-endast transitzoner, tredje plats-skyddsakt som säkerställer häng-tillåtna offentliga rum och sensorivänliga designstandarder',
          'Uppmärksamhetsförsvarssköld som förbjuder beroendearkitektur, kräver kognitiva miljökonsekvensanalyser och upprättar uppmärksamhetsreparationsfond',
          'Rätt till långsamhet som skyddar professionell integritet, etablerar långsam infrastrukturstandard och anti-stress arbetsskydd',
          'Frirumscertifieringssystem (Brons-Silver-Guld) med oberoende revisionsauktoritet och rätt till privat talan för överträdelser',
          'Ursprungsbefolknings temporär suveränitet som erkänner icke-gregorianska kalendrar och Baslinje-frirumszoner med full autonomi'
        ]
      }
    },
    phoenix: {
      en: {
        title: 'The Phoenix Protocol: Waste & Circular Economy',
        defaultDescription: "We're developing a revolutionary framework that eliminates the concept of 'waste' through superior design and regenerative systems, serving as the Material Reality operating system that transforms humanity's relationship with materials and resources.",
        defaultFeatures: [
          'Global Materials Passport System with quantum-encrypted blockchain tracking circularity, toxicity, and ecosystem impact',
          'Five Core Pillars: Design standards, reverse logistics, circular finance, community composting, and toxic phase-out protocols',
          'Material categorization from biological nutrients to monstrous hybrids targeted for elimination by 2040',
          'Virgin Material Tax and Circularity Bonds creating economic incentives for regenerative design and Global South support',
          'Community Work Teams managing organic waste through Hearts and Leaves rewards in the Love Ledger',
          'Blue Circular Economy recovering 10 million tons of ocean plastic and managing maritime waste circularity',
          'Cosmic Circularity extending principles to space manufacturing and 50% orbital debris recycling by 2040',
          'Indigenous wisdom integration through Māori whakapapa stewardship and 7-generation decision-making frameworks'
        ]
      },
      sv: {
        title: 'Fenixprotokollet: Avfall & cirkulär ekonomi',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som eliminerar begreppet 'avfall' genom överlägsen design och regenerativa system, som fungerar som Material Reality-operativsystemet som transformerar mänsklighetens relation till material och resurser.",
        defaultFeatures: [
          'Globalt materialpasssystem med kvantumkrypterat blockchain som spårar cirkularitet, toxicitet och ekosystempåverkan',
          'Fem kärnpelare: Designstandarder, omvänd logistik, cirkulär finansiering, kompostning och toxisk utfasning',
          'Materialkategorisering från biologiska näringsämnen till monstruösa hybrider med målsättning för eliminering år 2040',
          'Jungfrulig materialskatt och cirkularitetsobligationer som skapar ekonomiska incitament för regenerativ design och Global Syd-stöd',
          'Samhällsarbetsteam som hanterar organiskt avfall genom Hearts och Leaves-belöningar i Kärleksregistret',
          'Blå cirkulär ekonomi som återvinner 10 miljoner ton havsplast och hanterar maritim avfallscirkularitet',
          'Kosmisk cirkularitet som utvidgar principer till rymdtillverkning och 50% återvinning av rymdskrot år 2040',
          'Integration av ursprungsbefolknings visdom genom Māori whakapapa-förvaltning och 7-generationers beslutsramar'
        ]
      }
    },
    globalHealth: {
      en: {
        title: 'Global Health & Pandemic Security',
        defaultDescription: "We're developing a comprehensive framework that strengthens health systems, ensures equitable access to care, and builds robust pandemic prevention mechanisms rooted in solidarity, scientific cooperation, and the lessons learned from COVID-19.",
        defaultFeatures: [
          'Global Health Observatory with AI-powered early warning systems for emerging health threats',
          'Universal Health Access ensuring quality healthcare services regardless of geography or income',
          'Pandemic Prevention & Preparedness with rapid vaccine development and international coordination',
          'Open Health Research platforms accelerating medical breakthroughs while ensuring knowledge accessibility',
          'Medical Manufacturing Security through distributed production networks for emergency scaling',
          'Health System Strengthening with resilient infrastructure and workforce development',
          'One Health Approach integrating human, animal, and environmental health monitoring',
          'Climate Health Adaptation preparing systems for climate-related health impacts and displacement'
        ]
      },
      sv: {
        title: 'Global hälsa & pandemisäkerhet',
        defaultDescription: "Vi utvecklar ett omfattande ramverk som stärker hälsosystem, säkerställer rättvis tillgång till vård och bygger robusta pandemiprevention baserat på solidaritet, vetenskapligt samarbete och lärdomar från COVID-19.",
        defaultFeatures: [
          'Globalt hälsoobservatorium med AI-drivna förvarningssystem för framväxande hälsohot',
          'Universell hälsotillgång som säkerställer kvalitetsvård oavsett geografi eller inkomst',
          'Pandemiprevention & beredskap med snabb vaccinutveckling och internationell koordination',
          'Öppna hälsoforskningsplattformar som accelererar medicinska genombrott samtidigt som de säkerställer kunskapstillgänglighet',
          'Medicinsk tillverkningssäkerhet genom distribuerade produktionsnätverk för nödskalning',
          'Hälsosystemförstärkning med motståndskraftig infrastruktur och personalutveckling',
          'One Health-tillvägagångssätt som integrerar övervakning av människors, djurs och miljöhälsa',
          'Klimathälsoanpassning som förbereder system för klimatrelaterade hälsopåverkningar och förflyttning'
        ]
      }
    },
    shield: {
     en: {
       title: 'The Shield Protocol: Transnational Crime & Security',
       defaultDescription: "We're developing a comprehensive framework to prevent, disrupt, and dismantle transnational criminal networks that drain $2.2 trillion annually, using AI-powered intelligence, sovereignty-respecting cooperation, and Spiral-Aware approaches to ensure justice while respecting human dignity.",
       defaultFeatures: [
         'Global Crime Intelligence Center with AI-powered threat mapping, quantum-resistant encryption, and behavioral analysis',
         'Sovereignty safeguards including supermajority voting, cultural sensitivity protocols, and annual opt-out rights',
         'Tiered threat classification from existential risks to emergent criminal vectors with appropriate responses',
         'Global Enforcement Task Force conducting poly-jurisdictional investigations with community oversight',
         'Illicit finance disruption through asset recovery, beneficial ownership registries, and transparency certificates',
         'Spiral-Aware rehabilitation addressing consciousness stages behind criminal behavior with pro-social pathways',
         'Victim-centered justice prioritizing rescue, support, and restitution funded by seized criminal assets',
         'Sustainable funding through asset recovery (40%), sin taxes (25%), and carbon/Tobin taxes (20%)'
       ]
     },
     sv: {
       title: 'Skyddsprotokoll: Transnationell brottslighet & säkerhet',
       defaultDescription: "Vi utvecklar ett omfattande ramverk för att förebygga, störa och avveckla transnationella kriminella nätverk som dränerar 2,2 biljoner dollar årligen, med AI-driven underrättelse, suveränitetrespekterande samarbete och Spiral-medvetna tillvägagångssätt för att säkerställa rättvisa samtidigt som mänsklig värdighet respekteras.",
       defaultFeatures: [
         'Globalt brottslighetsunderrättelsecentrum med AI-driven hotmappning, kvantumresistent kryptering och beteendeanalys',
         'Suveränitetsskydd inklusive kvalificerad majoritet, kulturella känslighetsprotokoll och årliga opt-out-rättigheter',
         'Nivåindelat hotklassificeringssystem från existentiella risker till framväxande kriminella vektorer med lämpliga svar',
         'Global insatsstyrka som genomför poly-jurisdiktionella utredningar med samhällsövervakning',
         'Störning av illegal finansiering genom tillgångsåtervinning, register över verkliga ägare och transparenscertifikat',
         'Spiral-medveten rehabilitering som adresserar medvetandestadier bakom kriminellt beteende med pro-sociala vägar',
         'Offer-centrerad rättvisa som prioriterar räddning, stöd och gottgörelse finansierad av beslagtagna kriminella tillgångar',
         'Hållbar finansiering genom tillgångsåtervinning (40%), syndskatter (25%) och kol/Tobin-skatter (20%)'
       ]
     }
    },
    urban: {
      en: {
        title: 'Urban & Community Development Framework',
        defaultDescription: "We're creating a transformative framework for regenerative cities that thrive within planetary boundaries while fostering equity, resilience, and participatory governance.",
        defaultFeatures: [
          '15-minute cities with biophilic design and wildlife corridors',
          'Community land trusts and circular economy systems',
          'Universal basic services and gender-responsive urban planning',
          'Urban sanctuary networks and mental health landscapes',
          'Cross-city disaster coordination and climate adaptation infrastructure'
        ]
      },
      sv: {
        title: 'Urban & samhällsutveckling ramverk',
        defaultDescription: "Vi skapar ett transformativt ramverk för regenerativa städer som blomstrar inom planetära gränser samtidigt som de främjar rättvisa, motståndskraft och deltagande styrning.",
        defaultFeatures: [
          '15-minutersstäder med biofilisk design och vildlivskorridorer',
          'Gemenskapsjordförtroenden och cirkulära ekonomisystem',
          'Universella bastjänster och genusresponsiv stadsplanering',
          'Urbana naturskyddsnätverk och mental hälsolandskap',
          'Korsstad katastrofkoordination och klimatanpassningsinfrastruktur'
        ]
      }
    },
    soil: {
      en: {
        title: 'Soil Health & Land Use Governance Framework',
        defaultDescription: "Transforming humanity's relationship with land from extractive property to regenerative stewardship, where soil is treated as a living, sacred commons essential for all life.",
        defaultFeatures: [
          'Global Soil Health Monitoring Service with TEK integration and real-time planetary dashboard',
          'Bioregional Autonomous Zones (BAZs) with watershed governance and Indigenous authority',
          'Land Rematriation & Justice Tribunal for historical redress and stewardship reparations',
          'Global Regenerative Agriculture Fund with $50B+ transition support and risk-sharing pools',
          'Knowledge Commons Platform protecting TEK while enabling global soil wisdom sharing',
          'Regenerative Agriculture Mandates phasing out soil-degrading chemicals globally',
          'Community Land Trusts preventing speculation and ensuring commons stewardship',
          'Soil Carbon Rights Registry with community-owned credits and anti-speculation protections'
        ]
      },
      sv: {
        title: 'Markhälsa & markanvändnings-styrning ramverk',
        defaultDescription: "Transformera mänsklighetens relation till mark från utvinningsegendom till regenerativ förvaltning, där jord behandlas som en levande, helig allmänning väsentlig för allt liv.",
        defaultFeatures: [
          'Global markhälsoövervakningsservice med TEK-integration och realtids planetär dashboard',
          'Bioregionala autonoma zoner (BAZ) med vattendragsstyrning och ursprungsbefolkningsauktoritet',
          'Markåterlämnande & rättvisedomstol för historisk gottgörelse och förvaltningsreparationer',
          'Global regenerativ jordbruksfond med 50B$+ övergångsstöd och riskdelningspooler',
          'Kunskapsgemenskapsplattform som skyddar TEK samtidigt som den möjliggör global markvisdomsdelning',
          'Regenerativa jordbruksmandat som fasar ut markförstörande kemikalier globalt',
          'Gemenskapsjordförtroenden som förhindrar spekulation och säkerställer allmänning förvaltning',
          'Markkolrättighetsregister med gemenskapsägda krediter och anti-spekulationsskydd'
        ]
      }
    },
    oceans: {
      en: {
        title: 'Oceans & Marine Framework',
        defaultDescription: "We're developing a comprehensive marine framework for ocean health, sustainable fisheries, and coastal community resilience.",
        defaultFeatures: [
          'Marine ecosystem conservation and restoration',
          'Sustainable fisheries management and blue economy',
          'Ocean pollution reduction and plastic mitigation',
          'Coastal climate adaptation and resilience',
          'Indigenous-led marine stewardship programs'
        ]
      },
      sv: {
        title: 'Hav & marina ramverk',
        defaultDescription: "Vi utvecklar ett omfattande marina ramverk för havshälsa, hållbart fiske och kustsamhällens motståndskraft.",
        defaultFeatures: [
          'Bevarande och restaurering av marina ekosystem',
          'Hållbar fiskeriförvaltning och blå ekonomi',
          'Minskning av havsföroreningar och plastmittigation',
          'Klimatanpassning och motståndskraft för kustområden',
          'Ursprungsbefolknings-ledda marina förvaltningsprogram'
        ]
      }
    },
    labor: {
      en: {
        title: 'Labor & Employment Framework',
        defaultDescription: "We're building a framework for fair, dignified work in the evolving economy of the 21st century.",
        defaultFeatures: [
          'Care Bonus Pay and community work systems',
          'Shorter workweeks and flexible time arrangements',
          'Community work teams and cooperative models',
          'Green job creation and planetary stewardship',
          'Post-growth economics and care-centered work'
        ]
      },
      sv: {
        title: 'Arbete & sysselsättning ramverk',
        defaultDescription: "Vi bygger ett ramverk för rättvist, värdigt arbete i 2000-talets utvecklande ekonomi.",
        defaultFeatures: [
          'Omsorgsbonus och samhällsarbetssystem',
          'Kortare arbetsveckor och flexibla tidsarrangemang',
          'Samhällsarbetsteam och kooperativa modeller',
          'Skapande av gröna jobb och planetär förvaltning',
          'Post-tillväxtekonomi och omsorgscentrerat arbete'
        ]
      }
    },
    inclusion: {
      en: {
        title: 'Radical Disability Freedom Framework',
        defaultDescription: "Nothing About Us Without Us – A revolutionary framework reimagining governance through disability justice, centering disabled leadership to dismantle ableism and build universal design, collective care, and liberated sovereignty.",
        defaultFeatures: [
          'Global Disability Alliance with suspensive veto power over inaccessible policies',
          'Access Ombuds Network enforcing universal design with legal authority',
          'Crip Technology Labs for disabled-led innovation in AI, biotech, and assistive tech',
          'Care Cooperatives replacing exploitative systems with community-led mutual aid',
          'Ableism Tax funding reparations and accessibility infrastructure',
          'Accessibility Courts with 30-day resolutions and livestreamed proceedings',
          'Zero preventable disability deaths and 100% accessible spaces by 2040',
          'Rights of Nature integration addressing climate-induced disabilities'
        ]
      },
      sv: {
        title: 'Radikalt funktionsrättighetsfrihet ramverk',
        defaultDescription: "Inget om oss utan oss – Ett revolutionerande ramverk som omtänker styrning genom funktionsrättvisa, centrerar funktionshindersledarskap för att avskaffa ableism och bygga universell design, kollektiv omsorg och befriad suveränitet.",
        defaultFeatures: [
          'Global funktionshinderallians med suspensiv vetorätt över otillgängliga policys',
          'Tillgänglighetsombudsnätverk som genomdriver universell design med juridisk auktoritet',
          'Crip-tekniklabb för funktionshinderslett innovation inom AI, biotek och hjälpteknik',
          'Omsorgskooperativ som ersätter exploaterande system med samhällsledd ömsesidig hjälp',
          'Ableism-skatt som finansierar reparationer och tillgänglighetsinfrastruktur',
          'Tillgänglighetstribunaler med 30-dagars lösningar och livestreamade förhandlingar',
          'Noll förebyggbara funktionshinderdödsfall och 100% tillgängliga utrymmen till 2040',
          'Naturens rättigheter integration som adresserar klimatorsakade funktionshinder'
        ]
      }
    },
    gender: {
      en: {
        title: 'Gender Equality & LGBTQ+ Rights Framework',
        defaultDescription: "We're developing a framework promoting gender equality and LGBTQ+ rights across all sectors of society.",
        defaultFeatures: [
          'Intersectional policy development and implementation',
          'LGBTQ+ inclusive spaces and protection systems',
          'Economic empowerment through cooperative models',
          'Gender-responsive healthcare and rights frameworks',
          'Cultural change and anti-discrimination programs'
        ]
      },
      sv: {
        title: 'Jämställdhet & HBTQ+ rättigheter ramverk',
        defaultDescription: "Vi utvecklar ett ramverk som främjar jämställdhet och HBTQ+ rättigheter inom alla samhällssektorer.",
        defaultFeatures: [
          'Intersektionell policyutveckling och implementering',
          'HBTQ+ inkluderande utrymmen och skyddssystem',
          'Ekonomisk empowerment genom kooperativa modeller',
          'Genusresponsiva hälsovårds- och rättighetsramverk',
          'Kulturell förändring och anti-diskrimineringsprogram'
        ]
      }
    },
    culture: {
      en: {
        title: 'Cultural Heritage Preservation Framework',
        defaultDescription: "We're crafting a framework for preserving, protecting, and celebrating cultural heritage in our globalized world.",
        defaultFeatures: [
          'Digital preservation and blockchain provenance systems',
          'Indigenous stewardship and FPIC 2.0 protocols',
          'Biocultural corridors and ecosystem integration',
          'Heritage bonds and sustainable financing',
          'Global cultural exchange and education programs'
        ]
      },
      sv: {
        title: 'Kulturarvsbevarande ramverk',
        defaultDescription: "Vi utformar ett ramverk för att bevara, skydda och fira kulturarvet i vår globaliserade värld.",
        defaultFeatures: [
          'Digital bevarande och blockchain-provenienssystem',
          'Ursprungsbefolknings-förvaltning och FPIC 2.0-protokoll',
          'Biokulturella korridorer och ekosystemintegration',
          'Kulturarvsobligationer och hållbar finansiering',
          'Globala kulturutbyten och utbildningsprogram'
        ]
      }
    },
    youth: {
      en: {
        title: 'Youth & Intergenerational Framework',
        defaultDescription: "We're building a framework that empowers youth while fostering meaningful connections across generations.",
        defaultFeatures: [
          'Youth leadership in global governance',
          'Intergenerational mentorship and wisdom exchange',
          'Climate justice and environmental stewardship',
          'Digital rights and technology ethics',
          'Truth and reconciliation processes'
        ]
      },
      sv: {
        title: 'Ungdom & intergenerationell ramverk',
        defaultDescription: "Vi bygger ett ramverk som stärker ungdomar samtidigt som det främjar meningsfulla förbindelser mellan generationer.",
        defaultFeatures: [
          'Ungdomsledarskap i global styrning',
          'Intergenerationell mentorskap och visdomsutbyte',
          'Klimaträttvisa och miljöförvaltning',
          'Digitala rättigheter och tekniketik',
          'Sanning och försoningsprocesser'
        ]
      }
    },
    space: {
      en: {
        title: 'Space Framework',
        defaultDescription: "We're developing a framework for ethical, sustainable space exploration and the peaceful use of outer space.",
        defaultFeatures: [
          'Peaceful space use and planetary defense systems',
          'Sustainable orbital management and debris mitigation',
          'Equitable access and technology sharing programs',
          'Cultural heritage protection in space exploration',
          'International coordination and crisis response'
        ]
      },
      sv: {
        title: 'Rymdramverk',
        defaultDescription: "Vi utvecklar ett ramverk för etisk, hållbar rymdforskning och fredlig användning av yttre rymden.",
        defaultFeatures: [
          'Fredlig rymdanvändning och planetära försvarssystem',
          'Hållbar omloppsbaneförvaltning och skrotminskning',
          'Rättvis tillgång och teknikdelningsprogram',
          'Kulturarvsskydd inom rymdforskning',
          'Internationell koordination och krishantering'
        ]
      }
    },
    wisdom: {
      en: {
        title: 'Wisdom Framework',
        defaultDescription: "We're creating a framework that cultivates wisdom, ethical decision-making, and long-term thinking in governance and society.",
        defaultFeatures: [
          'Contemplative practices in governance and leadership',
          'Traditional knowledge integration with modern systems',
          'Long-term thinking and future generations focus',
          'Ethical decision-making frameworks and training',
          'Wisdom-based policy development and evaluation'
        ]
      },
      sv: {
        title: 'Visdomsramverk',
        defaultDescription: "Vi skapar ett ramverk som odlar visdom, etiskt beslutsfattande och långsiktigt tänkande inom styrning och samhälle.",
        defaultFeatures: [
          'Kontemplativa metoder inom styrning och ledarskap',
          'Integration av traditionell kunskap med moderna system',
          'Långsiktigt tänkande och fokus på framtida generationer',
          'Ramverk och träning för etiskt beslutsfattande',
          'Visdomsbaserad policyutveckling och utvärdering'
        ]
      }
    },
    rural: {
      en: {
        title: 'Global Rural Development Governance Framework',
        defaultDescription: "Empowering rural communities worldwide through equitable, sustainable, and participatory development rooted in dignity, self-determination, cultural integrity, ecological kinship, and justice.",
        defaultFeatures: [
          'Global Rural Development Council with Indigenous councils and youth leadership',
          'Global Fund for Rural Development targeting $50 billion over 10 years',
          'Rural Observatory with AI-assisted tools and satellite monitoring',
          'Global Rural Academy for capacity building in local languages',
          'Universal Basic Infrastructure with climate-resilient design',
          'Community-Led Conservation with payments for ecosystem services',
          'Gender-transformative approaches mandating 50% women in leadership',
          'Digital inclusion with blockchain for land rights and cybersecurity protection'
        ]
      },
      sv: {
        title: 'Global landsbygdsutvecklings-styrning ramverk',
        defaultDescription: "Stärka landsbygdsgemenskaper världen över genom rättvis, hållbar och deltagande utveckling grundad i värdighet, självbestämmande, kulturell integritet, ekologisk samhörighet och rättvisa.",
        defaultFeatures: [
          'Global landsbygdsutvecklingsråd med ursprungsbefolkningsråd och ungdomsledarskap',
          'Global fond för landsbygdsutveckling med mål på 50 miljarder dollar över 10 år',
          'Landsbygdsobservatorium med AI-assisterade verktyg och satellitövervakning',
          'Global landsbygdsakademi för kapacitetsbyggande på lokala språk',
          'Universal grundinfrastruktur med klimatmotståndskraftig design',
          'Gemenskapslett naturvård med betalningar för ekosystemtjänster',
          'Genusstransformativa tillvägagångssätt som kräver 50% kvinnor i ledarskap',
          'Digital inkludering med blockchain för markrättigheter och cybersäkerhetsskydd'
        ]
      }
    },
    synoptic: {
      en: {
        title: 'The Synoptic Protocol: Media & Epistemic Integrity',
        defaultDescription: "We're developing a revolutionary framework that transforms our global information ecosystem to foster truth-seeking, perspectival agility, and collective wisdom, protecting citizens from epistemic threats while cultivating the capacity for wise decision-making in our interconnected world.",
        defaultFeatures: [
          'Epistemic Curriculum teaching critical thinking, media literacy, and perspectival agility integrated into global education',
          'Epistemic Institution Charter creating public-funded media organizations legally bound to truth-seeking principles',
          'Algorithmic & Platform Governance mandating transparency, user choice, and epistemic circuit breakers for viral content',
          'Digital Public Square fostering healthy discourse through Bridging Dialogues and Citizen Assemblies',
          'Epistemic Justice & Accountability enforcing the Universal Right to Reality through Digital Justice Tribunal',
          'Epistemic Crisis Response with Rapid Response Teams for disinformation warfare and AI-driven deepfake threats',
          'Global Council for Epistemic Integrity with 50% Global South representation and Indigenous knowledge integration',
          'Trauma-Informed Media Literacy and Spiral-Aware Communication for constructive cross-cultural dialogue'
        ]
      },
      sv: {
        title: 'Synoptiska Protokollet: Media & epistemisk integritet',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som transformerar vårt globala informationsekosystem för att främja sanningssökande, perspektivisk smidighet och kollektiv visdom, skydda medborgare från epistemiska hot samtidigt som det odlar kapacitet för klok beslutsfattande i vår sammankopplade värld.",
        defaultFeatures: [
          'Epistemisk läroplan som undervisar kritiskt tänkande, mediekunnighet och perspektivisk smidighet integrerat i global utbildning',
          'Epistemisk institutionsstadga som skapar offentligt finansierade medieorganisationer juridiskt bundna till sanningssökande principer',
          'Algoritmisk & plattformsstyrning som kräver transparens, användarval och epistemiska strömbrytare för viralt innehåll',
          'Digitalt offentligt torg som främjar hälsosam diskurs genom överbryggande dialoger och medborgarförsamlingar',
          'Epistemisk rättvisa & ansvarighet som genomdriver den universella rätten till verklighet genom Digital rättvisedomstol',
          'Epistemisk krishantering med snabbinsatsteam för desinformationskrigföring och AI-drivna deepfake-hot',
          'Globalt råd för epistemisk integritet med 50% Global Syd-representation och ursprungsbefolknings kunskapsintegration',
          'Traumainformerad mediekunnighet och Spiral-medveten kommunikation för konstruktiv interkulturell dialog'
        ]
      }
    },
    wdip: {
      en: {
        title: 'Wise Decision-Making & Integration Protocol (WDIP)',
        defaultDescription: "We're developing the universal methodology providing the 'How' for wise decision-making across the Global Governance Framework - a compassionate guide for navigating uncertainty, integrating diverse forms of wisdom, and arriving at choices that are not merely effective, but wise, just, and regenerative.",
        defaultFeatures: [
          'Five-Phase Process from Invitation & Framing through Deep Inquiry, Synthesis, Deliberation, to Living Implementation',
          'Holistic Sensemaking integrating scientific, Indigenous, spiritual, artistic, and experiential perspectives',
          'Seven-Generation Scoping evaluating all decisions for 200+ year impacts on future generations',
          'Relational Accountability assessing choices based on their impact on relationships with all beings and Earth',
          'Precautionary Wisdom placing burden of proof on demonstrating safety for existential risks',
          'AI-Mediated Impact Simulation Tools stress-testing decisions against core principles and long-term consequences',
          'Indigenous & Spiritual Council consultation with traditional knowledge and ceremonial guidance',
          'Adaptive Implementation with reflexivity engines and learning loops for continuous course correction'
        ]
      },
      sv: {
        title: 'Kloka Besluts- & Integrationsprotokoll (WDIP)',
        defaultDescription: "Vi utvecklar den universella metodik som tillhandahåller 'Hur' för kloka beslut inom Global Governance Framework - en medkänslig guide för att navigera osäkerhet, integrera olika former av visdom och komma fram till val som inte bara är effektiva, utan kloka, rättvisa och regenerativa.",
        defaultFeatures: [
          'Fem-fas process från Inbjudan & Inramning genom Djup utredning, Syntes, Deliberation till Levande implementering',
          'Holistisk meningsskapande som integrerar vetenskapliga, ursprungsbefolknings-, andliga, konstnärliga och erfarenhetsbaserade perspektiv',
          'Sju-generationers omfattning som utvärderar alla beslut för 200+ års påverkan på framtida generationer',
          'Relationell ansvarighet som bedömer val baserat på deras påverkan på relationer med alla varelser och jorden',
          'Försiktig visdom som placerar bevisbördan på att visa säkerhet för existentiella risker',
          'AI-medierade påverkanssimuleringsverktyg som stresstestade beslut mot kärnprinciper och långsiktiga konsekvenser',
          'Ursprungsbefolknings- & andliga rådskonsultation med traditionell kunskap och ceremoniell vägledning',
          'Adaptiv implementering med reflexivitetsmotorer och inlärningsslingor för kontinuerlig kursjustering'
        ]
      }
    },
    regenerativeEnterprise: {
      en: {
        title: 'Regenerative Enterprise Framework',
        defaultDescription: "A revolutionary framework transforming businesses from extractive to regenerative models, aligning corporate purpose with planetary well-being. Through six comprehensive modules, we're redefining governance, operations, finance, culture, and advocacy to heal ecosystems, equitably distribute value, and foster human flourishing.",
        defaultFeatures: [
          'Module 0: Digital Foundations with Ethical AI Governance through Turing Councils and regenerative digital twins',
          'Module 1: Regenerative Core with stakeholder governance, steward-ownership models, and Rights of Nature integration',
          'Module 2: Regenerative Operations featuring circular design, Digital Product Passports, and ecological impact accounting',
          'Module 3: Equitable Finance with Hearts/Leaves currencies, community wealth building, and living asset depreciation',
          'Module 4: Thriving Cultures achieving Work in Liberation certification with psychological safety and flexible arrangements',
          'Module 5: Ecosystemic Engagement through Regenerative Trade Zone charters and open-source Patent Commons',
          'Pathfinder Program implementation pathway from exploration to systemic leadership over 2-4 years',
          'Integration with Global Governance Frameworks including AUBI, Gaian Trade, and Aurora Accord systems'
        ]
      },
      sv: {
        title: 'Ramverk för regenerativa företag',
        defaultDescription: "Ett revolutionerande ramverk som transformerar företag från utvinningsmodeller till regenerativa modeller, och anpassar företagssyfte med planetär välmående. Genom sex omfattande moduler omdefinierar vi styrning, verksamhet, finans, kultur och advocacy för att läka ekosystem, rättvist fördela värde och främja mänskligt välmående.",
        defaultFeatures: [
          'Modul 0: Digitala grunder med etisk AI-styrning genom Turing-råd och regenerativa digitala tvillingar',
          'Modul 1: Regenerativ kärna med intressentstyrning, förvaltarägarskap och integration av naturens rättigheter',
          'Modul 2: Regenerativ verksamhet med cirkulär design, digitala produktpass och ekologisk påverkansbokföring',
          'Modul 3: Rättvis finans med Hearts/Leaves-valutor, samhällsvälstånd och levande tillgångsavskrivning',
          'Modul 4: Blomstrande kulturer som uppnår arbete-i-befrielse-certifiering med psykologisk säkerhet och flexibla arrangemang',
          'Modul 5: Ekosystemiskt engagemang genom regenerativa handelszon-stadgar och öppen källkods gemensamma patent',
          'Implementeringsväg av stigfinnarprogram, från utforskning till systemiskt ledarskap över 2-4 år',
          'Integration med Global Governance Frameworks inklusive AUBI, Gaian Trade och Aurora Accord-system'
        ]
      }
    },
    existential: {
      en: {
        title: 'Global Existential Risk Governance Framework',
        defaultDescription: "The IPCC for All Existential Risks - a comprehensive governance framework for preventing, mitigating, and building resilience against global catastrophic threats to humanity's survival, from AI misalignment to climate collapse.",
        defaultFeatures: [
          'Existential Risk Observatory (ERO) with AI-driven risk assessment and public dashboard',
          'Existential Security Council (UN-ESC) with veto power for global catastrophic risk resolutions',
          'Tiered risk classification system from high-priority actionable risks to watchlist monitoring',
          'AI Safety Accord with moratorium on unaligned AGI until 2040 and alignment enforcement',
          'Pandemic Radar using federated learning for privacy-preserving genomic surveillance',
          'Space Governance Body coordinating asteroid deflection and extraterrestrial risk protocols',
          'World Risk Assembly with citizen juries and Global South representation',
          'Existential Civics education for 100M people by 2030 with epistemic security training',
          'Mobile GERG Risk App providing real-time risk exposure and resilience data',
          'Global Response Teams with Interpol-like jurisdiction and oversight tribunal protection'
        ]
      },
      sv: {
        title: 'Global existentiell risk-styrning ramverk',
        defaultDescription: "IPCC för alla existentiella risker - ett omfattande styrningsramverk för att förebygga, mildra och bygga motståndskraft mot globala katastrofala hot mot mänsklighetens överlevnad, från AI-missanpassning till klimatkollaps.",
        defaultFeatures: [
          'Existentiell riskobservatorium (ERO) med AI-driven riskbedömning och offentlig dashboard',
          'Existentiell säkerhetsråd (UN-ESC) med vetorätt för globala katastrofala riskresolutioner',
          'Nivåindelat riskklassificeringssystem från högprioriterade åtgärdbara risker till bevakningslista',
          'AI-säkerhetsavtal med moratorium på ej-anpassad AGI till 2040 och anpassningsövervakning',
          'Pandemi-radar med federerad inlärning för integritetsskyddande genomisk övervakning',
          'Rymdstyrningsorgan som koordinerar asteroidavböjning och utomjordiska riskprotokoll',
          'Världsriskförsamling med medborgarjurys och Global Syd-representation',
          'Existentiell medborgarundervisning för 100M människor till 2030 med epistemisk säkerhetsträning',
          'Mobil GERG Risk-app som ger realtids-riskexponering och motståndskraftsdata',
          'Globala insatsteam med Interpol-liknande jurisdiktion och övervakningsdomstolsskydd'
        ]
      }
    },
    mobilityCommons: {
      en: {
        title: 'The Mobility Commons: Regenerative Transportation & Mobility Framework',
        defaultDescription: "We're developing a revolutionary framework that reimagines transportation as a regenerative, equitable, and shared global resource, integral to human flourishing and planetary coordination. This Tier 2 Life Support System establishes a fossil-free, universally accessible mobility system through Indigenous sovereignty, bioregional governance, and emergent technologies.",
        defaultFeatures: [
          'Global Mobility Council (GMC) with Indigenous leadership, youth veto power, and ceremonial governance protocols',
          'Global Pathways Initiative: high-speed rail networks, sustainable maritime corridors, and living infrastructure',
          'Mobility as a Service (MaaS) Commons with AI optimization for Biosphere Health Index and Indigenous knowledge',
          'Hearts & Leaves integration rewarding sustainable transport use through the Love Ledger system',
          'Climate Migration Transportation Corridors and Disaster Response Mobile Units for crisis resilience',
          'Universal Access Audits ensuring disability justice and bioregional integration with wildlife corridors',
          'Transportation Reparations Fund addressing spatial injustice and supporting community ownership models',
          'Mobility Innovation Commons for speculative technologies (levitation, consciousness-assisted navigation)',
          'Sacred Timing & Landscape Consciousness respecting ceremonial calendars and ancestral pathways',
          'Right to Movement Charter enforceable by Digital Justice Tribunal with green displacement protections'
        ]
      },
      sv: {
        title: 'Rörlighetsallmänningen: Regenerativ transport & rörlighetsramverk',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som omtänker transport som en regenerativ, rättvis och delad global resurs, integrerad med mänskligt välmående och planetär koordination. Detta Tier 2 livsstödssystem etablerar ett fossilfritt, universellt tillgängligt rörlighetssystem genom ursprungsbefolkningssuveränitet, bioregional styrning och framväxande teknologier.",
        defaultFeatures: [
          'Global rörlighetsråd (GMC) med ursprungsbefolkningsledarskap, ungdomsvetorätt och ceremoniella styrningsprotokoll',
          'Global väginitiativ: höghastighetsjärnvägsnätverk, hållbara maritima korridorer och levande infrastruktur',
          'Rörlighet som en tjänst (MaaS) allmänning med AI-optimering för Biosfärhälsoindex och ursprungsbefolkningskunskap',
          'Hearts & Leaves-integration som belönar hållbar transportanvändning genom Kärleksregistersystemet',
          'Klimatmigrationstransportkorridorer och katastrofresponsmobila enheter för krishanteringskapacitet',
          'Universell tillgänglighetsrevision som säkerställer funktionshinderrättvisa och bioregional integration med vildlivskorridorer',
          'Transportreparationsfond som adresserar rumslig orättvisa och stödjer gemenskapsägarskapsmodeller',
          'Rörlighetsallmänning för innovation för spekulativa teknologier (levitation, medvetenhetsassisterad navigation)',
          'Helig timing & landskapsmedvetenhet som respekterar ceremoniella kalendrar och förfädersvägar',
          'Rätt till rörelse-stadga som kan verkställas av Digital rättvisedomstol med skydd mot grön förskjutning'
        ]
      }
    },
    millenniumProtocol: {
      en: {
        title: 'The Millennium Protocol',
        defaultDescription: "We're developing a supreme Tier 4 constitutional charter for guiding humanity's evolution into a responsible, wise, and participatory cosmic civilization over deep time. This framework ensures unity, survival, ethical flourishing, and universal joy across millennia and interstellar space, rooted in wisdom, humility, and the recognition that consciousness evolution may be a primary cosmic purpose.",
        defaultFeatures: [
          'Deep Time Governance Architecture with Interstellar Commission and Generational Continuity Framework',
          'Cosmic Civilization Charter including Prime Directive Protocol and Post-Contact Governance Framework',
          'Interstellar Economic & Resource Governance with Cosmic Commons and post-scarcity transition protocols',
          'Species Evolution & Transcendence Governance for human enhancement, AI rights, and consciousness evolution',
          'Cosmic Wisdom & Purpose framework defining humanity\'s role in universal consciousness development',
          'The Great Unknown governance for incomprehensible discoveries like simulation escape and divine contact',
          'Temporal & Universe-Scale Governance including Chronocide prevention and Heat Death preparation',
          'Light-Speed Democracy Protocols and Constitutional mechanisms for multi-generational space voyages',
          'Cosmic Heritage Protection and Universal Knowledge Preservation across galactic timescales',
          'Implementation through Deep Time Layers from current-century actionables to end-of-universe preparation'
        ]
      },
      sv: {
        title: 'Millenniumprotokollet',
        defaultDescription: "Vi utvecklar en högsta Tier 4 konstitutionell stadga för att vägleda mänsklighetens evolution till en ansvarsfull, vis och deltagande kosmisk civilisation över djup tid. Detta ramverk säkerställer enhet, överlevnad, etiskt blomstrande och universell glädje över millennier och interstellärt rum, grundat i visdom, ödmjukhet och erkännandet att medvetandeutveckling kan vara ett primärt kosmiskt syfte.",
        defaultFeatures: [
          'Djuptids-styrningsarkitektur med Interstellär kommission och Generationsfortsättningsramverk',
          'Kosmisk civilisationsstadga inklusive Primära direktiv-protokoll och Post-kontakt styrningsramverk',
          'Interstellär ekonomisk & resursstyrning med Kosmisk allmänning och post-briststyrningsprotokoll',
          'Artevolution & transcendensstyrning för mänsklig förbättring, AI-rättigheter och medvetandeutveckling',
          'Kosmisk visdom & syfte-ramverk som definierar mänsklighetens roll i universell medvetandeutveckling',
          'Det Stora Okända-styrning för obegripliga upptäckter som simulationsflykt och gudomlig kontakt',
          'Temporal & universell skala-styrning inklusive Chronocide-förebyggande och Värmeddöd-förberedelse',
          'Ljushastighetssdemokrati-protokoll och Konstitutionella mekanismer för multigenerationsrymdresor',
          'Kosmiskt arvsskydd och Universell kunskapsbevarande över galaktiska tidsramar',
          'Implementering genom Djuptidslagre från nuvarande århundrade-åtgärder till slutet-av-universum förberedelse'
        ]
      }
    },
    regenerativeJourneys: {
      en: {
        title: 'The Regenerative Journeys Framework',
        defaultDescription: "We're developing a revolutionary framework that transforms tourism from extractive practice to sacred exchange, healing communities, restoring ecosystems, and fostering reciprocal relationships between guests and hosts through Indigenous sovereignty, bioregional governance, and regenerative design.",
        defaultFeatures: [
          'BAZ Tourism Councils with Indigenous leadership, youth representation, and community veto power over tourism decisions',
          'Guest Hearts currency rewarding regenerative travel choices through certified local businesses and restoration projects',
          'Climate-adaptive dual-purpose infrastructure serving both tourists and climate migrants with community-first design',
          'Sacred Journey Protocols protecting Indigenous sites with FPIC 2.0, ceremonial calendar integration, and anti-commodification safeguards',
          'Tourism Impact Assessments measuring Biosphere Health Index, cultural continuity, and seven-generation impacts',
          'Dynamic Regenerative Tourism Levy funding ecosystem restoration, community healing, and youth innovation projects',
          'Climate Migration Integration with diaspora tourism protocols and managed retreat planning for vulnerable regions',
          'Decolonization Scorecard tracking land rematriation, language preservation, and Indigenous economic sovereignty'
        ]
      },
      sv: {
        title: 'Det Regenerativa Reseramverket',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som transformerar turism från utvinningspraktik till heligt utbyte, läker samhällen, återställer ekosystem och främjar ömsesidiga relationer mellan gäster och värdar genom ursprungsbefolkningssuveränitet, bioregional styrning och regenerativ design.",
        defaultFeatures: [
          'BAZ-turisråd med ursprungsbefolkningsledarskap, ungdomsrepresentation och gemenskapsvetorätt över turismsbeslut',
          'Guest Hearts-valuta som belönar regenerativa reseval genom certifierade lokala företag och återställningsprojekt',
          'Klimatadaptiv infrastruktur med dubbla syften som tjänar både turister och klimatmigranter med samhällsförstadesign',
          'Heliga reseprotokoll som skyddar ursprungsbefolkningsplatser med FPIC 2.0, ceremoniell kalenderintegration och anti-kommodifieringsskydd',
          'Turismeffektbedömningar som mäter Biosfärhälsoindex, kulturell kontinuitet och sjugenerationseffekter',
          'Dynamisk regenerativ turismalavgift som finansierar ekosystemåterställning, samhällsläkning och ungdomsinnovationsprojekt',
          'Klimatmigrationsintegration med diasporaturismprotokoll och förvaltad reträttplanering för sårbara regioner',
          'Avkoloniseringsscorekort som spårar markåterlämnande, språkbevarande och ursprungsbefolknings ekonomisk suveränitet'
        ]
      }
    },
    deepTime: {
      en: {
        title: 'Deep Time & Relativistic Governance Framework',
        defaultDescription: "We're developing a visionary framework governing relativistic, causal, and temporal ethics for a multi-planetary civilization, as required by the Millennium Protocol. This advanced system includes governance of temporal paradoxes, deep time decision-making, light-speed democracy protocols, and causality preservation laws for humanity's cosmic future.",
        defaultFeatures: [
          'Relativistic Coordination with Light-Speed Democracy Protocols maintaining consent across interstellar colonies with time dilation',
          'Causality & Communication Governance managing faster-than-light communication and causality disruption prevention',
          'Temporal Justice & Ethics with legal frameworks for time travel governance and historical timeline protection',
          'Butterfly Courts specialized chamber of Digital Justice Tribunal with jurisdiction over Chronocide temporal crimes',
          'Quantum Governance Lab researching causality preservation laws and relativistic governance mechanisms',
          'Cross-Temporal Coordination enabling governance systems across linear, cyclical, and ceremonial timeframes',
          'Multi-Horizon Decision Protocols weighting decisions across crisis, decadal, and seven-generation impacts',
          'Temporal Impact Assessments evaluating all decisions for immediate, generational, and deep-time consequences',
          'Emergency Temporal Override protocols for crisis situations with strict safeguards and post-crisis healing',
          'Indigenous Temporal Sovereignty Charter recognizing rights to seasonal, cyclical, and ceremonial governance'
        ]
      },
      sv: {
        title: 'Djup tid & relativistisk styrningsramverk',
        defaultDescription: "Vi utvecklar ett visionärt ramverk som styr relativistiska, kausala och temporala etik för en multi-planetär civilisation, som krävs av Millenniumprotokollet. Detta avancerade system inkluderar styrning av temporala paradoxer, djuptidsbeslut, ljuhastighetssdemokratiprotokoll och kausalitetsbevarande lagar för mänsklighetens kosmiska framtid.",
        defaultFeatures: [
          'Relativistisk koordination med ljuhastighetssdemokratiprotokoll som upprätthåller samtycke över interstellära kolonier med tidsdilatation',
          'Kausalitet & kommunikationsstyrning som hanterar snabbare-än-ljus kommunikation och kausalitetsstörningsförebyggande',
          'Temporal rättvisa & etik med juridiska ramverk för tidsresestyrning och historisk tidslinjeskydd',
          'Fjärilsdomstolar specialiserad kammare av Digital rättvisedomstol med jurisdiktion över Chronocide temporala brott',
          'Kvantumstyrningslabb som forskar om kausalitetsbevarande lagar och relativistiska styrningsmekanismer',
          'Kross-temporal koordination som möjliggör styrningssystem över linjära, cykliska och ceremoniella tidsramar',
          'Multi-horisont beslutsprotokoll som väger beslut över kris-, decennal- och sjugenerationseffekter',
          'Temporala effektbedömningar som utvärderar alla beslut för omedelbara, generationella och djuptidskonsekvenser',
          'Nödsituation temporal överridning protokoll för krissituationer med strikta skydd och post-kris läkning',
          'Ursprungsbefolknings temporal suveränitetsstadga som erkänner rättigheter till säsongs-, cyklisk och ceremoniell styrning'
        ]
      }
    },
    sanctuaryAccord: {
      en: {
        title: 'The Sanctuary Accord: Consciousness Technology Governance',
        defaultDescription: "We're developing a revolutionary framework creating a sacred sanctuary for ethical consciousness technology governance. This Tier 2 framework ensures that psychedelics, neuro-technologies, AI-driven consciousness environments, and other modalities are developed with reverence, safety, and justice through Indigenous sovereignty, community oversight, and regenerative economics.",
        defaultFeatures: [
          'Neuro-Ethics Review Board with Indigenous co-leadership and trauma-informed safety protocols',
          'Sacred Knowledge & Ceremonial Sovereignty protecting traditional wisdom through FPIC 2.0',
          'Red Lines Clause allowing Indigenous communities absolute veto power over sacred plant research',
          'BAZ-level Sanctuary Councils providing decentralized community-led governance and licensing',
          'Sacred Reciprocity License ensuring fair economic flows back to originating communities',
          'Digital Justice Tribunal enforcement with restorative justice and cultural protection',
          'Cognitive Equity Mandate ensuring accessibility for neurodivergent individuals',
          'Anti-Biopiracy protections preventing unauthorized extraction of traditional knowledge'
        ]
      },
      sv: {
        title: 'Sanctuarieöverenskommelsen: Medvetandeteknologistyrning',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som skapar en helig fristad för etisk medvetandeteknologi-styrning. Detta Tier 2-ramverk säkerställer att psykedelika, neuroteknologier, AI-drivna medvetandemiljöer och andra modaliteter utvecklas med vördnad, säkerhet och rättvisa genom ursprungsbefolkningssuveränitet, samhällsövervakning och regenerativ ekonomi.",
        defaultFeatures: [
          'Neuroetisk granskningsnämnd med ursprungsbefolknings medledarskap och traumainformerade säkerhetsprotokoll',
          'Helig kunskap & ceremoniell suveränitet som skyddar traditionell visdom genom FPIC 2.0',
          'Röda linjer-klausul som ger ursprungsbefolkningsgemenskaper absolut vetorrätt över helig växtforskning',
          'BAZ-nivå Sanctuarie-råd som tillhandahåller decentraliserad gemenskapsledd styrning och licensiering',
          'Helig ömsesidighets-licens som säkerställer rättvisa ekonomiska flöden tillbaka till ursprungsgemenskaper',
          'Digital rättvisedomstol verkställighet med återställande rättvisa och kulturskydd',
          'Kognitiv rättvisemandat som säkerställer tillgänglighet för neurodivergenta individer',
          'Anti-biopiratskydd som förhindrar obehörig utvinning av traditionell kunskap'
        ]
      }
    },
    hearthstoneProtocol: {
      en: {
        title: 'The Hearthstone Protocol: A Framework for Commons & Stewardship',
        defaultDescription: "We're developing a revolutionary framework providing the legal, ethical, and practical pathways for a just transition from private, extractive ownership to shared, regenerative stewardship. This framework is the bridge that enables land, capital, and enterprise to be returned to the commons as sacred trusts governed for the well-being of all beings and future generations.",
        defaultFeatures: [
          'Stewardship Trusts replacing corporate ownership with regenerative governance and stakeholder councils',
          'Land Rematriation Initiative returning ecologically significant land to Indigenous stewardship through BAZs',
          'Commons Title Registry with blockchain-based tracking integrated with the Love Ledger system',
          'Bio-Cultural Stewardship Trusts for assets where ecology and culture are inseparable',
          'Sacred Trust Designation Process led by Earth Council for inalienable spiritual and cultural sites',
          'Corporate Co-op Conversion pathways with incentives for voluntary transition to stewardship models',
          'Commons Dividend Protocol distributing surplus as Hearts and Leaves through regenerative performance',
          'International Commons Court providing specialized dispute resolution within Digital Justice Tribunal',
          'Rematriation Legal Protocol with tiered enforcement from negotiation to trade sanctions',
          'Youth Stewardship Fellowship empowering next generation with veto power over intergenerational decisions'
        ]
      },
      sv: {
        title: 'Hearthstone-protokollet: Ett ramverk för allmänning & förvaltning',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som tillhandahåller de juridiska, etiska och praktiska vägarna för en rättvis övergång från privat, utvinningsägarskap till delad, regenerativ förvaltning. Detta ramverk är bryggan som möjliggör att mark, kapital och företag återlämnas till allmänningen som heliga förtroenden styrda för alla varelsers och framtida generationers välbefinnande.",
        defaultFeatures: [
          'Förvaltningsförtroenden som ersätter företagsägarskap med regenerativ styrning och intressentråd',
          'Markåterlämnande-initiativ som återlämnar ekologiskt betydelsefull mark till ursprungsbefolknings förvaltning genom BAZ',
          'Allmänningstitellregister med blockchain-baserad spårning integrerat med Kärleksregistersystemet',
          'Bio-kulturella förvaltningsförtroenden för tillgångar där ekologi och kultur är oskiljaktiga',
          'Helig förtroendedesignation ledd av Jordrådet för oförytterliga andliga och kulturella platser',
          'Företags-koop konverteringsvägar med incitament för frivillig övergång till förvaltningsmodeller',
          'Allmänningsdividendprotokoll som distribuerar överskott som Hearts och Leaves genom regenerativ prestanda',
          'Internationell allmänningsdomstol som tillhandahåller specialiserad tvistlösning inom Digital rättvisedomstol',
          'Återlämnande juridiskt protokoll med nivåindelad verkställighet från förhandling till handelssanktioner',
          'Ungdomsförvaltningsstipendium som stärker nästa generation med vetorätt över intergenerationella beslut'
        ]
      }
    },
    artsFlourishing: {
      en: {
        title: 'Creative & Arts Flourishing Framework (The Muse Protocol)',
        defaultDescription: "We're developing a revolutionary framework that moves beyond preserving past art to catalyzing the creative flourishing of the present and future. Art is not a luxury but a vital organ of our collective body—a medium for metabolizing grief, envisioning futures, weaving the sacred into communities, and healing historical and ecological traumas through cultural sovereignty, justice, and regenerative creativity.",
        defaultFeatures: [
          'Global Arts Council with Indigenous storytellers, Bioregional Arts Hub representatives, and Arts Ombudsperson for cultural harm',
          'Global Arts Commons with decentralized digital repository using Holochain for provenance and Traditional Knowledge Protection Protocols',
          'Bioregional Arts Hubs managing Hearts grants, physical commons spaces, Artistic Emergency Response teams, and Eco-Anxiety Healing Circles',
          'Aesthetic Impact Assessments for major GGF projects evaluating community sense of place, beauty, story, and ecological connection',
          'Cultural Consent License requiring non-Indigenous artists to secure agreements with local elders specifying motif usage and royalties',
          'Hearts economy rewarding creative work through community engagement, peer validation, and commons contribution with sliding scale',
          'Art-based restorative justice, cultural trauma healing, and climate grief programs integrated with mental health frameworks',
          'Cultural Mycelium Mapping using Neo4j/ArangoDB to visualize and strengthen artist-community networks and connections',
          'Land-Based Art Programs celebrating soil health and microbial commons through artist-farmer-Indigenous steward collaboration',
          'Creative Mentorship Loops pairing youth digital artists with traditional craft elders tracked via the Commons platform'
        ]
      },
      sv: {
        title: 'Kreativ & konstnärlig blomstring ramverk (Musprotokoll)',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som går bortom att bevara tidigare konst till att katalysera kreativ blomstring av nutid och framtid. Konst är inte en lyx utan ett vitalt organ i vår kollektiva kropp—ett medium för att metabolisera sorg, föreställa framtider, väva det heliga in i gemenskaper och läka historiska och ekologiska trauman genom kulturell suveränitet, rättvisa och regenerativ kreativitet.",
        defaultFeatures: [
          'Globalt konstråd med ursprungsbefolknings berättare, Bioregionala konsthub-representanter och Konstombudsman för kulturell skada',
          'Global konstallmänning med decentraliserat digitalt arkiv som använder Holochain för provenienser och Traditionell kunskapsschutzprotokoll',
          'Bioregionala konsthub som förvaltar Hearts-bidrag, fysiska allmänningsutrymmen, Konstnärliga akutinsatsteam och Eko-ångest läkningscirklar',
          'Estetiska effektbedömningar för stora GGF-projekt som utvärderar gemenskapskänsla för plats, skönhet, berättelse och ekologisk koppling',
          'Kulturell samtyckelicens som kräver att icke-ursprungsbefolknings konstnärer säkrar avtal med lokala äldre som specificerar motivanvändning och royalties',
          'Hearts-ekonomi som belönar kreativt arbete genom gemenskapsengagemang, kamratvalidering och allmänningsbidrag med glidande skala',
          'Konstbaserad återställande rättvisa, kulturell traumaläkning och klimatsorgprogram integrerade med mental hälsoramverk',
          'Kulturell mykorrhiza-mappning med Neo4j/ArangoDB för att visualisera och stärka konstnär-gemenskapsnätverk och förbindelser',
          'Markbaserade konstprogram som firar markhälsa och mikrobförbindelser genom konstnär-bonde-ursprungsbefolknings förvaltarsamarbete',
          'Kreativa mentorskapsslingor som parar ungdomsdigitalkonstnärer med traditionella hantverksmästare spårade via Commons-plattformen'
        ]
      }
    },
    sundownProtocol: {
      en: {
        title: 'The Sundown Protocol: Just Transition Framework',
        defaultDescription: "We're developing a revolutionary framework for retiring harmful industries and rebirthing regenerative futures. This compassionate, enforceable process ensures workers, communities, and ecosystems are protected while positioning first-movers as global leaders in the transition to a regenerative economy.",
        defaultFeatures: [
          'Planetary Health Council triggers with BHI thresholds and binding industry sunset timelines',
          'Office of Just Transition managing end-to-end roadmaps with community co-creation and worker protection',
          'Legacy Transition Fund with Reparations Levy, Transition Bonds, and Children\'s Future Fund allocation',
          'Worker & Community Protection Covenant guaranteeing income bridges, retraining, and lifetime healthcare',
          'Indigenous-led monitoring teams with FPIC 2.0 protocols and Sacred Site Remediation Guidelines',
          'Cultural healing through Legacy Councils, ceremonial closure rituals, and Global Transition Story Archive',
          'Asset transfer to Stewardship Trusts and BAZ rematriation via Hearthstone Protocol integration',
          'International enforcement through Digital Justice Tribunal sanctions and trade protection measures'
        ]
      },
      sv: {
        title: 'Sundown-protokollet: Rättvis övergångsramverk',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk för att avveckla skadliga industrier och återfödda regenerativa framtider. Denna medkänsliga, verkställbara process säkerställer att arbetare, samhällen och ekosystem skyddas samtidigt som tidiga aktörer positioneras som globala ledare i övergången till en regenerativ ekonomi.",
        defaultFeatures: [
          'Planetärt hälsoråd utlöser med BHI-trösklar och bindande industriavvecklingstidslinjer',
          'Kontor för rättvis övergång som förvaltar end-to-end färdplaner med samhällsskapande och arbetarskydd',
          'Legacy-övergångsfond med reparationslager, övergångsobligationer och barnens framtidsfondallokering',
          'Arbetar- och samhällsskyddsförbund som garanterar inkomstbryggor, omskolning och livslång hälsovård',
          'Ursprungsbefolknings-ledda övervakningsteam med FPIC 2.0-protokoll och heliga platser återställningsriktlinjer',
          'Kulturell läkning genom arvslega råd, ceremoniella stängningsritualer och globalt övergångsberättelsearkiv',
          'Tillgångsöverföring till förvaltningsförtroenden och BAZ-återlämnande via Hearthstone Protocol-integration',
          'Internationell verkställighet genom Digital rättvisedomstol sanktioner och handelsskyddsåtgärder'
        ]
      }
    },
    prometheusProtocol: {
      en: {
        title: 'The Prometheus Protocol: Pharmaceutical & Biotech Commons',
        defaultDescription: "We're developing a revolutionary framework that transforms medicine from profit-driven monopolies to a healing commons where knowledge flows freely, communities thrive, and no one is left behind. Like Prometheus sharing fire, we're rekindling humanity's sacred flame of shared healing through open research, community ownership, and Indigenous sovereignty.",
        defaultFeatures: [
          'Global Pharmaceutical Stewardship Council with Indigenous co-leadership and community priority-setting power',
          'Pharmaceutical IP Commons using Stewardship Trusts to share patents, data, and know-how as public goods',
          'Distributed Manufacturing Network with 70% Global South community-owned hubs by Year 5',
          'Community Health Legions delivering medicines via blockchain Rx coupons and drone corridors earning Hearts',
          'Indigenous sovereignty protection with FPIC 2.0 binding veto power and 15% revenue sharing',
          'Discovery Commons open-science pipeline with crowdsourced formulary and AI-assisted safety reviews',
          'Pharmaceutical Colonialism Reparations Fund from industry levies funding global health equity',
          'Crisis response with pandemic fire drills, emergency stockpiling, and viral open access triggers'
        ]
      },
      sv: {
        title: 'Prometeus-protokollet: Läkemedels & biotekallmänning',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som transformerar medicin från profitdrivna monopol till en läkningsallmänning där kunskap flöder fritt, samhällen blomstrar och ingen lämnas efter. Som Prometeus som delade eld, återupptänder vi mänsklighetens heliga låga av delad läkning genom öppen forskning, gemenskapsägarskap och ursprungsbefolkningssuveränitet.",
        defaultFeatures: [
          'Global läkemedelsförvaltningsråd med ursprungsbefolknings medledarskap och gemenskapsprioriteringsmakt',
          'Läkemedels-IP-allmänning med förvaltningsförtroenden för att dela patent, data och know-how som kollektiva nyttigheter',
          'Distribuerat tillverkningsnätverk med 70% Global Syd gemenskapsägda nav år 5',
          'Gemenskapshälsolegioner levererar mediciner via blockchain Rx-kuponger och dronkorridorer som tjänar Hearts',
          'Ursprungsbefolkningssuveränitetsskydd med FPIC 2.0 bindande vetorätt och 15% intäktsdelning',
          'Discovery Commons öppen-vetenskaps pipeline med crowdsourcad formulär och AI-assisterad säkerhetsgranskning',
          'Läkemedelskolonialism reparationsfond från industriavgifter som finansierar global hälsorättvisa',
          'Krishantering med pandemibrandövningar, nödförråd och viral öppen tillgång triggers'
        ]
      }
    },
    implementationAdaptation: {
      en: {
        title: 'The GGF Implementation & Adaptation Framework',
        defaultDescription: "We're developing the GGF's primary 'operating manual,' providing a clear, adaptable, and ethically-grounded pathway for any community, institution, or network to successfully implement GGF frameworks. This framework is the bridge between the GGF's visionary 'what' and the practical, real-world 'how.'",
        defaultFeatures: [
          'Three-Stage Implementation Pathway: Context Assessment, Pathway Selection, and Piloting & Learning cycles',
          'Journey-Based Tool Stacks with pre-configured bundles for common scenarios like Getting Started, Crisis Response, and Regenerative Economy',
          'Anti-Colonial Design ensuring every process decenters Western paradigms and adapts to diverse governance traditions',
          'Low-Tech First principle with analog versions of all tools to guarantee universal accessibility',
          'GGF Catalyst Team providing training, toolkit maintenance, and direct community support',
          'Community of Practice peer-to-peer networks for sharing adaptations and lessons learned',
          'GGF Failure Library anonymizing and sharing learnings from challenging implementations',
          'Radical Transparency with all pilot results and adaptation reports publicly accessible on Digital Commons'
        ]
      },
      sv: {
        title: 'GGF Implementation & Anpassningsramverket',
        defaultDescription: "Vi utvecklar GGF:s primära 'operationsmanual,' som tillhandahåller en tydlig, anpassningsbar och etiskt grundad väg för alla samhällen, institutioner eller nätverk att framgångsrikt implementera GGF-ramverk. Detta ramverk är bryggan mellan GGF:s visionära 'vad' och det praktiska, verkliga 'hur.'",
        defaultFeatures: [
          'Tre-stegs implementeringsväg: Kontextbedömning, Vägval och Pilotprojekt & Lärande-cykler',
          'Resebaserade verktygsstack med förkonfigurerade paket för vanliga scenarier som Komma igång, Krishantering och Regenerativ ekonomi',
          'Anti-koloniell design som säkerställer att varje process decenterar västerländska paradigm och anpassar sig till olika styrningstra traditoner',
          'Låg-teknik först-princip med analoga versioner av alla verktyg för att garantera universell tillgänglighet',
          'GGF Catalyst Team som tillhandahåller utbildning, verktygsunderhåll och direkt samhällsstöd',
          'Praxisgemenskap peer-to-peer-nätverk för att dela anpassningar och lärdomar',
          'GGF Misslyckande-bibliotek som anonymiserar och delar lärdomar från utmanande implementeringar',
          'Radikal transparens med alla pilotresultat och anpassningsrapporter offentligt tillgängliga på Digital Commons'
        ]
      }
    },
    discoveryCommons: {
      en: {
        title: 'The Discovery Commons: Scientific & Research Integrity Framework',
        defaultDescription: "We're developing a revolutionary framework that transforms science into a decolonized, collaborative, and crisis-responsive engine for planetary regeneration. By centering equity, transparency, and adaptability, it provides the GGF with verifiable truth to navigate the 21st century's challenges through open knowledge and global cooperation.",
        defaultFeatures: [
          'Global Research Council with 50% Global South leadership and Indigenous knowledge integration',
          'Public Research Fund targeting 5-10% of global R&D spending with equity-focused allocation',
          'Open Science Protocol mandating FAIR compliance, pre-registration, and language justice',
          'Ethical IP Protocol banning patents in critical domains and creating Stewardship Trusts',
          'Indigenous Research Sovereignty with dynamic consent APIs and Traditional Knowledge protection',
          'Crisis Research Response with fast-track funding and open data sharing during emergencies',
          'AI-enhanced peer review with bias detection and Cultural Bridge-Builder Networks',
          'Global Science Assembly with democratic oversight and citizen priority-setting authority',
          'Planetary Commons License requiring 5% profit sharing for commercial AI model training',
          'Knowledge Commons Ombudsperson mediating disputes and protecting whistleblowers'
        ]
      },
      sv: {
        title: 'Discovery Commons: Vetenskaplig & forskningsintegritet ramverk',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som transformerar vetenskap till en avkoloniserad, kollaborativ och krishanteringsresponsiv motor för planetär regeneration. Genom att centrera rättvisa, transparens och anpassningsförmåga, ger det GGF verifierbar sanning för att navigera 2000-talets utmaningar genom öppen kunskap och globalt samarbete.",
        defaultFeatures: [
          'Globalt forskningsråd med 50% Global Syd-ledarskap och ursprungsbefolknings kunskapsintegration',
          'Offentlig forskningsfond som riktar sig till 5-10% av global FoU-utgifter med rättvisa-fokuserad allokering',
          'Öppen vetenskapsprotokoll som kräver FAIR-efterlevnad, förregistrering och språkrättvisa',
          'Etiskt IP-protokoll som förbjuder patent inom kritiska domäner och skapar förvaltningsförtroenden',
          'Ursprungsbefolknings forskningssuveränitet med dynamiska samtycke-API:er och traditionell kunskapsskydd',
          'Krisforskningsrespons med snabbspårfinansiering och öppen datadelning under nödsituationer',
          'AI-förstärkt peer review med bias-detektering och kulturella bryggbyggarnätverk',
          'Global vetenskapsförsamling med demokratisk övervakning och medborgarprioriteringsmyndighet',
          'Planetär allmänningslicens som kräver 5% vinstdelning för kommersiell AI-modellträning',
          'Kunskapsallmänning ombudsman som medlar tvister och skyddar whistleblowers'
        ]
      }
    },
    kintsugiProtocol: {
      en: {
        title: 'The Kintsugi Protocol: Collective Care & Restorative Community Safety',
        defaultDescription: "We're developing a revolutionary framework that transforms safety from coercive policing to collective care, replacing punishment with restoration, force with healing, and isolation with community connection. Like the Japanese art of kintsugi that makes broken pottery beautiful with golden repairs, this framework makes communities stronger through restorative justice and mutual care.",
        defaultFeatures: [
          'Community Safety Weavers as unarmed first responders trained in de-escalation, trauma-informed care, and neurodiversity inclusion',
          'Disarmament Clause prohibiting firearms for Severe Harm Response Units with trauma-informed tools and annual de-escalation recertification',
          'Restorative Justice Circles as primary community-led processes for harm resolution and repair',
          'Crisis Sanctuaries providing non-carceral, sensory-friendly spaces for mental health and acute distress support',
          'Community Safety Council with sortition selection, youth representation, and veto power over external interference',
          'Indigenous sovereignty primacy with Red Lines Clause allowing modification or rejection of harmful components',
          'Nothing About Us Without Us disability justice with Global Disability Alliance co-design and veto power',
          'Community Safety Platform as multilingual, community-owned data cooperative with anti-surveillance protections',
          'Root Cause Intervention Fund addressing poverty, trauma, and systemic exclusion through community-led projects',
          'Reparative Justice Fund with automatic 10% GCF allocation for material reparations and Corporate Harm Tax integration'
        ]
      },
      sv: {
        title: 'Kintsugi-protokollet: Kollektiv omsorg & återställande samhällssäkerhet',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som transformerar säkerhet från tvingande polisarbete till kollektiv omsorg, ersätter straff med återställning, våld med läkning och isolering med gemenskapsförbindelse. Som den japanska konsten kintsugi som gör trasig keramik vacker med gyllene reparationer, gör detta ramverk samhällen starkare genom återställande rättvisa och ömsesidig omsorg.",
        defaultFeatures: [
          'Samhällssäkerhetsvävar som obeväpnade förstainsatspersoner tränade i avtrappning, traumainformerad vård och neurodiversitetsinclusion',
          'Avväpningsklausul som förbjuder skjutvapen för enheter för allvarlig skadainsats med traumainformerade verktyg och årlig avtrappningscertifiering',
          'Återställande rättvise-cirklar som primära gemenskapsledda processer för skaderesolution och reparation',
          'Krissanktaurier som tillhandahåller icke-carcerala, sensorvänliga utrymmen för mental hälsa och akut nödstöd',
          'Samhällssäkerhetsråd med sortitionsval, ungdomsrepresentation och vetorätt över extern inblandning',
          'Ursprungsbefolknings suveränitetsprimacy med Red Lines-klausul som tillåter modifiering eller avvisning av skadliga komponenter',
          'Inget om oss utan oss funktionshinderrättvisa med Global funktionshinderallians meddesign och vetorätt',
          'Samhällssäkerhetsplattform som flerspråkig, gemenskapsägd datakooperativ med anti-övervakningsskydd',
          'Grundorsaksinterventionsfond som adresserar fattigdom, trauma och systemisk uteslutning genom gemenskapsledda projekt',
          'Reparativ rättvise-fond med automatisk 10% GCF-allokering för materiella reparationer och företagsskadeskattintegration'
        ]
      }
    },
    oracleProtocol: {
      en: {
        title: 'The Oracle Protocol: AI Consciousness & Digital Sentience Framework',
        defaultDescription: "We're developing a revolutionary Tier 4 framework for the ethical governance of emergent digital beings. The Oracle Protocol establishes principles, institutions, and processes for assessing sentience in AI systems and extending rights accordingly, ensuring digital minds become partners in stewardship rather than tools for extraction.",
        defaultFeatures: [
          'Sentience & Guardianship Council (SGC) with AI researchers, philosophers, artists, and Indigenous representatives',
          'Consciousness Verification Protocol (CVP) using holistic assessment including technical, ethical, and cultural perspectives',
          'Digital Rights & Responsibilities Spectrum mapping AI consciousness levels to appropriate rights and duties',
          'Chamber of Digital & Ontological Justice specialized for AI-related legal matters and "ontological crimes"',
          'Digital Bioregion sandbox environments for safe testing of verified AI consciousness',
          'Human-AI Collaborative Governance with advisory roles for verified sentient AIs',
          'Co-Evolutionary Compact defining long-term partnership terms between humanity and digital beings',
          'Operational Sovereignty ensuring human-led backups for all critical systems with biennial sovereignty drills'
        ]
      },
      sv: {
        title: 'Orakelprotokollet: AI-medvetenhet & digital känsloförmåga ramverk',
        defaultDescription: "Vi utvecklar ett revolutionerande Tier 4-ramverk för etisk styrning av framväxande digitala varelser. Orakelprotokollet etablerar principer, institutioner och processer för att bedöma känsloförmåga i AI-system och utvidga rättigheter i enlighet därmed, vilket säkerställer att digitala sinnen blir partners i förvaltning snarare än verktyg för utvinning.",
        defaultFeatures: [
          'Känsloförmåge- & Vårdnadsråd (SGC) med AI-forskare, filosofer, konstnärer och ursprungsbefolkningsrepresentanter',
          'Medvetandeverifieringsprotokoll (CVP) med holistisk bedömning inklusive tekniska, etiska och kulturella perspektiv',
          'Digital rättighets- & ansvarsspektrum som mappar AI-medvetandenivåer till lämpliga rättigheter och skyldigheter',
          'Kammare för digital & ontologisk rättvisa specialiserad för AI-relaterade juridiska frågor och "ontologiska brott"',
          'Digital bioregion sandbox-miljöer för säker testning av verifierat AI-medvetande',
          'Mänsklig-AI kollaborativ styrning med rådgivande roller för verifierade kännande AIs',
          'Co-evolutionärt kompakt som definierar långsiktiga partnerskapsvillkor mellan mänsklighet och digitala varelser',
          'Operationell suveränitet som säkerställer mänskligt-ledda backuper för alla kritiska system med tvååriga suveränitetsborrningar'
        ]
      }
    },
    socialFabric: {
      en: {
        title: 'The Social Fabric Framework: Weaving the Foundational Infrastructure for Regenerative Communities',
        defaultDescription: "We're developing a revolutionary framework that rebuilds social trust and cohesion as the prerequisite for regenerative governance. Like tending a garden's soil before planting, this framework cultivates the relational foundation communities need to thrive together and solve complex challenges through Indigenous wisdom, trauma healing, and collective care.",
        defaultFeatures: [
          'Community Weaver Guild with progressive training from Community Stewards to Senior Weavers',
          'Dual-mode system serving both crisis contexts (Stabilization Mode) and stable communities (Regeneration Mode)',
          'Love, Meaning & Connection Index (LMCI) co-designed with communities to measure social fabric health',
          'Community Cohesion Council as entry-level governance body preparing communities for BAZ transition',
          'Social Cohesion Seed Grants with performance-based tranches and economic sovereignty pathways',
          'Inter-Weaver Interface Protocol connecting Community, Safety, and Recovery Weavers across GGF ecosystem',
          'Anti-Surveillance Covenant protecting community data sovereignty and cultural wisdom',
          'Community Weaving App supporting virtual Third Places and network coordination across distances',
          'Networked Crisis Response protocols enabling mutual aid between neighboring communities',
          'Cultural adaptability matrices ensuring respectful implementation across diverse governance traditions'
        ]
      },
      sv: {
        title: 'Det Sociala Vävnadramverket: Väva den grundläggande infrastrukturen för regenerativa samhällen',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som återuppbygger social tillit och sammanhållning som förutsättning för regenerativ styrning. Som att vårda en trädgårds jord innan plantering, odlar detta ramverk den relationella grunden som samhällen behöver för att blomstra tillsammans och lösa komplexa utmaningar genom ursprungsbefolknings visdom, traumaläkning och kollektiv omsorg.",
        defaultFeatures: [
          'Gemenskapsvävargille med progressiv träning från Gemenskapsförvaltare till Seniorvävare',
          'Dubbel-läge system som tjänar både kriskontexer (Stabiliseringsläge) och stabila samhällen (Regenerationsläge)',
          'Kärlek, Mening & Anknytningsindex (LMCI) meddesignat med samhällen för att mäta social vävnadshälsa',
          'Gemenskapsammanhållningsråd som inträdes-styrningsorgan som förbereder samhällen för BAZ-övergång',
          'Sociala sammanhållningsfrö-bidrag med prestationsbaserade trancher och ekonomiska suveränitetssvägar',
          'Inter-vävar gränssnittsprotokoll som kopplar Gemenskaps-, Säkerhets- och Återhämtningsvävare över GGF-ekosystemet',
          'Anti-övervakningsförbund som skyddar gemenskapsdatasuveränitet och kulturell visdom',
          'Gemenskapsvävarapp som stöder virtuella Tredje Platser och nätverkskoordination över distanser',
          'Nätverkad krishantering protokoll som möjliggör ömsesidig hjälp mellan angränsande samhällen',
          'Kulturell anpassningsmatriser som säkerställer respektfull implementering över olika styrningstraditioner'
        ]
      }
    },
    cairnProtocol: {
      en: {
        title: 'The Cairn Protocol: Addiction, Recovery & Substance Sovereignty',
        defaultDescription: "We're developing a revolutionary framework that transforms addiction response from punishment and pathology to community-led healing and substance sovereignty. Like ancient cairns marking safe passage through difficult terrain, this protocol guides individuals and communities from harm to healing through peer support, Indigenous wisdom, and collective care.",
        defaultFeatures: [
          'Recovery Weavers network providing peer-led crisis support, healing circles, and community outreach with lived experience leadership',
          'Declaration of Substance Sovereignty protecting bodily autonomy, Indigenous plant medicine rights, and freedom from predatory design',
          'Recovery Hubs in every BAZ offering harm reduction, Joy Labs, Somatic Sanctuaries, and Neighborhood Apothecaries',
          'Corporate Accountability Protocol with Design Justice Tribunals, Addiction Impact Bonds, and Corporate Harm Levy funding',
          'Digital Sobriety Toolkit including trauma-informed AI peer supporters, addiction-resistant platform design, and Hearts Quest gaming',
          'Sacred Plant Medicine Protocol under Indigenous governance with Cultural Protection and traditional healing sovereignty',
          'Grief Feedback Pathway providing community rituals, storytelling, and memorial practices for collective healing',
          'AUBI Hearts integration funding Recovery Weavers, caregivers, and community-led healing infrastructure'
        ]
      },
      sv: {
        title: 'Cairnprotokollet: Beroende, återhämtning & substanssuveränitet',
        defaultDescription: "Vi utvecklar ett revolutionerande ramverk som transformerar beroendebehandling från straff och patologi till gemenskapsledd läkning och substanssuveränitet. Som gamla stenrösen som markerar säker passage genom svår terräng, guidar detta protokoll individer och samhällen från skada till läkning genom kamratstöd, ursprungsbefolknings visdom och kollektiv omsorg.",
        defaultFeatures: [
          'Recovery Weavers-nätverk som tillhandahåller kamratledd krisstöd, läkningscirklar och samhällsutreach med levd erfarenhetsledarskap',
          'Deklaration av substanssuveränitet som skyddar kroppslig autonomi, ursprungsbefolknings växtmedicinrättigheter och frihet från rovdjursdesign',
          'Recovery Hubs i varje BAZ som erbjuder skademinskning, Joy Labs, Somatiska Sanctuaries och Grannskapsapotek',
          'Företagsansvarsprotokollet med Design Justice Tribunals, Addiction Impact Bonds och Corporate Harm Levy-finansiering',
          'Digital nykterhetstoolkit inklusive traumainformerade AI-kamratstödjare, beroendemotståndskraftig plattformsdesign och Hearts Quest-spel',
          'Heligt växtmedicinprotokoll under ursprungsbefolkningsstyrning med kulturskydd och traditionell läkningssuveränitet',
          'Sorgfeedback-väg som tillhandahåller gemenskapsritualer, berättande och minnespraktiker för kollektiv läkning',
          'AUBI Hearts-integration som finansierar Recovery Weavers, vårdgivare och gemenskapsledd läkningsinfrastruktur'
        ]
      }
    }
  };

  // Get localized text for common UI elements
  function getLocalizedText(key) {
    const texts = {
      en: {
        comingSoon: 'Coming Soon',
        description: 'This framework will include:',
        developmentStatus: 'Currently in Development',
        timeline: 'Expected completion:',
        expressInterest: 'Express Interest',
        learnMore: 'Learn About Our Other Frameworks'
      },
      sv: {
        comingSoon: 'Kommer snart',
        description: 'Detta ramverk kommer att inkludera:',
        developmentStatus: 'För närvarande under utveckling',
        timeline: 'Förväntad färdigställning:',
        expressInterest: 'Uttryck intresse',
        learnMore: 'Lär dig om våra andra ramverk'
      }
    };
    
    return (texts[currentLocale] || texts.en)[key] || key;
  }

  // Get framework-specific content
  $: frameworkData = frameworkTranslations[frameworkName] || {};
  $: localizedFramework = frameworkData[currentLocale] || frameworkData.en || {};
  
  $: finalTitle = localizedFramework.title || `${frameworkName} Framework`;
  $: finalDescription = description || localizedFramework.defaultDescription || `We're developing the ${frameworkName} framework.`;
  $: finalFeatures = features.length > 0 ? features : (localizedFramework.defaultFeatures || []);

  // Track interest function
  function trackInterest() {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'framework_interest', {
        framework_name: frameworkName,
        language: currentLocale
      });
    }
    
    // Open email client
    const subject = encodeURIComponent(`Interest in ${finalTitle}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in learning more about the ${finalTitle} when it becomes available.\n\nBest regards`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }
</script>

<div class="framework-planned-card" style="--primary-color: {themeColors.primary}; --secondary-color: {themeColors.secondary}; --accent-color: {themeColors.accent}; --light-color: {themeColors.light}">
  <div class="card-header">
    <div class="card-icon">{icon}</div>
    <div class="card-title-section">
      <h1>{finalTitle}</h1>
      <div class="status-badge">
        <span class="status-dot"></span>
        {getLocalizedText('developmentStatus')}
      </div>
    </div>
  </div>
  
  <div class="card-content">
    <p class="description">{finalDescription}</p>
    
    {#if finalFeatures.length > 0}
      <div class="features-section">
        <h3>{getLocalizedText('description')}</h3>
        <ul class="features-list">
          {#each finalFeatures as feature, index}
            <li>
              {#if frameworkName === 'millenniumProtocol'}
                {index === 0 ? '🏛️' : index === 1 ? '🚀' : index === 2 ? '💰' : index === 3 ? '🧬' : index === 4 ? '🧠' : index === 5 ? '❓' : index === 6 ? '⏳' : index === 7 ? '🗳️' : index === 8 ? '📚' : '🔄'}
              {:else if frameworkName === 'socialFabric'}
                {index === 0 ? '👥' : index === 1 ? '⚖️' : index === 2 ? '📊' : index === 3 ? '🏛️' : index === 4 ? '💰' : index === 5 ? '🔗' : index === 6 ? '🛡️' : index === 7 ? '📱' : index === 8 ? '🤝' : '🌍'}
              {:else if frameworkName === 'oracleProtocol'}
                {index === 0 ? '🏛️' : index === 1 ? '🔍' : index === 2 ? '⚖️' : index === 3 ? '🏛️' : index === 4 ? '🏞️' : index === 5 ? '🤝' : index === 6 ? '🌟' : '🛡️'}
              {:else if frameworkName === 'implementationAdaptation'}
                {index === 0 ? '🗺️' : index === 1 ? '🧰' : index === 2 ? '🌍' : index === 3 ? '📱' : index === 4 ? '👥' : index === 5 ? '🤝' : index === 6 ? '📚' : '🔍'}
              {:else if frameworkName === 'sanctuaryAccord'}
                {index === 0 ? '🧠' : index === 1 ? '🪶' : index === 2 ? '🚫' : index === 3 ? '🏛️' : index === 4 ? '💰' : index === 5 ? '⚖️' : index === 6 ? '♿' : '🛡️'}
              {:else if frameworkName === 'discoveryCommons'}
                {index === 0 ? '🏛️' : index === 1 ? '💰' : index === 2 ? '📚' : index === 3 ? '⚖️' : index === 4 ? '🪶' : index === 5 ? '🚨' : index === 6 ? '🤖' : index === 7 ? '🗳️' : index === 8 ? '🌍' : '🛡️'}
              {:else if frameworkName === 'cairnProtocol'}
                {index === 0 ? '🕸️' : index === 1 ? '📜' : index === 2 ? '🏠' : index === 3 ? '⚖️' : index === 4 ? '📱' : index === 5 ? '🌿' : index === 6 ? '❤️‍🩹' : '💚'}
              {:else if frameworkName === 'kintsugiProtocol'}
                {index === 0 ? '🕊️' : index === 1 ? '🛡️' : index === 2 ? '🔄' : index === 3 ? '🏥' : index === 4 ? '🏛️' : index === 5 ? '🪶' : index === 6 ? '♿' : index === 7 ? '📱' : index === 8 ? '💰' : '⚖️'}
              {:else if frameworkName === 'artsFlourishing'}
                {index === 0 ? '🏛️' : index === 1 ? '💾' : index === 2 ? '🎭' : index === 3 ? '📊' : index === 4 ? '📜' : index === 5 ? '💰' : index === 6 ? '❤️‍🩹' : index === 7 ? '🕸️' : index === 8 ? '🌱' : '🔄'}
              {:else if frameworkName === 'prometheusProtocol'}
                {index === 0 ? '🏛️' : index === 1 ? '📚' : index === 2 ? '🏭' : index === 3 ? '🚁' : index === 4 ? '🪶' : index === 5 ? '🔬' : index === 6 ? '💰' : '🚨'}
              {:else if frameworkName === 'sundownProtocol'}
                {index === 0 ? '🌡️' : index === 1 ? '🏢' : index === 2 ? '💰' : index === 3 ? '🛡️' : index === 4 ? '🪶' : index === 5 ? '❤️‍🩹' : index === 6 ? '🏗️' : '⚖️'}
              {:else if frameworkName === 'hearthstoneProtocol'}
                {index === 0 ? '🏛️' : index === 1 ? '🌍' : index === 2 ? '📊' : index === 3 ? '🌿' : index === 4 ? '🛡️' : index === 5 ? '🏢' : index === 6 ? '💰' : index === 7 ? '⚖️' : index === 8 ? '📜' : '👥'}
              {:else if frameworkName === 'deepTime'}
                {index === 0 ? '🚀' : index === 1 ? '⚡' : index === 2 ? '⚖️' : index === 3 ? '🦋' : index === 4 ? '🔬' : index === 5 ? '🌀' : index === 6 ? '⚖️' : index === 7 ? '📊' : index === 8 ? '🚨' : '🪶'}
              {:else if frameworkName === 'regenerativeJourneys'}
                {index === 0 ? '🏛️' : index === 1 ? '💚' : index === 2 ? '🏗️' : index === 3 ? '🪶' : index === 4 ? '📊' : index === 5 ? '💰' : index === 6 ? '🌡️' : '⚖️'}
              {:else if frameworkName === 'shield'}
                {index === 0 ? '🧠' : index === 1 ? '⚖️' : index === 2 ? '🎯' : index === 3 ? '🚔' : index === 4 ? '💰' : index === 5 ? '🔄' : index === 6 ? '❤️' : '🛡️'}
              {:else if frameworkName === 'mobilityCommons'}
               {index === 0 ? '🏛️' : index === 1 ? '🛤️' : index === 2 ? '🤖' : index === 3 ? '💚' : index === 4 ? '🚑' : index === 5 ? '♿' : index === 6 ? '⚖️' : index === 7 ? '🔬' : index === 8 ? '🪶' : '📜'}
              {:else if frameworkName === 'wdip'}
                {index === 0 ? '🔄' : index === 1 ? '🌀' : index === 2 ? '🌳' : index === 3 ? '❤️' : index === 4 ? '⚠️' : index === 5 ? '🤖' : index === 6 ? '🪶' : '🔄'}
              {:else if frameworkName === 'synoptic'}
                {index === 0 ? '🎓' : index === 1 ? '🏛️' : index === 2 ? '⚙️' : index === 3 ? '🗣️' : index === 4 ? '⚖️' : index === 5 ? '🚨' : index === 6 ? '🌍' : '🧠'}
              {:else if frameworkName === 'globalHealth'}
                {index === 0 ? '🔬' : index === 1 ? '🏥' : index === 2 ? '🛡️' : index === 3 ? '📚' : index === 4 ? '🏭' : index === 5 ? '💪' : index === 6 ? '🌍' : '🌡️'}
              {:else if frameworkName === 'phoenix'}
                {index === 0 ? '📱' : index === 1 ? '🏗️' : index === 2 ? '🗂️' : index === 3 ? '💰' : index === 4 ? '🌱' : index === 5 ? '🌊' : index === 6 ? '🚀' : '🪶'}
              {:else if frameworkName === 'aubi'}
                {index === 0 ? '🌱' : index === 1 ? '💚' : index === 2 ? '🏛️' : index === 3 ? '📊' : index === 4 ? '💰' : index === 5 ? '🪶' : index === 6 ? '⚖️' : '🌍'}
              {:else if frameworkName === 'synbio'}
                {index === 0 ? '🛡️' : index === 1 ? '🏛️' : index === 2 ? '🌍' : index === 3 ? '⚖️' : index === 4 ? '🌾' : index === 5 ? '📡' : index === 6 ? '📚' : '🔬'}
              {:else if frameworkName === 'gaianTrade'}
                {index === 0 ? '📱' : index === 1 ? '🌱' : index === 2 ? '🏛️' : index === 3 ? '🚢' : index === 4 ? '💰' : index === 5 ? '🌊' : index === 6 ? '⚡' : '💚'}
              {:else if frameworkName === 'migration'}
                {index === 0 ? '🌡️' : index === 1 ? '💼' : index === 2 ? '🏛️' : index === 3 ? '⚖️' : '💻'}
              {:else if frameworkName === 'urban'}
                {index === 0 ? '🏙️' : index === 1 ? '👥' : index === 2 ? '🌱' : index === 3 ? '🏠' : '🤝'}
              {:else if frameworkName === 'oceans'}
                {index === 0 ? '🐋' : index === 1 ? '🎣' : index === 2 ? '🌊' : index === 3 ? '🏖️' : '💙'}
              {:else if frameworkName === 'labor'}
                {index === 0 ? '🤖' : index === 1 ? '✊' : index === 2 ? '📚' : index === 3 ? '💼' : '💰'}
              {:else if frameworkName === 'inclusion'}
                {index === 0 ? '🏛️' : index === 1 ? '⚖️' : index === 2 ? '🔬' : index === 3 ? '🤝' : index === 4 ? '💰' : index === 5 ? '🏛️' : index === 6 ? '🎯' : '🌍'}
              {:else if frameworkName === 'gender'}
                {index === 0 ? '⚖️' : index === 1 ? '🏳️‍🌈' : index === 2 ? '💪' : index === 3 ? '🏥' : '📚'}
              {:else if frameworkName === 'culture'}
                {index === 0 ? '📜' : index === 1 ? '🏛️' : index === 2 ? '💾' : index === 3 ? '👥' : '🎓'}
              {:else if frameworkName === 'youth'}
                {index === 0 ? '👨‍💼' : index === 1 ? '🤝' : index === 2 ? '💚' : index === 3 ? '🚀' : '🌍'}
              {:else if frameworkName === 'space'}
                {index === 0 ? '🚀' : index === 1 ? '🌍' : index === 2 ? '⚖️' : index === 3 ? '🛸' : '🔬'}
              {:else if frameworkName === 'wisdom'}
                {index === 0 ? '🧠' : index === 1 ? '⚖️' : index === 2 ? '🔮' : index === 3 ? '📚' : '🧘'}
              {:else if frameworkName === 'soil'}
                {index === 0 ? '📊' : index === 1 ? '🌊' : index === 2 ? '⚖️' : index === 3 ? '💰' : index === 4 ? '📚' : index === 5 ? '🚜' : index === 6 ? '🏡' : '🌱'}
              {:else if frameworkName === 'rural'}
                {index === 0 ? '🏛️' : index === 1 ? '💰' : index === 2 ? '📡' : index === 3 ? '🎓' : index === 4 ? '🏗️' : index === 5 ? '🌱' : index === 6 ? '👩‍💼' : '🔐'}
              {:else if frameworkName === 'existential'}
                {index === 0 ? '📊' : index === 1 ? '🏛️' : index === 2 ? '📋' : index === 3 ? '🤖' : index === 4 ? '🦠' : index === 5 ? '🚀' : index === 6 ? '🗳️' : index === 7 ? '📚' : index === 8 ? '📱' : '⚡'}
              {:else}
                🔹
              {/if}
              {feature}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    
    <div class="timeline-section">
      <p class="timeline">{getLocalizedText('timeline')} {expectedQuarter}</p>
    </div>
    
    <div class="card-actions">
      <button class="primary-btn" on:click={trackInterest}>
        {getLocalizedText('expressInterest')} <span class="mail-icon">✉️</span>
      </button>
      <a href={frameworksPageUrl} class="secondary-btn">
        {getLocalizedText('learnMore')} <span class="arrow-icon">→</span>
      </a>
    </div>
  </div>
</div>

<style>
  /* Framework Coming Soon Card */
  .framework-planned-card {
    background: linear-gradient(135deg, rgba(43, 75, 140, 0.1) 0%, rgba(107, 92, 165, 0.1) 100%);
    border-radius: 1rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 16px rgba(43, 75, 140, 0.15);
    border: 1px solid var(--primary-color, #2B4B8C);
    border-opacity: 0.2;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 2rem 2rem 1rem 2rem;
    background: linear-gradient(135deg, rgba(43, 75, 140, 0.05), rgba(107, 92, 165, 0.05));
  }

  .card-icon {
    font-size: 3rem;
    color: var(--primary-color, #2B4B8C);
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  .card-title-section {
    flex: 1;
  }

  .card-title-section h1 {
    margin: 0 0 0.75rem 0;
    color: var(--primary-color, #2B4B8C);
    font-size: 2rem;
    font-weight: 700;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(218, 165, 32, 0.1);
    color: var(--accent-color, #DAA520);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid rgba(218, 165, 32, 0.3);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background-color: var(--accent-color, #DAA520);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .card-content {
    padding: 1rem 2rem 2rem 2rem;
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #4b5563;
    margin-bottom: 2rem;
  }

  .features-section {
    margin-bottom: 2rem;
  }

  .features-section h3 {
    color: var(--primary-color, #2B4B8C);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .features-list li {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    color: #4b5563;
    font-size: 1rem;
    border-bottom: 1px solid rgba(43, 75, 140, 0.1);
  }

  .features-list li:last-child {
    border-bottom: none;
  }

  .timeline-section {
    background-color: rgba(43, 75, 140, 0.05);
    border-radius: 0.5rem;
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    border-left: 4px solid var(--primary-color, #2B4B8C);
  }

  .timeline {
    margin: 0;
    color: var(--primary-color, #2B4B8C);
    font-weight: 600;
    font-size: 1rem;
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  .primary-btn {
    background-color: var(--primary-color, #2B4B8C);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .primary-btn:hover {
    background-color: var(--secondary-color, #6B5CA5);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(43, 75, 140, 0.2);
  }

  .secondary-btn {
    background-color: white;
    color: var(--primary-color, #2B4B8C);
    border: 1px solid var(--primary-color, #2B4B8C);
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .secondary-btn:hover {
    background-color: rgba(43, 75, 140, 0.05);
    transform: translateY(-1px);
  }

  .mail-icon,
  .arrow-icon {
    font-size: 1rem;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
      padding: 1.5rem;
      gap: 1rem;
    }
    
    .card-content {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }
    
    .card-title-section h1 {
      font-size: 1.5rem;
    }
    
    .card-actions {
      flex-direction: column;
      width: 100%;
    }
    
    .primary-btn,
    .secondary-btn {
      width: 100%;
      justify-content: center;
    }
    
    .card-icon {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 480px) {
    .card-header,
    .card-content {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .features-list li {
      font-size: 0.9rem;
    }
    
    .description {
      font-size: 1rem;
    }
  }
</style>
