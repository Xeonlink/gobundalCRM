import { Order, OrderProduct, Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getOrder(id: string) {
  type GetOrderResponse = Order & { products: (OrderProduct & { product: Product })[] };

  const res = await axios.get<GetOrderResponse>("/api/orders/" + id);
  return res.data;
}
export function useOrder(id: string) {
  return useQuery(["order", id], () => getOrder(id), {
    suspense: true,
  });
}
