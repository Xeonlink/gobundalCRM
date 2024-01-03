"use client";

import { ModalProps } from "@/extra/modal/modal";
import { cn } from "@/extra/utils";

type Props = ModalProps<{ src: string }>;

export function AssetPreviewDialog(props: Props) {
  const { ref, closeSelf, src } = props;

  return (
    <dialog
      ref={ref}
      onClose={closeSelf}
      className={cn(
        "flex h-full max-h-full max-w-full animate-scaleTo1 cursor-pointer rounded-md bg-transparent p-0 text-black backdrop:backdrop-blur-md focus:outline-none",
      )}
      onClick={closeSelf}
    >
      <img src={src} alt="이미지 프리뷰" className="m-auto max-h-[95%] max-w-[95%] rounded-xl" />
    </dialog>
  );
}
