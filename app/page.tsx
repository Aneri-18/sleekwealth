import Link from 'next/link'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ExpandingContainer from './components/ExpandingContainer'
import StoryCards from './components/StoryCards'
import ProgramListItem from './components/ProgramListItem'
import BlogCard from './components/BlogCard'
import CTAButtons from './components/CTAButtons'

const PROGRAMS = [
  {
    name: 'Positioning Clarity',
    description:
      "Your brand is saying something. The question is whether it's saying what you intend.",
  },
  {
    name: 'Pricing Architecture',
    description: 'Price is not a number. It is a signal.',
  },
  {
    name: 'Brand Dilution Audit',
    description:
      'A discount. A collaboration. A second line. Each felt reasonable at the time.',
  },
  {
    name: 'Founder Positioning',
    description:
      'You are visible. The question is whether your visibility is building the brand or diluting it.',
  },
  {
    name: 'Spatial Experience',
    description: 'The room is never just a room.',
  },
]

const STORY_CARDS = [
  {
    number: 1,
    title: 'Reach Out.',
    body: 'Just say Hello.',
  },
  {
    number: 2,
    title: 'We Talk.',
    body: 'A short call to understand where your brand stands and where it needs to go.',
  },
  {
    number: 3,
    title: 'We Begin.',
    body: 'From exactly where your brand stands. Nothing assumed. Nothing rushed.',
  },
]

const BLOG_POSTS = [
  {
    heroImage: '/images/placeholder-blog-1.png',
    title: 'What Your Pricing Says When You Say Nothing',
    date: 'Jan 12, 2026',
    author: 'Aneri Shah',
    readingTime: '6 min read',
  },
  {
    heroImage: '/images/placeholder-blog-2.png',
    title: 'The Discount That Cost More Than It Made',
    date: 'Feb 3, 2026',
    author: 'Aneri Shah',
    readingTime: '4 min read',
  },
  {
    heroImage: '/images/placeholder-blog-3.png',
    title: 'Founder-Led Is Not the Same as Founder-Diluted',
    date: 'Mar 21, 2026',
    author: 'Aneri Shah',
    readingTime: '8 min read',
  },
  {
    heroImage: '/images/placeholder-blog-4.png',
    title: 'The Room Is Never Just a Room',
    date: 'Apr 15, 2026',
    author: 'Aneri Shah',
    readingTime: '5 min read',
  },
]

export default function Home() {
  return (
    <main>
      {/* SECTION 1 — HERO */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-aubergine px-6">
        <Nav />
        <h1 className="text-center font-vollkorn text-hero-mobile text-parchment md:text-hero">
          Luxury is a Language.
        </h1>
      </section>

      {/* SECTION 2 — TWO BOXES */}
      <section className="bg-aubergine px-6 py-24 md:px-12 md:py-32">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex min-h-[220px] items-center justify-center rounded-sw border border-cognac p-8 text-center transition-colors duration-300 hover:bg-bordeaux">
            <p className="font-satoshi text-body text-parchment">
              And like any language, fluency takes years to build.
            </p>
          </div>
          <div className="flex min-h-[220px] items-center justify-center rounded-sw border border-cognac p-8 text-center">
            <p className="font-satoshi text-body text-parchment">
              If luxury and premium is your space, then Sleek Wealth was built
              for you.
            </p>
          </div>
        </div>
        <div className="mt-6 flex min-h-[140px] items-center justify-center rounded-sw border border-cognac p-8 text-center">
          <p className="font-satoshi text-body text-parchment">
            To help you master this fluency faster.
          </p>
        </div>
      </section>

      {/* SECTION 3 — EXPANDING CONTAINER */}
      <section className="bg-aubergine px-6 py-24 md:px-24 md:py-32">
        <ExpandingContainer
          imageSrc="/images/placeholder-dark.png"
          alt="Sleek Wealth"
          className="aspect-video w-full"
        />
      </section>

      {/* SECTION 4 — POSITIONING EQUATION */}
      <section className="bg-bordeaux px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center">
          <p className="font-satoshi text-body-mobile text-parchment md:text-body">
            Luxury lives and dies by positioning.
          </p>
          <p className="font-satoshi text-body-mobile text-parchment md:text-body">
            Understanding it is where the real work begins.
          </p>
        </div>
        <p className="mt-12 text-center font-vollkorn text-hero-mobile text-parchment md:text-hero">
          Positioning = Pricing + Perception
        </p>
      </section>

      {/* SECTION 5 — THE WORK PREVIEW */}
      <section className="bg-bordeaux px-6 pb-24 md:px-12 md:pb-32">
        <p className="font-satoshi text-label uppercase tracking-widest text-cognac">
          THE WORK.
        </p>
        <h2 className="mt-4 font-vollkorn text-section-mobile text-parchment md:text-section">
          Eight ways we help brands become inevitable.
        </h2>

        <div className="mt-12 flex flex-col">
          {PROGRAMS.map((program) => (
            <ProgramListItem
              key={program.name}
              name={program.name}
              description={program.description}
            />
          ))}
        </div>

        <Link
          href="/work"
          className="mt-8 inline-block font-satoshi text-body-mobile text-cognac transition-colors hover:text-parchment"
        >
          All eight →
        </Link>
      </section>

      {/* SECTION 6 — HOW IT WORKS */}
      <section className="bg-aubergine px-6 py-24 md:px-12 md:py-32">
        <h2 className="font-vollkorn text-section-mobile text-parchment md:text-section">
          How It Works.
        </h2>
        <p className="mt-4 font-satoshi text-body-mobile text-cognac md:text-body">
          As easy as 1-2-3.
        </p>

        <div className="mt-12">
          <StoryCards cards={STORY_CARDS} />
        </div>
      </section>

      {/* SECTION 7 — BLOG PREVIEW */}
      <section className="bg-bordeaux py-24 md:py-32">
        <div className="px-6 md:px-12">
          <p className="font-satoshi text-label uppercase tracking-widest text-cognac">
            THE BLOG.
          </p>
          <h2 className="mt-4 font-vollkorn text-section-mobile text-parchment md:text-section">
            Learn how to make luxury inevitable.
          </h2>
        </div>

        <div className="mt-12 flex gap-6 overflow-x-auto px-6 pb-4 md:px-12">
          {BLOG_POSTS.map((post, i) => (
            <div
              key={post.title}
              className={`w-64 shrink-0 md:w-72 ${
                i % 2 === 1 ? 'md:mt-10' : ''
              }`}
            >
              <BlogCard {...post} />
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center font-satoshi text-body-mobile text-parchment md:text-body">
          If you have read this far, you already know if this is for you.
        </p>

        <div className="mx-auto mt-8 max-w-md px-6 md:px-0">
          <CTAButtons />
        </div>
      </section>

      {/* SECTION 8 — FOOTER */}
      <Footer />
    </main>
  )
}
