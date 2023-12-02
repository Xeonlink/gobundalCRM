import { ModalPlacer } from "@/extra/modal";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import "./globals.css";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { ClientSessionProvider } from "@/components/ClientSessionProvider";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "GobundalCRM",
  description: "곱은달 농장 소객관리 통합 플랫폼",
};

export default function RootLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <html lang="ko">
      <ReactQueryProvider>
        <ClientSessionProvider>
          {children}
          <ModalPlacer />
        </ClientSessionProvider>
      </ReactQueryProvider>
    </html>
  );
}
