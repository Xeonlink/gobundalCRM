"use client";

import { Input } from "@/components/Input";
import { CognitoUserAttributeBuilder, toHyphenPhone } from "@/extra/utils";
import { useConfirmRegistration } from "@/api/auth";
import { useSignUp } from "@/api/auth";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { faCircleCheck, faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

const defaultSigUpForm = {
  id: "",
  password: "",
  passwordConfirm: "",
  email: "",
  name: "",
  nickname: "",
  birthday: "",
  phone: "",
  address: "",
  addressDetail: "",
};

export default function Page() {
  const router = useRouter();
  const [form, formActions] = useTypeSafeReducer(defaultSigUpForm, {
    onIdChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.id = e.target.value;
    },
    onPasswordChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.password = e.target.value;
    },
    onPasswordConfirmChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.passwordConfirm = e.target.value;
    },
    onEmailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.email = e.target.value;
    },
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    onNickNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.nickname = e.target.value;
    },
    onBirthdayChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.birthday = e.target.value;
    },
    onPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.phone = toHyphenPhone(e.target.value);
    },
    setAddress: (state, address: string) => {
      state.address = address;
    },
    onAddressDetailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.addressDetail = e.target.value;
    },
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => formActions.setAddress(data.roadAddress),
  });
  const userAttributes = new CognitoUserAttributeBuilder()
    .set("email", form.email)
    .set("name", form.name)
    .set("nickname", form.nickname)
    .set("birthdate", form.birthday)
    .setIf(
      /^[0-9]{3}\-[0-9]{4}\-[0-9]{4}$/.test(form.phone),
      "phone_number",
      "+82" + form.phone.replaceAll("-", "").slice(1),
    )
    .setIf(form.address !== "", "address", form.address + ", " + form.addressDetail)
    .build();

  const emailVerificationDialog = useRef<HTMLDialogElement>(null);
  const verificationCodeInput = useRef<HTMLInputElement>(null);

  const signUp = useSignUp(form.id, form.password, userAttributes, {
    onSuccess: () => emailVerificationDialog.current?.showModal(),
  });
  const confirmRegistration = useConfirmRegistration(
    signUp.data?.user,
    verificationCodeInput.current?.value,
    {
      onSuccess: () => router.push("/user"),
    },
  );

  const invalid = {
    id: form.id.length < 4,
    password:
      form.password.length < 8 || // 비밀번호의 길이가 8자리 이하일 경우
      form.password.search(/[0-9]/g) < 0 || // 숫자가 없을 경우
      form.password.search(/[a-z]/gi) < 0 || // 영문이 없을 경우
      form.password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi) < 0, // 특수문자가 없을 경우
    passwordConfirm: form.password !== form.passwordConfirm || form.passwordConfirm.length < 8,
    email: !form.email.includes("@"),
  };
  const isValid = Object.values(invalid).every((v) => !v);

  const openPasswordRequirement = () => {
    const passwordRequirement = document.querySelector(
      "#password-requirement",
    ) as HTMLDialogElement;
    passwordRequirement.showModal();
  };

  return (
    <main className="bg-base-100">
      <h2 className="py-6 text-center text-3xl font-bold">회원가입</h2>

      {/* 인증정보 */}
      <section className="container m-auto max-w-4xl px-2">
        <h3 className="flex items-center p-2">
          <span className="text-md flex-1 font-bold">ID & PW (필수)</span>
        </h3>

        <table className="grid grid-cols-[repeat(2,auto)] overflow-hidden rounded-md border text-sm sm:grid-cols-[repeat(3,auto)_1fr]">
          <tbody className="contents">
            <tr className="contents">
              <td className="flex items-center border-b bg-base-200 p-2 sm:w-32">아이디</td>
              <td className="space-y-1 border-b p-2 sm:col-span-3">
                <Input
                  className="dsy-input-sm max-w-[182px] text-center max-sm:w-full"
                  value={form.id}
                  onChange={formActions.onIdChange}
                  invalid={invalid.id}
                  placeholder="아이디"
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center border-b bg-base-200 p-2 sm:w-32">
                비밀번호
                <button
                  type="button"
                  className="dsy-btn-ghost dsy-btn-sm dsy-btn-circle dsy-btn"
                  onClick={openPasswordRequirement}
                >
                  <FontAwesomeIcon icon={faCircleQuestion} />
                </button>
              </td>
              <td className="border-b p-2">
                <Input
                  type="password"
                  className="dsy-input-sm max-w-[182px] text-center max-sm:w-full"
                  value={form.password}
                  onChange={formActions.onPasswordChange}
                  invalid={invalid.password}
                  placeholder="비밀번호"
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center border-b bg-base-200 p-2 sm:w-32 sm:justify-center">
                비밀번호 확인
              </td>
              <td className="border-b p-2">
                <Input
                  type="password"
                  className="dsy-input-sm max-w-[182px] text-center max-sm:w-full"
                  onChange={formActions.onPasswordConfirmChange}
                  value={form.passwordConfirm}
                  invalid={invalid.passwordConfirm}
                  placeholder="비밀번호 확인"
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center bg-base-200 p-2 sm:w-32">E-mail</td>
              <td className="flex-1 p-2 sm:col-span-3">
                <Input
                  type="email"
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={form.email}
                  onChange={formActions.onEmailChange}
                  invalid={invalid.email}
                  placeholder="이메일"
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 나의 연락처 */}
      <section className="container m-auto mt-6 max-w-4xl px-2">
        <h3 className="flex items-center p-2">
          <span className="text-md flex-1 font-bold">나의 프로필 (선택)</span>
        </h3>

        <table className="grid grid-cols-[repeat(2,auto)] overflow-hidden rounded-md border text-sm sm:grid-cols-[repeat(3,auto)_1fr]">
          <tbody className="contents">
            <tr className="contents">
              <td className="flex items-center rounded-tl-md border-b bg-base-200 p-2 sm:w-32">
                이름
              </td>
              <td className="flex-1 rounded-tr-md border-b p-2">
                <Input
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={form.name}
                  onChange={formActions.onNameChange}
                  placeholder="홍길동"
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center border-b bg-base-200 p-2 sm:w-32 sm:justify-center">
                별명
              </td>
              <td className="flex-1 border-b p-2">
                <Input
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={form.nickname}
                  onChange={formActions.onNickNameChange}
                  placeholder="동서에번쩍"
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center border-b bg-base-200 p-2 sm:w-32">생년월일</td>
              <td className="flex-1 border-b p-2 sm:col-span-3">
                <Input
                  type="date"
                  pattern="\d{4}-\d{2}-\d{2}"
                  max={dayjs().subtract(10, "year").format("YYYY-MM-DD")}
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={form.birthday}
                  onChange={formActions.onBirthdayChange}
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center border-b bg-base-200 p-2 sm:w-32">핸드폰번호</td>
              <td className="flex-1 border-b p-2 sm:col-span-3">
                <Input
                  type="tel"
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={form.phone}
                  onChange={formActions.onPhoneChange}
                  placeholder="010-0000-0000"
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center bg-base-200 p-2 max-sm:border-b sm:w-32">주소</td>
              <td className="flex-1 p-2 max-sm:border-b">
                <Input
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={form.address}
                  onChange={postCodePopup.show}
                  onClick={postCodePopup.show}
                  placeholder="남원월산로74번길 42"
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center bg-base-200 p-2 sm:w-32 sm:justify-center">
                상세주소
              </td>
              <td className="flex-1 p-2">
                <Input
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={form.addressDetail}
                  onChange={formActions.onAddressDetailChange}
                  placeholder="단독주택"
                  disabled={signUp.isLoading}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 정보서비스 */}
      <section className="container m-auto mt-6 max-w-4xl px-2">
        <h3 className="flex items-center p-2">
          <span className="text-md flex-1 font-bold">정보 서비스 (선택)</span>
        </h3>

        <table className="grid grid-cols-[repeat(2,auto)] overflow-hidden rounded-md border text-sm sm:grid-cols-[repeat(3,auto)_1fr]">
          <tbody className="contents">
            <tr className="contents">
              <td className="flex items-center rounded-tl-md border-b bg-base-200 p-2 sm:w-32">
                메일서비스
              </td>
              <td className="flex w-[198px] items-center gap-2 rounded-tr-md p-2 max-sm:border-b">
                <input
                  type="checkbox"
                  className="dsy-checkbox dsy-checkbox-sm text-center"
                  disabled={signUp.isLoading}
                />
                정보메일을 받겠습니다.
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center bg-base-200 p-2 sm:w-32 sm:justify-center">
                SMS 수신여부
              </td>
              <td className="flex items-center gap-2 p-2">
                <input
                  type="checkbox"
                  className="dsy-checkbox dsy-checkbox-sm text-center"
                  disabled={signUp.isLoading}
                />
                정보메세지를 받겠습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {signUp.error?.code === "UsernameExistsException" ? (
        <p className="container m-auto mt-6 max-w-4xl px-2">
          <FontAwesomeIcon icon={faCircleCheck} className="text-red-500" /> 이미 존재하는
          아이디입니다.
        </p>
      ) : null}

      <div className="m-auto my-6 flex">
        <button
          type="button"
          className="dsy-btn-wide dsy-btn mx-auto border-none bg-orange-200 shadow-lg"
          onClick={() => signUp.mutate()}
          disabled={!isValid}
        >
          가입하기
        </button>
      </div>

      {/* 이메일 인증 모달 */}
      <dialog
        id="email-verification"
        ref={emailVerificationDialog}
        className="dsy-modal dsy-modal-bottom sm:dsy-modal-middle"
      >
        <form className="dsy-modal-box">
          <h3 className="text-center text-lg font-bold">이메일 인증</h3>
          <p className="py-4 text-center">
            {form.email} 으로 <br />
            <strong>인증코드</strong>가 발송되었습니다.
          </p>
          <figure className="text-center">
            <FontAwesomeIcon
              icon={faEnvelope}
              fontSize={100}
              className="animate-pulse text-orange-300"
            />
          </figure>
          {confirmRegistration.isError ? (
            <p className="mt-4 text-center">
              <FontAwesomeIcon icon={faCircleCheck} className="text-red-500" /> 인증코드가 올바르지
              않습니다.
            </p>
          ) : null}
          <div className="dsy-join mt-4 w-full justify-center">
            <input
              type="number"
              className="dsy-input-bordered dsy-input dsy-join-item max-sm:w-full"
              placeholder="인증코드"
              name="verificationCode"
              ref={verificationCodeInput}
              disabled={confirmRegistration.isLoading}
            />
            <button
              type="button"
              className="dsy-join-item dsy-btn w-20"
              onClick={() => confirmRegistration.mutate()}
            >
              확인
            </button>
          </div>
        </form>
      </dialog>

      {/* 비밀번호 조건 모달 */}
      <dialog id="password-requirement" className="dsy-modal dsy-modal-top sm:dsy-modal-middle">
        <div className="dsy-modal-box">
          <h3 className="mb-2 text-lg font-bold text-orange-500">비밀번호는?</h3>
          <ul className="">
            <li className="min-w-max">
              1. <strong>8자리 이상</strong>이어야 합니다.
            </li>
            <li className="min-w-max">
              2. <strong>특수문자</strong>를 포함해야합니다.
            </li>
            <li className="min-w-max">
              3. <strong>숫자</strong>를 포함해야합니다.
            </li>
            <li className="min-w-max">
              4. <strong>영문</strong>를 포함해야합니다.
            </li>
            <li className="min-w-max">
              4. <strong>공백이 없어야</strong> 합니다.
            </li>
          </ul>
        </div>
        <form method="dialog" className="dsy-modal-backdrop">
          {/* if there is a button in form, it will close the modal */}
          <button>Close</button>
        </form>
      </dialog>
    </main>
  );
}
