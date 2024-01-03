import { LayoutProps } from "@/extra/type";
import ImgBanner from "@/public/images/banner1.jpg";

export default function Layout(props: LayoutProps) {
  return (
    <>
      <header
        className="dsy-hero relative h-52"
        style={{ backgroundImage: `url(${ImgBanner.src})` }}
      >
        <div className="dsy-hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            <h1 className="mb-5 text-4xl font-bold">곱은달 감귤체험</h1>
            <p className="">
              곱은달농장에서 펼처지는 감귤체험은 오직 제주에서만 즐길 수 있는 오감 만족 체험이며,
              곱은달 귤아저씨의 이야기보따리가 있는 제주이야기를 들을 기회입니다.
            </p>
          </div>
        </div>
      </header>
      {props.children}
    </>
  );
}
