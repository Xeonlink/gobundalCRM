import { db } from "@/app/api/utils";
import { Refresh } from "@/components/Navigate/Refresh";
import { faArrowsRotate, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const images = await db.image.findMany();

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
        <li>
          {/* Refresh */}
          <Refresh className="dsy-btn-ghost dsy-btn">
            <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
          </Refresh>
        </li>

        <li>
          {/* Create New Image */}
          <Link href="images/create" className="dsy-btn-ghost dsy-btn">
            <FontAwesomeIcon icon={faPlus} /> 자료등록
          </Link>
        </li>
      </ul>

      <ol className="flex flex-wrap justify-center gap-2 p-2">
        {images.map((item) => (
          <li key={item.id} className="h-32 animate-scaleTo1 transition-all hover:scale-105">
            <Link href={`images/${item.id}`}>
              <Image
                src={item.src}
                alt={item.name}
                width={item.width}
                height={item.height}
                priority
                className="h-full w-full rounded-md"
              />
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
