"use client";

import { useSimpleWindowSize } from "@/hooks/useWindowSize";
import React, { FunctionComponent, ReactNode } from "react";

type Props<T extends {}> = {
  className?: string;
  threashold: number[];
  children: (columnCount: number, index: number) => React.ReactNode;
  as?: string | FunctionComponent<T>;
} & T;

type InferProps<T> = T extends FunctionComponent<infer P> ? P : any;

export function ColumnList<T extends {}>(props: Props<T>) {
  const { threashold, children, className, as = "div" } = props;

  const wCount = useSimpleWindowSize(threashold);

  return (
    <div className={className}>{new Array(wCount).fill(0).map((_, i) => children(wCount, i))}</div>
  );
}
