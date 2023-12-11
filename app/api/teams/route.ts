import { db } from "@/prisma/db";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  leaderName: z.string(),
  leaderPhone: z.string(),
  population: z.number(),
  coupon: z.string(),
  isApproved: z.boolean(),
  isLeave: z.boolean(),
});

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD

  const teams = await db.team.findMany({
    where: {
      createdAt: {
        gte: dayjs(date).toDate(),
        lt: dayjs(date).add(1, "day").toDate(),
      },
    },
  });

  return new Response(JSON.stringify({ data: teams }));
}

export async function POST(req: NextRequest) {
  const json = await req.json();

  console.log(json);

  const team = schema
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    })
    .parse(json);

  console.log(team);

  const storedTeam = await db.team.create({
    data: team,
  });

  return new Response("OK");
}
