"use client";

import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

export function Back(props: ComponentProps<"button">) {
  const router = useRouter();

  return (
    <button {...props} type="button" onClick={router.back}>
      {props.children}
    </button>
  );
}
