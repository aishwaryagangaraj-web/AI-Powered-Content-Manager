import { LoaderCircle } from 'lucide-react'

export default function Loading({ label = 'Loading workspace...' }) {
  return <div className="min-h-[280px] space-y-5" role="status" aria-live="polite"><div className="flex items-center gap-3 text-slate-500"><LoaderCircle className="animate-spin text-brand-600" size={20}/><span className="text-sm font-medium">{label}</span></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map(x=><div key={x} className="card animate-pulse p-5"><div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800"/><div className="mt-5 h-6 w-20 rounded bg-slate-100 dark:bg-slate-800"/><div className="mt-2 h-3 w-28 rounded bg-slate-100 dark:bg-slate-800"/></div>)}</div><span className="sr-only">{label}</span></div>
}
