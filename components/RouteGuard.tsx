import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export async function RouteGuard(props: PropsWithChildren) {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  return <>{props.children}</>;
}
