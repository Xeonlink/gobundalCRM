"use client";

import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
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
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const defaultCredentials = {
  username: "",
  password: "",
};

type Status =
  | "NoError"
  | "UserNotConfirmedException"
  | "UserNotFoundException"
  | "UsernameExistsException"
  | "InvalidPasswordException"
  | "RequestSignUpSuccess";

type SearchParams = {
  url: string;
};

export default function Page(props: PageProps<any, SearchParams>) {
  const { searchParams } = props;
  const { url = "/admin/orders" } = searchParams;

  const naviate = useRouter();
  const auth = useAuth();
  const [status, setStatus] = useState<Status>("NoError");

  const [credentials, actions] = useTypeSafeReducer(defaultCredentials, {
    setUsername: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.username = e.target.value;
    },
    setPassword: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.password = e.target.value;
    },
  });

  const signIn = useMutation({
    mutationFn: () => auth.signIn(credentials.username, credentials.password),
    onSuccess: () => naviate.replace(url),
    onError: (res: any) => setStatus(res.code),
  });
  const signUp = useMutation({
    mutationFn: () => auth.signUp(credentials.username, credentials.password),
    onSuccess: () => setStatus("RequestSignUpSuccess"),
    onError: (res: any) => setStatus(res.code),
  });

  const validity = {
    username: credentials.username !== "",
    password: credentials.password.length > 8,
  };
  const isValid = Object.values(validity).every((v) => v);
  const isLoading = signIn.isLoading || signUp.isLoading;

  useEffect(() => {
    auth.user?.signOut();
  }, []);

  return (
    <main className='p-3 h-full flex-1 overflow-auto'>
      <div className='w-96 max-w-full m-auto'>
        <Image
          src={IcoLogo}
          alt='gobundal-logo'
          width={250}
          height={250}
          placeholder='blur'
          className='m-auto my-8'
        />
        <form className='w-80 p-4 max-w-full m-auto relative' onSubmit={(e) => e.preventDefault()}>
          <fieldset className='fieldset'>
            <legend className='btn bg-transparent p-2'>
              <FaIcon icon={faUserLock} /> 사용자 인증
            </legend>

            <div className='field'>
              <label htmlFor='username' className='label'>
                <FaIcon icon={faSignature} /> 사용자 이름
              </label>
              <input
                type='text'
                id='username'
                placeholder='id'
                className='input'
                defaultValue={credentials.username}
                onChange={actions.setUsername}
                disabled={isLoading}
                required
                autoCapitalize='off'
                autoComplete='off'
                autoFocus
              />
            </div>

            <div className='field'>
              <label htmlFor='password' className='label'>
                <FaIcon icon={faKey} /> 비밀번호
              </label>
              <input
                type='password'
                id='password'
                placeholder='password'
                className='input'
                defaultValue={credentials.password}
                onChange={actions.setPassword}
                disabled={isLoading}
                required
                autoCapitalize='off'
                autoComplete='off'
              />
            </div>

            {/* Message Container */}
            <ul className='w-full pl-1'>
              {status === "UserNotConfirmedException" ? (
                <li className='mt-3'>
                  <FaIcon icon={faCircleCheck} className='text-red-500' /> 승인되지 않은 사용자
                  입니다.
                </li>
              ) : null}
              {status === "UsernameExistsException" ? (
                <li className='mt-3'>
                  <FaIcon icon={faCircleCheck} className='text-red-500' /> 이미 존재하는 사용자
                  입니다.
                </li>
              ) : null}
              {status === "UserNotFoundException" ? (
                <li className='mt-3'>
                  <FaIcon icon={faCircleCheck} className='text-red-500' /> 사용자를 찾을 수
                  없습니다.
                </li>
              ) : null}
              {status === "InvalidPasswordException" ? (
                <li className='mt-3'>
                  <FaIcon icon={faCircleCheck} className='text-red-500' /> 유효하지 않은 비밀번호
                  형식입니다.
                </li>
              ) : null}
              {status === "RequestSignUpSuccess" ? (
                <li className='mt-3'>
                  <FaIcon icon={faCircleCheck} className='text-green-500' /> 가입요청이
                  완료되었습니다.
                </li>
              ) : null}
            </ul>
          </fieldset>

          {/* Submit Buttons */}
          <div className='flex gap-3 disabled:opacity-40 w-64 max-w-full m-auto flex-row-reverse'>
            <button
              className='btn w-full p-2'
              onClick={() => signIn.mutate()}
              disabled={isLoading || !isValid}
            >
              {isLoading ? (
                <FaIcon icon={faSpinner} className='animate-spin' />
              ) : (
                <FaIcon icon={faArrowRightToBracket} />
              )}
              &nbsp;로그인
            </button>

            <button
              className='btn w-full p-2'
              onClick={() => signUp.mutate()}
              disabled={isLoading || !isValid}
            >
              {isLoading ? (
                <FaIcon icon={faSpinner} className='animate-spin' />
              ) : (
                <FaIcon icon={faUserPlus} />
              )}
              &nbsp;가입요청
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
