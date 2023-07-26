"use client";

import { useDeleteProducts, useProducts } from "@/api/products";
import { ImgIcon } from "@/components/ImgIcon";
import { PageProps } from "@/extra/type";
import { cls } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import IcoExcel from "@/public/icons/excel.png";
import { faArrowsRotate, faInfinity, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as XlSX from "xlsx";

type SearchParams = {
  date: `${string}-${string}-${string}`;
  view: "card" | "table";
};

const th = (className: TemplateStringsArray) => {
  return `m-box py-1 shadow-none ${className.join(" ")}`;
};

const td = (className: TemplateStringsArray) => {
  return `text-center py-1 px-2 rounded-md aria-selected:bg-white aria-selected:bg-opacity-70 transition-all ${className.join(
    " "
  )}`;
};

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { view = "table" } = searchParams;

  useAuth();
  const navigate = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const products = useProducts();
  const deleteProducts = useDeleteProducts(selectedIds, {
    onSuccess: () => setSelectedIds([]),
  });

  const onViewStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`products?view=${e.target.value}`);
  };

  const onItemClick = (id: string) => (e: React.MouseEvent<HTMLElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (selectedIds.includes(id)) {
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      } else {
        setSelectedIds((prev) => [...prev, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  };

  const gotoItemPage = (orderId: string) => {
    navigate.push(`products/${orderId}`);
  };

  const onDeleteClick = () => {
    if (selectedIds.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    deleteProducts.mutate();
  };

  const onExcelDownloadClick = () => {
    if (products.data?.data === undefined) return;

    const fileName = `${dayjs().format("YYYY-MM-DD")} 상품.xlsx`;
    const sheet = XlSX.utils.json_to_sheet(products.data?.data);
    const book = XlSX.utils.book_new();
    XlSX.utils.book_append_sheet(book, sheet, "Sheet1");
    XlSX.writeFile(book, fileName);
  };

  return (
    <main className='p-3 h-full flex-1'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3 mb-3'>
        {/* Refresh */}
        <button type='button' className='btn px-3 py-2' onClick={() => products.refetch()}>
          <FaIcon icon={faArrowsRotate} /> 새로고침
        </button>

        {/* Change ViewStyle */}
        <select
          className='btn px-3 py-2 appearance-none text-center'
          value={view}
          onChange={onViewStyleChange}
        >
          <option value='table'>표로 보기</option>
          <option value='card'>카드로 보기</option>
        </select>

        {/* Cratet New Order */}
        <Link href='products/create' className='btn px-3 py-2'>
          <FaIcon icon={faPlus} /> 상품 추가하기
        </Link>

        {/* Delete */}
        <button type='button' className='btn px-3 py-2' onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type='button' className='btn px-3 py-2' onClick={onExcelDownloadClick}>
          <ImgIcon src={IcoExcel} alt='엑셀로 변환' fontSize={20} /> 엑셀로 변환
        </button>
      </div>

      {view === "table" ? (
        <table className='w-full product-table-grid gap-1'>
          <thead className='contents'>
            <tr className='contents'>
              <th className={th`col-span-4 bg-orange-100`}>상품</th>
              <th className={th`col-span-2 bg-green-100`}>상태</th>
            </tr>
            <tr className='contents'>
              <th className={th`bg-orange-50`}>이름</th>
              <th className={th`bg-orange-50`}>가격</th>
              <th className={th`bg-orange-50`}>할인가격</th>
              <th className={th`bg-orange-50`}>재고</th>
              <th className={th`bg-green-50`}>할인중</th>
              <th className={th`bg-green-50`}>활성화</th>
            </tr>
          </thead>
          <tbody className='contents'>
            {products.data?.data.map((item) => (
              <tr
                key={item.id}
                className='contents cursor-pointer order-table__tr'
                onClick={onItemClick(item.id)}
                onDoubleClick={() => gotoItemPage(item.id)}
                onTouchEnd={() => gotoItemPage(item.id)}
                aria-selected={selectedIds.includes(item.id)}
              >
                <td className={td``}>{item.name}</td>
                <td className={td``}>{item.price.toLocaleString() + "원"}</td>
                <td className={td``}>{item.salePrice.toLocaleString() + "원"}</td>
                <td className={td``}>
                  {item.remain < 0 ? <FaIcon icon={faInfinity} /> : item.remain}
                </td>
                <td className={td``}>{item.isSale ? "O" : "X"}</td>
                <td className={td``}>
                  {item.enabled ? "O" : "X"}
                  {/* {item.enabled ? (
                    <i className='inline-block rounded-full bg-green-500 w-3 h-3' />
                  ) : (
                    <i className='inline-block rounded-full bg-orange-500 w-3 h-3' />
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {view === "card" ? (
        <ol className='product-card-grid gap-3'>
          {products.data?.data?.map((item) => (
            <li
              key={item.id}
              className={cls("btn p-2 bg-transparent active:scale-90 text-start", {
                "bg-opacity-70 bg-white": selectedIds.includes(item.id),
              })}
              onClick={onItemClick(item.id)}
              onDoubleClick={() => gotoItemPage(item.id)}
            >
              <p className='bg-orange-200 mb-2 p-2 rounded-md'>
                <b className='text-lg'>{item.name}</b> <br />
                {item.price.toLocaleString() + "원"} <br />
                {item.salePrice.toLocaleString() + "원"} <br />
                {item.remain < 0 ? <FaIcon icon={faInfinity} /> : item.remain}
              </p>
              <p className='bg-green-200 mb-2 p-2 rounded-md'>
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
