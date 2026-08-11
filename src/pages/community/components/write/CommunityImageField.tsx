import ImageUploader from "@/components/ImageUploader";

interface CommunityImageFieldProps {
  images: File[];
  onChange: (images: File[]) => void;
}

export default function CommunityImageField({
  images,
  onChange,
}: CommunityImageFieldProps) {
  return (
    <div className="mt-[10px]">
      <ImageUploader images={images} onChange={onChange} />
    </div>
  );
}
