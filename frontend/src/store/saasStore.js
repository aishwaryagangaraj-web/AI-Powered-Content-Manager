import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const now = new Date().toISOString()

const seedNotifications = [
  { id: 1, title: 'Workspace ready', message: 'Your premium AI workspace is ready to use.', type: 'success', read: false, createdAt: now },
  { id: 2, title: 'Weekly goal', message: 'You are 3 drafts away from your weekly goal.', type: 'insight', read: false, createdAt: now },
]

const seedTemplates = [
  { id: 'launch', name: 'Product launch story', category: 'Marketing', description: 'A narrative launch post with positioning, proof and CTA.', prompt: 'Write a product launch story for [product] aimed at [audience].', favorite: true, custom: false },
  { id: 'newsletter', name: 'Weekly newsletter', category: 'Email', description: 'A concise update with insight, links and a clear next step.', prompt: 'Create a weekly newsletter about [topics] for [audience].', favorite: false, custom: false },
  { id: 'seo-brief', name: 'SEO content brief', category: 'SEO', description: 'Intent, outline, keywords, questions and conversion goal.', prompt: 'Build an SEO brief for [keyword] targeting [audience].', favorite: false, custom: false },
  { id: 'thought-leadership', name: 'Thought leadership post', category: 'Social', description: 'A contrarian insight structured for LinkedIn engagement.', prompt: 'Write a thought leadership post about [topic] with a practical takeaway.', favorite: true, custom: false },
  { id: 'case-study', name: 'Customer case study', category: 'Sales', description: 'Problem, approach, evidence and customer outcome.', prompt: 'Create a case study for [customer] using [results].', favorite: false, custom: false },
  { id: 'resume', name: 'Impact-first resume', category: 'Career', description: 'Achievement-led bullets with measurable business impact.', prompt: 'Rewrite these resume bullets to lead with measurable impact: [bullets].', favorite: false, custom: false },
  { id: 'instagram-caption', name: 'Instagram caption', category: 'Social', description: 'A scroll-stopping hook, useful caption, CTA, and focused hashtags.', prompt: 'Write an Instagram caption about [topic] for [audience] in a [tone] voice.', favorite: false, custom: false },
  { id: 'professional-email', name: 'Professional email', category: 'Email', description: 'A concise, outcome-focused business email with a clear next step.', prompt: 'Write a professional email to [recipient] about [topic] with the goal of [outcome].', favorite: false, custom: false },
  { id: 'product-description', name: 'Product description', category: 'Marketing', description: 'Benefit-led product copy with differentiation, proof, and CTA.', prompt: 'Write a product description for [product] aimed at [audience], emphasizing [benefits].', favorite: false, custom: false },
  { id: 'youtube-description', name: 'YouTube description', category: 'Social', description: 'A searchable video description with summary, chapters, and CTA.', prompt: 'Write a YouTube description for a video about [topic], including chapters and keywords.', favorite: false, custom: false },
]

export const useSaaSStore = create(persist((set) => ({
  draft: { title: 'Untitled campaign', content: '', updatedAt: null },
  members: [
    { id: 1, name: 'Alex Morgan', email: 'alex@contentos.team', role: 'Owner', status: 'active', avatar: 'AM' },
    { id: 2, name: 'Maya Chen', email: 'maya@contentos.team', role: 'Editor', status: 'active', avatar: 'MC' },
    { id: 3, name: 'Noah Williams', email: 'noah@contentos.team', role: 'Viewer', status: 'active', avatar: 'NW' },
  ],
  comments: [
    { id: 1, author: 'Maya Chen', text: 'The opening is strong. Can we add the customer metric here?', createdAt: now, resolved: false },
    { id: 2, author: 'Noah Williams', text: 'Brand voice looks consistent with the Q2 campaign.', createdAt: now, resolved: true },
  ],
  events: [
    { id: 1, title: 'Product launch article', date: '2026-06-23', channel: 'Blog', status: 'Scheduled' },
    { id: 2, title: 'Founder story', date: '2026-06-25', channel: 'LinkedIn', status: 'Review' },
    { id: 3, title: 'June product digest', date: '2026-06-28', channel: 'Email', status: 'Draft' },
    { id: 4, title: 'Workflow carousel', date: '2026-07-02', channel: 'Instagram', status: 'Scheduled' },
  ],
  templates: seedTemplates,
  notifications: seedNotifications,
  preferences: { email: true, ai: true, comments: true, weekly: true, product: false },
  saveDraft: (draft) => set({ draft: { ...draft, updatedAt: new Date().toISOString() } }),
  inviteMember: (email, role) => set((state) => ({ members: [...state.members, { id: Date.now(), name: email.split('@')[0], email, role, status: 'invited', avatar: email.slice(0, 2).toUpperCase() }] })),
  addComment: (text) => set((state) => ({ comments: [{ id: Date.now(), author: 'You', text, createdAt: new Date().toISOString(), resolved: false }, ...state.comments] })),
  toggleComment: (id) => set((state) => ({ comments: state.comments.map((item) => item.id === id ? { ...item, resolved: !item.resolved } : item) })),
  addEvent: (event) => set((state) => ({ events: [...state.events, { ...event, id: Date.now() }] })),
  addTemplate: (template) => set((state) => ({ templates: [{ ...template, id: Date.now(), custom: true, favorite: false }, ...state.templates] })),
  toggleTemplate: (id) => set((state) => ({ templates: state.templates.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item) })),
  addNotification: (title, message, type = 'success') => set((state) => ({ notifications: [{ id: Date.now(), title, message, type, read: false, createdAt: new Date().toISOString() }, ...state.notifications] })),
  readAll: () => set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, read: true })) })),
  setPreferences: (preferences) => set({ preferences }),
}), { name: 'contentos-saas' }))
