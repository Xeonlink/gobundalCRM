"use client";

import { useAsset, useDeleteAsset, useUpdateAsset } from "@/api/assets";
import { ModalProps } from "@/extra/modal";
import { diff } from "@/extra/utils";
import { useModal } from "@/extra/modal";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faFloppyDisk,
  faImage,
  faMagnifyingGlass,
  faNotdef,
  faShapes,
  faSignature,
  faTrashAlt,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <dialog ref={props.ref} onClose={props.closeSelf} className="dsy-modal">
      <form method="dialog" className="dsy-modal-box w-96 bg-opacity-60 backdrop-blur-md">
        <button
          type="button"
          className="dsy-btn-ghost dsy-btn-sm dsy-btn-circle dsy-btn absolute right-6 top-4"
          onClick={props.closeSelf}
        >
          ✕
        </button>

        <h1 className="text-lg font-bold">에셋</h1>

        <button type="button" onDoubleClick={() => openAssetPreviewDialog(asset.src)}>
          <img src={asset.src} alt={asset.name} className="mt-2 rounded-md" />
        </button>

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
            className="dsy-btn-sm dsy-btn"
            disabled={isCleared || isLoading}
            onClick={assetActions.reset}
          >
            <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
          </button>

          {/* Delete */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isLoading}
            onClick={() => deleteItem.mutate()}
          >
            <FontAwesomeIcon icon={faTrashAlt} /> 삭제
          </button>

          {/* Save */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            onClick={() => updateItem.mutate()}
            disabled={!isValid || isLoading}
          >
            <FontAwesomeIcon icon={faFloppyDisk} /> 저장
          </button>
        </div>
      </form>
    </dialog>
  );
}
