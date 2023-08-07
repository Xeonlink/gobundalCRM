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
import { useModal } from "@/hooks/useModal";
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

type SearchParams = {
  view: "card" | "table";
  name: string;
};

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { view = "table", name = "" } = searchParams;

  const auth = useAuth();
  const excel = useExcel();
  const modalCtrl = useModal();
  const navigate = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const selected = useItemSelection();
  const items = useCustomersByName(name, {
    enabled: name !== "" && auth.isSignIn,
  });
  const deleteItems = useDeleteCustomers(selected.ids, {
    onSuccess: () => selected.clear(),
  });

  const onViewStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`customers?view=${e.target.value}`);
  };
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
          <Link href={`customers?view=${view}&name=${nameRef.current?.value}`} className="btn">
            <FaIcon icon={faMagnifyingGlass} /> 검색
          </Link>
        </div>
      </div>

      {view === "table" ? (
        <table className="grid w-full grid-cols-[repeat(4,_auto)] gap-1">
          <thead className="contents">
            <tr className="contents">
              <th className="th bg-orange-50">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="th bg-orange-50">
                <FaIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="th bg-green-50">
                <FaIcon icon={faSignsPost} /> 주소
              </th>
              <th className="th bg-green-50">
                <FaIcon icon={faBuilding} /> 상세주소
              </th>
            </tr>
          </thead>
          <tbody className="contents">
            {items.data?.data.map((item) => (
              <tr
                key={item.id}
                className="tr_selected contents cursor-pointer"
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => openCustomerUpdateDialog(item.id)}
                onTouchEnd={() => openCustomerUpdateDialog(item.id)}
                aria-selected={selected.includes(item.id)}
              >
                <td className="td">{item.name}</td>
                <td className="td">{item.phone}</td>
                <td className="td">{item.address}</td>
                <td className="td">{item.addressDetail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {view === "card" ? (
        <ol className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] items-start gap-3">
          {items.data?.data.map((item) => (
            <li
              key={item.id}
              className={cn("btn bg-transparent p-2 text-start active:scale-90", {
                "bg-white bg-opacity-70": selected.includes(item.id),
              })}
              onClick={selected.onItemClick(item.id)}
              onDoubleClick={() => openCustomerUpdateDialog(item.id)}
            >
              <p className="mb-2 rounded-md bg-orange-200 p-2">
                <b className="text-lg">{item.name}</b> {item.phone}
              </p>
              <p className="mb-2 rounded-md bg-green-200 p-2">
                {item.address}, {item.addressDetail}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
