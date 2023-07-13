"use client";

import Image from "next/image";
import Link from "next/link";
import IcoLogo from "@/public/icons/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightToBracket,
  faPeopleGroup,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AdminNavigator() {
  const path = usePathname();
  const auth = useAuth();

  const isDashboard = path.startsWith("/admin/dashboard");
  const isTeams = path.startsWith("/admin/teams");

  return (
    <div className='flex mb-3 gap-3'>
      <div className='flex-1'>
        <Link href='/dashboard' className='m-box m-hover px-3 py-2 inline-block mr-3'>
          <Image
            src={IcoLogo}
            alt='gobundal_logo'
            width={24}
            height={24}
            className='mr-1 inline-block align-middle'
          />
          <span>대시보드</span>
        </Link>

        <Link href='/teams' className='m-box m-hover px-3 py-2 inline-block'>
          <FontAwesomeIcon
            icon={faPeopleGroup}
            width={20}
            height={20}
            className='align-middle mr-2'
          />
          <span>팀 관리</span>
        </Link>
      </div>

      <Link href='/login' className='m-box m-hover px-3 py-2'>
        <FontAwesomeIcon
          icon={faArrowRightToBracket}
          width={20}
          height={20}
          rotation={180}
          className='align-middle inline-block mr-2'
        />
        <span>로그아웃</span>
      </Link>
    </div>
  );
}
