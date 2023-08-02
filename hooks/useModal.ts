import { ModalContext } from "@/components/ModalProvider";
import { useContext } from "react";

export function useModal() {
  const [_, setModals] = useContext(ModalContext);

  const open = (revealedUI: React.ReactNode, key: number = Math.round(Math.random() * 10000)) => {
    const originUI = revealedUI as any;

    const ui = {
      ...originUI,
      key,
      props: {
        ...originUI.props,
        closeSelf: () => setModals((prev) => prev.filter((m) => m.key !== key)),
        ref: (target: HTMLDialogElement | undefined) => target?.showModal(),
        id: key,
      },
    };

    const modal = { key, ui };
    setModals((prev) => [...prev, modal]);
    return key;
  };

  const close = (key: number) => {
    setModals((prev) => prev.filter((modal) => modal.key !== key));
  };

  return { open, close };
}
