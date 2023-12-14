"use client";

import { cn, toHyphenPhone } from "@/extra/utils";
import { ComponentProps, LegacyRef, forwardRef } from "react";
import { AddressInput } from "./AddressInput";
import { experimental_useFormStatus } from "react-dom";
import { TelInput } from "./TelInput";
import { NumberCommaInput } from "./NumberCommaInput";

type Props = Omit<ComponentProps<"input">, "value" | "ref">;

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
