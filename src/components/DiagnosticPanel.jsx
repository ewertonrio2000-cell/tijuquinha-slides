import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, RotateCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { supabase, supabaseReady, SLIDES_TABLE, IMAGES_BUCKET } from '../lib/supabase'

function StatusRow({ label, ok, detail }) {
  const Icon = ok === null ? AlertCircle : ok ? CheckCircle2 : XCircle
  const color = ok === null ? 'text-neutral-400' : ok ? 'text-emerald-500' : 'text-red-500'
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon size={16} className={`mt-0.5 ${color}`} />
      <div className="flex-1">
        <div className="font-medium text-ink">{label}</div>
        {detail && <div className="text-[12px] text-muted break-all">{detail}</div>}
      </div>
    </div>
  )
}

export default function DiagnosticPanel({ open, onClose }) {
  const [tests, setTests] = useState({})
  const [running, setRunning] = useState(false)

  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  const maskedKey = key ? key.slice(0, 12) + '…' + key.slice(-6) : '—'

  const runTests = async () => {
    setRunning(true)
    const results = {}

    // Test 1: leitura
    try {
      const { data, error, status } = await supabase
        .from(SLIDES_TABLE)
        .select('id')
        .limit(1)
      results.read = error
        ? { ok: false, detail: `Erro ${status}: ${error.message}` }
        : { ok: true, detail: `OK — ${data?.length ?? 0} linha(s) retornada(s)` }
    } catch (e) {
      results.read = { ok: false, detail: `Excepção: ${e.message}` }
    }

    // Test 2: escrita (upsert + delete)
    try {
      const testId = '__diagnostic_' + Date.now()
      const { error: upErr } = await supabase
        .from(SLIDES_TABLE)
        .upsert({ id: testId, data: { test: true } })
      if (upErr) {
        results.write = { ok: false, detail: `Upsert falhou: ${upErr.message}` }
      } else {
        await supabase.from(SLIDES_TABLE).delete().eq('id', testId)
        results.write = { ok: true, detail: 'Upsert + delete OK' }
      }
    } catch (e) {
      results.write = { ok: false, detail: `Excepção: ${e.message}` }
    }

    // Test 3: storage
    try {
      const path = `__diag_${Date.now()}.png`
      const blob = await fetch(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNk+M/wHwAEAAH/7N3sVwAAAABJRU5ErkJggg==',
      ).then((r) => r.blob())
      const { error: upErr } = await supabase.storage
        .from(IMAGES_BUCKET)
        .upload(path, blob, { contentType: 'image/png' })
      if (upErr) {
        results.storage = { ok: false, detail: `Upload falhou: ${upErr.message}` }
      } else {
        await supabase.storage.from(IMAGES_BUCKET).remove([path])
        results.storage = { ok: true, detail: 'Upload + remove OK' }
      }
    } catch (e) {
      results.storage = { ok: false, detail: `Excepção: ${e.message}` }
    }

    setTests(results)
    setRunning(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[90]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="fixed top-16 right-6 w-[420px] max-h-[78vh] overflow-auto bg-white border border-line rounded-lg shadow-2xl z-[91] p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-wine font-semibold mb-1">
                  Diagnóstico de sincronização
                </div>
                <h2 className="font-display text-2xl uppercase text-ink leading-none">Conexão Supabase</h2>
              </div>
              <button onClick={onClose} className="text-neutral-500 hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <StatusRow
                label="Variáveis de ambiente carregadas"
                ok={supabaseReady}
                detail={
                  supabaseReady
                    ? `URL: ${url}\nKey: ${maskedKey}`
                    : 'VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram embutidas no build. Vá em Vercel > Settings > Environment Variables, garanta que existam para "Production" e faça um novo deploy.'
                }
              />
              <StatusRow label="Tabela" ok={null} detail={SLIDES_TABLE} />
              <StatusRow label="Bucket de imagens" ok={null} detail={IMAGES_BUCKET} />
            </div>

            <button
              onClick={runTests}
              disabled={running || !supabaseReady}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-wine text-cream rounded-md text-sm font-medium hover:bg-wine-700 disabled:opacity-50 mb-4"
            >
              <RotateCw size={14} className={running ? 'animate-spin' : ''} />
              {running ? 'Testando…' : 'Rodar teste de conexão'}
            </button>

            {Object.keys(tests).length > 0 && (
              <div className="space-y-2.5 border-t border-line pt-4">
                <StatusRow label="Leitura no banco" ok={tests.read?.ok} detail={tests.read?.detail} />
                <StatusRow label="Escrita no banco" ok={tests.write?.ok} detail={tests.write?.detail} />
                <StatusRow label="Upload de imagem (Storage)" ok={tests.storage?.ok} detail={tests.storage?.detail} />
              </div>
            )}

            <div className="mt-5 text-[11px] text-muted leading-relaxed border-t border-line pt-3">
              <strong>Como interpretar:</strong>
              <br />
              ✅ Tudo verde = sua colega vai ver suas edições em segundos.
              <br />
              ❌ Vermelho em "Variáveis" = env vars não foram aplicadas no Vercel. Configure em Settings &gt;
              Environment Variables (para Production!) e clique em "Redeploy" no último deploy.
              <br />
              ❌ Vermelho em "Escrita" = problema de permissão no Supabase. Me avise o texto exato do erro.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
