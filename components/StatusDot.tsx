import { cls } from "@/extra/utils";

type Props = {
  className?: string;
  good: boolean;
};

export function StatusDot(props: Props) {
  const { className = "", good = true } = props;

  return (
    <i
      className={cls(`inline-block rounded-full bg-green-500 w-3 h-3 ${className}`, {
        "bg-orange-500": !good,
      })}
    />
  );
}
