export interface Product {
  id: number;
  name: string;
  description?: string | null;
  jumlah: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
