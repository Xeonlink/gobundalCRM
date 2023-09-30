"use client";

import {
  RawTeam,
  defaultTeam,
  useCreateTeam,
  useDeleteTeam,
  useTeam,
  useUpdateTeam,
} from "@/api/teams";
import { ModalProps, useModal } from "@/extra/modal";
import { diff, toHyphenPhone } from "@/extra/utils";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBuilding,
  faCalendarAlt,
  faCopy,
  faDoorClosed,
  faDoorOpen,
  faFloppyDisk,
  faMobileScreenButton,
  faNotdef,
  faPeopleGroup,
  faSignature,
  faThumbsDown,
  faThumbsUp,
  faTrashAlt,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { DateChanger } from "../DateChanger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "../Input";

type Props = ModalProps<{ mode: "CREATE"; base?: RawTeam } | { mode: "UPDATE"; teamId: string }>;

export function TeamDialog(props: Props) {
  const { mode } = props;

  const modalCtrl = useModal();
  const { data: originTeam } = useTeam(mode === "UPDATE" ? props.teamId : "", {
    enabled: mode === "UPDATE",
  });
  const [team, teamActions] = useTypeSafeReducer(
    mode === "CREATE" ? props.base || defaultTeam : originTeam!,
    {
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
      reset: () => (mode === "CREATE" ? defaultTeam : originTeam!),
    },
  );
  const createTeam = useCreateTeam(team, {
    onSuccess: () => props.closeSelf?.(),
  });
  const updateTeam = useUpdateTeam(originTeam?.id!, diff(team, originTeam!), {
    onSuccess: () => props.closeSelf?.(),
  });
  const deleteTeam = useDeleteTeam(originTeam?.id!, {
    onSuccess: () => props.closeSelf?.(),
  });
  const openItemCopyDialog = () => {
    modalCtrl.open(<TeamDialog mode="CREATE" base={team} />);
  };

  const validity = {
    leaderName: team.leaderName !== "",
    leaderPhone: team.leaderPhone !== "",
    coupon: team.coupon !== "",
    population: team.population !== 0,
  };
  const isValid = Object.values(validity).every((v) => v);
  const isCleared = mode === "CREATE" ? team === defaultTeam : originTeam === team;
  const isLoading = createTeam.isLoading || updateTeam.isLoading || deleteTeam.isLoading;

  return (
    <dialog ref={props.ref} onClose={props.closeSelf} className="dsy-modal">
      <form
        method="dialog"
        className="dsy-modal-box max-h-screen w-full bg-opacity-60 backdrop-blur-md"
      >
        <button
          type="button"
          className="dsy-btn-ghost dsy-btn-sm dsy-btn-circle dsy-btn absolute right-6 top-4"
          onClick={props.closeSelf}
        >
          ✕
        </button>

        <h1 className="text-lg font-bold">팀</h1>

        <div className=" bg-transparent pt-2">
          {/* 해당 날짜로 검색 */}
          <div className="dsy-form-control">
            <label htmlFor="date" className="dsy-label gap-2 py-1">
              <span className="dsy-label-text min-w-fit">
                <FontAwesomeIcon icon={faCalendarAlt} /> 날짜
              </span>
              <DateChanger date={team.date} onChange={teamActions.setDate} />
            </label>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="leader-name" className="dsy-label gap-2 py-1">
              <span className="dsy-label-text min-w-fit">
                <FontAwesomeIcon icon={faSignature} /> 이름
              </span>
              <Input
                className="w-full max-w-[15rem]"
                id="leader-name"
                placeholder="홍길동"
                value={team.leaderName}
                onChange={teamActions.onLeaderNameChange}
                disabled={isLoading}
                invalid={team.leaderName === ""}
              />
            </label>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="leader-phone" className="dsy-label gap-2 py-1">
              <span className="dsy-label-text min-w-fit">
                <FontAwesomeIcon icon={faMobileScreenButton} /> 전화번호
              </span>
              <Input
                className="w-full max-w-[15rem]"
                id="leader-phone"
                type="tel"
                placeholder="010-xxxx-xxxx"
                value={team.leaderPhone}
                onChange={teamActions.onLeaderPhoneChange}
                disabled={isLoading}
                invalid={team.leaderPhone === ""}
              />
            </label>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="coupon" className="dsy-label gap-2 py-1">
              <span className="dsy-label-text min-w-fit">
                <FontAwesomeIcon icon={faBuilding} /> 쿠폰사
              </span>
              <Input
                className="w-full max-w-[15rem]"
                id="coupon"
                value={team.coupon}
                onChange={teamActions.onCouponChange}
                disabled={isLoading}
                placeholder="쿠폰사"
                invalid={team.coupon === ""}
              />
            </label>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="population" className="dsy-label gap-2 py-1">
              <span className="dsy-label-text min-w-fit">
                <FontAwesomeIcon icon={faPeopleGroup} /> 인원수
              </span>
              <Input
                className="w-full max-w-[15rem]"
                id="population"
                type="number"
                value={team.population}
                onChange={teamActions.onPopulationChange}
                disabled={isLoading}
                placeholder="인원수"
              />
            </label>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="is-approved" className="dsy-label gap-2 py-1">
              <span className="dsy-label-text min-w-fit">
                <FontAwesomeIcon icon={team.isApproved ? faThumbsUp : faThumbsDown} /> 쿠폰이
                승인되었습니까?
              </span>
              <input
                type="checkbox"
                name="isApproved"
                id="is-approved"
                className="dsy-toggle-success dsy-toggle"
                checked={team.isApproved}
                onChange={teamActions.toggleIsApproved}
              />
            </label>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="is-leave" className="dsy-label gap-2 py-1">
              <span className="dsy-label-text min-w-fit">
                <FontAwesomeIcon icon={team.isLeave ? faDoorOpen : faDoorClosed} /> 손님이 체험장을
                나갔습니까?
              </span>
              <input
                type="checkbox"
                name="isLeave"
                id="is-leave"
                className="dsy-toggle-success dsy-toggle"
                checked={team.isLeave}
                onChange={teamActions.toggleIsLeave}
              />
            </label>
          </div>
        </div>

        <div className="dsy-modal-action">
          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isCleared || isLoading}
            onClick={teamActions.reset}
          >
            <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
          </button>

          {/* Copy */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isLoading}
            onClick={openItemCopyDialog}
          >
            <FontAwesomeIcon icon={faCopy} /> 복제
          </button>

          {/* Delete */}
          {mode === "UPDATE" ? (
            <button
              type="button"
              className="dsy-btn-sm dsy-btn"
              disabled={isLoading}
              onClick={() => deleteTeam.mutate()}
            >
              <FontAwesomeIcon icon={faTrashAlt} /> 삭제
            </button>
          ) : null}

          {/* Save */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            onClick={mode === "CREATE" ? () => createTeam.mutate() : () => updateTeam.mutate()}
            disabled={!isValid || isLoading}
          >
            <FontAwesomeIcon icon={faFloppyDisk} /> 저장
          </button>
        </div>
      </form>
    </dialog>
  );
}
