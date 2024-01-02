import { NextRequest } from "next/server";
import { Slug, db } from "../../utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, slug: Slug<["productId"]>) {
  const session = await getServerSession(authOptions);
  if (!session && !session!.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = Number(slug.params.productId);

  const product = await db.product.findFirst({ where: { id } });
  if (!product) {
    return new Response("Product is not exist", { status: 404 });
  }

  return Response.json(product);
}
