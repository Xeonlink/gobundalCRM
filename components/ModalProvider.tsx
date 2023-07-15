"use client";

import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export interface Modal {
  key: number;
  ui: ReactNode;
}

export const ModalContext = createContext<[Modal[], Dispatch<SetStateAction<Modal[]>>]>([
  [],
  () => {},
]);

export function ModalProvider(props: PropsWithChildren) {
  const { children } = props;

  const modalContextValue = useState<Modal[]>([]);

  return <ModalContext.Provider value={modalContextValue}>{children}</ModalContext.Provider>;
}
