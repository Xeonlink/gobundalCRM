import { CartProduct, Product } from "@prisma/client";

export async function getCartProducts() {
  const res = await fetch("http://localhost:3000/api/cart_products", {
    next: {
      tags: ["cart_products"],
    },
  });

  const { data } = await res.json();

  return data as (CartProduct & {
    product: Product;
  })[];
}
