// /src/lib/data/schema/cluster.human-flourishing.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 2: HUMAN FLOURISHING & CAPABILITY CLUSTER
 * Core systems ensuring healthy, capable, and informed citizenry
 * Operationalizes the GGF's commitment to human development and well-being
 */

export const humanFlourishingEntities: GgfEntity[] = [
  // === CORE FRAMEWORKS ===
  {
    id: 'framework_education',
    type: 'Framework',
    name: 'Educational Systems Framework',
    shortName: 'Education',
    description: 'Educational systems for informed citizenry and global competency',
    tier: 2,
    status: 'Review',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['mechanism_gcf', 'framework_meta_gov'],
    enables: ['tool_existential_civics', 'tool_epistemic_curriculum'],
    ui: {
      path: '/frameworks/educational-systems',
      titleKey: 'framework.docs.nav.frameworkTitles.educationalSystems',
      emoji: '🎓',
      slug: 'educational-systems',
      group: 'humanSocialSystems'
    }
  },
  {
    id: 'framework_global_health',
    type: 'Framework',
    name: 'Global Health & Pandemic Security Framework',
    shortName: 'Global Health',
    description: 'Health system for capable citizenry and pandemic preparedness',
    tier: 2,
    status: 'Ready',
    primaryDomain: 'Health',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['mechanism_gcf'],
    enables: ['institution_hec'],
    ui: {
      path: '/frameworks/global-health-and-pandemic-security',
      titleKey: 'framework.docs.nav.frameworkTitles.globalHealthAndPandemicSecurity',
      emoji: '⚕️',
      version: '1.0',
      slug: 'global-health-and-pandemic-security',
      group: 'planetaryHealthResilience'
    }
  },
  {
    id: 'framework_mental_health',
    type: 'Framework',
    name: 'Mental Health Governance Framework',
    shortName: 'Mental Health',
    description: 'Framework for mental health and psychological wellbeing',
    tier: 2,
    status: 'Review',
    primaryDomain: 'Health',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_global_health'],
    enables: ['process_living_mandala'],
    ui: {
      path: '/frameworks/mental-health-governance',
      titleKey: 'framework.docs.nav.frameworkTitles.mentalHealthGovernance',
      emoji: '🧠',
      slug: 'mental-health-governance',
      group: 'humanSocialSystems'
    }
  },
  {
    id: 'framework_sanctuary_accord',
    type: 'Framework',
    name: 'The Sanctuary Accord',
    shortName: 'Sanctuary Accord',
    description: 'Framework for consciousness technology governance including psychedelics, neuro-technologies, and digital consciousness environments',
    tier: 2,
    status: 'Draft',
    primaryDomain: 'Health',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: [
      'framework_technology_governance',
      'framework_indigenous', 
      'framework_mental_health',
      'framework_aurora_accord'
    ],
    enables: [
      'council_neuro_ethics_review',
      'institution_baz_sanctuary_councils',
      'mechanism_sacred_reciprocity_license'
    ],
    ui: {
      path: '/frameworks/sanctuary-accord',
      titleKey: 'framework.docs.nav.frameworkTitles.sanctuaryAccord',
      emoji: '🍄',
      version: '1.6',
      slug: 'sanctuary-accord',
      group: 'humanSocialSystems'
    }
  },
  {
    id: 'framework_synoptic',
    type: 'Framework',
    name: 'The Synoptic Protocol - Media & Epistemic Integrity',
    shortName: 'Synoptic Protocol',
    description: 'Global framework for media and epistemic integrity ensuring healthy information ecosystems',
    tier: 2,
    status: 'Ready',
    primaryDomain: 'Technology',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_aurora_accord', 'framework_meta_gov'],
    enables: ['council_gcei', 'protocol_right_to_reality', 'institution_epi_institution', 'tool_epistemic_curriculum'],
    ui: {
      path: '/frameworks/synoptic-protocol',
      titleKey: 'framework.docs.nav.frameworkTitles.synopticProtocol',
      emoji: '👁️',
      version: '1.0',
      slug: 'synoptic-protocol',
      group: 'humanSocialSystems'
    }
  },
  // === THE PROMETHEUS PROTOCOL (PHARMACEUTICAL & BIOTECH COMMONS) ===
  {
    id: 'framework_prometheus_protocol',
    type: 'Framework',
    name: 'The Prometheus Protocol',
    shortName: 'Prometheus Protocol',
    description: 'A commons-based framework for the discovery, production, and distribution of medicines and biotechnology.',
    tier: 2,
    status: 'Planned',
    primaryDomain: 'Health',
    implementationPriority: 'High',
    dependencies: ['framework_treaty', 'mechanism_gcf', 'framework_hearthstone', 'framework_discovery_commons', 'framework_indigenous', 'framework_gscl'],
    enables: ['council_gpsc', 'institution_pip_commons', 'institution_dmn'],
    ui: {
      path: '/frameworks/prometheus-protocol',
      titleKey: 'framework.docs.nav.frameworkTitles.prometheusProtocol',
      emoji: '⚕️',
      version: '7.1',
      slug: 'prometheus-protocol',
      group: 'planetaryHealthResilience'
    }
  },
  // === THE DISCOVERY COMMONS (SCIENTIFIC & RESEARCH INTEGRITY) ===
  {
    id: 'framework_discovery_commons',
    type: 'Framework',
    name: 'The Discovery Commons',
    shortName: 'Discovery Commons',
    description: 'A GGF framework for governing the production of scientific knowledge as a global public good.',
    tier: 2,
    status: 'Planned',
    primaryDomain: 'Governance',
    implementationPriority: 'High',
    dependencies: ['framework_treaty', 'mechanism_gcf', 'framework_digital_commons', 'framework_indigenous'],
    enables: ['council_global_research', 'institution_public_research_fund', 'protocol_open_science'],
    ui: {
      path: '/frameworks/discovery-commons',
      titleKey: 'framework.docs.nav.frameworkTitles.discoveryCommons',
      emoji: '🔬', // Microscope emoji
      version: '1.0',
      slug: 'discovery-commons'
      // This fits well in group: 'humanSocialSystems'
    }
  },
  // === THE KINTSUGI PROTOCOL (COLLECTIVE CARE & SAFETY) ===
  {
    id: 'framework_kintsugi_protocol',
    type: 'Framework',
    name: 'The Kintsugi Protocol',
    shortName: 'Kintsugi Protocol',
    description: 'A framework for collective care and restorative safety, replacing punitive systems with community-led healing and support.',
    tier: 2,
    status: 'Planned',
    primaryDomain: 'Governance',
    implementationPriority: 'High',
    dependencies: ['framework_justice', 'framework_peace', 'framework_mental_health', 'framework_indigenous', 'framework_disability'],
    enables: ['institution_community_safety_council', 'institution_crisis_sanctuary', 'process_community_safety_weaver'],
    ui: {
      path: '/frameworks/kintsugi-protocol',
      titleKey: 'framework.docs.nav.frameworkTitles.kintsugiProtocol',
      emoji: '🏺', // Amphora/pottery emoji for Kintsugi
      version: '2.0',
      slug: 'kintsugi-protocol',
      group: 'humanSocialSystems'
    }
  },

  // === THE HEARTHLIGHT PROTOCOL (CHILDHOOD FLOURISHING) ===
  {
    id: 'framework_hearthlight_protocol',
    type: 'Framework',
    name: 'The Hearthlight Protocol: A Framework for Childhood Flourishing',
    shortName: 'Hearthlight Protocol',
    description: 'Foundational framework for child development, rights, safety, and well-being, ensuring every child\'s inalienable right to safety, holistic development, and joyful play.',
    tier: 2,
    status: 'Implementation Ready', // From 'Final Draft' in the doc
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Critical', // Implied by its foundational nature
    dependencies: [
      'framework_treaty',
      'framework_mos',
      'framework_indigenous',
      'framework_aubi',
      'framework_work_liberation',
      'framework_education',
      'framework_youth', // Horizon Protocol
      'framework_justice',
      'framework_synoptic',
      'framework_living_land', // from doc
      'framework_bioregional_polis', // from doc
      'framework_peace',
      'framework_egp'
    ],
    enables: [
      'institution_chamber_of_the_guardian',
      'process_baz_child_family_weaver',
      'institution_sapling_councils',
      'metric_cfi'
    ],
    ui: {
      path: '/frameworks/hearthlight-protocol', // You will need to create this page
      titleKey: 'framework.docs.nav.frameworkTitles.hearthlightProtocol', // Will be auto-generated
      emoji: '🕯️', // Using the candle for 'Hearthlight'
      version: '1.7', // From doc
      slug: 'hearthlight-protocol',
      group: 'humanSocialSystems' // Fits this group well
    }
  },

  // === GOVERNANCE COUNCILS ===
  {
    id: 'council_hcc',
    type: 'Council',
    name: 'Human Capability Council',
    shortName: 'HCC',
    description: 'Meta-Governance council overseeing integration of education, health, mental health, and epistemic integrity',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_meta_gov']
  },
  {
    id: 'council_gcei',
    type: 'Council',
    name: 'Global Council for Epistemic Integrity',
    shortName: 'GCEI',
    description: 'Meta-Governance council that oversees The Synoptic Protocol and epistemic health',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Technology',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_synoptic', 'framework_meta_gov']
  },
  {
    id: 'council_gpsc',
    type: 'Council',
    name: 'Global Pharmaceutical Stewardship Council',
    shortName: 'GPSC',
    description: 'Oversees the commons-based pharmaceutical pipeline, from research prioritization to equitable access.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_prometheus_protocol', 'council_phc']
  },
  {
    id: 'council_global_research',
    type: 'Council',
    name: 'Global Research Council',
    shortName: 'GRC',
    description: 'A sub-council of Meta-Governance that sets global research priorities and oversees the Discovery Commons.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_discovery_commons', 'framework_meta_gov']
  },
  {
    id: 'council_youth_safety',
    type: 'Council',
    name: 'Youth Safety Council',
    description: 'A parallel governance body with authority over youth-related safety issues, peer mediation, and future impact assessments.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol', 'framework_youth']
  },
  {
    id: 'council_neuro_ethics_review',
    type: 'Council',
    name: 'Neuro-Ethics Review Board',
    shortName: 'NERB',
    description: 'Specialized sub-committee of GTC providing ethical review and safety certification for consciousness technologies',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Health',
    dependencies: ['framework_sanctuary_accord', 'council_gtc']
  },

  // === SPECIALIZED INSTITUTIONS ===
  {
    id: 'institution_hec',
    type: 'Institution',
    name: 'Health Emergency Corps',
    shortName: 'HEC',
    description: 'Specialized rapid-response unit for pandemics and global health crises, operating under the GEM',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Ecological',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_global_health', 'institution_gem']
  },
  {
    id: 'institution_epi_institution',
    type: 'Institution',
    name: 'Public Epistemic Institutions',
    shortName: 'PEI',
    description: 'New class of media organizations funded as public good and bound by Synoptic Protocol standards',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Technology',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_synoptic', 'mechanism_gcf']
  },
  {
    id: 'institution_gimn',
    type: 'Institution',
    name: 'Global Indigenous Media Network (GIMN)',
    shortName: 'GIMN',
    description: 'A globally-chartered, Indigenous-led Public Epistemic Institution dedicated to amplifying Indigenous narratives, languages, and ways of knowing. It serves as a primary vehicle for epistemic reparations and cultural storytelling.',
    tier: 2, // As an application-layer institution
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_synoptic', 'framework_indigenous'],
    enables: ['framework_arts_flourishing'] // Enables the Arts Ambassadors program
  },
  {
    id: 'institution_pip_commons',
    type: 'Institution',
    name: 'Pharmaceutical IP Commons',
    shortName: 'IP Commons',
    description: 'A Stewardship Trust that holds patents, data, and know-how as a public good for global manufacturing.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_prometheus_protocol', 'framework_hearthstone']
  },
  {
    id: 'institution_dmn',
    type: 'Institution',
    name: 'Distributed Manufacturing Network',
    shortName: 'DMN',
    description: 'A network of community-owned, cooperative facilities for producing medicines, with a Global South-first focus.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_prometheus_protocol', 'framework_work_liberation']
  },
  {
    id: 'institution_regional_research_hubs',
    type: 'Institution',
    name: 'Regional Research Hubs',
    description: 'Decentralized bodies that adapt global research priorities to local contexts and cultural values.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['council_global_research']
  },
  {
    id: 'institution_public_research_fund',
    type: 'Institution',
    name: 'Public Research Fund',
    description: 'Distributes grants from the GCF for mission-oriented research, prioritizing Global South capacity.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_discovery_commons', 'mechanism_gcf']
  },
  {
    id: 'institution_global_science_assembly',
    type: 'Institution',
    name: 'Global Science Assembly',
    description: 'A directly elected body with oversight powers to initiate inquiries and force reconsideration of GRC priorities.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_discovery_commons']
  },
  {
    id: 'institution_knowledge_commons_ombudsperson',
    type: 'Institution',
    name: 'Knowledge Commons Ombudsperson',
    description: 'Mediates disputes, tracks failures, and oversees protocols related to political engagement and non-compliance.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_discovery_commons']
  },
  {
    id: 'institution_community_safety_council',
    type: 'Institution',
    name: 'Community Safety Council',
    description: 'A BAZ-level or municipal council, selected via sortition, that oversees the local Kintsugi Protocol system.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol']
  },
  {
    id: 'institution_shru',
    type: 'Institution',
    name: 'Severe Harm Response Unit',
    shortName: 'SHRU',
    description: 'A repurposed, downsized, and unarmed unit for responding to immediate, severe physical threats, activated only by the Community Safety Council.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol']
  },
  {
    id: 'institution_community_safety_ombudsperson',
    type: 'Institution',
    name: 'Community Safety Ombudsperson',
    description: 'An independent advocate for community members, handling complaints about system failures.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['institution_community_safety_council']
  },
  {
    id: 'institution_community_safety_observatory',
    type: 'Institution',
    name: 'Community Safety Observatory',
    description: 'A participatory research body that conducts community-controlled research on safety outcomes and maintains longitudinal data.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol']
  },
  {
    id: 'institution_crisis_sanctuary',
    type: 'Institution',
    name: 'Crisis Sanctuaries',
    description: 'Non-carceral, 24/7 spaces for people in acute mental or emotional distress, co-governed with the Mental Health Framework.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol', 'framework_mental_health']
  },
  {
    id: 'institution_baz_sanctuary_councils',
    type: 'Institution',
    name: 'BAZ-Level Sanctuary Councils',
    shortName: 'Sanctuary Councils',
    description: 'Decentralized, community-led bodies licensing and monitoring local consciousness technology practitioners',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Health',
    dependencies: ['framework_sanctuary_accord', 'institution_baz']
  },

  {
    id: 'institution_ggf_practitioner_academy',
    type: 'Institution',
    name: 'GGF Practitioner Academy',
    shortName: 'Practitioner Academy',
    description: 'Global training and certification body for consciousness technology practitioners',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Health',
    dependencies: ['framework_sanctuary_accord']
  },

