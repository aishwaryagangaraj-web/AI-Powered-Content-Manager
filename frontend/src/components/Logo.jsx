import { Sparkles } from 'lucide-react'

export default function Logo({ compact = false }) {
  return <div className="flex items-center gap-2.5">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/20"><Sparkles size={18} /></span>
    {!compact && <span className="text-lg font-bold tracking-tight">Content<span className="text-brand-600">OS</span></span>}
  </div>
}
