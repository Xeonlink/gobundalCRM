import { DownloadExcel } from "@/components/DownloadExcel";
import { ImgIcon } from "@/components/ImgIcon";
import { Refresh } from "@/components/Navigate/Refresh";
import IcoExcel from "@/public/icons/excel.png";
import {
  faArrowsRotate,
  faBox,
  faCalculator,
  faPen,
  faPersonRunning,
  faPlus,
  faQuoteLeft,
  faSignature,
  faSliders,
  faToggleOn,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { deleteProductCategory, getProductCategories } from "./actions";

export default async function Page() {
  const productCategories = await getProductCategories();

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
        <li>
          {/* Refresh */}
          <Refresh className="dsy-btn-ghost dsy-btn">
            <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
          </Refresh>
        </li>

        <li>
          {/* Create New Order */}
          <Link href="product_categories/create" className="dsy-btn-ghost dsy-btn">
            <FontAwesomeIcon icon={faPlus} /> 카테고리 추가하기
          </Link>
        </li>

        <li>
          {/* 엑셀로 다운로드하기 */}
          <DownloadExcel
            data={productCategories}
            filename="상품카테고리"
            className="dsy-btn-ghost dsy-btn"
          >
            <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={16} /> 엑셀로 변환
          </DownloadExcel>
        </li>
      </ul>

      <div className="container m-auto overflow-x-auto p-4">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-tl-md bg-orange-100" colSpan={2}>
                <FontAwesomeIcon icon={faBox} /> 정보
              </th>
              <th className="rounded-tr-md bg-green-100" colSpan={3}>
                <FontAwesomeIcon icon={faSliders} /> 상태
              </th>
            </tr>
            <tr>
              <th className="bg-orange-50">
                <FontAwesomeIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-orange-50">
                <FontAwesomeIcon icon={faQuoteLeft} /> 설명
              </th>
              <th className="bg-green-50">
                <FontAwesomeIcon icon={faCalculator} /> 상품수
              </th>
              <th className="rounded-br-md bg-green-50">
                <FontAwesomeIcon icon={faToggleOn} /> 활성화
              </th>
              <th className="rounded-br-md bg-green-50">
                <FontAwesomeIcon icon={faPersonRunning} /> 액션
              </th>
            </tr>
          </thead>
          <tbody>
            {productCategories.map((item) => (
              <tr key={item.id}>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faSignature} /> 이름
                  </label>
                  <span>{item.name}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faQuoteLeft} /> 설명
                  </label>
                  <span>{item.description}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faCalculator} /> 상품수
                  </label>
                  <span>{item.products.length.toLocaleString()}개</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faToggleOn} /> 활성화
                  </label>
                  <span>{item.enabled ? "O" : "X"}</span>
                </td>
                {item.name === "기본" ? (
                  <td></td>
                ) : (
                  <td className="right-2 top-1 space-x-1 max-sm:absolute">
                    <Link href={`product_categories/${item.id}`} className="dsy-btn dsy-btn-sm">
                      <FontAwesomeIcon icon={faPen} />
                    </Link>
                    <button
                      className="dsy-btn dsy-btn-sm"
                      formAction={deleteProductCategory.bind(null, +item.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
