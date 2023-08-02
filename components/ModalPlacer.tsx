"use client";

import { Suspense, useContext } from "react";
import { ModalContext } from "./ModalProvider";

export function ModalPlacer() {
  const [modals, _] = useContext(ModalContext);

  return modals.map((modal) => (
    <Suspense key={modal.key} fallback={<ModalLoading />}>
      {modal.ui}
    </Suspense>
  ));
}

function ModalLoading() {
  return <div className='fixed w-screen h-screen flex justify-center items-center'>Loading...</div>;
}
