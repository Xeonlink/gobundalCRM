import IcoLogo from "@/public/icons/logo_transparent.png";
import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-200 to-green-200">
      <div className="p-3">
        <Image
          src={IcoLogo}
          alt="gobundal-logo"
          width={250}
          height={250}
          placeholder="blur"
          className="m-auto my-8"
        />
        {/* {props.children} */}
      </div>
    </main>
  );
}
