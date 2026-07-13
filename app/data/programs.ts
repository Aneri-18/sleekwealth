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
    line: 'Your brand is saying something. The question is whether it’s saying what you intend.',
    detail: {
      achievements: ['Market Clarity', 'Category Distinction', 'Brand Coherence'],
      paragraph:
        'If your brand cannot say, in one sentence, what it is and who it is for, the market will decide for you. Positioning Clarity is where that sentence gets built — stripping the brand back to what it actually signals, then rebuilding the line that should be driving every decision after it. The output is singular and defensible: one sentence, precise enough to hold every future call to it.',
      features: [
        { name: 'Clarity', line: 'One sentence the whole business can build from.' },
        { name: 'Signal Audit', line: 'Every touchpoint reviewed for what it actually says.' },
        { name: 'Language', line: 'The words that carry the positioning into the market.' },
        { name: 'Implementation Path', line: 'What changes first. What waits. What stays.' },
      ],
    },
  },
  {
    slug: 'pricing-architecture',
    name: 'Pricing Architecture',
    line: 'Price is not a number. It is a signal.',
    detail: {
      achievements: ['Price Integrity', 'Signal Discipline', 'Margin Architecture'],
      paragraph:
        'Every price you set is a claim about who you are. Drop it under pressure and you are not being competitive — you are rewriting the claim, one transaction at a time. Pricing Architecture is where that work happens — mapping what the price is actually signaling, then rebuilding the structure that lets you hold it under pressure. The output is a single, defensible answer to the only question that matters: what does this price protect, and why.',
      features: [
        { name: 'Price Audit', line: 'Every price point checked against what it actually signals.' },
        { name: 'Elasticity Mapping', line: 'Where the market will follow, and where it will not.' },
        { name: 'Discount Discipline', line: 'The rules that keep a markdown from becoming a habit.' },
        { name: 'Implementation Path', line: 'What changes first, what waits, what stays.' },
      ],
    },
  },
  {
    slug: 'launch-positioning',
    name: 'Launch Positioning',
    line: 'The most expensive mistake in luxury is launching before the signal is clear.',
    detail: {
      achievements: ['Launch Readiness', 'Signal Sequencing', 'Category Entry'],
      paragraph:
        'A launch is the one moment the market has no prior opinion of you — which means it is the one moment you cannot afford to be unclear. Launch Positioning is where we do that work — pressure-testing the signal before it reaches the market, then sequencing the reveal so nothing lands out of order. It is not a marketing calendar. It is not a hype plan with no substance behind it. It is a single, defensible answer to the only question that matters: what should the market believe the moment it first sees you, and why.',
      features: [
        { name: 'Signal Rehearsal', line: 'Every claim tested before the market ever sees it.' },
        { name: 'Sequencing', line: 'What reveals first, what follows, what waits.' },
        { name: 'Category Entry', line: 'The position you claim on day one, not day one hundred.' },
        { name: 'Implementation Path', line: 'What changes first, what waits, what stays.' },
      ],
    },
  },
  {
    slug: 'brand-dilution-audit',
    name: 'Brand Dilution Audit',
    line: 'A discount. A collaboration. A second line. Each decision felt reasonable at the time.',
    detail: {
      achievements: ['Dilution Diagnosis', 'Signal Recovery', 'Decision Discipline'],
      paragraph:
        'No single decision dilutes a brand. It is the discount that made sense in a slow quarter, the collaboration that seemed like exposure, the second line that seemed like growth — each reasonable alone, corrosive together. Brand Dilution Audit is where we do that work — tracing every decision back to what it actually cost the signal, then drawing the line that holds from here. It is not a teardown of past decisions. It is not a report that sits in a drawer. It is a single, defensible answer to the only question that matters: what is this brand still allowed to do, and why.',
      features: [
        { name: 'Dilution Map', line: 'Every decision that quietly cost the brand its signal.' },
        { name: 'Recovery Path', line: 'What can be undone, and what has to be outgrown.' },
        { name: 'Decision Discipline', line: 'The filter every future decision has to pass through.' },
        { name: 'Implementation Path', line: 'What changes first, what waits, what stays.' },
      ],
    },
  },
  {
    slug: 'spatial-experience',
    name: 'Spatial Experience',
    line: 'The room is never just a room.',
    detail: {
      achievements: ['Spatial Signal', 'Sensory Coherence', 'Material Language'],
      paragraph:
        'The room is never just a room. It is signaling before a single word is spoken — in the material underfoot, the distance between fixtures, the light that decides what gets noticed first. Spatial Experience is where we do that work — reading the space for what it currently says, then rebuilding it to say what you intend. It is not a renovation brief. It is not a mood board with no discipline behind it. It is a single, defensible answer to the only question that matters: what does this room tell someone before they have met you, and why.',
      features: [
        { name: 'Spatial Audit', line: 'Every fixture and finish reviewed for what it signals.' },
        { name: 'Sensory Mapping', line: 'What is seen, touched, heard, and in what order.' },
        { name: 'Material Language', line: 'The materials that carry the brand into physical space.' },
        { name: 'Implementation Path', line: 'What changes first, what waits, what stays.' },
      ],
    },
  },
  {
    slug: 'founder-positioning',
    name: 'Founder Positioning',
    line: 'You are visible. The question is whether your visibility is building the brand or diluting it.',
    detail: {
      achievements: ['Founder Signal', 'Narrative Control', 'Visibility Discipline'],
      paragraph:
        "You are visible whether you intend to be or not — the only open question is what that visibility is doing to the brand. Founder Positioning is where we do that work — separating the founder's personal signal from the brand's, then deciding what belongs on which side. It is not a personal branding package. It is not a content calendar mistaken for strategy. It is a single, defensible answer to the only question that matters: what should the founder's visibility be building, and why.",
      features: [
        { name: 'Visibility Audit', line: 'Every public appearance reviewed for what it actually signals.' },
        { name: 'Narrative Architecture', line: "The story the founder is allowed to tell, and where it stops." },
        { name: 'Public Discipline', line: 'What gets said, what gets withheld, and why.' },
        { name: 'Implementation Path', line: 'What changes first, what waits, what stays.' },
      ],
    },
  },
  {
    slug: 'legacy-brand-modernisation',
    name: 'Legacy Brand Modernisation',
    line: 'Heritage is an asset. Until it becomes a constraint.',
    detail: {
      achievements: ['Heritage Leverage', 'Modern Signal', 'Continuity Design'],
      paragraph:
        "Heritage buys trust no new brand can manufacture — until the story stops moving and starts explaining why the brand hasn't. Legacy Brand Modernisation is where we do that work — separating what the heritage still earns from what it now excuses, then rebuilding the brand to carry both eras at once. It is not a rebrand that erases the archive. It is not a nostalgia campaign standing in for progress. It is a single, defensible answer to the only question that matters: what does this heritage still deserve to say, and why.",
      features: [
        { name: 'Heritage Audit', line: 'What the archive still earns, and what it now excuses.' },
        { name: 'Modern Signal', line: 'The language that proves the brand is still moving.' },
        { name: 'Continuity Design', line: 'How the old story and the new one sit in the same sentence.' },
        { name: 'Implementation Path', line: 'What changes first, what waits, what stays.' },
      ],
    },
  },
  {
    slug: 'tactile-brand-experience',
    name: 'Tactile Brand Experience',
    line: 'The hand knows before the mind decides.',
    detail: {
      achievements: ['Material Signal', 'Sensory Trust', 'Tactile Coherence'],
      paragraph:
        'The hand knows before the mind decides — the weight of an object, the resistance of a clasp, the temperature of a material are read and judged before a single claim is made. Tactile Brand Experience is where we do that work — auditing what the product says on contact, then rebuilding it to say what you intend before anyone reads a word. It is not a packaging refresh. It is not a materials swap for its own sake. It is a single, defensible answer to the only question that matters: what does this object tell someone the instant they hold it, and why.',
      features: [
        { name: 'Material Audit', line: 'Every surface and weight reviewed for what it signals on contact.' },
        { name: 'Sensory Mapping', line: 'What is felt first, and what that sets up.' },
        { name: 'Tactile Language', line: 'The materials and finishes that carry intent into the hand.' },
        { name: 'Implementation Path', line: 'What changes first, what waits, what stays.' },
      ],
    },
  },
]
