import { cn } from "@/extra/utils";
import { DetailedHTMLProps, InputHTMLAttributes, LegacyRef, forwardRef } from "react";

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef((props: Props, ref?: LegacyRef<HTMLInputElement>) => {
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
        "dsy-input-bordered dsy-input dsy-input-sm bg-transparent",
        {
          "dsy-input-error animate-shake": invalid,
        },
        props.className,
      )}
    />
  );
});

Input.displayName = "Input";
