import api from "@/lib/axios";
import { Order } from "@/types/order";
import { PaginatedResponse } from "@/types/pagination";
import { CreateNotifDto } from "@/validations/notification.validation";
import {
  CreateOrderDto,
  CreateOrderResponse,
} from "@/validations/order.validation";
import { PaginationDto } from "@/validations/pagination.validation";

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

export const createNotification = async (
  data: CreateNotifDto,
): Promise<{ order_id: string; status: string; message: string }> => {
  const response = await api.post("/payment/notification", data);
  return response.data;
};

// export const getOrders = async (): Promise<Order[]> => {
//   const response = await api.get("/order");
//   return response.data;
// };

export const getOrders = async (
  pagination: PaginationDto,
): Promise<PaginatedResponse<Order>> => {
  const response = await api.get(
    `/order?page=${pagination.page}&limit=${pagination.limit}`,
  );
  return response.data;
};

export const getOrderbyId = async (id: string): Promise<Order> => {
  const response = await api.get(`/order/${id}`);

  return response.data;
};

export const updateOrder = async (
  id: string,
  data: CreateOrderDto,
): Promise<Order> => {
  const response = await api.patch(`/order/${id}`, data);

  return response.data;
};
