import { LayoutParam } from "@/extra/type";
import ImgLogo from "@/public/icons/ci.png";
import {
  faArrowRightFromBracket,
  faBars,
  faCartShopping,
  faChartLine,
  faGear,
  faImage,
  faMobileScreen,
  faPeopleGroup,
  faPerson,
  faReceipt,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { NavLink } from "../user/NavLink";

export default function Layout(props: LayoutParam) {
  const { children } = props;

  return (
    <body>
      {/* 네비게이션 바 */}
      <nav className="container dsy-navbar sticky top-0 z-10 m-auto rounded-b-lg bg-base-100">
        <div className="dsy-navbar-start">
          <div className="dsy-dropdown">
            <label tabIndex={0} className="dsy-btn-ghost dsy-btn lg:hidden">
              <FontAwesomeIcon icon={faBars} fontSize={16} />
            </label>
            <ul
              tabIndex={0}
              className="dsy-dropdown-content dsy-menu rounded-box dsy-menu-sm z-10 mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <Link href="/dashboard">대시보드</Link>
              </li>
              <li>
                <Link href="/admin/display">디스플레이</Link>
              </li>
              <li>
                <NavLink href="/kiosk/teams" check="/kiosk">
                  키오스크
                </NavLink>
                <ul className="p-2">
                  <li>
                    <NavLink href="/kiosk/teams">팀</NavLink>
                  </li>
                  <li>
                    <NavLink href="/kiosk/orders">주문</NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <NavLink href="/admin/teams" check="/admin">
                  관리
                </NavLink>
                <ul className="p-2">
                  <li>
                    <NavLink href="/admin/teams">팀</NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/orders">주문</NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/products">상품</NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/customers">고객</NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/* 메인로고 */}
          <Link href="/user" className="dsy-btn-ghost dsy-btn py-2 text-xl normal-case">
            <Image src={ImgLogo} priority alt="곱은달농장로고" className="h-full w-full" />
          </Link>
        </div>

        <div className="dsy-navbar-center hidden lg:flex">
          <ul className="dsy-menu dsy-menu-horizontal px-1">
            <li tabIndex={0}>
              <Link href="/dashboard">
                <FontAwesomeIcon icon={faChartLine} /> 대시보드
              </Link>
            </li>
            <li tabIndex={1}>
              <Link href="/admin/display">
                <FontAwesomeIcon icon={faTv} /> 디스플레이
              </Link>
            </li>
            <li tabIndex={2}>
              <details className="z-10 min-w-max">
                <summary>
                  <FontAwesomeIcon icon={faMobileScreen} /> 키오스크
                </summary>
                <ul className="w-full">
                  <li>
                    <NavLink href="/kiosk/teams">
                      <FontAwesomeIcon icon={faPeopleGroup} /> 팀
                    </NavLink>
                  </li>
                  <li>
                    <NavLink href="/kiosk/orders/products">
                      <FontAwesomeIcon icon={faReceipt} /> 주문
                    </NavLink>
                  </li>
                </ul>
              </details>
            </li>
            <li tabIndex={3}>
              <details className="z-10">
                <summary className="justify-center">
                  <FontAwesomeIcon icon={faGear} /> 관리
                </summary>
                <ul className="w-full min-w-max p-2">
                  <li>
                    <NavLink href="/admin/teams">
                      <FontAwesomeIcon icon={faPeopleGroup} /> 팀
                    </NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/orders">
                      <FontAwesomeIcon icon={faReceipt} /> 주문
                    </NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/products">
                      <FontAwesomeIcon icon={faCartShopping} /> 상품
                    </NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/customers">
                      <FontAwesomeIcon icon={faPerson} /> 고객
                    </NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/assets">
                      <FontAwesomeIcon icon={faImage} /> 자료
                    </NavLink>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>

        <div className="dsy-navbar-end">
          <Link href="/login" className="dsy-btn-ghost dsy-btn">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span className="max-[420px]:hidden">&nbsp;로그아웃</span>
          </Link>
        </div>
      </nav>

      {children}
      {/* <AdminNavbar /> */}

      <footer className="dsy-footer dsy-footer-center bg-base-200 p-4 text-base-content">
        <aside>
          <p className="flex flex-wrap justify-center">
            <span>
              Copyright © 2023 <span className="font-bold">곱은달감귤체험농장</span>
            </span>
            &nbsp;
            <span>All right reserved</span>
          </p>
        </aside>
      </footer>
    </body>
  );
}
