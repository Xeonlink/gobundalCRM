"use client";

import { deleteOrders, getOrders } from "@/api/orders";
import { ImgIcon } from "@/components/ImgIcon";
import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import IcoExcel from "@/public/icons/excel.png";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faArrowsRotate, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

export default function OrdersPage(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { date = dayjs().format("YYYY-MM-DD"), view = "table" } = searchParams;
  const [year, month, day] = date.split("-");

  const navigate = useRouter();
  const auth = useAuth({
    unAuthorized: () => navigate.push("/login"),
  });
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const orders = useQuery({
    queryKey: ["orders", date],
    queryFn: () => getOrders(date),
    suspense: true,
    enabled: auth.isSignIn,
  });
  const batchDeleteOrders = useMutation({
    mutationFn: () => deleteOrders(date, selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", date]);
      setSelectedIds([]);
    },
  });

  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`orders?date=${e.target.value}-${month}-${day}&view=${view}`);
  };
  const onMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`orders?date=${year}-${`0${e.target.value}`.slice(-2)}-${day}&view=${view}`);
  };
  const onDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`orders?date=${year}-${month}-${`0${e.target.value}`.slice(-2)}&view=${view}`);
  };
  const onViewStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`orders?date=${date}&view=${e.target.value}`);
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
    navigate.push(`orders/${orderId}?date=${date}`);
  };

  const onDeleteClick = () => {
    if (selectedIds.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    batchDeleteOrders.mutate();
  };

  const onExcelDownloadClick = () => {
    if (orders.data?.data === undefined) return;

    const fileName = `${dayjs().format("YYYY-MM-DD")} 주문.xlsx`;
    const sheet = XlSX.utils.json_to_sheet(orders.data?.data);
    const book = XlSX.utils.book_new();
    XlSX.utils.book_append_sheet(book, sheet, "Sheet1");
    XlSX.writeFile(book, fileName);
  };

  return (
    <main className='p-3'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3 mb-3'>
        {/* 오늘 날짜로 재검색 */}
        <Link
          href={`/admin/orders?date=${dayjs().format("YYYY-MM-DD")}&view=${view}`}
          className='btn px-3 py-2'
        >
          <FaIcon icon={faCalendarDays} /> 오늘
        </Link>

        {/* 해당 날짜로 검색 */}
        <fieldset className='m-box'>
          <select className='btn shadow-none px-3 py-2' value={+year} onChange={onYearChange}>
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
          <span className='text-gray-200'>|</span>
          <select className='btn shadow-none px-3 py-2' value={+month} onChange={onMonthChange}>
            {new Array(12).fill(0).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}월
              </option>
            ))}
          </select>
          <span className='text-gray-200'>|</span>
          <select className='btn shadow-none px-3 py-2' value={+day} onChange={onDayChange}>
            {new Array(31).fill(0).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}일
              </option>
            ))}
          </select>
        </fieldset>

        {/* Refresh */}
        <button type='button' className='btn px-3 py-2' onClick={() => orders.refetch()}>
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
        <Link href='/admin/orders/create' className='btn px-3 py-2'>
          <FaIcon icon={faPlus} /> 송장 작성하기
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
        <table className='w-full orders-table-grid gap-1'>
          <thead className='contents'>
            <tr className='contents'>
              <th className={th`col-span-2 bg-orange-100`}>보내는 사람</th>
              <th className={th`col-span-3 bg-green-100`}>받는 사람</th>
              <th className={th`col-span-2 bg-blue-100`}>상품정보</th>
            </tr>
            <tr className='contents'>
              <th className={th`bg-orange-50`}>이름</th>
              <th className={th`bg-orange-50`}>전화번호</th>
              <th className={th`bg-green-50`}>이름</th>
              <th className={th`bg-green-50`}>전화번호</th>
              <th className={th`bg-green-50`}>주소</th>
              <th className={th`bg-blue-50`}>상품명</th>
              <th className={th`bg-blue-50`}>이니셜</th>
            </tr>
          </thead>
          <tbody className='contents'>
            {orders.data?.data.map((order) => (
              <tr
                key={order.id}
                className='contents cursor-pointer order-table__tr'
                onClick={onItemClick(order.id)}
                onDoubleClick={() => gotoItemPage(order.id)}
                onTouchEnd={() => gotoItemPage(order.id)}
                aria-selected={selectedIds.includes(order.id)}
              >
                <td className={td``}>{order.senderName}</td>
                <td className={td``}>{order.senderPhone}</td>
                <td className={td``}>{order.receiverName}</td>
                <td className={td``}>{order.receiverPhone}</td>
                <td className={td`text-start`}>
                  {order.receiverAddress}, {order.receiverAddressDetail}
                </td>
                <td className={td``}>{order.productName}</td>
                <td className={td``}>{order.initial}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {view === "card" ? (
        <div className='orders-card-grid gap-3'>
          {orders.data?.data?.map((item) => (
            <button
              key={item.id}
              className='btn p-2 bg-transparent aria-selected:bg-white aria-selected:bg-opacity-70 active:scale-90 text-start'
              aria-selected={selectedIds.includes(item.id)}
              onClick={onItemClick(item.id)}
              onDoubleClick={() => gotoItemPage(item.id)}
            >
              <p className='bg-orange-200 mb-2 p-2 rounded-md'>
                <b className='text-lg'>{item.senderName}</b> {item.senderPhone}
              </p>
              <p className='bg-green-200 mb-2 p-2 rounded-md'>
                <b className='text-lg'>{item.receiverName}</b>&nbsp;
                {item.receiverPhone} <br />
                {item.receiverAddress}, {item.receiverAddressDetail}
              </p>
              <p className='bg-blue-200 p-2 rounded-md'>
                <b className='text-lg'>{item.productName}</b>
                <br />
                {item.initial}
              </p>
            </button>
          ))}
        </div>
      ) : null}
    </main>
  );
}
