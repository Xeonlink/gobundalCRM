"use client";

import { cn } from "@/extra/utils";
import { useRouter } from "next/navigation";
import { CSSProperties, ComponentProps, useEffect, useState } from "react";

export function BackCountDown(props: ComponentProps<"span">) {
  const [countDown, setCountDown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (countDown < 0) {
      router.back();
      return;
    }

    setTimeout(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
  }, [countDown]);

  return (
    <span {...props} className={cn("dsy-countdown", props.className)}>
      <span style={{ "--value": countDown } as CSSProperties}></span>
    </span>
  );
}
