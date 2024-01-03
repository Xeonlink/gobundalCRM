import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../utils";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,

      profile: (profile) => ({
        id: profile.response.id.toString(),
        name: profile.nickname,
        image: profile.profile_image,
      }),
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,

      profile: (profile) => ({
        id: profile.id.toString(),
        name: profile.properties.nickname,
        image: profile.properties.profile_image,
      }),
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      profile: (profile) => ({
        id: profile.sub.toString(),
        name: profile.name,
        image: profile.picture,
      }),
    }),
  ],
  callbacks: {
    signIn: async (params) => {
      const id = params.user.id;
      const user = await db.user.findFirst({ where: { id } });
      if (!user) {
        await db.user.create({ data: { id } });
      }
      return true;
    },
    session: async (params) => {
      const id = params.token.sub;
      const user = await db.user.findFirstOrThrow({ where: { id } });
      params.session.user = {
        ...user,
        name: params.token.name,
        image: params.token.picture,
      };
      return params.session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
