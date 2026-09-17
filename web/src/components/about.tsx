import { ABOUT } from "@/constants/copy";

export function About() {
  return (
    <section aria-labelledby="about-heading">
      <h2 id="about-heading" className="text-lg font-semibold tracking-tight">
        {ABOUT.heading}
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ABOUT.blocks.map((b) => (
          <div key={b.title} className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-[15px] font-medium">{b.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
