import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { if (import.meta.env.DEV) console.error('Application error boundary:', error, info) }
  render() {
    if (!this.state.error) return this.props.children
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-5 dark:bg-slate-950"><section className="card max-w-lg p-8 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10"><AlertTriangle/></span><h1 className="mt-5 text-xl font-bold">This view could not be loaded</h1><p className="mt-2 text-sm leading-6 text-slate-500">Your data is safe. Refresh the application to restore the workspace.</p><button onClick={()=>window.location.reload()} className="btn-primary mt-6"><RefreshCw size={16}/>Refresh application</button></section></main>
  }
}
