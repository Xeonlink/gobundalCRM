"use client";

import { RawTeam, postTeam } from "@/api/teams";
import { ModalProps } from "@/extra/type";
import { toHyphenPhone } from "@/extra/utils";
import { useModal } from "@/hooks/useModal";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBuilding,
  faDoorClosed,
  faDoorOpen,
  faFloppyDisk,
  faMobileScreenButton,
  faPeopleGroup,
  faSignature,
  faThumbsDown,
  faThumbsUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  mode: "CREATE" | "EDIT";
  onClose?: () => void;
  onSave?: () => void;
};

const defaultTeam: RawTeam = {
  leaderName: "",
  leaderPhone: "",
  coupon: "",
  population: 1,
  isApproved: false,
  isLeave: false,
};

export function TeamDialog(props: ModalProps<Props>) {
  const { closeSelf, onSave, onClose, ref, mode } = props;
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
  });

  const createTeam = useMutation({
    mutationFn: () => postTeam(team),
    onSuccess: () => {
      queryClient.invalidateQueries(["teams"]);
      closeSelf?.();
    },
  });

  const onSaveClick = (_: React.MouseEvent<HTMLButtonElement>) => {
    onSave?.();
    createTeam.mutate();
  };

  const validity = {
    leaderName: team.leaderName !== "",
    leaderPhone: team.leaderPhone !== "",
    coupon: team.coupon !== "",
    population: team.population !== 0,
  };
  const isValid = Object.values(validity).every((v) => v);

  return (
    <dialog ref={ref} className='dialog'>
      <form method='dialog'>
        <fieldset className='fieldset bg-gradient-to-b from-orange-200 to-green-200'>
          <legend className='btn bg-transparent p-2 bg-white'>
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
              placeholder='인원수'
              className='input'
            />
          </div>

          <div className='field'>
            <label htmlFor='is-approved' className='label'>
              <FaIcon icon={team.isApproved ? faThumbsUp : faThumbsDown} /> 쿠폰이 승인되었습니까?
            </label>
            <div className='flex gap-3 disabled:opacity-40 m-auto'>
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
            <div className='flex gap-3 disabled:opacity-40 m-auto'>
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

        <div className='flex gap-3 disabled:opacity-40 w-64 max-w-full m-auto'>
          <button className='btn w-full p-2' onClick={closeSelf}>
            <FaIcon icon={faXmark} /> close
          </button>
          <button className='btn w-full p-2' onClick={onSaveClick} disabled={!isValid}>
            <FaIcon icon={faFloppyDisk} /> save
          </button>
        </div>
      </form>
    </dialog>
  );
}
