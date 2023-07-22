"use client";

import { Order, deleteOrders, getOrders } from "@/api/orders";
import { IcoButton } from "@/components/IcoButton";
import { PageProps } from "@/extra/type";
import IcoExcel from "@/public/icons/excel.png";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faArrowsRotate, faPlus, faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import Image from "next/image";
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

export default function OrdersPage(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { date = dayjs().format("YYYY-MM-DD"), view = "table" } = searchParams;
  const [year, month, day] = date.split("-");

  const navigate = useRouter();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const orders = useQuery({
    queryKey: ["orders", date],
    queryFn: () => getOrders(date),
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

  const gotoOrderPage = (orderId: string) => {
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
          href={`orders?date=${dayjs().format("YYYY-MM-DD")}&view=${view}`}
          className='btn px-3 py-2'
        >
          <FontAwesomeIcon icon={faCalendarDays} width={20} height={20} className='mr-1' />
          <span>오늘</span>
        </Link>

        {/* 해당 날짜로 검색 */}
        <fieldset className='m-box'>
          <select
            className='bg-white rounded-md m-hover text-center appearance-none px-3 py-2'
            value={+year}
            onChange={onYearChange}
          >
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
          <span className='text-gray-200'>|</span>
          <select
            className='bg-white rounded-md m-hover text-center appearance-none px-3 py-2'
            value={+month}
            onChange={onMonthChange}
          >
            {new Array(12).fill(0).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}월
              </option>
            ))}
          </select>
          <span className='text-gray-200'>|</span>
          <select
            className='bg-white rounded-md m-hover text-center appearance-none px-3 py-2'
            value={+day}
            onChange={onDayChange}
          >
            {new Array(31).fill(0).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}일
              </option>
            ))}
          </select>
        </fieldset>

        {/* Refresh */}
        <button type='button' className='btn px-3 py-2' onClick={() => orders.refetch()}>
          <FontAwesomeIcon icon={faArrowsRotate} width={17} height={17} className='mr-1' />
          <span>새로고침</span>
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
        <Link href='orders/create' className='btn px-3 py-2'>
          <FontAwesomeIcon icon={faPlus} width={24} height={24} className='mr-1' />
          <span>송장 작성하기</span>
        </Link>

        {/* Delete */}
        <button type='button' className='btn px-3 py-2' onClick={onDeleteClick}>
          <FontAwesomeIcon icon={faTrashCan} width={22} height={22} className='mr-1' />
          <span>선택삭제</span>
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type='button' className='btn px-3 py-2' onClick={onExcelDownloadClick}>
          <Image
            src={IcoExcel}
            alt='excel_icon'
            width={21}
            height={21}
            className='inline-block align-text-bottom mr-2'
          />
          <span>엑셀로 변환</span>
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
            {orders.isLoading ? (
              <tr className='contents'>
                <td className='grid-cols-7'>
                  <LoadingSpinner />
                </td>
              </tr>
            ) : (
              orders.data?.data.map((order) => (
                <OrderTableRaw
                  key={order.id}
                  order={order}
                  isSelected={selectedIds.includes(order.id)}
                  onClick={onItemClick(order.id)}
                  onDoubleClick={() => gotoOrderPage(order.id)}
                />
              ))
            )}
          </tbody>
        </table>
      ) : null}

      {view === "card" ? (
        <ol className='orders-card-grid gap-3'>
          {orders.isLoading ? (
            <LoadingSpinner />
          ) : (
            orders.data?.data?.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={selectedIds.includes(order.id)}
                onClick={onItemClick(order.id)}
                onDoubleClick={() => gotoOrderPage(order.id)}
              />
            ))
          )}
        </ol>
      ) : null}
    </main>
  );
}

function LoadingSpinner() {
  return (
    <div className='text-center h-10'>
      <FontAwesomeIcon
        icon={faSpinner}
        width={30}
        height={30}
        className='animate-spin inline-block'
      />
      {/* 로딩중... */}
    </div>
  );
}

type OrderItemProps = {
  order: Order;
  isSelected: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  onDoubleClick: (e: React.MouseEvent<HTMLElement>) => void;
};

function OrderCard(props: OrderItemProps) {
  const { order, isSelected, onClick, onDoubleClick } = props;
  return (
    <li
      key={order.id}
      className='m-box m-hover overflow-hidden p-2 bg-transparent aria-selected:bg-white aria-selected:bg-opacity-70'
      aria-selected={isSelected}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className='bg-orange-200 mb-2 p-2 rounded-md'>
        <span className='text-lg font-bold'>{order.senderName}</span>
        &nbsp;
        <span>{order.senderPhone}</span>
      </div>
      {/* <div className='saperator border-b-2 my-2 border-white'></div> */}
      <div className='bg-green-200 mb-2 p-2 rounded-md'>
        <span className='text-lg font-bold'>{order.receiverName}</span>
        &nbsp;
        <span>{order.receiverPhone}</span>
        <div>
          {order.receiverAddress}, {order.receiverAddressDetail}
        </div>
      </div>

      {/* <div className='saperator border-b-2 my-3'></div> */}
      <div className='bg-blue-200 p-2 rounded-md'>
        <div className='font-bold'>{order.productName}</div>
        <div>{order.initial}</div>
      </div>
    </li>
  );
}

function OrderTableRaw(props: OrderItemProps) {
  const { order, isSelected, onClick, onDoubleClick } = props;

  const td = (className: TemplateStringsArray) => {
    return `text-center py-1 px-2 rounded-md aria-selected:bg-white aria-selected:bg-opacity-70 ${className.join(
      " "
    )}`;
  };

  return (
    <tr
      key={order.id}
      className='contents cursor-pointer'
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <td className={td``} aria-selected={isSelected}>
        {order.senderName}
      </td>
      <td className={td``} aria-selected={isSelected}>
        {order.senderPhone}
      </td>
      <td className={td``} aria-selected={isSelected}>
        {order.receiverName}
      </td>
      <td className={td``} aria-selected={isSelected}>
        {order.receiverPhone}
      </td>
      <td className={td`text-start`} aria-selected={isSelected}>
        {order.receiverAddress}, {order.receiverAddressDetail}
      </td>
      <td className={td``} aria-selected={isSelected}>
        {order.productName}
      </td>
      <td className={td``} aria-selected={isSelected}>
        {order.initial}
      </td>
    </tr>
  );
}
