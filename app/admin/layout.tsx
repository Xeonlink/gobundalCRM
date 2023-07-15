import { PropsWithChildren } from "react";
import { AdminNavigator } from "../../components/AdminNavigator";

export default function AdminLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <>
      <AdminNavigator />
      {children}
    </>
  );
}
