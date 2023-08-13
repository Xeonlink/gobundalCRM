"use client";

import { useDeleteProducts, useProducts } from "@/api/products";
import { ProductDialog } from "@/components/Dialogs/ProductDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { useModal } from "@/extra/modal";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import IcoExcel from "@/public/icons/excel.png";
import {
  faArrowsRotate,
  faBox,
  faBoxes,
  faCoins,
  faInfinity,
  faPlus,
  faSignature,
  faSliders,
  faToggleOn,
  faTrashCan,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

export default function Page() {
  const auth = useAuth();
  const excel = useExcel();
  const modalCtrl = useModal();
  const selected = useItemSelection();
  const products = useProducts({
    enabled: auth.isSignIn,
  });
  const deleteItems = useDeleteProducts(selected.ids, {
    onSuccess: () => selected.clear(),
  });
  const openProductCreateDialog = () => {
    modalCtrl.open(<ProductDialog mode="CREATE" />);
  };
  const openProductUpdateDialog = (productId: string) => {
    modalCtrl.open(<ProductDialog mode="UPDATE" productId={productId} />);
  };
  const onExcelDownloadClick = () => {
    excel.download(products.data?.data!, "상품");
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
        <button type="button" className="btn" onClick={() => products.refetch()}>
          <FaIcon icon={faArrowsRotate} /> 새로고침
        </button>

        {/* Cratet New Order */}
        <button type="button" className="btn" onClick={openProductCreateDialog}>
          <FaIcon icon={faPlus} /> 상품 추가하기
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

      <div className="max-w-full overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-tl-md bg-orange-100" colSpan={5}>
                <FaIcon icon={faBox} /> 상품
              </th>
              <th className="rounded-tr-md bg-green-100" colSpan={2}>
                <FaIcon icon={faSliders} /> 상태
              </th>
            </tr>
            <tr>
              <th className="rounded-bl-md bg-orange-50">
                <input type="checkbox" name="" id="" className="dsy-checkbox dsy-checkbox-xs" />
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faWon} /> 가격
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faWon} /> 할인가격
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faBoxes} /> 재고
              </th>
              <th className="bg-green-50">
                <FaIcon icon={faCoins} /> 할인중
              </th>
              <th className="rounded-br-md bg-green-50">
                <FaIcon icon={faToggleOn} /> 활성화
              </th>
            </tr>
          </thead>
          <tbody>
            {products.data?.data.map((item) => (
              <tr
                key={item.id}
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => openProductUpdateDialog(item.id)}
                onTouchEnd={() => openProductUpdateDialog(item.id)}
              >
                <td className="max-sm:absolute max-sm:right-3 max-sm:top-3">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className="dsy-checkbox dsy-checkbox-xs"
                    checked={selected.ids.includes(item.id)}
                  />
                </td>
                <td>
                  <label>
                    <FaIcon icon={faSignature} /> 이름
                  </label>
                  <span>{item.name}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faWon} /> 가격
                  </label>
                  <span>{item.price.toLocaleString() + "원"}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faWon} /> 할인가격
                  </label>
                  <span>{item.salePrice.toLocaleString() + "원"}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faBoxes} /> 재고
                  </label>
                  <span>{item.remain < 0 ? <FaIcon icon={faInfinity} /> : item.remain}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faToggleOn} /> 활성화
                  </label>
                  <span>{item.isSale ? "O" : "X"}</span>
                </td>
                <td>
                  <span>{item.enabled ? "O" : "X"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
