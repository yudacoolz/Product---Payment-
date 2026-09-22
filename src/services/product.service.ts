import api from "@/lib/axios";
import type { Product } from "@/types/product";

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/products/");

  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);

  return response.data;
};

export const createProduct = async (
  // data: CreateProductDto,
  data: FormData,
): Promise<Product> => {
  const response = await api.post<Product>("/products", data);

  return response.data;
};

export const updateProduct = async (
  id: string,
  // data: UpdateProductDto,
  data: FormData,
): Promise<Product> => {
  const response = await api.patch<Product>(`/products/${id}`, data);

  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};
