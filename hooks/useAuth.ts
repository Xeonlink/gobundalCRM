import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Pool = new CognitoUserPool({
  UserPoolId: "ap-northeast-2_wF9NpLgF9",
  ClientId: "7an25lsgabg93qgo1ccfthacf4",
});

const signIn = (Username: string, Password: string) =>
  new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username, Pool });
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

  return { signIn, signUp, isSignIn, user, setKickDest };
}
