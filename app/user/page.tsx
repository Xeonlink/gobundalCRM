"use client";

import { useProducts, useProductsByCategory } from "@/api/products";
import Img블로그광고 from "@/public/images/blog_ads.jpg";
import Img수산물 from "@/public/images/fishes.jpg";
import Img수제상품 from "@/public/images/hand_made_product.jpg";
import ImgHello2 from "@/public/images/hello2.jpeg";
import Img배송현황 from "@/public/images/shipping_stataus.jpg";
import { faCartPlus, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./style.css";

export default function Page() {
  const products = useProductsByCategory("명품제주감귤");

  return (
    <div>
      <div
        className="dsy-hero h-[450px]"
        style={{ backgroundImage: `url(${ImgHello2.src})`, backgroundPosition: "top" }}
      >
        <div className="dsy-hero-overlay bg-opacity-60"></div>
        <div className="dsy-hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">곱은달농장</h1>
            <p className="mb-5">곱은달농장은 농부의 마음으로 청정지역의 농산물을 선물합니다.</p>
            <Link href="/user/shop?category=all" className="dsy-btn-primary dsy-btn">
              상품 둘러보기
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-20 flex flex-col">
        <h2 className="py-10 text-center text-3xl font-bold">추천 상품</h2>
        <Slider centerMode variableWidth dots swipeToSlide className="pb-4" centerPadding="0px">
          {products.data?.data?.map((item) => (
            <Link
              href={`/user/shop/${item.id}`}
              key={item.id}
              className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40"
              style={{ width: "16rem" }}
            >
              <figure>
                <Image
                  src={item.images[0].src}
                  alt={item.name}
                  width={240}
                  height={160}
                  className="aspect-[3/2] object-cover transition-all duration-300 hover:scale-105"
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
              <div className="dsy-join w-full rounded-none">
                <button
                  type="button"
                  className="dsy-join-item dsy-btn flex-1 border-none bg-orange-100"
                >
                  <FontAwesomeIcon icon={faCartPlus} /> 장바구니
                </button>
                <button
                  type="button"
                  className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200 max-sm:hidden"
                >
                  <FontAwesomeIcon icon={faCreditCard} /> 구매
                </button>
              </div>
            </Link>
          ))}
        </Slider>
        <Link href="/user/shop?category=all" className="dsy-btn m-auto">
          전체보기
        </Link>
      </div>

      <ul className="flex flex-wrap justify-center bg-base-200 py-10 max-sm:p-4">
        <li>
          <ul className="flex justify-center">
            <li>
              <a href="#">
                <Image src={Img수산물} alt="수산물 쇼핑으로 이동" />
              </a>
            </li>
            <li>
              <a href="#">
                <Image src={Img수제상품} alt="수제상품 쇼핑으로 이동" />
              </a>
            </li>
          </ul>
        </li>
        <li>
          <ul className="flex justify-center">
            <li>
              <a href="#">
                <Image src={Img블로그광고} alt="블로그로 이동" />
              </a>
            </li>
            <li>
              <a href="#">
                <Image src={Img배송현황} alt="배송현황으로 이동" />
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <div className="mb-20 flex flex-col">
        <h2 className="py-10 text-center text-3xl font-bold">명품제주감귤</h2>
        <Slider centerMode variableWidth dots swipeToSlide className="pb-4" centerPadding="0px">
          {products.data?.data?.map((item) => (
            <Link
              href={`/user/shop/${item.id}`}
              key={item.id}
              className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40"
              style={{ width: "16rem" }}
            >
              <figure>
                <Image
                  src={item.images[0].src}
                  alt={item.name}
                  width={item.images[0].width}
                  height={item.images[0].height}
                  className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105"
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
              <div className="dsy-join w-full rounded-none">
                <button
                  type="button"
                  className="dsy-join-item dsy-btn flex-1 border-none bg-orange-100"
                  // onClick={() => onProductCartClick(item)}
                >
                  <FontAwesomeIcon icon={faCartPlus} /> 장바구니
                </button>
                <button
                  type="button"
                  className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200 max-sm:hidden"
                >
                  <FontAwesomeIcon icon={faCreditCard} /> 구매
                </button>
              </div>
            </Link>
          ))}
        </Slider>
        <Link href="/user/shop?category=명품제주감귤" className="dsy-btn m-auto">
          전체보기
        </Link>
      </div>
    </div>
  );
}
