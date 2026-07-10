interface RegionLabelProps {
  region: string;
  onClick?: () => void;
}

export default function RegionLabel({
  region,
  onClick,
}: RegionLabelProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-[20px] items-center justify-center rounded-[6px] bg-main-150 px-[8px]"
    >
      <span className="text-body-label text-main-400">
        {region}
      </span>
    </button>
  );
}