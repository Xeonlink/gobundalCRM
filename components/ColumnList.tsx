import { useSimpleWindowSize } from "@/hooks/useWindowSize";

type Props = {
  className: string;
  threashold: number[];
  children: (columnCount: number, index: number) => React.ReactNode;
};

export function ColumnList(props: Props) {
  const { threashold, children, className } = props;

  const wCount = useSimpleWindowSize(threashold);

  return (
    <div className={className}>{new Array(wCount).fill(0).map((_, i) => children(wCount, i))}</div>
  );
}
