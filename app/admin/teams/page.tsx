"use client";

import { useDeleteTeams, useTeams } from "@/api/teams";
import { DateChanger } from "@/components/DateChanger";
import { TeamDialog } from "@/components/Dialogs/TeamDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { useModal } from "@/extra/modal";
import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import IcoExcel from "@/public/icons/excel.png";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowsRotate,
  faCheck,
  faCircleInfo,
  faFlag,
  faMobileScreen,
  faPeopleGroup,
  faPersonWalkingArrowRight,
  faPlus,
  faRobot,
  faSignature,
  faTicket,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchParams = { date: `${string}-${string}-${string}` };

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { date = dayjs().format("YYYY-MM-DD") } = searchParams;

  const auth = useAuth();
  const navigate = useRouter();
  const modalCtrl = useModal();
  const selected = useItemSelection();
  const excel = useExcel();
  const teams = useTeams(date, {
    enabled: auth.isSignIn,
  });
  const eraseTeams = useDeleteTeams(selected.ids, {
    onSuccess: () => selected.clear(),
  });

  const onDateChange = (date: string) => {
    navigate.replace(`teams?date=${date}`);
  };
  const openCreateTeamDialog = () => {
    modalCtrl.open(<TeamDialog mode="CREATE" />);
  };
  const openUpdateTeamDialog = (id: string) => {
    modalCtrl.open(<TeamDialog mode="UPDATE" teamId={id} />);
  };
  const onDeleteClick = () => {
    if (selected.ids.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    eraseTeams.mutate();
  };
  const onDownloadClick = () => {
    excel.download(teams.data?.data!, "팀");
  };

  return (
    <main className="h-full flex-1 overflow-auto p-3">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {/* 오늘 날짜로 재검색 */}
        <Link href={`teams?date=${dayjs().format("YYYY-MM-DD")}`} className="dsy-btn-sm dsy-btn">
          <FaIcon icon={faCalendarDays} /> 오늘
        </Link>

        {/* 해당 날짜로 검색 */}
        <DateChanger date={date} onChange={onDateChange} />

        {/* Refresh */}
        <button type="button" className="dsy-btn-sm dsy-btn" onClick={() => teams.refetch()}>
          <FaIcon icon={faArrowsRotate} /> 새로고침
        </button>

        {/* Cratet New Team */}
        <button type="button" className="dsy-btn-sm dsy-btn" onClick={openCreateTeamDialog}>
          <FaIcon icon={faPlus} /> 팀 만들기
        </button>
        {/* Delete */}
        <button type="button" className="dsy-btn-sm dsy-btn" onClick={onDeleteClick}>
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type="button" className="dsy-btn-sm dsy-btn" onClick={onDownloadClick}>
          <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={20} /> 엑셀로 변환
        </button>

        {/* Go To Kiosk */}
        <Link href="/kiosk/teams" className="dsy-btn-sm dsy-btn">
          <FaIcon icon={faRobot} /> 키오스크로
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-tl-md bg-orange-100" colSpan={3}>
                <FaIcon icon={faFlag} /> 대표자
              </th>
              <th className="rounded-tr-md bg-green-100" colSpan={4}>
                <FaIcon icon={faCircleInfo} /> 정보
              </th>
            </tr>
            <tr>
              <th className="rounded-bl-md bg-orange-50">
                <input type="checkbox" name="" id="" className="dsy-checkbox dsy-checkbox-xs" />
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-orange-50">
                <FaIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="bg-green-50">
                <FaIcon icon={faTicket} /> 쿠폰사
              </th>
              <th className="bg-green-50">
                <FaIcon icon={faPeopleGroup} /> 인원수
              </th>
              <th className="bg-green-50">
                <FaIcon icon={faCheck} /> 쿠폰승인
              </th>
              <th className="rounded-br-md bg-green-50">
                <FaIcon icon={faPersonWalkingArrowRight} /> 체험완료
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.data?.data.map((item) => (
              <tr
                key={item.id}
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => openUpdateTeamDialog(item.id)}
                onTouchEnd={() => openUpdateTeamDialog(item.id)}
              >
                <td className="max-sm:absolute max-sm:right-3 max-sm:top-3">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className="dsy-checkbox dsy-checkbox-xs"
                    checked={selected.ids.includes(item.id)}
                  />
                </td>
                <td>
                  <label>
                    <FaIcon icon={faSignature} /> 이름
                  </label>
                  <span>{item.leaderName}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faMobileScreen} /> 전화번호
                  </label>
                  <span>{item.leaderPhone}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faTicket} /> 쿠폰사
                  </label>
                  <span>{item.coupon}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faPeopleGroup} /> 인원수
                  </label>
                  <span>{item.population}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faCheck} /> 쿠폰승인
                  </label>
                  <span>{item.isApproved ? "O" : "X"}</span>
                </td>
                <td>
                  <label>
                    <FaIcon icon={faPersonWalkingArrowRight} /> 체험완료
                  </label>
                  <span>{item.isLeave ? "O" : "X"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
