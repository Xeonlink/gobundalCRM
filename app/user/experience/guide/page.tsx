import ImgSample1 from "@/public/images/sample1.jpg";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      {/* 설명창1 */}
      <section className="dsy-hero min-h-[300px] bg-base-100 pt-5">
        <div className="dsy-hero-content flex-col lg:flex-row">
          <Image
            src={ImgSample1}
            alt="샘플이미지"
            className="max-w-full rounded-lg shadow-2xl sm:max-w-sm"
          />
          <div>
            <h2 className="mt-6 text-3xl font-bold">
              감귤따기체험 <span className="max-sm:hidden">이용안내</span>
            </h2>
            <ol className="max-w-lg list-decimal py-6">
              <li className="ml-6">네이버예약을 통해 예약해주세요. (36개월 이상 적용)</li>
              <li className="ml-6">
                <strong>1인 1kg을 직접수확</strong>하여 돌아갈 수 있습니다.
              </li>
              <li className="ml-6">
                <strong>무제한으로 시식</strong>이 가능합니다.
              </li>
              <li className="ml-6">
                가위, 바구니, 장갑등 체험에 필요한 <strong>도구와 재료는 이미 준비</strong>되어
                있습니다.
              </li>
              <li className="ml-6">점심시간은 12:30 ~ 13:30 입니다.</li>
              <li className="ml-6">감귤체험후 다양한 농산물을 구매할 수 있습니다.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* 설명창2 */}
      <section className="dsy-hero min-h-[300px] bg-base-100">
        <div className="dsy-hero-content flex-col lg:flex-row-reverse">
          <Image
            src={ImgSample1}
            alt="샘플이미지"
            className="max-w-full rounded-lg shadow-2xl sm:max-w-sm"
          />
          <div>
            <h2 className="mt-6 text-3xl font-bold">
              청만들기체험 <span className="max-sm:hidden">기간안내</span>
            </h2>
            <ol className="max-w-lg space-y-4 py-6">
              <li className="flex flex-wrap items-center justify-start">
                <span className="min-w-max rounded-full bg-green-800 px-4 py-2 text-white">
                  고농충 청귤(풋귤)청 만들기 체험
                </span>
                <span className="pl-4">8월 1일 ~ 9월 30일</span>
              </li>
              <li className="flex flex-wrap items-center justify-start">
                <span className="rounded-full bg-orange-400 px-4 py-2 text-white">
                  고농충 한라봉청 만들기 체험
                </span>
                <span className="pl-4">10월 1일 ~ 3월 30일</span>
              </li>
              <li className="flex flex-wrap items-center justify-start">
                <span className="rounded-full bg-yellow-500 px-4 py-2 text-white">
                  고농충 하귤청 만들기 체험
                </span>
                <span className="pl-4">4월 1일 ~ 7월 30일</span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
