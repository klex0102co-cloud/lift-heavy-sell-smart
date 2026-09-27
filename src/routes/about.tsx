import { createFileRoute, Link } from "@tanstack/react-router";
import klexLogo from "@/assets/klex-logo.png.asset.json";
import founder1 from "@/assets/founder-1.jpg.asset.json";
import founder2 from "@/assets/founder-2.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — KLEX" },
      {
        name: "description",
        content:
          "Meet the founders behind KLEX. Two lifters building heavy-duty D-ring lifting straps — complex made easy.",
      },
      { property: "og:title", content: "About Us — KLEX" },
      {
        property: "og:description",
        content:
          "Meet the founders behind KLEX. Two lifters building heavy-duty D-ring lifting straps — complex made easy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const founders = [
  {
    name: "Allen Xue",
    role: "FOUNDER & CO-FOUNDER",
    photo: founder1.url,
    photoWidth: 1440,
    photoHeight: 1080,
    bio: [
      'Meet Allen,\nAllen created KLEX to empower people from all ages to elevate gym performance with lifting straps that are reliable and durable. Allen said, "with one simple fact in mind, your grip gets tired before anything else, we found our one goal, taking the guess work out of productive lifting."',
    ],
  },
  {
    name: "Kristian Zahariev",
    role: "FOUNDER & CO-FOUNDER",
    photo: founder2.url,
    photoWidth: 1274,
    photoHeight: 1559,
    bio: [
      "Write the second founder's bio here — who they are, how they train, and why they started KLEX.",
    ],
  },
];

function About() {
  return (
    <div className="min-h-screen bg-ink">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={klexLogo.url}
              alt="KLEX"
              className="h-6 w-auto md:h-7"
              width={938}
              height={301}
            />
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-ash sm:block">
              COMPLEX MADE EASY
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] uppercase tracking-[0.12em] text-ash md:flex">
            <Link to="/" className="transition-colors hover:text-bone">
              Gear
            </Link>
            <Link
              to="/about"
              className="text-bone transition-colors hover:text-bone"
            >
              About Us
            </Link>
          </nav>
        </div>
      </header>

      {/* INTRO */}
      <section className="border-b border-white/10 bg-ink">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-brass">
            About Us
          </p>
          <h1 className="max-w-[20ch] font-display text-5xl font-bold leading-[0.95] text-balance text-bone md:text-6xl">
            Complex Made Easy
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-pretty text-ash">
            KLEX started with a simple frustration: straps that looked the
            part but gave out mid-set. So we built our own — heavy D-ring
            straps cut, stitched and packed in-house, priced without the
            gimmicks. Simple, effective, and easy.
          </p>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="bg-ink">
        <div className="mx-auto max-w-7xl space-y-16 px-6 py-20 md:py-24">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12"
            >
              <div
                className={
                  index % 2 === 0 ? "lg:col-span-5" : "lg:col-span-5 lg:order-2"
                }
              >
                {founder.photo ? (
                  <img
                    src={founder.photo}
                    alt={founder.name}
                    className="w-full rounded-2xl object-cover ring-1 ring-white/10"
                    loading="lazy"
                    width={founder.photoWidth}
                    height={founder.photoHeight}
                  />
                ) : (
                  <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl bg-ink2 ring-1 ring-white/10">
                    <p className="px-6 text-center text-[12px] uppercase tracking-[0.14em] text-ash">
                      Founder photo — add one anytime
                    </p>
                  </div>
                )}
              </div>
              <div
                className={
                  index % 2 === 0 ? "lg:col-span-7" : "lg:col-span-7 lg:order-1"
                }
              >
                <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-brass">
                  {founder.role}
                </p>
                <h2 className="font-display text-3xl font-semibold text-bone md:text-4xl">
                  {founder.name}
                </h2>
                <div className="mt-5 space-y-4">
                  {founder.bio.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="max-w-[60ch] text-[15px] text-pretty text-ash"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
          <img
            src={klexLogo.url}
            alt="KLEX"
            className="h-7 w-auto"
            width={938}
            height={301}
          />
          <div className="flex gap-6 text-[12px] uppercase tracking-[0.12em] text-ash">
            <Link to="/" className="transition-colors hover:text-bone">
              Gear
            </Link>
            <Link to="/about" className="transition-colors hover:text-bone">
              About Us
            </Link>
          </div>
          <span className="text-[12px] text-ash/70">© 2026 KLEX Supply Co.</span>
        </div>
      </footer>
    </div>
  );
}
