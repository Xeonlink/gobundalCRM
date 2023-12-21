import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getProductCategory(categoryId: string) {
  const res = await axios.get(`/api/product_category/${categoryId}`);
  return res.data;
}
export function useProductCategory(categoryId: string) {
  return useQuery(["productCategories", categoryId], () => getProductCategory(categoryId), {
    suspense: true,
  });
}
