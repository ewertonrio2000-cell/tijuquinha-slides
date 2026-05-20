import { Download, Maximize2, Minimize2, RotateCcw, Trash2, Cloud, CloudOff, Loader2 } from 'lucide-react'

function SyncIndicator({ status }) {
  if (!status) return null
  const map = {
    loading: { icon: <Loader2 size={12} className="animate-spin" />, text: 'Carregando…', cls: 'text-neutral-400' },
    saving: { icon: <Loader2 size={12} className="animate-spin" />, text: 'Salvando…', cls: 'text-neutral-300' },
    saved: { icon: <Cloud size={12} />, text: 'Sincronizado', cls: 'text-emerald-400' },
    error: { icon: <CloudOff size={12} />, text: 'Erro ao sincronizar', cls: 'text-red-400' },
    idle: { icon: <Cloud size={12} />, text: 'Online', cls: 'text-neutral-500' },
  }
  const m = map[status] || map.idle
  return (
    <div className={`hidden md:flex items-center gap-1.5 text-[11px] ${m.cls}`}>
      {m.icon}
      <span>{m.text}</span>
    </div>
  )
}

export default function Toolbar({
  presentationMode,
  onTogglePresentation,
  onExportPDF,
  onResetSlide,
  onResetAll,
  exporting,
  syncStatus,
}) {
  if (presentationMode) {
    return (
      <button
        onClick={onTogglePresentation}
        className="fixed top-4 right-4 z-40 p-2 bg-white/80 hover:bg-white text-ink rounded-md shadow-sm border border-line backdrop-blur"
        title="Sair da apresentação (Esc)"
      >
        <Minimize2 size={16} />
      </button>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-neutral-900/95 backdrop-blur border-b border-neutral-800 text-white px-4 py-2.5 flex items-center justify-between z-30">
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold tracking-tight">
          Ateliê de Urbanismo — Tijuquinha
        </div>
        <div className="text-[11px] text-neutral-400 hidden md:block">
          Edite os textos clicando neles · alterações são sincronizadas online
        </div>
        <SyncIndicator status={syncStatus} />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onResetSlide}
          className="px-3 py-1.5 text-xs rounded-md bg-neutral-800 hover:bg-neutral-700 flex items-center gap-1.5 border border-neutral-700"
          title="Resetar o slide atual"
        >
          <RotateCcw size={13} /> <span>Resetar slide</span>
        </button>
        <button
          onClick={onResetAll}
          className="px-3 py-1.5 text-xs rounded-md bg-neutral-800 hover:bg-red-900/70 flex items-center gap-1.5 border border-neutral-700"
          title="Apagar todo o conteúdo salvo"
        >
          <Trash2 size={13} /> <span>Limpar tudo</span>
        </button>
        <div className="w-px h-5 bg-neutral-700 mx-1" />
        <button
          onClick={onTogglePresentation}
          className="px-3 py-1.5 text-xs rounded-md bg-neutral-800 hover:bg-neutral-700 flex items-center gap-1.5 border border-neutral-700"
          title="Modo apresentação"
        >
          <Maximize2 size={13} /> <span>Apresentar</span>
        </button>
        <button
          onClick={onExportPDF}
          disabled={exporting}
          className="px-3 py-1.5 text-xs rounded-md bg-white text-neutral-900 hover:bg-neutral-200 flex items-center gap-1.5 font-medium disabled:opacity-60"
          title="Exportar como PDF"
        >
          <Download size={13} />
          <span>{exporting ? 'Gerando PDF…' : 'Exportar PDF'}</span>
        </button>
      </div>
    </div>
  )
}
