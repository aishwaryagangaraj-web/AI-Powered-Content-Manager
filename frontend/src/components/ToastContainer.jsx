import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useToastStore } from '../store/uiStore'

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  return <div className="fixed right-4 top-4 z-[100] flex w-[min(92vw,380px)] flex-col gap-2">
    {toasts.map((toast) => <div key={toast.id} role={toast.type==='error'?'alert':'status'} className={`card flex animate-fade-up items-center gap-3 border-l-4 p-3 shadow-soft ${toast.type==='error'?'border-l-rose-500':'border-l-emerald-500'}`}>
      {toast.type === 'error' ? <AlertCircle className="text-rose-500" size={20} /> : <CheckCircle2 className="text-emerald-500" size={20} />}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button onClick={() => removeToast(toast.id)} aria-label="Dismiss"><X size={16} /></button>
    </div>)}
  </div>
}
