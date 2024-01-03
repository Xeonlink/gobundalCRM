import { DialogOpener } from "@/components/DialogOpener";
import { NavLink } from "@/components/NavLink";
import ImgLogo from "@/public/icons/ci.png";
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBars,
  faCartShopping,
  faGear,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { getProductCategories } from "./action";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Layout(props: PropsWithChildren) {
  const productCategories = await getProductCategories();
  const session = await getServerSession(authOptions);

  const 아바타_이미지 =
    session?.user?.image ?? "https://ssl.pstatic.net/static/pwe/address/img_profile.png";

  return (
    <body className="relative">
      {/* 네비게이션 바 */}
      <nav className="container dsy-navbar sticky top-0 z-10 m-auto bg-base-100 sm:rounded-b-lg">
        <div className="dsy-navbar-start">
          <div className="dsy-dropdown">
            <label tabIndex={0} className="dsy-btn-ghost dsy-btn lg:hidden">
              <FontAwesomeIcon icon={faBars} fontSize={16} />
            </label>
            <ul
              tabIndex={0}
              className="dsy-dropdown-content dsy-menu dsy-menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <NavLink href="/experience">곱은달 감귤체험</NavLink>
                <ul className="p-2">
                  <li>
                    <NavLink href="/experience/hello">인사말</NavLink>
                  </li>
                  <li>
                    <NavLink href="/experience/map">오시는 길</NavLink>
                  </li>
                  <li>
                    <NavLink href="/experience/guide">체험안내</NavLink>
                  </li>
                  <li>
                    <NavLink href="https://pcmap.place.naver.com/place/1545445251/ticket">
                      체험예약
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <NavLink href="/shop" check="/shop">
                  상품쇼핑
                </NavLink>
                <ul className="p-2">
                  <li>
                    <NavLink href="/shop">전체상품</NavLink>
                  </li>
                  {productCategories.map((item) => (
                    <li key={item.id}>
                      <NavLink href={`/shop?category=${item.name}`}>{item.name}</NavLink>
                    </li>
                  ))}
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
                    <NavLink href="/experience/hello">인사말</NavLink>
                  </li>
                  <li>
                    <NavLink href="/experience/map">오시는 길</NavLink>
                  </li>
                  <li>
                    <NavLink href="/experience/guide">체험안내</NavLink>
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
                    <NavLink href="/shop">전체상품</NavLink>
                  </li>
                  {productCategories.map((item) => (
                    <li key={item.id}>
                      <NavLink href={`/shop?category=${item.name}`}>{item.name}</NavLink>
                    </li>
                  ))}
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
          {!session ? (
            <>
              <Link href="/signup/register" className="dsy-btn-ghost dsy-btn">
                <FontAwesomeIcon icon={faUserPlus} />
                <span className="max-[420px]:hidden">&nbsp;회원가입</span>
              </Link>

              <Link href="/auth/signin" className="dsy-btn-ghost dsy-btn">
                <FontAwesomeIcon icon={faArrowRightToBracket} />
                <span className="max-[420px]:hidden">&nbsp;로그인</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/user/cart" className="dsy-btn-ghost dsy-btn">
                <FontAwesomeIcon icon={faCartShopping} />
                <span className="max-[420px]:hidden">&nbsp;장바구니</span>
              </Link>

              <div className="dsy-dropdown-end dsy-dropdown">
                <button
                  type="button"
                  tabIndex={0}
                  className="dsy-btn-ghost dsy-btn dsy-btn-circle dsy-avatar duration-1000"
                >
                  <figure className="w-10">
                    <Image
                      alt="아바타 이미지"
                      src={아바타_이미지}
                      width={40}
                      height={40}
                      className="rounded-full"
                      priority
                    />
                  </figure>
                </button>
                <ul
                  tabIndex={0}
                  className="dsy-dropdown-content dsy-menu z-[1] mt-3 w-48 rounded-box bg-base-100 p-2 shadow"
                >
                  <li>
                    <Link href="/user">
                      <FontAwesomeIcon icon={faGear} />
                      <span className="line-through">설정</span>{" "}
                      <span className="dsy-badge">준비중</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/signout">
                      <FontAwesomeIcon icon={faArrowRightFromBracket} /> 로그아웃
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* 내부 페이지 */}
      {props.children}

      {/* footer */}
      <footer className="space-y-4 bg-base-200 p-4 text-sm text-base-content">
        <ul className="container m-auto flex flex-wrap gap-2 max-sm:hidden">
          <li>곱은달감귤체험농장</li>
          <li className="text-gray-400">|</li>
          <li>대표자. 오성진</li>
          <li className="text-gray-400">|</li>
          <li>주소. 제주특별자치도 서귀포시 남원읍 태위로171번길 11</li>
          <li className="text-gray-400">|</li>
          <li>고객센터. 010-2246-4151</li>
          <li className="text-gray-400">|</li>
          <li>계좌변호. 농협 352-1308-2984-73 오성진</li>
          <li className="text-gray-400">|</li>
          <li>사업자등록번호. 319-91-00407</li>
          <li className="text-gray-400">|</li>
          <li>통신판매업번호. 제 2016-6520029-30-2-00045호</li>
          <li className="text-gray-400">|</li>
          <li>이메일. dia_sj0501@naver.com</li>
          <li className="text-gray-400">|</li>
          <li>카카오톡. diasj0501</li>
        </ul>
        <ul className="container m-auto flex flex-wrap items-center justify-center gap-2 sm:hidden">
          <li>
            <DialogOpener target="#business-info" className="dsy-btn dsy-btn-sm bg-base-300">
              대표자
            </DialogOpener>
          </li>
          <li className="text-gray-400">|</li>
          <li>
            <DialogOpener target="#business-info" className="dsy-btn dsy-btn-sm bg-base-300">
              주소
            </DialogOpener>
          </li>
          <li className="text-gray-400">|</li>
          <li>
            <DialogOpener target="#business-info" className="dsy-btn dsy-btn-sm bg-base-300">
              고객센터
            </DialogOpener>
          </li>
          <li className="text-gray-400">|</li>
          <li>
            <DialogOpener target="#business-info" className="dsy-btn dsy-btn-sm bg-base-300">
              계좌번호
            </DialogOpener>
          </li>
          <li className="text-gray-400">|</li>
          <li>
            <DialogOpener target="#business-info" className="dsy-btn dsy-btn-sm bg-base-300">
              사업자등록번호
            </DialogOpener>
          </li>
          <li className="text-gray-400">|</li>
          <li>
            <DialogOpener target="#business-info" className="dsy-btn dsy-btn-sm bg-base-300">
              통신판매업번호
            </DialogOpener>
          </li>
          <li className="text-gray-400">|</li>
          <li>
            <DialogOpener target="#business-info" className="dsy-btn dsy-btn-sm bg-base-300">
              이메일
            </DialogOpener>
          </li>
          <li className="text-gray-400">|</li>
          <li>
            <DialogOpener target="#business-info" className="dsy-btn dsy-btn-sm bg-base-300">
              카카오톡
            </DialogOpener>
          </li>
        </ul>
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

      {/* 사업자정보 모달 */}
      <dialog id="business-info" className="dsy-modal dsy-modal-top sm:dsy-modal-middle">
        <div className="dsy-modal-box">
          <h3 className="mb-2 text-lg font-bold">곱은달감귤체험농장</h3>
          <ul className="grid-flow-row grid-cols-[auto_auto] gap-2 text-sm min-[400px]:grid">
            <li className="min-w-max max-[400px]:underline">대표자</li>
            <li className="max-[400px]:mb-2">오성진</li>
            <li className="min-w-max max-[400px]:underline">주소</li>
            <li className="max-[400px]:mb-2">제주특별자치도 서귀포시 남원읍 태위로171번길 11</li>
            <li className="min-w-max max-[400px]:underline">고객센터</li>
            <li className="max-[400px]:mb-2">010-2246-4151</li>
            <li className="min-w-max max-[400px]:underline">계좌변호</li>
            <li className="max-[400px]:mb-2">농협 352-1308-2984-73 오성진</li>
            <li className="min-w-max max-[400px]:underline">사업자등록번호</li>
            <li className="max-[400px]:mb-2">319-91-00407</li>
            <li className="min-w-max max-[400px]:underline">통신판매업번호</li>
            <li className="max-[400px]:mb-2">제 2016-6520029-30-2-00045호</li>
            <li className="min-w-max max-[400px]:underline">이메일</li>
            <li className="max-[400px]:mb-2">dia_sj0501@naver.com</li>
            <li className="min-w-max max-[400px]:underline">카카오톡</li>
            <li className="max-[400px]:mb-2">diasj0501</li>
          </ul>
        </div>
        <form method="dialog" className="dsy-modal-backdrop">
          {/* if there is a button in form, it will close the modal */}
          <button>Close</button>
        </form>
      </dialog>
    </body>
  );
}
