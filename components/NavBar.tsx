import Link from "next/link";
import { ImgIcon } from "./ImgIcon";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faCartPlus,
  faCartShopping,
  faDisplay,
  faImage,
  faPeopleGroup,
  faPerson,
  faReceipt,
  faTable,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar() {
  return (
    <div className="navbar h-fit min-h-0 bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn-sm btn lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <Link href="/kiosk/orders" className="py-2">
                <FaIcon icon={faDisplay} /> 키오스크
              </Link>
              <ul className="p-2">
                <li>
                  <Link href="/kiosk/teams" className="py-2">
                    <FaIcon icon={faUserPlus} /> 팀 키오스크
                  </Link>
                </li>
                <li>
                  <Link href="/kiosk/orders" className="py-2">
                    <FaIcon icon={faCartPlus} /> 송장 키오스크
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="orders" className="py-2">
                <FaIcon icon={faTable} /> 관리
              </Link>
              <ul className="p-2">
                <li>
                  <Link href="teams" className="py-2">
                    <FaIcon icon={faPeopleGroup} /> 팀 관리
                  </Link>
                </li>
                <li>
                  <Link href="orders" className="py-2">
                    <FaIcon icon={faReceipt} /> 주문 관리
                  </Link>
                </li>
                <li>
                  <Link href="products" className="py-2">
                    <FaIcon icon={faCartShopping} /> 상품 관리
                  </Link>
                </li>
                <li>
                  <Link href="customers" className="py-2">
                    <FaIcon icon={faPerson} /> 고객 관리
                  </Link>
                </li>
                <li>
                  <Link href="assets" className="py-2">
                    <FaIcon icon={faImage} /> 자료 관리
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn-ghost btn-sm btn text-xl normal-case">
          <ImgIcon src="/icons/ci.png" alt="menu" width={200} height={100} />
        </a>
      </div>
      <div className="navbar-end">
        <a className="btn-sm btn">
          <FaIcon icon={faArrowRightToBracket} rotation={180} /> 로그아웃
        </a>
      </div>
    </div>
  );
}
