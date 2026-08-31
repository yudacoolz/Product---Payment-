"use client";

import { useCartStore } from "@/stores/cart-store";

export default function CartsPage() {
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeFromCart);

  return (
    <div>
      <h1>Carts</h1>
      <div>
        {cart.map((item, i) => (
          <div
            key={i}
            className="flex justify-between w-full p-4 border border-white"
          >
            <div className="flex flex-col gap-2">
              <p>{item.product.id}</p>
              <p>{item.product.name}</p>
              <p>{item.product.price}</p>
              <p>{item.product.description}</p>
              <br />
              <p>jumlah :{item.jumlah}</p>
            </div>

            <div>
              <button onClick={() => removeItem(item.product.id)}>
                remove this item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
