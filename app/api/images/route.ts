import { db } from "@/app/api/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const images = await db.image.findMany();

  return NextResponse.json({ data: images });
}
