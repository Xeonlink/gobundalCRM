import { Dialog } from "@/components/Dialog";
import { Back } from "@/components/Navigate/Back";
import { PageProps } from "@/extra/type";

export default function Page(props: PageProps<{}, { name: string; description: string }>) {
  const name = props.searchParams.name;
  const description = props.searchParams.description;

  return (
    <Dialog autoOpen className="dsy-modal">
      <div className="dsy-modal-box max-w-fit">
        <button type="button" className="dsy-btn" title={description}>
          {name || <span className="text-gray-400">명품제주감귤</span>}
        </button>
      </div>
      <Back className="dsy-modal-backdrop">{/* Close */}</Back>
    </Dialog>
  );
}
