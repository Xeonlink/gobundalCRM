"use client";

import { cn } from "@/extra/utils";
import { ComponentProps, useRef } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

export function AddressInput(props: ComponentProps<"input">) {
  const ref = useRef<HTMLInputElement>(null);

  const open = useDaumPostcodePopup();

  const show = () => {
    open({
      onComplete: (data) => {
        const addressInput = ref.current;
        if (addressInput === null) return;
        addressInput.value = data.roadAddress;
      },
    });
  };

  return (
    <input
      {...props}
      ref={ref}
      className={cn(
        "dsy-input-bordered dsy-input invalid:dsy-input-error disabled:dsy-input-disabled invalid:animate-shake",
        props.className,
      )}
      onChange={show}
      onClick={show}
    />
  );
}
