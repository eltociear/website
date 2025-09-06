// src/routes/frameworks/social-fabric/+page.js
import { error } from '@sveltejs/kit';

export async function load({ params, url }) {
  try {
    // For now, just return basic metadata since this is a coming soon page
    return {
      framework: {
        id: 'framework_social_fabric',
        name: 'The Social Fabric Framework',
        shortName: 'Social Fabric Framework',
        status: 'Planned',
        tier: 2,
        expectedLaunch: 'Q3 2025',
        primaryDomain: 'Governance',
        description: 'A modular, context-aware social technology for building trust, healing collective trauma, and fostering the social cohesion necessary for regenerative governance.'
      },
      // Will be replaced with actual component when framework is ready
      component: null
    };
  } catch (e) {
    throw error(404, 'Framework not found');
  }
}
