"use client";

import { useDeleteProducts, useProducts } from "@/api/products";
import { ProductDialog } from "@/components/Dialogs/ProductDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { useModal } from "@/extra/modal";
import { PageProps } from "@/extra/type";
import { cn } from "@/extra/utils";
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
import { useRouter } from "next/navigation";
import React from "react";

type SearchParams = {
  date: `${string}-${string}-${string}`;
  view: "card" | "table";
};

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { view = "table" } = searchParams;

  const auth = useAuth();
  const excel = useExcel();
  const navigate = useRouter();
  const modalCtrl = useModal();
  const selected = useItemSelection();
  const products = useProducts({
    enabled: auth.isSignIn,
  });
  const deleteItems = useDeleteProducts(selected.ids, {
    onSuccess: () => selected.clear(),
  });
  const onViewStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`products?view=${e.target.value}`);
  };
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

        {/* Change ViewStyle */}
        <select
          className="btn appearance-none text-center"
          value={view}
          onChange={onViewStyleChange}
        >
          <option value="table">표로 보기</option>
          <option value="card">카드로 보기</option>
        </select>

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

      {view === "table" ? (
        <table className="grid w-full grid-cols-[repeat(6,_auto)] gap-1">
          <thead className="contents">
            <tr className="contents">
              <th className="th col-span-4 bg-orange-100">
                <FaIcon icon={faBox} /> 상품
              </th>
              <th className="th col-span-2 bg-green-100">
                <FaIcon icon={faSliders} /> 상태
              </th>
            </tr>
            <tr className="contents">
              <th className="th bg-orange-50">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="th bg-orange-50">
                <FaIcon icon={faWon} /> 가격
              </th>
              <th className="th bg-orange-50">
                <FaIcon icon={faWon} /> 할인가격
              </th>
              <th className="th bg-orange-50">
                <FaIcon icon={faBoxes} /> 재고
              </th>
              <th className="th bg-green-50">
                <FaIcon icon={faCoins} /> 할인중
              </th>
              <th className="th bg-green-50">
                <FaIcon icon={faToggleOn} /> 활성화
              </th>
            </tr>
          </thead>
          <tbody className="contents">
            {products.data?.data.map((item) => (
              <tr
                key={item.id}
                className="group contents cursor-pointer"
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => openProductUpdateDialog(item.id)}
                onTouchEnd={() => openProductUpdateDialog(item.id)}
                aria-selected={selected.includes(item.id)}
              >
                <td className="td group-aria-selected:bg-white group-aria-selected:bg-opacity-40">
                  {item.name}
                </td>
                <td className="td group-aria-selected:bg-white group-aria-selected:bg-opacity-40">
                  {item.price.toLocaleString() + "원"}
                </td>
                <td className="td group-aria-selected:bg-white group-aria-selected:bg-opacity-40">
                  {item.salePrice.toLocaleString() + "원"}
                </td>
                <td className="td group-aria-selected:bg-white group-aria-selected:bg-opacity-40">
                  {item.remain < 0 ? <FaIcon icon={faInfinity} /> : item.remain}
                </td>
                <td className="td group-aria-selected:bg-white group-aria-selected:bg-opacity-40">
                  {item.isSale ? "O" : "X"}
                </td>
                <td className="td group-aria-selected:bg-white group-aria-selected:bg-opacity-40">
                  {item.enabled ? "O" : "X"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {view === "card" ? (
        <ol className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-3">
          {products.data?.data?.map((item) => (
            <li
              key={item.id}
              className={cn("btn bg-transparent p-2 text-start active:scale-90", {
                "bg-white bg-opacity-70": selected.includes(item.id),
              })}
              onClick={selected.onItemClick(item.id)}
              onDoubleClick={() => openProductUpdateDialog(item.id)}
            >
              <p className="mb-2 rounded-md bg-orange-200 p-2">
                <b className="text-lg">{item.name}</b> <br />
                {item.price.toLocaleString() + "원"} <br />
                {item.salePrice.toLocaleString() + "원"} <br />
                {item.remain < 0 ? <FaIcon icon={faInfinity} /> : item.remain}
              </p>
              <p className="mb-2 rounded-md bg-green-200 p-2">
                할인중 {item.isSale ? "O" : "X"} <br />
                활성화 {item.enabled ? "O" : "X"}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
