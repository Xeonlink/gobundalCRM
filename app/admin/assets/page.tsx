"use client";

import { useAssets } from "@/api/assets";
import { useDeleteProducts } from "@/api/products";
import { ColumnList } from "@/components/ColumnList";
import { ImgIcon } from "@/components/ImgIcon";
import { useAuth } from "@/hooks/useAuth";
import { useExcel } from "@/hooks/useExcel";
import { useItemSelection } from "@/hooks/useItemSelection";
import IcoExcel from "@/public/icons/excel.png";
import { faArrowsRotate, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const auth = useAuth();
  const excel = useExcel();
  const router = useRouter();
  const selected = useItemSelection();
  const assets = useAssets({
    enabled: auth.isSignIn,
  });
  const deleteItems = useDeleteProducts(selected.ids, {
    onSuccess: () => selected.clear(),
  });
  const onDownloadClick = () => {
    excel.download(assets.data?.data!, "상품");
  };
  const onDeleteClick = () => {
    if (selected.isEmpty) return;
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    deleteItems.mutate();
  };

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
        <li>
          {/* Refresh */}
          <button type="button" className="dsy-btn" onClick={() => assets.refetch()}>
            <FontAwesomeIcon icon={faArrowsRotate} /> 새로고침
          </button>
        </li>

        <li>
          {/* Cratet New Team */}
          <Link href="assets/create" className="dsy-btn">
            <FontAwesomeIcon icon={faPlus} /> 자료등록
          </Link>
        </li>

        <li>
          {/* Delete */}
          <button type="button" className="dsy-btn" onClick={onDeleteClick}>
            <FontAwesomeIcon icon={faTrashCan} /> 선택삭제
          </button>
        </li>

        <li>
          {/* 엑셀로 다운로드하기 */}
          <button type="button" className="dsy-btn" onClick={onDownloadClick}>
            <ImgIcon src={IcoExcel} alt="엑셀로 변환" fontSize={16} /> 엑셀로 변환
          </button>
        </li>
      </ul>

      <ColumnList
        threashold={new Array(32)
          .fill(0)
          .map((_, index) => index * 256)
          .concat(Infinity)}
        className="flex justify-center gap-1 py-1"
      >
        {(count, columnIndex) => (
          <ol className="flex flex-1 flex-col gap-1" key={columnIndex}>
            {assets.data?.data
              ?.filter((_, index) => index % count === columnIndex)
              .map((item) => (
                <li key={item.id} className="animate-scaleTo1 text-center">
                  <button
                    type="button"
                    className="transition-all hover:scale-105"
                    onClick={selected.onItemClick(item.id)}
                    onDoubleClick={() => router.push(`assets/${item.id}`)}
                  >
                    <Image
                      src={item.src}
                      alt={item.name}
                      width={item.width}
                      height={item.height}
                      priority
                      placeholder="empty"
                      className="inline-block"
                    />
                  </button>
                </li>
              ))}
          </ol>
        )}
      </ColumnList>
    </main>
  );
}
