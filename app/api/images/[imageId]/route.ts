import { NextRequest } from "next/server";
import { db } from "../../utils";

export async function GET(req: NextRequest, slug: { params: { imageId: string } }) {
  const id = Number(slug.params.imageId);

  const image = await db.image.findFirst({ where: { id } });
  if (!image) {
    return new Response("image not found", { status: 404 });
  }

  return Response.json(image);
}
