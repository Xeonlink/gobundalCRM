"use client";

import { useAuth } from "@/hooks/useAuth";
import { faIdCard } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightToBracket,
  faBox,
  faBoxesPacking,
  faPeopleGroup,
  faReceipt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const navigate = useRouter();
  const { isSignIn, user } = useAuth();

  const onSignOutClick = (_: React.MouseEvent<HTMLButtonElement>) => {
    user?.signOut();
    navigate.refresh();
  };

  return (
    <div className='flex'>
      <main className='m-auto w-96 max-w-full root-page-grid gap-3'>
        {!isSignIn ? (
          <Link href='login' className='m-box p-3 text-center m-hover'>
            <FaIcon
              icon={faArrowRightToBracket}
              width={20}
              height={20}
              className='align-middle inline-block mr-2'
            />
            <span>로그인</span>
          </Link>
        ) : (
          <button className='m-box p-3 text-center m-hover' onClick={onSignOutClick}>
            <FaIcon
              icon={faArrowRightToBracket}
              width={20}
              height={20}
              rotation={180}
              className='align-middle inline-block mr-2'
            />
            <span>로그아웃</span>
          </button>
        )}

        <div className='dummy'></div>

        <div className='saperator col-span-2 h-10'></div>

        <div className='col-span-2 text-center'>
          <FaIcon
            icon={faBoxesPacking}
            width={20}
            height={20}
            className='align-middle inline-block mr-2'
          />
          <span>키오스크</span>
        </div>
        <Link href='kiosk/teams' className='m-box p-3 text-center m-hover'>
          <FaIcon
            icon={faPeopleGroup}
            width={22}
            height={22}
            className='align-middle inline-block mr-2'
          />
          <span>팀 키오스크</span>
        </Link>
        <Link href='kiosk/orders' className='m-box p-3 text-center m-hover'>
          <FaIcon
            icon={faReceipt}
            width={20}
            height={20}
            className='align-middle inline-block mr-2'
          />
          <span>주문 키오스크</span>
        </Link>

        <div className='saperator col-span-2 h-10'></div>

        <div className='col-span-2 text-center'>
          <FaIcon
            icon={faIdCard}
            width={23}
            height={23}
            className='align-middle inline-block mr-2'
          />
          <span>관리자</span>
        </div>
        <button
          className={`m-box p-3 text-center ${isSignIn ? "m-hover" : "opacity-40 cursor-default"}`}
          onClick={() => navigate.push("/admin/teams")}
          disabled={!isSignIn}
        >
          <FaIcon
            icon={faPeopleGroup}
            width={22}
            height={22}
            className='align-middle inline-block mr-2'
          />
          <span>팀 관리</span>
        </button>
        <button
          className={`m-box p-3 text-center ${isSignIn ? "m-hover" : "opacity-40 cursor-default"}`}
          onClick={() => navigate.push("/admin/orders")}
          disabled={!isSignIn}
        >
          <FaIcon
            icon={faReceipt}
            width={20}
            height={20}
            className='align-middle inline-block mr-2'
          />
          <span>주문 관리</span>
        </button>
        <button
          className={`m-box p-3 text-center ${isSignIn ? "m-hover" : "opacity-40 cursor-default"}`}
          onClick={() => navigate.push("/admin/products")}
          disabled={!isSignIn}
        >
          <FaIcon icon={faBox} width={19} height={19} className='align-middle inline-block mr-2' />
          <span>상품 관리</span>
        </button>
        <button
          className={`m-box p-3 text-center ${isSignIn ? "m-hover" : "opacity-40 cursor-default"}`}
          onClick={() => navigate.push("/admin/customers")}
          disabled={!isSignIn}
        >
          <FaIcon icon={faUser} width={19} height={19} className='align-middle inline-block mr-2' />
          <span>고객 관리</span>
        </button>
      </main>
    </div>
  );
}
