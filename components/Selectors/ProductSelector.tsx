"use client";

import { Product, useDeleteProducts, useProducts } from "@/api/products";
import { ModalProps } from "@/extra/type";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import { useModal } from "@/hooks/useModal";
import IcoExcel from "@/public/icons/excel.png";
import {
  faBoxesStacked,
  faCheck,
  faCoins,
  faPlus,
  faSignature,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { ProductDialog } from "../Dialogs/ProductDialog";
import { ImgIcon } from "../ImgIcon";

type Props = ModalProps<{
  onSelect?: (product: Product) => void;
}>;

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
    <dialog ref={ref} onClose={closeSelf} className="dialog">
      <div className="space-y-3">
        <fieldset className="fieldset">
          <legend className="legend">
            <FaIcon icon={faBoxesStacked} /> 상품선택
          </legend>

          <table className="grid grid-cols-[14rem_7rem_7rem_5rem_5rem_5rem] gap-1">
            <thead className="contents">
              <tr className="contents">
                <th className="th">
                  <FaIcon icon={faSignature} /> 이름
                </th>
                <th className="th">
                  <FaIcon icon={faCoins} /> 가격
                </th>
                <th className="th">
                  <FaIcon icon={faCoins} /> 할인가격
                </th>
                <th className="th">재고</th>
                <th className="th">할인중</th>
                <th className="th">활성화</th>
              </tr>
            </thead>
            <tbody className="contents">
              {products?.data.map((product, index) => (
                <tr
                  key={product.id}
                  className="group contents"
                  onDoubleClick={onItemDoubleClick(product)}
                  onClick={selected.onItemClick(product.id)}
                  aria-selected={selected.includes(product.id)}
                >
                  <td className="btn bg-opacity-40 px-3 py-2 text-center shadow-none group-aria-selected:bg-white">
                    {product.name}
                  </td>
                  <td className="btn bg-opacity-40 px-3 py-2 text-center shadow-none group-aria-selected:bg-white">
                    {product.price.toLocaleString()}
                  </td>
                  <td className="btn bg-opacity-40 px-3 py-2 text-center shadow-none group-aria-selected:bg-white">
                    {product.salePrice.toLocaleString()}
                  </td>
                  <td className="btn bg-opacity-40 px-3 py-2 text-center shadow-none group-aria-selected:bg-white">
                    {product.remain.toLocaleString()}
                  </td>
                  <td className="btn bg-opacity-40 px-3 py-2 text-center shadow-none group-aria-selected:bg-white">
                    {product.isSale ? "O" : "X"}
                  </td>
                  <td className="btn bg-opacity-40 px-3 py-2 text-center shadow-none group-aria-selected:bg-white">
                    {product.enabled ? "O" : "X"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </fieldset>
      </div>

      <form method="dialog" className="mt-3 flex justify-center gap-2">
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
