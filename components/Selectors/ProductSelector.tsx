"use client";

import { Product, useDeleteProducts, useProducts } from "@/api/products";
import { ModalProps } from "@/extra/type";
import { useItemSelection } from "@/hooks/useItemSelection";
import {
  faArrowsRotate,
  faBoxesStacked,
  faCheck,
  faCoins,
  faFloppyDisk,
  faPlus,
  faSignature,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "../Dialogs/Dialog";
import { useModal } from "@/hooks/useModal";
import { ProductDialog } from "../Dialogs/ProductDialog";
import { ImgIcon } from "../ImgIcon";
import IcoExcel from "@/public/icons/excel.png";
import { useExcel } from "@/hooks/useExcel";

type Props = ModalProps<{
  onSelect?: (product: Product) => void;
}>;

export function ProductSelector(props: Props) {
  const { ref, closeSelf, onSelect } = props;

  const { data: products } = useProducts();
  const selected = useItemSelection();
  const modalCtrl = useModal();
  const excel = useExcel();
  const deleteProducts = useDeleteProducts(selected.ids, {
    onSuccess: () => selected.clear(),
  });

  const openProductCreateDialog = () => {
    modalCtrl.open(<ProductDialog mode='CREATE' />);
  };
  const onItemDoubleClick = (product: Product) => () => {
    modalCtrl.open(<ProductDialog mode='UPDATE' productId={product.id} />);
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
    deleteProducts.mutate();
  };
  const onExcelDownloadClick = () => {
    excel.download(products?.data!, "상품");
  };

  return (
    <Dialog ref={ref} onClose={closeSelf}>
      <div className='space-y-3'>
        <fieldset className='fieldset'>
          <legend className='legend'>
            <FaIcon icon={faBoxesStacked} /> 상품선택
          </legend>

          <table
            className='grid gap-1'
            style={{ gridTemplateColumns: "14rem 7rem 7rem 5rem 5rem 5rem" }}
          >
            <thead className='contents'>
              <tr className='contents'>
                <th className='bg-transparent font-normal'>
                  <FaIcon icon={faSignature} /> 이름
                </th>
                <th className='bg-transparent font-normal'>
                  <FaIcon icon={faCoins} /> 가격
                </th>
                <th className='bg-transparent font-normal'>
                  <FaIcon icon={faCoins} /> 할인가격
                </th>
                <th className='bg-transparent font-normal'>재고</th>
                <th className='bg-transparent font-normal'>할인중</th>
                <th className='bg-transparent font-normal'>활성화</th>
              </tr>
            </thead>
            <tbody className='contents'>
              {products?.data.map((product, index) => (
                <tr
                  className='contents group'
                  onDoubleClick={onItemDoubleClick(product)}
                  onClick={selected.onItemClick(product.id)}
                  aria-selected={selected.includes(product.id)}
                >
                  <td className='text-center btn px-3 py-2 shadow-none bg-opacity-40 group-aria-selected:bg-white'>
                    {product.name}
                  </td>
                  <td className='text-center btn px-3 py-2 shadow-none bg-opacity-40 group-aria-selected:bg-white'>
                    {product.price.toLocaleString()}
                  </td>
                  <td className='text-center btn px-3 py-2 shadow-none bg-opacity-40 group-aria-selected:bg-white'>
                    {product.salePrice.toLocaleString()}
                  </td>
                  <td className='text-center btn px-3 py-2 shadow-none bg-opacity-40 group-aria-selected:bg-white'>
                    {product.remain.toLocaleString()}
                  </td>
                  <td className='text-center btn px-3 py-2 shadow-none bg-opacity-40 group-aria-selected:bg-white'>
                    {product.isSale ? "O" : "X"}
                  </td>
                  <td className='text-center btn px-3 py-2 shadow-none bg-opacity-40 group-aria-selected:bg-white'>
                    {product.enabled ? "O" : "X"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </fieldset>
      </div>

      <form method='dialog' className='flex justify-center gap-2 mt-3'>
        {/* Cratet New Order */}
        <button type='button' className='btn' onClick={openProductCreateDialog}>
          <FaIcon icon={faPlus} /> 상품 추가하기
        </button>

        {/* Delete */}
        <button type='button' className='btn' onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type='button' className='btn' onClick={onExcelDownloadClick}>
          <ImgIcon src={IcoExcel} alt='엑셀로 변환' fontSize={20} /> 엑셀로 변환
        </button>

        {/* Close */}
        <button className='btn'>
          <FaIcon icon={faX} /> 닫기
        </button>

        {/* 확인 */}
        <button type='button' className='btn' onClick={onConfirmClick} disabled={selected.isEmpty}>
          <FaIcon icon={faCheck} /> 선택
        </button>
      </form>
    </Dialog>
  );
}
