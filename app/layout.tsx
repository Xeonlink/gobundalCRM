import { ClientSessionProvider } from "@/components/ClientSessionProvider";
import { ModalPlacer } from "@/extra/modal";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { PropsWithChildren } from "react";
import { ReactQueryProvider } from "./ReactQueryProvider";
import "./globals.css";
import { authOptions } from "./api/auth/[...nextauth]/route";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "GobundalCRM",
  description: "곱은달 농장 소객관리 통합 플랫폼",
};

export default async function RootLayout(props: PropsWithChildren) {
  const { children } = props;

  const session = await getServerSession(authOptions);

  return (
    <html lang="ko">
      <ReactQueryProvider>
        <ClientSessionProvider session={session}>
          {children}
          <ModalPlacer />
        </ClientSessionProvider>
      </ReactQueryProvider>
    </html>
  );
}
