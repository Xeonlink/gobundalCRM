"use client";

import { Team, deleteTeam, getTeam, patchTeam } from "@/api/teams";
import { PageProps } from "@/extra/type";
import { toHyphenPhone } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faArrowLeft,
  faBuilding,
  faDoorClosed,
  faDoorOpen,
  faFloppyDisk,
  faMobileScreenButton,
  faNotdef,
  faPeopleGroup,
  faSignature,
  faThumbsDown,
  faThumbsUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function TeamsIdPage(props: PageProps) {
  const { params, searchParams } = props;

  const navigate = useRouter();
  const auth = useAuth({
    unAuthorized: () => navigate.push("/login"),
  });
  const queryClient = useQueryClient();
  const [changes, chnageActions] = useTypeSafeReducer({} as Partial<Team>, {
    onLeaderNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.leaderName = e.target.value;
    },
    onLeaderPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.leaderPhone = toHyphenPhone(e.target.value);
    },
    onCouponChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.coupon = e.target.value;
    },
    onPopulationChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "") return;
      const newPopulation = parseInt(e.target.value);
      if (!newPopulation) return;
      state.population = newPopulation;
    },
    toggleIsApproved: (state) => {
      state.isApproved = !state.isApproved;
    },
    toggleIsLeave: (state) => {
      state.isLeave = !state.isLeave;
    },
    reset: (state) => {
      return {};
    },
  });

  const team = useQuery({
    queryKey: ["teams", searchParams.date, params.id],
    queryFn: () => getTeam(searchParams.date, params.id),
    suspense: true,
    enabled: auth.isSignIn,
  });
  const updateTeam = useMutation({
    mutationFn: () => patchTeam(team?.data?.date!, team?.data?.id!, changes),
    onSuccess: () => {
      queryClient.invalidateQueries(["teams", team.data?.date]);
      navigate.back();
    },
  });
  const eraseTeam = useMutation({
    mutationFn: () => deleteTeam(team.data?.date!, team.data?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries(["teams", team.data?.date]);
      navigate.back();
    },
  });

  const finalTeam: Partial<Team> = {
    ...team.data,
    ...changes,
  };

  const validity = {
    leaderName: finalTeam.leaderName !== "",
    leaderPhone: finalTeam.leaderPhone !== "",
    coupon: finalTeam.coupon !== "",
    population: finalTeam.population !== 0,
  };
  const isValid = Object.values(validity).every((v) => v);

  const clearity = {
    leaderName: finalTeam.leaderName === team.data?.leaderName,
    leaderPhone: finalTeam.leaderPhone === team.data?.leaderPhone,
    coupon: finalTeam.coupon === team.data?.coupon,
    population: finalTeam.population === team.data?.population,
    isApproved: finalTeam.isApproved === team.data?.isApproved,
    isLeave: finalTeam.isLeave === team.data?.isLeave,
  };
  const isCleared = Object.values(clearity).every((v) => v);

  const isLoading = updateTeam.isLoading || eraseTeam.isLoading;

  return (
    <main className='p-3'>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <button className='btn px-3 py-2' onClick={navigate.back}>
          <FaIcon icon={faArrowLeft} /> 뒤로가기
        </button>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Clear */}
        <button
          type='button'
          className='btn px-3 py-2'
          disabled={isCleared}
          onClick={chnageActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} />
          &nbsp;초기화
        </button>

        {/* Delete */}
        <button className='btn px-3 py-2' onClick={() => eraseTeam.mutate()}>
          <FaIcon icon={faTrashCan} /> 삭제
        </button>

        {/* Update */}
        <button className='btn px-3 py-2' onClick={() => updateTeam.mutate()} disabled={isValid}>
          <FaIcon icon={faFloppyDisk} /> 저장
        </button>
      </div>

      {/* Form */}
      <form className='w-80 m-auto'>
        <fieldset className='shadow-md rounded-lg p-3 mb-6 relative'>
          <legend className='btn bg-transparent px-2 py-2'>
            <FaIcon icon={faPeopleGroup} fontSize={16} /> 팀 생성
          </legend>

          <div className='field'>
            <label htmlFor='leader-name' className='label'>
              <FaIcon icon={faSignature} /> 이름
            </label>
            <input
              id='leader-name'
              type='text'
              placeholder='홍길동'
              className='input'
              value={finalTeam.leaderName}
              onChange={chnageActions.onLeaderNameChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className='field'>
            <label htmlFor='leader-phone' className='label'>
              <FaIcon icon={faMobileScreenButton} /> 전화번호
            </label>
            <input
              id='leader-phone'
              type='tel'
              placeholder='010-xxxx-xxxx'
              className='input'
              value={finalTeam.leaderPhone}
              onChange={chnageActions.onLeaderPhoneChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className='field'>
            <label htmlFor='coupon' className='label'>
              <FaIcon icon={faBuilding} /> 쿠폰사
            </label>
            <input
              id='coupon'
              type='text'
              value={finalTeam.coupon}
              onChange={chnageActions.onCouponChange}
              disabled={isLoading}
              placeholder='쿠폰사'
              className='input'
              required
            />
          </div>

          <div className='field'>
            <label htmlFor='population' className='label'>
              <FaIcon icon={faPeopleGroup} /> 인원수
            </label>
            <input
              id='population'
              type='number'
              value={finalTeam.population}
              onChange={chnageActions.onPopulationChange}
              disabled={isLoading}
              placeholder='인원수'
              className='input'
            />
          </div>

          <div className='field'>
            <label htmlFor='is-approved' className='label'>
              <FaIcon icon={finalTeam.isApproved ? faThumbsUp : faThumbsDown} /> 쿠폰이
              승인되었습니까?
            </label>
            <div className='flex gap-3 aria-disabled:opacity-40 m-auto' aria-disabled={isLoading}>
              <button
                type='button'
                className='btn w-full shadow-none p-2'
                disabled={finalTeam.isApproved}
                onClick={chnageActions.toggleIsApproved}
              >
                <FaIcon icon={faThumbsUp} /> 승인완료
              </button>
              <button
                type='button'
                className='btn w-full shadow-none p-2'
                disabled={!finalTeam.isApproved}
                onClick={chnageActions.toggleIsApproved}
              >
                <FaIcon icon={faThumbsDown} /> 승인대기
              </button>
            </div>
          </div>

          <div className='field'>
            <label htmlFor='is-approved' className='label'>
              <FaIcon icon={finalTeam.isLeave ? faDoorOpen : faDoorClosed} /> 손님이 체험장을
              나갔습니까?
            </label>
            <div className='flex gap-3 aria-disabled:opacity-40 m-auto' aria-disabled={isLoading}>
              <button
                type='button'
                className='btn w-full shadow-none p-2'
                disabled={finalTeam.isLeave}
                onClick={chnageActions.toggleIsLeave}
              >
                <FaIcon icon={faDoorOpen} /> 나갔음
              </button>
              <button
                type='button'
                className='btn w-full shadow-none p-2'
                disabled={!finalTeam.isLeave}
                onClick={chnageActions.toggleIsLeave}
              >
                <FaIcon icon={faDoorClosed} /> 나가지 않음
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </main>
  );
}
