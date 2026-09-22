export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  jumlah: number;
  coverUrl: string | null;
  galleryUrl: string[];
  createdAt: Date;
  updatedAt: Date;
}
