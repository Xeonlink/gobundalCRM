"use client";

import { getOrders } from "@/api/orders";
import { useAuth } from "@/hooks/useAuth";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowsRotate,
  faCreditCard,
  faPlus,
  faSpinner,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";

type ViewStyle = "table" | "card";
type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;

export default function OrdersPage() {
  const auth = useAuth();
  auth.setKickDest("/login");

  const [viewStyle, setViewStyle] = useState<ViewStyle>("table");
  const [date, dateActions] = useTypeSafeReducer(
    dayjs(),
    {
      onYearChange: (state, e: SelectChangeEvent) => state.year(+e.target.value),
      onMonthChange: (state, e: SelectChangeEvent) => state.month(+e.target.value),
      onDateChange: (state, e: SelectChangeEvent) => state.date(+e.target.value),
      onTodayClick: (_) => dayjs(),
    },
    (date) => dayjs(date)
  );

  const orders = useQuery({
    queryKey: ["orders", date.format("YYYY-MM-DD")],
    queryFn: () => getOrders(date.format("YYYY-MM-DD")),
  });

  return (
    <main className='p-3'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3 mb-3'>
        {/* 오늘 날짜로 재검색 */}
        <button className='m-box m-hover px-3 py-2' onClick={dateActions.onTodayClick}>
          <FontAwesomeIcon
            icon={faCalendarDays}
            width={20}
            height={20}
            className='mr-1 opacity-75'
          />
          <span>오늘</span>
        </button>

        {/* 해당 날짜로 검색 */}
        <div className='m-box'>
          <select
            className='bg-white rounded-md m-hover inline-flex items-center marker:gone text-center px-3 py-2'
            value={date.year()}
            onChange={dateActions.onYearChange}
          >
            <option value={2023}>2023년</option>
            <option value={2024}>2024년</option>
            <option value={2025}>2025년</option>
          </select>
          <span className='text-gray-200'>|</span>
          <select
            className='bg-white rounded-md m-hover inline-flex items-center marker:gone text-center px-3 py-2'
            defaultValue={date.month()}
            onChange={dateActions.onMonthChange}
          >
            {new Array(12).fill(0).map((_, index) => (
              <option key={index} value={index}>
                {index + 1}월
              </option>
            ))}
          </select>
          <span className='text-gray-200'>|</span>
          <select
            className='bg-white rounded-md m-hover inline-flex items-center marker:gone text-center px-3 py-2'
            value={date.date()}
            onChange={dateActions.onDateChange}
          >
            {new Array(31).fill(0).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}일
              </option>
            ))}
          </select>
        </div>

        {/* Refresh */}
        <button type='button' className='m-box m-hover px-3 py-2' onClick={() => orders.refetch()}>
          <FontAwesomeIcon icon={faArrowsRotate} width={17} height={17} className='mr-1' />
          <span>새로고침</span>
        </button>

        {/* Change ViewStyle */}
        <select
          className='m-box m-hover px-3 py-2'
          defaultValue={viewStyle}
          onChange={(e) => setViewStyle(e.target.value as ViewStyle)}
        >
          <option value='table'>
            <FontAwesomeIcon icon={faTable} width={17} height={17} className='mr-1 inline-block' />
            <span>표로 보기</span>
          </option>
          <option value='card'>
            <FontAwesomeIcon
              icon={faCreditCard}
              width={17}
              height={17}
              className='mr-1 inline-block'
            />
            <span>카드로 보기</span>
          </option>
        </select>

        {/* Cratet New Order */}
        <Link href='orders/create' className='m-box m-hover px-3 py-2'>
          <FontAwesomeIcon icon={faPlus} width={24} height={24} />
          <span>송장 작성하기</span>
        </Link>
      </div>

      {viewStyle === "table" ? (
        <table className='w-full orders-table-grid gap-1'>
          <thead className='contents'>
            <tr className='contents'>
              <th className='col-span-2 m-box px-2 py-1 bg-orange-100'>보내는 사람</th>
              <th className='col-span-3 m-box px-2 py-1 bg-green-100'>받는 사람</th>
              <th className='col-span-2 m-box px-2 py-1 bg-blue-100'>상품정보</th>
            </tr>
            <tr className='contents'>
              <th className='m-box px-2 py-1 bg-orange-50'>이름</th>
              <th className='m-box px-2 py-1 bg-orange-50'>전화번호</th>
              <th className='m-box px-2 py-1 bg-green-50'>이름</th>
              <th className='m-box px-2 py-1 bg-green-50'>전화번호</th>
              <th className='m-box px-2 py-1 bg-green-50'>주소</th>
              <th className='m-box px-2 py-1 bg-blue-50'>상품명</th>
              <th className='m-box px-2 py-1 bg-blue-50'>이니셜</th>
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
                <tr key={order.id} className='contents'>
                  <td className='text-center m-box px-2 py-1 bg-transparent'>{order.senderName}</td>
                  <td className='text-center m-box px-2 py-1 bg-transparent'>
                    {order.senderPhone}
                  </td>
                  <td className='text-center m-box px-2 py-1 bg-transparent'>
                    {order.receiverName}
                  </td>
                  <td className='text-center m-box px-2 py-1 bg-transparent'>
                    {order.receiverPhone}
                  </td>
                  <td className='m-box px-2 py-1 bg-transparent'>
                    {order.receiverAddress}, {order.receiverAddressDetail}
                  </td>
                  <td className='text-center m-box px-2 py-1 bg-transparent'>
                    {order.productName}
                  </td>
                  <td className='text-center m-box px-2 py-1 bg-transparent'>{order.initial}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : null}

      {viewStyle === "card" ? (
        <div className='orders-card-grid gap-3'>
          {orders.isLoading ? (
            <LoadingSpinner />
          ) : (
            orders.data?.data?.map((order) => (
              <Link
                key={order.id}
                href={`order/${order.id}?date=${date.format("YYYY-MM-DD")}`}
                className='m-box m-hover overflow-hidden p-2 bg-white bg-opacity-40'
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
              </Link>
            ))
          )}
        </div>
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
