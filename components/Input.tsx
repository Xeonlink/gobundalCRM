import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  invalid?: boolean;
}

export function Input(props: Props) {
  const { invalid, ...rest } = props;

  return (
    <input
      {...rest}
      className={`input ${invalid ? "input-invalid" : ""} ${props.className ?? ""}`}
    />
  );
}
