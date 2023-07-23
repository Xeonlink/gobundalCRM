"use client";

import { RawTeam, postTeam } from "@/api/teams";
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
  faSpinner,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const defaultTeam: RawTeam = {
  leaderName: "",
  leaderPhone: "",
  coupon: "",
  population: 1,
  isApproved: false,
  isLeave: false,
};

export default function TeamsCreatePage() {
  const navigate = useRouter();
  const path = usePathname();
  const auth = useAuth({
    unAuthorized: () => navigate.push(`/login?url=${path}`),
  });
  const queryClient = useQueryClient();

  const [team, teamActions] = useTypeSafeReducer(defaultTeam, {
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
      return defaultTeam;
    },
  });

  const createTeam = useMutation({
    mutationFn: () => postTeam(team),
    onSuccess: () => {
      queryClient.invalidateQueries(["teams"]);
      navigate.back();
    },
  });

  const validity = {
    leaderName: team.leaderName !== "",
    leaderPhone: team.leaderPhone !== "",
    coupon: team.coupon !== "",
    population: team.population !== 0,
  };
  const isValid = Object.values(validity).every((v) => v);

  const clearity = {
    leaderName: team.leaderName === defaultTeam.leaderName,
    leaderPhone: team.leaderPhone === defaultTeam.leaderPhone,
    coupon: team.coupon === defaultTeam.coupon,
    population: team.population === defaultTeam.population,
    isApproved: team.isApproved === defaultTeam.isApproved,
    isLeave: team.isLeave === defaultTeam.isLeave,
  };
  const isCleared = Object.values(clearity).every((v) => v);

  // useShortcut(
  //   "ctrl+s",
  //   (e) => {
  //     e.preventDefault();
  //     if (!isValid) return;
  //     createTeam.mutate();
  //   },
  //   [isValid]
  // );

  // useShortcut(
  //   "meta+s",
  //   (e) => {
  //     e.preventDefault();
  //     if (!isValid) return;
  //     createTeam.mutate();
  //   },
  //   [isValid]
  // );

  return (
    <main className='p-3'>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <Link href='.' replace className='btn px-3 py-2'>
          <FaIcon icon={faArrowLeft} /> 뒤로가기
        </Link>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Clear */}
        <button
          type='button'
          className='btn px-3 py-2'
          disabled={isCleared}
          onClick={teamActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} />
          &nbsp;초기화
        </button>

        {/* Save */}
        <button
          className='btn px-3 py-2'
          onClick={() => createTeam.mutate()}
          disabled={!isValid || createTeam.isLoading}
        >
          {createTeam.isLoading ? (
            <>
              <FaIcon icon={faSpinner} className='animate-spin' /> 저장중...
            </>
          ) : (
            <>
              <FaIcon icon={faFloppyDisk} /> 저장
            </>
          )}
        </button>
      </div>

      {/* Form */}
      <form className='w-80 m-auto'>
        <fieldset className='fieldset'>
          <legend className='btn bg-transparent p-2'>
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
              value={team.leaderName}
              onChange={teamActions.onLeaderNameChange}
              disabled={createTeam.isLoading}
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
              value={team.leaderPhone}
              onChange={teamActions.onLeaderPhoneChange}
              disabled={createTeam.isLoading}
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
              value={team.coupon}
              onChange={teamActions.onCouponChange}
              disabled={createTeam.isLoading}
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
              value={team.population}
              onChange={teamActions.onPopulationChange}
              disabled={createTeam.isLoading}
              placeholder='인원수'
              className='input'
            />
          </div>

          <div className='field'>
            <label htmlFor='is-approved' className='label'>
              <FaIcon icon={team.isApproved ? faThumbsUp : faThumbsDown} /> 쿠폰이 승인되었습니까?
            </label>
            <div
              className='flex gap-3 aria-disabled:opacity-40 m-auto'
              aria-disabled={createTeam.isLoading}
            >
              <button
                type='button'
                className='btn w-full shadow-none p-2'
                disabled={team.isApproved}
                onClick={teamActions.toggleIsApproved}
              >
                <FaIcon icon={faThumbsUp} /> 승인완료
              </button>
              <button
                type='button'
                className='btn w-full shadow-none p-2'
                disabled={!team.isApproved}
                onClick={teamActions.toggleIsApproved}
              >
                <FaIcon icon={faThumbsDown} /> 승인대기
              </button>
            </div>
          </div>

          <div className='field'>
            <label htmlFor='is-approved' className='label'>
              <FaIcon icon={team.isLeave ? faDoorOpen : faDoorClosed} /> 손님이 체험장을 나갔습니까?
            </label>
            <div
              className='flex gap-3 aria-disabled:opacity-40 m-auto'
              aria-disabled={createTeam.isLoading}
            >
              <button
                type='button'
                className='btn w-full shadow-none p-2'
                disabled={team.isLeave}
                onClick={teamActions.toggleIsLeave}
              >
                <FaIcon icon={faDoorOpen} /> 나갔음
              </button>
              <button
                type='button'
                className='btn w-full shadow-none p-2'
                disabled={!team.isLeave}
                onClick={teamActions.toggleIsLeave}
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
