import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import { faMobileScreen, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { kioskSignIn } from "./actions";
import { PageProps } from "@/extra/type";

export default function Page(props: PageProps<{}, { callbackurl: string }>) {
  const { callbackurl = "/kiosk" } = props.searchParams;
  const action = kioskSignIn.bind(null, callbackurl);

  return (
    <form action={action} className="m-auto max-w-xs rounded-lg bg-white bg-opacity-60 p-6">
      <div>
        <div className="dsy-form-control">
          <label htmlFor="password" className="dsy-label">
            <strong className="dsy-label-text">
              <FontAwesomeIcon icon={faMobileScreen} /> 키오스크 비밀번호&nbsp;
              <span className="align-top text-xs text-orange-500">* 필수</span>
            </strong>
          </label>
          <SelfValidateInput
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요."
            required
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <button className="dsy-btn dsy-btn-wide border-none bg-orange-200">
          <FontAwesomeIcon icon={faUnlockKeyhole} /> 접속하기
        </button>
      </div>
    </form>
  );
}
