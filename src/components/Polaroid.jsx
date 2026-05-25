import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Crop } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { useSize } from './SizeContext'
import Draggable from './Draggable'

/**
 * Polaroid: borda branca, leve rotação, sombra, tape opcional, legenda manuscrita.
 *
 * Props extras:
 *  - sizeKey: identificador único pra persistir o multiplicador no SizeContext.
 *  - fitToggle: bool — mostra botão de alternar cover/contain
 *  - fit: 'cover' | 'contain' (default 'cover' — imagem preenche o quadrado todo)
 */
export default function Polaroid({
  value,
  onChange,
  rotation,
  tape = false,
  caption,
  onCaptionChange,
  width = 220,
  height = 200,
  className = '',
  delay = 0,
  zIndex = 1,
  sizeKey,
  positionKey,
  fit = 'cover',
  fitToggle = true,
}) {
  const r = rotation ?? 0
  const [hover, setHover] = useState(false)
  const [size, setSizeDelta] = useSize(sizeKey, 1)
  const [fitMode, setFitMode] = useState(fit)

  const W = width * size
  const H = height * size

  const inner = (
    <motion.div
      className={`relative bg-white p-2.5 pb-7 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] ${className}`}
      style={{ width: W + 20, transformOrigin: 'center center', zIndex }}
      initial={{ opacity: 0, y: 12, rotate: r - 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, rotate: r, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, rotate: r * 0.6, zIndex: 30, transition: { duration: 0.2 } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {tape && <div className="tape" />}
      <div style={{ width: W, height: H }} className="bg-neutral-100 overflow-hidden relative">
        <ImageUpload value={value} onChange={onChange} className="w-full h-full" rounded="none" fit={fitMode} />
      </div>
      {(caption !== undefined || onCaptionChange) && (
        <div className="absolute bottom-1 left-2.5 right-2.5 font-hand text-ink text-sm text-center">
          {onCaptionChange ? (
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onCaptionChange(e.currentTarget.innerText)}
              className="outline-none px-1"
            >
              {caption || 'legenda'}
            </span>
          ) : (
            caption
          )}
        </div>
      )}

      {/* Controles visíveis no hover (edit mode) */}
      {hover && (sizeKey || fitToggle) && (
        <div className="edit-only absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-wine text-cream rounded-full px-1 py-0.5 shadow-md z-30">
          {sizeKey && setSizeDelta && (
            <>
              <button
                type="button"
                onClick={() => setSizeDelta(-0.1)}
                className="px-1.5 py-0.5 hover:bg-wine-700 rounded-full"
                title="Diminuir imagem"
              >
                <Minus size={11} />
              </button>
              <span className="text-[10px] font-mono px-1 tabular-nums">{size.toFixed(1)}×</span>
              <button
                type="button"
                onClick={() => setSizeDelta(0.1)}
                className="px-1.5 py-0.5 hover:bg-wine-700 rounded-full"
                title="Aumentar imagem"
              >
                <Plus size={11} />
              </button>
            </>
          )}
          {fitToggle && (
            <>
              <span className="w-px h-3 bg-cream/30 mx-0.5" />
              <button
                type="button"
                onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
                className="px-1.5 py-0.5 hover:bg-wine-700 rounded-full flex items-center gap-1"
                title={fitMode === 'cover' ? 'Mostrar imagem inteira (contain)' : 'Preencher quadro (cover)'}
              >
                <Crop size={10} />
                <span className="text-[9px] uppercase tracking-wider">{fitMode}</span>
              </button>
            </>
          )}
        </div>
      )}
    </motion.div>
  )

  if (positionKey) {
    return <Draggable positionKey={positionKey} inline>{inner}</Draggable>
  }
  return inner
}
