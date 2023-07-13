import { PropsWithChildren } from "react";
import { AdminNavigator } from "../AdminNavigator";

export default function AdminLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <>
      <AdminNavigator />
      {children}
    </>
  );
}
