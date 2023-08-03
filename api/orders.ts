import { MutateOption, QueryOptions } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAutoInvalidateMutation } from "./utils/useAutoInvalidateMutation";
import { GetResponse, apiRoot } from "./utils/utils";

export const defaultOrder: RawOrder = {
  date: dayjs().format("YYYY-MM-DD"),
  senderName: "",
  senderPhone: "",
  sameAsSender: false,
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverAddressDetail: "",
  products: [
    {
      name: "",
      price: 0,
      quantity: 1,
    },
  ],
  memo: "",
};

export type OrderProduct = {
  name: string;
  price: number;
  quantity: number;
};

export interface Order {
  id: string;
  date: string;
  senderName: string;
  senderPhone: string;
  sameAsSender: boolean;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverAddressDetail: string;
  products: OrderProduct[];
  memo: string;
}

export type RawOrder = Omit<Order, "id">;

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
    const res = await apiRoot.post(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["orders"], mutationFn, options);
}

export function useUpdateOrder(
  id: string,
  partialRawOrder: Partial<RawOrder>,
  options?: MutateOption,
) {
  const mutationFn = async () => {
    const uri = `/orders/${id}`;
    const body = partialRawOrder;
    const res = await apiRoot.patch(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["orders"], mutationFn, options);
}

export function useDeleteOrder(id: string, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/orders/${id}`;
    const res = await apiRoot.delete(uri);
    return res.data;
  };

  return useAutoInvalidateMutation(["orders"], mutationFn, options);
}

export function useOrder(id: string, options?: QueryOptions<Order>) {
  const auth = useAuth();

  const queryFn = async () => {
    const uri = `/orders/${id}`;
    const res = await apiRoot.get<Order>(uri);
    return res.data;
  };

  return useQuery(["orders", id], queryFn, {
    suspense: true,
    enabled: auth.isSignIn,
    ...options,
  });
}

export function useDeleteOrders(ids: string[], options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/orders`;
    const config = { params: { ids: JSON.stringify(ids) } };
    const res = await apiRoot.delete(uri, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["orders"], mutationFn, options);
}
