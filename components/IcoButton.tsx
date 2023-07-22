import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image, { StaticImageData } from "next/image";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type Icon = {
  size: [number, number];
} & {
  type: "image";
  alt: string;
  self: StaticImageData;
} & {
  type: "faIcon";
  self: IconDefinition;
};

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  iconSize: [number, number];
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

type AdvancedProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon: Icon;
};

export function IcoButton(props: Props) {
  const { iconSize, text, iconType, gap, icon, iconClass, ...btnProps } = props;

  return (
    <button type='button' {...btnProps} className={`btn ${btnProps.className}`}>
      {iconType === "image" ? (
        <Image
          src={icon}
          alt={props.alt}
          width={iconSize[0]}
          height={iconSize[1]}
          className={`inline-block align-text-bottom mr-${gap} ${iconClass}`}
        />
      ) : null}
      {iconType === "faIcon" ? (
        <FontAwesomeIcon
          icon={icon}
          width={iconSize[0]}
          height={iconSize[1]}
          className={iconClass}
        />
      ) : null}
      <span>{text}</span>
    </button>
  );
}
