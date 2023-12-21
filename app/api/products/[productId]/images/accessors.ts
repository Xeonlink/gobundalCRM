import { GetResponse } from "@/api/utils";
import { Image } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getProductImages(productId: string) {
  const res = await axios.get<GetResponse<Image>>("/api/products/" + productId + "/images");
  return res.data.data;
}
export function useProductImages(productId: string) {
  return useQuery(["products", productId, "images"], () => getProductImages(productId), {
    suspense: true,
  });
}
