import { LayoutProps } from "@/extra/type";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import JWT from "jsonwebtoken";

export default function Layout(props: LayoutProps) {
  const accessCookie = cookies().get("kiosk-access-token")?.value;
  const pahtname = headers().get("x-pathname");
  if (!accessCookie) {
    redirect(`/kiosk/auth/signin?callbackurl=${pahtname}`);
  }
  const accessToken = JWT.verify(accessCookie, process.env.KIOSK_JWT_SECRET);
  if (typeof accessToken === "string") {
    redirect(`/kiosk/auth/signin?callbackurl=${pahtname}`);
  }
  if (!accessToken.data || accessToken.data !== "FOR_ACCESS") {
    redirect(`/kiosk/auth/signin?callbackurl=${pahtname}`);
  }
  return <>{props.children}</>;
}
