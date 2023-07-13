"use client";

import { Team, deleteTeam, getTeam, updateTeam } from "@/api/teams";
import { PageProps } from "@/extra/type";
import { toHyphenPhone } from "@/extra/utils";
import { faFloppyDisk, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useRef, useState } from "react";

export default function TeamsIdPage(props: PageProps) {
  const { params, searchParams } = props;

  const navigate = useRouter();
  const queryClient = useQueryClient();
  const [changes, setChanges] = useState<Partial<Team>>({});

  const team = useQuery({
    queryKey: ["teams", searchParams.date, params.id],
    queryFn: () => getTeam(searchParams.date, params.id),
  });

  const update = useMutation({
    mutationFn: () => updateTeam({ ...team.data!, ...changes }),
    onSuccess: () => {
      queryClient.invalidateQueries(["teams", team.data?.date]);
      navigate.replace("/teams");
    },
  });

  const deleteItem = useMutation({
    mutationFn: () => deleteTeam(team.data?.date!, team.data?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries(["teams", team.data?.date]);
      navigate.replace("/teams");
    },
  });

  const onSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTeam = { ...team.data, ...changes };
    if (newTeam.leaderName === "") return alert("이름을 입력해주세요.");
    if (newTeam.leaderPhone === "") return alert("핸드폰 번호를 입력해주세요.");
    if (newTeam.coupon === "") return alert("쿠폰사를 입력해주세요.");
    if (newTeam.population === 0) return alert("인원수를 입력해주세요.");
    update.mutate();
  };

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    deleteItem.mutate();
  };

  const onLeaderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChanges((prev) => ({ ...prev, leaderName: e.target.value }));
  };

  const onLeaderPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChanges((prev) => ({ ...prev, leaderPhone: toHyphenPhone(e.target.value) }));
  };

  const onCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChanges((prev) => ({ ...prev, coupon: e.target.value }));
  };

  const onPopulationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") return setChanges((prev) => ({ ...prev, population: 0 }));
    const newPopulation = parseInt(e.target.value);
    if (!newPopulation) return;
    setChanges((prev) => ({ ...prev, population: newPopulation }));
  };

  const onIsApprovedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChanges((prev) => ({ ...prev, isApproved: e.target.value === "true" }));
  };

  const onIsLeaveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChanges((prev) => ({ ...prev, isLeave: e.target.value === "true" }));
  };

  return (
    <main>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <Link
          href='.'
          className='bg-white h-9 rounded-md shadow-md p-2 flex items-center hover:-translate-y-1 transition-all duration-300'
        >
          <FontAwesomeIcon icon={faArrowLeft} width={22} height={22} className='mr-1' />
          <span>뒤로가기</span>
        </Link>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Delete */}
        <button
          className='bg-white h-9 rounded-md shadow-md p-2 flex items-center hover:-translate-y-1 transition-all duration-300'
          onClick={onDeleteClick}
        >
          <FontAwesomeIcon icon={faTrashCan} width={22} height={22} className='mr-1' />
          <span>삭제</span>
        </button>
        {/* Update */}
        <button
          className='bg-white h-9 rounded-md shadow-md p-2 flex items-center hover:-translate-y-1 transition-all duration-300'
          onClick={onSaveClick}
        >
          <FontAwesomeIcon icon={faFloppyDisk} width={22} height={22} className='mr-1' />
          <span>저장</span>
        </button>
      </div>

      {/* Form */}
      {team.isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className='w-96 max-w-full m-auto flex flex-col items-start shadow-2xl p-3 rounded-md'>
          <label htmlFor='leaderName' className='bg-white rounded-md shadow-md px-3 py-1 mb-1'>
            이름
          </label>
          <input
            id='leaderName'
            type='text'
            defaultValue={team.data?.leaderName}
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
            defaultValue={team.data?.leaderPhone}
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
            defaultValue={team.data?.coupon}
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
            defaultValue={team.data?.population}
            onChange={onPopulationChange}
            placeholder='인원수'
            className='bg-white rounded-md shadow-md px-3 py-1 mb-3 w-full'
          />

          <label htmlFor='isApproved' className='bg-white rounded-md shadow-md px-3 py-1 mb-1'>
            쿠폰승인
          </label>
          <select
            name='isApproved'
            id='isApproved'
            defaultValue={String(team.data?.isApproved)}
            onChange={onIsApprovedChange}
            className='bg-white rounded-md shadow-md px-3 py-1 mb-3 w-full'
          >
            <option value='true'>승인 됐음</option>
            <option value='false'>승안 안됐음</option>
          </select>

          <label htmlFor='isLeave' className='bg-white rounded-md shadow-md px-3 py-1 mb-1'>
            체험장 나감
          </label>
          <select
            name='isLeave'
            id='isLeave'
            defaultValue={String(team.data?.isLeave)}
            onChange={onIsLeaveChange}
            className='bg-white rounded-md shadow-md px-3 py-1 w-full'
          >
            <option value='true'>나갔음</option>
            <option value='false'>아직 안나갔음</option>
          </select>
        </div>
      )}
    </main>
  );
}
