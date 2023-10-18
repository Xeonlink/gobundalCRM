"use client";

import { defaultTeam, useCreateTeam } from "@/api/teams";
import { Input } from "@/components/Input";
import { toHyphenPhone } from "@/extra/utils";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBuilding,
  faCalendarAlt,
  faDoorClosed,
  faDoorOpen,
  faFloppyDisk,
  faHandshake,
  faHandshakeSlash,
  faNotdef,
  faPeopleGroup,
  faSignature,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [team, teamActions] = useTypeSafeReducer(defaultTeam, {
    onDateChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.date = e.target.value;
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
    reset: () => defaultTeam,
  });
  const createItem = useCreateTeam(team, {
    onSuccess: () => router.back(),
  });
  const isLoading = createItem.isLoading;

  const validity = {
    date: team.date !== "",
    leaderName: team.leaderName !== "",
    leaderPhone: team.leaderPhone !== "",
    coupon: team.coupon !== "",
    population: team.population !== 0,
  };
  const isValid = Object.values(validity).every((v) => v);

  return (
    <main>
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
        <li>
          {/* 쿠폰 승인여부 */}
          <label className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
            <FontAwesomeIcon icon={team.isApproved ? faHandshake : faHandshakeSlash} />{" "}
            {team.isApproved ? "승인됨" : "비승인"}
            <input
              type="checkbox"
              name="is-approved"
              className="dsy-toggle-success dsy-toggle"
              disabled={isLoading}
              checked={team.isApproved}
              onChange={teamActions.toggleIsApproved}
            />
          </label>
        </li>

        <li>
          {/* 손님이 나갔는가? */}
          <label className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
            <FontAwesomeIcon icon={team.isLeave ? faDoorOpen : faDoorClosed} />{" "}
            {team.isLeave ? "나갔음" : "안나감"}
            <input
              type="checkbox"
              name="enabled"
              id="enabled"
              className="dsy-toggle-success dsy-toggle"
              disabled={isLoading}
              checked={team.isLeave}
              onChange={teamActions.toggleIsLeave}
            />
          </label>
        </li>

        <li>
          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            onClick={teamActions.reset}
          >
            <FontAwesomeIcon icon={faNotdef} rotation={90} />
            초기화
          </button>
        </li>

        <li>
          {/* Save */}
          <button
            type="button"
            className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            disabled={!isValid || isLoading}
            onClick={() => createItem.mutate()}
          >
            <FontAwesomeIcon icon={faFloppyDisk} /> 저장
          </button>
        </li>
      </ul>

      <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
        <form className="w-[500px] space-y-6 rounded-xl border bg-white px-8 py-6">
          <div className="dsy-form-control">
            <label htmlFor="date" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faCalendarAlt} /> 날짜&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="date"
              type="date"
              placeholder="한라봉청 3kg"
              disabled={isLoading}
              defaultValue={defaultTeam.date}
              onChange={teamActions.onDateChange}
              invalid={!validity.date}
              max={defaultTeam.date}
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="leader-name" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faSignature} /> 대표자 이름&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="leader-name"
              placeholder="홍길동"
              disabled={isLoading}
              value={team.leaderName}
              onChange={teamActions.onLeaderNameChange}
              invalid={!validity.leaderName}
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="leader-phone" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faWon} /> 대표자 전화번호&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="leader-phone"
              type="tel"
              placeholder="010-0000-0000"
              disabled={isLoading}
              value={team.leaderPhone}
              invalid={!validity.leaderPhone}
              onChange={teamActions.onLeaderPhoneChange}
              required
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="coupon" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faBuilding} /> 쿠폰사
              </strong>
            </label>
            <Input
              id="coupon"
              value={team.coupon}
              onChange={teamActions.onCouponChange}
              disabled={isLoading}
              placeholder="쿠폰사"
              invalid={!validity.coupon}
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="population" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faPeopleGroup} /> 인원수
              </strong>
            </label>
            <Input
              id="population"
              type="number"
              value={team.population}
              onChange={teamActions.onPopulationChange}
              disabled={isLoading}
              placeholder="인원수"
            />
          </div>
        </form>
      </div>
    </main>
  );
}
