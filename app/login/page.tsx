"use client";

import Image from "next/image";
import IcoLogo from "@/public/icons/logo_transparent.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faKey,
  faSignature,
  faSpinner,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const defaultCredentials = {
  username: "",
  password: "",
};

type Status =
  | "NoError"
  | "UserNotConfirmedException"
  | "UsernameExistsException"
  | "RequestSignUpSuccess";

export default function LoginPage() {
  const naviate = useRouter();
  const auth = useAuth();
  const [status, setStatus] = useState<Status>("NoError");
  const [isLoading, setIsLoading] = useState(false);

  const [credentials, actions] = useTypeSafeReducer(defaultCredentials, {
    setUsername: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.username = e.target.value;
    },
    setPassword: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.password = e.target.value;
    },
  });

  const onSignInClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    auth //
      .signIn(credentials.username, credentials.password)
      .then(() => naviate.replace("/"))
      .catch((res) => setStatus(res.code))
      .finally(() => setIsLoading(false));
  };

  const onSignUpClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    auth
      .signUp(credentials.username, credentials.password)
      .then(() => setStatus("RequestSignUpSuccess"))
      .catch((res) => setStatus(res.code))
      .finally(() => setIsLoading(false));
  };

  const isUsernameValid = credentials.username !== "";
  const isPasswordValid = credentials.password !== "";
  const isSignUpButtonDisabled = !isUsernameValid || !isPasswordValid || isLoading;
  const isSignInButtonDisabled = !isUsernameValid || !isPasswordValid || isLoading;

  return (
    <div className='w-96 max-w-full m-auto'>
      <Image src={IcoLogo} alt='gobundal-logo' width={250} height={250} className='m-auto my-8' />
      <form className='w-80 p-4 max-w-full m-auto relative' onSubmit={(e) => e.preventDefault()}>
        <label htmlFor='username' className='pl-3 block mb-2'>
          <FontAwesomeIcon
            icon={faSignature}
            width={20}
            height={20}
            className='align-middle inline-block mr-2'
          />
          <span>사용자 이름</span>
        </label>
        <input
          type='text'
          id='username'
          placeholder='id'
          className={`m-box px-3 py-1 w-full mb-3 disabled:opacity-40 ${
            credentials.username === "" ? "shake border-red-300 border-2" : null
          }`}
          defaultValue={credentials.username}
          onChange={actions.setUsername}
          disabled={isLoading}
          autoCapitalize='off'
          autoComplete='off'
          autoFocus
        />
        <label htmlFor='password' className='pl-3 block mb-2'>
          <FontAwesomeIcon
            icon={faKey}
            width={17}
            height={17}
            className='align-middle inline-block mr-2'
          />
          <span>비밀번호</span>
        </label>
        <input
          type='password'
          id='password'
          placeholder='password'
          className={`m-box px-3 py-1 w-full mb-3 disabled:opacity-40 ${
            credentials.password === "" ? "shake border-red-300 border-2" : null
          }`}
          defaultValue={credentials.password}
          onChange={actions.setPassword}
          disabled={isLoading}
          autoCapitalize='off'
          autoComplete='off'
        />

        {/* Message Container */}
        <ul className='w-full mb-3 pl-1'>
          {status === "UserNotConfirmedException" ? (
            <Message message='승인되지 않은 사용자 입니다.' />
          ) : null}
          {status === "UsernameExistsException" ? (
            <Message message='이미 존재하는 사용자 입니다.' />
          ) : null}
          {status === "RequestSignUpSuccess" ? (
            <Message positive message='가입요청이 완료되었습니다.' />
          ) : null}
        </ul>

        {/* Submit Buttons */}
        <div className='flex flex-row-reverse justify-between mb-2'>
          <button
            className='m-box px-3 py-1 disabled:opacity-40 disabled:cursor-default'
            onClick={onSignInClick}
            disabled={isSignInButtonDisabled}
          >
            {!isLoading ? (
              <FontAwesomeIcon
                icon={faArrowRightToBracket}
                width={19}
                height={19}
                className='align-middle inline-block mr-2'
              />
            ) : (
              <FontAwesomeIcon
                icon={faSpinner}
                width={19}
                height={19}
                className='align-middel inline-block mr-2 animate-spin'
              />
            )}

            <span>로그인</span>
          </button>

          <button
            className='m-box px-3 py-1 disabled:opacity-40 disabled:cursor-default'
            onClick={onSignUpClick}
            disabled={isSignUpButtonDisabled}
          >
            {!isLoading ? (
              <FontAwesomeIcon
                icon={faUserPlus}
                width={19}
                height={19}
                className='align-middle inline-block mr-2'
              />
            ) : (
              <FontAwesomeIcon
                icon={faSpinner}
                width={19}
                height={19}
                className='align-middel inline-block mr-2 animate-spin'
              />
            )}

            <span>가입요청</span>
          </button>
        </div>
      </form>
    </div>
  );
}

function Message(props: { positive?: boolean; message: string }) {
  const { positive, message } = props;

  if (positive) {
    return (
      <li>
        <FontAwesomeIcon
          icon={faCircleCheck}
          width={28}
          height={28}
          className='align-middle inline-block mr-1 text-green-500'
        />
        <span>{message}</span>
      </li>
    );
  } else {
    return (
      <li>
        <FontAwesomeIcon
          icon={faCircleXmark}
          width={28}
          height={28}
          className='align-middle inline-block mr-1 text-red-500'
        />
        <span>{message}</span>
      </li>
    );
  }
}
