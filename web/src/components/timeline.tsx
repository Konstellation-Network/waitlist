import { TIMELINE } from "@/constants/copy";

export function Timeline() {
  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="text-lg font-semibold tracking-tight">
        {TIMELINE.heading}
      </h2>
      <ol className="mt-4 flex flex-col">
        {TIMELINE.items.map((item, i) => {
          const shipped = item.state === "shipped";
          const last = i === TIMELINE.items.length - 1;
          return (
            <li key={item.title} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className={`mt-1.5 size-2.5 shrink-0 rounded-full ${
                    shipped ? "bg-success" : "border border-border-strong bg-bg"
                  }`}
                />
                {!last && <span aria-hidden className="w-px flex-1 bg-border" />}
              </div>
              <div className={last ? "pb-0" : "pb-6"}>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-medium">{item.title}</h3>
                  <span
                    className={`rounded-sm border px-1.5 py-px font-mono text-[10px] uppercase tracking-wider ${
                      shipped
                        ? "border-success/30 text-success"
                        : "border-border text-faint"
                    }`}
                  >
                    {shipped ? TIMELINE.shippedLabel : TIMELINE.nextLabel}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
