"use client";

import { useAssets } from "@/api/assets";
import { useDeleteProducts } from "@/api/products";
import { AssetCreateDialog } from "@/components/Dialogs/AssetDialog/AssetCreateDialog";
import { AssetUpdateDialog } from "@/components/Dialogs/AssetDialog/AssetUpdateDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { cn } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import { useModal } from "@/hooks/useModal";
import IcoExcel from "@/public/icons/excel.png";
import { faArrowsRotate, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

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
    <main className="h-full flex-1 overflow-auto p-3">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {/* Refresh */}
        <button type="button" className="btn" onClick={() => assets.refetch()}>
          <FaIcon icon={faArrowsRotate} /> 새로고침
        </button>

        {/* Cratet New Order */}
        <button type="button" className="btn" onClick={openAssetCreateDialog}>
          <FaIcon icon={faPlus} /> 자료 추가하기
        </button>

        {/* Delete */}
        <button type="button" className="btn" onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type="button" className="btn" onClick={onExcelDownloadClick}>
          <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={20} /> 엑셀로 변환
        </button>
      </div>

      <ol className="grid grid-cols-[repeat(auto-fill,_200px)] gap-3">
        {assets.data?.data?.map((item) => (
          <li
            key={item.id}
            className={cn("btn bg-transparent p-2 text-start active:scale-90", {
              "bg-white bg-opacity-70": selected.includes(item.id),
            })}
            onClick={selected.onItemClick(item.id)}
            onDoubleClick={() => openAssetUpdateDialog(item.id)}
          >
            <img src={item.src} alt={item.name} className="m-auto h-40 object-contain" />
            <h1 className="overflow-hidden text-ellipsis font-bold">{item.name}</h1>
            <p className="text-sm">{item.mimeType}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
