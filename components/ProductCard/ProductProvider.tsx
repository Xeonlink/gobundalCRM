import { Product } from "@prisma/client";
import { PropsWithChildren, createContext } from "react";

const ProductContext = createContext<Product | null>(null);

export function ProductProvider(props: PropsWithChildren<{ product: Product }>) {
  return <ProductContext.Provider value={props.product}>{props.children}</ProductContext.Provider>;
}
