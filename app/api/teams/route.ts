import { NextRequest } from "next/server";
import { db } from "../utils";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD
  if (!date) {
    return new Response("date is required", { status: 400 });
  }

  const teams = await db.team.findMany({ where: { date } });
  return Response.json({ data: teams });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const _ = await db.team.create({
    data: {
      date: String(formData.get("date")),
      leaderName: String(formData.get("leaderName")),
      leaderPhone: String(formData.get("leaderPhone")),
      population: Number(formData.get("population")),
      coupon: String(formData.get("coupon")),
      isLeave: Boolean(formData.get("isLeave")),
      isApproved: Boolean(formData.get("isApproved")),
    },
  });

  return Response.json({ data: "OK" });
}
