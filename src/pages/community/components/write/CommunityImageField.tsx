import imageUpload from "@/assets/images/ImageUpload.svg";

export default function CommunityImageField() {
  return (
    <div className="mt-[10px]">
      <p className="text-h3-onboard text-background-500">이미지를 첨부해주세요</p>
      <img src={imageUpload} alt="이미지 첨부" className="mt-[8px] block h-[140px] w-[140px]" />
    </div>
  );
}
