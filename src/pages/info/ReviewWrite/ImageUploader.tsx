import { useRef } from "react";
import PlusIcon from "@/assets/icons/add-picture.svg?react";
import CloseIcon from "@/assets/icons/Close.svg?react";

interface ImageUploaderProps {
  images: File[];
  onChange: (images: File[]) => void;
}

const MAX_IMAGE = 5;

export default function ImageUploader({
  images,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    const next = [...images, ...files].slice(0, MAX_IMAGE);

    onChange(next);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="mb-4 mt-4 text-h3-onboard text-background-500">
        이미지를 첨부해주세요
      </p>

      <div className="flex gap-[12px]">
        {images.length < MAX_IMAGE && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-[10px] bg-background-250"
          >
            <PlusIcon className="mb-2 h-[32px] w-[32px]" />

            <span className="text-h6-list text-background-500">
              이미지를 
            </span>
            <span className="text-h6-list text-background-500">
              첨부해주세요
            </span>
            
          </button>
        )}

        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-[140px] w-[140px] overflow-hidden rounded-[10px]"
          >
            <img
              src={URL.createObjectURL(image)}
              alt=""
              className="h-full w-full object-cover"
            />

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
        accept="image/png,image/jpeg,image/jpg"
        multiple
        hidden
        onChange={handleUpload}
      />

      <p className="mt-3 text-body-sub text-background-400">
        최대 5장까지 업로드할 수 있습니다.
      </p>
    </div>
  );
}