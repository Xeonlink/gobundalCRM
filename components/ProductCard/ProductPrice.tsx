import { Product } from "@/api/products";
import { cn } from "@/extra/utils";

type Props = {
  item: Product;
  className?: string;
};

export function ProductPrice(props: Props) {
  const { item, className } = props;

  return (
    <p className={cn("min-w-max", className)}>
      <span className="text-lg text-[#e63740]">
        {item.isSale
          ? Math.round((1 - item.salePrice / item.price) * 100) + "%"
          : item.price === 0
          ? "100%"
          : ""}
      </span>{" "}
      <span className="text-xl font-bold">
        {item.isSale
          ? item.salePrice.toLocaleString()
          : item.price === 0
          ? "Free"
          : item.price.toLocaleString()}
      </span>
      {item.price === 0 ? " " : "원 "}
      <span className="text-[#999999] line-through max-sm:hidden">
        {item.isSale && item.price.toLocaleString() + "원"}
      </span>
    </p>
  );
}
