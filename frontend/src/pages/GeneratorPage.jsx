import { Check, Copy, LoaderCircle, Save, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { API_URL, errorMessage } from '../services/api'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/uiStore'

const templates = [
  { id: 'blog', name: 'Blog post', emoji: '✦', hint: 'Long-form articles with a clear narrative' },
  { id: 'linkedin', name: 'LinkedIn post', emoji: 'in', hint: 'Professional posts that start conversations' },
  { id: 'instagram', name: 'Instagram caption', emoji: '◎', hint: 'Captions with hooks and hashtags' },
  { id: 'email', name: 'Email writer', emoji: '@', hint: 'Clear, outcome-focused emails' },
  { id: 'resume', name: 'Resume summary', emoji: '◫', hint: 'Achievement-oriented career summaries' },
  { id: 'seo', name: 'SEO article', emoji: '⌁', hint: 'Search-friendly structured content' },
  { id: 'product', name: 'Product description', emoji: '◇', hint: 'Benefit-led product copy that converts' },
  { id: 'youtube', name: 'YouTube description', emoji: '▶', hint: 'Searchable video summaries and chapters' }
]

export default function GeneratorPage() {
  const [form, setForm] = useState({ content_type: 'blog', prompt: '', tone: 'professional', length: 'medium' })
  const [title, setTitle] = useState('')
  const [result, setResult] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const token = useAuthStore((s) => s.token)
  const addToast = useToastStore((s) => s.addToast)

  const generate = async (e) => {
    e.preventDefault(); setGenerating(true); setResult('')
    try {
      const response = await fetch(`${API_URL}/ai/stream`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(form) })
      if (!response.ok) throw new Error((await response.json()).detail || 'Generation failed')
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        buffer += decoder.decode(value, { stream: true }); const events = buffer.split('\n\n'); buffer = events.pop()
        for (const event of events) { if (!event.startsWith('data: ')) continue; const data = JSON.parse(event.slice(6)); if (data.error) throw new Error(data.error); if (data.chunk) setResult((r)=>r+data.chunk) }
      }
    } catch (error) { addToast(errorMessage(error), 'error') } finally { setGenerating(false) }
  }
  const save = async () => {
    if (!result) return
    setSaving(true)
    try { await api.post('/content', { content_type: form.content_type, prompt: form.prompt, title: title || `${templates.find(t=>t.id===form.content_type).name} draft`, generated_text: result }); addToast('Content saved to your library.') } catch(e) { addToast(errorMessage(e),'error') } finally { setSaving(false) }
  }
  const copy = async () => { try { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),1500) } catch { addToast('Clipboard access was blocked. Select and copy the draft manually.', 'error') } }
  return <div className="space-y-6"><div><h2 className="text-2xl font-bold tracking-tight">AI writing studio</h2><p className="mt-1 text-sm text-slate-500">Choose a workflow, describe the outcome, and shape the draft.</p></div><div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]"><form onSubmit={generate} className="card h-fit p-5 sm:p-6"><label className="label">Content format</label><div className="grid grid-cols-2 gap-2">{templates.map(t=><button type="button" key={t.id} onClick={()=>setForm({...form,content_type:t.id})} className={`rounded-xl border p-3 text-left transition ${form.content_type===t.id?'border-brand-500 bg-brand-50 ring-2 ring-brand-500/10 dark:bg-brand-500/10':'hover:bg-slate-50 dark:hover:bg-slate-800'}`}><span className="text-sm font-semibold"><i className="mr-2 not-italic text-brand-600">{t.emoji}</i>{t.name}</span><p className="mt-1 hidden text-xs leading-5 text-slate-500 sm:block">{t.hint}</p></button>)}</div><label className="mt-5 block"><span className="label">What should it communicate?</span><textarea className="input min-h-36 resize-y" required minLength="3" value={form.prompt} onChange={e=>setForm({...form,prompt:e.target.value})} placeholder="Describe the topic, audience, key points, and desired outcome..."/><span className="mt-1 block text-right text-xs text-slate-400">{form.prompt.length}/10,000</span></label><div className="grid grid-cols-2 gap-3"><label><span className="label">Tone</span><select className="input" value={form.tone} onChange={e=>setForm({...form,tone:e.target.value})}><option>professional</option><option>friendly</option><option>confident</option><option>conversational</option><option>persuasive</option></select></label><label><span className="label">Length</span><select className="input" value={form.length} onChange={e=>setForm({...form,length:e.target.value})}><option>short</option><option>medium</option><option>long</option></select></label></div><button disabled={generating||!form.prompt.trim()} className="btn-primary mt-5 w-full py-3">{generating?<LoaderCircle className="animate-spin" size={17}/>:<Sparkles size={17}/>} {generating?'Writing your draft...':'Generate content'}</button></form>
      <section className="card flex min-h-[600px] flex-col overflow-hidden"><header className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"><input value={title} onChange={e=>setTitle(e.target.value)} className="min-w-0 flex-1 bg-transparent font-semibold outline-none" placeholder="Untitled draft"/><div className="flex gap-2"><button disabled={!result} onClick={copy} className="btn-secondary px-3 py-2">{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'Copied':'Copy'}</button><button disabled={!result||saving} onClick={save} className="btn-primary px-3 py-2">{saving?<LoaderCircle className="animate-spin" size={16}/>:<Save size={16}/>} Save</button></div></header><div className="scrollbar flex-1 overflow-auto p-5 sm:p-7">{result ? <textarea className="h-full min-h-[480px] w-full resize-none bg-transparent text-sm leading-7 outline-none" value={result} onChange={e=>setResult(e.target.value)}/> : <div className="grid h-full min-h-[480px] place-items-center text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10"><Sparkles/></span><h3 className="mt-4 font-semibold">Your draft will appear here</h3><p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-slate-500">Select a format and describe what you want to create. You can edit the result before saving.</p></div></div>}</div></section></div></div>
}
