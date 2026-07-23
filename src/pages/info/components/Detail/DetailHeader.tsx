import defaultThumbnail from "@/assets/images/thumbnail.svg";

interface Props {
  image?: string;
}

export default function DetailHeader({ image }: Props) {
  return (
    <img
      src={image || defaultThumbnail}
      alt="기관 이미지"
      className="h-[220px] w-[680px] rounded-xl object-cover"
    />
  );
}