{
    id: 'institution_chamber_of_the_guardian',
    type: 'Institution',
    name: 'The Chamber of the Guardian',
    description: 'A specialized chamber of the Digital Justice Tribunal with jurisdiction over the Charter of Childhood Rights.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_hearthlight_protocol', 'institution_dj_tribunal']
  },
  {
    id: 'institution_sapling_councils',
    type: 'Institution',
    name: 'Sapling Councils',
    description: 'Child-led councils at the BAZ level (ages 10-15) for hands-on governance experience.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_hearthlight_protocol', 'framework_youth']
  },

  // === MECHANISMS ===
  {
    id: 'mechanism_pcrf',
    type: 'EconomicMechanism',
    name: 'Pharmaceutical Colonialism Reparations Fund',
    shortName: 'Reparations Fund',
    description: 'A fund capitalized by a levy on historical pharma profits to bootstrap the commons.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_prometheus_protocol', 'framework_gaian_trade']
  },
  {
    id: 'mechanism_research_equity_fund',
    type: 'EconomicMechanism',
    name: 'Research Equity Fund',
    description: 'A 20% allocation of the Public Research Fund for Global South infrastructure, fellowships, and micro-grants.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['institution_public_research_fund']
  },
  {
    id: 'mechanism_sacred_reciprocity_license',
    type: 'EconomicMechanism',
    name: 'Sacred Reciprocity License',
    shortName: 'Reciprocity License',
    description: 'Legally binding license ensuring revenue flows back to Indigenous communities from consciousness technology commercialization',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Economic',
    dependencies: ['framework_sanctuary_accord', 'platform_love_ledger']
  },

  // === PLATFORMS ===
  {
    id: 'platform_community_safety',
    type: 'Platform',
    name: 'Community Safety Platform',
    description: 'A multi-lingual, accessible app and phone line for requesting non-emergency support.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol']
  },
  {
    id: 'platform_consciousness_registry',
    type: 'Platform',
    name: 'Consciousness Technology Registry',
    shortName: 'Consciousness Registry',
    description: 'Digital platform tracking consciousness technology practitioners, research, and adverse events',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Technology',
    dependencies: ['framework_sanctuary_accord', 'framework_aurora_accord']
  },

  // === PROCESSES, PROTOCOLS & TOOLS ===
  {
    id: 'process_living_mandala',
    type: 'Process',
    name: 'Living Mandala for Planetary Mental Health',
    shortName: 'Living Mandala',
    description: 'Core process for fostering individual and collective well-being through integrated mental health approaches',
    tier: 2,
    status: 'Draft',
    primaryDomain: 'Ecological',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_mental_health']
  },
  {
    id: 'protocol_right_to_reality',
    type: 'LegalProtocol',
    name: 'Universal Right to Reality',
    shortName: 'Right to Reality',
    description: 'Legal right protecting citizens from systemic, malicious manipulation, enforceable by Digital Justice Tribunal',
    tier: 2,
    status: 'Draft',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_synoptic', 'institution_dj_tribunal']
  },
  {
    id: 'tool_existential_civics',
    type: 'Tool',
    name: 'Existential Civics Curriculum',
    shortName: 'Existential Civics',
    description: 'Educational program on global risks and resilience, preparing citizens for complex challenges',
    tier: 2,
    status: 'Draft',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_education']
  },
  {
    id: 'tool_epistemic_curriculum',
    type: 'Tool',
    name: 'The Epistemic Curriculum',
    shortName: 'Epistemic Curriculum',
    description: 'Core module for teaching critical thinking, media literacy, and perspectival agility',
    tier: 2,
    status: 'Draft',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_synoptic', 'framework_education']
  },
  {
    id: 'process_community_priority_forum',
    type: 'Process',
    name: 'Community Priority Forum',
    description: 'A democratic process for setting the Priority Medicines Research Agenda based on global health needs.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['council_gpsc', 'framework_discovery_commons']
  },
  {
    id: 'protocol_open_science',
    type: 'Protocol',
    name: 'Open Science Protocol',
    description: 'Mandates open-access publication, FAIR data compliance, pre-registration, and open peer review.',
    tier: 2,
    status: 'Draft',
    dependencies: ['framework_discovery_commons']
  },
  {
    id: 'protocol_ethical_ip',
    type: 'LegalProtocol',
    name: 'Ethical IP Protocol',
    description: 'Bans patents in critical domains and places intellectual property into Stewardship Trusts.',
    tier: 2,
    status: 'Draft',
    dependencies: ['framework_discovery_commons', 'framework_hearthstone']
  },
  {
    id: 'protocol_indigenous_research_sovereignty',
    type: 'LegalProtocol',
    name: 'Indigenous Research Sovereignty Protocol',
    description: 'Ensures research with Indigenous communities follows principles of co-design, dynamic consent, and data sovereignty.',
    tier: 2,
    status: 'Draft',
    dependencies: ['framework_discovery_commons', 'framework_indigenous']
  },
  {
    id: 'protocol_crisis_research_response',
    type: 'Protocol',
    name: 'Crisis Research Response Protocol',
    description: 'A protocol for fast-tracking funding and mandating open data sharing during global crises.',
    tier: 2,
    status: 'Draft',
    dependencies: ['framework_discovery_commons', 'framework_drr']
  },
  {
    id: 'process_community_safety_weaver',
    type: 'Process',
    name: 'Community Safety Weavers',
    description: 'The role of unarmed, trained first responders and peacekeepers for the community.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol', 'framework_peace']
  },
  {
    id: 'process_restorative_justice_circle',
    type: 'Process',
    name: 'Restorative Justice Circles',
    description: 'The primary, community-led process for addressing harm after it has occurred.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol']
  },
  {
    id: 'process_accountability_pod',
    type: 'Process',
    name: 'Accountability Pods',
    description: 'An intensive restorative process for high-harm or repeat-harm cases before formal escalation.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol']
  },
  {
    id: 'process_community_healing_circle',
    type: 'Process',
    name: 'Community Healing Circles',
    description: 'Regular, community-wide processes for addressing collective and historical trauma.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_kintsugi_protocol', 'framework_cultural_heritage']
  },
  {
    id: 'protocol_red_lines_clause',
    type: 'LegalProtocol',
    name: 'Red Lines Clause',
    shortName: 'Red Lines',
    description: 'Non-negotiable provision allowing Earth Council to declare consciousness technologies off-limits',
    tier: 2,
    status: 'Draft',
    primaryDomain: 'Justice',
    dependencies: ['framework_sanctuary_accord', 'council_earth']
  },
  {
    id: 'protocol_fpic_2_consciousness',
    type: 'LegalProtocol',
    name: 'FPIC 2.0 for Consciousness Technologies',
    shortName: 'FPIC 2.0 Consciousness',
    description: 'Enhanced consent protocol for consciousness technology research involving Indigenous knowledge',
    tier: 2,
    status: 'Draft',
    primaryDomain: 'Justice',
    dependencies: ['framework_sanctuary_accord', 'protocol_fpic2']
  },
  {
    id: 'process_cognitive_equity_audit',
    type: 'Process',
    name: 'Cognitive Equity Audit',
    shortName: 'Cognitive Equity Audit',
    description: 'Mandatory accessibility review for consciousness technologies ensuring neurodivergent inclusion',
    tier: 2,
    status: 'Draft',
    primaryDomain: 'Health',
    dependencies: ['framework_sanctuary_accord', 'framework_disability']
  },

  {
    id: 'tool_cultural_immersion_certification',
    type: 'Tool',
    name: 'Cultural Immersion Certification',
    shortName: 'Cultural Certification',
    description: 'Training requirement for non-local participants in ceremonial consciousness practices',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Health',
    dependencies: ['framework_sanctuary_accord']
  },

  {
    id: 'process_baz_child_family_weaver',
    type: 'Process',
    name: 'BAZ-Level Child & Family Weavers',
    shortName: 'Child & Family Weavers',
    description: 'Specialized role within Work in Liberation to act as first responders and support liaisons for families, rewarded with Hearts.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_hearthlight_protocol', 'framework_work_liberation', 'framework_aubi']
  },
  {
    id: 'metric_cfi',
    type: 'DataMetric',
    name: 'Childhood Flourishing Index (CFI)',
    shortName: 'CFI',
    description: 'A composite metric for child well-being, governed by the Global Metrology Council.',
    tier: 2,
    status: 'Draft',
    dependencies: ['framework_hearthlight_protocol', 'council_global_metrology', 'metric_lmci']
  }


];

