import { GetResponse } from "@/app/api/utils";
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

export async function getProductCategory(categoryId: string) {
  const res = await axios.get(`/api/product_category/${categoryId}`);
  return res.data;
}
export function useProductCategory(categoryId: string) {
  return useQuery(["productCategories", categoryId], () => getProductCategory(categoryId), {
    suspense: true,
  });
}
