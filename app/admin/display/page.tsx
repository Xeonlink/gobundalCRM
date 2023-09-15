import { ImgIcon } from "@/components/ImgIcon";
import IcoExcel from "@/public/icons/excel.png";
import { faArrowsRotate, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

export default function Page() {
  return (
    <main className="w-full p-2">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {/* Refresh */}
        <button type="button" className="dsy-btn-sm dsy-btn">
          <FaIcon icon={faArrowsRotate} /> 새로고침
        </button>

        {/* Cratet New Order */}
        <button type="button" className="dsy-btn-sm dsy-btn">
          <FaIcon icon={faPlus} /> 자료 추가하기
        </button>

        {/* Delete */}
        <button type="button" className="dsy-btn-sm dsy-btn">
          <FaIcon icon={faTrashCan} /> 선택삭제
        </button>

        {/* 엑셀로 다운로드하기 */}
        <button type="button" className="dsy-btn-sm dsy-btn">
          <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={20} /> 엑셀로 변환
        </button>
      </div>
    </main>
  );
}
