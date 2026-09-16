"use client";

import {
  deleteCartItem,
  getCarts,
  updateCartItem,
} from "@/services/cart.service";
import { useCartStore } from "@/stores/cart-store";
import { Cart, CartItem } from "@/types/cart";
import { Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartsPage() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [cartItems, setCartItems] = useState<Cart>();

  // Store jumlah for each cart item
  const [changeJumlah, setChangeJumlah] = useState<Record<number, number>>({});
  const [orderItem, setorderItem] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCarts();

        console.log("res get carts:", res);

        setCartItems(res);

        // Set initial jumlah
        const initialJumlah: Record<number, number> = {};

        res.items.forEach((item) => {
          initialJumlah[item.cartItemId] = item.jumlah;
        });

        setChangeJumlah(initialJumlah);
      } catch (err) {
        console.error("Failed to get carts:", err);
      }
    };

    fetchData();
  }, []);

  async function updateCart(id: number) {
    try {
      const jumlah = changeJumlah[id];
      console.log("yg dikirim ke payload :", jumlah);

      await updateCartItem(id, jumlah);

      // Refresh cart after update
      const res = await getCarts();
      setCartItems(res);

      console.log("Cart updated:", {
        id,
        jumlah,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRemoveCart(id: number) {
    try {
      await deleteCartItem(id);

      // Refresh cart after deleting
      const res = await getCarts();
      setCartItems(res);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const toggleOrderItem = (item: CartItem) => {
    setorderItem((prev) => {
      const exists = prev.some((order) => order.cartItemId === item.cartItemId);

      if (exists) {
        return prev.filter((order) => order.cartItemId !== item.cartItemId);
      }
      return [...prev, item];
    });
  };

  console.log("orderItem : ", orderItem);

  // total price of the ticked items (for the summary box)
  const selectedTotal = orderItem.reduce(
    (sum, item) => sum + item.product.price * item.jumlah,
    0,
  );

  const handleToOrderPage = () => {
    if (!orderItem) return;
    orderItem.map((item) => addToCart(item.product, item.jumlah));
    router.push(`/checkout`);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-serif text-3xl">
        {cartItems?.items.length ?? 0} items in your cart
      </h1>
      <p className="mt-1 text-sm text-muted">
        Tick the items you want to buy, then proceed to payment.
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* LEFT SIDE: cart items */}
        <div className="w-full lg:w-[70%]">
          {cartItems?.items.length === 0 && (
            <div className="rounded-2xl border border-line p-10 text-center">
              <p className="font-semibold">Your cart is empty</p>
              <Link
                href="/products"
                className="mt-4 inline-block rounded-full bg-subtle px-5 py-3 font-semibold hover:bg-line"
              >
                Browse products
              </Link>
            </div>
          )}

          {cartItems?.items.map((item) => (
            <div
              key={item.cartItemId}
              className={`mb-4 flex gap-4 rounded-2xl border bg-card p-5 shadow-sm transition ${
                orderItem.includes(item) ? "border-accent" : "border-line"
              }`}
            >
              {/* tick button */}
              <div className="pt-1 self-center">
                {/* <button onClick={() => setorderItem((prev) => [...prev, item])}> */}
                <button
                  onClick={() => toggleOrderItem(item)}
                  aria-label="Select item"
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                    orderItem.includes(item)
                      ? "border-accent bg-accent text-white"
                      : "border-line hover:border-muted"
                  }`}
                >
                  {orderItem.includes(item) && (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  )}
                </button>
              </div>

              {/* image placeholder */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-subtle font-serif text-3xl text-muted">
                {item.product.name.charAt(0).toUpperCase()}
              </div>

              {/* product info + actions */}
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{item.product.name}</p>
                  {/* {item.product.description && (
                    <p className="line-clamp-2 text-sm text-muted">
                      {item.product.description}
                    </p>
                  )} */}
                  <p className="text-sm text-muted">
                    Rp {item.product.price.toLocaleString("id-ID")} / pcs ·
                    Jumlah: {item.jumlah}
                  </p>
                  <p className="text-xs text-muted">
                    Product ID #{item.product.id} · Cart Item ID #
                    {item.cartItemId}
                  </p>

                  {/* jumlah input, update, remove */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      className="w-20 rounded-full border border-line px-3 py-2 text-center focus:border-accent focus:outline-none"
                      value={changeJumlah[item.cartItemId] ?? item.jumlah}
                      onChange={(e) =>
                        setChangeJumlah({
                          ...changeJumlah,
                          [item.cartItemId]: Number(e.target.value),
                        })
                      }
                    />

                    <button
                      className="rounded-full bg-subtle px-4 py-2 text-sm font-semibold hover:bg-line"
                      onClick={() => updateCart(item.cartItemId)}
                    >
                      Update
                    </button>

                    <button
                      className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-subtle hover:text-foreground"
                      onClick={() => handleRemoveCart(item.cartItemId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>

                <p className="text-lg font-bold sm:text-right">
                  Rp{" "}
                  {(item.product.price * item.jumlah).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE: summary */}
        <div className="w-full lg:w-[30%]">
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="flex justify-between text-sm text-muted">
              <span>Selected items</span>
              <span>
                {orderItem.length} of {cartItems?.items.length ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-accent">
                Rp {selectedTotal.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              onClick={() => handleToOrderPage()}
              disabled={orderItem.length === 0}
              className="w-full rounded-full bg-foreground p-3 font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Proceed to Payment
            </button>
            {orderItem.length === 0 && (
              <p className="text-center text-xs text-muted">
                Tick at least one item to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
