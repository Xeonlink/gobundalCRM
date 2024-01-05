import { DateChanger } from "@/components/DateChanger";
import { DownloadExcel } from "@/components/DownloadExcel";
import { ImgIcon } from "@/components/ImgIcon";
import { Refresh } from "@/components/Navigate/Refresh";
import { PageProps } from "@/extra/type";
import IcoExcel from "@/public/icons/excel.png";
import {
  faArrowsRotate,
  faBox,
  faBoxes,
  faMobileScreen,
  faNoteSticky,
  faPaperPlane,
  faPen,
  faPlus,
  faRobot,
  faRunning,
  faSignature,
  faSignsPost,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import { deleteOrder, getOrders } from "./actions";

type SearchParams = { date: `${string}-${string}-${string}` };

export default async function Page(props: PageProps<{}, SearchParams>) {
  const { date = dayjs().format("YYYY-MM-DD") } = props.searchParams;

  const orders = await getOrders(date);

  return (
    <main className="min-h-screen">
      <form>
        {/* Toolbar */}
        <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
          <li className="mr-2">
            <DateChanger />
          </li>

          <li>
            {/* Refresh */}
            <Refresh className="dsy-btn-ghost dsy-btn">
              <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
            </Refresh>
          </li>

          <li>
            {/* Create New Order */}
            <Link href="orders/create" className="dsy-btn-ghost dsy-btn">
              <FontAwesomeIcon icon={faPlus} /> 주문입력
            </Link>
          </li>

          <li>
            {/* 엑셀로 다운로드하기 */}
            <DownloadExcel data={orders} filename="주문" className="dsy-btn-ghost dsy-btn">
              <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={16} /> 엑셀로 변환
            </DownloadExcel>
          </li>

          <li>
            {/* Go To Kiosk */}
            <Link href="/kiosk/orders" className="dsy-btn-ghost dsy-btn">
              <FontAwesomeIcon icon={faRobot} /> 키오스크로
            </Link>
          </li>
        </ul>

        <div className="container m-auto overflow-x-auto p-4">
          <table className="table">
            <thead>
              <tr>
                <th className="rounded-tl-md bg-orange-100" colSpan={2}>
                  <FontAwesomeIcon icon={faPaperPlane} /> 보내는 사람
                </th>
                <th className="bg-green-100" colSpan={3}>
                  <FontAwesomeIcon icon={faPaperPlane} rotation={90} /> 받는 사람
                </th>
                <th className="rounded-tr-md bg-blue-100" colSpan={3}>
                  <FontAwesomeIcon icon={faBoxes} /> 상품정보
                </th>
              </tr>
              <tr>
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
                <th className="bg-blue-50">
                  <FontAwesomeIcon icon={faNoteSticky} /> 메모
                </th>
                <th className="rounded-br-md bg-blue-50">
                  <FontAwesomeIcon icon={faRunning} /> 액션
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => (
                <tr key={item.id}>
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
                  <td>
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
                    <span>
                      {`${item.products[0].name} (${item.products[0].quantity})`}
                      {item.products.length > 1 ? ` 외 ${item.products.length - 1}개` : ""}
                    </span>
                  </td>
                  <td>
                    <label>
                      <FontAwesomeIcon icon={faNoteSticky} /> 메모
                    </label>
                    <span>
                      {item.memo.slice(0, 6)}
                      {item.memo.length > 6 ? "..." : ""}
                    </span>
                  </td>
                  <td className="right-2 top-1 space-x-1 max-sm:absolute">
                    <Link href={`orders/${item.id}`} className="dsy-btn dsy-btn-sm">
                      <FontAwesomeIcon icon={faPen} />
                    </Link>
                    <button
                      className="dsy-btn dsy-btn-sm"
                      formAction={deleteOrder.bind(null, +item.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </main>
  );
}
