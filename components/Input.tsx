import { cn } from "@/extra/utils";
import { ComponentPropsWithoutRef, LegacyRef, forwardRef } from "react";

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  invalid?: boolean;
};

export const Input = forwardRef((props: InputProps, ref?: LegacyRef<HTMLInputElement>) => {
  const { invalid, ...rest } = props;

  return (
    <input
      ref={ref}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      type="text"
      {...rest}
      className={cn(
        "dsy-input-bordered dsy-input",
        {
          "dsy-input-error animate-shake": invalid,
        },
        props.className,
      )}
    />
  );
});

Input.displayName = "Input";
