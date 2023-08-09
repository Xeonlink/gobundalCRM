"use client";

import { Asset, useAssets } from "@/api/assets";
import { useDeleteProducts } from "@/api/products";
import { AssetCreateDialog } from "@/components/Dialogs/AssetDialog/AssetCreateDialog";
import { AssetUpdateDialog } from "@/components/Dialogs/AssetDialog/AssetUpdateDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { ModalProps } from "@/extra/type";
import { cn } from "@/extra/utils";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import { useModal } from "@/hooks/useModal";
import IcoExcel from "@/public/icons/excel.png";
import {
  faBoxesStacked,
  faCheck,
  faPlus,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

type Props = ModalProps<{ onSelect?: (asset: Asset) => void }>;

export default function AssetSelector(props: Props) {
  const { ref, closeSelf, onSelect } = props;

  const { data: assets } = useAssets();
  const selected = useItemSelection();
  const modalCtrl = useModal();
  const excel = useExcel();
  const deleteItems = useDeleteProducts(selected.ids, {
    onSuccess: () => selected.clear(),
  });

  const openAssetCreateDialog = () => {
    modalCtrl.open(<AssetCreateDialog />);
  };
  const openAssetUpdateDialog = (assetId: string) => () => {
    modalCtrl.open(<AssetUpdateDialog assetId={assetId} />);
  };
  const onConfirmClick = () => {
    if (selected.ids.length > 1) {
      alert("다중 선택은 아직 지원하지 않습니다.");
      return;
    }
    const product = assets?.data.find((product) => product.id === selected.ids[0]);
    if (!product) {
      alert("실행도중 오류가 발생했습니다. 다시 시도해주세요. 오류코드: 279384");
      return;
    }
    onSelect?.(product);
    closeSelf?.();
  };
  const onDeleteClick = () => {
    if (selected.isEmpty) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    deleteItems.mutate();
  };
  const onExcelDownloadClick = () => {
    excel.download(assets?.data!, "상품");
  };

  return (
    <dialog ref={ref} onClose={closeSelf} className="dialog">
      <div className="space-y-3">
        <fieldset className="fieldset">
          <legend className="legend">
            <FaIcon icon={faBoxesStacked} /> 상품선택
          </legend>

          <ol className="grid grid-cols-[repeat(auto-fill,_200px)] gap-3">
            {assets?.data?.map((item) => (
              <li
                key={item.id}
                className={cn("btn bg-transparent p-2 text-start active:scale-90", {
                  "bg-white bg-opacity-70": selected.includes(item.id),
                })}
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => openAssetUpdateDialog(item.id)}
              >
                <img src={item.src} alt={item.name} className="m-auto h-44 object-contain" />
                <h1 className="font-bold">{item.name}</h1>
                <p className="text-sm">{item.mimeType}</p>
              </li>
            ))}
          </ol>
        </fieldset>
      </div>

      <form method="dialog" className="mt-3 flex justify-center gap-2">
        {/* Cratet New Order */}
        <button type="button" className="btn" onClick={openAssetCreateDialog}>
          <FaIcon icon={faPlus} /> 에셋 추가하기
        </button>

        {/* Delete */}
        <button type="button" className="btn" onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type="button" className="btn" onClick={onExcelDownloadClick}>
          <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={20} /> 엑셀로 변환
        </button>

        {/* Close */}
        <button className="btn">
          <FaIcon icon={faX} /> 닫기
        </button>

        {/* 확인 */}
        <button type="button" className="btn" onClick={onConfirmClick} disabled={selected.isEmpty}>
          <FaIcon icon={faCheck} /> 선택
        </button>
      </form>
    </dialog>
  );
}
