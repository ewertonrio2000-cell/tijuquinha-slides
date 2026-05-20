import { useCallback, useEffect, useRef, useState } from 'react'
import { SLIDES_TABLE, setSyncStatus, supabase, supabaseReady } from '../lib/supabase'

const CACHE_PREFIX = 'tijuquinha:slide:'

// JSON com chaves ordenadas — usado pra comparar payloads ignorando ordem de chaves
function canonicalJson(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  if (Array.isArray(obj)) return '[' + obj.map(canonicalJson).join(',') + ']'
  const keys = Object.keys(obj).sort()
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalJson(obj[k])).join(',') + '}'
}

/**
 * Lê do cache local imediato (pra não flashar o default antes do Supabase responder).
 */
function readCache(slideId, fallback) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + slideId)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return { ...fallback, ...parsed }
  } catch {
    return fallback
  }
}

function writeCache(slideId, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + slideId, JSON.stringify(data))
  } catch {
    /* quota exceeded ou bloqueado */
  }
}

/**
 * Hook que mantém o slide em sync com a tabela Supabase `tijuquinha_slides`.
 * - Lê uma vez no mount (e atualiza a partir do cache se houver).
 * - Salva no Supabase com debounce de 500ms.
 * - Escuta realtime: se outro usuário editar, o local atualiza.
 * - Mantém também um cache em localStorage como fallback offline.
 */
export function useSlideStorage(slideId, defaults) {
  const [data, setData] = useState(() => readCache(slideId, defaults))
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'saving' | 'saved' | 'error'
  const skipSaveRef = useRef(true) // não salva o estado inicial
  const debounceRef = useRef(null)
  const localVersionRef = useRef(0) // pra ignorar realtime de eventos que nós mesmos disparamos
  const lastSavedJsonRef = useRef(null)

  // Carregamento inicial
  useEffect(() => {
    let cancelled = false
    if (!supabaseReady) {
      skipSaveRef.current = false
      return
    }
    setStatus('loading'); setSyncStatus('loading')
    ;(async () => {
      const { data: row, error } = await supabase
        .from(SLIDES_TABLE)
        .select('data')
        .eq('id', slideId)
        .maybeSingle()
      if (cancelled) return
      if (error) {
        console.error('[Supabase load]', error)
        setStatus('error'); setSyncStatus('error')
        skipSaveRef.current = false
        return
      }
      if (row?.data) {
        const merged = { ...defaults, ...row.data }
        setData(merged)
        writeCache(slideId, merged)
        lastSavedJsonRef.current = canonicalJson(merged)
      }
      setStatus('saved'); setSyncStatus('saved')
      // libera saves a partir da próxima alteração do usuário
      skipSaveRef.current = false
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideId])

  // Persistência com debounce
  useEffect(() => {
    if (skipSaveRef.current) return
    writeCache(slideId, data) // cache imediato
    if (!supabaseReady) return

    const payload = canonicalJson(data)
    if (payload === lastSavedJsonRef.current) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setStatus('saving'); setSyncStatus('saving')
      const myVersion = ++localVersionRef.current
      // Marca o payload como "já gravado" ANTES do upsert, pra que o eco do realtime
      // (que volta em milissegundos) seja reconhecido e não dispare um novo save.
      lastSavedJsonRef.current = payload
      const { error } = await supabase
        .from(SLIDES_TABLE)
        .upsert({ id: slideId, data }, { onConflict: 'id' })
      if (error) {
        console.error('[Supabase save]', error)
        setStatus('error'); setSyncStatus('error')
        // se falhou, reabilita futura tentativa zerando o ref
        lastSavedJsonRef.current = null
        return
      }
      // Se houve outra alteração nesse meio tempo, não marca como saved
      if (myVersion === localVersionRef.current) {
        setStatus('saved'); setSyncStatus('saved')
      }
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [slideId, data])

  // Realtime
  useEffect(() => {
    if (!supabaseReady) return
    const channel = supabase
      .channel(`slide:${slideId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: SLIDES_TABLE,
          filter: `id=eq.${slideId}`,
        },
        (payload) => {
          const incoming = payload.new?.data
          if (!incoming) return
          const merged = { ...defaults, ...incoming }
          const mergedJson = canonicalJson(merged)
          // Se o conteúdo é o mesmo que já temos, ignora (evita loop de save).
          if (mergedJson === lastSavedJsonRef.current) return
          lastSavedJsonRef.current = mergedJson
          setData(merged)
          writeCache(slideId, merged)
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideId])

  const update = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }))
  }, [])

  const reset = useCallback(async () => {
    localStorage.removeItem(CACHE_PREFIX + slideId)
    if (supabaseReady) {
      await supabase.from(SLIDES_TABLE).delete().eq('id', slideId)
    }
    lastSavedJsonRef.current = null
    setData(defaults)
  }, [slideId, defaults])

  return [data, update, reset, status]
}

export async function resetAllSlides() {
  // Limpa cache local
  const toRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(CACHE_PREFIX)) toRemove.push(key)
  }
  toRemove.forEach((k) => localStorage.removeItem(k))
  // Limpa Supabase
  if (supabaseReady) {
    await supabase.from(SLIDES_TABLE).delete().neq('id', '')
  }
}
