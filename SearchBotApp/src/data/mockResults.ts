import { SearchResultPayload } from '@/types';

export const mockResults: Record<string, SearchResultPayload> = {
  default: {
    summary:
      'After reviewing top repair forums, manufacturer manuals, and troubleshooting videos, the most common leak source is worn teflon tape or a hairline crack inside the shower arm. A 20-minute resealing process fixes 82% of reported cases.',
    steps: [
      {
        id: 'step-1',
        title: 'Shut off water & prep area',
        description: 'Turn off water at the shower valve, dry the threads, and place a towel in the tub to protect from scratching.',
      },
      {
        id: 'step-2',
        title: 'Remove shower head',
        description: 'Use adjustable pliers with a cloth grip, rotating counterclockwise until the head detaches.',
      },
      {
        id: 'step-3',
        title: 'Inspect parts',
        description: 'Check washer and shower arm threads for cracks or mineral buildup. Replace washer if flattened.',
      },
      {
        id: 'step-4',
        title: 'Reseal threads',
        description: 'Apply 6 wraps of PTFE tape clockwise, then add a thin bead of plumber’s thread sealant rated for hot water.',
      },
      {
        id: 'step-5',
        title: 'Reinstall & test',
        description: 'Tighten gently until snug, restore water, and test for 60 seconds. Observe for leaks at the joint.',
      },
    ],
    decisionFactors: [
      {
        id: 'factor-1',
        label: 'Total materials cost',
        detail: '$12-18 (PTFE tape, sealant, replacement washer) based on Home Depot + Lowe’s pricing.',
      },
      {
        id: 'factor-2',
        label: 'Time to complete',
        detail: '20-30 minutes with common household tools.',
      },
      {
        id: 'factor-3',
        label: 'When to call a pro',
        detail: 'If shower arm is cracked inside the wall or corrosion is visible on supply pipe, consult a plumber ($120 avg).',
      },
    ],
    sources: [
      {
        id: 'source-1',
        title: 'Family Handyman - Stop Shower Arm Leaks',
        url: 'https://www.familyhandyman.com/project/fix-a-leaking-shower/',
        credibility: 87,
        snippet: 'Step-by-step walkthrough backed by plumbing professionals with emphasis on resealing best practices.',
      },
      {
        id: 'source-2',
        title: 'Moen Support - Shower Head Maintenance',
        url: 'https://solutions.moen.com/Article_Library/Showerhead_Maintenance',
        credibility: 92,
        snippet: 'Manufacturer repair bulletin identifying gasket wear as the leading cause of leaks.',
      },
      {
        id: 'source-3',
        title: 'Reddit r/HomeImprovement',
        url: 'https://www.reddit.com/r/HomeImprovement',
        credibility: 72,
        snippet: 'Aggregated DIY testimonials citing PTFE tape failures after 2-3 years of use.',
      },
    ],
    estimatedTimeMinutes: 25,
    difficulty: 'easy',
    recommendedActions: [
      'Pick up PTFE tape, sealant, and spare washer before starting',
      'Take before/after photos for warranties or landlord records',
      'Re-test after 24 hours to ensure seal integrity',
    ],
  },
};
