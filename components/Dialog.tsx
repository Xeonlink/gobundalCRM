"use client";

import { ComponentProps } from "react";

type Props = ComponentProps<"dialog"> & {
  autoOpen?: boolean;
};

export function Dialog(props: Props) {
  const { autoOpen, children, ...otherProps } = props;

  const ref = (target: HTMLDialogElement | null) => {
    if (!autoOpen) return;
    target?.showModal();
  };

  return (
    <dialog ref={ref} {...otherProps}>
      {children}
    </dialog>
  );
}
