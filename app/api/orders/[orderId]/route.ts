import { NextRequest } from "next/server";
import { Slug, db } from "../../utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, slug: Slug<["orderId"]>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = Number(slug.params.orderId);

  const order = await db.order.findFirst({
    where: { id },
    include: {
      products: true,
    },
  });
  if (!order) {
    return new Response("Order is not found", { status: 404 });
  }

  return Response.json(order);
}

export async function DELETE(req: NextRequest, slug: Slug<["orderId"]>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = Number(slug.params.orderId);

  const _ = await db.order.delete({
    where: { id },
  });

  return Response.json({ success: true });
}
