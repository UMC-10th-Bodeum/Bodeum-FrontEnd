import UpdateAtIcon from "@/assets/icons/UpdateAt.svg?react";

interface ActivityInfoTableProps {
  items: [string, string][];
}

export default function ActivityInfoTable({ items }: ActivityInfoTableProps) {
  return (
    <section className="rounded-[10px] border border-background-250 bg-background-100 px-[24px] pt-[20px] pb-[10px]">
      <h2 className="mb-[14px] flex items-center gap-[8px] text-h2-list text-background-600">
        <UpdateAtIcon className="h-[16px] w-[16px]" aria-hidden="true" />
        활동 정보
      </h2>
      <dl>
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex min-h-[38px] items-center border-b border-background-250"
          >
            <dt className="w-[64px] shrink-0 text-h6-list text-background-500">{label}</dt>
            <dd className="flex-1 whitespace-pre-line py-[10px] text-h6-list text-background-600">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
