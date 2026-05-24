import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { onToast, dismissToast } from '../lib/toast'

const KIND = {
  success: { Icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900' },
  error: { Icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900' },
  info: { Icon: Info, bg: 'bg-cream-200', border: 'border-line', text: 'text-ink' },
}

export default function ToastContainer() {
  const [items, setItems] = useState([])

  useEffect(() => {
    return onToast((evt) => {
      if (evt.type === 'add') setItems((prev) => [...prev, evt.item])
      else if (evt.type === 'remove') setItems((prev) => prev.filter((i) => i.id !== evt.id))
    })
  }, [])

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {items.map((it) => {
          const k = KIND[it.kind] || KIND.info
          const Icon = k.Icon
          return (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg border ${k.bg} ${k.border} ${k.text} flex items-start gap-3 min-w-[280px] max-w-md text-sm`}
            >
              <Icon size={18} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1 leading-snug whitespace-pre-line">{it.message}</div>
              <button onClick={() => dismissToast(it.id)} className="text-current opacity-50 hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
