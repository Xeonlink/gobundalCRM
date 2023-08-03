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
  return <div className="fixed flex h-screen w-screen items-center justify-center">Loading...</div>;
}
