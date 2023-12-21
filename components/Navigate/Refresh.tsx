"use client";

import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

export function Refresh(props: ComponentProps<"button">) {
  const router = useRouter();

  return (
    <button {...props} type="button" onClick={router.refresh}>
      {props.children}
    </button>
  );
}
