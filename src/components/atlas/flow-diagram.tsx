/**
 * A compact pipeline diagram of a request flow. It is one image to assistive technology, named with the
 * whole path; the detailed steps are always rendered next to it as an ordered list.
 *
 * @param props.stages The stages in order; only their titles are drawn.
 * @param props.label What the flow is, used to start the accessible name.
 * @param props.className Extra classes for the outer figure.
 */
export function FlowDiagram({ stages, label, className = '' }: { stages: readonly { title: string }[]; label: string; className?: string }) {
  return (
    <figure role="img" aria-label={`${label}: ${stages.map((s) => s.title).join(', then ')}.`} className={`m-0 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {stages.map((stage, i) => (
          <div key={stage.title} className="flex items-center gap-2">
            <div className="grid min-w-[92px] gap-0.5 rounded-lg border-[1.5px] border-current px-3 py-2">
              <span className="font-mono text-[11px] opacity-70">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm font-semibold">{stage.title}</span>
            </div>
            {i < stages.length - 1 && <span className="font-mono opacity-70">→</span>}
          </div>
        ))}
      </div>
    </figure>
  );
}
