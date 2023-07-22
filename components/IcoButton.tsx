import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image, { StaticImageData } from "next/image";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  iconSize?: [number, number] | number;
  gap?: number;
  iconClass?: string;
  text?: string;
} & (
    | {
        iconType: "image";
        alt: string;
        icon: StaticImageData;
      }
    | {
        iconType: "faIcon";
        icon: IconDefinition;
      }
  );

export function IcoButton(props: Props) {
  const { iconSize, text, iconType, gap, icon, iconClass, ...btnProps } = props;

  const actualIconSize = Array.isArray(iconSize) ? iconSize : [iconSize, iconSize];

  return (
    <button type='button' {...btnProps} className={`btn ${btnProps.className}`}>
      {iconType === "image" ? (
        <Image
          src={icon}
          alt={props.alt}
          width={actualIconSize[0]}
          height={actualIconSize[1]}
          className={`inline-block align-text-bottom mr-${gap} ${iconClass}`}
        />
      ) : null}
      {iconType === "faIcon" ? (
        <FontAwesomeIcon
          icon={icon}
          width={actualIconSize[0]}
          height={actualIconSize[1]}
          className={iconClass}
        />
      ) : null}
      <span>{text}</span>
    </button>
  );
}
