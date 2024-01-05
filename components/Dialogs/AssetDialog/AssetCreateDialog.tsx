"use client";

import { defaultAsset, useCreateAsset } from "@/app/api/images/upload/accessors";
import { ModalProps } from "@/extra/modal/modal";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faFloppyDisk,
  faImage,
  faMagnifyingGlass,
  faNotdef,
  faShapes,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDropzone } from "react-dropzone";
import { Input } from "../../Input";

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
    <dialog ref={props.ref} onClose={props.closeSelf} className="dsy-modal">
      <form method="dialog" className="dsy-modal-box w-96 bg-opacity-60 backdrop-blur-md">
        <button
          type="button"
          className="dsy-btn-ghost dsy-btn dsy-btn-sm dsy-btn-circle absolute right-6 top-4"
          onClick={props.closeSelf}
        >
          ✕
        </button>

        <h1 className="text-lg font-bold">에셋</h1>

        <div {...dropZone.getRootProps()}>
          {!!dropZone.acceptedFiles.length ? (
            <label
              htmlFor="image"
              className="mt-2 min-h-[10rem] cursor-pointer overflow-hidden rounded-lg transition-all"
            >
              <img
                src={URL.createObjectURL(dropZone.acceptedFiles[0])}
                alt="dropped-image"
                className="m-auto mt-2"
              />
            </label>
          ) : (
            <label
              htmlFor="image"
              className="mt-2 flex min-h-[10rem] cursor-pointer items-center justify-center rounded-lg bg-white bg-opacity-90 transition-colors hover:bg-opacity-100"
            >
              <FontAwesomeIcon icon={faImage} className="mr-1" /> 이미지를 드래그하거나 클릭하세요.
            </label>
          )}
          <input id="image" {...dropZone.getInputProps()} />
        </div>

        <div className="dsy-divider">
          <FontAwesomeIcon icon={faMagnifyingGlass} /> 상세정보
        </div>

        <div className="dsy-form-control">
          <label htmlFor="name" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FontAwesomeIcon icon={faSignature} fontSize={16} /> 이름
            </span>
            <Input
              id="name"
              value={asset.name}
              onChange={assetActions.onNameChange}
              placeholder="이름"
              className="w-full max-w-[15rem]"
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="mimeType" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FontAwesomeIcon icon={faShapes} fontSize={16} /> 형식
            </span>
            <Input
              id="mimeType"
              value={asset.mimeType}
              placeholder="mimeType"
              disabled
              className="w-full max-w-[15rem]"
            />
          </label>
        </div>

        <div className="dsy-modal-action">
          {/* Clear */}
          <button
            type="button"
            className="dsy-btn dsy-btn-sm"
            disabled={isCleared || isLoading}
            onClick={assetActions.reset}
          >
            <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
          </button>

          {/* Save */}
          <button
            type="button"
            className="dsy-btn dsy-btn-sm"
            onClick={() => createItem.mutate()}
            disabled={!isValid || isLoading}
          >
            <FontAwesomeIcon icon={faFloppyDisk} /> 저장
          </button>
        </div>
      </form>
    </dialog>
  );
}
