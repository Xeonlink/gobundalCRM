"use client";

import { RawTeam, Team, postTeam } from "@/api/teams";
import { toHyphenPhone } from "@/utils/utils";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamsCreatePage() {
  const navigate = useRouter();
  const queryClient = useQueryClient();

  const [team, setTeam] = useState<RawTeam>({
    leaderName: "",
    leaderPhone: "",
    coupon: "",
    population: 1,
  });

  const createTeam = useMutation({
    mutationFn: () => postTeam(team),
    onSuccess: () => {
      queryClient.invalidateQueries(["teams"]);
      navigate.push("/teams");
    },
  });

  const onLeaderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeam((prev) => ({ ...prev, leaderName: e.target.value }));
  };

  const onLeaderPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeam((prev) => ({ ...prev, leaderPhone: toHyphenPhone(e.target.value) }));
  };

  const onCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeam((prev) => ({ ...prev, coupon: e.target.value }));
  };

  const onPopulationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") return setTeam((prev) => ({ ...prev, population: 0 }));
    const newPopulation = parseInt(e.target.value);
    if (!newPopulation) return;
    setTeam((prev) => ({ ...prev, population: newPopulation }));
  };

  const onSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (team.leaderName === "") return alert("이름을 입력해주세요.");
    if (team.leaderPhone === "") return alert("핸드폰 번호를 입력해주세요.");
    if (team.coupon === "") return alert("쿠폰사를 입력해주세요.");
    if (team.population === 0) return alert("인원수를 입력해주세요.");
    createTeam.mutate();
  };

  return (
    <main>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <Link
          href='.'
          replace
          className='bg-white h-9 rounded-md shadow-md p-2 flex items-center hover:-translate-y-1 transition-all duration-300'
        >
          <FontAwesomeIcon icon={faArrowLeft} width={22} height={22} className='mr-1' />
          <span>뒤로가기</span>
        </Link>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Save */}
        <button
          className='bg-white h-9 rounded-md shadow-md p-2 flex items-center hover:-translate-y-1 transition-all duration-300'
          onClick={onSaveClick}
        >
          <FontAwesomeIcon icon={faFloppyDisk} width={22} height={22} className='mr-1' />
          <span>저장</span>
        </button>
      </div>

      {/* Form */}
      <div className='w-96 max-w-full m-auto flex flex-col items-start shadow-2xl p-3 rounded-md'>
        <label htmlFor='leaderName' className='bg-white rounded-md shadow-md px-3 py-1 mb-1'>
          이름
        </label>
        <input
          id='leaderName'
          type='text'
          value={team.leaderName}
          onChange={onLeaderNameChange}
          placeholder='홍길동'
          className='bg-white rounded-md shadow-md px-3 py-1 mb-3 w-full'
        />

        <label htmlFor='leaderPhone' className='bg-white rounded-md shadow-md px-3 py-1 mb-1'>
          전화번호
        </label>
        <input
          id='leaderPhone'
          type='text'
          value={team.leaderPhone}
          onChange={onLeaderPhoneChange}
          placeholder='010-xxxx-xxxx'
          className='bg-white rounded-md shadow-md px-3 py-1 mb-3 w-full'
        />

        <label htmlFor='coupon' className='bg-white rounded-md shadow-md px-3 py-1 mb-1'>
          쿠폰사
        </label>
        <input
          id='coupon'
          type='text'
          value={team.coupon}
          onChange={onCouponChange}
          placeholder='쿠폰사'
          className='bg-white rounded-md shadow-md px-3 py-1 mb-3 w-full'
        />

        <label htmlFor='population' className='bg-white rounded-md shadow-md px-3 py-1 mb-1'>
          인원수
        </label>
        <input
          id='population'
          type='number'
          value={team.population}
          onChange={onPopulationChange}
          placeholder='인원수'
          className='bg-white rounded-md shadow-md px-3 py-1 w-full'
        />
      </div>
    </main>
  );
}
