import Image from "next/image";
import Link from "next/link";
import IcoLogo from "@/public/icons/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarDays } from "@fortawesome/free-regular-svg-icons";

export function RootNavigator() {
  return (
    <div className='mb-3 flex gap-3 flex-wrap'>
      <Link
        href='/teams'
        className='bg-white rounded-md shadow-md h-9 flex items-center px-2 hover:-translate-y-1 transition-all duration-300'
      >
        <Image src={IcoLogo} alt='gobundal_logo' width={24} height={24} className='mr-1' />
        <span className='font-bold'>팀 관리</span>
      </Link>
    </div>
  );
}
