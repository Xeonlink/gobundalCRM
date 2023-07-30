"use client";

import { useCustomersByName, useDeleteCustomers } from "@/api/customers";
import { ImgIcon } from "@/components/ImgIcon";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { cls, debounce } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import IcoExcel from "@/public/icons/excel.png";
import { faArrowsRotate, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as XlSX from "xlsx";

type SearchParams = {
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
  const [name, setName] = useState("");
  const items = useCustomersByName(name, {
    enabled: name !== "",
  });
  const eraseItems = useDeleteCustomers(selectedIds, {
    onSuccess: () => setSelectedIds([]),
  });

  const onViewStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`customsers?view=${e.target.value}`);
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

  const gotoItemPage = (id: string) => {
    navigate.push(`customers/${id}`);
  };

  const onDeleteClick = () => {
    if (selectedIds.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    eraseItems.mutate();
  };

  const onExcelDownloadClick = () => {
    if (items.data?.data === undefined) return;

    const fileName = `${dayjs().format("YYYY-MM-DD")} 주문.xlsx`;
    const sheet = XlSX.utils.json_to_sheet(items.data?.data);
    const book = XlSX.utils.book_new();
    XlSX.utils.book_append_sheet(book, sheet, "Sheet1");
    XlSX.writeFile(book, fileName);
  };

  return (
    <main className='p-3 h-full flex-1 overflow-auto'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3 mb-3'>
        {/* Refresh */}
        <button type='button' className='btn px-3 py-2' onClick={() => items.refetch()}>
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
        <Link href='customers/create' className='btn px-3 py-2'>
          <FaIcon icon={faPlus} /> 고객 추가하기
        </Link>

        {/* Delete */}
        <button type='button' className='btn px-3 py-2' onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type='button' className='btn px-3 py-2' onClick={onExcelDownloadClick}>
          <ImgIcon src={IcoExcel} alt='엑셀로 변환' fontSize={20} /> 엑셀로 변환
        </button>

        {/* 고객이름으로 검색 */}
        <Input
          className='w-40 shadow-md'
          placeholder='홍길동'
          onChange={debounce((e) => setName(e.target.value), 300)}
        />
      </div>

      {view === "table" ? (
        <table className='w-full customers-table-grid gap-1'>
          <thead className='contents'>
            <tr className='contents'>
              <th className={th`bg-orange-100 col-span-2`}>기본</th>
              <th className={th`bg-green-100 col-span-2`}>상세</th>
            </tr>
            <tr className='contents'>
              <th className={th`bg-orange-50`}>이름</th>
              <th className={th`bg-orange-50`}>전화번호</th>
              <th className={th`bg-green-50`}>주소</th>
              <th className={th`bg-green-50`}>상세주소</th>
            </tr>
          </thead>
          <tbody className='contents'>
            {items.data?.data.map((item) => (
              <tr
                key={item.id}
                className='contents cursor-pointer order-table__tr'
                onClick={onItemClick(item.id)}
                onDoubleClick={() => gotoItemPage(item.id)}
                onTouchEnd={() => gotoItemPage(item.id)}
                aria-selected={selectedIds.includes(item.id)}
              >
                <td className={td``}>{item.name}</td>
                <td className={td``}>{item.phone}</td>
                <td className={td`text-start`}>{item.address}</td>
                <td className={td`text-start`}>{item.addressDetail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {view === "card" ? (
        <ol className='orders-card-grid gap-3'>
          {items.data?.data.map((item) => (
            <li
              key={item.id}
              className={cls("btn p-2 bg-transparent active:scale-90 text-start", {
                "bg-white bg-opacity-70": selectedIds.includes(item.id),
              })}
              onClick={onItemClick(item.id)}
              onDoubleClick={() => gotoItemPage(item.id)}
            >
              <p className='bg-orange-200 mb-2 p-2 rounded-md'>
                <b className='text-lg'>{item.name}</b> {item.phone}
              </p>
              <p className='bg-green-200 mb-2 p-2 rounded-md'>
                {item.address}, {item.addressDetail}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
