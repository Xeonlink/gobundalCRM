import ImgBanner from "@/public/images/banner1.jpg";
import Image from "next/image";
import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      <header className="dsy-hero relative h-64">
        <Image
          src={ImgBanner}
          alt="베너 이미지"
          className="h-full w-full object-cover"
          placeholder="blur"
          priority
        />
        <div className="dsy-hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            <h1 className="mb-5 text-4xl font-bold">상품 카테고리 관리</h1>
            <p className="">
              홈페이지에서 고객에게 보여질 상품의 카테고리를 등록하고 관리합니다. <br />
              상품을 등록할 때 카테고리를 선택하면 해당 카테고리에 상품이 등록됩니다.
            </p>
          </div>
        </div>
      </header>
      {props.children}
    </>
  );
}
