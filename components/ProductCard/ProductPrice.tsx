import { cn } from "@/extra/utils";

type Props = {
  className?: string;
  isSale: boolean;
  price: number;
  salePrice: number;
};

export function ProductPrice(props: Props) {
  const { className, isSale, price, salePrice } = props;

  return (
    <>
      <span className={cn("text-xl font-bold", className)}>
        {isSale ? salePrice.toLocaleString() : price === 0 ? "Free" : price.toLocaleString()}
      </span>
      {price === 0 ? " " : "원 "}
    </>
  );
}
