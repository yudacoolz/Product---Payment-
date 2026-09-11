import { Product } from "./product";

export interface Order {
  order_id: number;
  status: string;
  gross_ammount: number;
  items: OrderItem[];
}

export interface OrderItem {
  order_Item_id: number;
  jumlah: number;
  // price     Float

  // order_id   Int
  // order     Order   @relation(fields: [order_id], references: [order_id], onDelete: Cascade)

  // productId Int
  // product   Product @relation(fields: [productId], references: [id])
  product: Product;
}
