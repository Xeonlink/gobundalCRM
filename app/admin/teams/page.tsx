"use client";

import { useDeleteTeams, useTeams } from "@/api/teams";
import { ImgIcon } from "@/components/ImgIcon";
import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import IcoExcel from "@/public/icons/excel.png";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faArrowsRotate, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as XlSX from "xlsx";

type SearchParams = {
  date: `${string}-${string}-${string}`;
  view: "card" | "table";
};

const th = (className: TemplateStringsArray) => {
  return `m-box py-1 shadow-none ${className.join(" ")}`;
};

const td = (className: TemplateStringsArray) => {
  return `text-center py-1 px-2 rounded-md aria-selected:bg-white aria-selected:bg-opacity-70 transition-all ${className.join(
    " "
  )}`;
};

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { date = dayjs().format("YYYY-MM-DD"), view = "table" } = searchParams;
  const [year, month, day] = date.split("-");

  useAuth();
  const navigate = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const teams = useTeams(date);
  const eraseTeams = useDeleteTeams(date, selectedIds, {
    onSuccess: () => setSelectedIds([]),
  });

  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`teams?date=${e.target.value}-${month}-${day}&view=${view}`);
  };
  const onMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`teams?date=${year}-${`0${e.target.value}`.slice(-2)}-${day}&view=${view}`);
  };
  const onDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`teams?date=${year}-${month}-${`0${e.target.value}`.slice(-2)}&view=${view}`);
  };
  const onViewStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate.replace(`teams?date=${date}&view=${e.target.value}`);
  };

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

  const gotoItemPage = (orderId: string) => {
    navigate.push(`teams/${orderId}?date=${date}`);
  };

  const onDeleteClick = () => {
    if (selectedIds.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    eraseTeams.mutate();
  };

  const onExcelDownloadClick = () => {
    if (teams.data?.data === undefined) return;

    const fileName = `${dayjs().format("YYYY-MM-DD")} 팀.xlsx`;
    const sheet = XlSX.utils.json_to_sheet(teams.data?.data);
    const book = XlSX.utils.book_new();
    XlSX.utils.book_append_sheet(book, sheet, "Sheet1");
    XlSX.writeFile(book, fileName);
  };

  return (
    <main className='p-3 h-full flex-1'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3 mb-3'>
        {/* 오늘 날짜로 재검색 */}
        <Link
          href={`teams?date=${dayjs().format("YYYY-MM-DD")}&view=${view}`}
          className='btn px-3 py-2'
        >
          <FaIcon icon={faCalendarDays} /> 오늘
        </Link>

        {/* 해당 날짜로 검색 */}
        <fieldset className='m-box'>
          <select className='btn shadow-none px-3 py-2' value={+year} onChange={onYearChange}>
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
          <span className='text-gray-200'>|</span>
          <select className='btn shadow-none px-3 py-2' value={+month} onChange={onMonthChange}>
            {new Array(12).fill(0).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}월
              </option>
            ))}
          </select>
          <span className='text-gray-200'>|</span>
          <select className='btn shadow-none px-3 py-2' value={+day} onChange={onDayChange}>
            {new Array(31).fill(0).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}일
              </option>
            ))}
          </select>
        </fieldset>

        {/* Refresh */}
        <button type='button' className='btn px-3 py-2' onClick={() => teams.refetch()}>
          <FaIcon icon={faArrowsRotate} /> 새로고침
        </button>

        {/* Change ViewStyle */}
        <select
          className='btn px-3 py-2 appearance-none text-center'
          value={view}
          onChange={onViewStyleChange}
        >
          <option value='table'>표로 보기</option>
          <option value='card'>카드로 보기</option>
        </select>

        {/* Cratet New Team */}
        <Link href='teams/create' className='btn px-3 py-2'>
          <FaIcon icon={faPlus} /> 팀 만들기
        </Link>

        {/* Delete */}
        <button type='button' className='btn px-3 py-2' onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type='button' className='btn px-3 py-2' onClick={onExcelDownloadClick}>
          <ImgIcon src={IcoExcel} alt='엑셀로 변환' fontSize={20} /> 엑셀로 변환
        </button>
      </div>

      {view === "table" ? (
        <table className='w-full teams-table-grid gap-1'>
          <thead className='contents'>
            <tr className='contents'>
              <th className={th`bg-orange-100 col-span-2`}>대표자</th>
              <th className={th`bg-green-100 col-span-4`}>정보</th>
            </tr>
            <tr className='contents'>
              <th className={th`bg-orange-50`}>이름</th>
              <th className={th`bg-orange-50`}>전화번호</th>
              <th className={th`bg-green-50`}>쿠폰사</th>
              <th className={th`bg-green-50`}>인원수</th>
              <th className={th`bg-green-50`}>쿠폰승인</th>
              <th className={th`bg-green-50`}>체험완료</th>
            </tr>
          </thead>
          <tbody className='contents'>
            {teams.data?.data.map((item) => (
              <tr
                key={item.id}
                className='contents cursor-pointer order-table__tr'
                onClick={onItemClick(item.id)}
                onDoubleClick={() => gotoItemPage(item.id)}
                onTouchEnd={() => gotoItemPage(item.id)}
                aria-selected={selectedIds.includes(item.id)}
              >
                <td className={td``}>{item.leaderName}</td>
                <td className={td``}>{item.leaderPhone}</td>
                <td className={td``}>{item.coupon}</td>
                <td className={td``}>{item.population}</td>
                <td className={td``}>
                  {item.isApproved ? (
                    <i className='inline-block rounded-full bg-orange-200 w-3 h-3' />
                  ) : (
                    <i className='inline-block rounded-full bg-orange-500 w-3 h-3' />
                  )}
                </td>
                <td className={td``}>
                  {item.isLeave ? (
                    <i className='inline-block rounded-full bg-green-200 w-3 h-3' />
                  ) : (
                    <i className='inline-block rounded-full bg-green-500 w-3 h-3' />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {view === "card" ? (
        <ol className='teams-card-grid gap-3'>
          {teams.data?.data.map((team) => (
            <li
              key={team.id}
              className='btn text-start p-3'
              aria-selected={selectedIds.includes(team.id)}
              onClick={onItemClick(team.id)}
              onDoubleClick={() => gotoItemPage(team.id)}
            >
              <ol className='flex items-center gap-1 py-2'>
                {team.isApproved ? (
                  <li className='rounded-full bg-orange-200 w-3 h-3' />
                ) : (
                  <li className='rounded-full bg-orange-500 w-3 h-3' />
                )}
                {team.isLeave ? (
                  <li className='rounded-full bg-green-200 w-3 h-3' />
                ) : (
                  <li className='rounded-full bg-green-500 w-3 h-3' />
                )}
              </ol>
              <b className='text-2xl '>{team.leaderName}</b>
              <br />
              {team.leaderPhone}
              <br />
              {team.coupon}
              <br />
              {team.population}명
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
