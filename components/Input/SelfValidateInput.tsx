"use client";

import { cn } from "@/extra/utils";
import { ComponentProps } from "react";
import { AddressInput } from "./AddressInput";
import { NumberCommaInput } from "./NumberCommaInput";
import { TelInput } from "./TelInput";

type Props = Omit<ComponentProps<"input">, "ref">;

export function SelfValidateInput(props: Props) {
  if (props.type === "address") {
    return <AddressInput {...props} />;
  }

  if (props.type === "tel") {
    return <TelInput {...props} />;
  }

  if (props.type === "number-comma") {
    return <NumberCommaInput {...props} />;
  }

  return (
    <input
      {...props}
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      className={cn(
        "dsy-input-bordered dsy-input invalid:dsy-input-error disabled:dsy-input-disabled invalid:animate-shake",
        props.className,
      )}
    />
  );
}
