"use client";

import { CognitoUserPool } from "amazon-cognito-identity-js";
import { PropsWithChildren, createContext, useRef } from "react";

export const UserPoolContext = createContext<CognitoUserPool | null>(null);

export function UserPoolProvider(props: PropsWithChildren) {
  const { current: Pool } = useRef(
    new CognitoUserPool({
      UserPoolId: "ap-northeast-2_Wjnw7DGvA",
      ClientId: "3nc2928u8ld638p4un2h5k14gn",
      /**
       * Storage는 로그인 정보를 저장하는 곳이다.
       * getCurrentUser를 호출하면, 해당 스토리지를 검사한다.
       * 지정하지 않을 경우, localStorage에 저장한다.
       */
      // Storage: sessionStorage,
    })
  );

  return <UserPoolContext.Provider value={Pool}>{props.children}</UserPoolContext.Provider>;
}
