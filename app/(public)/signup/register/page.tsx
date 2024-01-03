import { promises as fs } from "fs";

export const dynamic = "force-static";

export default async function Page() {
  const 회원가입약관 = await fs.readFile(process.cwd() + "/public/회원가입약관.txt");
  const 개인정보처리방침 = await fs.readFile(process.cwd() + "/public/개인정보처리방침.txt");

  return (
    <main className="bg-base-100">
      <form action="/signup/register_form">
        {/* 타이틀 */}
        <h2 className="py-6 text-center text-2xl font-bold">이용약관</h2>

        {/* 회원가입약관 덩어리 */}
        <section className="container m-auto mb-6 max-w-4xl px-2">
          <h3 className="py-2 pl-4 font-bold">회원가입약관</h3>
          <textarea
            readOnly
            rows={10}
            className="w-full rounded-md border-[1px] bg-white p-4 text-xs"
            defaultValue={회원가입약관.toString()}
          />
          <div className="dsy-form-control flex-row items-center justify-end gap-1 pl-4">
            <input
              id="username"
              type="checkbox"
              autoFocus
              className="dsy-checkbox dsy-checkbox-sm"
              required
            />
            <label htmlFor="username" className="dsy-label">
              <span className="dsy-label-text">회원가입약관을 읽었으며 내용에 동의합니다.</span>
            </label>
          </div>
        </section>

        {/* 개인정보처리방침 덩어리 */}
        <section className="container m-auto mb-6 max-w-4xl px-2">
          <h3 className="py-2 pl-4 font-bold">개인정보처리방침</h3>
          <textarea
            readOnly
            rows={10}
            className="w-full rounded-md border-[1px] bg-white p-4 text-xs"
            defaultValue={개인정보처리방침.toString()}
          />
          <div className="dsy-form-control flex-row items-center justify-end gap-1 pl-4">
            <input
              id="username"
              type="checkbox"
              className="dsy-checkbox dsy-checkbox-sm"
              required
            />
            <label htmlFor="username" className="dsy-label">
              <span className="dsy-label-text">개인정보처리방침을 읽었으며 내용에 동의합니다.</span>
            </label>
          </div>
        </section>

        <div className="m-auto mb-6 flex">
          <button className="dsy-btn dsy-btn-wide mx-auto border-none bg-orange-200 shadow-lg">
            다음
          </button>
        </div>
      </form>
    </main>
  );
}
