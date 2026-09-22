import { Product } from "./product";

export interface Order {
  order_id: number;
  status: string;
  gross_amount: number;

  snap_token: string;

  items: OrderItem[];

  createdAt: Date;
  updatedAt: Date;
  payment_type: string;
  payment_name: string;
}

export interface OrderItem {
  orderItemid: number;
  jumlah: number;
  // price     Float

  // order_id   Int
  // order     Order   @relation(fields: [order_id], references: [order_id], onDelete: Cascade)

  // productId Int
  // product   Product @relation(fields: [productId], references: [id])
  product: Product;
}
