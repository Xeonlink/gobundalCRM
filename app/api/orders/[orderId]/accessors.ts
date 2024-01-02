import { Order, OrderProduct, Product } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type GetOrderResponse = Order & { products: (OrderProduct & { product: Product })[] };
export async function getOrder(id: string) {
  const res = await axios.get<GetOrderResponse>("/api/orders/" + id);
  return res.data;
}
export function useOrder(id: string) {
  return useQuery(["orders", id], () => getOrder(id), {
    suspense: true,
  });
}

export async function deleteOrder(id: string) {
  const res = await axios.delete("/api/orders/" + id);
  return res.data;
}
export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteOrder(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}
