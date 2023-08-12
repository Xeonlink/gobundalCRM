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

type SearchParams = { date: `${string}-${string}-${string}` };

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { date = dayjs().format("YYYY-MM-DD") } = searchParams;

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
    navigate.replace(`orders?date=${date}`);
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
        <Link href={`orders?date=${dayjs().format("YYYY-MM-DD")}`} className="btn">
          <FaIcon icon={faCalendarDays} /> 오늘
        </Link>

        {/* 해당 날짜로 검색 */}
        <DateChanger date={date} onChange={onDateChange} className="shadow-md" />

        {/* Refresh */}
        <button type="button" className="btn" onClick={() => orders.refetch()}>
          <FaIcon icon={faArrowsRotate} /> 새로고침
        </button>

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

      <div className="max-w-full overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-tl-md bg-orange-100" colSpan={3}>
                <FaIcon icon={faPaperPlane} /> 보내는 사람
              </th>
              <th className="bg-green-100" colSpan={3}>
                <FaIcon icon={faPaperPlane} rotation={90} /> 받는 사람
              </th>
              <th className="rounded-tr-md bg-blue-100" colSpan={2}>
                <FaIcon icon={faBoxes} /> 상품정보
              </th>
            </tr>
            <tr>
              <th className="rounded-bl-md bg-orange-50">
                <input type="checkbox" name="" id="" className="dsy-checkbox dsy-checkbox-xs" />
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="bg-green-50">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-green-50">
                <FaIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="bg-green-50">
                <FaIcon icon={faSignsPost} /> 주소
              </th>
              <th className="bg-blue-50">
                <FaIcon icon={faBox} /> 상품명
              </th>
              <th className="rounded-br-md bg-blue-50">
                <FaIcon icon={faNoteSticky} /> 메모
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.data?.data.map((item) => (
              <tr
                key={item.id}
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => openOrderUpdateDialog(item.id)}
                onTouchEnd={() => openOrderUpdateDialog(item.id)}
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
                  <span>{item.senderName}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faMobileScreen} /> 전화번호
                  </label>
                  <span>{item.senderPhone}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faSignature} /> 이름
                  </label>
                  <span>{item.receiverName}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faMobileScreen} /> 전화번호
                  </label>
                  <span>{item.receiverPhone}</span>
                </td>
                <td className="text-start">
                  <label>
                    <FaIcon icon={faSignsPost} /> 주소
                  </label>
                  <span>
                    {item.receiverAddress.replace(/^[^\s]+\s/, "")}, {item.receiverAddressDetail}
                  </span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faBox} /> 상품명
                  </label>
                  <span>{item.products[0].name}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faNoteSticky} /> 메모
                  </label>
                  <span>{item.memo}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
