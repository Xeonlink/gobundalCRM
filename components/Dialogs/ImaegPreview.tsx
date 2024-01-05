"use client";

import { ModalProps } from "@/extra/modal/modal";
import { Image as ImagePrisma } from "@prisma/client";
import Image from "next/image";
import { Dialog } from "../Dialog";

type Props = ModalProps<{
  image: ImagePrisma;
}>;

export function ImagePreview(props: Props) {
  const { image, closeSelf } = props;

  return (
    <Dialog autoOpen className="dsy-modal dsy-modal-top sm:dsy-modal-middle" onClose={closeSelf}>
      <div className="dsy-modal-box p-0">
        <Image
          src={image.src}
          alt={image.description}
          width={image.width}
          height={image.height}
          className="h-full w-full rounded-lg"
        />
      </div>
      <form method="dialog" className="dsy-modal-backdrop">
        <button>Close</button>
      </form>
    </Dialog>
  );
}
