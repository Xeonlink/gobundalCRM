import { NextRequest } from "next/server";
import { Slug, db } from "../../utils";
import { teamSchema } from "../route";

export async function GET(req: NextRequest, slug: Slug<["teamId"]>) {
  const id = Number(slug.params.teamId);

  const team = await db.team.findFirst({
    where: { id },
  });
  if (!team) {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json({ data: team });
}

export async function DELETE(req: NextRequest, slug: Slug<["teamId"]>) {
  const id = Number(slug.params.teamId);

  const _ = await db.team.delete({
    where: { id },
  });

  return Response.json({ data: "OK" });
}

export async function UPDATE(req: NextRequest, slug: Slug<["teamId"]>) {
  const id = Number(slug.params.teamId);
  const body = await req.json();
  const data = teamSchema.partial().safeParse(body);
  if (!data.success) {
    return new Response(data.error.message, { status: 400 });
  }

  const _ = await db.team.update({
    where: { id },
    data: data.data,
  });

  return Response.json({ data: "OK" });
}
