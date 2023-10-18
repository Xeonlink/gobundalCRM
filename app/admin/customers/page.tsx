"use client";

import { useCustomersByName, useDeleteCustomers } from "@/api/customers";
import { ImgIcon } from "@/components/ImgIcon";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import IcoExcel from "@/public/icons/excel.png";
import {
  faArrowsRotate,
  faBuilding,
  faCheckCircle,
  faMagnifyingGlass,
  faMinusCircle,
  faMobileScreen,
  faPlus,
  faSignature,
  faSignsPost,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type SearchParams = { name: string };

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { name = "" } = searchParams;

  const auth = useAuth();
  const excel = useExcel();
  const router = useRouter();
  const selected = useItemSelection();
  const nameRef = useRef<HTMLInputElement>(null);
  const customers = useCustomersByName(name, {
    enabled: name !== "" && auth.isSignIn,
  });
  const deleteItems = useDeleteCustomers(selected.ids, {
    onSuccess: () => selected.clear(),
  });
  const onDeleteClick = () => {
    if (selected.ids.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    deleteItems.mutate();
  };
  const onDownloadClick = () => {
    excel.download(customers.data?.data!, "고객");
  };

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
        <li>
          {/* Refresh */}
          <button type="button" className="dsy-btn" onClick={() => customers.refetch()}>
            <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
          </button>
        </li>

        <li>
          {/* Cratet New Order */}
          <Link href="customers/create" className="dsy-btn">
            <FontAwesomeIcon icon={faPlus} /> 고객 추가하기
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

        <li className="space-x-3">
          {/* 고객이름으로 검색 */}
          <Input
            className="dsy-input-sm w-40"
            placeholder="홍길동"
            defaultValue={name}
            ref={nameRef}
          />

          {/* Search */}
          <Link href={`customers?name=${nameRef.current?.value}`} className="dsy-btn">
            <FontAwesomeIcon icon={faMagnifyingGlass} /> 검색
          </Link>
        </li>
      </ul>

      <div className="container m-auto overflow-x-auto p-4">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-tl-md bg-orange-100" colSpan={3}>
                <FontAwesomeIcon icon={faCheckCircle} /> 필수
              </th>
              <th className="rounded-tr-md bg-green-100" colSpan={2}>
                <FontAwesomeIcon icon={faMinusCircle} /> 선택
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
                <FontAwesomeIcon icon={faSignsPost} /> 주소
              </th>
              <th className="rounded-r-md bg-green-50">
                <FontAwesomeIcon icon={faBuilding} /> 상세주소
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.data?.data.map((item) => (
              <tr
                key={item.id}
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => router.push(`customers/${item.id}`)}
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
                    <FontAwesomeIcon icon={faMobileScreen} /> 전화번호
                  </label>
                  <span>{item.phone}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faSignsPost} /> 주소
                  </label>
                  <span>{item.address}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faBuilding} /> 상세주소
                  </label>
                  <span>{item.addressDetail}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
