import { cn } from "@/extra/utils";

type Props = {
  className?: string;
  isSale: boolean;
  price: number;
  salePrice: number;
};

export function ProductSalePercentage(props: Props) {
  const { isSale, price, salePrice, className } = props;
  return (
    <>
      <span className={cn("text-lg text-[#e63740]", className)}>
        {isSale ? Math.round((1 - salePrice / price) * 100) + "%" : price === 0 ? "100%" : ""}
      </span>{" "}
    </>
  );
}
