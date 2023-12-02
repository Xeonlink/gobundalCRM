import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth";
import NaverProvider from "next-auth/providers/naver";

export const authOptions: AuthOptions = {
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
