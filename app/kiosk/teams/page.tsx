"use client";

import { defaultTeam, useCreateTeam } from "@/api/teams";
import { cn, toHyphenPhone } from "@/extra/utils";
import { useToggle } from "@/hooks/useToggle";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import IcoLogo from "@/public/icons/logo_transparent.png";
import {
  faBuilding,
  faHandshakeAngle,
  faMobileScreen,
  faNotdef,
  faPeopleGroup,
  faPeopleRoof,
  faSignature,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function Page() {
  const hasCoupon = useToggle(false);
  const [team, teamActions] = useTypeSafeReducer(defaultTeam, {
    onLeaderNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.leaderName = e.target.value;
    },
    onLeaderPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.leaderPhone = toHyphenPhone(e.target.value);
    },
    onCouponChange: (state, e: React.ChangeEvent<HTMLSelectElement>) => {
      state.coupon = e.target.value;
    },
    onPopulationChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.population = Number(e.target.value);
    },
    reset: () => defaultTeam,
  });

  const createTeam = useCreateTeam({
    ...team,
    coupon: hasCoupon.isOn ? team.coupon : "none",
  });

  const valid = {
    leaderName: team.leaderName.length > 0,
    leaderPhone: team.leaderPhone.length > 0,
    population: team.population > 0,
    coupon: hasCoupon.isOn ? team.coupon !== "none" : true,
  };
  const isValid = Object.values(valid).every((v) => v);

  return (
    <main className="flex h-full min-h-screen items-center justify-center max-sm:flex-col">
      <div className="sm:mr-10">
        <Image
          src={IcoLogo}
          alt="gobundal-logo"
          width={250}
          height={250}
          placeholder="blur"
          className="m-auto my-8"
        />
      </div>

      <fieldset className="mb-14 w-80 max-w-full rounded-lg bg-white bg-opacity-60 p-6 sm:mt-14">
        <legend className="text-center text-lg font-bold">
          <FontAwesomeIcon icon={faPeopleRoof} /> 팀 등록
        </legend>

        <div className="dsy-form-control mb-2">
          <label htmlFor="has-coupon" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faTicket} /> 쿠폰이 있으신가요?
            </span>
            <input
              type="checkbox"
              name="hasCoupon"
              id="has-coupon"
              className="dsy-checkbox"
              onChange={hasCoupon.toggle}
              disabled={createTeam.isLoading}
            />
          </label>
        </div>

        <div className={cn("dsy-form-control mb-2", hasCoupon.isOn || "hidden")}>
          <label htmlFor="coupon" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faBuilding} /> 쿠폰 구매처
            </span>
          </label>
          <select
            name="coupon"
            id="coupon"
            className="dsy-select"
            onChange={teamActions.onCouponChange}
            disabled={createTeam.isLoading}
            value={team.coupon}
          >
            <option value="none">쿠폰을 선택해주세요.</option>
            <option value="coupon1">coupon1</option>
            <option value="coupon2">coupon2</option>
            <option value="coupon3">coupon3</option>
            <option value="coupon4">coupon4</option>
          </select>
        </div>

        <div className="dsy-form-control mb-2">
          <label htmlFor="leader-name" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faSignature} /> {hasCoupon.isOn ? "쿠폰구매자" : "대표자"} 이름
            </span>
          </label>
          <input
            type="text"
            name="leaderName"
            id="leader-name"
            className="dsy-input"
            onChange={teamActions.onLeaderNameChange}
            disabled={createTeam.isLoading}
            value={team.leaderName}
          />
        </div>

        <div className="dsy-form-control mb-2">
          <label htmlFor="leader-phone" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faMobileScreen} /> {hasCoupon.isOn ? "쿠폰구매자" : "대표자"}{" "}
              전화번호
            </span>
          </label>
          <input
            type="tel"
            name="leaderPhone"
            id="leader-phone"
            className="dsy-input"
            onChange={teamActions.onLeaderPhoneChange}
            disabled={createTeam.isLoading}
            value={team.leaderPhone}
          />
        </div>

        <div className="dsy-form-control mb-2">
          <label htmlFor="population" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faPeopleGroup} /> 인원수
            </span>
          </label>
          <input
            type="number"
            name="population"
            id="population"
            className="dsy-input"
            onChange={teamActions.onPopulationChange}
            disabled={createTeam.isLoading}
            value={team.population}
          />
        </div>

        <div className="dsy-join mt-4 w-full">
          <button
            type="button"
            className="dsy-join-item dsy-btn w-1/2 border-none bg-white"
            onClick={teamActions.reset}
            disabled={createTeam.isLoading || defaultTeam === team}
          >
            <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
          </button>
          <button
            type="button"
            className="dsy-join-item dsy-btn w-1/2 border-none bg-orange-300"
            onClick={() => createTeam.mutate()}
            disabled={createTeam.isLoading || !isValid}
          >
            <FontAwesomeIcon icon={faHandshakeAngle} /> 등록하기
          </button>
        </div>
      </fieldset>
    </main>
  );
}