export const humanFlourishingRelationships: GgfRelationship[] = [
  // === INTERNAL CLUSTER COORDINATION ===
  {
    from: 'council_hcc',
    to: 'framework_education',
    type: 'OVERSEES',
    description: 'HCC provides strategic oversight and coordination for global educational systems',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_hcc',
    to: 'framework_global_health',
    type: 'OVERSEES',
    description: 'HCC coordinates global health policy and pandemic preparedness',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_hcc',
    to: 'framework_mental_health',
    type: 'OVERSEES',
    description: 'HCC ensures integration of mental health across all human capability systems',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_hcc',
    to: 'framework_synoptic',
    type: 'OVERSEES',
    description: 'HCC oversees GCEI to ensure epistemic health aligns with overall human capability goals',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_gcei',
    to: 'council_hcc',
    type: 'REPORTS_TO',
    description: 'GCEI operates within Human Capability Council architecture for epistemic integrity',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === FRAMEWORK INTEGRATION ===
  {
    from: 'framework_global_health',
    to: 'framework_mental_health',
    type: 'INTEGRATES_WITH',
    description: 'Pandemic response and physical health systems must integrate mental health support',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_education',
    to: 'framework_mental_health',
    type: 'COLLABORATES_WITH',
    description: 'Educational curricula include mental health literacy and well-being practices from the Living Mandala',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_education',
    to: 'tool_epistemic_curriculum',
    type: 'IMPLEMENTS',
    description: 'Educational Systems framework is primary vehicle for deploying Epistemic Curriculum globally',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_mental_health',
    to: 'framework_synoptic',
    type: 'INFORMS',
    description: 'Mental Health governance informs protocols for Trauma-Informed Media Literacy',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === INSTITUTIONAL & PROTOCOL ESTABLISHMENT ===
  {
    from: 'framework_global_health',
    to: 'institution_hec',
    type: 'ESTABLISHES',
    description: 'Global Health framework establishes Health Emergency Corps for rapid pandemic response',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_synoptic',
    to: 'institution_epi_institution',
    type: 'ESTABLISHES',
    description: 'Synoptic Protocol establishes Public Epistemic Institutions as media governance model',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_synoptic',
    to: 'protocol_right_to_reality',
    type: 'ESTABLISHES',
    description: 'Synoptic Protocol establishes Universal Right to Reality as core legal protection',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },

  // === PROMETHEUS PROTOCOL INTEGRATION ===
  { from: 'framework_prometheus_protocol', to: 'council_gpsc', type: 'ESTABLISHES', description: 'The protocol establishes the GPSC as its primary governing body.' },
  { from: 'council_gpsc', to: 'institution_pip_commons', type: 'OVERSEES', description: 'The GPSC manages the Pharmaceutical IP Commons.' },
  { from: 'council_gpsc', to: 'institution_dmn', type: 'OVERSEES', description: 'The GPSC coordinates the Distributed Manufacturing Network.' },
  { from: 'council_gpsc', to: 'process_community_priority_forum', type: 'IMPLEMENTS', description: 'The GPSC uses the forum to set research priorities democratically.' },

  // === DISCOVERY COMMONS INTEGRATION ===
  { from: 'framework_discovery_commons', to: 'council_global_research', type: 'ESTABLISHES', description: 'The framework establishes the GRC as its primary governing body.' },
  { from: 'council_global_research', to: 'institution_regional_research_hubs', type: 'OVERSEES', description: 'The GRC coordinates and supports the decentralized regional hubs.' },
  { from: 'institution_global_science_assembly', to: 'council_global_research', type: 'AUDITS', description: 'The elected assembly provides democratic oversight and can override GRC decisions.' },
  { from: 'framework_discovery_commons', to: 'institution_public_research_fund', type: 'ESTABLISHES', description: 'The framework establishes the fund to allocate research capital.' },
  { from: 'mechanism_gcf', to: 'institution_public_research_fund', type: 'FUNDS', description: 'The Global Commons Fund is the primary capital source for the Public Research Fund.' },
  { from: 'institution_public_research_fund', to: 'mechanism_research_equity_fund', type: 'IMPLEMENTS', description: 'The Public Research Fund operationalizes its equity goals via the Research Equity Fund.' },
  { from: 'framework_discovery_commons', to: 'protocol_open_science', type: 'IMPLEMENTS', description: 'The Open Science Protocol is the core operational mandate of the Discovery Commons.' },

  // === KINTSUGI PROTOCOL (COLLECTIVE CARE & SAFETY) INTEGRATION ===
  { from: 'framework_kintsugi_protocol', to: 'institution_community_safety_council', type: 'ESTABLISHES' },
  { from: 'institution_community_safety_council', to: 'process_community_safety_weaver', type: 'IMPLEMENTS' },
  { from: 'institution_community_safety_council', to: 'institution_shru', type: 'OVERSEES' },
  { from: 'institution_community_safety_council', to: 'institution_crisis_sanctuary', type: 'OVERSEES' },


  // === PROCESS & TOOL IMPLEMENTATION ===
  {
    from: 'framework_mental_health',
    to: 'process_living_mandala',
    type: 'IMPLEMENTS',
    description: 'Mental Health framework implements Living Mandala as core well-being process',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_education',
    to: 'tool_existential_civics',
    type: 'IMPLEMENTS',
    description: 'Educational Systems framework deploys Existential Civics curriculum for global competency',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },

  // === CONNECTIONS TO META-GOVERNANCE ===
  {
    from: 'council_hcc',
    to: 'council_mgcc',
    type: 'REPORTS_TO',
    description: 'Human Capability Council operates within Meta-Governance architecture',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO CONSTITUTIONAL LAYER ===
  {
    from: 'institution_hec',
    to: 'institution_gem',
    type: 'IMPLEMENTS',
    description: 'Health Emergency Corps operates as specialized unit within Global Enforcement Mechanism',
    strength: 'Strong',
    frequency: 'Crisis-Only',
    sequenceType: 'Parallel'
  },
  {
    from: 'mechanism_gcf',
    to: 'council_hcc',
    type: 'FUNDS',
    description: 'Global Commons Fund provides core funding for global health and education initiatives',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'mechanism_gcf',
    to: 'institution_epi_institution',
    type: 'FUNDS',
    description: 'Global Commons Fund provides public funding for chartered Epistemic Institutions',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'protocol_right_to_reality',
    to: 'institution_dj_tribunal',
    type: 'ENFORCES',
    description: 'Digital Justice Tribunal is the venue for enforcing Universal Right to Reality',
    strength: 'Strong',
    frequency: 'As-Needed',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO ECONOMIC OS ===
  {
    from: 'framework_aubi',
    to: 'framework_mental_health',
    type: 'INTEGRATES_WITH',
    description: 'AUBI provides economic security that is prerequisite for good mental health',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_work_liberation',
    to: 'framework_education',
    type: 'INFORMS',
    description: 'Work in Liberation needs inform skills and values taught by Educational Systems',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO JUSTICE OS ===
  {
    from: 'framework_peace',
    to: 'framework_mental_health',
    type: 'COLLABORATES_WITH',
    description: 'Peace Framework uses trauma-informed approaches from Mental Health framework for post-conflict reconciliation',
    strength: 'Medium',
    frequency: 'As-Needed',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO HEARTHSTONE PROTOCOL ===
  {
    from: 'framework_education',
    to: 'framework_hearthstone',
    type: 'SUPPORTS',
    description: 'The Educational Systems framework develops and deploys the "Commons Curriculum" and "Stewardship Law" certifications required by the Hearthstone Protocol.',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO ECOLOGICAL SYSTEMS ===
  {
    from: 'framework_drr',
    to: 'framework_mental_health',
    type: 'INTEGRATES_WITH',
    description: 'DRR&R framework integrates mental health support at every stage of the disaster cycle',
    strength: 'Strong',
    frequency: 'As-Needed',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO HIGHER-TIER FRAMEWORKS ===
  {
    from: 'framework_education',
    to: 'framework_global_citizenship',
    type: 'ENABLES',
    description: 'Educational systems provide foundation for global citizenship practice',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_mental_health',
    to: 'framework_consciousness_development',
    type: 'ENABLES',
    description: 'Mental health frameworks provide foundation for consciousness development',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_synoptic',
    to: 'framework_digital_commons',
    type: 'GUIDES',
    description: 'Synoptic Protocol provides ethical guidelines for fostering healthy discourse on Digital Public Square',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS FROM PROMETHEUS PROTOCOL TO OTHER GGF FRAMEWORKS ===
  { from: 'framework_treaty', to: 'framework_prometheus_protocol', type: 'ENABLES', description: 'The Treaty\'s TRIPS Override Clause provides the legal authority for the IP Commons.' },
  { from: 'mechanism_gcf', to: 'framework_prometheus_protocol', type: 'FUNDS', description: 'The Global Commons Fund is the long-term funding source for the protocol.' },
  { from: 'framework_hearthstone', to: 'institution_pip_commons', type: 'ENABLES', description: 'Hearthstone provides the Stewardship Trust legal structure for the IP Commons.' },
  { from: 'framework_discovery_commons', to: 'framework_prometheus_protocol', type: 'INTEGRATES_WITH', description: 'Provides the open-science research pipeline that feeds into the IP Commons.' },
  { from: 'framework_indigenous', to: 'framework_prometheus_protocol', type: 'GUIDES', description: 'The Indigenous Framework provides non-negotiable sovereignty and FPIC 2.0 protocols for traditional knowledge.' },
  { from: 'council_earth', to: 'council_gpsc', type: 'INFORMS', description: 'The Earth Council provides permanent Indigenous representation and co-chairship on the GPSC.' },
  { from: 'framework_global_health', to: 'framework_prometheus_protocol', type: 'COORDINATES_WITH', description: 'The Prometheus Protocol serves as the primary mechanism for producing and distributing medicines needed by the Global Health framework.' },
  { from: 'framework_prometheus_protocol', to: 'institution_dj_tribunal', type: 'ESCALATES_TO', description: 'The Healing Justice Tribunal adjudicates disputes over IP, biopiracy, and access.' },
  { from: 'framework_aubi', to: 'framework_prometheus_protocol', type: 'INTEGRATES_WITH', description: 'Hearts are used to reward Community Health Legions for last-mile delivery.' },

  // === DISCOVERY COMMONS - EXTERNAL GGF CONNECTIONS ===
  { from: 'framework_discovery_commons', to: 'framework_education', type: 'INFORMS', description: 'Provides the verifiable, open-access knowledge that forms the basis of curricula in the Education Systems Framework.' },
  { from: 'framework_discovery_commons', to: 'framework_synoptic', type: 'INFORMS', description: 'Supplies the trusted scientific knowledge that Public Epistemic Institutions use to combat misinformation.' },
  { from: 'framework_discovery_commons', to: 'framework_prometheus_protocol', type: 'ENABLES', description: 'Provides the open R&D pipeline for the Prometheus Protocol\'s Community Priority Forum and clinical trials.' },
  { from: 'framework_indigenous', to: 'protocol_indigenous_research_sovereignty', type: 'GUIDES', description: 'The Indigenous Framework provides the non-negotiable principles for the Indigenous Research Sovereignty Protocol.' },
  { from: 'protocol_ethical_ip', to: 'framework_hearthstone', type: 'IMPLEMENTS', description: 'The Ethical IP Protocol uses the Stewardship Trust legal structure from the Hearthstone Protocol to hold knowledge in the commons.' },
  { from: 'framework_discovery_commons', to: 'institution_dj_tribunal', type: 'ESCALATES_TO', description: 'The Epistemic Justice Chamber of the DJ Tribunal adjudicates cases of research misconduct or IP violations.' },

  // === KINTSUGI PROTOCOL: CONNECTIONS TO OTHER GGF FRAMEWORKS ===
  { from: 'framework_kintsugi_protocol', to: 'framework_justice', type: 'ESCALATES_TO', description: 'The protocol is the primary restorative system; harms that cannot be resolved are escalated to the formal Healing Justice Tribunal.' },
  { from: 'framework_peace', to: 'framework_kintsugi_protocol', type: 'INFORMS', description: 'The Peace & Conflict Resolution Framework provides the core training and methodologies for Community Safety Weavers.' },
  { from: 'framework_mental_health', to: 'framework_kintsugi_protocol', type: 'INTEGRATES_WITH', description: 'Provides the principles and support systems for Crisis Sanctuaries and Harm Reduction Teams.' },
  { from: 'framework_aubi', to: 'framework_kintsugi_protocol', type: 'ENABLES', description: 'AUBI provides the economic stability to prevent root causes of harm and rewards care work via Hearts.' },
  { from: 'framework_disability', to: 'framework_kintsugi_protocol', type: 'VALIDATES', description: 'The Foundation Protocol (Disability Justice) provides non-negotiable standards for accessibility and neuro-inclusion in all CCSF operations.' },
  { from: 'framework_indigenous', to: 'framework_kintsugi_protocol', type: 'GUIDES', description: 'The Indigenous Framework\'s principles of justice and sovereignty are paramount in BAZs, with the Red Lines Clause ensuring community control.' },
  { from: 'framework_aurora_accord', to: 'platform_community_safety', type: 'GUIDES', description: 'The Aurora Accord provides the mandatory data sovereignty, privacy, and anti-surveillance rules for the Community Safety Platform.' },
  { from: 'framework_drr', to: 'framework_kintsugi_protocol', type: 'COORDINATES_WITH', description: 'In large-scale emergencies, the DRR framework coordinates the on-the-ground response of CCSF teams.' },

  // === SANCTUARY ACCORD RELATIONSHIPS ===

  // Sanctuary Accord establishment relationships
  {
    from: 'framework_sanctuary_accord',
    to: 'council_neuro_ethics_review',
    type: 'ESTABLISHES',
    description: 'Sanctuary Accord establishes NERB as primary oversight body'
  },
  {
    from: 'framework_sanctuary_accord',
    to: 'mechanism_sacred_reciprocity_license',
    type: 'ESTABLISHES',
    description: 'Framework establishes reciprocity licensing system'
  },

  // Integration with existing frameworks
  {
    from: 'framework_indigenous',
    to: 'protocol_red_lines_clause',
    type: 'ENFORCES',
    description: 'Indigenous Framework enforces Red Lines through Earth Council authority'
  },
  {
    from: 'council_earth',
    to: 'council_neuro_ethics_review',
    type: 'GUIDES',
    description: 'Earth Council provides Indigenous sovereignty guidance to NERB'
  },
  {
    from: 'framework_disability',
    to: 'process_cognitive_equity_audit',
    type: 'VALIDATES',
    description: 'Disability Justice validates cognitive equity standards'
  },

  // Economic integration
  {
    from: 'mechanism_sacred_reciprocity_license',
    to: 'platform_love_ledger',
    type: 'USES_DATA_FROM',
    description: 'Reciprocity payments tracked transparently on Love Ledger'
  },
  {
    from: 'mechanism_hearts',
    to: 'mechanism_sacred_reciprocity_license',
    type: 'IMPLEMENTS',
    description: 'Reciprocity payments often distributed in Hearts currency'
  },

  // Justice system integration
  {
    from: 'institution_dj_tribunal',
    to: 'mechanism_sacred_reciprocity_license',
    type: 'ENFORCES',
    description: 'Digital Justice Tribunal adjudicates license violations'
  },

  // BAZ implementation
  {
    from: 'institution_baz',
    to: 'institution_baz_sanctuary_councils',
    type: 'IMPLEMENTS',
    description: 'BAZs implement local Sanctuary Councils for community governance'
  },

  // --- Hearthlight Establishes its Entities ---
  { from: 'framework_hearthlight_protocol', to: 'institution_chamber_of_the_guardian', type: 'ESTABLISHES' },
  { from: 'framework_hearthlight_protocol', to: 'process_baz_child_family_weaver', type: 'ESTABLISHES' },
  { from: 'framework_hearthlight_protocol', to: 'institution_sapling_councils', type: 'ESTABLISHES' },
  { from: 'framework_hearthlight_protocol', to: 'metric_cfi', type: 'ESTABLISHES' },

  // --- Connections from Hearthlight framework to other GGF Frameworks (from the doc) ---
  { from: 'institution_chamber_of_the_guardian', to: 'institution_dj_tribunal', type: 'INTEGRATES_WITH', description: 'The Chamber of the Guardian is a specialized chamber within the Digital Justice Tribunal.' },
  { from: 'process_baz_child_family_weaver', to: 'framework_work_liberation', type: 'IMPLEMENTS', description: 'Child & Family Weavers are a specialized role within the Work in Liberation framework.' },
  { from: 'framework_aubi', to: 'process_baz_child_family_weaver', type: 'REWARDS', description: 'AUBI (Hearts) provides the economic reward for the care work performed by Weavers.' },
  { from: 'institution_sapling_councils', to: 'framework_youth', type: 'INTEGRATES_WITH', description: 'Sapling Councils are the designated "on-ramp" for the Horizon Protocol (Youth Framework).' },
  { from: 'council_global_metrology', to: 'metric_cfi', type: 'OVERSEES', description: 'The Global Metrology Council governs and standardizes the Childhood Flourishing Index.' },
  { from: 'framework_egp', to: 'framework_hearthlight_protocol', type: 'IMPLEMENTS', description: 'The Parent & Community Feedback Forums use the EGP (`sense`, `propose`, `adopt`) as their formal feedback mechanism.' },
  { from: 'framework_indigenous', to: 'framework_hearthlight_protocol', type: 'GUIDES', description: 'The Indigenous Framework provides foundational pedagogical models and wisdom for child-rearing.' },
  { from: 'framework_mos', to: 'framework_hearthlight_protocol', type: 'GUIDES', description: 'The Moral Operating System provides the foundational Charter of Childhood Rights.' },
  { from: 'framework_synoptic', to: 'framework_hearthlight_protocol', type: 'INTEGRATES_WITH', description: 'The Digital Shield Protocol is a sub-protocol of the Synoptic Protocol to protect children online.' }

];
