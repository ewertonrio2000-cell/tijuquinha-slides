import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EyeOff, RotateCcw } from 'lucide-react'
import { useHiddenList } from './SizeContext'

/**
 * Badge que aparece no canto do slide quando há elementos ocultos.
 * Clica → abre popover com lista de keys + botão restaurar.
 */
export default function HiddenItemsBadge() {
  const { hidden, restoreHidden, restoreAllHidden } = useHiddenList()
  const [open, setOpen] = useState(false)

  if (!hidden || hidden.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="edit-only absolute bottom-4 left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-cream text-[11px] uppercase tracking-[0.2em] font-semibold rounded-full shadow hover:bg-neutral-800"
        title="Itens ocultos neste slide"
      >
        <EyeOff size={12} />
        <span>{hidden.length} oculto{hidden.length > 1 ? 's' : ''}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="edit-only absolute bottom-16 left-4 z-40 bg-white border border-line rounded-lg shadow-xl p-3 w-[280px] max-h-[60vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-line">
              <div className="text-[10px] uppercase tracking-[0.3em] text-wine font-semibold">
                Itens ocultos
              </div>
              <button
                type="button"
                onClick={() => {
                  restoreAllHidden()
                  setOpen(false)
                }}
                className="text-[10px] uppercase tracking-wider text-wine hover:text-wine-700 font-semibold flex items-center gap-1"
              >
                <RotateCcw size={10} /> restaurar todos
              </button>
            </div>
            <ul className="space-y-1">
              {hidden.map((key) => (
                <li key={key} className="flex items-center justify-between gap-2 py-1 hover:bg-cream-100 rounded px-2">
                  <span className="text-[12px] text-ink truncate flex-1">{key}</span>
                  <button
                    type="button"
                    onClick={() => restoreHidden(key)}
                    className="text-[10px] uppercase tracking-wider text-wine hover:bg-wine hover:text-cream px-2 py-0.5 rounded font-semibold border border-wine"
                  >
                    Restaurar
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
