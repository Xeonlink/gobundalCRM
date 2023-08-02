"use client";

import { Team, useDeleteTeams, useTeams } from "@/api/teams";
import { DateChanger } from "@/components/DateChanger";
import { TeamDialog } from "@/components/Dialogs/TeamDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { PageProps } from "@/extra/type";
import { cn } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useModal } from "@/hooks/useModal";
import IcoExcel from "@/public/icons/excel.png";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faArrowsRotate, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchParams = {
  date: `${string}-${string}-${string}`;
  view: "card" | "table";
};

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { date = dayjs().format("YYYY-MM-DD"), view = "table" } = searchParams;

  useAuth();
  const navigate = useRouter();
  const modalCtrl = useModal();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const teams = useTeams(date);
  const excel = useExcel();
  const eraseTeams = useDeleteTeams(selectedIds, {
    onSuccess: () => setSelectedIds([]),
  });

  const onItemClick = (id: string) => (e: React.MouseEvent<HTMLElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (selectedIds.includes(id)) {
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      } else {
        setSelectedIds((prev) => [...prev, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  };
  const onDateChange = (date: string) => {
    navigate.replace(`teams?date=${date}&view=${view}`);
  };
  const onViewStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`teams?date=${date}&view=${e.target.value}`);
  };
  const openCreateTeamDialog = () => {
    modalCtrl.open(<TeamDialog mode='CREATE' />);
  };
  const openUpdateTeamDialog = (id: string) => {
    modalCtrl.open(<TeamDialog mode='UPDATE' teamId={id} />);
  };
  const onDeleteClick = () => {
    if (selectedIds.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    eraseTeams.mutate();
  };
  const onDownloadClick = () => {
    excel.download(teams.data?.data!, "팀");
  };

  return (
    <main className='p-3 h-full flex-1 overflow-auto'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3 mb-3'>
        {/* 오늘 날짜로 재검색 */}
        <Link href={`teams?date=${dayjs().format("YYYY-MM-DD")}&view=${view}`} className='btn'>
          <FaIcon icon={faCalendarDays} /> 오늘
        </Link>

        {/* 해당 날짜로 검색 */}
        <DateChanger className='shadow-md' date={date} onChange={onDateChange} />

        {/* Refresh */}
        <button type='button' className='btn' onClick={() => teams.refetch()}>
          <FaIcon icon={faArrowsRotate} /> 새로고침
        </button>

        {/* Change ViewStyle */}
        <select className='btn text-center' value={view} onChange={onViewStyleChange}>
          <option value='table'>표로 보기</option>
          <option value='card'>카드로 보기</option>
        </select>

        {/* Cratet New Team */}
        <button type='button' className='btn' onClick={openCreateTeamDialog}>
          <FaIcon icon={faPlus} /> 팀 만들기
        </button>

        {/* Delete */}
        <button type='button' className='btn' onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type='button' className='btn' onClick={onDownloadClick}>
          <ImgIcon src={IcoExcel} alt='엑셀로 변환' fontSize={20} /> 엑셀로 변환
        </button>
      </div>

      {view === "table" ? (
        <table className='w-full grid grid-cols-[repeat(6,_auto)] gap-1'>
          <thead className='contents'>
            <tr className='contents'>
              <th className='th bg-orange-100 col-span-2'>대표자</th>
              <th className='th bg-green-100 col-span-4'>정보</th>
            </tr>
            <tr className='contents'>
              <th className='th bg-orange-50'>이름</th>
              <th className='th bg-orange-50'>전화번호</th>
              <th className='th bg-green-50'>쿠폰사</th>
              <th className='th bg-green-50'>인원수</th>
              <th className='th bg-green-50'>쿠폰승인</th>
              <th className='th bg-green-50'>체험완료</th>
            </tr>
          </thead>
          <tbody className='contents'>
            {teams.data?.data.map((item) => (
              <tr
                key={item.id}
                className='contents cursor-pointer tr_selected'
                onClick={onItemClick(item.id)}
                onDoubleClick={() => openUpdateTeamDialog(item.id)}
                onTouchEnd={() => openUpdateTeamDialog(item.id)}
                aria-selected={selectedIds.includes(item.id)}
              >
                <td className='td'>{item.leaderName}</td>
                <td className='td'>{item.leaderPhone}</td>
                <td className='td'>{item.coupon}</td>
                <td className='td'>{item.population}</td>
                <td className='td'>{item.isApproved ? "O" : "X"}</td>
                <td className='td'>{item.isLeave ? "O" : "X"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {view === "card" ? (
        <ol className='grid grid-cols-[repeat(auto-fill,_minmax(170px,_1fr))] gap-3'>
          {teams.data?.data.map((item) => (
            <li
              key={item.id}
              className={cn("btn p-3 bg-opacity-50 active:scale-90 text-start", {
                "bg-opacity-100": selectedIds.includes(item.id),
              })}
              aria-selected={selectedIds.includes(item.id)}
              onClick={onItemClick(item.id)}
              onDoubleClick={() => openUpdateTeamDialog(item.id)}
            >
              <ol className='flex items-center gap-1 py-2'>
                {item.isApproved ? "O" : "X"}
                {item.isLeave ? "O" : "X"}
              </ol>
              <b className='text-2xl '>{item.leaderName}</b>
              <br />
              {item.leaderPhone}
              <br />
              {item.coupon}
              <br />
              {item.population}명
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
