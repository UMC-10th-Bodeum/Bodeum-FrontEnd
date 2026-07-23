interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Section({
  title,
  children,
}: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-5 text-h5-bold">
        {title}
      </h2>

      {children}
    </section>
  );
}