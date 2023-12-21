import { NextRequest } from "next/server";
import { Slug, db } from "../../utils";

export async function GET(req: NextRequest, slug: Slug<["orderId"]>) {
  const id = Number(slug.params.orderId);

  const order = await db.order.findFirst({
    where: { id },
    include: { products: { include: { product: true } } },
  });
  if (!order) {
    return new Response("Order is not found", { status: 404 });
  }

  return Response.json(order);
}
