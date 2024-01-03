import { LayoutProps } from "@/extra/type";
import ImgBanner from "@/public/images/banner1.jpg";
import Script from "next/script";

export default function Layout(props: LayoutProps) {
  return (
    <>
      <header
        className="dsy-hero relative h-52"
        style={{ backgroundImage: `url(${ImgBanner.src})` }}
      >
        <div className="dsy-hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            <h1 className="mb-5 text-4xl font-bold">회원전용</h1>
            <p className="">자연이 숨쉬는 곱은달 감귤체험농장 홈페이지를 찾아주셔서 감사합니다.</p>
          </div>
        </div>
      </header>
      {props.children}
      {/* <Script src="https://cdn.iamport.kr/v1/iamport.js"></Script> */}
    </>
  );
}
