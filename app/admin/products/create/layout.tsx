import { LayoutProps } from "@/extra/type";
import React from "react";

export default function Layout(props: LayoutProps<{}, { modal: React.ReactNode }>) {
  return (
    <>
      {props.children}
      {props.modal}
    </>
  );
}
