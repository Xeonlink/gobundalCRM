import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "@/components/FaIcon";

export default function Loading() {
  return (
    <div className='text-center h-10'>
      <FaIcon icon={faSpinner} width={30} height={30} className='animate-spin inline-block' />
      {/* 로딩중... */}
    </div>
  );
}
