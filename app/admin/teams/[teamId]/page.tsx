import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
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
import dayjs from "dayjs";
import { updateTeam } from "./actions";
import { db } from "@/prisma/db";
import { PageProps } from "@/extra/type";

export default async function Page(props: PageProps<{ teamId: string }>) {
  const id = parseInt(props.params.teamId);
  const team = await db.team.findFirstOrThrow({ where: { id } });

  return (
    <main>
      <form action={updateTeam}>
        <input type="hidden" name="id" defaultValue={team.id} />

        {/* Toolbar */}
        <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
          <li>
            {/* 쿠폰 승인여부 */}
            <label className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
              <FontAwesomeIcon icon={faHandshakeSlash} /> 비승인
              <input
                id="is-approved"
                type="checkbox"
                name="isApproved"
                className="dsy-toggle-success dsy-toggle"
                defaultChecked={team.isApproved}
              />
              승인됨 <FontAwesomeIcon icon={faHandshake} />
            </label>
          </li>

          <li>
            {/* 손님이 나갔는가? */}
            <label className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
              <FontAwesomeIcon icon={faDoorClosed} /> 안나감
              <input
                id="is-leave"
                type="checkbox"
                name="isLeave"
                className="dsy-toggle-success dsy-toggle"
                defaultChecked={team.isLeave}
              />
              나갔음 <FontAwesomeIcon icon={faDoorOpen} />
            </label>
          </li>

          <li>
            {/* Clear */}
            <label className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
              <FontAwesomeIcon icon={faNotdef} rotation={90} />{" "}
              <input type="reset" value="초기화" />
            </label>
          </li>

          <li>
            {/* Save */}
            <button className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
              <FontAwesomeIcon icon={faFloppyDisk} /> 저장
            </button>
          </li>
        </ul>

        <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
          <div className="w-[500px] space-y-6 rounded-xl border bg-white px-8 py-6">
            <div className="dsy-form-control">
              <label htmlFor="date" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faCalendarAlt} /> 날짜&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="date"
                name="date"
                type="date"
                placeholder="한라봉청 3kg"
                required
                max={dayjs().format("YYYY-MM-DD")}
                defaultValue={dayjs(team.date).format("YYYY-MM-DD")}
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="leader-name" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faSignature} /> 대표자 이름&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput //
                id="leader-name"
                name="leaderName"
                placeholder="홍길동"
                required
                title="대표자 이름"
                defaultValue={team.leaderName}
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="leader-phone" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faWon} /> 대표자 전화번호&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="leader-phone"
                name="leaderPhone"
                type="tel"
                placeholder="010-0000-0000"
                required
                title="대표자 전화번호"
                defaultValue={team.leaderPhone}
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="coupon" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faBuilding} /> 쿠폰사&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput //
                id="coupon"
                name="coupon"
                placeholder="쿠폰사"
                defaultValue={team.coupon}
                required
                title="쿠폰사"
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="population" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faPeopleGroup} /> 인원수
                </strong>
              </label>
              <SelfValidateInput
                id="population"
                type="number"
                name="population"
                placeholder="인원수"
                defaultValue={team.population}
                min={1}
                title="인원수"
              />
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
