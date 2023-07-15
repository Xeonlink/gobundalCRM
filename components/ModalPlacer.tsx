"use client";

import { useContext } from "react";
import { ModalContext } from "./ModalProvider";

export function ModalPlacer() {
  const [modals, setModals] = useContext(ModalContext);

  return (
    <div className='absolute left-0 top-0'>
      {modals.map((modal: any) => ({
        ...modal.ui,
        key: modal.key,
        props: {
          ...modal.ui.props,
          closeSelf: () => {
            setModals((prev) => prev.filter((m) => m.key !== modal.key));
          },
          id: modal.key,
        },
      }))}
    </div>
  );
}
