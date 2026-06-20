import { ArrowLeft, Eye, EyeOff, LoaderCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import api, { errorMessage } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/uiStore'

export default function AuthPage({ mode }) {
  const register = mode === 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const addToast = useToastStore((state) => state.addToast)
  const navigate = useNavigate()
  const submit = async (event) => {
    event.preventDefault(); setLoading(true)
    try {
      const payload = register ? form : { email: form.email, password: form.password }
      const { data } = await api.post(`/auth/${register ? 'register' : 'login'}`, payload)
      setAuth(data); addToast(register ? 'Your workspace is ready.' : 'Welcome back.'); navigate('/app')
    } catch (error) { addToast(errorMessage(error), 'error') } finally { setLoading(false) }
  }
  return <div className="grid min-h-screen bg-white dark:bg-slate-950 lg:grid-cols-2"><section className="relative hidden overflow-hidden bg-[#090d18] p-12 text-white lg:flex lg:flex-col"><div className="absolute inset-0 opacity-50 mesh"/><div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl"/><div className="relative"><Logo /></div><div className="relative my-auto max-w-xl"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/10 shadow-xl"><Sparkles /></span><h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight">Turn ideas into content people want to read.</h1><p className="mt-5 text-lg leading-8 text-slate-400">Create, collaborate, schedule, and measure every piece from one intelligent workspace.</p><div className="mt-8 grid grid-cols-3 gap-3">{[['30s','Auto-save'],['8','AI formats'],['100%','Private']].map(([value,label])=><div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="font-bold">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{label}</p></div>)}</div></div><p className="relative text-sm text-slate-500">Secure JWT authentication · Private content ownership</p></section><section className="relative flex items-center justify-center p-5 sm:p-10"><div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-50/60 to-transparent dark:from-brand-500/5"/><div className="relative w-full max-w-md"><Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:-translate-x-1 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={16}/> Back home</Link><div className="mb-8 lg:hidden"><Logo /></div><h2 className="text-3xl font-bold tracking-tight">{register ? 'Create your account' : 'Welcome back'}</h2><p className="mt-2 text-sm text-slate-500">{register ? 'Start building your content system today.' : 'Sign in to continue to your workspace.'}</p><form className="mt-8 space-y-5" onSubmit={submit}>{register && <label><span className="label">Full name</span><input className="input" autoComplete="name" required minLength="2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Alex Morgan"/></label>}<label><span className="label">Email address</span><input className="input" autoComplete="email" required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="alex@company.com"/></label><label><span className="label">Password</span><div className="relative"><input className="input pr-11" autoComplete={register?'new-password':'current-password'} required minLength={register ? 8 : undefined} type={show?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 8 characters"/><button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={show?'Hide password':'Show password'}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>{register&&<p className="mt-1.5 text-xs text-slate-400">Use at least 8 characters.</p>}</label><button disabled={loading} className="btn-primary w-full py-3">{loading&&<LoaderCircle className="animate-spin" size={17}/>} {loading?'Please wait…':register?'Create account':'Sign in'}</button></form><p className="mt-7 text-center text-sm text-slate-500">{register?'Already have an account?':'New to ContentOS?'} <Link className="font-semibold text-brand-600 hover:text-brand-700" to={register?'/login':'/register'}>{register?'Sign in':'Create an account'}</Link></p></div></section></div>
}
