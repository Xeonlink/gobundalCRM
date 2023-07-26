import { MutateOption, QueryOptions } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useAutoInvalidateMutation } from "./utils/useAutoInvalidateMutation";
import { GetResponse, apiRoot } from "./utils/utils";

export interface Order {
  date: string;
  id: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverAddressDetail: string;
  productName: string;
  initial: string;
}

export type RawOrder = Omit<Order, "date" | "id">;

export function useOrders(date: string, options?: QueryOptions<GetResponse<Order>>) {
  const auth = useAuth();

  const queryFn = async () => {
    const uri = `/orders`;
    const config = { params: { date } };
    const res = await apiRoot.get<GetResponse<Order>>(uri, config);
    return res.data;
  };

  return useQuery(["orders", date], queryFn, {
    suspense: true,
    enabled: auth.isSignIn,
    ...options,
  });
}

export function useCreateOrder(rawOrder: Partial<RawOrder>, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/orders`;
    const body = rawOrder;
    const res = await apiRoot.patch(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["orders"], mutationFn, options);
}

export function useUpdateOrder(
  date: string,
  id: string,
  partialRawOrder: Partial<RawOrder>,
  options?: MutateOption
) {
  const mutationFn = async () => {
    const uri = `/orders/${id}`;
    const body = partialRawOrder;
    const config = { params: { date } };
    const res = await apiRoot.patch(uri, body, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["orders"], mutationFn, options);
}

export function useDeleteOrder(date: string, id: string, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/orders/${id}`;
    const config = { params: { date } };
    const res = await apiRoot.delete(uri, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["orders"], mutationFn, options);
}

export function useOrder(date: string, id: string, options?: QueryOptions<Order>) {
  const auth = useAuth();

  const queryFn = async () => {
    const uri = `/orders/${id}`;
    const config = { params: { date } };
    const res = await apiRoot.get<Order>(uri, config);
    return res.data;
  };

  return useQuery(["orders", date, id], queryFn, {
    suspense: true,
    enabled: auth.isSignIn,
    ...options,
  });
}

export function useDeleteOrders(date: string, ids: string[], options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/orders`;
    const config = { params: { date, ids: JSON.stringify(ids) } };
    const res = await apiRoot.delete(uri, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["orders"], mutationFn, options);
}
