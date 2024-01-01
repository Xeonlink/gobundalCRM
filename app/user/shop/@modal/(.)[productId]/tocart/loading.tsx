import { Input } from "@/components/Input";
import { faCartPlus, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loading() {
  return (
    <dialog open className="dsy-modal justify-items-center max-sm:dsy-modal-bottom">
      <form method="dialog" className="dsy-modal-box max-w-sm bg-base-100">
        <button className="dsy-btn-ghost dsy-btn dsy-btn-sm dsy-btn-circle absolute right-4 top-4">
          ✕
        </button>

        <div className="dsy-skeleton mb-2 h-5 w-32"></div>
        <div className="dsy-skeleton mb-2 h-6 w-48"></div>

        <div className="dsy-join w-full">
          <div className="dsy-join-item flex flex-1 bg-base-200">
            <button type="button" className="dsy-btn dsy-join-item inline-block flex-1 border-none">
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <Input
              id="quantity"
              name="quantity"
              className="inline-block h-full w-10 rounded-none border-none bg-transparent text-center"
              defaultValue={1}
              readOnly
            />
            <button type="button" className="dsy-btn dsy-join-item inline-block flex-1 border-none">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <button className="dsy-btn dsy-join-item flex-1 border-none bg-orange-200">
            <FontAwesomeIcon icon={faCartPlus} /> 담기
          </button>
        </div>
      </form>
      <form method="dialog" className="dsy-modal-backdrop bg-black bg-opacity-40">
        <button>Close</button>
      </form>
    </dialog>
  );
}
