import { useState } from "react";
import StarFilledIcon from "@/assets/icons/Star.svg?react";
// import StarHalfIcon from "@/assets/icons/StarHalf.svg?react";
import StarOutlineIcon from "@/assets/icons/StarOutline.svg?react";

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
}

export default function RatingInput({
  value,
  onChange,
}: RatingInputProps) {
  const [hover, setHover] = useState<number | null>(null);

  const current = hover ?? value;

  const handleMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    star: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeft = e.clientX - rect.left < rect.width / 2;

    setHover(isLeft ? star - 0.5 : star);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    star: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeft = e.clientX - rect.left < rect.width / 2;

    onChange(isLeft ? star - 0.5 : star);
  };

  return (
    <div>
      <div className="mb-[12px] flex items-center">
        <span className="text-h3-onboard text-background-500">
          별점을 남겨주세요
        </span>
        <span className="text-main-400">*</span>
      </div>

      <div
        className="flex items-center"
        onMouseLeave={() => setHover(null)}
      >
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            let Icon = StarOutlineIcon;

            if (current >= star) {
              Icon = StarFilledIcon;
            } else if (current >= star - 0.5) {
              Icon = StarFilledIcon; // StarHalfIcon
            }

            return (
              <button
                key={star}
                type="button"
                onMouseMove={(e) => handleMove(e, star)}
                onClick={(e) => handleClick(e, star)}
                className="transition-transform hover:scale-110"
              >
                <Icon className="h-6 w-6" />
              </button>
            );
          })}
        </div>

        <span className="ml-[12px] text-h2-onboard text-main-400">
          {current.toFixed(1)}
        </span>
      </div>
    </div>
  );
}