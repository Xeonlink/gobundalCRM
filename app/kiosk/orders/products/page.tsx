"use client";

import { useProducts } from "@/api/products";
import { AssetPreviewDialog } from "@/components/Dialogs/AssetDialog/AssetPreviewDialog";
import { ImgIcon } from "@/components/ImgIcon";
import { useModal } from "@/extra/modal";
import { useItemSelection } from "@/hooks/useItemSelection";
import { useSimpleWindowSize } from "@/hooks/useWindowSize";
import IcoLogo from "@/public/icons/ci.png";
import { faCartPlus, faCartShopping, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

export default function Page() {
  const modalCtrl = useModal();
  const { data: products } = useProducts();
  const selected = useItemSelection();

  const openAssetPreviewDialog = (src: string) => {
    modalCtrl.open(<AssetPreviewDialog src={src} />);
  };

  return (
    <div className="h-full w-full overflow-auto">
      {/* NavBar */}
      <nav className="sticky top-0 z-10 flex bg-white">
        <button type="button" className="p-3">
          <ImgIcon src={IcoLogo} alt="곱은달 로고" fontSize={110} />
        </button>
      </nav>

      <ColumnList threashold={[0, 640, 900, 1200, Infinity]}>
        {(count, columnIndex) => (
          <ol className="w-80 space-y-2">
            {products?.data
              ?.filter((_, index) => index % count === columnIndex)
              .map((item) => (
                <li
                  key={item.id}
                  className="fieldset space-y-2"
                  onClick={selected.onItemClick(item.id)}
                >
                  <img
                    src={item.imgSrc}
                    alt={item.name}
                    className="m-auto cursor-pointer rounded-md object-contain"
                    onDoubleClick={() => openAssetPreviewDialog(item.imgSrc)}
                  />
                  <div className="pl-2">
                    <div className="text-lg">{item.name}</div>
                    {item.isSale && (
                      <span className="text-xl text-[#e63740]">
                        {Math.round((1 - item.salePrice / item.price) * 100) + "%"}
                      </span>
                    )}{" "}
                    <span className="text-xl font-bold">
                      {item.isSale ? item.salePrice.toLocaleString() : item.price.toLocaleString()}
                    </span>
                    원{" "}
                    {item.isSale && (
                      <span className="text-[#999999] line-through">
                        {item.price.toLocaleString() + "원"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap overflow-hidden rounded-md sm:flex-nowrap">
                    <button type="button" className="btn w-full rounded-none shadow-none">
                      <FaIcon icon={faCartPlus} /> 장바구니
                    </button>
                    <button type="button" className="btn w-full rounded-none shadow-none">
                      <FaIcon icon={faCreditCard} /> 구매
                    </button>
                  </div>
                </li>
              ))}
          </ol>
        )}
      </ColumnList>

      <div className="floating-action-btns fixed bottom-10 right-10">
        <button type="button" className="h-12 w-12 rounded-full bg-white">
          <FaIcon icon={faCartShopping} />
        </button>
      </div>
    </div>
  );
}

type Props = {
  threashold: number[];
  children: (columnCount: number, index: number) => React.ReactNode;
};

function ColumnList(props: Props) {
  const { threashold, children } = props;

  const wCount = useSimpleWindowSize(threashold);

  return (
    <div className="flex items-start justify-center gap-2 p-2">
      {new Array(wCount).fill(0).map((_, i) => children(wCount, i))}
    </div>
  );
}
