import { BackCountDown } from "@/app/kiosk/(public)/teams/complete/BackCountDown";
import { PageProps } from "@/extra/type";
import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Page(props: PageProps<{}, { leaderName: string }>) {
  const leaderName = props.searchParams.leaderName;

  return (
    <form>
      <fieldset className="mb-14 flex w-80 max-w-full flex-col rounded-lg bg-white bg-opacity-60 p-6 sm:mt-14">
        <legend className="text-center text-lg font-bold">
          <FontAwesomeIcon icon={faPeopleRoof} /> 팀 등록
        </legend>

        <p className="flex-1 text-center">
          {!!leaderName ? (
            <>
              {leaderName} 님
              <br />
            </>
          ) : null}
          등록이 <strong>완료</strong>되었습니다.
          <br />
          <br />
          장갑과 가위를 챙기고, <br />
          잠시만 기다려주세요.
        </p>

        <div className="dsy-divider"></div>

        <div className="text-center">
          잠시후 이전 화면으로 돌아갑니다.
          <br />
          <BackCountDown className="text-xl" />
        </div>
      </fieldset>
    </form>
  );
}
