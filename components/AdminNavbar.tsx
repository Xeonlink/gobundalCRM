"use client";

import IcoLogo from "@/public/icons/logo.png";
import { faArrowRightToBracket, faPeopleGroup, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavbar() {
  const path = usePathname();

  const isDashboard = path.startsWith("/admin/dashboard");
  const isTeams = path.startsWith("/admin/teams");

  return (
    <div className='overflow-x-scroll shadow-lg p-3 scrollbar-hidden'>
      <div className='w-max flex gap-3 items-center'>
        <Link href='/dashboard' className='m-box m-hover px-3 py-2'>
          <Image
            src={IcoLogo}
            alt='gobundal_logo'
            width={24}
            height={24}
            color='#'
            className='mr-1 inline-block align-middle'
          />
          <span>대시보드</span>
        </Link>

        <div className='saperator text-white'>|</div>

        <Link href='/kiosk/teams' className='m-box m-hover px-3 py-2'>
          <FontAwesomeIcon
            icon={faPeopleGroup}
            width={20}
            height={20}
            className='align-middle mr-2'
          />
          <span>팀 키오스크</span>
        </Link>

        <Link href='/kiosk/orders' className='m-box m-hover px-3 py-2'>
          <FontAwesomeIcon
            icon={faReceipt}
            width={20}
            height={20}
            className='align-middle inline-block mr-2'
          />
          <span>송장 키오스크</span>
        </Link>

        <div className='saperator text-white'>|</div>

        <Link href='/admin/teams' className='m-box m-hover px-3 py-2'>
          <FontAwesomeIcon
            icon={faPeopleGroup}
            width={20}
            height={20}
            className='align-middle mr-2'
          />
          <span>팀 관리</span>
        </Link>

        <Link href='/admin/orders' className='m-box m-hover px-3 py-2'>
          <FontAwesomeIcon
            icon={faReceipt}
            width={20}
            height={20}
            className='align-middle inline-block mr-2'
          />
          <span>주문 관리</span>
        </Link>

        <div className='saperator text-white'>|</div>

        <Link href='/login' className='m-box m-hover px-3 py-2'>
          <FontAwesomeIcon
            icon={faArrowRightToBracket}
            width={20}
            height={20}
            rotation={180}
            className='align-middle inline-block mr-2'
          />
          <span>로그아웃</span>
        </Link>
      </div>
    </div>
  );
}
