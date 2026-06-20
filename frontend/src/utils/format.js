export const formatDate = (date) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
export const relativeTime = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
export const typeLabel = (type) => ({ linkedin: 'LinkedIn', instagram: 'Instagram', seo: 'SEO', youtube: 'YouTube' }[type] || type?.charAt(0).toUpperCase() + type?.slice(1))
