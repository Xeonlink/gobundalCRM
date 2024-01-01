"use client";

import { useProducts } from "@/api/products";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import {} from "next/navigation";

const maxRecent = 3;

export function FloatingMenu() {
  const history = u;

  const { data: products } = useProducts();
  const [[start, end], setRecent] = useState([
    0,
    products?.data.length! >= maxRecent ? maxRecent : products?.data.length!,
  ]);

  const nextRecent = () => {
    setRecent(([start, end]) => [start + 1, end + 1]);
  };
  const prevRecent = () => {
    setRecent(([start, end]) => [start - 1, end - 1]);
  };
  const isNextRecentDiabled = end === products?.data.length!;
  const isPrevRecentDiabled = start === 0;

  return (
    <aside className="absolute right-2 top-72 hidden w-20 overflow-hidden rounded-md border-[1px] bg-white lg:block">
      <h5 className="bg-gray-300 p-2 text-center text-sm">최근본상품</h5>
      <ol className="space-y-2 p-1">
        {products?.data.slice(start, end).map((item) => (
          <li key={item.id}>
            <a href={`/user/shop/${item.id}`}>
              <Image
                src={item.images[0].src}
                alt={item.name}
                width={72}
                height={48}
                className="rounded-sm"
              />
              <div className="mt-1 w-full overflow-hidden overflow-ellipsis text-center text-xs">
                {item.name}
              </div>
            </a>
          </li>
        ))}
      </ol>
      <div className="dsy-join w-full">
        <button
          type="button"
          className="dsy-btn dsy-btn-sm dsy-join-item flex-1 rounded-t-none"
          disabled={isPrevRecentDiabled}
          onClick={prevRecent}
        >
          <FontAwesomeIcon icon={faCaretUp} />
        </button>
        <button
          type="button"
          className="dsy-btn dsy-btn-sm dsy-join-item flex-1 rounded-t-none"
          disabled={isNextRecentDiabled}
          onClick={nextRecent}
        >
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      </div>
    </aside>
  );
}
