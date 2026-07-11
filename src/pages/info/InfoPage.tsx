import { Link } from "react-router-dom";

export default function InfoPage() {
  return (
    <div className="flex min-h-screen flex-col px-[32px] py-[20px] bg-background-100 gap-[18px]">
      <h1 className="text-h5-bold text-gray-900">Infomation</h1>
      <Link
        to="/info/HOSPITAL/1"
        className="w-fit rounded-md bg-background-300 px-4 py-2 text-white"
      >
        병원 상세로 이동 (dummy)
      </Link>
    </div>
  )
}