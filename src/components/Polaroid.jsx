import { motion } from 'framer-motion'
import ImageUpload from './ImageUpload'

/**
 * Imagem em formato polaroid: moldura branca, leve rotação, sombra, "fita" no topo.
 *
 * Props:
 *  - value, onChange: imagem (URL ou null) — passa pro ImageUpload
 *  - rotation: graus de rotação (default aleatório baseado em seed)
 *  - tape: bool — mostra "washi tape" no topo
 *  - caption: rótulo abaixo (editável via children opcional)
 *  - width/height: dimensões do quadro interno (a moldura adiciona padding)
 *  - className: classes do container
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
}) {
  // Rotação default leve, pseudo-random consistente por instância
  const r = rotation ?? 0

  return (
    <motion.div
      className={`relative bg-white p-2.5 pb-7 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] ${className}`}
      style={{ width: width + 20, transformOrigin: 'center center', zIndex }}
      initial={{ opacity: 0, y: 12, rotate: r - 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, rotate: r, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, rotate: r * 0.6, zIndex: 30, transition: { duration: 0.2 } }}
    >
      {tape && <div className="tape" />}
      <div style={{ width, height }} className="bg-neutral-100 overflow-hidden">
        <ImageUpload value={value} onChange={onChange} className="w-full h-full" rounded="none" />
      </div>
      {(caption !== undefined || onCaptionChange) && (
        <div className="absolute bottom-1 left-2.5 right-2.5 font-hand text-ink text-sm text-center">
          {onCaptionChange ? (
            // EditableText inline via contenteditable
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
    </motion.div>
  )
}
