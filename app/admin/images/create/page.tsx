"use client";

import { uploadImage } from "@/app/api/images/upload/accessors";
import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import { Back } from "@/components/Navigate/Back";
import { useServerAction } from "@/hooks/useServerActions";
import {
  faArrowLeft,
  faFloppyDisk,
  faHardDrive,
  faImage,
  faNotdef,
  faQuoteLeft,
  faRulerHorizontal,
  faRulerVertical,
  faShapes,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useDropzone } from "react-dropzone";
import { createImage } from "./actions";

export default function Page() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, runAction] = useServerAction(action);
  const dropZone = useDropzone({
    multiple: false,
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    disabled: isLoading,
  });

  async function action(formData: FormData) {
    const file = dropZone.acceptedFiles[0];
    const src = await uploadImage(file);
    formData.append("src", src);
    await createImage(formData);
  }

  return (
    <main className="min-h-screen">
      <form action={runAction}>
        {/* Toolbar */}
        <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2  max-sm:flex-col">
          <li>
            <Back
              className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> 뒤로가기
            </Back>
          </li>
          <li>
            {/* Clear */}
            <button
              type="reset"
              className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
            </button>
          </li>

          <li>
            {/* Save */}
            <button
              className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faFloppyDisk} /> 저장
            </button>
          </li>
        </ul>

        <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
          <div className="w-[350px] space-y-6 rounded-xl border bg-white px-8 py-6">
            <div className="dsy-form-control">
              <label className="dsy-label">
                <strong className="dsy-label-text">
                  사진을 추가해 보세요.&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <div {...dropZone.getRootProps()} className="cursor-pointer">
                {dropZone.acceptedFiles.length > 0 ? (
                  <figure className="relative h-36 w-fit overflow-hidden rounded-md shadow-md">
                    <img
                      ref={imgRef}
                      src={URL.createObjectURL(dropZone.acceptedFiles[0])}
                      alt="dropped-image"
                      className="m-auto h-full w-full object-contain"
                    />
                  </figure>
                ) : (
                  <div className="dsy-btn h-36 w-full flex-col rounded-lg bg-transparent">
                    <FontAwesomeIcon icon={faImage} />
                    <span className="text-sm font-normal">클릭하세요.</span>
                  </div>
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
              <SelfValidateInput
                id="name"
                name="name"
                type="text"
                required
                placeholder="이름"
                title="이미지의 이름"
                disabled={isLoading}
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="description" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faQuoteLeft} /> 설명
                </strong>
              </label>
              <SelfValidateInput
                id="description"
                name="description"
                type="text"
                placeholder="설명"
                title="이미지의 설명"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="w-80 space-y-4">
            <div className="dsy-form-control">
              <label htmlFor="mimeType" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faShapes} /> 형식
                </strong>
              </label>
              <SelfValidateInput
                id="mimeType"
                name="mimeType"
                value={dropZone.acceptedFiles[0]?.type ?? ""}
                placeholder="mimeType"
                readOnly
                title="이미지의 형식"
                disabled={isLoading}
              />
            </div>
            <div className="dsy-form-control">
              <label htmlFor="width" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faRulerHorizontal} /> 가로
                </strong>
              </label>
              <div className="relative">
                <SelfValidateInput
                  id="width"
                  name="width"
                  type="number"
                  value={imgRef.current?.naturalWidth ?? ""}
                  placeholder="0"
                  readOnly
                  title="이지미의 가로 크기"
                  className="w-full"
                  disabled={isLoading}
                />
                <div className="absolute bottom-1/2 right-4 translate-y-1/2">px</div>
              </div>
            </div>
            <div className="dsy-form-control">
              <label htmlFor="height" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faRulerVertical} /> 세로
                </strong>
              </label>
              <div className="relative">
                <SelfValidateInput
                  id="height"
                  name="height"
                  type="number"
                  value={imgRef.current?.naturalHeight ?? ""}
                  placeholder="0"
                  readOnly
                  title="이미지의 세로 크기"
                  className="w-full"
                  disabled={isLoading}
                />
                <div className="absolute bottom-1/2 right-4 translate-y-1/2">px</div>
              </div>
            </div>
            <div className="dsy-form-control">
              <label htmlFor="size" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faHardDrive} /> 용량
                </strong>
              </label>
              <div className="relative">
                <SelfValidateInput
                  id="size"
                  name="size"
                  type="number"
                  value={dropZone.acceptedFiles[0]?.size ?? ""}
                  placeholder="0"
                  readOnly
                  title="이미지의 세로 크기"
                  className="w-full"
                  disabled={isLoading}
                />
                <div className="absolute bottom-1/2 right-4 translate-y-1/2">B (byte)</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
