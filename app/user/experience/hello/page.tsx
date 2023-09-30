import ImgSample1 from "@/public/images/sample1.jpg";
import Image from "next/image";

export default function Page() {
  return (
    <main className="bg-base-100">
      <section className="dsy-hero min-h-[300px] pt-5">
        <div className="dsy-hero-content flex-col lg:flex-row">
          <Image
            src={ImgSample1}
            alt="샘플이미지"
            className="max-w-full rounded-lg shadow-2xl sm:max-w-sm"
          />
          <div>
            <h1 className="text-3xl font-bold">Memory</h1>
            <p className="max-w-lg py-6">
              제주를 여행한다는 것은 특별하고 소중한 추억 하나를 남기고 가는 것과 같습니다. 제주
              에서는 유일하게 어린이들을 위한 감귤체험농장으로 7세 이하의 어린이는 누구나 무료로
              감귤을 수확할 수 있는 체험이 이루어집니다. 엄마, 아빠와 함께 시간 가는 줄 모르게 농장
              전체를 돌아다니다 보면 어느새 농장주인이 된 듯한 표정으로 아이들의 가슴에는 꿈이
              자라납니다.
            </p>
          </div>
        </div>
      </section>
      <section className="dsy-hero min-h-[300px]">
        <div className="dsy-hero-content flex-col lg:flex-row-reverse">
          <Image
            src={ImgSample1}
            alt="샘플이미지"
            className="max-w-full rounded-lg shadow-2xl sm:max-w-sm"
          />
          <div>
            <h1 className="text-3xl font-bold">Special</h1>
            <p className="max-w-lg py-6">
              시간제한 없이 마음껏 먹어보는 체험과 집으로 돌아갈 때는 1인당 1kg을 직접 수확하여
              가져가는 이색적인 체험을 즐길 수 있는 제주도 최고의 곱은달감귤체험농장입니다. 농부의
              마음으로 제주 청정지역의 농산물을 추천하여 체험 가족 식탁에 올려드리겠습니다.
              곱은달감귤체험농장은 가족입니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
