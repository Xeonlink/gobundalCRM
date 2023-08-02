"use client";

import { useCustomersByName } from "@/api/customers";
import { RawOrder, useCreateOrder, useDeleteOrder, useOrder, useUpdateOrder } from "@/api/orders";
import { ModalProps } from "@/extra/type";
import { diff, toHyphenPhone } from "@/extra/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useModal } from "@/hooks/useModal";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBox,
  faBoxesStacked,
  faBuilding,
  faCalculator,
  faCalendar,
  faCalendarAlt,
  faCheck,
  faCoins,
  faEquals,
  faFloppyDisk,
  faMobileScreenButton,
  faNotEqual,
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
import { CheckBox } from "../CheckBox";
import { FaIcon } from "../FaIcon";
import { Input } from "../Input";
import { ProductSelector } from "../Selectors/ProductSelector";
import dayjs from "dayjs";
import { DateChanger } from "../DateChanger";
import { Dialog } from "./Dialog";

const defaultProduct = {
  name: "",
  price: 0,
  quantity: 1,
};

const defaultOrder: RawOrder = {
  date: dayjs().format("YYYY-MM-DD"),
  senderName: "",
  senderPhone: "",
  sameAsSender: false,
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverAddressDetail: "",
  products: [defaultProduct],
  memo: "",
};

type ProductPayload<T extends HTMLElement> = { index: number; e: React.ChangeEvent<T> };
type Props = ModalProps<{ mode: "CREATE" } | { mode: "UPDATE"; orderId: string }>;

