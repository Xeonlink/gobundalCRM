"use client";

import { ProductCategory } from "@prisma/client";
import { PropsWithChildren, createContext } from "react";

export const ProductCategoryContext = createContext<ProductCategory | null>(null);

export function ProductCategoryProvider(
  props: PropsWithChildren<{ value: ProductCategory | null }>,
) {
  return (
    <ProductCategoryContext.Provider value={props.value}>
      {props.children}
    </ProductCategoryContext.Provider>
  );
}
