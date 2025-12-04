// src/routes/resources/whitepapers/omega-proof/visuals/+page.js

export const prerender = true;

const visuals = [
  {
    id: 'terminal-bugs',
    title: 'Four Terminal Bugs: Cascade Failure Pattern',
    file: 'visual-four-terminal-bugs.svg',
    description: 'How architectural flaws in the Westphalian system create interlocking, reinforcing failure modes.',
    insights: [
      'Bug 1 (Sovereignty Trap): Binary territorial logic makes any ambiguity existentially threatening',
      'Bug 2 (Resource Weaponization): Strategic assets treated as weapons, not planetary resources',
      'Bug 3 (Relative-Gain Lock): Great powers optimize for rival disadvantage over absolute stability',
      'Bug 4 (Free-Rider Incentive): Actors profit from instability without penalty',
      'Each bug reinforces the others - cannot fix one without triggering the rest',
      'Auto-immune pattern: System treats coordination as infection, not solution'
    ],
    dataSource: 'The Omega Proof (2025), Section 4: The Diagnosis'
  },
  {
    id: 'cost-curve',
    title: 'The Systemic Exhaustion Cross-Over (2025-2035)',
    file: 'visual-vertical-cost-curve.svg',
    description: 'The thermodynamic trap where rising maintenance costs exceed declining productive capacity.',
    insights: [
      'Maintenance Cost (Red): Exponential rise due to war, debt service, and climate damage',
      'Productive Capacity (Blue): Declining due to demographics, EROEI, and trust erosion',
      'The Cross-Over Point (~2028-2030): The "Trap" where cost of order exceeds energy available',
      'Left of Cross-Over: Voluntary transition window (Closing)',
      'Right of Cross-Over: Forced collapse or phase transition zone'
    ],
    dataSource: 'The Omega Proof (2025), Section 6: The Trajectory'
  },
  {
    id: 'three-worlds',
    title: 'Three Possible Worlds (2025-2045)',
    file: 'visual-three-worlds.svg',
    description: 'Probability-weighted futures showing the impact of preparation on civilizational outcomes.',
    insights: [
      'World 1 (The Grinding): 70-80% probability - System continues until convergent exhaustion leads to dark age',
      'World 2 (The Salvage Pathway): 15-25% probability - Crisis-driven transition with prepared alternatives ready',
      'World 3 (The Miracle): <5% probability - Voluntary reform before crisis (structurally implausible)',
      'Each 30-point increase in Preparedness Index shifts 5% from World 1 to World 2',
      'Expected impact: 10-15 million lives saved per 30 preparedness points'
    ],
    dataSource: 'The Omega Proof (2025), Section 6: The Trajectory'
  },
  {
    id: 'preparedness-index',
    title: '2027 Preparedness Index Dashboard',
    file: 'visual-preparedness-index.svg',
    description: 'Gap analysis showing current readiness vs. required threshold for viable crisis response.',
    insights: [
      'Current aggregate score: 33/300 (11%)',
      'Required by 2030 for viable transition: 150/300 (50%)',
      'Gap: 117 points requiring 10x acceleration in development pace',
      'Architectural Readiness: 20/100 - Need complete technical specifications',
      'Demonstration Scale: 8/100 - Need 20+ pilots serving 10+ million people',
      'Cultural Penetration: 5/100 - Need 20%+ of global population recognizing coordination failure as primary threat'
    ],
    dataSource: 'The Omega Proof (2025), Section 6: The Trajectory'
  }
];

export async function load() {
  return {
    visuals
  };
}
