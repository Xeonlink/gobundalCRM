"use client";

import { faArrowsRotate, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image as PrismaImage } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getNotAssignedImages } from "./actions";
import { useImages } from "@/app/api/images/accessors";

type Props = {
  id?: string;
  onSelect?: (data: PrismaImage) => void;
};

export default function ImageSelector(props: Props) {
  const images = useImages();

  return (
    <dialog id="image-selector" className="dsy-modal">
      <div className="dsy-modal-box p-0 text-center">
        <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
          <li>
            {/* Refresh */}
            <button type="button" className="dsy-btn" onClick={() => images.refetch()}>
              <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
            </button>
          </li>

          <li>
            {/* Create New Image */}
            <Link href="images/create" className="dsy-btn" scroll={false}>
              <FontAwesomeIcon icon={faPlus} /> 이미지 추가하기
            </Link>
          </li>
        </ul>

        <ol className="flex w-full flex-wrap justify-center gap-2 p-2">
          {images.data?.data.map((item) => (
            <li
              key={item.id}
              className="h-16 animate-scaleTo1 transition-all hover:scale-105 sm:h-24 lg:h-32"
            >
              <form method="dialog" className="h-full w-full">
                <button onClick={() => props.onSelect?.(item)} className="h-full w-full">
                  <Image
                    src={item.src}
                    alt={item.name}
                    width={item.width}
                    height={item.height}
                    priority
                    className="h-full w-full rounded-md"
                  />
                </button>
              </form>
            </li>
          ))}
        </ol>
      </div>
      <form method="dialog" className="dsy-modal-backdrop">
        {/* if there is a button in form, it will close the modal */}
        <button>Close</button>
      </form>
    </dialog>
  );
}
