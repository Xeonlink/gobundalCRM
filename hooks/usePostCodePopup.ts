import { DaumPostcodePopupParams, useDaumPostcodePopup } from "react-daum-postcode";

export function usePostCodePopup(options?: DaumPostcodePopupParams) {
  const open = useDaumPostcodePopup();

  const show = () => {
    open(options);
  };

  return { show };
}
