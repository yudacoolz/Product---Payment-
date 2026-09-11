import api from "@/lib/axios";
import {
  CreateOrderDto,
  CreateOrderResponse,
} from "@/validations/order.validation";

export const createOrder = async (
  data: CreateOrderDto,
): Promise<CreateOrderResponse> => {
  // { ** SNAP ** }
  const response = await api.post<CreateOrderResponse>("/payment", data);

  // { ** Core Api ** }
  // const response = await api.post<CreateOrderResponse>(
  //   "/payment/coreApi",
  //   data,
  // );

  return response.data;
};
