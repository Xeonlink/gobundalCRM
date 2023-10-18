"use client";

import { useDeleteOrders, useOrders } from "@/api/orders";
import { OrderDialog } from "@/components/Dialogs/OrderDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { Input } from "@/components/Input";
import { useModal } from "@/extra/modal";
import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import IcoExcel from "@/public/icons/excel.png";
import {
  faArrowsRotate,
  faBox,
  faBoxes,
  faMobileScreen,
  faNoteSticky,
  faPaperPlane,
  faPlus,
  faRobot,
  faSignature,
  faSignsPost,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchParams = { date: `${string}-${string}-${string}` };

export default function Page(props: PageProps<{}, SearchParams>) {
  const { date = dayjs().format("YYYY-MM-DD") } = props.searchParams;

  const auth = useAuth();
  const excel = useExcel();
  const router = useRouter();
  const selected = useItemSelection();
  const orders = useOrders(date, {
    enabled: auth.isSignIn,
  });
  const eraseOrders = useDeleteOrders(selected.ids, {
    onSuccess: () => selected.clear(),
  });

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.replace(`orders?date=${e.target.value}`);
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
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
        <li className="mr-2">
          <Input
            type="date"
            value={date}
            onChange={onDateChange}
            max={dayjs().format("YYYY-MM-DD")}
            className="dsy-input-sm"
          />
        </li>

        <li>
          {/* Refresh */}
          <button type="button" className="dsy-btn" onClick={() => orders.refetch()}>
            <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
          </button>
        </li>

        <li>
          {/* Cratet New Order */}
          <Link href="orders/create" className="dsy-btn">
            <FontAwesomeIcon icon={faPlus} /> 주문입력
          </Link>
        </li>

        <li>
          {/* Delete */}
          <button type="button" className="dsy-btn" onClick={onDeleteClick}>
            <FontAwesomeIcon icon={faTrashCan} /> 선택삭제
          </button>
        </li>

        <li>
          {/* 엑셀로 다운로드하기 */}
          <button type="button" className="dsy-btn" onClick={onDownloadClick}>
            <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={16} /> 엑셀로 변환
          </button>
        </li>

        <li>
          {/* Go To Kiosk */}
          <Link href="/kiosk/orders" className="dsy-btn">
            <FontAwesomeIcon icon={faRobot} /> 키오스크로
          </Link>
        </li>
      </ul>

      <div className="container m-auto overflow-x-auto p-4">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-tl-md bg-orange-100" colSpan={3}>
                <FontAwesomeIcon icon={faPaperPlane} /> 보내는 사람
              </th>
              <th className="bg-green-100" colSpan={3}>
                <FontAwesomeIcon icon={faPaperPlane} rotation={90} /> 받는 사람
              </th>
              <th className="rounded-tr-md bg-blue-100" colSpan={2}>
                <FontAwesomeIcon icon={faBoxes} /> 상품정보
              </th>
            </tr>
            <tr>
              <th className="rounded-bl-md bg-orange-50">
                <input type="checkbox" name="" id="" className="dsy-checkbox dsy-checkbox-xs" />
              </th>
              <th className="bg-orange-50">
                <FontAwesomeIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-orange-50">
                <FontAwesomeIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="bg-green-50">
                <FontAwesomeIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-green-50">
                <FontAwesomeIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="bg-green-50">
                <FontAwesomeIcon icon={faSignsPost} /> 주소
              </th>
              <th className="bg-blue-50">
                <FontAwesomeIcon icon={faBox} /> 상품명
              </th>
              <th className="rounded-br-md bg-blue-50">
                <FontAwesomeIcon icon={faNoteSticky} /> 메모
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.data?.data.map((item) => (
              <tr
                key={item.id}
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => router.push(`orders/${item.id}`)}
              >
                <td className="max-sm:absolute max-sm:right-3 max-sm:top-3">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className="dsy-checkbox dsy-checkbox-xs"
                    checked={selected.ids.includes(item.id)}
                    onChange={() => {}}
                  />
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faSignature} /> 이름
                  </label>
                  <span>{item.senderName}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faMobileScreen} /> 전화번호
                  </label>
                  <span>{item.senderPhone}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faSignature} /> 이름
                  </label>
                  <span>{item.receiverName}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faMobileScreen} /> 전화번호
                  </label>
                  <span>{item.receiverPhone}</span>
                </td>
                <td className="text-start">
                  <label>
                    <FontAwesomeIcon icon={faSignsPost} /> 주소
                  </label>
                  <span>
                    {item.receiverAddress.replace(/^[^\s]+\s/, "")}, {item.receiverAddressDetail}
                  </span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faBox} /> 상품명
                  </label>
                  <span>{item.products[0].name}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faNoteSticky} /> 메모
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
