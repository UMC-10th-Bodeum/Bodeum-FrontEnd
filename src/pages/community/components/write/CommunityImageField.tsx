import ImageUploader from "@/components/ImageUploader";

const MAX_COMMUNITY_IMAGE_SIZE = 10 * 1024 * 1024;
const COMMUNITY_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const COMMUNITY_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

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
      <ImageUploader
        images={images}
        onChange={onChange}
        allowedMimeTypes={COMMUNITY_IMAGE_MIME_TYPES}
        allowedExtensions={COMMUNITY_IMAGE_EXTENSIONS}
        allowedFormatLabel="JPG, PNG, WEBP"
        maxFileSize={MAX_COMMUNITY_IMAGE_SIZE}
      />
    </div>
  );
}
