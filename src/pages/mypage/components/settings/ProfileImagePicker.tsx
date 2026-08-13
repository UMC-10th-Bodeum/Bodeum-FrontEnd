import { useEffect, useRef, useState } from "react";
import ProfileIcon from "@/assets/icons/Profile.svg?react";
import ProfileImageEditIcon from "@/assets/icons/ProfileImageEdit.svg?react";

interface ProfileImagePickerProps {
  imageUrl: string | null;
  imageFile: File | null;
  isEditing: boolean;
  disabled?: boolean;
  onChange: (file: File) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfileImagePicker({
  imageUrl,
  imageFile,
  isEditing,
  disabled = false,
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

    if (file.size === 0) {
      window.alert("업로드할 이미지 파일이 비어 있습니다.");
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      window.alert("지원하지 않는 이미지 형식입니다.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      window.alert("업로드 가능한 파일 크기를 초과했습니다.");
      return;
    }

    onChange(file);
  };

  const displayedImageUrl = previewUrl ?? imageUrl;

  return (
    <div className="relative h-[90px] w-[90px] shrink-0">
      <div className="h-full w-full overflow-hidden rounded-full">
        {displayedImageUrl ? (
          <img src={displayedImageUrl} alt="프로필" className="h-full w-full object-cover" />
        ) : (
          <ProfileIcon className="h-full w-full" aria-hidden="true" />
        )}
      </div>

      {isEditing && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          aria-label="프로필 이미지 변경"
          className="
          absolute bottom-0 right-0
          flex h-[28px] w-[28px]
          items-center justify-center
          rounded-full bg-main-400 cursor-pointer
          disabled:cursor-default
        "
        >
          <ProfileImageEditIcon className="h-[12.25px] w-[12.25px]" aria-hidden="true" />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={!isEditing || disabled}
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
