import api from "@/lib/axios";
import {
  CreateOrderDto,
  CreateOrderResponse,
} from "@/validations/order.validation";

export const createOrder = async (
  data: CreateOrderDto,
): Promise<CreateOrderResponse> => {
  const response = await api.post<CreateOrderResponse>("/payment", data);

  return response.data;
};
