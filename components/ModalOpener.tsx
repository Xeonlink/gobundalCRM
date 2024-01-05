"use client";

import { useModal } from "@/extra/modal/modal";
import { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  ui: React.ReactNode;
};

export function ModalOpener(props: Props) {
  const modalCtrl = useModal();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    modalCtrl.open(props.ui);
    props.onClick?.(e);
  };

  return (
    <button {...props} onClick={onClick}>
      {props.children}
    </button>
  );
}
