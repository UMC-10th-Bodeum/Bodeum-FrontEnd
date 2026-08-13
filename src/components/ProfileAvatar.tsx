import { useState, type ComponentType, type SVGProps } from "react";

import ProfileIcon from "@/assets/icons/Profile.svg?react";

interface ProfileAvatarProps {
  imageUrl?: string | null;
  alt: string;
  className: string;
  fallbackIcon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function ProfileAvatar({
  imageUrl,
  alt,
  className,
  fallbackIcon: FallbackIcon = ProfileIcon,
}: ProfileAvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const canShowImage = Boolean(imageUrl && failedImageUrl !== imageUrl);

  if (!canShowImage) {
    return <FallbackIcon className={`${className} shrink-0`} aria-label={alt} />;
  }

  return (
    <img
      src={imageUrl ?? undefined}
      alt={alt}
      onError={() => setFailedImageUrl(imageUrl ?? null)}
      className={`${className} shrink-0 rounded-full object-cover`}
    />
  );
}
