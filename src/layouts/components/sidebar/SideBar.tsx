

export default function SideBar() {
  return (
    <aside className="flex h-screen w-58 flex-col border-r border-gray-200 bg-white">
      {/* 상단 */}
      <div className="p-4">
        {/* <UserSection /> */}

        <div className="mt-6">
          {/* <SideNav /> */}
        </div>
      </div>

      {/* 하단 */}
      <div className="mt-auto border-t border-gray-200 px-4 py-5">
        <div className="mb-5 flex justify-center text-xs text-gray-500">
          <button className="hover:text-gray-700">
            개인정보처리방침
          </button>

          <span className="mx-2">|</span>

          <button className="hover:text-gray-700">
            공공 데이터
          </button>
        </div>

        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-black">
          {/* 아이콘 */}
          <span>↩</span>
          로그아웃
        </button>
      </div>
    </aside>
  );
}