import { cn } from "@/extra/utils";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  invalid?: boolean;
}

export function Input(props: Props) {
  const { invalid, ...rest } = props;

  return (
    <input
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
}
