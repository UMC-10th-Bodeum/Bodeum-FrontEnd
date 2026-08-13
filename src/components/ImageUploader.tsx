import { useEffect, useRef, useState } from "react";
import PlusIcon from "@/assets/icons/add-picture.svg?react";
import CloseIcon from "@/assets/icons/Close.svg?react";
import { showToast } from "@/components/Toast";

interface ImageUploaderProps {
  images: File[];
  onChange: (images: File[]) => void;
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
  allowedMimeTypes?: readonly string[];
  allowedExtensions?: readonly string[];
  allowedFormatLabel?: string;
  maxFileSize?: number;
}

const MAX_IMAGE = 5;
const DEFAULT_ALLOWED_MIME_TYPES = ["image/png", "image/jpeg"] as const;
const DEFAULT_ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"] as const;

function LocalImagePreview({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!previewUrl) return null;

  return <img src={previewUrl} alt="" className="h-full w-full object-cover" />;
}

export default function ImageUploader({
  images,
  onChange,
  existingImages = [],
  onRemoveExisting,
  allowedMimeTypes = DEFAULT_ALLOWED_MIME_TYPES,
  allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
  allowedFormatLabel = "JPG, PNG",
  maxFileSize,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const totalCount = existingImages.length + images.length;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    const hasAllowedFormat = (file: File) => {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

      return allowedMimeTypes.includes(file.type) && allowedExtensions.includes(extension);
    };
    const unsupportedFiles = files.filter((file) => !hasAllowedFormat(file));
    const oversizedFiles = maxFileSize ? files.filter((file) => file.size > maxFileSize) : [];
    const validFiles = files.filter(
      (file) => hasAllowedFormat(file) && (!maxFileSize || file.size <= maxFileSize),
    );
    const remainingSlots = Math.max(0, MAX_IMAGE - totalCount);

    if (unsupportedFiles.length > 0) {
      showToast(
        "red",
        `이미지 업로드 실패. ${allowedFormatLabel} 형식의 이미지만 업로드할 수 있습니다.`,
      );
    }

    if (oversizedFiles.length > 0 && maxFileSize) {
      const maxFileSizeInMb = maxFileSize / (1024 * 1024);
      showToast(
        "red",
        `이미지 업로드 실패. 이미지는 장당 최대 ${maxFileSizeInMb}MB까지 업로드할 수 있습니다.`,
      );
    }

    if (validFiles.length > remainingSlots) {
      showToast("red", `이미지 업로드 실패. 이미지는 최대 ${MAX_IMAGE}장까지 첨부할 수 있습니다.`);
    }

    const next = [...images, ...validFiles.slice(0, remainingSlots)];

    onChange(next);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="mb-4 mt-4 text-h3-onboard text-background-500">이미지를 첨부해주세요</p>

      <div className="flex gap-[12px]">
        {totalCount < MAX_IMAGE && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-[140px] w-[140px] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-transparent bg-background-250 hover:shadow-[1px_2px_15px_0px_#00000026] active:border-background-500 active:bg-background-300"
          >
            <PlusIcon className="mb-2 h-[32px] w-[32px]" />

            <span className="text-h6-list text-background-500">이미지를</span>
            <span className="text-h6-list text-background-500">첨부해주세요</span>
          </button>
        )}

        {existingImages.map((url) => (
          <div key={url} className="relative h-[140px] w-[140px] overflow-hidden rounded-[10px]">
            <img src={url} alt="" className="h-full w-full object-cover" />

            <button
              type="button"
              onClick={() => onRemoveExisting?.(url)}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.map((image, index) => (
          <div key={index} className="relative h-[140px] w-[140px] overflow-hidden rounded-[10px]">
            <LocalImagePreview file={image} />

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={allowedMimeTypes.join(",")}
        multiple
        hidden
        onChange={handleUpload}
      />

      <p className="mt-3 text-body-sub text-background-400">
        최대 5장
        {maxFileSize ? `, 장당 최대 ${maxFileSize / (1024 * 1024)}MB` : ""}까지 업로드할 수
        있습니다.
      </p>
    </div>
  );
}
