import { LayoutProps } from "@/extra/type";
import IcoLogo from "@/public/icons/logo_transparent.png";
import Image from "next/image";

export default function Layout(props: LayoutProps) {
  return (
    <main className="flex h-full min-h-screen items-center justify-center max-sm:flex-col">
      <div className="sm:mr-10">
        <Image
          src={IcoLogo}
          alt="gobundal-logo"
          width={250}
          height={250}
          placeholder="blur"
          className="m-auto my-8"
          priority
        />
      </div>

      {props.children}
    </main>
  );
}
