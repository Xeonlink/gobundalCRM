"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import ImgLogo from "@/public/icons/ci.png";
import { faArrowRightFromBracket, faBars, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./NavLink";

export default function NavBar() {
  const auth = useAuth({
    unAuthorizedRedirect: false,
  });
  const 상품종류수 = useCart((state) => state.products.length);
  const 전체가격 = useCart((state) =>
    state.products
      .map(({ item, quantity }) => (item.isSale ? item.salePrice : item.price) * quantity)
      .reduce((acc, cur) => acc + cur, 0),
  );

  return (
    <nav className="container dsy-navbar sticky top-0 z-10 m-auto bg-base-100 sm:rounded-b-lg">
      <div className="dsy-navbar-start">
        <div className="dsy-dropdown">
          <label tabIndex={0} className="dsy-btn-ghost dsy-btn lg:hidden">
            <FontAwesomeIcon icon={faBars} fontSize={16} />
          </label>
          <ul
            tabIndex={0}
            className="dsy-dropdown-content dsy-menu rounded-box dsy-menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <NavLink href="/user/experience">곱은달 감귤체험</NavLink>
              <ul className="p-2">
                <li>
                  <NavLink href="/user/experience/hello">인사말</NavLink>
                </li>
                <li>
                  <NavLink href="/user/experience/map">오시는 길</NavLink>
                </li>
                <li>
                  <NavLink href="/user/experience/guide">체험안내</NavLink>
                </li>
                <li>
                  <NavLink href="https://pcmap.place.naver.com/place/1545445251/ticket">
                    체험예약
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink href="/user/shop?category=all" check="/user/shop">
                상품쇼핑
              </NavLink>
              <ul className="p-2">
                <li>
                  <NavLink href="/user/shop?category=all">전체상품</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=명품제주감귤">명품제주감귤</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=수산물">수산물</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=제주수제상품">제주수제상품</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=제주청정농산물">제주청정농산물</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=제주특산물">제주특산물</NavLink>
                </li>
              </ul>
            </li>
            <li>
              <Link href="#">
                <span className="line-through">이용후기</span>{" "}
                <span className="dsy-badge">준비중</span>
              </Link>
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
            <details className="z-10 min-w-max">
              <summary>곱은달 감귤체험</summary>
              <ul className="w-full">
                <li>
                  <NavLink href="/user/experience/hello">인사말</NavLink>
                </li>
                <li>
                  <NavLink href="/user/experience/map">오시는 길</NavLink>
                </li>
                <li>
                  <NavLink href="/user/experience/guide">체험안내</NavLink>
                </li>
                <li>
                  <NavLink href="https://pcmap.place.naver.com/place/1545445251/ticket">
                    체험예약
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>
          <li tabIndex={1}>
            <details className="z-10 w-36">
              <summary className="justify-center hover:text-orange-400">상품쇼핑</summary>
              <ul className="w-full min-w-max p-2">
                <li>
                  <NavLink href="/user/shop?category=all">전체상품</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=명품제주감귤">명품제주감귤</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=수산물">수산물</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=제주수제상품">제주수제상품</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=제주청정농산물">제주청정농산물</NavLink>
                </li>
                <li>
                  <NavLink href="/user/shop?category=제주특산물">제주특산물</NavLink>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link href="#">
              <span className="line-through">이용후기</span>{" "}
              <span className="dsy-badge">준비중</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="dsy-navbar-end">
        {/* 장바구니 드롭다운 */}
        <div className="dsy-dropdown-end dsy-dropdown">
          <label tabIndex={0} className="dsy-btn-ghost dsy-btn">
            <div className="dsy-indicator">
              <FontAwesomeIcon icon={faCartShopping} fontSize={16} />
              <span className="dsy-badge dsy-badge-sm dsy-indicator-item">{상품종류수}</span>
            </div>
          </label>
          <div
            tabIndex={0}
            className="dsy-card dsy-dropdown-content dsy-card-compact z-[1] mt-3 w-52 bg-base-100 shadow"
          >
            <div className="dsy-card-body">
              <span className="text-lg font-bold">상품 {상품종류수}종류</span>
              <span className="text-info">가격: {전체가격.toLocaleString()}원</span>
              <div className="dsy-card-actions">
                <Link href="/user/cart" className="dsy-btn-primary dsy-btn-block dsy-btn">
                  장바구니 보기
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 로그인 로그아웃 버튼 */}
        <Link href="/user/login" className="dsy-btn-ghost dsy-btn">
          {auth.isSignIn ? <FontAwesomeIcon icon={faArrowRightFromBracket} /> : "로그인"}
        </Link>
      </div>
    </nav>
  );
}
