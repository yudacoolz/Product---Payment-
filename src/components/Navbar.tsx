"use client";

import Link from "next/link";
import { Gift, Menu, Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import { getCarts } from "@/services/cart.service";
import { Cart } from "@/types/cart";
import ChatPage from "./chat/Chat";

export default function Navbar() {
  const cart = useCartStore((state) => state.cart);
  const cartLength = cart.length;

  const [cartItems, setCartItems] = useState<Cart>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCarts();
      console.log("res get carts : ", res);
      setCartItems(res);
    };

    fetchData();
  }, []);

  return (
    <header className="bg-background">
      {/* thin dark strip on top, like etsy */}
      <div className="h-1.5 bg-foreground" />

      <nav className="border-b border-line">
        {/* TOP ROW: logo, products, search, users, cart */}
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="shrink-0 font-serif text-3xl text-accent md:text-4xl"
          >
            My App
          </Link>

          <Link
            href="/products"
            className="hidden items-center gap-2 rounded-full px-4 py-2 font-semibold hover:bg-subtle md:flex"
          >
            <Menu className="h-5 w-5" />
            Products
          </Link>

          {/* search bar (not connected to search logic yet) */}
          <form
            action="/products"
            className="flex flex-1 items-center rounded-full border-2 border-foreground py-1 pl-6 pr-1"
          >
            <input
              name="search"
              placeholder="Search for anything"
              className="w-full bg-transparent outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white hover:opacity-90"
            >
              <Search className="h-5 w-5" strokeWidth={3} />
            </button>
          </form>

          <Link
            href="/notification"
            className="hidden rounded-full px-4 py-2 font-semibold hover:bg-subtle sm:block"
          >
            Notif
          </Link>

          <Link
            href="/users"
            className="hidden rounded-full px-4 py-2 font-semibold hover:bg-subtle sm:block"
          >
            Users
          </Link>

          <ChatPage />

          <Link
            href="/carts"
            className="relative shrink-0 rounded-full p-3 hover:bg-subtle"
          >
            <ShoppingCart className="h-6 w-6" strokeWidth={2.5} />
            <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white">
              {cartItems?.items.length ?? 0}
            </span>
          </Link>
        </div>

        {/* BOTTOM ROW: menu links */}
        <div className="flex justify-center gap-6 overflow-x-auto whitespace-nowrap px-6 pb-3 md:gap-12">
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-full px-3 py-1 font-medium hover:bg-subtle"
          >
            <Gift className="h-4 w-4" />
            All Products
          </Link>
          <Link
            href="/products/new"
            className="rounded-full px-3 py-1 font-medium hover:bg-subtle"
          >
            Add Product
          </Link>
          <Link
            href="/carts"
            className="rounded-full px-3 py-1 font-medium hover:bg-subtle"
          >
            Cart
          </Link>
          <Link
            href="/checkout"
            className="rounded-full px-3 py-1 font-medium hover:bg-subtle"
          >
            Checkout
          </Link>
        </div>
      </nav>
    </header>
  );
}
