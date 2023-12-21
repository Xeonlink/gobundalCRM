import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getProduct(id: string) {
  const res = await axios.get<Product>(`/api/products/${id}`);
  return res.data;
}
export function useProduct(id: string) {
  return useQuery(["products", id], () => getProduct(id), {
    suspense: true,
  });
}
