import { JWT } from "next-auth/jwt";
import { DefaultSession, Session } from "next-auth";
import { db } from "@/app/api/utils";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    picture: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: PrismaUser & {
      name: string;
      image: string;
    };
  }
}
