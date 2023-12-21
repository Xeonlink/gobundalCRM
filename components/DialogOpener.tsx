"use client";

import React, { ComponentProps } from "react";

export const DialogOpener = (props: ComponentProps<"button"> & { target: string }) => {
  const { target, ...rest } = props;

  return React.createElement("button", {
    ...rest,
    type: "button",
    onClick: () => {
      const targetElement = document.querySelector(target) as HTMLDialogElement;
      targetElement?.showModal();
    },
  });
};
