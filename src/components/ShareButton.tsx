import ShareIcon from "@/assets/icons/Share.svg?react";
import { showToast } from "@/components/Toast";
import ButtonOutline from "@/components/ButtonOutline";

interface ShareButtonProps {
  url: string;
  className?: string;
}

export default function ShareButton({ url, className }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is not available.");
      }

      await navigator.clipboard.writeText(url);
      showToast("green", "링크가 성공적으로 복사되었습니다.");
    } catch {
      showToast("red", "링크를 복사하지 못했습니다.");
    }
  };

  return (
    <ButtonOutline
      label="공유"
      tone="black"
      icon={ShareIcon}
      iconPosition="left"
      onClick={() => void handleShare()}
      className={className}
    />
  );
}
