import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

export default function Loading() {
  return (
    <div className='text-center h-10'>
      <FaIcon icon={faSpinner} fontSize={20} className='animate-spin inline-block' />
      {/* 로딩중... */}
    </div>
  );
}
