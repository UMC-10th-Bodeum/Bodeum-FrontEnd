import ExportIcon from "../../../assets/icons/Export.svg?react";

export default function SideBar() {
  return (
    <aside className="flex h-screen w-[201px] flex-col border-r border-gray-200 bg-white">
      <div className="p-4">
        {/* <UserSection /> */}

        <div className="mt-6">
          {/* <SideNav /> */}
        </div>
      </div>

      <div className="mt-auto border-t border-background-300 px-[16px]">
        <div className="mb-[14px] pt-[12px] flex justify-center text-body-sub text-background-500">
          <button>
            개인정보처리방침
          </button>

          <span className="mx-[10px]">|</span>

          <button>
            공공 데이터
          </button>
        </div>

        <button className="flex items-center px-[5px] py-[8.6px] pb-[15.8px] gap-2 text-h6 text-background-500">
          <ExportIcon />
          로그아웃
        </button>
      </div>
    </aside>
  );
}