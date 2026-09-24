import { useEffect, useState } from "react";
import {
  ArrowRight,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { formatPrice } from "@/lib/shopify";

export default function CartDrawer() {
  useCartSync();
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] text-bone"
      >
        <span>Cart</span>
        <span className="grid size-5 place-items-center rounded-full bg-oxblood text-[10px] font-semibold text-bone">
          {totalItems}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="font-display text-lg font-semibold uppercase tracking-[0.14em] text-bone">
                Your Cart
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="grid size-8 place-items-center rounded-full text-ash transition-colors hover:bg-white/5 hover:text-bone"
                aria-label="Close cart"
              >
                <X className="size-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="mx-auto mb-4 size-10 text-ash/50" />
                  <p className="text-sm text-ash">Your cart is empty</p>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-ash/60">
                    Time to load the bar
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map((item) => {
                    const img = item.product.images.edges[0]?.node;
                    return (
                      <div
                        key={item.variantId}
                        className="flex gap-4 rounded-xl bg-ink2 p-3 ring-1 ring-white/5"
                      >
                        <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-ink">
                          {img && (
                            <img
                              src={img.url}
                              alt={img.altText ?? item.product.title}
                              className="size-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-display text-sm font-medium text-bone">
                            {item.product.title}
                          </h4>
                          <p className="text-[13px] text-ash">
                            {formatPrice(
                              item.price.amount,
                              item.price.currencyCode,
                            )}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              className="grid size-6 place-items-center rounded-full border border-white/10 text-ash transition-colors hover:text-bone"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-6 text-center text-sm text-bone">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              className="grid size-6 place-items-center rounded-full border border-white/10 text-ash transition-colors hover:text-bone"
                              aria-label="Increase quantity"
                            >
                              <Plus className="size-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="ml-auto grid size-6 place-items-center rounded-full text-ash/70 transition-colors hover:text-oxblood"
                              aria-label="Remove item"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-4 border-t border-white/10 bg-ink px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] uppercase tracking-[0.12em] text-ash">
                      Total
                    </span>
                    <span className="font-display text-2xl font-semibold text-bone">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={items.length === 0 || isLoading || isSyncing}
                    className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-oxblood py-3.5 font-display text-sm font-medium uppercase tracking-[0.14em] text-bone ring-1 ring-oxblood/50 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading || isSyncing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        Checkout <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] uppercase tracking-[0.1em] text-ash/60">
                    Free 30-day returns · Lifetime stitching
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
