"use client";

import { cn, getSizeFromImg } from "@/extra/utils";
import { faImage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { uploadImage } from "./actions";
import { useSimpleServerAction } from "@/hooks/useSimpleServerAction";
import { useServerAction } from "@/hooks/useServerActions";

type Props = {
  className?: string;
  onUploaded?: (data: { id: number; src: string; width: number; height: number }) => void;
};

export function ImageUploadDialog(props: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  // const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   e.target.form?.;
  // };

  const [isPending, runAction] = useServerAction(uploadImage, (data) => {
    if (!data) return;
    const { id, src, width, height } = data;
    props.onUploaded?.({ id, src, width, height });
    ref.current?.close();
  });

  const onSubmit = async (formData: FormData) => {
    const file = formData.get("image") as File;
    if (!file) return;
    const [width, height] = await getSizeFromImg(file);
    formData.append("width", width.toString());
    formData.append("height", height.toString());
    await runAction(formData);
  };

  return (
    <dialog
      ref={ref}
      id="image-uploader"
      className={cn("dsy-modal dsy-modal-bottom sm:dsy-modal-middle", props.className)}
    >
      <form action={onSubmit} className="dsy-modal-box sm:max-w-xs">
        <label className="m-4 flex h-56 flex-col items-center justify-center rounded-2xl border border-gray-300 transition-transform duration-200 active:scale-95">
          <FontAwesomeIcon icon={faImage} className="text-6xl" />
          <span className="mt-2 font-bold">추가하기</span>
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg, image/jpg"
            hidden
            onChange={(e) => e.target.form?.requestSubmit()}
          />
        </label>
      </form>
      <form method="dialog" className="dsy-modal-backdrop">
        {/* if there is a button in form, it will close the modal */}
        <button>Close</button>
      </form>
    </dialog>
  );
}
