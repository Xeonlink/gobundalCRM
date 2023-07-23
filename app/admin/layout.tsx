import { LayoutParam } from "@/extra/type";
import { AdminNavbar } from "../../components/AdminNavbar";
import { RouteGuard } from "@/components/RouteGuard";

export default function AdminLayout(props: LayoutParam) {
  const { children } = props;

  return (
    <RouteGuard>
      <AdminNavbar />
      {children}
    </RouteGuard>
  );
}
