"use client";

import { useCustomersByName, useDeleteCustomers } from "@/api/customers";
import { CustomerDialog } from "@/components/Dialogs/CustomerDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { cn } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import { useModal } from "@/extra/modal";
import IcoExcel from "@/public/icons/excel.png";
import {
  faArrowsRotate,
  faBuilding,
  faMagnifyingGlass,
  faMobileScreen,
  faPlus,
  faSignature,
  faSignsPost,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

type SearchParams = { name: string };

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { name = "" } = searchParams;

  const auth = useAuth();
  const excel = useExcel();
  const modalCtrl = useModal();
  const nameRef = useRef<HTMLInputElement>(null);
  const selected = useItemSelection();
  const items = useCustomersByName(name, {
    enabled: name !== "" && auth.isSignIn,
  });
  const deleteItems = useDeleteCustomers(selected.ids, {
    onSuccess: () => selected.clear(),
  });

  const openCustomerCreateDialog = () => {
    modalCtrl.open(<CustomerDialog mode="CREATE" />);
  };
  const openCustomerUpdateDialog = (customerId: string) => {
    modalCtrl.open(<CustomerDialog mode="UPDATE" customerId={customerId} />);
  };
  const onDeleteClick = () => {
    if (selected.ids.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    deleteItems.mutate();
  };
  const onExcelDownloadClick = () => {
    excel.download(items.data?.data!, "고객");
  };

  return (
    <main className="h-full flex-1 overflow-auto p-3">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {/* Cratet New Order */}
        <button type="button" className="btn" onClick={openCustomerCreateDialog}>
          <FaIcon icon={faPlus} /> 고객 추가하기
        </button>

        {/* Delete */}
        <button type="button" className="btn" onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type="button" className="btn" onClick={onExcelDownloadClick}>
          <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={20} /> 엑셀로 변환
        </button>

        <div className="space-x-3">
          {/* 고객이름으로 검색 */}
          <Input
            className="w-40 shadow-md"
            placeholder="홍길동"
            defaultValue={name}
            ref={nameRef}
          />

          {/* Search */}
          <Link href={`customers?name=${nameRef.current?.value}`} className="btn">
            <FaIcon icon={faMagnifyingGlass} /> 검색
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-l-md bg-orange-50">
                <input type="checkbox" name="" id="" className="dsy-checkbox dsy-checkbox-xs" />
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="bg-green-50">
                <FaIcon icon={faSignsPost} /> 주소
              </th>
              <th className="rounded-r-md bg-green-50">
                <FaIcon icon={faBuilding} /> 상세주소
              </th>
            </tr>
          </thead>
          <tbody>
            {items.data?.data.map((item) => (
              <tr
                key={item.id}
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => openCustomerUpdateDialog(item.id)}
                onTouchEnd={() => openCustomerUpdateDialog(item.id)}
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
                  <span>{item.name}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faMobileScreen} /> 전화번호
                  </label>
                  <span>{item.phone}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faSignsPost} /> 주소
                  </label>
                  <span>{item.address}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faBuilding} /> 상세주소
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
