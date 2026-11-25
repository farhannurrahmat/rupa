import Link from "next/link";
import Photo from "@/components/ui/Photo";

export default function ChallengeBanner({ challenge, extra }) {
  const days = Math.max(0, Math.ceil((new Date(challenge.end_date) - new Date()) / 86400000));
  const fan = [
    { k: -1, src: extra[0]?.file_url ?? challenge.banner_url, alt: extra[0]?.title ?? challenge.title },
    { k: 1, src: extra[1]?.file_url ?? challenge.banner_url, alt: extra[1]?.title ?? challenge.title },
    { k: 0, src: challenge.banner_url, alt: challenge.title },
  ];

  return (
    <section className="grid items-center gap-10 rounded-md border border-line bg-surface p-8 sm:p-12 lg:grid-cols-2">
      <div>
        <p className="text-sm tracking-widest text-accent">CHALLENGE BERLANGSUNG</p>
        <h2 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{challenge.title}</h2>
        <p className="mt-4 max-w-md text-muted">
          Oleh {challenge.curator_name}. Kirim satu karya terbaikmu dan menangkan hadiahnya.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/challenges/${challenge.id}`}
            className="rounded-full bg-accent px-7 py-3 font-semibold text-black transition hover:-translate-y-0.5"
          >
            Ikut challenge
          </Link>
          <span className="text-sm text-muted">{days > 0 ? `Berakhir dalam ${days} hari` : "Berakhir hari ini"}</span>
        </div>
      </div>

      <div className="tn-fan" aria-hidden="true">
        {fan.map((f) => (
          <span key={f.k} className="tn-fc" style={{ "--k": f.k }}>
            <Photo src={f.src} alt="" sizes="220px" className="h-full w-full" />
          </span>
        ))}
      </div>
    </section>
  );
}