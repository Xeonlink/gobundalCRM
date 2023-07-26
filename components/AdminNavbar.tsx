"use client";

import IcoLogo from "@/public/icons/logo_transparent.png";
import {
  faArrowRightToBracket,
  faCartPlus,
  faCartShopping,
  faChartLine,
  faPeopleGroup,
  faReceipt,
  faRightLeft,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ImgIcon } from "./ImgIcon";
import { usePathname } from "next/navigation";
import { useToggle } from "@/hooks/useToggle";

const link = (className: TemplateStringsArray) => {
  return `p-2 block hover:bg-orange-100 rounded-md transition-all duration-300 hover:text-black hover:bg-opacity-80 aria-selected:shadow-md ${className.join(
    " "
  )}`;
};

export function AdminNavbar() {
  const path = usePathname();
  const shrink = useToggle(true);

  return (
    <nav
      className={`overflow-x-scroll bg-black text-white bg-opacity-70 w-12 aria-expanded:w-40 transition-all duration-500`}
      aria-expanded={!shrink.isOn}
    >
      <div className='h-full flex flex-col p-2 gap-2'>
        <div className='text-center bg-orange-100 rounded-md bg-opacity-50 min-w'>
          <ImgIcon src={IcoLogo} alt='곱은달 로고' fontSize={60} />
        </div>

        <div className='expander flex-1 space-y-2 overflow-auto min-w-max scrollbar-hidden'>
          <Link href='/dashboard' className={link``} aria-selected={path.startsWith("/dashboard")}>
            <FaIcon className='mr-2' width={20} icon={faChartLine} /> 대시보드
          </Link>

          <Link href='/kiosk/teams' className={link``}>
            <FaIcon className='mr-2' width={20} icon={faUserPlus} /> 팀 키오스크
          </Link>

          <Link href='/kiosk/orders' className={link``}>
            <FaIcon className='mr-2' width={20} icon={faCartPlus} /> 송장 키오스크
          </Link>

          <Link href='teams' className={link``} aria-selected={path.startsWith("/admin/teams")}>
            <FaIcon className='mr-2' width={20} icon={faPeopleGroup} /> 팀 관리
          </Link>

          <Link href='orders' className={link``}>
            <FaIcon className='mr-2' width={20} icon={faReceipt} /> 주문 관리
          </Link>

          <Link href='products' className={link``}>
            <FaIcon className='mr-2' width={20} icon={faCartShopping} /> 상품 관리
          </Link>
        </div>

        <div className='min-w-max space-y-2'>
          <Link href='/login' className={link``}>
            <FaIcon className='mr-2' width={20} icon={faArrowRightToBracket} rotation={180} />{" "}
            로그아웃
          </Link>

          <button type='button' className={link`text-start w-full`} onClick={shrink.toggle}>
            <FaIcon className='mr-2' width={20} icon={faRightLeft} rotation={180} /> 접기
          </button>
        </div>
      </div>
    </nav>
  );
}
