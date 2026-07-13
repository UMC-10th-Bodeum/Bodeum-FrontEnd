interface RegionLabelProps {
  region: string;
}

export default function RegionLabel({
  region
}: RegionLabelProps) {
  return (
    <div
      className="shrink-0 inline-flex h-[20px] items-center justify-center rounded-[6px] bg-main-150 px-[8px]"
    >
      <span className="text-body-label text-main-400">
        {region}
      </span>
    </div>
  );
}