"use client";

import { cn } from "@/extra/utils";
import { ComponentProps } from "react";

export function NumberCommaInput(props: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "dsy-input-bordered dsy-input invalid:dsy-input-error disabled:dsy-input-disabled invalid:animate-shake",
        props.className,
      )}
      onChange={(e) => (e.target.value = (+e.target.value.replaceAll(",", "")).toLocaleString())}
    />
  );
}
