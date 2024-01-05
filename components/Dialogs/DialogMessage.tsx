import { ModalProps } from "@/extra/modal/modal";
import { cn } from "@/extra/utils";

type Props = ModalProps<{
  type: "normal" | "warning" | "error";
  title: string;
  message: string;
}>;

export function DialogMessage(props: Props) {
  const { ref, closeSelf, type, title, message } = props;

  return (
    <dialog ref={ref} className="dsy-modal dsy-modal-top sm:dsy-modal-middle" onClose={closeSelf}>
      <div className="dsy-modal-box">
        <h1
          className={cn(
            "text-xl font-bold",
            type === "normal" && "text-green-400",
            type === "warning" && "text-orange-400",
            type === "error" && "text-red-400",
          )}
        >
          {title}
        </h1>
        <p className="mt-2">{message}</p>
      </div>
      <form method="dialog" className="dsy-modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
