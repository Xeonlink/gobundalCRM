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
            <h1 className="mb-5 text-4xl font-bold">주문 관리</h1>
            <p className="">
              고객 및 손님들이 남길 주문을 관리합니다. <br />
              처음 주문한 사람은 자동으로 고객으로 등록됩니다.
            </p>
          </div>
        </div>
      </header>
      {props.children}
    </>
  );
}
