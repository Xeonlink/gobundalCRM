"use client";

import { cn, toHyphenPhone } from "@/extra/utils";
import { ComponentProps, useState } from "react";

export function SelfValidateInput(props: ComponentProps<"input">) {
  const patternRegex = !!props.pattern ? new RegExp(props.pattern) : null;
  const defaultInvalid = (props.required && !!props.value) || patternRegex?.test(`${props.value}`);

  const [value, setValue] = useState(props.value);
  const [invalid, setInvalid] = useState(defaultInvalid);

  props.value = value;
  props.autoComplete = "off";
  props.autoCorrect = "off";
  props.autoCapitalize = "off";
  props.spellCheck = false;
  props.className = cn(
    "dsy-input-bordered dsy-input",
    invalid && "dsy-input-error animate-shake",
    props.className,
  );

  props.onChange = (e) => {
    setInvalid((prev) => (props.required && !!prev) || patternRegex?.test(`${prev}`));

    if (props.type === "tel") {
      setValue(toHyphenPhone(e.target.value));
      return;
    }
    if (props.type === "number") {
      const value = parseInt(e.target.value);

      if (!value) {
        return;
      }

      if (!!props.min && value < +props.min) {
        return;
      }

      if (!!props.max && value > +props.max) {
        return;
      }

      setValue(value);
      return;
    }
  };

  return <input {...props} />;
}
