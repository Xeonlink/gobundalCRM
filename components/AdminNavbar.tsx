"use client";

import { cn } from "@/extra/utils";
import { useToggle } from "@/hooks/useToggle";
import IcoLogo from "@/public/icons/logo_transparent.png";
import {
  faArrowRightToBracket,
  faCartShopping,
  faChartLine,
  faGear,
  faImage,
  faPeopleGroup,
  faPerson,
  faReceipt,
  faRobot,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const link = (...inputs: clsx.ClassValue[]) => {
  return cn(
    "p-2 block bg-orange-100 bg-opacity-0 rounded-md transition-all duration-300 hover:bg-opacity-10 aria-selected:bg-opacity-40 min-w-max",
    ...inputs,
  );
};

export function AdminNavbar() {
  const path = usePathname();
  const kioskToggle = useToggle(false);
  const manageToggle = useToggle(false);

  const isDashboard = path.startsWith("/dashboard");
  const isAdminDisplay = path.startsWith("/admin/display");
  const isAdminTeams = path.startsWith("/admin/teams");
  const isAdminOrders = path.startsWith("/admin/orders");
  const isAdminProducts = path.startsWith("/admin/products");
  const isAdminCustomers = path.startsWith("/admin/customers");
  const isAdminAssets = path.startsWith("/admin/assets");

  return (
    <nav className="flex overflow-hidden bg-black bg-opacity-70 text-sm text-white transition-all duration-500 md:h-screen md:w-12 md:flex-col md:flex-wrap md:hover:w-40">
      <div className="p-2 max-md:h-full md:w-full">
        <Image
          src={IcoLogo}
          alt="곱은달 로고"
          className="rounded-md bg-orange-100 bg-opacity-50 max-md:w-9"
        />
      </div>

      <div className="scrollbar-hidden flex w-full flex-1 gap-2 overflow-auto p-2 md:flex-col">
        <ul className="flex gap-2 md:flex-col">
          <li>
            <Link href="/dashboard" className={link``} aria-selected={isDashboard}>
              <FaIcon className="md:mr-2 md:w-5" icon={faChartLine} /> 대시보드
            </Link>
          </li>
          <li>
            <Link href="/admin/display" className={link``} aria-selected={isAdminDisplay}>
              <FaIcon className="md:mr-2 md:w-5" icon={faTv} /> 디스플레이
            </Link>
          </li>
        </ul>

        <div className="h-5 min-w-[1px] max-w-[8rem] self-center bg-white opacity-40 md:h-[1px] md:w-full"></div>

        <ul className="flex min-w-max gap-1 md:flex-col">
          <li className={`peer p-2 opacity-60 ${kioskToggle.isOn && "open"}`}>
            <button type="button" className="min-w-max" onClick={kioskToggle.toggle}>
              <FaIcon className="md:mr-2 md:w-5" icon={faRobot} /> 키오스크
            </button>
          </li>
          <li className="hidden peer-[.open]:block md:block">
            <Link href="/kiosk/teams" className={link``}>
              <FaIcon className="md:mr-2 md:w-5" icon={faPeopleGroup} /> 팀
            </Link>
          </li>
          <li className="hidden peer-[.open]:block md:block">
            <Link href="/kiosk/orders" className={link``}>
              <FaIcon className="md:mr-2 md:w-5" icon={faReceipt} /> 주문
            </Link>
          </li>
        </ul>

        <div className="h-5 min-w-[1px] max-w-[8rem] self-center bg-white opacity-40 md:h-[1px] md:w-full"></div>

        <ul className="flex min-w-max flex-1 gap-1 md:flex-col">
          <li className={`peer p-2 opacity-60 ${manageToggle.isOn && "open"}`}>
            <button type="button" className="min-w-max" onClick={manageToggle.toggle}>
              <FaIcon className="md:mr-2 md:w-5" icon={faGear} /> 관리
            </button>
          </li>
          <li className="hidden peer-[.open]:block md:block">
            <Link href="teams" className={link``} aria-selected={isAdminTeams}>
              <FaIcon className="md:mr-2 md:w-5" icon={faPeopleGroup} /> 팀
            </Link>
          </li>
          <li className="hidden peer-[.open]:block md:block">
            <Link href="orders" className={link``} aria-selected={isAdminOrders}>
              <FaIcon className="md:mr-2 md:w-5" icon={faReceipt} /> 주문
            </Link>
          </li>
          <li className="hidden peer-[.open]:block md:block">
            <Link href="products" className={link``} aria-selected={isAdminProducts}>
              <FaIcon className="md:mr-2 md:w-5" icon={faCartShopping} /> 상품
            </Link>
          </li>
          <li className="hidden peer-[.open]:block md:block">
            <Link href="customers" className={link``} aria-selected={isAdminCustomers}>
              <FaIcon className="md:mr-2 md:w-5" icon={faPerson} /> 고객
            </Link>
          </li>
          <li className="hidden peer-[.open]:block md:block">
            <Link href="assets" className={link``} aria-selected={isAdminAssets}>
              <FaIcon className="md:mr-2 md:w-5" icon={faImage} /> 자료
            </Link>
          </li>
        </ul>
      </div>

      <ul className="p-2">
        <li>
          <Link href="/login" className={link``}>
            <FaIcon className="md:mr-2 md:w-5" icon={faArrowRightToBracket} rotation={180} />{" "}
            로그아웃
          </Link>
        </li>
      </ul>
    </nav>
  );
}
