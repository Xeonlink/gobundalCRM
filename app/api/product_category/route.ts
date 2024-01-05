import { NextRequest } from "next/server";
import { db } from "../utils";
import { z } from "zod";

const productCategorySchema = z.object({
  name: z.string(),
  enabled: z.boolean().default(false),
  descriptoin: z.string().default(""),
});

export async function GET(req: NextRequest) {
  const productCategories = await db.productCategory.findMany();

  return Response.json({ data: productCategories });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const checkItem = productCategorySchema.safeParse(body);
  if (checkItem.success === false) {
    return Response.json({ error: checkItem.error }, { status: 400 });
  }
  const data = checkItem.data;

  const _ = await db.productCategory.create({
    data,
  });

  return new Response("OK", { status: 200 });
}
