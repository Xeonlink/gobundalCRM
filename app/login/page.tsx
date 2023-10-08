"use client";

import { useSignIn } from "@/api/auth";
import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import IcoLogo from "@/public/icons/logo_transparent.png";
import {
  faArrowRightToBracket,
  faCircleCheck,
  faKey,
  faSignature,
  faSpinner,
  faUserLock,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page(props: PageProps<any, { url: string }>) {
  const { searchParams } = props;
  const { url = "/user" } = searchParams;

  const naviate = useRouter();
  const auth = useAuth({
    unAuthorizedRedirect: false,
  });
  const signIn = useSignIn({
    onSuccess: () => naviate.push(url),
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")!.toString();
    const password = formData.get("password")!.toString();
    signIn.mutate({ username, password });
  };

  useEffect(() => {
    auth.user?.signOut();
  }, []);

  return (
    <main className="h-full flex-1 overflow-auto p-3">
      <Image
        src={IcoLogo}
        alt="gobundal-logo"
        width={250}
        height={250}
        placeholder="blur"
        className="m-auto my-8"
      />

      <form
        onSubmit={onSubmit}
        className="m-auto max-w-xs rounded-lg bg-white bg-opacity-60 p-6 shadow-md backdrop-blur-md"
      >
        <h1 className="text-md mb-4 text-center">
          <FontAwesomeIcon icon={faUserLock} /> 사용자 인증
        </h1>

        <div className="dsy-form-control mb-2">
          <label htmlFor="username" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faSignature} /> 사용자 이름
            </span>
          </label>
          <input
            id="username"
            name="username"
            placeholder="id"
            disabled={signIn.isLoading}
            autoFocus
            className="dsy-input-bordered dsy-input"
            required
          />
        </div>

        <div className="dsy-form-control">
          <label htmlFor="password" className="dsy-label">
            <span className="dsy-label-text">
              <FontAwesomeIcon icon={faKey} /> 비밀번호
            </span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            disabled={signIn.isLoading}
            className="dsy-input-bordered dsy-input"
            required
          />
        </div>

        {/* Messages */}
        {signIn.error?.code === "UserNotConfirmedException" ? (
          <p className="mt-3 w-full pl-1">
            <FontAwesomeIcon icon={faCircleCheck} className="text-red-500" /> 승인되지 않은 사용자
            입니다.
          </p>
        ) : null}
        {signIn.error?.code === "UsernameExistsException" ? (
          <p className="mt-3 w-full pl-1">
            <FontAwesomeIcon icon={faCircleCheck} className="text-red-500" /> 이미 존재하는 사용자
            입니다.
          </p>
        ) : null}
        {signIn.error?.code === "UserNotFoundException" ? (
          <p className="mt-3 w-full pl-1">
            <FontAwesomeIcon icon={faCircleCheck} className="text-red-500" /> 사용자를 찾을 수
            없습니다.
          </p>
        ) : null}
        {signIn.error?.code === "InvalidPasswordException" ? (
          <p className="mt-3 w-full pl-1">
            <FontAwesomeIcon icon={faCircleCheck} className="text-red-500" /> 유효하지 않은 비밀번호
            형식입니다.
          </p>
        ) : null}
        {signIn.error?.code === "RequestSignUpSuccess" ? (
          <p className="mt-3 w-full pl-1">
            <FontAwesomeIcon icon={faCircleCheck} className="text-green-500" /> 가입요청이
            완료되었습니다.
          </p>
        ) : null}

        {/* Submit Buttons */}
        <div className="dsy-modal-action">
          <Link href="/user/signup/register" className="dsy-btn">
            <FontAwesomeIcon icon={faUserPlus} /> 회원가입
          </Link>

          <button className="dsy-btn" disabled={signIn.isLoading}>
            {signIn.isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faArrowRightToBracket} />
            )}
            &nbsp;로그인
          </button>
        </div>
      </form>
    </main>
  );
}
