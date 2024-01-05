"use client";

import { getSizeFromImg } from "@/extra/utils";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

type Props = {
  remove: () => void;
  onChange: (image: { file: File; width: number; height: number; src: string }) => void;
  image: { file: File; width: number; height: number; src: string } | null;
};

export function ImagePreviewInput(props: Props) {
  const addImage = async (file: File) => {
    const [width, height] = await getSizeFromImg(file);
    const src = URL.createObjectURL(file);
    const image = { file, width, height, src };
    props.onChange(image);
  };

  if (!!props.image) {
    return (
      <figure className="relative h-28 w-fit overflow-hidden rounded-md shadow-md">
        <Image
          src={props.image.src}
          alt="상품이미지"
          className="h-full w-full object-cover"
          width={props.image.width}
          height={props.image.height}
        />
        <button
          type="button"
          className="dsy-btn dsy-btn-sm absolute right-0 top-0 rounded-none rounded-bl-md border-none bg-white"
          onClick={() => props.remove()}
        >
          x
        </button>
      </figure>
    );
  }

  return (
    <label className="dsy-btn h-28 w-28 flex-col rounded-lg bg-transparent">
      <FontAwesomeIcon icon={faImage} />
      <span className="text-sm">사진추가</span>
      <input
        type="file"
        name="images"
        accept="image/png, image/jpeg, image/jpg"
        hidden
        onChange={(e) => addImage(e.currentTarget.files?.item(0)!)}
      />
    </label>
  );
}
