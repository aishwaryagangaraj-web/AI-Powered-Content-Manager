import { Archive, ArrowRight, FileText, Heart, Sparkles, Type } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import api, { errorMessage } from '../services/api'
import { useToastStore } from '../store/uiStore'
import { relativeTime, typeLabel } from '../utils/format'

const statConfig = [
  ['total_content', 'Total content', FileText, 'text-brand-600 bg-brand-50 dark:bg-brand-500/10'],
  ['words_generated', 'Words generated', Type, 'text-violet-600 bg-violet-50 dark:bg-violet-500/10'],
  ['favorites', 'Favorites', Heart, 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'],
  ['archived', 'Archived', Archive, 'text-amber-600 bg-amber-50 dark:bg-amber-500/10']
]

const demoDaily = [
  { date: 'Mon', count: 2 }, { date: 'Tue', count: 4 }, { date: 'Wed', count: 3 },
  { date: 'Thu', count: 6 }, { date: 'Fri', count: 5 }, { date: 'Sat', count: 7 }, { date: 'Sun', count: 4 }
]

const demoRecent = [
  { id: 'demo-1', title: 'How AI changes creative workflows', content_type: 'blog', generated_text: 'A practical guide to using AI as a thoughtful creative partner.' },
  { id: 'demo-2', title: 'Product launch announcement', content_type: 'linkedin', generated_text: 'A concise, confident launch story designed to start conversations.' },
  { id: 'demo-3', title: 'Weekly community update', content_type: 'email', generated_text: 'A clear newsletter draft that keeps readers informed and engaged.' }
]

function ContentCard({ item, demo = false }) {
  const card = <>
    <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{typeLabel(item.content_type)}</span>
    <h4 className="mt-4 truncate font-semibold">{item.title}</h4>
    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{item.generated_text}</p>
    <p className={`mt-4 text-xs ${demo ? 'font-medium text-brand-600' : 'text-slate-400'}`}>{demo ? 'Example' : relativeTime(item.updated_at)}</p>
  </>
  return demo
    ? <article className="card border-dashed p-5">{card}</article>
    : <Link to={`/app/library?id=${item.id}`} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-soft">{card}</Link>
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToastStore((state) => state.addToast)

  useEffect(() => {
    Promise.all([api.get('/analytics/dashboard'), api.get('/content?page_size=4&archived=false')])
      .then(([analytics, content]) => { setData(analytics.data); setRecent(content.data.items) })
      .catch((error) => addToast(errorMessage(error), 'error'))
      .finally(() => setLoading(false))
  }, [addToast])

  if (loading) return <Loading />
  if (!data) return <EmptyState title="Dashboard unavailable" message="The analytics service could not be reached. Please refresh and try again." />

  const isDemo = data.summary.total_content === 0
  const visibleContent = isDemo ? demoRecent : recent

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><p className="text-sm font-medium text-brand-600">Your content command center</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Build something worth sharing.</h2></div>
      <Link to="/app/create" className="btn-primary"><Sparkles size={17}/> Create with AI</Link>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statConfig.map(([key, label, Icon, color]) => <article key={key} className="card p-5"><div className="flex items-center justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={19}/></span><span className="text-xs text-slate-400">All time</span></div><p className="mt-5 text-2xl font-bold">{data.summary[key].toLocaleString()}</p><p className="mt-1 text-sm text-slate-500">{label}</p></article>)}
    </section>

    {isDemo && <div className="flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-brand-700 dark:text-brand-100">Previewing an active workspace</p><p className="mt-0.5 text-xs text-brand-600/80 dark:text-brand-100/70">Example charts and cards disappear as soon as you save your first piece.</p></div><Link to="/app/create" className="text-sm font-semibold text-brand-700 dark:text-brand-100">Create your first draft →</Link></div>}

    <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <article className="card p-5 sm:p-6"><div className="mb-6 flex items-start justify-between gap-3"><div><h3 className="font-semibold">Creation activity</h3><p className="text-sm text-slate-500">Content created over the last 7 days</p></div>{isDemo && <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-500/10 dark:text-brand-100">Preview</span>}</div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={isDemo ? demoDaily : data.daily}><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6172f3" stopOpacity={.35}/><stop offset="95%" stopColor="#6172f3" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b833"/><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }}/><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}/><Area type="monotone" dataKey="count" stroke="#6172f3" strokeWidth={3} fill="url(#area)"/></AreaChart></ResponsiveContainer></div></article>
      <article className="card p-5 sm:p-6"><h3 className="font-semibold">Recent activity</h3><p className="mb-5 text-sm text-slate-500">Latest workspace changes</p><div className="space-y-5">{data.recent_activity.length ? data.recent_activity.slice(0, 6).map((activity) => <div key={activity.id} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500 ring-4 ring-brand-50 dark:ring-brand-500/10"/><div><p className="text-sm font-medium leading-5">{activity.action}</p><p className="mt-0.5 text-xs text-slate-400">{relativeTime(activity.timestamp)}</p></div></div>) : <div className="rounded-xl border border-dashed p-4"><p className="text-sm font-medium">Your activity starts here</p><p className="mt-1 text-xs leading-5 text-slate-500">Generate, save, favorite, or archive content to build your timeline.</p></div>}</div></article>
    </section>

    <section><div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold">{isDemo ? 'Example content' : 'Recent content'}</h3><p className="text-sm text-slate-500">{isDemo ? 'A preview of what your library can become' : 'Continue where you left off'}</p></div>{!isDemo && <Link to="/app/library" className="flex items-center gap-1 text-sm font-semibold text-brand-600">View all <ArrowRight size={15}/></Link>}</div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{visibleContent.map((item) => <ContentCard key={item.id} item={item} demo={isDemo}/>)}</div></section>
  </div>
}
