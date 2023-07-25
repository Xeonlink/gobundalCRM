"use client";

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  GetSessionOptions,
} from "amazon-cognito-identity-js";
import { useEffect } from "react";

const Pool = new CognitoUserPool({
  UserPoolId: "ap-northeast-2_Wjnw7DGvA",
  ClientId: "3nc2928u8ld638p4un2h5k14gn",
  /**
   * Storage는 로그인 정보를 저장하는 곳이다.
   * getCurrentUser를 호출하면, 해당 스토리지를 검사한다.
   * 지정하지 않을 경우, localStorage에 저장한다.
   */
  // Storage: sessionStorage,
});

const signIn = (Username: string, Password: string) =>
  new Promise((resolve, reject) => {
    /**
     * CognitoUser는 로그인한 유저의 정보를 담고있다.
     * Storage옵션을 지정하여, 로그인 정보를 저장할 장소를 선택할 수 있다.
     * 지정하지 않을 경우, localStorage에 저장한다.
     */
    const user = new CognitoUser({
      Username,
      Pool,
      // Storage: sessionStorage,
    });
    const authDetails = new AuthenticationDetails({ Username, Password });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(err),
    });
  });

const signUp = (Username: string, Password: string) =>
  new Promise((resolve, reject) => {
    Pool.signUp(Username, Password, [], [], (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });

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

type AuthOptions = {
  unAuthorized?: () => void;
};

export function useAuth(options: AuthOptions = {}) {
  const { unAuthorized } = options;
  const user = Pool.getCurrentUser();
  const isSignIn = user !== null;

  useEffect(() => {
    if (!isSignIn) {
      unAuthorized?.();
    }
  }, []);

  return { signIn, signUp, user, isSignIn, getSession };
}
