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
  }
];
