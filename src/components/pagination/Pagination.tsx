import ArrowButton from "./ArrowButton";
import PageButton from "./PageButton";
import SpreadIcon from "@/assets/icons/Spread.svg?react"

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function getPaginationItems(current: number, total: number) {
  if (total <= 10) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 7) {
    return [...Array.from({ length: 10 }, (_, i) => i + 1), "...", total];
  }

  if (current >= total - 6) {
    return [
      1,
      "...",
      ...Array.from({ length: 10 }, (_, i) => total - 9 + i),
    ];
  }

  return [
    1,
    "...",
    current - 3,
    current - 2,
    current - 1,
    current,
    current + 1,
    current + 2,
    current + 3,
    "...",
    total,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) {
  const items = getPaginationItems(currentPage, totalPages);
  console.log(
  items.map((item, index) => ({
    index,
    item,
    key: typeof item === "string" ? `dots-${index}` : `${item}-${index}`,
  })),
);

  return (
    <div className="flex items-center justify-center gap-2">
      <ArrowButton
        direction="prev"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      />

      {items.map((item, index) =>
        typeof item === "string" ? (
          <SpreadIcon key={`dots-${index}`} />
        ) : (
          <PageButton
            key={`${item}-${index}`}
            page={item}
            active={item === currentPage}
            onClick={() => onChange(item)}
          />
        ),
      )}

      <ArrowButton
        direction="next"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      />
    </div>
  );
}