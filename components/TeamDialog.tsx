"use client";

import { RawTeam, useCreateTeam, useTeam, useUpdateTeam } from "@/api/teams";
import { ModalProps } from "@/extra/type";
import { diff, toHyphenPhone } from "@/extra/utils";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBuilding,
  faCalendarAlt,
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
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { CheckBox } from "./CheckBox";
import { Input } from "./Input";
import dayjs from "dayjs";
import { DateChanger } from "./DateChanger";

const defaultTeam: RawTeam = {
  date: dayjs().format("YYYY-MM-DD"),
  leaderName: "",
  leaderPhone: "",
  coupon: "",
  population: 1,
  isApproved: false,
  isLeave: false,
};

type Props = ModalProps<
  | {
      mode: "CREATE";
    }
  | {
      mode: "UPDATE";
      teamId: string;
    }
>;

export function TeamDialog(props: Props) {
  const { mode } = props;

  const { data: originTeam } = useTeam(mode === "UPDATE" ? props.teamId : "", {
    enabled: mode === "UPDATE",
  });
  const [team, teamActions] = useTypeSafeReducer(originTeam || defaultTeam, {
    setDate: (state, date: string) => {
      state.date = date;
    },
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
      state.population = parseInt(e.target.value) || state.population;
    },
    toggleIsApproved: (state) => {
      state.isApproved = !state.isApproved;
    },
    toggleIsLeave: (state) => {
      state.isLeave = !state.isLeave;
    },
    reset: () => {
      return mode === "CREATE" ? defaultTeam : originTeam!;
    },
  });
  const createTeam = useCreateTeam(team, {
    onSuccess: () => props.closeSelf?.(),
  });
  const updateTeam = useUpdateTeam(originTeam?.id!, diff(originTeam!, team), {
    onSuccess: () => props.closeSelf?.(),
  });

  const validity = {
    leaderName: team.leaderName !== "",
    leaderPhone: team.leaderPhone !== "",
    coupon: team.coupon !== "",
    population: team.population !== 0,
  };
  const isValid = Object.values(validity).every((v) => v);
  const isCleared = mode === "CREATE" ? team === defaultTeam : originTeam === team;

  return (
    <dialog
      ref={props.ref}
      onClose={props.closeSelf}
      className='max-w-full max-h-full rounded-md p-0 w-96 bg-transparent backdrop:backdrop-blur-md animate-scaleTo1'
    >
      <fieldset className='fieldset bg-white bg-opacity-40 mb-2'>
        <legend className='legend bg-white bg-opacity-40'>
          <FaIcon icon={faPeopleGroup} fontSize={16} /> 팀 생성
        </legend>

        {/* 해당 날짜로 검색 */}
        <div className='field'>
          <label htmlFor='date' className='label'>
            <FaIcon icon={faCalendarAlt} /> 날짜
          </label>
          <DateChanger date={team.date} onChange={teamActions.setDate} />
        </div>

        <div className='field'>
          <label htmlFor='leader-name' className='label'>
            <FaIcon icon={faSignature} /> 이름
          </label>
          <Input
            id='leader-name'
            type='text'
            placeholder='홍길동'
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
          <Input
            id='leader-phone'
            type='tel'
            placeholder='010-xxxx-xxxx'
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
          <Input
            id='coupon'
            type='text'
            value={team.coupon}
            onChange={teamActions.onCouponChange}
            disabled={createTeam.isLoading}
            placeholder='쿠폰사'
            required
          />
        </div>

        <div className='field'>
          <label htmlFor='population' className='label'>
            <FaIcon icon={faPeopleGroup} /> 인원수
          </label>
          <Input
            id='population'
            type='number'
            value={team.population}
            onChange={teamActions.onPopulationChange}
            disabled={createTeam.isLoading}
            placeholder='인원수'
          />
        </div>

        <div className='field'>
          <label htmlFor='is-approved' className='label'>
            <FaIcon icon={team.isApproved ? faThumbsUp : faThumbsDown} /> 쿠폰이 승인되었습니까?
          </label>
          <CheckBox
            disable={createTeam.isLoading}
            checked={team.isApproved}
            toggleFn={teamActions.toggleIsApproved}
            trueElements={[<FaIcon icon={faThumbsUp} />, " 승인완료"]}
            falseElements={[<FaIcon icon={faThumbsDown} />, " 승인대기"]}
          />
        </div>

        <div className='field'>
          <label htmlFor='is-approved' className='label'>
            <FaIcon icon={team.isLeave ? faDoorOpen : faDoorClosed} /> 손님이 체험장을 나갔습니까?
          </label>
          <CheckBox
            disable={createTeam.isLoading}
            checked={team.isLeave}
            toggleFn={teamActions.toggleIsLeave}
            trueElements={[<FaIcon icon={faDoorOpen} />, " 나갔음"]}
            falseElements={[<FaIcon icon={faDoorClosed} />, " 나가지 않음"]}
          />
        </div>
      </fieldset>

      <form method='dialog' className='flex justify-end gap-2'>
        {/* Close */}
        <button className='btn' disabled={createTeam.isLoading}>
          {createTeam.isLoading ? (
            <>
              <FaIcon icon={faSpinner} className='animate-spin' /> 저장중...
            </>
          ) : (
            <>
              <FaIcon icon={faX} /> 닫기
            </>
          )}
        </button>

        {/* Clear */}
        <button
          type='button'
          className='btn'
          disabled={isCleared || createTeam.isLoading}
          onClick={teamActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} /> 초기화
        </button>

        {/* Save */}
        <button
          type='button'
          className='btn'
          onClick={mode === "CREATE" ? () => createTeam.mutate() : () => updateTeam.mutate()}
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
      </form>
    </dialog>
  );
}
