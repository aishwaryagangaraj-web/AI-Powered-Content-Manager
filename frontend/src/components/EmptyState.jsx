import { FileText } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', message = 'Create your first piece of content to get started.', action }) {
  return <div className="card relative grid min-h-[280px] place-items-center overflow-hidden border-dashed p-8 text-center"><div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/50 blur-3xl dark:bg-brand-500/5"/><div className="relative"><span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-600 shadow-sm dark:border-brand-500/20 dark:bg-brand-500/10"><FileText /></span><h3 className="font-semibold">{title}</h3><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">{message}</p>{action && <div className="mt-5">{action}</div>}</div></div>
}
