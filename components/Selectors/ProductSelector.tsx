"use client";

import { Product, useDeleteProducts, useProducts } from "@/api/products";
import { ModalProps } from "@/extra/modal";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import { useModal } from "@/extra/modal";
import IcoExcel from "@/public/icons/excel.png";
import {
  faBoxes,
  faBoxesStacked,
  faCheck,
  faCoins,
  faInfinity,
  faPlus,
  faSignature,
  faToggleOn,
  faTrashCan,
  faWon,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { ProductDialog } from "../Dialogs/ProductDialog";
import { ImgIcon } from "../ImgIcon";

type Props = ModalProps<{ onSelect?: (product: Product) => void }>;

export function ProductSelector(props: Props) {
  const { ref, closeSelf, onSelect } = props;

  const { data: products } = useProducts();
  const selected = useItemSelection();
  const modalCtrl = useModal();
  const excel = useExcel();
  const deleteItems = useDeleteProducts(selected.ids, {
    onSuccess: () => selected.clear(),
  });

  const openProductCreateDialog = () => {
    modalCtrl.open(<ProductDialog mode="CREATE" />);
  };
  const onItemDoubleClick = (product: Product) => () => {
    modalCtrl.open(<ProductDialog mode="UPDATE" productId={product.id} />);
  };
  const onConfirmClick = () => {
    if (selected.ids.length > 1) {
      alert("다중 선택은 아직 지원하지 않습니다.");
      return;
    }
    const product = products?.data.find((product) => product.id === selected.ids[0]);
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
    excel.download(products?.data!, "상품");
  };

  return (
    <dialog ref={ref} onClose={closeSelf} className="dsy-modal">
      <form
        method="dialog"
        className="dsy-modal-box max-h-screen w-full max-w-[50rem] bg-opacity-60 backdrop-blur-md"
      >
        <table className="table">
          <thead>
            <tr>
              <th className="border-none"></th>
              <th className="border-none">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="border-none">
                <FaIcon icon={faCoins} /> 가격
              </th>
              <th className="border-none">
                <FaIcon icon={faCoins} /> 할인가격
              </th>
              <th className="border-none">
                <FaIcon icon={faBoxes} /> 재고
              </th>
              <th className="border-none">
                <FaIcon icon={faCoins} /> 할인중
              </th>
              <th className="border-none">
                <FaIcon icon={faToggleOn} /> 활성화
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.data.map((item) => (
              <tr
                key={item.id}
                onDoubleClick={onItemDoubleClick(item)}
                onClick={selected.onItemClick(item.id)}
                aria-selected={selected.includes(item.id)}
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

        <div className="dsy-modal-action">
          {/* Close */}
          <button className="dsy-btn-sm dsy-btn">
            <FaIcon icon={faX} /> 닫기
          </button>

          {/* Cratet New Order */}
          <button type="button" className="dsy-btn-sm dsy-btn" onClick={openProductCreateDialog}>
            <FaIcon icon={faPlus} /> 상품 추가하기
          </button>

          {/* Delete */}
          <button type="button" className="dsy-btn-sm dsy-btn" onClick={onDeleteClick}>
            <FaIcon icon={faTrashCan} /> 선택삭제
          </button>

          {/* 엑셀로 다운로드하기 */}
          <button type="button" className="dsy-btn-sm dsy-btn" onClick={onExcelDownloadClick}>
            <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={20} /> 엑셀로 변환
          </button>

          {/* 확인 */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            onClick={onConfirmClick}
            disabled={selected.isEmpty}
          >
            <FaIcon icon={faCheck} /> 선택
          </button>
        </div>
      </form>
    </dialog>
  );
}
