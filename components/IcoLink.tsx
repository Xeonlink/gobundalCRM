import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "@/components/FaIcon";
import Image, { StaticImageData } from "next/image";
import Link, { LinkProps } from "next/link";

type Props = LinkProps & {
  iconSize?: [number, number] | number;
  text?: string;
  alt?: string;
  icon: StaticImageData | IconDefinition;
  className: string;
};

function isIconDefinition(icon: any): icon is IconDefinition {
  return !!icon.iconName;
}
function isStaticImageData(icon: any): icon is StaticImageData {
  return !!icon.src;
}

export function IcoLink(props: Props) {
  const { iconSize, text, icon, className, ...otherProps } = props;

  const actualIconSize = Array.isArray(iconSize) ? iconSize : [iconSize, iconSize];

  return (
    <Link {...otherProps} className={`btn ${className}`}>
      {isStaticImageData(icon) ? (
        <Image
          src={icon}
          alt={props.alt || ""}
          width={actualIconSize[0]}
          height={actualIconSize[1]}
          className={`inline-block align-text-bottom`}
        />
      ) : null}
      {isIconDefinition(icon) ? (
        <FaIcon icon={icon} width={actualIconSize[0]} height={actualIconSize[1]} />
      ) : null}
      &nbsp;
      <span>{text}</span>
    </Link>
  );
}
