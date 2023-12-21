import { GetResponse } from "@/api/utils";
import { ProductCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getProductCategories() {
  const res = await axios.get<GetResponse<ProductCategory>>("/api/product_category");
  return res.data.data;
}
export function useProductCategories() {
  return useQuery(["product_categories"], () => getProductCategories(), {
    suspense: true,
  });
}
