"use client";

import { useDeleteOrders, useOrders } from "@/api/orders";
import { DateChanger } from "@/components/DateChanger";
import { OrderDialog } from "@/components/Dialogs/OrderDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { PageProps } from "@/extra/type";
import { cn } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import { useModal } from "@/extra/modal";
import IcoExcel from "@/public/icons/excel.png";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowsRotate,
  faBox,
  faBoxes,
  faMobileScreen,
  faNoteSticky,
  faPaperPlane,
  faPlus,
  faSignature,
  faSignsPost,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type SearchParams = {
  date: `${string}-${string}-${string}`;
  view: "card" | "table";
};

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { date = dayjs().format("YYYY-MM-DD"), view = "table" } = searchParams;

  const navigate = useRouter();
  const excel = useExcel();
  const modalCtrl = useModal();
  const selected = useItemSelection();
  const auth = useAuth();
  const orders = useOrders(date, {
    enabled: auth.isSignIn,
  });
  const eraseOrders = useDeleteOrders(selected.ids, {
    onSuccess: () => selected.clear(),
  });
  const onDateChange = (date: string) => {
    navigate.replace(`orders?date=${date}&view=${view}`);
  };
  const onViewStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`orders?date=${date}&view=${e.target.value}`);
  };
  const openOrderCreateDialog = () => {
    modalCtrl.open(<OrderDialog mode="CREATE" />);
  };
  const openOrderUpdateDialog = (orderId: string) => {
    modalCtrl.open(<OrderDialog mode="UPDATE" orderId={orderId} />);
  };
  const onDeleteClick = () => {
    if (selected.ids.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    eraseOrders.mutate();
  };
  const onDownloadClick = () => {
    excel.download(orders.data?.data!, "주문목록");
  };

  return (
    <main className="h-full flex-1 overflow-auto p-3">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {/* 오늘 날짜로 재검색 */}
        <Link href={`orders?date=${dayjs().format("YYYY-MM-DD")}&view=${view}`} className="btn">
          <FaIcon icon={faCalendarDays} /> 오늘
        </Link>

        {/* 해당 날짜로 검색 */}
        <DateChanger date={date} onChange={onDateChange} className="shadow-md" />

        {/* Refresh */}
        <button type="button" className="btn" onClick={() => orders.refetch()}>
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
        <button type="button" className="btn" onClick={openOrderCreateDialog}>
          <FaIcon icon={faPlus} /> 송장 작성하기
        </button>

        {/* Delete */}
        <button type="button" className="btn" onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type="button" className="btn" onClick={onDownloadClick}>
          <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={20} /> 엑셀로 변환
        </button>
      </div>

      {view === "table" ? (
        <table className="grid w-full grid-cols-[repeat(7,_auto)] gap-1">
          <thead className="contents">
            <tr className="contents">
              <th className="th col-span-2 bg-orange-100">
                <FaIcon icon={faPaperPlane} /> 보내는 사람
              </th>
              <th className="th col-span-3 bg-green-100">
                <FaIcon icon={faPaperPlane} rotation={90} /> 받는 사람
              </th>
              <th className="th col-span-2 bg-blue-100">
                <FaIcon icon={faBoxes} /> 상품정보
              </th>
            </tr>
            <tr className="contents">
              <th className="th bg-orange-50">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="th bg-orange-50">
                <FaIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="th bg-green-50">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="th bg-green-50">
                <FaIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="th bg-green-50">
                <FaIcon icon={faSignsPost} /> 주소
              </th>
              <th className="th bg-blue-50">
                <FaIcon icon={faBox} /> 상품명
              </th>
              <th className="th bg-blue-50">
                <FaIcon icon={faNoteSticky} /> 메모
              </th>
            </tr>
          </thead>
          <tbody className="contents">
            {orders.data?.data.map((item) => (
              <tr
                key={item.id}
                className="tr_selected contents cursor-pointer"
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => openOrderUpdateDialog(item.id)}
                onTouchEnd={() => openOrderUpdateDialog(item.id)}
                aria-selected={selected.ids.includes(item.id)}
              >
                <td className="td">{item.senderName}</td>
                <td className="td">{item.senderPhone}</td>
                <td className="td">{item.receiverName}</td>
                <td className="td">{item.receiverPhone}</td>
                <td className="td text-start">
                  {item.receiverAddress}, {item.receiverAddressDetail}
                </td>
                <td className="td">{item.products[0].name}</td>
                <td className="td">{item.memo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {view === "card" ? (
        <ol className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] items-center gap-3">
          {orders.data?.data.map((item) => (
            <li
              key={item.id}
              className={cn("btn bg-transparent p-2 text-start active:scale-90", {
                "bg-white bg-opacity-70": selected.ids.includes(item.id),
              })}
              onClick={selected.onItemClick(item.id)}
              onDoubleClick={() => openOrderUpdateDialog(item.id)}
            >
              <p className="mb-2 rounded-md bg-orange-200 p-2">
                <b className="text-lg">{item.senderName}</b> {item.senderPhone}
              </p>
              <p className="mb-2 rounded-md bg-green-200 p-2">
                <b className="text-lg">{item.receiverName}</b>&nbsp;
                {item.receiverPhone} <br />
                {item.receiverAddress}, {item.receiverAddressDetail}
              </p>
              <p className="rounded-md bg-blue-200 p-2">
                <b className="text-lg">{item.products[0].name}</b>
                <br />
                {item.memo}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
