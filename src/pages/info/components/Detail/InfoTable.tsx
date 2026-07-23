interface Item {
  label: string;
  value: React.ReactNode;
}

interface Props {
  items: Item[];
}

export default function InfoTable({
  items,
}: Props) {
  return (
    <div>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex border-b py-3"
        >
          <div className="w-20 text-gray-500">
            {item.label}
          </div>

          <div>{item.value}</div>
        </div>
      ))}
    </div>
  );
}