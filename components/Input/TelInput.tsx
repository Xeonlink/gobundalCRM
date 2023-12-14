"use client";

import { cn, toHyphenPhone } from "@/extra/utils";
import { ComponentProps } from "react";

export function TelInput(props: ComponentProps<"input">) {
  return (
    <input
      {...props}
      type="tel"
      className={cn(
        "dsy-input-bordered dsy-input invalid:dsy-input-error disabled:dsy-input-disabled invalid:animate-shake",
        props.className,
      )}
      onChange={(e) => (e.target.value = toHyphenPhone(e.target.value))}
    />
  );
}
