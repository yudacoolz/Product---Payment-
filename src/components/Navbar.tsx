"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";

export default function Navbar() {
  const cart = useCartStore((state) => state.cart);
  const cartLength = cart.length;

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4 justify-between">
        <div className="flex gap-6">
          <Link href="/" className="font-bold">
            My App
          </Link>

          <Link href="/products">Products</Link>

          <Link href="/users">Users</Link>
        </div>

        <Link href="/carts">Cart ( {cartLength} )</Link>
      </div>
    </nav>
  );
}
