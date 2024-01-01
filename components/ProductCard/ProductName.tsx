import { Product } from "@prisma/client";
import { ComponentProps } from "react";

type Props = ComponentProps<"h2"> & { product: Product };

export function ProductName(props: Props) {
  const { children, ...rest } = props;

  return <h2 {...rest}>{props.product.name}</h2>;
}
