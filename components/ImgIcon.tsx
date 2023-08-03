import Image, { ImageProps } from "next/image";

type Props = ImageProps & { w?: number; h?: number; fontSize?: number };

export function ImgIcon(props: Props) {
  const { w, h, alt, fontSize, ...otherProps } = props;

  return (
    <Image
      width={w}
      height={h}
      alt={alt}
      {...otherProps}
      className={`inline-block h-auto w-[1em] align-text-bottom ${props.className}`}
      style={{ fontSize }}
    />
  );
}
