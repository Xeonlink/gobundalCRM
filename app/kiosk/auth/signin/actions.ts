"use server";

import JWT from "jsonwebtoken";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export async function kioskSignIn(callbackUrl: string, formData: FormData) {
  const password = String(formData.get("password"));
  if (!password) {
    throw new Error("Password is required");
  }

  if (password !== process.env.KIOSK_PASSWORD) {
    throw new Error("Password is incorrect");
  }

  const accessToken = JWT.sign({ data: "FOR_ACCESS" }, process.env.KIOSK_JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = JWT.sign({ data: "FOR_REFRESH" }, process.env.KIOSK_JWT_SECRET, {
    expiresIn: "1d",
  });

  const requestCookies = cookies();
  requestCookies.set({
    name: "kiosk-access-token",
    value: accessToken,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
  requestCookies.set({
    name: "kiosk-refresh-token",
    value: refreshToken,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
  redirect(callbackUrl, RedirectType.push);
}
