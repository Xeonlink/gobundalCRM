import { CognitoUser, CognitoUserPool, AuthenticationDetails } from "amazon-cognito-identity-js";
import NextAuth from "next-auth/next";
import CognitoProvider from "next-auth/providers/cognito";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

/**
 * CognitoUserPool은 CognitoUser를 관리하는 객체이다.
 * @author 오지민
 */
const Pool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USERPOOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID,
  /**
   * Storage는 로그인 정보를 저장하는 곳이다.
   * getCurrentUser를 호출하면, 해당 스토리지를 검사한다.
   * 지정하지 않을 경우, localStorage에 저장한다.
   */
  // Storage: sessionStorage,
});

const credentialsSchema = z.object({
  Username: z.string().min(1, "Username is required"),
  Password: z.string().min(1, "Password is required"),
});

const handler = NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }),
    Credentials({
      credentials: {
        Username: { label: "Username", type: "text" },
        Password: { label: "Password", type: "password" },
      },
      authorize: (credentials, req) => {
        return new Promise((resolve, reject) => {
          const validation = credentialsSchema.safeParse(credentials);
          if (!validation.success) {
            return reject(validation.error);
          }
          const { Username, Password } = validation.data;

          const user = new CognitoUser({
            Pool,
            Username,
          });
          const authenticationDetails = new AuthenticationDetails({
            Username,
            Password,
          });
          user.authenticateUser(authenticationDetails, {
            onSuccess: (session) => {
              user.getUserData((err, result) => {
                if (err) {
                  return reject(err);
                }

                resolve({
                  id: result?.Username ?? "",
                  name: result?.Username ?? "",
                });
              });
            },
            onFailure: (err) => reject(err),
          });
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
