import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LayoutProps } from "@/extra/type";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout(props: LayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    const pathname = headers().get("x-pathname");
    redirect("/signin" + (!pathname ? "" : `?callbackurl=${encodeURIComponent(pathname)}`));
  }

  return <>{props.children}</>;
}
