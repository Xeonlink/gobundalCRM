import { LayoutParam } from "@/extra/type";
import { AdminNavbar } from "../../components/AdminNavbar";

export default function Layout(props: LayoutParam) {
  const { children } = props;

  return (
    <body className="flex min-h-screen bg-gradient-to-b from-orange-200 to-green-200">
      <AdminNavbar />
      {children}
    </body>
  );
}
