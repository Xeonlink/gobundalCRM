"use client";

import { Suspense, useContext } from "react";
import { ModalContext } from "./ModalProvider";

export function ModalPlacer() {
  const [modals, setModals] = useContext(ModalContext);

  return (
    <Suspense fallback={<ModalLoading />}>
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
    </Suspense>
  );
}

function ModalLoading() {
  return <div className='fixed w-screen h-screen flex justify-center items-center'>Loading...</div>;
}
