import { csrOnly } from "@/extra/utils";
import {
  faEnvelope,
  faMapLocationDot,
  faMessage,
  faMobileScreen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
const WorkPlaceMap = csrOnly(import("./WorkPlaceMap"));

export default function Page() {
  return (
    <main className="bg-base-100">
      <h2 className="py-10 text-center text-3xl font-bold">오시는 길</h2>

      {/* 지도 컨테이너 */}
      <section className="m-auto aspect-video max-w-5xl px-6">
        <WorkPlaceMap />
      </section>

      {/* 단축버튼 컨테이너 */}
      <section className="flex">
        <ul className="dsy-join m-auto flex-wrap justify-center gap-6 py-14 text-sm">
          <li className="dsy-join-item">
            <Link
              href="https://map.naver.com/p/entry/place/1545445251?c=15.00,0,0,2,dh"
              className="flex items-center gap-4"
            >
              <button type="button" className="dsy-btn h-16 w-16 rounded-full">
                <FontAwesomeIcon icon={faMapLocationDot} fontSize={20} />
              </button>
              <div className="w-36">
                <h5 className="text-base font-bold">지도로 찾아보기</h5>
                <p>
                  제주특별자치도 서귀포시 <br />
                  남원읍 태위로171번길 11
                </p>
              </div>
            </Link>
          </li>
          <li className="dsy-join-item">
            <Link href="tel:01022464151" className="flex items-center gap-4">
              <button type="button" className="dsy-btn h-16 w-16 rounded-full">
                <FontAwesomeIcon icon={faMobileScreen} fontSize={20} />
              </button>
              <div className="w-36">
                <h5 className="text-base font-bold">전화걸기</h5>
                <p>010-2246-4151</p>
              </div>
            </Link>
          </li>
          <li className="dsy-join-item">
            <Link href="sms:01022464151" className="flex items-center gap-4">
              <button type="button" className="dsy-btn h-16 w-16 rounded-full">
                <FontAwesomeIcon icon={faMessage} fontSize={20} />
              </button>
              <div className="w-36">
                <h5 className="text-base font-bold">문자보내기</h5>
                <p>010-2246-4151</p>
              </div>
            </Link>
          </li>
          <li className="dsy-join-item">
            <Link href="mailto:dia_sj0501@naver.com" className="flex items-center gap-4">
              <button type="button" className="dsy-btn h-16 w-16 rounded-full">
                <FontAwesomeIcon icon={faEnvelope} fontSize={20} />
              </button>
              <div className="w-36">
                <h5 className="text-base font-bold">E-mail</h5>
                <p>
                  dia_sj0501@<span className="max-sm:hidden">naver.com</span>
                  <span className="sm:hidden">네이버</span>
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
