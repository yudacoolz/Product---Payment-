import { Product } from "@/types/product";
import { create } from "zustand";

type ProductOrder = {
  product: Product;
  jumlah: number;
};

type CartStore = {
  cart: ProductOrder[];
  addToCart: (product: Product, jumlah: number) => void;
  updateCartItem: (productId: string, jumlah: number) => void;
  removeFromCart: (id: string) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  addToCart: (product, jumlah) =>
    set((state) => ({
      cart: [...state.cart, { product: product, jumlah: jumlah }],
    })),

  updateCartItem: (productId, jumlah) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, jumlah } : item,
      ),
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((product) => product.product.id !== id),
    })),
}));
