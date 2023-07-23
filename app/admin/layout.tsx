import { LayoutParam } from "@/extra/type";
import { AdminNavbar } from "../../components/AdminNavbar";

export default function AdminLayout(props: LayoutParam) {
  const { children } = props;

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}
