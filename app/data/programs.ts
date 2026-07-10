export interface ProgramDetail {
  achievements: string[]
  paragraph: string
  features: { name: string; line: string }[]
}

export interface Program {
  slug: string
  name: string
  line: string
  detail?: ProgramDetail
}

export const PROGRAMS: Program[] = [
  {
    slug: 'positioning-clarity',
    name: 'Positioning Clarity',
    line: "Your brand is saying something. The question is whether it's saying what you intend.",
    detail: {
      achievements: ['Market Clarity', 'Category Distinction', 'Brand Coherence'],
      paragraph:
        'If your brand cannot say, in one sentence, what it is and who it is for, the market will decide for you. Positioning Clarity is where we do that work — stripping the brand back to what it actually signals, then rebuilding the sentence that should be driving every decision after it. It is not a rebrand. It is not a workshop with no output. It is a single, defensible answer to the only question that matters: what does this brand deserve to charge, and why.',
      features: [
        { name: 'Clarity', line: 'One sentence the whole business can build from.' },
        { name: 'Signal Audit', line: 'Every touchpoint reviewed for what it actually says.' },
        { name: 'Language', line: 'The words that carry the positioning into the market.' },
        { name: 'Implementation Path', line: 'What changes first, what waits, what stays.' },
      ],
    },
  },
  { slug: 'pricing-architecture', name: 'Pricing Architecture', line: 'Price is not a number. It is a signal.' },
  {
    slug: 'launch-positioning',
    name: 'Launch Positioning',
    line: 'The most expensive mistake in luxury is launching before the signal is clear.',
  },
  {
    slug: 'brand-dilution-audit',
    name: 'Brand Dilution Audit',
    line: 'A discount. A collaboration. A second line. Each decision felt reasonable at the time.',
  },
  { slug: 'spatial-experience', name: 'Spatial Experience', line: 'The room is never just a room.' },
  {
    slug: 'founder-positioning',
    name: 'Founder Positioning',
    line: 'You are visible. The question is whether your visibility is building the brand or diluting it.',
  },
  {
    slug: 'legacy-brand-modernisation',
    name: 'Legacy Brand Modernisation',
    line: 'Heritage is an asset. Until it becomes a constraint.',
  },
  {
    slug: 'tactile-brand-experience',
    name: 'Tactile Brand Experience',
    line: 'The hand knows before the mind decides.',
  },
]
