import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export function FaIcon(props: FontAwesomeIconProps & { staticSize?: [number, number] | number }) {
  const { staticSize: size, width, height, ...rest } = props;

  const actualSize = !size ? [width, height] : Array.isArray(size) ? size : [size, size];

  return <FaIcon {...rest} width={actualSize[0]} height={actualSize[1]} />;
}
