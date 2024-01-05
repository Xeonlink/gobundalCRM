import { LayoutProps } from "@/extra/type";
import Image from "next/image";
import IcoLogo from "@/public/icons/logo_transparent.png";

export default function Layout(props: LayoutProps) {
  return (
    <main className="p-3">
      <Image
        src={IcoLogo}
        alt="gobundal-logo"
        width={250}
        height={250}
        placeholder="blur"
        className="m-auto my-8"
      />
      {props.children}
    </main>
  );
}