export function OrderDialog(props: Props) {
  const { mode } = props;

  const modalCtrl = useModal();
  const { data: originOrder } = useOrder(mode === "UPDATE" ? props.orderId : "", {
    enabled: mode === "UPDATE",
  });
  const [order, orderActions] = useTypeSafeReducer(originOrder || defaultOrder, {
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
    addProduct: (state, product: typeof defaultProduct = { ...defaultProduct }) => {
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
    onMemoChange: (state, e: React.ChangeEvent<HTMLTextAreaElement>) => {
      state.memo = e.target.value;
    },
    reset: () => {
      return mode === "CREATE" ? defaultOrder : originOrder!;
    },
  });
  const debouncedSenderName = useDebounce(order.senderName, 500);
  const customers = useCustomersByName(debouncedSenderName);
  const createOrder = useCreateOrder(order, {
    onSuccess: () => props.closeSelf?.(),
  });
  const updateOrder = useUpdateOrder(originOrder?.id!, diff(order, originOrder!), {
    onSuccess: () => props.closeSelf?.(),
  });
  const deleteOrder = useDeleteOrder(originOrder?.id!, {
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
        onSelect={(product) => {
          orderActions.addProduct({
            name: product.name,
            price: product.price,
            quantity: 1,
          });
        }}
      />
    );
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
  const isLoading = createOrder.isLoading || updateOrder.isLoading || deleteOrder.isLoading;

  return (
    <Dialog ref={props.ref} onClose={props.closeSelf}>
      <div className='flex flex-row flex-nowrap min-w-max mb-3 gap-3'>
        <div className='w-72 space-y-3'>
          <fieldset className='fieldset'>
            <legend className='legend'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 보내는 사람
            </legend>

            <div className='field'>
              <label htmlFor='sender-name' className='label'>
                <FaIcon icon={faSignature} /> 이름
              </label>
              <Input
                id='sender-name'
                placeholder='홍길동'
                disabled={createOrder.isLoading}
                value={order.senderName}
                onChange={orderActions.onSenderNameChange}
                invalid={order.senderName === ""}
              />
            </div>

            <div className='field'>
              <label htmlFor='sender-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <Input
                id='sender-phone'
                list='sender-phone-list'
                type='tel'
                placeholder='010-xxxx-xxxx'
                disabled={createOrder.isLoading}
                value={order.senderPhone}
                onChange={orderActions.onSenderPhoneChange}
                invalid={order.senderPhone === ""}
              />
              <datalist id='sender-phone-list'>
                {customers?.data?.data?.map((customer) => (
                  <option key={customer.id} value={customer.phone}></option>
                ))}
              </datalist>
            </div>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='legend'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 받는 사람
            </legend>

            <div className='field'>
              <label htmlFor='same-as-sender' className='label'>
                <FaIcon icon={faPaperPlane} /> 보내는 사람과
              </label>
              <CheckBox
                checked={order.sameAsSender}
                disable={createOrder.isLoading}
                toggleFn={orderActions.toggleSameAsSender}
                trueContents={[faEquals, " 같음"]}
                falseContents={[faNotEqual, " 같지 않음"]}
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-name' className='label'>
                <FaIcon icon={faSignature} /> 이름
              </label>
              <Input
                id='receiver-name'
                placeholder='홍길동'
                disabled={order.sameAsSender || createOrder.isLoading}
                value={order.receiverName}
                onChange={orderActions.onReceiverNameChange}
                invalid={order.receiverName === ""}
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <Input
                id='receiver-phone'
                placeholder='010-xxxx-xxxx'
                disabled={order.sameAsSender || createOrder.isLoading}
                value={order.receiverPhone}
                onChange={orderActions.onReceiverPhoneChange}
                invalid={order.receiverPhone === ""}
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-address' className='label'>
                <FaIcon icon={faSignsPost} /> 주소
              </label>
              <Input
                id='receiver-address'
                placeholder='남원월산로74번길 42'
                disabled={createOrder.isLoading}
                value={order.receiverAddress}
                onChange={postCodePopup.show}
                onClick={postCodePopup.show}
                invalid={order.receiverAddress === ""}
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-address-detail' className='label'>
                <FaIcon icon={faBuilding} /> 상세주소
              </label>
              <Input
                id='receiver-address-detail'
                placeholder='단독주택, 1층 101호, ...'
                disabled={createOrder.isLoading}
                value={order.receiverAddressDetail}
                onChange={orderActions.onReceiverAddressDetailChange}
                invalid={order.receiverAddressDetail === ""}
              />
            </div>
          </fieldset>
        </div>

        <div>
          <fieldset className='fieldset'>
            <legend className='legend'>
              <FaIcon icon={faBoxesStacked} /> 배송물품
            </legend>

            <table className='grid gap-1' style={{ gridTemplateColumns: "10rem 7rem 5rem 2.5rem" }}>
              <thead className='contents'>
                <tr className='contents'>
                  <th className='font-normal'>
                    <FaIcon icon={faBox} /> 상품명
                  </th>
                  <th className='font-normal'>
                    <FaIcon icon={faCoins} /> 가격(원)
                  </th>
                  <th className='font-normal'>
                    <FaIcon icon={faCalculator} /> 수량(개)
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody className='contents'>
                {order.products.map((product, index, arr) => (
                  <tr key={index} className='contents'>
                    <td className='text-center'>
                      <Input
                        id='product-name'
                        list='product-name-list'
                        className='text-center'
                        disabled={createOrder.isLoading}
                        value={product.name}
                        onChange={(e) => orderActions.onProductNameChange({ index, e })}
                        invalid={product.name.length <= 0}
                      />
                    </td>
                    <td className='relative'>
                      <Input
                        id='product-price'
                        className='text-center'
                        value={product.price.toLocaleString()}
                        onChange={(e) => orderActions.onProductPriceChange({ index, e })}
                      />
                    </td>
                    <td className='relative'>
                      <Input
                        id='product-quantity'
                        type='number'
                        className='text-center'
                        disabled={createOrder.isLoading}
                        value={product.quantity.toLocaleString()}
                        onChange={(e) => orderActions.onProductQuantityChange({ index, e })}
                        required
                        invalid={product.quantity <= 0}
                      />
                    </td>
                    <td>
                      <button
                        type='button'
                        className='btn w-10 h-full shadow-none'
                        onClick={() => orderActions.removeProduct(index)}
                      >
                        <FaIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='space-x-2 text-end'>
              <button
                type='button'
                className='btn mt-2 shadow-none inline-block'
                onClick={() => orderActions.addProduct(undefined)}
              >
                <FaIcon icon={faPlus} /> 추가하기
              </button>
              <button
                type='button'
                className='btn mt-2 shadow-none inline-block'
                onClick={openProductSelector}
              >
                <FaIcon icon={faCheck} /> 선택하기
              </button>
            </div>
          </fieldset>
        </div>

        <div className='w-72 space-y-3'>
          <fieldset className='fieldset'>
            <legend className='legend'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 기타 정보
            </legend>

            <div className='field'>
              <label htmlFor='date' className='label'>
                <FaIcon icon={faCalendarAlt} /> 주문날짜
              </label>
              <DateChanger date={order.date} onChange={orderActions.setDate} />
            </div>

            <div className='field'>
              <label htmlFor='memo' className='label'>
                <FaIcon icon={faNoteSticky} /> 메모
              </label>
              <textarea
                id='memo'
                placeholder='메모'
                className='rounded-md w-full p-2 min-h-max'
                disabled={createOrder.isLoading}
                value={order.memo}
                onChange={orderActions.onMemoChange}
              />
            </div>
          </fieldset>
        </div>
      </div>

      <form method='dialog' className='flex justify-center gap-2'>
        {/* Close */}
        <button className='btn' disabled={isLoading}>
          <FaIcon icon={faX} isLoading={isLoading} value='닫기' />
        </button>

        {/* Clear */}
        <button
          type='button'
          className='btn'
          disabled={isCleared || isLoading}
          onClick={orderActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} isLoading={isLoading} value='초기화' />
        </button>

        {/* Delete */}
        {mode === "UPDATE" ? (
          <button
            type='button'
            className='btn'
            disabled={isLoading}
            onClick={() => deleteOrder.mutate()}
          >
            <FaIcon icon={faTrashAlt} isLoading={isLoading} value='삭제' />
          </button>
        ) : null}

        {/* Save */}
        <button
          type='button'
          className='btn'
          onClick={mode === "CREATE" ? () => createOrder.mutate() : () => updateOrder.mutate()}
          disabled={!isValid || isLoading}
        >
          <FaIcon icon={faFloppyDisk} isLoading={isLoading} value='저장' />
        </button>
      </form>
    </Dialog>
  );
}
