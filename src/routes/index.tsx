import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { productsQueryOptions } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import klexLogo from "@/assets/klex-logo.png.asset.json";
import heroImg from "@/assets/hero-straps.jpg";
import reviewImg from "@/assets/review-lifter.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KLEX — Lifting Straps & Strength Gear" },
      {
        name: "description",
        content:
          "Raw cotton lifting straps, wrist wraps, belts and chalk built for the rep your grip gives up on. Free 30-day returns, lifetime stitching.",
      },
      { property: "og:title", content: "KLEX — Lifting Straps & Strength Gear" },
      {
        property: "og:description",
        content:
          "Lifting gear, no fillers. Straps, wraps, belts and chalk built in-house for the last rep you'd otherwise bail on.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const HERO_PRODUCT_HANDLE = "klex-d-ring-lifting-straps";

function Index() {
  const { data: products, isLoading } = useQuery(productsQueryOptions());
  const addItem = useCartStore((state) => state.addItem);
  const cartLoading = useCartStore((state) => state.isLoading);

  const heroProduct =
    products?.find((p) => p.handle === HERO_PRODUCT_HANDLE) ??
    products?.find((p) => p.handle.includes("strap")) ??
    products?.[0];
  const heroVariant = heroProduct?.variants.edges[0]?.node;

  const handleHeroAdd = async () => {
    if (!heroProduct || !heroVariant) return;
    await addItem({
      product: heroProduct,
      variantId: heroVariant.id,
      variantTitle: heroVariant.title,
      price: heroVariant.price,
      quantity: 1,
      selectedOptions: heroVariant.selectedOptions ?? [],
    });
  };

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
            <a href="#gear" className="transition-colors hover:text-bone">
              Gear
            </a>
            <Link
              to="/about"
              className="transition-colors hover:text-bone"
            >
              About Us
            </Link>
            <a href="#why" className="transition-colors hover:text-bone">
              Why KLEX
            </a>
          </nav>
          <CartDrawer />
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-ink">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-14 md:pb-28 md:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="mb-6 text-[11px] uppercase tracking-[0.28em] text-brass">
                Lifting Straps · The Anchor
              </p>
              <h1
                className="max-w-[18ch] font-display text-[64px] font-bold leading-[0.92] text-balance md:text-[88px]"
                style={{
                  background:
                    "linear-gradient(160deg,#ff4a44 0%,#e5322d 42%,#ececea 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Grip That Holds The Bar
              </h1>
              <p className="mt-6 max-w-[46ch] text-base text-pretty text-ash md:text-lg">
                D-ring cuffed lifting straps built to take the complex out of lifting,
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <button
                  onClick={handleHeroAdd}
                  disabled={!heroVariant || cartLoading}
                  className="flex items-center gap-2 rounded-[10px] bg-oxblood px-7 py-3.5 font-display text-sm font-medium uppercase tracking-[0.14em] text-bone ring-1 ring-oxblood/50 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cartLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  Add to Cart
                  <span className="text-bone/70">
                    {heroVariant
                      ? `$${parseFloat(heroVariant.price.amount).toFixed(0)}`
                      : "$34"}
                  </span>
                </button>
                <a
                  href="#gear"
                  className="text-[13px] uppercase tracking-[0.14em] text-bone underline decoration-ash/60 underline-offset-4 transition-colors hover:decoration-bone"
                >
                  Shop all gear
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-[12px] uppercase tracking-[0.1em] text-ash">
                <span className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-tape" />
                  Free 30-day returns
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-tape" />
                  Lifetime stitching
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-tape" />
                  Made in-house
                </span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <img
                  src={heroImg}
                  alt="Chalked hands in cotton lifting straps gripping a barbell"
                  className="w-full rounded-2xl object-cover shadow-2xl"
                  width={1024}
                  height={1280}
                />
                <div className="absolute -bottom-5 -left-5 rounded-[10px] bg-bone px-5 py-4 shadow-lg ring-1 ring-black/5">
                  <p className="font-display text-2xl font-semibold leading-none text-ink">
                    $19.99
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink/60">
                    Cotton Lifting Straps
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section id="gear" className="bg-ink2">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-brass">
                The Lineup
              </p>
              <h2 className="font-display text-4xl font-semibold text-balance text-bone md:text-5xl">
                Lifting Gear, No Fillers
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="grid place-items-center py-20">
              <Loader2 className="size-8 animate-spin text-brass" />
            </div>
          ) : !products || products.length === 0 ? (
            <div className="grid place-items-center rounded-xl bg-ink py-20 ring-1 ring-white/5">
              <p className="font-display text-2xl text-bone">No products found</p>
              <p className="mt-2 text-sm text-ash">
                The lineup is restocking — check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY / GUARANTEE */}
      <section id="why" className="border-t border-white/10 bg-ink">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-brass">
            Why KLEX
          </p>
          <h2 className="max-w-[20ch] font-display text-4xl font-semibold text-balance text-bone md:text-5xl">
            Built for the rep your grip gives up on.
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            <div className="border-l-2 border-oxblood pl-5">
              <h3 className="font-display text-xl font-medium text-bone">
                Grip that holds
              </h3>
              <p className="mt-2 text-[15px] text-pretty text-ash">
                A wrap that tightens with every pull. No slippage past rep ten, no re-wrapping mid-set with our silicon technology.
              </p>
            </div>
            <div className="border-l-2 border-brass pl-5">
              <h3 className="font-display text-xl font-medium text-bone">
                Material, not marketing
              </h3>
              <p className="mt-2 text-[15px] text-pretty text-ash">
                Heavy Duty D Ring Lifting Straps for Weightlifting, Gym Training, Thick Padded Grip Supported Gym Straps.
              </p>
            </div>
            <div className="border-l-2 border-tape pl-5">
              <h3 className="font-display text-xl font-medium text-bone">
                Lifetime stitching
              </h3>
              <p className="mt-2 text-[15px] text-pretty text-ash">
                If the seams give out, we re-stitch them free. Every pair, for
                the life of the gear.
              </p>
            </div>
          </div>

          {/* GUARANTEE BAND */}
          <div className="mt-16 grid items-center gap-8 rounded-2xl bg-ink2 p-8 ring-1 ring-white/5 md:p-10 lg:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-brass">
                The KLEX Guarantee
              </p>
              <h3 className="mt-4 font-display text-3xl font-medium leading-tight text-balance text-bone md:text-4xl">
                Train it hard for 30 days. If it isn't the best gear you've
                gripped, send it back.
              </h3>
              <p className="mt-4 max-w-[46ch] text-[15px] text-pretty text-ash">
                Free returns on every order, lifetime re-stitching on every
                seam, and gear cut, stitched and packed in-house. No fine
                print, just kit that holds.
              </p>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <img
                src={reviewImg}
                alt="Powerlifter gripping a loaded barbell under chalk dust"
                className="size-48 rounded-2xl object-cover ring-1 ring-white/10 md:size-56"
                loading="lazy"
                width={800}
                height={800}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-oxblood">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center md:py-24">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-bone/70">
            KLEX MADE TO FLEX
          </p>
          <h2 className="mx-auto max-w-[16ch] font-display text-5xl font-bold text-balance text-bone md:text-6xl">
            Ready When The Bar Is
          </h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-base text-pretty text-bone/80">
            Free 30-day returns on everything. If it doesn't deadlift your
            palms back to life, send it back.
          </p>
          <a
            href="#gear"
            className="mt-9 inline-flex items-center gap-2 rounded-[10px] bg-bone px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink ring-1 ring-bone/50 transition-transform hover:-translate-y-0.5"
          >
            Shop Lifting Straps
          </a>
        </div>
      </section>

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
            <a href="#why" className="transition-colors hover:text-bone">
              Support
            </a>
            <a href="#why" className="transition-colors hover:text-bone">
              Shipping
            </a>
            <a href="#why" className="transition-colors hover:text-bone">
              Returns
            </a>
          </div>
          <span className="text-[12px] text-ash/70">
            © 2026 KLEX Supply Co.
          </span>
        </div>
      </footer>
    </div>
  );
}
