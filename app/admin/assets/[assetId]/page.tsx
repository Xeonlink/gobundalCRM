"use client";

import { useAsset, useUpdateAsset } from "@/api/assets";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { diff } from "@/extra/utils";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faArrowLeft,
  faCalculator,
  faFloppyDisk,
  faNotdef,
  faRulerHorizontal,
  faRulerVertical,
  faShapes,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type Params = { assetId: string };

export default function Page(props: PageProps<Params, {}>) {
  const { assetId } = props.params;

  const router = useRouter();
  const imgRef = useRef<HTMLImageElement>(null);
  const { data: originAsset } = useAsset(assetId);
  const [asset, assetActions] = useTypeSafeReducer(originAsset!, {
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
    reset: () => originAsset!,
  });
  const updateItem = useUpdateAsset(assetId, diff(asset, originAsset!), {
    onSuccess: () => router.back(),
  });
  const isLoading = updateItem.isLoading;

  const validity = {
    name: asset.name !== "",
  };
  const isValid = Object.values(validity).every((v) => v);

  const calculateSize = () => {
    if (!imgRef.current) return;
    assetActions.setSize([imgRef.current.naturalWidth, imgRef.current.naturalHeight]);
  };

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2  max-sm:flex-col">
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
          <button
            type="button"
            className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            onClick={calculateSize}
          >
            <FontAwesomeIcon icon={faCalculator} /> 크기계산
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
            onClick={() => updateItem.mutate()}
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
            <figure className="relative h-36 w-fit overflow-hidden rounded-md shadow-md">
              <Image
                src={asset.src}
                alt="dropped-image"
                width={asset.width}
                height={asset.height}
                className="m-auto h-full w-full object-contain"
                ref={imgRef}
                priority
              />
            </figure>
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
