import { NextRequest } from "next/server";
import { Slug, db } from "../../utils";

export async function GET(req: NextRequest, slug: Slug<["productId"]>) {
  const id = Number(slug.params.productId);

  const product = await db.product.findFirst({ where: { id } });
  if (!product) {
    return new Response("Product is not exist", { status: 404 });
  }

  return Response.json(product);
}
