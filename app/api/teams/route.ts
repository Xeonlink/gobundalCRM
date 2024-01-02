import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "../utils";

export const teamSchema = z.object({
  date: z.string({
    required_error: "date is required",
  }), // YYYY-MM-DD
  leaderName: z.string({
    required_error: "leaderName is required",
  }),
  leaderPhone: z.string({
    required_error: "leaderPhone is required",
  }),
  population: z.number({
    required_error: "population is required",
  }),
  coupon: z.string({
    required_error: "coupon is required",
  }),
  isLeave: z.boolean().default(false),
  isApproved: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD
  if (!date) {
    return new Response("date is required", { status: 400 });
  }

  const teams = await db.team.findMany({
    where: { date },
  });

  return Response.json({ data: teams });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const teamValidation = teamSchema.safeParse(body);
  if (!teamValidation.success) {
    return new Response(teamValidation.error.message, { status: 400 });
  }

  const _ = await db.team.create({
    data: teamValidation.data,
  });

  return Response.json({ data: "OK" });
}
