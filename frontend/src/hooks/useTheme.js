import { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'

export function useTheme() {
  const theme = useUIStore((state) => state.theme)
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && media.matches))
    apply(); media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])
  return theme
}
