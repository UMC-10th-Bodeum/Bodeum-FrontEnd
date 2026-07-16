import ExportIcon from "@/assets/icons/Export.svg?react";
import Logo from "@/assets/icons/Logo_kr.svg?react";
import SideNav from "./SideNav";
import UserSection from "./UserSection";

export default function SideBar() {
  return (
    <aside className="flex h-screen flex-col bg-white w-[213px]">
      <div className="h-[60px] py-[18px] flex items-center justify-center border-b border-background-250">
        <Logo className="w-[62px] h-[24px]" />
      </div>
      
      <div className="flex flex-1 flex-col border-r border-background-250">
      <div className="px-4 pt-[20px]">
        <UserSection type="guest" />

        <div className="mt-[18px]">
          <SideNav />
        </div>
      </div>

      <div className="mt-auto border-t border-background-250 px-[16px]">
        <div className="mb-[16px] pt-[12px] flex text-body-sub text-background-500">
          <button type="button" className="cursor-pointer" onClick={() => {/* TODO: 개인정보처리방침 페이지 이동 */}}>
            개인정보처리방침
          </button>

          <span className="mx-[4px]">|</span>

          <button type="button" className="cursor-pointer" onClick={() => {/* TODO: 공공 데이터 페이지 이동 */}}>
            공공 데이터
          </button>
        </div>

        <button className="flex items-center pb-[23px] gap-2 text-h6 text-background-500 cursor-pointer">
          <ExportIcon />
          로그아웃
        </button>
        </div>
        </div>
    </aside>
  );
}