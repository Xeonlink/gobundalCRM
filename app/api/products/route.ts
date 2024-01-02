import { NextRequest } from "next/server";
import { db } from "../utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session && !session!.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const products = await db.product.findMany({
    include: {
      images: true,
      category: true,
    },
  });

  return Response.json({ data: products });
}
