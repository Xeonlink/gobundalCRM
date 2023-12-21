import { NextRequest } from "next/server";
import { db } from "../../utils";

export async function GET(req: NextRequest, slug: { params: { categoryId: string } }) {
  const id = Number(slug.params.categoryId);

  const productCategory = await db.productCategory.findFirst({
    where: { id },
  });
  if (!productCategory) {
    return new Response("ProductCategory not found", { status: 404 });
  }

  return Response.json(productCategory);
}
