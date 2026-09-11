import { Product } from "./product";

export interface Cart {
  cartId: number;
  createdAt: Date;
  updatedAt: Date;

  // userId  Int      @unique  // one active cart per user, if you have auth
  // user    User     @relation(fields: [userId], references: [id])

  items: CartItem[];
}

export interface CartItem {
  cartItemId: number;
  jumlah: number;

  cartId: number;
  cart: Cart;

  productId: number;
  product: Product;
}
