"use client";

import { ModalProps } from "@/extra/modal";
import { faCheck, faFloppyDisk, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

type Props = ModalProps<{
  msg: string;
  onCancel: () => Promise<void> | void;
  onOK: () => Promise<void> | void;
}>;

export function Confirm(props: Props) {
  const { closeSelf, msg, onCancel, onOK } = props;
  const isLoading = false;

  const onCancelClick = async () => {
    await props.onCancel();
    closeSelf?.();
  };

  return (
    <dialog ref={props.ref} onClose={props.closeSelf} className="dsy-modal">
      <form
        method="dialog"
        className="dsy-modal-box max-h-screen w-full bg-opacity-60 backdrop-blur-md"
      >
        <div className="dsy-modal-action">
          {/* Close */}
          <button className="dsy-btn-sm dsy-btn">
            <FaIcon icon={faX} /> 닫기
          </button>

          {/* Save */}
          <button type="button" className="dsy-btn-sm dsy-btn">
            <FaIcon icon={faCheck} /> 확인
          </button>
        </div>
      </form>
    </dialog>
  );
}
