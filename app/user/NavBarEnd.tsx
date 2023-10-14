"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faCartShopping,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export default function NavBarEnd() {
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
    <>
      {auth.isSignIn ? (
        // 장바구니 버튼
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
      ) : (
        // 회원가입 버튼
        <Link href="/user/signup/register" className="dsy-btn-ghost dsy-btn">
          <FontAwesomeIcon icon={faUserPlus} />

          <span className="max-[420px]:hidden">&nbsp;회원가입</span>
        </Link>
      )}

      {/* 로그인 로그아웃 버튼 */}
      {auth.isSignIn ? (
        <Link href="/login" className="dsy-btn-ghost dsy-btn">
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span className="max-[420px]:hidden">&nbsp;로그아웃</span>
        </Link>
      ) : (
        <Link href="/login" className="dsy-btn-ghost dsy-btn">
          <FontAwesomeIcon icon={faArrowRightToBracket} />
          <span className="max-[420px]:hidden">&nbsp;로그인</span>
        </Link>
      )}
    </>
  );
}
