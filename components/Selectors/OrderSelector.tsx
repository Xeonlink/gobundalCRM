"use client";

import { ModalProps } from "@/extra/type";
import { useModal } from "@/hooks/useModal";
import { createRef, useEffect, useRef } from "react";

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
      className='max-w-full max-h-full rounded-md p-0 bg-transparent backdrop:backdrop-blur-md animate-scaleTo1'
    >
      <button type='button' className='btn' onClick={openOrderSelector}>
        테스트
      </button>
    </dialog>
  );
}
