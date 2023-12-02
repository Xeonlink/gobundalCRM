import ImgLogo from "@/public/icons/ci.png";
import {
  IconDefinition,
  faArrowRightFromBracket,
  faBars,
  faCartShopping,
  faChartLine,
  faGear,
  faImage,
  faLayerGroup,
  faMobileScreen,
  faPeopleGroup,
  faPerson,
  faReceipt,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { NavLink } from "../../components/NavLink";

type Route = {
  href: string;
  icon?: IconDefinition;
  name: string;
  subs?: Route[];
};

const routes: Route[] = [
  { href: "/dashboard", icon: faChartLine, name: "대시보드" },
  { href: "/admin/display", icon: faTv, name: "디스플레이" },
  {
    href: "/kiosk/teams",
    icon: faMobileScreen,
    name: "키오스크",
    subs: [
      { href: "/kiosk/teams", icon: faPeopleGroup, name: "팀" },
      { href: "/kiosk/orders", icon: faReceipt, name: "주문" },
    ],
  },
  {
    href: "/admin",
    icon: faGear,
    name: "관리",
    subs: [
      { href: "/admin/teams", icon: faPeopleGroup, name: "팀" },
      { href: "/admin/orders", icon: faReceipt, name: "주문" },
      { href: "/admin/products", icon: faCartShopping, name: "상품" },
      { href: "/admin/product_categories", icon: faLayerGroup, name: "상품 카테고리" },
      { href: "/admin/customers", icon: faPerson, name: "고객" },
      { href: "/admin/assets", icon: faImage, name: "자료" },
    ],
  },
];

export function NavBar() {
  return (
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
            {routes.map((route) => (
              <li>
                <NavLink href={route.href}>{route.name}</NavLink>
                {route.subs && (
                  <ul className="p-2">
                    {route.subs.map((sub) => (
                      <li>
                        <NavLink href={sub.href}>{sub.name}</NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* 메인로고 */}
        <Link href="/user" className="dsy-btn-ghost dsy-btn py-2 text-xl normal-case">
          <Image src={ImgLogo} priority alt="곱은달농장로고" className="h-full w-full" />
        </Link>
      </div>

      <div className="dsy-navbar-center hidden lg:flex">
        <ul className="dsy-menu dsy-menu-horizontal px-1">
          {routes.map((route) =>
            route.subs ? (
              <details className="z-10 min-w-max">
                <summary>
                  {route.icon ? <FontAwesomeIcon icon={route.icon} /> : null} {route.name}
                </summary>
                <ul className="w-full">
                  {route.subs.map((sub) => (
                    <li>
                      <NavLink href={sub.href}>
                        {route.icon ? <FontAwesomeIcon icon={route.icon} /> : null} {route.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <li>
                <NavLink href={route.href}>
                  {route.icon ? <FontAwesomeIcon icon={route.icon} /> : null} {route.name}
                </NavLink>
              </li>
            ),
          )}
        </ul>
      </div>

      <div className="dsy-navbar-end">
        <Link href="/login?url=/admin/teams" className="dsy-btn-ghost dsy-btn">
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span className="max-[420px]:hidden">&nbsp;로그아웃</span>
        </Link>
      </div>
    </nav>
  );
}
