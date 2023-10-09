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
            <h1 className="mb-5 text-4xl font-bold">고객관리</h1>
            <p className="">
              상품을 구해했던 고객에 대한 정보를 관리합니다. <br />
              상품을 1번이상 보낸 사람은 고객으로 자동 등록되며, 웹사이트에 가입한 사용자와는 별도로
              관리됩니다.
            </p>
          </div>
        </div>
      </header>
      {props.children}
    </>
  );
}
