import ImageUploader from "@/components/ImageUploader";

const MAX_COMMUNITY_IMAGE_SIZE = 10 * 1024 * 1024;
const COMMUNITY_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const COMMUNITY_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

interface CommunityImageFieldProps {
  images: File[];
  onChange: (images: File[]) => void;
  existingImageUrls: string[];
  onRemoveExistingImage: (url: string) => void;
}

export default function CommunityImageField({
  images,
  onChange,
  existingImageUrls,
  onRemoveExistingImage,
}: CommunityImageFieldProps) {
  return (
    <div className="mt-[10px]">
      <ImageUploader
        images={images}
        onChange={onChange}
        existingImages={existingImageUrls}
        onRemoveExisting={onRemoveExistingImage}
        allowedMimeTypes={COMMUNITY_IMAGE_MIME_TYPES}
        allowedExtensions={COMMUNITY_IMAGE_EXTENSIONS}
        allowedFormatLabel="JPG, PNG, WEBP"
        maxFileSize={MAX_COMMUNITY_IMAGE_SIZE}
      />
    </div>
  );
}
