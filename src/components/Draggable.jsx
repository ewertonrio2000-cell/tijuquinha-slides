import { useState } from 'react'
import { motion } from 'framer-motion'
import { Move, RotateCcw } from 'lucide-react'
import { usePosition } from './SizeContext'

/**
 * Wrapper que torna qualquer elemento reposicionável via drag.
 *
 * Props:
 *  - positionKey: identificador único para guardar o offset {x,y} no SizeContext
 *  - children: elemento a reposicionar
 *  - className: classes adicionais aplicadas ao container drag
 *  - handle: 'auto' (handle aparece no hover) | 'always' | 'none'
 *  - inline: bool — usa display: inline-block (default false = block-level)
 *
 * O offset é aplicado via style.x/y (transform). Inicial é {x:0,y:0} =
 * mantém posição original do layout. Cada drag-end soma o delta no offset.
 */
export default function Draggable({
  positionKey,
  children,
  className = '',
  handle = 'auto',
  inline = false,
  zIndex = 5,
}) {
  const [pos, setPos, resetPos] = usePosition(positionKey)
  const [hover, setHover] = useState(false)
  const [dragging, setDragging] = useState(false)
  const enabled = !!setPos

  return (
    <motion.div
      className={`relative ${inline ? 'inline-block' : ''} ${className}`}
      drag={enabled}
      dragMomentum={false}
      dragElastic={0}
      style={{
        x: pos.x,
        y: pos.y,
        cursor: enabled ? (dragging ? 'grabbing' : 'grab') : undefined,
        zIndex: hover || dragging ? 40 : zIndex,
      }}
      onDragStart={() => setDragging(true)}
      onDragEnd={(_, info) => {
        setDragging(false)
        if (enabled) setPos({ x: pos.x + info.offset.x, y: pos.y + info.offset.y })
      }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={enabled ? { scale: 1.005 } : undefined}
    >
      {children}

      {/* Indicador de drag + reset position */}
      {enabled && (handle === 'always' || (handle === 'auto' && hover)) && (
        <div
          className="edit-only absolute -top-3 -left-3 flex items-center gap-0.5 bg-wine text-cream rounded-full px-1 py-0.5 shadow-md z-50 pointer-events-auto"
          contentEditable={false}
        >
          <span className="px-1 py-0.5 flex items-center gap-1 text-[10px]" title="Arraste o objeto">
            <Move size={11} />
            <span>arraste</span>
          </span>
          {(pos.x !== 0 || pos.y !== 0) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                resetPos && resetPos()
              }}
              className="px-1.5 py-0.5 hover:bg-wine-700 rounded-full"
              title="Voltar à posição original"
            >
              <RotateCcw size={11} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
