import { cn } from "@/extra/utils";

type Props = {
  className?: string;
  isSale: boolean;
  price: number;
};

export function ProductRegularPrice(props: Props) {
  const { className, isSale, price } = props;
  return (
    <span className={cn("text-[#999999] line-through max-sm:hidden", className)}>
      {isSale && price.toLocaleString() + "원"}
    </span>
  );
}
