import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import IconGoogleLogin from "@/public/icons/google_login.png";
import IconKakaoLogin from "@/public/icons/kakao_login.png";
import IconNaverLogin from "@/public/icons/naver_login.png";
import { faAt, faPeopleRoof, faSignature } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      <form className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
        <fieldset className="m-auto w-96 space-y-4 rounded-xl border bg-white bg-opacity-60 p-6 px-8 py-6">
          <legend className="text-center text-xl font-bold">
            <FontAwesomeIcon icon={faPeopleRoof} /> 곱은달농장{" "}
            <span className="text-orange-500">가입하기</span>
          </legend>

          <div className="dsy-form-control">
            <label htmlFor="email" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faAt} /> 이메일&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <SelfValidateInput
              id="email"
              type="email"
              name="email"
              placeholder="수신가능한 이메일을 입력해주세요"
              required
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="password" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faSignature} /> 비밀번호&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <SelfValidateInput
              id="password"
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요."
              required
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="password-check" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faSignature} /> 비밀번호 확인&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <SelfValidateInput
              id="password-check"
              type="password"
              name="password-check"
              placeholder="비밀번호를 확인해주세요."
              required
            />
          </div>

          <div className="dsy-divider"></div>

          <ul className="m-auto max-w-xs space-y-2 bg-opacity-60">
            <li>
              <button type="button" className="px-10">
                <Image src={IconNaverLogin} alt="네이버로그인" placeholder="blur" priority />
              </button>
            </li>
            <li>
              <button type="button" className="px-10">
                <Image src={IconKakaoLogin} alt="카카오로그인" placeholder="blur" priority />
              </button>
            </li>
            <li>
              <button type="button" className="px-10">
                <Image src={IconGoogleLogin} alt="구글로그인" placeholder="blur" priority />
              </button>
            </li>
          </ul>
        </fieldset>
      </form>
    </main>
  );
}
