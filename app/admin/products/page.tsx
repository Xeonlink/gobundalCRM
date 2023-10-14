"use client";

import { useDeleteProducts, useProducts } from "@/api/products";
import { ImgIcon } from "@/components/ImgIcon";
import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import IcoExcel from "@/public/icons/excel.png";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowsRotate,
  faBox,
  faBoxes,
  faCoins,
  faInfinity,
  faPlus,
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
import { useRouter } from "next/navigation";

type SearchParams = { view: "table" | "card" };

export default function Page(props: PageProps<{}, SearchParams>) {
  const { view = "table" } = props.searchParams;
  const auth = useAuth();
  const excel = useExcel();
  const router = useRouter();
  const selected = useItemSelection();
  const products = useProducts({
    enabled: auth.isSignIn,
  });
  const deleteItems = useDeleteProducts(selected.ids, {
    onSuccess: () => selected.clear(),
  });
  const openProductCategoryDialog = () => {
    if (!window?.document) return;
    const dialog = window.document.getElementById("product-category-dialog") as HTMLDialogElement;
    if (!dialog) return;
    dialog.showModal();
  };
  const onExcelDownloadClick = () => {
    excel.download(products.data?.data!, "상품");
  };
  const onDeleteClick = () => {
    if (selected.isEmpty) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    deleteItems.mutate();
  };

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap justify-center bg-base-200">
        <li>
          {/* Refresh */}
          <button type="button" className="dsy-btn" onClick={() => products.refetch()}>
            <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
          </button>
        </li>
        <li>
          {/* Cratet New Order */}
          <Link href="products/create" className="dsy-btn">
            <FontAwesomeIcon icon={faPlus} /> 상품 추가하기
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
          <button type="button" className="dsy-btn" onClick={onExcelDownloadClick}>
            <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={16} /> 엑셀로 변환
          </button>
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
                <th className="rounded-tl-md bg-orange-100" colSpan={6}>
                  <FontAwesomeIcon icon={faBox} /> 상품
                </th>
                <th className="rounded-tr-md bg-green-100" colSpan={2}>
                  <FontAwesomeIcon icon={faSliders} /> 상태
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
                <th className="rounded-br-md bg-green-50">
                  <FontAwesomeIcon icon={faToggleOn} /> 활성화
                </th>
              </tr>
            </thead>
            <tbody>
              {products.data?.data.map((item) => (
                <tr
                  key={item.id}
                  onClick={selected.onItemClick(item.id)}
                  onDoubleClick={() => router.push(`products/${item.id}`)}
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
                    <span>{item.name}</span>
                  </td>
                  <td>
                    <label>
                      <FontAwesomeIcon icon={faTableCellsLarge} /> 카테고리
                    </label>
                    <span>{item.category}</span>
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
                      {item.remain < 0 ? <FontAwesomeIcon icon={faInfinity} /> : item.remain}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* 상품 진열장 */}
      {view === "card" ? (
        <ol className="container m-auto grid grid-cols-[repeat(auto-fit,minmax(220px,max-content))] pt-4 max-sm:space-y-2 sm:gap-4 sm:p-4">
          {products?.data?.data.map((item) => (
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
