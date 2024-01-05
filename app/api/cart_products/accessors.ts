import { GetResponse } from "@/app/api/utils";
import { CartProduct, Image, Product, ProductCategory } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export async function postCartProduct(productId: number, quantity: number) {
  const res = await axios.post<GetResponse<CartProduct>>("/api/cart_products", {
    productId,
    quantity,
  });
  return res.data.data;
}
export function useCreateCartProduct(options?: { onSuccess?: () => void }) {
  return useMutation(
    (variables: { productId: number; quantity: number }) => {
      return postCartProduct(variables.productId, variables.quantity);
    },
    {
      onSuccess: options?.onSuccess,
    },
  );
}
