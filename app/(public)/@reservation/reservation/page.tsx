import { Dialog } from "@/components/Dialog";
import { Back } from "@/components/Navigate/Back";

export default function Page() {
  return (
    <Dialog autoOpen className="dsy-modal content-evenly">
      <div className="dsy-modal-box mr-10 w-fit place-self-end p-0">
        <iframe
          src="https://pcmap.place.naver.com/place/1545445251"
          className="h-screen w-96 rounded-2xl shadow-lg"
        ></iframe>
      </div>
      <form method="dialog" className="dsy-modal-backdrop">
        <Back type="submit">Close</Back>
      </form>
    </Dialog>
  );
}
