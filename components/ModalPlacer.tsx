"use client";

import { SyntheticEvent, useContext } from "react";
import { ModalContext } from "./ModalProvider";

export function ModalPlacer() {
  const [modals, setModals] = useContext(ModalContext);

  return (
    <div className='contents'>
      {modals.map((modal: any) => ({
        ...modal.ui,
        key: modal.key,
        props: {
          ...modal.ui.props,
          closeSelf: () => {
            setModals((prev) => prev.filter((m) => m.key !== modal.key));
          },
          ref: (target: HTMLDialogElement | undefined) => {
            if (!target) return;
            target.close();
            target.showModal();
          },
          id: modal.key,
        },
      }))}
    </div>
  );
}
