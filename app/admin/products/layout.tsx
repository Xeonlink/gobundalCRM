import ImgBanner from "@/public/images/banner1.jpg";
import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      <header
        className="dsy-hero relative h-64"
        style={{ backgroundImage: `url(${ImgBanner.src})` }}
      >
        <div className="dsy-hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            <h1 className="mb-5 text-4xl font-bold">상품관리</h1>
            <p className="">
              홈페이지에서 고객에게 보여질 상품을 등록하고 관리합니다. <br />
              상품을 등록하고 활성화하지 않으면 상품이 홈페이지에 노출되지 않습니다.
            </p>
          </div>
        </div>
      </header>
      {props.children}
    </>
  );
}
