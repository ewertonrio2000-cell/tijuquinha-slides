import { useRef, useState } from 'react'
import { Upload, X, RefreshCw, Loader2 } from 'lucide-react'
import { IMAGES_BUCKET, supabase, supabaseReady } from '../lib/supabase'

/**
 * Área de upload de imagem. Sobe para o Supabase Storage e armazena a URL pública.
 * Fallback: se Supabase indisponível, salva como base64 (modo offline / dev sem .env).
 *
 * Props:
 *  - value: string | null  → URL pública (ou data:base64 no fallback)
 *  - onChange: (url|null) => void
 *  - className, rounded, label, fit: estilo
 */
export default function ImageUpload({
  value,
  onChange,
  className = '',
  rounded = 'md',
  label,
  fit = 'cover',
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const uploadToSupabase = async (file) => {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: upErr } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })
    if (upErr) throw upErr
    const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Imagem muito grande (máx. 10 MB). Reduza antes de subir.')
      return
    }
    setError(null)
    if (!supabaseReady) {
      // Fallback: base64 local
      const reader = new FileReader()
      reader.onload = (e) => onChange?.(e.target.result)
      reader.readAsDataURL(file)
      return
    }
    setUploading(true)
    try {
      const url = await uploadToSupabase(file)
      onChange?.(url)
    } catch (err) {
      console.error('[Upload]', err)
      setError(err.message || 'Erro ao subir imagem')
    } finally {
      setUploading(false)
    }
  }

  const onSelect = (e) => handleFile(e.target.files?.[0])
  const onDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files?.[0])
  }

  const radius = {
    none: 'rounded-none',
    md: 'rounded-md',
    lg: 'rounded-xl',
    full: 'rounded-full',
  }[rounded]

  return (
    <div
      className={`relative group bg-neutral-100 border border-line overflow-hidden ${radius} ${className}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onSelect}
      />

      {value ? (
        <>
          <img
            src={value}
            alt={label || 'imagem'}
            className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
            draggable={false}
          />
          <div className="edit-only absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              type="button"
              title="Trocar imagem"
              onClick={() => inputRef.current?.click()}
              className="p-1.5 bg-white/90 hover:bg-white text-ink rounded-md shadow-sm border border-line"
            >
              <RefreshCw size={14} />
            </button>
            <button
              type="button"
              title="Remover imagem"
              onClick={() => onChange?.(null)}
              className="p-1.5 bg-white/90 hover:bg-white text-ink rounded-md shadow-sm border border-line"
            >
              <X size={14} />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="edit-only absolute inset-0 w-full h-full flex flex-col items-center justify-center text-neutral-400 hover:text-ink hover:bg-neutral-50 transition disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={22} strokeWidth={1.5} className="animate-spin" />
              <span className="text-[11px] mt-1.5 font-medium tracking-wide uppercase">Enviando…</span>
            </>
          ) : (
            <>
              <Upload size={22} strokeWidth={1.5} />
              <span className="text-[11px] mt-1.5 font-medium tracking-wide uppercase">
                Adicionar imagem
              </span>
              {label && (
                <span className="text-[10px] mt-1 text-neutral-500">{label}</span>
              )}
            </>
          )}
        </button>
      )}

      {uploading && value && (
        <div className="edit-only absolute inset-0 bg-white/60 flex items-center justify-center">
          <Loader2 size={22} className="animate-spin text-ink" />
        </div>
      )}

      {error && (
        <div className="edit-only absolute bottom-1 left-1 right-1 bg-red-50 border border-red-200 text-red-700 text-[10px] px-2 py-1 rounded">
          {error}
        </div>
      )}

      {value && label && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-[11px] uppercase tracking-wider px-2 py-1 font-medium">
          {label}
        </div>
      )}
    </div>
  )
}
