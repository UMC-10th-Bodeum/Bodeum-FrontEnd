import { useEffect, useRef, useState } from "react";
import ProfileIcon from "@/assets/icons/Profile.svg?react";

interface ProfileImagePickerProps {
  imageUrl: string | null;
  imageFile: File | null;
  isEditing: boolean;
  onChange: (file: File) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfileImagePicker({
  imageUrl,
  imageFile,
  isEditing,
  onChange,
}: ProfileImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      window.alert("JPG, PNG, WEBP 이미지만 선택할 수 있습니다.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      window.alert("5MB 이하의 이미지만 선택할 수 있습니다.");
      return;
    }

    onChange(file);
  };

  const displayedImageUrl = previewUrl ?? imageUrl;

  return (
    <div className="relative h-[90px] w-[90px] shrink-0">
      <button
        type="button"
        disabled={!isEditing}
        onClick={() => inputRef.current?.click()}
        aria-label={isEditing ? "프로필 이미지 변경" : "보듬 부모님 프로필"}
        className={`relative block h-full w-full overflow-hidden rounded-full ${
          isEditing ? "cursor-pointer" : "cursor-default"
        }`}
      >
        {displayedImageUrl ? (
          <img
            src={displayedImageUrl}
            alt="프로필"
            className="h-full w-full object-cover"
          />
        ) : (
          <ProfileIcon className="h-full w-full" aria-hidden="true" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
