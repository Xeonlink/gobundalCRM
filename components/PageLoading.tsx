import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function PageLoading() {
  return (
    <main className='text-center h-full flex-1 flex items-center justify-center'>
      <FontAwesomeIcon icon={faSpinner} fontSize={50} className='animate-spin inline-block' />
      {/* 로딩중... */}
    </main>
  );
}
