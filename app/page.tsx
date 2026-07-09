export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center gap-8 px-12">
      <div>
        <p className="font-satoshi text-label uppercase tracking-widest text-cognac">
          Design System — Day 1
        </p>
        <h1 className="font-vollkorn text-section-mobile md:text-section text-parchment">
          Luxury is a Language.
        </h1>
      </div>

      <div>
        <p className="font-vollkorn italic text-3xl text-cognac">
          Vollkorn — The Business of Luxury
        </p>
        <p className="font-satoshi text-body text-parchment">
          Satoshi — If luxury and premium is your space, then Sleek Wealth was
          built for you.
        </p>
      </div>

      <div className="flex gap-4">
        <div className="rounded-sw border border-cognac px-6 py-4">
          <p className="font-satoshi text-body-mobile text-parchment">
            aubergine background
          </p>
        </div>
        <div className="rounded-sw bg-bordeaux px-6 py-4">
          <p className="font-satoshi text-body-mobile text-parchment">
            bordeaux fill
          </p>
        </div>
      </div>
    </main>
  );
}
