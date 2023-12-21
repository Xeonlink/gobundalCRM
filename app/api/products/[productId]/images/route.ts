import { db } from "@/app/api/utils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, slug: { params: { productId: string } }) {
  const productId = Number(slug.params.productId);

  const images = await db.image.findMany({
    where: {
      products: {
        some: {
          id: productId,
        },
      },
    },
  });

  return Response.json({ data: images });
}
