"use client";

import IcoLogo from "@/public/icons/logo.png";
import {
  faArrowRightToBracket,
  faCartShopping,
  faPeopleGroup,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ImgIcon } from "./ImgIcon";

export function AdminNavbar(props: { path?: string }) {
  const { path = "" } = props;

  return (
    <div className='overflow-x-scroll shadow-lg p-3 scrollbar-hidden'>
      <div className='w-max flex gap-3 items-center'>
        <Link
          href='/dashboard'
          className='btn px-3 py-2 aria-selected:scale-110'
          aria-selected={path.startsWith("dashboard")}
        >
          <ImgIcon src={IcoLogo} alt='gobundal_logo' fontSize={20} /> 대시보드
        </Link>

        <div className='saperator text-white'>|</div>

        <Link
          href='/kiosk/teams'
          className='btn px-3 py-2 aria-selected:scale-110'
          aria-selected={path.startsWith("/kiosk/teams")}
        >
          <FaIcon icon={faPeopleGroup} /> 팀 키오스크
        </Link>

        <Link
          href='/kiosk/orders'
          className='btn px-3 py-2 aria-selected:scale-110'
          aria-selected={path.startsWith("/kiosk/orders")}
        >
          <FaIcon icon={faReceipt} /> 송장 키오스크
        </Link>

        <div className='saperator text-white'>|</div>

        <Link
          href='teams'
          className='btn px-3 py-2 aria-selected:scale-110'
          aria-selected={path.startsWith("teams")}
        >
          <FaIcon icon={faPeopleGroup} /> 팀 관리
        </Link>

        <Link
          href='orders'
          className='btn px-3 py-2 aria-selected:scale-110'
          aria-selected={path.startsWith("orders")}
        >
          <FaIcon icon={faReceipt} /> 주문 관리
        </Link>

        <Link
          href='products'
          className='btn px-3 py-2 aria-selected:scale-110'
          aria-selected={path.startsWith("orders")}
        >
          <FaIcon icon={faCartShopping} /> 상품 관리
        </Link>

        <div className='saperator text-white'>|</div>

        <Link href='/login' className='btn px-3 py-2'>
          <FaIcon icon={faArrowRightToBracket} rotation={180} /> 로그아웃
        </Link>
      </div>
    </div>
  );
}
