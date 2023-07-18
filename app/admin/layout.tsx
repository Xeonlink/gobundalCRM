import { PropsWithChildren } from "react";
import { AdminNavbar } from "../../components/AdminNavbar";
import { RouteGuard } from "@/components/RouteGuard";

export default function AdminLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <RouteGuard>
      <AdminNavbar />
      {children}
    </RouteGuard>
  );
}
