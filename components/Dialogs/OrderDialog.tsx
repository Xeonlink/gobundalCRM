"use client";

import { useCustomersByName } from "@/api/customers";
import {
  OrderProduct,
  RawOrder,
  defaultOrder,
  useCreateOrder,
  useDeleteOrder,
  useOrder,
  useUpdateOrder,
} from "@/api/orders";
import { ModalProps, useModal } from "@/extra/modal";
import { diff, toHyphenPhone } from "@/extra/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBox,
  faBuilding,
  faCalculator,
  faCalendarAlt,
  faCheck,
  faCoins,
  faCopy,
  faFloppyDisk,
  faMobileScreenButton,
  faNotdef,
  faNoteSticky,
  faPaperPlane,
  faPlus,
  faSignature,
  faSignsPost,
  faTrashAlt,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { DateChanger } from "../DateChanger";
import { FaIcon } from "../FaIcon";
import { Input } from "../Input";
import { ProductSelector } from "../Selectors/ProductSelector";

type ProductPayload<T extends HTMLElement> = { index: number; e: React.ChangeEvent<T> };
type Props = ModalProps<{ mode: "CREATE"; base?: RawOrder } | { mode: "UPDATE"; orderId: string }>;

export function OrderDialog(props: Props) {
  const { mode } = props;

  const modalCtrl = useModal();
  const { data: originOrder } = useOrder(mode === "UPDATE" ? props.orderId : "", {
    enabled: mode === "UPDATE",
  });
  const [order, orderActions] = useTypeSafeReducer(
    mode === "CREATE" ? props.base || defaultOrder : originOrder!,
    {
      setDate: (state, date: string) => {
        state.date = date;
      },
      onSenderNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        state.senderName = e.target.value;
        state.receiverName = !state.sameAsSender ? state.receiverName : e.target.value;
      },
      onSenderPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhone = toHyphenPhone(e.target.value);
        state.senderPhone = newPhone;
        state.receiverPhone = !state.sameAsSender ? state.receiverPhone : newPhone;
      },
      toggleSameAsSender: (state) => {
        state.receiverName = !state.sameAsSender ? state.senderName : "";
        state.receiverPhone = !state.sameAsSender ? state.senderPhone : "";
        state.sameAsSender = !state.sameAsSender;
      },
      onReceiverNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        state.receiverName = e.target.value;
      },
      onReceiverPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        state.receiverPhone = toHyphenPhone(e.target.value);
      },
      setReceiverAddress: (state, receiverAddress: string) => {
        state.receiverAddress = receiverAddress;
      },
      onReceiverAddressDetailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        state.receiverAddressDetail = e.target.value;
      },
      addProduct: (state, product: OrderProduct = { ...defaultOrder.products[0] }) => {
        state.products.push(product);
      },
      removeProduct: (state, index: number) => {
        state.products.splice(index, 1);
      },
      onProductNameChange: (state, payload: ProductPayload<HTMLInputElement>) => {
        state.products[payload.index].name = payload.e.target.value;
      },
      onProductPriceChange: (state, payload: ProductPayload<HTMLInputElement>) => {
        state.products[payload.index].price = Number(payload.e.target.value.replaceAll(",", ""));
      },
      onProductQuantityChange: (state, payload: ProductPayload<HTMLInputElement>) => {
        const newQuantity = Number(payload.e.target.value.replaceAll(",", ""));
        if (newQuantity < 0) return;
        state.products[payload.index].quantity = newQuantity;
      },
      onMemoChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        state.memo = e.target.value;
      },
      reset: () => (mode === "CREATE" ? defaultOrder : originOrder!),
    },
  );
  const debouncedSenderName = useDebounce(order.senderName, 500);
  const customers = useCustomersByName(debouncedSenderName);
  const createItem = useCreateOrder(order, {
    onSuccess: () => props.closeSelf?.(),
  });
  const updateItem = useUpdateOrder(originOrder?.id!, diff(order, originOrder!), {
    onSuccess: () => props.closeSelf?.(),
  });
  const deleteItem = useDeleteOrder(originOrder?.id!, {
    onSuccess: () => props.closeSelf?.(),
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      orderActions.setReceiverAddress(data.roadAddress);
    },
  });
  const openProductSelector = () => {
    modalCtrl.open(
      <ProductSelector
        onSelect={({ name, price }) => orderActions.addProduct({ name, price, quantity: 1 })}
      />,
    );
  };
  const openItemCopyDialog = () => {
    modalCtrl.open(<OrderDialog mode="CREATE" base={order} />);
  };

  const validity = {
    senderName: order.senderName.length > 0,
    senderPhone: order.senderPhone.length > 0,
    receiverName: order.receiverName.length > 0,
    receiverPhone: order.receiverPhone.length > 0,
    receiverAddress: order.receiverAddress.length > 0,
    receiverAddressDetail: order.receiverAddressDetail.length > 0,
    products:
      order.products.length > 0 && order.products.every((p) => p.name.length > 0 && p.quantity > 0),
  };
  const isValid = Object.values(validity).every((v) => v);
  const isCleared = mode === "CREATE" ? order === defaultOrder : originOrder === order;
  const isLoading = createItem.isLoading || updateItem.isLoading || deleteItem.isLoading;

  return (
    <dialog ref={props.ref} onClose={props.closeSelf} className="dsy-modal">
      <form
        method="dialog"
        className="dsy-modal-box max-h-screen w-full bg-opacity-60 backdrop-blur-md"
      >
        <button
          type="button"
          className="dsy-btn-ghost dsy-btn-sm dsy-btn-circle dsy-btn absolute right-6 top-4"
          onClick={props.closeSelf}
        >
          ✕
        </button>

        <h1 className="text-lg font-bold">주문</h1>

        <div className="dsy-form-control">
          <label htmlFor="date" className="dsy-label py-1 pt-0">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faCalendarAlt} /> 주문날짜
            </span>
            <DateChanger
              date={order.date}
              onChange={orderActions.setDate}
              className="w-full max-w-[15rem]"
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="sender-name" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faSignature} /> 이름
            </span>
            <Input
              className="w-full max-w-[15rem]"
              id="sender-name"
              placeholder="홍길동"
              disabled={createItem.isLoading}
              value={order.senderName}
              onChange={orderActions.onSenderNameChange}
              invalid={order.senderName === ""}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="sender-phone" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faMobileScreenButton} /> 전화번호
            </span>
            <Input
              className="w-full max-w-[15rem]"
              id="sender-phone"
              list="sender-phone-list"
              type="tel"
              placeholder="010-xxxx-xxxx"
              disabled={createItem.isLoading}
              value={order.senderPhone}
              onChange={orderActions.onSenderPhoneChange}
              invalid={order.senderPhone === ""}
            />
            <datalist id="sender-phone-list">
              {customers?.data?.data?.map((customer) => (
                <option key={customer.id} value={customer.phone}></option>
              ))}
            </datalist>
          </label>
        </div>

        <div className="dsy-divider">{/* <FaIcon icon={faPaperPlane} /> From */}</div>

        <div className="dsy-form-control">
          <label htmlFor="same-as-sender" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faPaperPlane} /> 보내는 사람과 같음
            </span>
            <input
              type="checkbox"
              name="sameAsSender"
              id="same-as-sender"
              className="dsy-toggle-success dsy-toggle"
              checked={order.sameAsSender}
              onChange={orderActions.toggleSameAsSender}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="receiver-name" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faSignature} /> 이름
            </span>
            <Input
              className="w-full max-w-[15rem]"
              id="receiver-name"
              placeholder="홍길동"
              disabled={order.sameAsSender || createItem.isLoading}
              value={order.receiverName}
              onChange={orderActions.onReceiverNameChange}
              invalid={order.receiverName === ""}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="receiver-phone" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faMobileScreenButton} /> 전화번호
            </span>
            <Input
              className="w-full max-w-[15rem]"
              id="receiver-phone"
              placeholder="010-xxxx-xxxx"
              disabled={order.sameAsSender || createItem.isLoading}
              value={order.receiverPhone}
              onChange={orderActions.onReceiverPhoneChange}
              invalid={order.receiverPhone === ""}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="receiver-address" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faSignsPost} /> 주소
            </span>
            <Input
              className="w-full max-w-[15rem]"
              id="receiver-address"
              placeholder="남원월산로74번길 42"
              disabled={createItem.isLoading}
              value={order.receiverAddress.replace(/^[^\s]+\s/, "")}
              onChange={postCodePopup.show}
              onClick={postCodePopup.show}
              invalid={order.receiverAddress === ""}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="receiver-address-detail" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faBuilding} /> 상세주소
            </span>
            <Input
              className="w-full max-w-[15rem]"
              id="receiver-address-detail"
              placeholder="단독주택, 1층 101호, ..."
              disabled={createItem.isLoading}
              value={order.receiverAddressDetail}
              onChange={orderActions.onReceiverAddressDetailChange}
              invalid={order.receiverAddressDetail === ""}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="memo" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faNoteSticky} /> 메모
            </span>
            <Input
              className="w-full max-w-[15rem]"
              id="memo"
              placeholder="메모"
              disabled={createItem.isLoading}
              value={order.memo}
              onChange={orderActions.onMemoChange}
            />
          </label>
        </div>

        <div className="dsy-divider">{/* <FaIcon icon={faPaperPlane} rotation={90} /> To */}</div>

        <table className="grid w-full grid-cols-[1fr_6rem_4rem_auto]">
          <thead className="contents">
            <tr className="contents">
              <th className="text-sm font-normal">
                <FaIcon icon={faBox} /> 상품명
              </th>
              <th className="text-sm font-normal">
                <FaIcon icon={faCoins} /> 가격(원)
              </th>
              <th className="text-sm font-normal">
                <FaIcon icon={faCalculator} /> 수량
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody className="contents">
            {order.products.map((product, index, arr) => (
              <tr key={index} className="contents">
                <td className="text-center">
                  <Input
                    id="product-name"
                    list="product-name-list"
                    className="w-full text-center"
                    disabled={createItem.isLoading}
                    value={product.name}
                    onChange={(e) => orderActions.onProductNameChange({ index, e })}
                    invalid={product.name.length <= 0}
                  />
                </td>
                <td className="relative">
                  <Input
                    id="product-price"
                    className="w-full text-center"
                    value={product.price.toLocaleString()}
                    onChange={(e) => orderActions.onProductPriceChange({ index, e })}
                  />
                </td>
                <td className="relative">
                  <Input
                    id="product-quantity"
                    type="number"
                    className="w-full text-center"
                    disabled={createItem.isLoading}
                    value={product.quantity.toLocaleString()}
                    onChange={(e) => orderActions.onProductQuantityChange({ index, e })}
                    required
                    invalid={product.quantity <= 0}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="dsy-btn-sm dsy-btn"
                    onClick={() => orderActions.removeProduct(index)}
                  >
                    <FaIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-2 text-end">
          <div className="dsy-join inline-block">
            <button
              type="button"
              className="dsy-btn-sm dsy-join-item dsy-btn"
              onClick={() => orderActions.addProduct(undefined)}
            >
              <FaIcon icon={faPlus} /> 추가하기
            </button>
            <button
              type="button"
              className="dsy-btn-sm dsy-join-item dsy-btn"
              onClick={openProductSelector}
            >
              <FaIcon icon={faCheck} /> 선택하기
            </button>
          </div>
        </div>

        <div className="dsy-modal-action">
          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isCleared || isLoading}
            onClick={orderActions.reset}
          >
            <FaIcon icon={faNotdef} rotation={90} isLoading={isLoading} value="초기화" />
          </button>

          {/* Copy */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isLoading}
            onClick={openItemCopyDialog}
          >
            <FaIcon icon={faCopy} isLoading={isLoading} value="복제" />
          </button>

          {/* Delete */}
          {mode === "UPDATE" ? (
            <button
              type="button"
              className="dsy-btn-sm dsy-btn"
              disabled={isLoading}
              onClick={() => deleteItem.mutate()}
            >
              <FaIcon icon={faTrashAlt} isLoading={isLoading} value="삭제" />
            </button>
          ) : null}

          {/* Save */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            onClick={mode === "CREATE" ? () => createItem.mutate() : () => updateItem.mutate()}
            disabled={!isValid || isLoading}
          >
            <FaIcon icon={faFloppyDisk} isLoading={isLoading} value="저장" />
          </button>
        </div>
      </form>
    </dialog>
  );
}
