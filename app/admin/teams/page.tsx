"use client";

import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowsRotate,
  faCirclePlus,
  faPeopleGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import dayjs from "dayjs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTeams } from "@/api/teams";

export default function TeamsPage() {
  const [date, setDate] = useState(dayjs());
  const teams = useQuery({
    queryKey: ["teams", date.format("YYYY-MM-DD")],
    queryFn: () => getTeams(date.format("YYYY-MM-DD")),
  });

  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDate((prev) => dayjs(prev).year(Number(e.target.value)));
  };

  const onMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDate((prev) => dayjs(prev).month(Number(e.target.value)));
  };

  const onDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDate((prev) => dayjs(prev).date(Number(e.target.value)));
  };

  const onTodayClick = () => {
    setDate(dayjs());
  };

  return (
    <main>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3 mb-3'>
        {/* 오늘 날짜로 재검색 */}
        <button className='bg-white rounded-md shadow-md m-hover px-3 py-2' onClick={onTodayClick}>
          <FontAwesomeIcon
            icon={faCalendarDays}
            width={20}
            height={20}
            className='mr-1 opacity-75'
          />
          <span>오늘</span>
        </button>

        {/* 해당 날짜로 검색 */}
        <div className='bg-white rounded-md shadow-md'>
          <select
            className='bg-white rounded-md m-hover inline-flex items-center px-2 marker:gone text-center px-3 py-2'
            value={date.year()}
            onChange={onYearChange}
          >
            <option value={2023}>2023년</option>
            <option value={2024}>2024년</option>
            <option value={2025}>2025년</option>
          </select>
          <span className='text-gray-200'>|</span>
          <select
            className='bg-white rounded-md m-hover inline-flex items-center px-2 marker:gone text-center px-3 py-2'
            defaultValue={date.month()}
            onChange={onMonthChange}
          >
            {new Array(12).fill(0).map((_, index) => (
              <option key={index} value={index}>
                {index + 1}월
              </option>
            ))}
          </select>
          <span className='text-gray-200'>|</span>
          <select
            className='bg-white rounded-md m-hover inline-flex items-center px-2 marker:gone text-center px-3 py-2'
            value={date.date()}
            onChange={onDateChange}
          >
            {new Array(31).fill(0).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}일
              </option>
            ))}
          </select>
        </div>

        {/* Refresh */}
        <button
          className='bg-white rounded-md shadow-md m-hover px-3 py-2'
          onClick={() => teams.refetch()}
        >
          <FontAwesomeIcon icon={faArrowsRotate} width={17} height={17} className='mr-1' />
          <span>새로고침</span>
        </button>

        {/* Cratet New Team */}
        <Link href='teams/create' className='bg-white rounded-md shadow-md m-hover px-3 py-2'>
          <FontAwesomeIcon icon={faPlus} width={24} height={24} />
          <span>팀 만들기</span>
        </Link>
      </div>

      <div className='teams-grid gap-3'>
        {teams.data?.data.map((team) => (
          <Link
            key={team.id}
            href={`teams/${team.id}?date=${date.format("YYYY-MM-DD")}`}
            className='bg-white rounded-md shadow-md m-hover p-4 gapx-3 py-2'
          >
            <ol className='flex items-center gapx-3 py-2 mb-3'>
              {team.isApproved ? (
                <li className='rounded-full bg-orange-200 w-3 h-3'></li>
              ) : (
                <li className='rounded-full bg-orange-500 w-3 h-3'></li>
              )}
              {team.isLeave ? (
                <li className='rounded-full bg-green-500 w-3 h-3'></li>
              ) : (
                <li className='rounded-full bg-green-200 w-3 h-3'></li>
              )}
            </ol>
            <div className='text-2xl font-bold mb-1'>{team.leaderName}</div>
            <div className='mb-1'>{team.leaderPhone}</div>
            <div className='mb-1'>{team.coupon}</div>
            <div>{team.population}명</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
