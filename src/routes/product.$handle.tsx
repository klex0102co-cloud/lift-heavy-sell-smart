import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatPrice, productQueryOptions } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import CartDrawer from "@/components/CartDrawer";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Shop Lifting Gear — KLEX" },
      {
        name: "description",
        content:
          "Product details for KLEX lifting gear — straps, wraps, belts and chalk built in-house with free 30-day returns.",
      },
      { property: "og:title", content: "Shop Lifting Gear — KLEX" },
      {
        property: "og:description",
        content:
          "Product details for KLEX lifting gear — built in-house with free 30-day returns and lifetime stitching.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading, isError } = useQuery(
    productQueryOptions(handle),
  );
  const addItem = useCartStore((state) => state.addItem);
  const isLoadingCart = useCartStore((state) => state.isLoading);

  const variant = product?.variants.edges[0]?.node;
  const img = product?.images.edges[0]?.node;
  const price = product?.priceRange.minVariantPrice;

  const handleAdd = async () => {
    if (!product || !variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
  };

  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center">
            <img
              src={klexLogo.url}
              alt="KLEX"
              className="h-6 w-auto md:h-7"
              width={938}
              height={301}
            />
          </Link>
          <CartDrawer />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] text-ash transition-colors hover:text-bone"
        >
          <ArrowLeft className="size-4" /> Back to all gear
        </Link>

        {isLoading ? (
          <div className="grid place-items-center py-32">
            <Loader2 className="size-8 animate-spin text-brass" />
          </div>
        ) : isError || !product ? (
          <div className="grid place-items-center py-32 text-center">
            <p className="font-display text-2xl text-bone">Product not found</p>
            <p className="mt-2 text-sm text-ash">
              This piece may be sold out or restocking.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-2xl bg-ink2 ring-1 ring-white/5">
              {img && (
                <img
                  src={img.url}
                  alt={img.altText ?? product.title}
                  className="w-full object-cover"
                  width={800}
                  height={800}
                />
              )}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-brass">
                {product.productType || "Lifting Gear"}
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold text-balance text-bone md:text-5xl">
                {product.title}
              </h1>
              {price && (
                <p className="mt-4 font-display text-3xl font-semibold text-bone">
                  {formatPrice(price.amount, price.currencyCode)}
                </p>
              )}
              <p className="mt-6 max-w-[52ch] text-base text-pretty text-ash">
                {product.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  onClick={handleAdd}
                  disabled={!variant || isLoadingCart || !variant.availableForSale}
                  className="flex items-center gap-2 rounded-[10px] bg-oxblood px-7 py-3.5 font-display text-sm font-medium uppercase tracking-[0.14em] text-bone ring-1 ring-oxblood/50 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingCart ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  {!variant?.availableForSale ? "Sold out" : "Add to Cart"}
                </button>
                <Link
                  to="/"
                  className="text-[13px] uppercase tracking-[0.14em] text-bone underline decoration-ash/60 underline-offset-4 transition-colors hover:decoration-bone"
                >
                  Keep shopping
                </Link>
              </div>

              <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 text-[13px] text-ash sm:grid-cols-3">
                <div>
                  <p className="font-display text-sm font-medium uppercase tracking-[0.12em] text-bone">
                    Free returns
                  </p>
                  <p className="mt-1">30 days, on everything.</p>
                </div>
                <div>
                  <p className="font-display text-sm font-medium uppercase tracking-[0.12em] text-bone">
                    Lifetime stitching
                  </p>
                  <p className="mt-1">We re-stitch, free, forever.</p>
                </div>
                <div>
                  <p className="font-display text-sm font-medium uppercase tracking-[0.12em] text-bone">
                    Made in-house
                  </p>
                  <p className="mt-1">Cut, stitched and packed by us.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
