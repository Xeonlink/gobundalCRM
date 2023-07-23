import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

export default function ProductsPage() {
  const navigate = useRouter();
  const path = usePathname();
  const auth = useAuth({
    unAuthorized: () => navigate.push(`/login?url=${path}`),
  });

  return <div></div>;
}
