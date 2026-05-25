import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crop } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { useSize } from './SizeContext'
import Draggable from './Draggable'
import ResizeCorner from './ResizeCorner'

/**
 * Polaroid: borda branca, leve rotação, sombra, tape opcional, legenda manuscrita.
 *
 * Props:
 *  - sizeKey/positionKey: integração com SizeContext
 *  - fit: 'cover' | 'contain' inicial (default cover — preenche o quadrado)
 *  - fitToggle: bool — mostra botão pra alternar cover/contain (default true)
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
  const [size, , setSizeAbs] = useSize(sizeKey, 1)
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

      {/* Botão de fit (canto superior direito, sempre visível em edit mode) */}
      {fitToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setFitMode(fitMode === 'cover' ? 'contain' : 'cover')
          }}
          className="edit-only absolute top-2 right-2 z-20 bg-wine text-cream rounded px-1.5 py-0.5 flex items-center gap-1 shadow-sm hover:bg-wine-700"
          title={fitMode === 'cover' ? 'Mostrar imagem inteira' : 'Preencher quadro'}
          style={{ fontSize: 9 }}
        >
          <Crop size={9} />
          <span className="uppercase tracking-wider font-semibold">{fitMode}</span>
        </button>
      )}

      {/* Handle persistente de redimensionamento */}
      {sizeKey && setSizeAbs && (
        <ResizeCorner
          value={size}
          onChange={setSizeAbs}
          tooltip="Arraste para redimensionar a imagem"
        />
      )}
    </motion.div>
  )

  if (positionKey) {
    return <Draggable positionKey={positionKey} inline>{inner}</Draggable>
  }
  return inner
}
