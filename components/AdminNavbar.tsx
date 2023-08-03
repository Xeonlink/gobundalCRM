"use client";

import { cn } from "@/extra/utils";
import { useToggle } from "@/hooks/useToggle";
import IcoLogo from "@/public/icons/logo_transparent.png";
import {
  faArrowRightToBracket,
  faCartPlus,
  faCartShopping,
  faChartLine,
  faPeopleGroup,
  faPerson,
  faReceipt,
  faRightLeft,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImgIcon } from "./ImgIcon";

const link = (...inputs: clsx.ClassValue[]) => {
  return cn(
    "p-2 block hover:bg-orange-100 rounded-md transition-all duration-300 hover:text-black hover:bg-opacity-80 aria-selected:shadow-md",
    ...inputs,
  );
};

export function AdminNavbar() {
  const path = usePathname();
  const shrink = useToggle(true);

  const isDashboard = path.startsWith("/dashboard");
  const isAdminTeams = path.startsWith("/admin/teams");
  const isAdminOrders = path.startsWith("/admin/orders");
  const isAdminProducts = path.startsWith("/admin/products");
  const isAdminCustomers = path.startsWith("/admin/customers");

  return (
    <nav
      className={cn(
        "overflow-hidden bg-black bg-opacity-70 text-white transition-all duration-500 aria-expanded:w-40",
        shrink.isOn ? "w-12" : "w-40",
      )}
      onMouseEnter={shrink.off}
      onMouseLeave={shrink.on}
    >
      <div className="flex h-full flex-col gap-2 p-2">
        <div className="min-w rounded-md bg-orange-100 bg-opacity-50 text-center">
          <ImgIcon src={IcoLogo} alt="곱은달 로고" fontSize={60} />
        </div>

        <div className="expander scrollbar-hidden min-w-max flex-1 space-y-2 overflow-auto">
          <Link href="/dashboard" className={link``} aria-selected={isDashboard}>
            <FaIcon className="mr-2" width={20} icon={faChartLine} /> 대시보드
          </Link>

          <Link href="/kiosk/teams" className={link``}>
            <FaIcon className="mr-2" width={20} icon={faUserPlus} /> 팀 키오스크
          </Link>

          <Link href="/kiosk/orders" className={link``}>
            <FaIcon className="mr-2" width={20} icon={faCartPlus} /> 송장 키오스크
          </Link>

          <Link href="teams" className={link``} aria-selected={isAdminTeams}>
            <FaIcon className="mr-2" width={20} icon={faPeopleGroup} /> 팀 관리
          </Link>

          <Link href="orders" className={link``} aria-selected={isAdminOrders}>
            <FaIcon className="mr-2" width={20} icon={faReceipt} /> 주문 관리
          </Link>

          <Link href="products" className={link``} aria-selected={isAdminProducts}>
            <FaIcon className="mr-2" width={20} icon={faCartShopping} /> 상품 관리
          </Link>

          <Link href="customers" className={link``} aria-selected={isAdminCustomers}>
            <FaIcon className="mr-2" width={20} icon={faPerson} /> 고객 관리
          </Link>
        </div>

        <div className="min-w-max space-y-2">
          <Link href="/login" className={link``}>
            <FaIcon className="mr-2" width={20} icon={faArrowRightToBracket} rotation={180} />{" "}
            로그아웃
          </Link>

          <button type="button" className={link`w-full text-start`} onClick={shrink.toggle}>
            <FaIcon className="mr-2" width={20} icon={faRightLeft} rotation={180} /> 접기
          </button>
        </div>
      </div>
    </nav>
  );
}
