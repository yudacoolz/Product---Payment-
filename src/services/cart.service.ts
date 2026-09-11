import api from "@/lib/axios";
import { CreateCartDto, UpdateCartDto } from "@/validations/cart.validation";
import { Cart, CartItem } from "@/types/cart";

export const getCarts = async (): Promise<Cart> => {
  const response = await api.get<Cart>("/cart/");

  return response.data;
};

export const createCartItem = async (
  data: CreateCartDto,
): Promise<CartItem> => {
  const response = await api.post<CartItem>("/cart", data);

  return response.data;
};

export const updateCartItem = async (
  cartItemId: number,
  jumlah: number,
): Promise<CartItem> => {
  const response = await api.patch<CartItem>(`/cart/${cartItemId}`, jumlah);

  return response.data;
};

export const deleteCartItem = async (id: number): Promise<void> => {
  await api.delete(`/cart/${id}`);
};
