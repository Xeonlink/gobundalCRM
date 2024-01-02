import { GetResponse } from "@/api/utils";
import { CartProduct, Image, Product, ProductCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getCartProducts() {
  const res = await axios.get<
    GetResponse<
      CartProduct & {
        product: Product & {
          images: Image[];
          category: ProductCategory;
        };
      }
    >
  >("/api/cart_products");
  return res.data.data;
}
export function useCartProducts() {
  const query = useQuery(["cart_products"], () => getCartProducts(), {
    suspense: true,
  });

  return query.data!;
}
