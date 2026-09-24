import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProductNode } from "@/lib/shopify";

export default function ProductCard({
  product,
}: {
  product: ShopifyProductNode;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const variant = product.variants.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const img = product.images.edges[0]?.node;

  const handleAdd = async () => {
    if (!variant) return;
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
    <div className="group bg-ink rounded-xl ring-1 ring-white/5 p-4 transition-transform hover:-translate-y-1">
      <Link to="/product/$handle" params={{ handle: product.handle }}>
        <div className="w-full aspect-square overflow-hidden rounded-lg bg-ink2">
          {img && (
            <img
              src={img.url}
              alt={img.altText ?? product.title}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              width={800}
              height={800}
            />
          )}
        </div>
      </Link>
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-brass">
          {product.productType || "Gear"}
        </p>
        <Link to="/product/$handle" params={{ handle: product.handle }}>
          <h3 className="font-display font-medium text-lg text-bone mt-1 hover:underline">
            {product.title}
          </h3>
        </Link>
        <p className="text-[13px] text-ash mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-display font-semibold text-xl text-bone">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!variant || isLoading || !variant.availableForSale}
            className="text-[11px] uppercase tracking-[0.12em] text-bone bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-oxblood hover:border-oxblood transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : !variant?.availableForSale ? (
              "Sold out"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
