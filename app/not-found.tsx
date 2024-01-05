export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-200 to-green-200">
      <div className="w-full space-y-4 text-center">
        <h1 className="text-9xl font-extrabold text-white">Oops!</h1>

        <div className="inline-block break-all">
          <h2 className="text-2xl font-bold">404 / 요청하신 주소에는 아무것도 없습니다.</h2>
          <p className="mt-2 pl-5 text-start">
            방문하시는 주소가 올바른지 다시 확인해주세요.
            <br />
            만약 올바른 주소라면, 페이지가 삭제되었거나 이동되었을 수 있습니다.
            <br />
            계속 이 문제가 발생한다면, 관리자에게 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
