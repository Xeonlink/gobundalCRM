import { NextRequest } from "next/server";
import { db } from "../utils";

export async function GET(req: NextRequest) {
  const products = await db.product.findMany({
    include: {
      images: true,
      category: true,
    },
  });

  return Response.json({ data: products });
}
