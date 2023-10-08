import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loading() {
  return (
    <main>
      <ol className="flex items-center justify-center bg-white text-sm">
        <li className="p-3 transition-all hover:scale-110 hover:text-orange-400">
          <a href="#" className="focus:underline">
            전체상품
          </a>
        </li>
        <li className="text-base-300">|</li>
        <li className="p-3 transition-all hover:scale-110 hover:text-orange-400">
          <a href="#" className="focus:underline">
            명품제주감귤
          </a>
        </li>
        <li className="text-base-300">|</li>
        <li className="p-3 transition-all hover:scale-110 hover:text-orange-400">
          <a href="#" className="focus:underline">
            수산물
          </a>
        </li>
        <li className="text-base-300">|</li>
        <li className="p-3 transition-all hover:scale-110 hover:text-orange-400">
          <a href="#" className="focus:underline">
            제주수제상품
          </a>
        </li>
        <li className="text-base-300">|</li>
        <li className="p-3 transition-all hover:scale-110 hover:text-orange-400">
          <a href="#" className="focus:underline">
            제주청정 농산물
          </a>
        </li>
        <li className="text-base-300">|</li>
        <li className="p-3 transition-all hover:scale-110 hover:text-orange-400">
          <a href="#" className="focus:underline">
            제주특산물
          </a>
        </li>
      </ol>

      <div className="m-auto flex min-h-screen max-w-7xl items-start justify-center gap-4 px-2 pb-4">
        <FontAwesomeIcon icon={faSpinner} fontSize={50} className="inline-block animate-spin" />
        {/* 로딩중... */}
      </div>
    </main>
  );
}
