"use client";

import { ModalProps } from "@/extra/modal";
import { useModal } from "@/extra/modal";
import { useEffect, useRef } from "react";

type Props = ModalProps;

export function OrderSelector(props: Props) {
  const modalCtrl = useModal();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!ref.current) {
      console.log("TeamDialog is null", ref.current);
      return;
    }
    ref.current.showModal();
  }, []);

  const openOrderSelector = () => {
    modalCtrl.open(<OrderSelector />);
  };

  return (
    <dialog
      ref={props.ref}
      onClose={props.closeSelf}
      className="max-h-full max-w-full animate-scaleTo1 rounded-md bg-transparent p-0 backdrop:backdrop-blur-md"
    >
      <button type="button" className="btn" onClick={openOrderSelector}>
        테스트
      </button>
    </dialog>
  );
}
