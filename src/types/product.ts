export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
