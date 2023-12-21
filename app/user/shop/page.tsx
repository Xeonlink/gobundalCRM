"use client";

import { PageProps } from "@/extra/type";
import { useCart } from "@/hooks/useCart";
import { faCartPlus, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cache, use } from "react";
import { getProductCategories } from "../action";
import { getProductsByCategory } from "./actions";

const getProductCategoriesCached = cache(getProductCategories);
const getProductsByCategoryCached = cache(getProductsByCategory);

export default function Page(props: PageProps<{}, { category: string }>) {
  const categoryId = props.searchParams.category;
  const navigate = useRouter();
  const productCategories = use(getProductCategoriesCached());
  const products = use(getProductsByCategoryCached(+categoryId));
  const cart = useCart();

  return (
    <main className="min-h-screen">
      {/* 카테고리 */}
      <ol className="container m-auto flex flex-wrap items-center justify-center gap-2 bg-white p-2 text-center text-sm">
        <li>
          <Link href="shop?category=all" className="dsy-btn">
            전체상품
          </Link>
        </li>
        {productCategories.map((item) => (
          <li key={item.id}>
            <Link replace href={`shop?category=${item.name}`} className="dsy-btn">
              {item.name}
            </Link>
          </li>
        ))}
      </ol>

      {/* 상품 진열장 */}
      <ol className="container m-auto mb-4 grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(220px,max-content))] gap-2 px-2 sm:gap-4 sm:px-4">
        {products.map((item) => (
          <li
            key={item.id}
            className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40 transition-all duration-300 max-sm:dsy-card-side"
            onDoubleClick={() => navigate.push(`./shop/${item.id}`)}
          >
            <Link href={`shop/${item.id}`} className="contents">
              <figure>
                <Image
                  src={item.images[0].src}
                  alt={item.name}
                  width={450}
                  height={300}
                  className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105 max-sm:w-40"
                  priority
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
