"use client";

import { ModalProps } from "@/extra/type";

type Props = ModalProps<{ src: string }>;

export function AssetPreviewDialog(props: Props) {
  const { ref, closeSelf, src } = props;

  return (
    <dialog
      ref={ref}
      onClose={closeSelf}
      className="dialog flex h-full animate-scaleTo1"
      onClick={closeSelf}
    >
      <img src={src} alt="이미지 프리뷰" className="m-auto max-h-[95%] max-w-[95%] rounded-xl" />
    </dialog>
  );
}
