import { AlignLeft, Bold, Check, ChevronDown, Clock3, Expand, Italic, List, ListOrdered, LoaderCircle, MessageSquare, Minus, Redo2, Save, Sparkles, Strikethrough, Underline, Undo2, WandSparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import api, { errorMessage } from '../services/api'
import { useSaaSStore } from '../store/saasStore'
import { useToastStore } from '../store/uiStore'

const aiActions = [
  { id: 'rewrite', label: 'Rewrite', icon: WandSparkles, prompt: 'Rewrite this text for clarity while preserving the meaning:' },
  { id: 'summarize', label: 'Summarize', icon: AlignLeft, prompt: 'Summarize this text into its most useful points:' },
  { id: 'grammar', label: 'Fix grammar', icon: Check, prompt: 'Correct grammar and improve readability without changing the meaning:' },
  { id: 'expand', label: 'Expand', icon: Expand, prompt: 'Expand this text with useful, specific detail:' },
  { id: 'shorten', label: 'Shorten', icon: Minus, prompt: 'Shorten this text while preserving the core message:' },
]

export default function WorkspacePage() {
  const { draft, saveDraft, addNotification } = useSaaSStore()
  const [title, setTitle] = useState(draft.title)
  const [selected, setSelected] = useState('')
  const [toneOpen, setToneOpen] = useState(false)
  const [working, setWorking] = useState('')
  const [savedAt, setSavedAt] = useState(draft.updatedAt)
  const editor = useRef(null)
  const savedRange = useRef(null)
  const addToast = useToastStore((s) => s.addToast)

  useEffect(() => { if (editor.current && draft.content) editor.current.innerHTML = draft.content }, [])
  const persist = (silent = false) => {
    const next = { title, content: editor.current?.innerHTML || '' }
    saveDraft(next); setSavedAt(new Date().toISOString())
    if (!silent) addToast('Draft saved to your workspace.')
  }
  useEffect(() => { const id = setInterval(() => persist(true), 30000); return () => clearInterval(id) }, [title])

  const captureSelection = () => {
    const selection = window.getSelection()
    if (selection?.rangeCount && editor.current?.contains(selection.anchorNode)) {
      setSelected(selection.toString().trim())
      if (selection.toString().trim()) savedRange.current = selection.getRangeAt(0).cloneRange()
    }
  }
  const command = (name, value) => { editor.current?.focus(); document.execCommand(name, false, value) }
  const transform = async (action, tone) => {
    if (!selected || !savedRange.current) { addToast('Select text in the editor first.', 'error'); return }
    setWorking(action.id || tone)
    try {
      const instruction = tone ? `Rewrite this text in a ${tone} tone:` : action.prompt
      const { data } = await api.post('/ai/generate', { content_type: 'general', prompt: `${instruction}\n\n${selected}`, tone: tone || 'professional', length: action.id === 'expand' ? 'long' : action.id === 'shorten' || action.id === 'summarize' ? 'short' : 'medium' })
      const range = savedRange.current
      range.deleteContents(); range.insertNode(document.createTextNode(data.generated_text))
      setSelected(''); savedRange.current = null; setToneOpen(false); persist(true)
      addToast(`AI ${tone ? 'tone change' : action.label.toLowerCase()} complete.`)
      addNotification('AI edit complete', `${tone ? `${tone} tone` : action.label} was applied to your selection.`, 'ai')
    } catch (error) { addToast(errorMessage(error), 'error') } finally { setWorking('') }
  }

  const wordCount = (editor.current?.innerText || '').trim().split(/\s+/).filter(Boolean).length
  return <div className="space-y-5">
    <PageHeader eyebrow="AI Workspace" title="Write with your team and AI" description="Select any passage to rewrite, summarize, refine, expand, shorten, or change its tone." actions={<><span className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs text-slate-500 dark:bg-slate-900"><Clock3 size={14}/>{savedAt ? `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Autosaves every 30s'}</span><button onClick={() => persist()} className="btn-primary"><Save size={16}/>Save</button></>}/>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 border-b bg-slate-50/70 p-2.5 dark:bg-slate-900">
          {[['undo',Undo2],['redo',Redo2],['bold',Bold],['italic',Italic],['underline',Underline],['strikeThrough',Strikethrough],['insertUnorderedList',List],['insertOrderedList',ListOrdered]].map(([name,Icon], index)=><button key={name} onClick={()=>command(name)} className={`editor-tool ${index===2||index===6?'ml-2':''}`} title={name}><Icon size={16}/></button>)}
          <span className="mx-2 hidden h-6 w-px bg-slate-200 sm:block"/>
          <select onChange={(e)=>command('formatBlock',e.target.value)} className="rounded-lg border bg-white px-2 py-1.5 text-xs dark:bg-slate-900"><option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select>
          <span className="ml-auto text-xs text-slate-400">{wordCount} words</span>
        </div>
        <div className="px-5 py-5 sm:px-10 sm:py-8">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full bg-transparent text-2xl font-bold tracking-tight outline-none placeholder:text-slate-300 sm:text-3xl" placeholder="Untitled content"/>
          <div ref={editor} contentEditable onMouseUp={captureSelection} onKeyUp={captureSelection} onInput={()=>setSavedAt(null)} data-placeholder="Start writing, or paste your content here…" className="prose-editor mt-6 min-h-[560px] text-[15px] leading-8 outline-none" suppressContentEditableWarning />
        </div>
      </section>
      <aside className="space-y-4">
        <section className="card p-4"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10"><Sparkles size={18}/></span><div><h3 className="text-sm font-semibold">AI actions</h3><p className="text-xs text-slate-500">{selected ? `${selected.split(/\s+/).length} words selected` : 'Select text to begin'}</p></div></div><div className="mt-4 grid grid-cols-2 gap-2">{aiActions.map((action)=><button key={action.id} disabled={!!working} onClick={()=>transform(action)} className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50 dark:hover:bg-brand-500/10">{working===action.id?<LoaderCircle className="animate-spin" size={14}/>:<action.icon size={14}/>} {action.label}</button>)}</div><div className="relative mt-2"><button disabled={!!working} onClick={()=>setToneOpen(!toneOpen)} className="flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-semibold"><span className="flex items-center gap-2"><MessageSquare size={14}/>Change tone</span><ChevronDown size={14}/></button>{toneOpen&&<div className="absolute inset-x-0 top-full z-10 mt-1 rounded-xl border bg-white p-1.5 shadow-xl dark:bg-slate-900">{['Professional','Friendly','Confident','Conversational','Persuasive'].map(tone=><button key={tone} onClick={()=>transform({id:'tone',label:'Tone',prompt:''},tone.toLowerCase())} className="block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800">{tone}</button>)}</div>}</div></section>
        <section className="card p-4"><h3 className="text-sm font-semibold">Document score</h3><div className="mt-4 flex items-center gap-4"><div className="relative grid h-20 w-20 place-items-center rounded-full bg-[conic-gradient(#6172f3_0_84%,#e2e8f0_84%)]"><span className="grid h-16 w-16 place-items-center rounded-full bg-white text-lg font-bold dark:bg-slate-900">84</span></div><div className="space-y-2 text-xs"><Score label="Clarity" value="Strong"/><Score label="Tone" value="On brand"/><Score label="Readability" value="Grade 8"/></div></div></section>
        <section className="rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10"><p className="text-xs font-semibold text-brand-700 dark:text-brand-100">Pro tip</p><p className="mt-1 text-xs leading-5 text-brand-700/70 dark:text-brand-100/70">Use Ctrl/Cmd + A inside the editor to transform the entire draft.</p></section>
      </aside>
    </div>
  </div>
}

function Score({label,value}) { return <div className="flex w-32 items-center justify-between gap-3"><span className="text-slate-500">{label}</span><strong>{value}</strong></div> }
