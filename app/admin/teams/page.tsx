import { DateChanger } from "@/components/DateChanger";
import { DownloadExcel } from "@/components/DownloadExcel";
import { ImgIcon } from "@/components/ImgIcon";
import { Refresh } from "@/components/Navigate/Refresh";
import { PageProps } from "@/extra/type";
import IcoExcel from "@/public/icons/excel.png";
import {
  faArrowsRotate,
  faCheck,
  faCircleInfo,
  faFlag,
  faMobileScreen,
  faPen,
  faPeopleGroup,
  faPersonRunning,
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
import { deleteTeam } from "./actions";
import { getTeams } from "@/app/api/teams/accessors";

type SearchParams = { date: `${string}-${string}-${string}` };

export default async function Page(props: PageProps<{}, SearchParams>) {
  const { date = dayjs().format("YYYY-MM-DD") } = props.searchParams;

  const teams = await getTeams(date);

  return (
    <main className="min-h-screen">
      <form>
        {/* Toolbar */}
        <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
          <li className="mr-2">
            <DateChanger />
          </li>

          <li>
            {/* Refresh */}
            <Refresh className="dsy-btn-ghost dsy-btn">
              <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
            </Refresh>
          </li>

          <li>
            {/* Create New Team */}
            <Link href="teams/create" className="dsy-btn-ghost dsy-btn">
              <FontAwesomeIcon icon={faPlus} /> 팀 만들기
            </Link>
          </li>

          <li>
            {/* 엑셀로 다운로드하기 */}
            <DownloadExcel data={teams} filename="팀" className="dsy-btn-ghost dsy-btn">
              <ImgIcon src={IcoExcel} w={18} h={18} alt="엑셀로 변환" /> 엑셀로 변환
            </DownloadExcel>
          </li>

          <li>
            {/* Go To Kiosk */}
            <Link href="/kiosk/teams" className="dsy-btn-ghost dsy-btn">
              <FontAwesomeIcon icon={faRobot} /> 키오스크로
            </Link>
          </li>
        </ul>

        <div className="container m-auto overflow-x-auto p-4">
          <table className="table">
            <thead>
              <tr>
                <th className="rounded-tl-md bg-orange-100" colSpan={2}>
                  <FontAwesomeIcon icon={faFlag} /> 대표자
                </th>
                <th className="rounded-tr-md bg-green-100" colSpan={5}>
                  <FontAwesomeIcon icon={faCircleInfo} /> 정보
                </th>
              </tr>
              <tr>
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
                <th className="bg-green-50">
                  <FontAwesomeIcon icon={faPersonWalkingArrowRight} /> 체험완료
                </th>
                <th className="rounded-br-md bg-green-50">
                  <FontAwesomeIcon icon={faPersonRunning} /> 액션
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.map((item) => (
                <tr key={item.id}>
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
                  <td className="right-2 top-1 space-x-1 max-sm:absolute">
                    <Link href={`teams/${item.id}`} className="dsy-btn dsy-btn-sm">
                      <FontAwesomeIcon icon={faPen} />
                    </Link>
                    <button
                      className="dsy-btn dsy-btn-sm"
                      formAction={deleteTeam.bind(null, +item.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </main>
  );
}
