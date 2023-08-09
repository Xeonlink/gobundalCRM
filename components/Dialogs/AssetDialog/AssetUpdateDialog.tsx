"use client";

import { useAsset, useDeleteAsset, useUpdateAsset } from "@/api/assets";
import { ModalProps } from "@/extra/modal";
import { diff } from "@/extra/utils";
import { useModal } from "@/extra/modal";
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
import { FaIcon } from "../../FaIcon";
import { Input } from "../../Input";
import { AssetPreviewDialog } from "./AssetPreviewDialog";

export function AssetUpdateDialog(props: ModalProps<{ assetId: string }>) {
  const modalCtrl = useModal();
  const { data: originAsset } = useAsset(props.assetId);
  const [asset, assetActions] = useTypeSafeReducer(originAsset!, {
    setFile: (state, file: File) => {
      state.name = file.name;
      state.mimeType = file.type;
    },
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    reset: () => originAsset,
  });
  const updateItem = useUpdateAsset(originAsset?.id!, diff(asset, originAsset!), {
    onSuccess: () => props.closeSelf?.(),
  });
  const deleteItem = useDeleteAsset(originAsset?.id!, {
    onSuccess: () => props.closeSelf?.(),
  });
  const openAssetPreviewDialog = (src: string) => {
    modalCtrl.open(<AssetPreviewDialog src={src} />);
  };

  const validity = {
    name: asset.name !== "",
  };
  const isValid = Object.values(validity).every((v) => v);
  const isCleared = originAsset === asset;
  const isLoading = updateItem.isLoading || deleteItem.isLoading;

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

            <img
              src={asset.src}
              alt={asset.name}
              className="m-auto mb-3"
              onDoubleClick={() => openAssetPreviewDialog(asset.src)}
            />

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

        {/* Delete */}
        <button
          type="button"
          className="btn"
          disabled={isLoading}
          onClick={() => deleteItem.mutate()}
        >
          <FaIcon icon={faTrashAlt} isLoading={isLoading} value="삭제" />
        </button>

        {/* Save */}
        <button
          type="button"
          className="btn"
          onClick={() => updateItem.mutate()}
          disabled={!isValid || isLoading}
        >
          <FaIcon icon={faFloppyDisk} isLoading={isLoading} value="저장" />
        </button>
      </form>
    </dialog>
  );
}
