import { GetResponse } from "@/api/utils";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getProducts() {
  const products = await axios.get<GetResponse<Product>>("/api/products");
  return products.data.data;
}
export function useProducts() {
  return useQuery(["products"], () => getProducts(), {
    suspense: true,
  });
}
