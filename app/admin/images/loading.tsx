import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loading() {
  return (
    <main className="flex h-full min-h-screen flex-1 items-center justify-center text-center">
      <FontAwesomeIcon icon={faSpinner} fontSize={50} className="inline-block animate-spin" />
      {/* 로딩중... */}
    </main>
  );
}
