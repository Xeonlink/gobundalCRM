"use client";

import { RawAsset, useCreateAsset } from "@/api/assets";
import { ModalProps } from "@/extra/type";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faFloppyDisk,
  faImage,
  faNotdef,
  faShapes,
  faSignature,
  faTrashAlt,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { FaIcon } from "../../FaIcon";
import { Input } from "../../Input";

const defaultAsset: RawAsset = {
  name: "",
  mimeType: "",
};

export function AssetCreateDialog(props: ModalProps) {
  const [asset, assetActions] = useTypeSafeReducer(defaultAsset, {
    setFile: (state, file: File) => {
      state.name = file.name;
      state.mimeType = file.type;
    },
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    reset: () => defaultAsset,
  });
  const dropZone = useDropzone({
    onDropAccepted: (files, event) => assetActions.setFile(files[0]),
  });
  const createItem = useCreateAsset(dropZone.acceptedFiles[0], asset, {
    onSuccess: () => props.closeSelf?.(),
  });

  const validity = {
    name: asset.name !== "",
  };
  const isValid = Object.values(validity).every((v) => v);
  const isCleared = asset === defaultAsset;
  const isLoading = createItem.isLoading;

  return (
    <dialog
      ref={props.ref}
      onClose={props.closeSelf}
      className="max-h-full max-w-full animate-scaleTo1 overflow-auto rounded-md bg-transparent p-0 backdrop:backdrop-blur-md"
    >
      <div className="mb-3 flex min-w-max flex-row flex-nowrap gap-3">
        <div className="w-80 space-y-3">
          <fieldset className="fieldset">
            <legend className="legend">
              <FaIcon icon={faImage} fontSize={16} /> 에셋
            </legend>

            <div className="field" {...dropZone.getRootProps()}>
              {!!dropZone.acceptedFiles.length ? (
                <label
                  htmlFor="image"
                  className="min-h-[10rem] cursor-pointer overflow-hidden rounded-lg transition-all"
                >
                  <img
                    src={URL.createObjectURL(dropZone.acceptedFiles[0])}
                    alt="dropped-image"
                    className="m-auto"
                  />
                </label>
              ) : (
                <label
                  htmlFor="image"
                  className="flex min-h-[10rem] cursor-pointer items-center justify-center rounded-lg bg-white bg-opacity-90 transition-colors hover:bg-opacity-100"
                >
                  <FaIcon icon={faImage} className="mr-1" /> 이미지를 드래그하거나 클릭하세요.
                </label>
              )}
              <input id="image" {...dropZone.getInputProps()} />
            </div>

            <div className="field">
              <label htmlFor="name" className="label">
                <FaIcon icon={faSignature} fontSize={16} /> 이름
              </label>
              <Input
                id="name"
                value={asset.name}
                onChange={assetActions.onNameChange}
                placeholder="이름"
              />
            </div>

            <div className="field">
              <label htmlFor="mimeType" className="label">
                <FaIcon icon={faShapes} fontSize={16} /> 형식
              </label>
              <Input
                id="mimeType"
                value={asset.mimeType}
                placeholder="mimeType"
                readOnly
                className="cursor-default bg-opacity-70 outline-none"
              />
            </div>
          </fieldset>
        </div>
      </div>

      <form method="dialog" className="flex justify-center gap-2">
        {/* Close */}
        <button className="btn" disabled={isLoading}>
          <FaIcon icon={faX} isLoading={isLoading} value="닫기" />
        </button>

        {/* Clear */}
        <button
          type="button"
          className="btn"
          disabled={isCleared || isLoading}
          onClick={assetActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} isLoading={isLoading} value="초기화" />
        </button>

        {/* Save */}
        <button
          type="button"
          className="btn"
          onClick={() => createItem.mutate()}
          disabled={!isValid || isLoading}
        >
          <FaIcon icon={faFloppyDisk} isLoading={isLoading} value="저장" />
        </button>
      </form>
    </dialog>
  );
}
