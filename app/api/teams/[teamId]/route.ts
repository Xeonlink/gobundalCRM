import { NextRequest } from "next/server";
import { db } from "../../utils";

export async function GET(req: NextRequest, slug: { params: { teamId: string } }) {
  const id = Number(slug.params..teamId);

  const team = await db.team.findFirstOrThrow({ where: { id } });

  return Response.json({ data: team });
}

export async function DELETE(req: NextRequest, slug: { params: { teamId: string } }) {
  const id = Number(slug.params..teamId);

  const _ = await db.team.delete({ where: { id } });

  return Response.json({ data: "OK" });
}

export async function UPDATE(req: NextRequest, slug: { params: { teamId: string } }) {
  const id = Number(slug.params..teamId);
  const formData = await req.formData();

  const _ = await db.team.update({
    where: { id },
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
