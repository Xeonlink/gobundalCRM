import JWT from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.password) {
    return new Response("Password is required", { status: 400 });
  }
  const password = body.password;

  if (password !== process.env.KIOSK_PASSWORD) {
    return new Response("Password is incorrect", { status: 401 });
  }

  const jwt = JWT.sign("여기서_발급되었습니다.", process.env.KIOSK_JWT_SECRET, {
    expiresIn: "1h",
  });

  const res = new Response("OK", { status: 200 });
  res.headers.set("Set-Cookie", `token=${jwt}; Secure; HttpOnly; SameSite=Strict`);
  return res;
}
