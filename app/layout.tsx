import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AdminNavbar } from "../components/AdminNavbar";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { PropsWithChildren } from "react";
import { ModalPlacer } from "@/components/ModalPlacer";
import { ModalProvider } from "@/components/ModalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <html lang='en'>
      <body
        className={`${inter.className} bg-gradient-to-b from-orange-200 to-green-200 w-screen min-h-screen`}
      >
        <ModalProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <ModalPlacer />
        </ModalProvider>
      </body>
    </html>
  );
}
