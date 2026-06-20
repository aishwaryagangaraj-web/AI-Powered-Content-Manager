export default function PageHeader({ eyebrow, title, description, actions }) {
  return <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>{eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-brand-600">{eyebrow}</p>}<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>{description && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}</div>{actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}</div>
}
