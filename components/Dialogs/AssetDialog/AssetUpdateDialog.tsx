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
    <dialog ref={props.ref} onClose={props.closeSelf} className="dsy-modal">
      <form method="dialog" className="dsy-modal-box w-96 bg-opacity-60 backdrop-blur-md">
        <button type="button" onDoubleClick={() => openAssetPreviewDialog(asset.src)}>
          <img src={asset.src} alt={asset.name} className="rounded-md" />
        </button>

        <div className="dsy-divider">
          <FaIcon icon={faMagnifyingGlass} /> 상세정보
        </div>

        <div className="dsy-form-control">
          <label htmlFor="name" className="dsy-label py-1">
            <span className="dsy-label-text">
              <FaIcon icon={faSignature} fontSize={16} /> 이름
            </span>
            <Input
              id="name"
              value={asset.name}
              onChange={assetActions.onNameChange}
              placeholder="이름"
              className="w-60"
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="mimeType" className="dsy-label py-1">
            <span className="dsy-label-text">
              <FaIcon icon={faShapes} fontSize={16} /> 형식
            </span>
            <Input
              id="mimeType"
              value={asset.mimeType}
              placeholder="mimeType"
              disabled
              className="w-60"
            />
          </label>
        </div>

        <div className="dsy-modal-action">
          {/* Close */}
          <button className="dsy-btn-sm dsy-btn" disabled={isLoading}>
            <FaIcon icon={faX} isLoading={isLoading} value="닫기" />
          </button>

          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isCleared || isLoading}
            onClick={assetActions.reset}
          >
            <FaIcon icon={faNotdef} rotation={90} isLoading={isLoading} value="초기화" />
          </button>

          {/* Delete */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isLoading}
            onClick={() => deleteItem.mutate()}
          >
            <FaIcon icon={faTrashAlt} isLoading={isLoading} value="삭제" />
          </button>

          {/* Save */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            onClick={() => updateItem.mutate()}
            disabled={!isValid || isLoading}
          >
            <FaIcon icon={faFloppyDisk} isLoading={isLoading} value="저장" />
          </button>
        </div>
      </form>
    </dialog>
  );
}
