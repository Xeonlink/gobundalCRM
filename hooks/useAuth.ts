import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  GetSessionOptions,
} from "amazon-cognito-identity-js";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Pool = new CognitoUserPool({
  UserPoolId: "ap-northeast-2_Wjnw7DGvA",
  ClientId: "3nc2928u8ld638p4un2h5k14gn",
});

const signIn = (Username: string, Password: string) =>
  new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username, Pool });
    const authDetails = new AuthenticationDetails({ Username, Password });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log(data);
        resolve(data);
      },
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

export function useAuth() {
  const kickTo = useRef<string | null>(null);
  const navigate = useRouter();
  const user = Pool.getCurrentUser();
  const isSignIn = user !== null;

  const setKickDest = (path: string) => {
    kickTo.current = path;
  };

  useEffect(() => {
    if (isSignIn) return;
    if (kickTo.current === null) return;
    navigate.push(kickTo.current);
  }, []);

  return { signIn, signUp, isSignIn, user, setKickDest, getSession };
}
