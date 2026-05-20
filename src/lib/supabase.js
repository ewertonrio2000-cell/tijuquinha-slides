import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const SLIDES_TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'tijuquinha_slides'
export const IMAGES_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'tijuquinha-images'

if (!url || !key) {
  // Mensagem clara na hora de rodar sem env vars
  // eslint-disable-next-line no-console
  console.error(
    '[Tijuquinha] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não definidos. Crie um .env (veja .env.example).',
  )
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 5 } },
})

export const supabaseReady = Boolean(url && key)

// Pequeno event bus para o indicador global de sync
const listeners = new Set()
let currentStatus = supabaseReady ? 'idle' : 'error'

export function getSyncStatus() {
  return currentStatus
}

export function setSyncStatus(s) {
  currentStatus = s
  listeners.forEach((l) => l(s))
}

export function onSyncStatus(cb) {
  listeners.add(cb)
  cb(currentStatus)
  return () => listeners.delete(cb)
}

