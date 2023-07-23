"use client";

import { getTeams } from "@/api/teams";
import { useModal } from "@/hooks/useModal";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faArrowsRotate, faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

export default function TeamsPage() {
  const [date, setDate] = useState(dayjs());
  const teams = useQuery({
    queryKey: ["teams", date.format("YYYY-MM-DD")],
    queryFn: () => getTeams(date.format("YYYY-MM-DD")),
    suspense: true,
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
    <main className='p-3'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-3 mb-3'>
        {/* 오늘 날짜로 재검색 */}
        <button className='btn px-3 py-2' onClick={onTodayClick}>
          <FaIcon icon={faCalendarDays} /> 오늘
        </button>

        {/* 해당 날짜로 검색 */}
        <div className='m-box'>
          <select
            className='bg-white rounded-md m-hover inline-flex items-center marker:gone text-center px-3 py-2 appearance-none'
            value={date.year()}
            onChange={onYearChange}
          >
            <option value={2023}>2023년</option>
            <option value={2024}>2024년</option>
            <option value={2025}>2025년</option>
          </select>
          <span className='text-gray-200'>|</span>
          <select
            className='bg-white rounded-md m-hover inline-flex items-center marker:gone text-center px-3 py-2 appearance-none'
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
            className='bg-white rounded-md m-hover inline-flex items-center marker:gone text-center px-3 py-2 appearance-none'
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
        <button className='btn px-3 py-2' onClick={() => teams.refetch()}>
          <FaIcon icon={faArrowsRotate} /> 새로고침
        </button>

        {/* Cratet New Team */}
        <Link href='teams/create' className='btn px-3 py-2'>
          <FaIcon icon={faPlus} /> 팀 만들기
        </Link>
      </div>

      <div className='teams-grid gap-3'>
        {teams.data?.data.map((team) => (
          <Link
            key={team.id}
            href={`teams/${team.id}?date=${date.format("YYYY-MM-DD")}`}
            className='btn text-start p-3'
          >
            <ol className='flex items-center gap-1 py-2'>
              <li
                className='rounded-full bg-orange-200 aria-disabled:bg-orange-500 w-3 h-3'
                aria-disabled={!team.isApproved}
              />
              <li
                className='rounded-full bg-green-200 aria-disabled:bg-green-500 w-3 h-3'
                aria-disabled={team.isLeave}
              />
            </ol>
            <b className='text-2xl '>{team.leaderName}</b>
            <br />
            {team.leaderPhone}
            <br />
            {team.coupon}
            <br />
            {team.population}명
          </Link>
        ))}
      </div>
    </main>
  );
}
