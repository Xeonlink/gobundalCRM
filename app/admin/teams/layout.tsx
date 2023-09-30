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
            <h1 className="mb-5 text-4xl font-bold">팀 관리</h1>
            <p className="">
              체험장에 방문한 체험고객들의 팀을 관리합니다. <br />
              팀은 체험장에서 체험을 진행할 때 필요한 정보입니다.
            </p>
          </div>
        </div>
      </header>
      {props.children}
    </>
  );
}
