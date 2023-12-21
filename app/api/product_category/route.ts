import { NextRequest } from "next/server";
import { db } from "../utils";

export async function GET(req: NextRequest) {
  const productCategories = await db.productCategory.findMany();

  return Response.json({ data: productCategories });
}
