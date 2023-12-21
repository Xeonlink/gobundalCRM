import { DownloadExcel } from "@/components/DownloadExcel";
import { ImgIcon } from "@/components/ImgIcon";
import { Refresh } from "@/components/Navigate/Refresh";
import { PageProps } from "@/extra/type";
import IcoExcel from "@/public/icons/excel.png";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowsRotate,
  faBox,
  faBoxes,
  faCoins,
  faInfinity,
  faPen,
  faPlus,
  faRunning,
  faSignature,
  faSliders,
  faTableCellsLarge,
  faToggleOn,
  faTrashCan,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct, getProducts } from "./actions";

type SearchParams = { view: "table" | "card" };

export default async function Page(props: PageProps<{}, SearchParams>) {
  const { view = "table" } = props.searchParams;

  const products = await getProducts();

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
        <li>
          {/* Refresh */}
          <Refresh className="dsy-btn">
            <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
          </Refresh>
        </li>

        <li>
          {/* Create New Order */}
          <Link href="products/create" className="dsy-btn">
            <FontAwesomeIcon icon={faPlus} /> 상품 추가하기
          </Link>
        </li>

        <li>
          {/* 엑셀로 다운로드하기 */}
          <DownloadExcel data={products} filename="상품" className="dsy-btn">
            <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={16} /> 엑셀로 변환
          </DownloadExcel>
        </li>

        <li>
          {/* 보기 설정 */}
          {view === "table" ? (
            <Link href={{ query: { view: "card" } }} className="dsy-btn">
              <FontAwesomeIcon icon={faAddressCard} /> 카드로 보기
            </Link>
          ) : (
            <Link href={{ query: { view: "table" } }} className="dsy-btn">
              <FontAwesomeIcon icon={faTableCellsLarge} /> 표로 보기
            </Link>
          )}
        </li>
      </ul>

      {/* 상품테이블 */}
      {view === "table" ? (
        <div className="container m-auto overflow-x-auto p-4">
          <table className="table">
            <thead>
              <tr>
                <th className="rounded-tl-md bg-orange-100" colSpan={5}>
                  <FontAwesomeIcon icon={faBox} /> 상품
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
                  <FontAwesomeIcon icon={faTableCellsLarge} /> 카테고리
                </th>
                <th className="bg-orange-50">
                  <FontAwesomeIcon icon={faWon} /> 가격
                </th>
                <th className="bg-orange-50">
                  <FontAwesomeIcon icon={faWon} /> 할인가격
                </th>
                <th className="bg-orange-50">
                  <FontAwesomeIcon icon={faBoxes} /> 재고
                </th>
                <th className="bg-green-50">
                  <FontAwesomeIcon icon={faCoins} /> 할인중
                </th>
                <th className=" bg-green-50">
                  <FontAwesomeIcon icon={faToggleOn} /> 활성화
                </th>
                <th className="rounded-br-md bg-green-50">
                  <FontAwesomeIcon icon={faRunning} /> 액션
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>
                    <label>
                      <FontAwesomeIcon icon={faSignature} /> 이름
                    </label>
                    <span>{item.name}</span>
                  </td>
                  <td>
                    <label>
                      <FontAwesomeIcon icon={faTableCellsLarge} /> 카테고리
                    </label>
                    <span>{item.category.name}</span>
                  </td>
                  <td>
                    <label>
                      <FontAwesomeIcon icon={faWon} /> 가격
                    </label>
                    <span>{item.price.toLocaleString() + "원"}</span>
                  </td>
                  <td>
                    <label>
                      <FontAwesomeIcon icon={faWon} /> 할인가격
                    </label>
                    <span>{item.salePrice.toLocaleString() + "원"}</span>
                  </td>
                  <td>
                    <label>
                      <FontAwesomeIcon icon={faBoxes} /> 재고
                    </label>
                    <span>
                      {item.isRemainInfinite ? <FontAwesomeIcon icon={faInfinity} /> : item.remain}
                    </span>
                  </td>
                  <td>
                    <label>
                      <FontAwesomeIcon icon={faCoins} /> 할인중
                    </label>
                    <span>{item.isSale ? "O" : "X"}</span>
                  </td>
                  <td>
                    <label>
                      <FontAwesomeIcon icon={faToggleOn} /> 활성화
                    </label>
                    <span>{item.enabled ? "O" : "X"}</span>
                  </td>
                  <td className="right-2 top-1 space-x-1 max-sm:absolute">
                    <Link href={`products/${item.id}`} className="dsy-btn-sm dsy-btn">
                      <FontAwesomeIcon icon={faPen} />
                    </Link>
                    <button
                      className="dsy-btn-sm dsy-btn"
                      formAction={deleteProduct.bind(null, +item.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* 상품 진열장 */}
      {view === "card" ? (
        <ol className="container m-auto grid grid-cols-[repeat(auto-fit,minmax(220px,max-content))] pt-4 max-sm:space-y-2 sm:gap-4 sm:p-4">
          {products.map((item) => (
            <li
              key={item.id}
              className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-none bg-orange-100 bg-opacity-60 transition-all duration-300 max-sm:dsy-card-side sm:rounded-lg"
            >
              <Link href={`products/${item.id}`} className="contents">
                <figure>
                  <Image
                    src={item.images[0].src}
                    alt={item.name}
                    width={item.images[0].width || 450}
                    height={item.images[0].height || 300}
                    className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105 max-sm:w-40"
                  />
                </figure>
                <div className="dsy-card-body gap-0">
                  <span className="text-orange-500">무료배송</span>
                  <h2>{item.name}</h2>
                  <p className="min-w-max">
                    <span className="text-lg text-[#e63740]">
                      {item.isSale
                        ? Math.round((1 - item.salePrice / item.price) * 100) + "%"
                        : item.price === 0
                          ? "100%"
                          : ""}
                    </span>{" "}
                    <span className="text-xl font-bold">
                      {item.isSale
                        ? item.salePrice.toLocaleString()
                        : item.price === 0
                          ? "Free"
                          : item.price.toLocaleString()}
                    </span>
                    {item.price === 0 ? " " : "원 "}
                    <span className="text-[#999999] line-through max-sm:hidden">
                      {item.isSale && item.price.toLocaleString() + "원"}
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
