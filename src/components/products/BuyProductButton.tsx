"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/services/order.service";
import { useCartStore } from "@/stores/cart-store";
import { Product } from "@/types/product";

interface BuyProductButtonProps {
  product: Product;
  // productId: number;
  // productName: string;
  // price: number;
}

export default function BuyProductButton({
  product,
  // productId,
  // productName,
  // price,
}: BuyProductButtonProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [quantity, setQuantity] = useState<number>(1);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Derived, so it can never drift out of sync with the quantity.
  const totalValue = product.price * quantity;

  function handleModal() {
    setError(null);
    setIsModalOpen((open) => !open);
  }

  async function handleOrder(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      addToCart(product, quantity);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }

    // try {
    //   const { token } = await createOrder({
    //     productId,
    //     quantity,
    //     name,
    //     email: email.trim() === "" ? undefined : email,
    //   });

    //   if (!window.snap) {
    //     throw new Error("Payment popup is not ready yet, please try again");
    //   }

    //   window.snap.pay(token, {
    //     onSuccess: () => {
    //       setIsModalOpen(false);
    //       router.refresh();
    //     },
    //     onPending: () => {
    //       setIsModalOpen(false);
    //     },
    //     onError: () => {
    //       setError("Payment failed, please try again");
    //     },
    //   });
    // } catch (err) {
    //   console.error(err);
    //   setError(
    //     err instanceof Error ? err.message : "Failed to start the payment",
    //   );
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleModal}
        className="rounded-lg border px-4 py-2 bg-blue-500 text-white"
      >
        Add to Cart
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={handleModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold text-black">
              Order {product.name}
            </h2>

            <form onSubmit={handleOrder} className="mt-4 space-y-4">
              {/* <div>
                <label className="mb-2 block font-medium text-black">
                  Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border p-2 text-black"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-black">
                  Email (optional)
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border p-2 text-black"
                />
              </div> */}

              <div>
                <label className="mb-2 block font-medium text-black">
                  Quantity
                </label>

                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, e.target.valueAsNumber || 1))
                  }
                  className="w-full rounded border p-2 text-black"
                  required
                />
              </div>

              <p className="font-bold text-black">
                Total: Rp {totalValue.toLocaleString("id-ID")}
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg border px-4 py-2 bg-blue-500 text-white disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Add this Item to Cart"}
                </button>

                <button
                  type="button"
                  onClick={handleModal}
                  className="rounded-lg border px-4 py-2 text-black"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
