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
            <h1 className="mb-5 text-4xl font-bold">자료관리</h1>
            <p className="">
              상품이미지 및 상품설명 등에 사용되는 자료를 관리합니다. <br />
              상품에서 사용되고 있는 자료를 삭제할 경우 상품의 이미지가 없어질 수 있으므로, 자료를
              삭제할 때는 주의하여야 합니다.
            </p>
          </div>
        </div>
      </header>
      {props.children}
    </>
  );
}
