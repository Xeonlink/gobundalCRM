"use client";

import { useExcel } from "@/hooks/useExcel";
import { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  data: any[];
  filename: string;
};

export function DownloadExcel(props: Props) {
  const excel = useExcel();

  const onClick = () => {
    excel.download(props.data, props.filename);
  };

  return (
    <button {...props} type="button" onClick={onClick}>
      {props.children}
    </button>
  );
}
