import Image, { ImageProps, ImageLoaderProps } from "next/image";

type Props = ImageProps & { size?: [number, number] | number };

export function NextIcon(props: Props) {
  const { size, width, height, ...rest } = props;

  const actualSize = !size ? [width, height] : Array.isArray(size) ? size : [size, size];

  return <Image {...rest} width={actualSize[0]} height={actualSize[1]} />;
}
