import { GetResponse, apiRoot } from "./utils";

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

export async function getOrders(date: string) {
  const uri = `/orders`;
  const config = { params: { date } };
  const res = await apiRoot.get<GetResponse<Order>>(uri, config);
  return res.data;
}

export async function postOrder(order: RawOrder) {
  const uri = `/orders`;
  const body = order;
  const res = await apiRoot.post(uri, body);
  return res.data;
}

export async function getOrder(date: string, id: string) {
  const uri = `/orders/${id}`;
  const config = { params: { date } };
  const res = await apiRoot.get<Order>(uri, config);
  return res.data;
}

export async function updateOrder(date: string, id: string, rawOrder: Partial<Order>) {
  const uri = `/orders/${id}`;
  const body = rawOrder;
  const config = { params: { date } };
  const res = await apiRoot.patch(uri, body, config);
  return res.data;
}

export async function deleteOrder(date: string, id: string) {
  const uri = `/orders/${id}`;
  const config = { params: { date } };
  const res = await apiRoot.delete(uri, config);
  return res.data;
}

export async function deleteOrders(date: string, ids: string[]) {
  const uri = `/orders`;
  const config = { params: { date, ids: JSON.stringify(ids) } };
  const res = await apiRoot.delete(uri, config);
  return res.data;
}
