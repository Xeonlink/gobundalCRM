"use client";

import { useAssets } from "@/api/assets";
import { useDeleteProducts } from "@/api/products";
import { ColumnList } from "@/components/ColumnList";
import { AssetCreateDialog } from "@/components/Dialogs/AssetDialog/AssetCreateDialog";
import { AssetUpdateDialog } from "@/components/Dialogs/AssetDialog/AssetUpdateDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { useModal } from "@/extra/modal";
import { cn } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import IcoExcel from "@/public/icons/excel.png";
import { faArrowsRotate, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Page() {
  const auth = useAuth();
  const excel = useExcel();
  const modalCtrl = useModal();
  const selected = useItemSelection();
  const assets = useAssets({
    enabled: auth.isSignIn,
  });
  const deleteItems = useDeleteProducts(selected.ids, {
    onSuccess: () => selected.clear(),
  });
  const openAssetCreateDialog = () => {
    modalCtrl.open(<AssetCreateDialog />);
  };
  const openAssetUpdateDialog = (assetId: string) => {
    modalCtrl.open(<AssetUpdateDialog assetId={assetId} />);
  };
  const onExcelDownloadClick = () => {
    excel.download(assets.data?.data!, "상품");
  };
  const onDeleteClick = () => {
    if (selected.isEmpty) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    deleteItems.mutate();
  };

  return (
    <main className="flex h-screen flex-1 flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3">
        {/* Refresh */}
        <button type="button" className="dsy-btn-sm dsy-btn" onClick={() => assets.refetch()}>
          <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
        </button>

        {/* Cratet New Order */}
        <button type="button" className="dsy-btn-sm dsy-btn" onClick={openAssetCreateDialog}>
          <FontAwesomeIcon icon={faPlus} /> 자료 추가하기
        </button>

        {/* Delete */}
        <button type="button" className="dsy-btn-sm dsy-btn" onClick={onDeleteClick}>
          <FontAwesomeIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type="button" className="dsy-btn-sm dsy-btn" onClick={onExcelDownloadClick}>
          <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={20} /> 엑셀로 변환
        </button>
      </div>

      <ColumnList
        threashold={[0, 640, 900, 1200, Infinity]}
        className="flex-1 items-start justify-center gap-2 space-x-2 overflow-auto text-center"
      >
        {(count, columnIndex) => (
          <ol className="mb-2 inline-block w-72 space-y-2 text-left align-top">
            {assets.data?.data
              ?.filter((_, index) => index % count === columnIndex)
              .map((item) => (
                <li
                  key={item.id}
                  className="dsy-card dsy-card-compact animate-scaleTo1 cursor-pointer overflow-hidden rounded-lg bg-white bg-opacity-60"
                  onClick={selected.onItemClick(item.id)}
                  onDoubleClick={() => openAssetUpdateDialog(item.id)}
                >
                  <figure>
                    <img
                      src={item.src}
                      alt={item.name}
                      className="m-auto cursor-pointer object-contain transition-all hover:scale-105"
                    />
                  </figure>
                  <div className="dsy-card-body gap-0">
                    <h2 className="font-bold">{item.name}</h2>
                    <p className="text-sm">{item.mimeType}</p>
                  </div>
                </li>
              ))}
          </ol>
        )}
      </ColumnList>
    </main>
  );
}
