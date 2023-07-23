import { ModalContext } from "@/components/ModalProvider";
import { useContext } from "react";

export function useModal() {
  const [_, setModals] = useContext(ModalContext);

  const open = (ui: React.ReactNode, key: number = Math.round(Math.random() * 10000)) => {
    const modal = { key, ui };
    setModals((prev) => [...prev, modal]);
    return key;
  };

  const close = (key: number) => {
    setModals((prev) => prev.filter((modal) => modal.key !== key));
  };

  return { modalCtrl: { open, close } };
}
