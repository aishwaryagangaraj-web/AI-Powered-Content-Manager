import { CalendarDays, KeyRound, Mail, ShieldCheck, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import api, { errorMessage } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/uiStore'
import { formatDate } from '../utils/format'

export default function ProfilePage(){
  const {user,setUser}=useAuthStore(); const [loading,setLoading]=useState(!user); const addToast=useToastStore(s=>s.addToast)
  useEffect(()=>{api.get('/auth/profile').then(r=>setUser(r.data)).catch(e=>addToast(errorMessage(e),'error')).finally(()=>setLoading(false))},[setUser,addToast])
  if(loading)return <Loading/>; return <div className="mx-auto max-w-4xl space-y-6"><div><h2 className="text-2xl font-bold tracking-tight">Profile & account</h2><p className="mt-1 text-sm text-slate-500">Your workspace identity and account details.</p></div><section className="card overflow-hidden"><div className="h-28 bg-gradient-to-r from-brand-600 via-violet-600 to-fuchsia-500"/><div className="px-6 pb-6 sm:px-8"><div className="-mt-11 grid h-24 w-24 place-items-center rounded-2xl border-4 border-white bg-slate-900 text-3xl font-bold text-white shadow-lg dark:border-slate-900">{user?.name?.[0]?.toUpperCase()}</div><h3 className="mt-4 text-xl font-bold">{user?.name}</h3><p className="text-sm text-slate-500">Content creator</p></div></section><section className="grid gap-4 sm:grid-cols-2"><Info icon={User} label="Full name" value={user?.name}/><Info icon={Mail} label="Email address" value={user?.email}/><Info icon={CalendarDays} label="Member since" value={user?.created_at?formatDate(user.created_at):'—'}/><Info icon={ShieldCheck} label="Account status" value="Active and protected"/></section><section className="card p-6"><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"><KeyRound size={20}/></span><div><h3 className="font-semibold">Security</h3><p className="mt-1 text-sm leading-6 text-slate-500">Your password is stored as a one-way bcrypt hash. API requests use short-lived signed JWT access tokens.</p></div></div></section></div>
}
function Info({icon:Icon,label,value}){return <article className="card flex items-center gap-4 p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Icon size={18}/></span><div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 truncate text-sm font-semibold">{value}</p></div></article>}
