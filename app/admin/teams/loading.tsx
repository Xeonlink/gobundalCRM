import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

export default function Loading() {
  return (
    <main className='text-center h-full flex-1 flex items-center justify-center'>
      <FaIcon icon={faSpinner} fontSize={50} className='animate-spin' />
      {/* 로딩중... */}
    </main>
  );
}
