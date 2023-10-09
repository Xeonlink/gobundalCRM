"use client";

import { defaultAsset, useCreateAsset } from "@/api/assets";
import { Input } from "@/components/Input";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faArrowLeft,
  faFloppyDisk,
  faImage,
  faNotdef,
  faRulerHorizontal,
  faRulerVertical,
  faShapes,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { SyntheticEvent } from "react";
import { useDropzone } from "react-dropzone";

export default function Page() {
  const router = useRouter();
  const [asset, assetActions] = useTypeSafeReducer(defaultAsset, {
    setFile: (state, file: File) => {
      state.name = file.name;
      state.mimeType = file.type;
    },
    setSize: (state, size: [number, number] | readonly [number, number]) => {
      state.width = size[0];
      state.height = size[1];
    },
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    reset: () => defaultAsset,
  });
  const dropZone = useDropzone();
  const createItem = useCreateAsset(dropZone.acceptedFiles[0], asset, {
    onSuccess: () => router.back(),
  });
  const isLoading = createItem.isLoading;

  const validity = {
    name: asset.name !== "",
    file: dropZone.acceptedFiles.length > 0,
  };
  const isValid = Object.values(validity).every((v) => v);

  const onImgLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    URL.revokeObjectURL(e.currentTarget.src);
    assetActions.setSize([e.currentTarget.naturalWidth, e.currentTarget.naturalHeight]);
    assetActions.setFile(dropZone.acceptedFiles[0]);
  };

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap justify-center bg-base-200 py-2 max-sm:flex-col">
        <li>
          <button
            type="button"
            className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> 뒤로가기
          </button>
        </li>
        <li>
          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            onClick={assetActions.reset}
          >
            <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
          </button>
        </li>

        <li>
          {/* Save */}
          <button
            type="button"
            className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            disabled={!isValid || isLoading}
            onClick={() => createItem.mutate()}
          >
            <FontAwesomeIcon icon={faFloppyDisk} /> 저장
          </button>
        </li>
      </ul>

      <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
        <form className="w-[350px] space-y-6 rounded-xl border bg-white px-8 py-6">
          <div className="dsy-form-control">
            <label htmlFor="image" className="dsy-label">
              <strong className="dsy-label-text">
                사진을 추가해 보세요.&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <div {...dropZone.getRootProps()} className="cursor-pointer">
              {dropZone.acceptedFiles.length > 0 ? (
                <figure className="relative h-36 w-fit overflow-hidden rounded-md shadow-md">
                  <img
                    src={URL.createObjectURL(dropZone.acceptedFiles[0])}
                    alt="dropped-image"
                    className="m-auto h-full w-full object-contain"
                    onLoad={onImgLoad}
                  />
                </figure>
              ) : (
                <label className="dsy-btn h-36 w-full flex-col rounded-lg bg-transparent">
                  <FontAwesomeIcon icon={faImage} />
                  <span className="text-sm font-normal">클릭하거나 여기에 드랍하세요.</span>
                </label>
              )}
              <input {...dropZone.getInputProps()} />
            </div>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="name" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faSignature} /> 이름&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="name"
              disabled={isLoading}
              value={asset.name}
              onChange={assetActions.onNameChange}
              invalid={!validity.name}
            />
          </div>
        </form>

        <div className="w-80 space-y-4">
          <div className="dsy-form-control">
            <label htmlFor="mimeType" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faShapes} /> 형식
              </strong>
            </label>
            <Input id="mimeType" value={asset.mimeType} placeholder="mimeType" readOnly />
          </div>
          <div className="dsy-form-control">
            <label htmlFor="width" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faRulerHorizontal} /> 가로
              </strong>
            </label>
            <Input id="width" value={asset.width + "px"} placeholder="0px" readOnly />
          </div>
          <div className="dsy-form-control">
            <label htmlFor="height" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faRulerVertical} /> 세로
              </strong>
            </label>
            <Input id="height" value={asset.height + "px"} placeholder="0px" readOnly />
          </div>
        </div>
      </div>
    </main>
  );
}
