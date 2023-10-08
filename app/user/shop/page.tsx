"use client";

import { useProducts } from "@/api/products";
import { useCart } from "@/hooks/useCart";
import { faCartPlus, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const navigate = useRouter();
  const products = useProducts();
  const cart = useCart();

  return (
    <main className="bg-base-100">
      {/* 카테고리 */}
      <ol className="container m-auto flex flex-wrap items-center justify-center gap-2 bg-white p-2 text-center text-sm">
        <li>
          <Link href="/user/shop?category=all" className="dsy-btn">
            전체상품
          </Link>
        </li>
        <li>
          <Link href="/user/shop?categoty=명품제주감귤" className="dsy-btn">
            명품제주감귤
          </Link>
        </li>
        <li>
          <Link href="/user/shop?categoty=수산물" className="dsy-btn">
            수산물
          </Link>
        </li>
        <li>
          <Link href="/user/shop?categoty=제주수제상품" className="dsy-btn">
            제주수제상품
          </Link>
        </li>
        <li>
          <Link href="/user/shop?categoty=제주청정농산물" className="dsy-btn">
            제주청정농산물
          </Link>
        </li>
        <li>
          <Link href="/user/shop?categoty=제주특산물" className="dsy-btn">
            제주특산물
          </Link>
        </li>
      </ol>

      {/* 상품 진열장 */}
      <ol className="container m-auto mb-4 grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2 px-2 sm:gap-4 sm:px-4">
        {products?.data?.data.map((item) => (
          <li
            key={item.id}
            className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40 transition-all duration-300 max-sm:dsy-card-side"
            onDoubleClick={() => navigate.push(`./shop/${item.id}`)}
          >
            <Link href={`/user/shop/${item.id}`} className="contents">
              <figure>
                <Image
                  src={item.imgSrc}
                  alt={item.name}
                  width={450}
                  height={300}
                  className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105 max-sm:w-40"
                />
              </figure>
              <div className="dsy-card-body gap-0">
                <span className="text-orange-500">무료배송</span>
                <h2>{item.name}</h2>
                <p className="min-w-max">
                  <span className="text-lg text-[#e63740]">
                    {item.isSale
                      ? Math.round((1 - item.salePrice / item.price) * 100) + "%"
                      : item.price === 0
                      ? "100%"
                      : ""}
                  </span>{" "}
                  <span className="text-xl font-bold">
                    {item.isSale
                      ? item.salePrice.toLocaleString()
                      : item.price === 0
                      ? "Free"
                      : item.price.toLocaleString()}
                  </span>
                  {item.price === 0 ? " " : "원 "}
                  <span className="text-[#999999] line-through max-sm:hidden">
                    {item.isSale && item.price.toLocaleString() + "원"}
                  </span>
                </p>
              </div>
            </Link>
            <div className="dsy-join w-full rounded-none max-sm:hidden">
              <button
                type="button"
                className="dsy-join-item dsy-btn flex-1 border-none bg-orange-100"
                onClick={() => cart.setCandidate(item)}
              >
                <FontAwesomeIcon icon={faCartPlus} /> 장바구니
              </button>
              <Link
                href="/user/payment"
                type="button"
                className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
                onClick={() => {
                  cart.reset();
                  cart.addProduct(item);
                }}
              >
                <FontAwesomeIcon icon={faCreditCard} /> 구매
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
