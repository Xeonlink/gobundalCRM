import { NextRequest } from "next/server";
import { db } from "../utils";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = session.user.id;

  const cartProducts = await db.cartProduct.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        include: {
          category: true,
          images: true,
        },
      },
    },
  });

  return Response.json({ data: cartProducts });
}
