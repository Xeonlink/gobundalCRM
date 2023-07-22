import { findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image, { StaticImageData } from "next/image";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  iconSize?: [number, number] | number;
  text?: string;
  alt?: string;
  icon: StaticImageData | IconDefinition;
};

function isIconDefinition(icon: any): icon is IconDefinition {
  return !!icon.iconName;
}
function isStaticImageData(icon: any): icon is StaticImageData {
  return !!icon.src;
}

export function IcoButton(props: Props) {
  const { iconSize, text, icon, ...btnProps } = props;

  const actualIconSize = Array.isArray(iconSize) ? iconSize : [iconSize, iconSize];

  return (
    <button type='button' {...btnProps} className={`btn ${btnProps.className}`}>
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
        <FontAwesomeIcon icon={icon} width={actualIconSize[0]} height={actualIconSize[1]} />
      ) : null}
      &nbsp;
      <span>{text}</span>
    </button>
  );
}
