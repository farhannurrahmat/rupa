export default function SectionTitle({ eyebrow, title, note }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <p className="font-hand text-2xl leading-none text-accent">{eyebrow}</p>
        <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      </div>
      {note && <p className="max-w-xs text-sm text-muted">{note}</p>}
    </div>
  );
}