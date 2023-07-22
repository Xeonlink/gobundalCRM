import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function LoadingSpinner() {
  return (
    <div className='text-center h-10'>
      <FontAwesomeIcon
        icon={faSpinner}
        width={30}
        height={30}
        className='animate-spin inline-block'
      />
      {/* 로딩중... */}
    </div>
  );
}
