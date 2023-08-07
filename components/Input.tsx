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
      className={
        cn(
          "w-full rounded-md bg-white px-3 py-2 disabled:opacity-40",
          {
            "animate-shake shadow-red-300": invalid,
          },
          props.className,
        ) + " shadow-inset-2"
      }
    />
  );
});

Input.displayName = "Input";
