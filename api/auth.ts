import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession,
  GetSessionOptions,
  ISignUpResult,
} from "amazon-cognito-identity-js";
import { CognitoUserPool } from "amazon-cognito-identity-js";
// import { promisify } from "util";

/**
 * CognitoUserPool은 CognitoUser를 관리하는 객체이다.
 * @author 오지민
 */
export const Pool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USERPOOL_ID || "ap-northeast-2_yz3jQTqtY",
  ClientId: process.env.COGNITO_CLIENT_ID || "1rf47tjrrqo0fhhq46700vmf01",
  /**
   * Storage는 로그인 정보를 저장하는 곳이다.
   * getCurrentUser를 호출하면, 해당 스토리지를 검사한다.
   * 지정하지 않을 경우, localStorage에 저장한다.
   */
  // Storage: sessionStorage,
});

export function useSignIn(
  options?: Omit<
    UseMutationOptions<
      CognitoUserSession,
      { name: string; code: string },
      { username: string; password: string },
      unknown
    >,
    "mutationKey" | "mutationFn"
  >,
) {
  const mutationFn = (variables: { username: string; password: string }) => {
    return new Promise<CognitoUserSession>((resolve, reject) => {
      /**
       * CognitoUser는 로그인한 유저의 정보를 담고있다.
       * Storage옵션을 지정하여, 로그인 정보를 저장할 장소를 선택할 수 있다.
       * 지정하지 않을 경우, localStorage에 저장한다.
       */
      const user = new CognitoUser({
        Username: variables.username,
        Pool,
        // Storage: sessionStorage,
      });
      const authDetails = new AuthenticationDetails({
        Username: variables.username,
        Password: variables.password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => resolve(data),
        onFailure: (err) => reject(err),
      });
    });
  };

  return useMutation(["signIn"], mutationFn, options);
}

export function useSignUp(
  username: string,
  password: string,
  userAttributes: CognitoUserAttribute[],
  options?: Omit<
    UseMutationOptions<ISignUpResult, { name: string; code: string }, void, unknown>,
    "mutationKey" | "mutationFn"
  >,
) {
  const mutationFn = () => {
    return new Promise<ISignUpResult>((resolve, reject) => {
      Pool.signUp(username, password, userAttributes, [], (err, data) => {
        if (err) reject(err);
        if (!data) return reject({ name: "NoDateException", code: "NoDataException" });
        resolve(data);
      });
    });
  };

  return useMutation(["signUp"], mutationFn, options);
}

export function useConfirmRegistration(
  user: CognitoUser | undefined,
  verificationCode: string | undefined,
  options?: Omit<
    UseMutationOptions<"SUCCESS", { name: string; code: string }, void, unknown>,
    "mutationKey" | "mutationFn"
  >,
) {
  const mutationFn = () => {
    return new Promise<"SUCCESS">((resolve, reject) => {
      if (user === undefined) {
        reject({ name: "NoUserException", code: "NoUserException" });
        return;
      }

      if (verificationCode === undefined) {
        reject({ name: "NoVerificationCodeException", code: "NoVerificationCodeException" });
        return;
      }

      user.confirmRegistration(verificationCode, true, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  };

  return useMutation(["confirmRegistration"], mutationFn, options);
}

/**
 * 현재 로그인된 유저의 세션을 반환합니다.
 *
 * @author 오지민
 * @returns 세션을 반환합니다. 만약 세션이 없다면 에러를 반환
 */
const getSession = (options?: GetSessionOptions) =>
  new Promise<CognitoUserSession>((resolve, reject) => {
    const user = Pool.getCurrentUser();
    if (!user) return reject();
    user.getSession((err: any, session: CognitoUserSession) => {
      if (err) return reject(err);
      resolve(session);
    }, options);
  });

/**
 * 현재 로그인된 유저의 토큰을 반환합니다.
 *
 * @author 오지민
 * @returns 토큰을 반환합니다. 만약 토큰이 없다면 에러를 반환
 * @usecase api를 호출할 때 토큰을 Authorization 헤더에 넣기위해 사용
 */
export const getIdToken = async () => {
  try {
    const session = await getSession();
    return session.getIdToken().getJwtToken();
  } catch (error) {
    return "";
  }
};
