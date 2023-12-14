"use client";

import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import { cn } from "@/extra/utils";
import { useToggle } from "@/hooks/useToggle";
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
import { createTeam } from "./actions";

export default function Page() {
  const hasCoupon = useToggle(false);

  return (
    <form action={createTeam}>
      <fieldset className="mb-14 w-80 max-w-full rounded-lg bg-white bg-opacity-60 p-6 sm:mt-14">
        <legend className="text-center text-lg font-bold">
          <FontAwesomeIcon icon={faPeopleRoof} /> 팀 등록
        </legend>

        <div className="dsy-form-control mb-4">
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
            />
          </label>
        </div>

        <div className={cn("dsy-form-control mb-4", hasCoupon.isOn || "hidden")}>
          <label htmlFor="coupon" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faBuilding} /> 쿠폰 구매처
            </span>
          </label>
          <select name="coupon" id="coupon" className="dsy-select" defaultValue="none">
            <option value="none">쿠폰을 선택해주세요.</option>
            <option value="G마켓">G마켓</option>
            <option value="위메프">위메프</option>
            <option value="11번가">11번가</option>
            <option value="쿠팡">쿠팡</option>
          </select>
        </div>

        <div className="dsy-form-control mb-4">
          <label htmlFor="leader-name" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faSignature} /> {hasCoupon.isOn ? "쿠폰구매자" : "대표자"}
              &nbsp;이름&nbsp;<span className="text-xs text-orange-500">* 필수</span>
            </span>
          </label>
          <SelfValidateInput
            type="text"
            name="leaderName"
            id="leader-name"
            className="dsy-input"
            placeholder="홍길동"
            required
            title="대표자 이름"
          />
        </div>

        <div className="dsy-form-control mb-4">
          <label htmlFor="leader-phone" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faMobileScreen} /> {hasCoupon.isOn ? "쿠폰구매자" : "대표자"}
              &nbsp;전화번호&nbsp;<span className="text-xs text-orange-500">* 필수</span>
            </span>
          </label>
          <SelfValidateInput
            type="tel"
            name="leaderPhone"
            id="leader-phone"
            placeholder="010-0000-0000"
            required
            title="대표자 전화번호"
          />
        </div>

        <div className="dsy-form-control mb-4">
          <label htmlFor="population" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faPeopleGroup} /> 인원수&nbsp;
              <span className="text-xs text-orange-500">* 필수</span>
            </span>
          </label>
          <SelfValidateInput
            type="number"
            name="population"
            id="population"
            placeholder="인원수"
            min={1}
            required
            title="인원수"
          />
        </div>

        <div className="dsy-join mt-4 w-full">
          <label className="dsy-join-item dsy-btn w-1/2 border-none bg-white">
            <FontAwesomeIcon icon={faNotdef} rotation={90} />{" "}
            <input type="reset" value="초기화" onClick={hasCoupon.off} />
          </label>
          <button
            className="dsy-join-item dsy-btn w-1/2 border-none bg-orange-300"
            title="등록하기"
          >
            <FontAwesomeIcon icon={faHandshakeAngle} /> 등록하기
          </button>
        </div>
      </fieldset>
    </form>
  );
}
