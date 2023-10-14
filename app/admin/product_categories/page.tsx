"use client";

import { useProductCategories } from "@/api/product_categories";
import { useDeleteProducts } from "@/api/products";
import { ImgIcon } from "@/components/ImgIcon";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import IcoExcel from "@/public/icons/excel.png";
import {
  faArrowsRotate,
  faBox,
  faPlus,
  faSignature,
  faSliders,
  faToggleOn,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const auth = useAuth();
  const excel = useExcel();
  const router = useRouter();
  const selected = useItemSelection();
  const productCategories = useProductCategories({
    enabled: auth.isSignIn,
  });
  const deleteItems = useDeleteProducts(selected.ids, {
    onSuccess: () => selected.clear(),
  });
  const onExcelDownloadClick = () => {
    excel.download(productCategories.data?.data!, "상품");
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
          <button type="button" className="dsy-btn" onClick={() => productCategories.refetch()}>
            <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
          </button>
        </li>
        <li>
          {/* Cratet New Order */}
          <Link href="product_categories/create" className="dsy-btn">
            <FontAwesomeIcon icon={faPlus} /> 카테고리 추가하기
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
      </ul>

      <div className="container m-auto overflow-x-auto p-4">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-tl-md bg-orange-100" colSpan={2}>
                <FontAwesomeIcon icon={faBox} /> 정보
              </th>
              <th className="rounded-tr-md bg-green-100" colSpan={1}>
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
              <th className="rounded-br-md bg-green-50">
                <FontAwesomeIcon icon={faToggleOn} /> 활성화
              </th>
            </tr>
          </thead>
          <tbody>
            {productCategories.data?.data.map((item) => (
              <tr
                key={item.id}
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => router.push(`product_categories/${item.id}`)}
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
                    <FontAwesomeIcon icon={faToggleOn} /> 활성화
                  </label>
                  <span>{item.enabled ? "O" : "X"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
