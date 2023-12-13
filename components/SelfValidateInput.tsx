"use client";

import { cn, toHyphenPhone } from "@/extra/utils";
import { ComponentProps } from "react";

type Props = Omit<ComponentProps<"input">, "value" | "onChange" | "ref">;

export function SelfValidateInput(props: Props) {
  if (props.type === "tel") {
    return (
      <input
        {...props}
        className={cn(
          "dsy-input-bordered dsy-input invalid:dsy-input-error disabled:dsy-input-disabled invalid:animate-shake",
          props.className,
        )}
        onChange={(e) => (e.target.value = toHyphenPhone(e.target.value))}
      />
    );
  }

  return (
    <input
      {...props}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      className={cn(
        "dsy-input-bordered dsy-input invalid:dsy-input-error disabled:dsy-input-disabled invalid:animate-shake",
        props.className,
      )}
    />
  );
}
