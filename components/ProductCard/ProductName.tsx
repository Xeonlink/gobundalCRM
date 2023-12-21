import { Product } from "@prisma/client";

type Props = {
  className?: string;
  product: Product;
};

export function ProductName(props: Props) {
  return <h2>{props.product.name}</h2>;
}
