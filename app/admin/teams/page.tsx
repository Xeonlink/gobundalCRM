"use client";

import { useDeleteTeams, useTeams } from "@/api/teams";
import { TeamDialog } from "@/components/Dialogs/TeamDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { Input } from "@/components/Input";
import { useModal } from "@/extra/modal";
import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import IcoExcel from "@/public/icons/excel.png";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchParams = { date: `${string}-${string}-${string}` };

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { date = dayjs().format("YYYY-MM-DD") } = searchParams;

  const auth = useAuth();
  const router = useRouter();
  const selected = useItemSelection();
  const excel = useExcel();
  const teams = useTeams(date, {
    enabled: auth.isSignIn,
  });
  const deleteItems = useDeleteTeams(selected.ids, {
    onSuccess: () => selected.clear(),
  });

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.replace(`teams?date=${e.target.value}`);
  };
  const onDeleteClick = () => {
    if (selected.ids.length === 0) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    deleteItems.mutate();
  };
  const onDownloadClick = () => {
    excel.download(teams.data?.data!, "팀");
  };

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200">
        <li className="mr-2">
          <Input
            type="date"
            value={date}
            onChange={onDateChange}
            max={dayjs().format("YYYY-MM-DD")}
            className="dsy-input-sm"
          />
        </li>

        <li>
          {/* Refresh */}
          <button type="button" className="dsy-btn" onClick={() => teams.refetch()}>
            <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
          </button>
        </li>

        <li>
          {/* Cratet New Team */}
          <Link href="teams/create" className="dsy-btn">
            <FontAwesomeIcon icon={faPlus} /> 팀 만들기
          </Link>
        </li>

        <li>
          {/* Delete */}
          <button type="button" className="dsy-btn" onClick={onDeleteClick}>
            <FontAwesomeIcon icon={faTrashCan} /> 선택삭제
          </button>
        </li>

        <li>
          {/* 엑셀로 다운로드하기 */}
          <button type="button" className="dsy-btn" onClick={onDownloadClick}>
            <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={16} /> 엑셀로 변환
          </button>
        </li>

        <li>
          {/* Go To Kiosk */}
          <Link href="/kiosk/teams" className="dsy-btn">
            <FontAwesomeIcon icon={faRobot} /> 키오스크로
          </Link>
        </li>
      </ul>

      <div className="container m-auto overflow-x-auto p-4">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-tl-md bg-orange-100" colSpan={3}>
                <FontAwesomeIcon icon={faFlag} /> 대표자
              </th>
              <th className="rounded-tr-md bg-green-100" colSpan={4}>
                <FontAwesomeIcon icon={faCircleInfo} /> 정보
              </th>
            </tr>
            <tr>
              <th className="rounded-bl-md bg-orange-50">
                <input type="checkbox" name="" id="" className="dsy-checkbox dsy-checkbox-xs" />
              </th>
              <th className="bg-orange-50">
                <FontAwesomeIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-orange-50">
                <FontAwesomeIcon icon={faMobileScreen} /> 전화번호
              </th>
              <th className="bg-green-50">
                <FontAwesomeIcon icon={faTicket} /> 쿠폰사
              </th>
              <th className="bg-green-50">
                <FontAwesomeIcon icon={faPeopleGroup} /> 인원수
              </th>
              <th className="bg-green-50">
                <FontAwesomeIcon icon={faCheck} /> 쿠폰승인
              </th>
              <th className="rounded-br-md bg-green-50">
                <FontAwesomeIcon icon={faPersonWalkingArrowRight} /> 체험완료
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.data?.data.map((item) => (
              <tr
                key={item.id}
                onClick={selected.onItemClick(item.id)}
                onDoubleClick={() => router.push(`teams/${item.id}`)}
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
                    <FontAwesomeIcon icon={faSignature} /> 이름
                  </label>
                  <span>{item.leaderName}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faMobileScreen} /> 전화번호
                  </label>
                  <span>{item.leaderPhone}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faTicket} /> 쿠폰사
                  </label>
                  <span>{item.coupon}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faPeopleGroup} /> 인원수
                  </label>
                  <span>{item.population}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faCheck} /> 쿠폰승인
                  </label>
                  <span>{item.isApproved ? "O" : "X"}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faPersonWalkingArrowRight} /> 체험완료
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
