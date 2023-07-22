import Image, { ImageProps } from "next/image";

type Props = ImageProps & { w?: number; h?: number; fontSize?: number };

export function ImgIcon(props: Props) {
  const { w, h, fontSize, ...otherProps } = props;

  return (
    <Image
      width={w}
      height={h}
      {...otherProps}
      className={`inline-block align-text-bottom w-[1em] h-auto ${props.className}`}
      style={{ fontSize }}
    />
  );
}
