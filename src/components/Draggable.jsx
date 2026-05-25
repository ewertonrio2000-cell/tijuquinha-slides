import { useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { Move, RotateCcw, Trash2 } from 'lucide-react'
import { usePosition, useHidden } from './SizeContext'

/**
 * Wrapper que torna qualquer elemento reposicionável (drag), removível e restaurável.
 *
 * Props:
 *  - positionKey: identificador único (também usado para hidden)
 *  - children
 *  - className
 *  - handle: 'auto' | 'always' | 'none'
 *  - inline: bool
 *  - allowDelete: bool — mostra botão de excluir no handle (default true)
 */
export default function Draggable({
  positionKey,
  children,
  className = '',
  handle = 'auto',
  inline = false,
  zIndex = 5,
  allowDelete = true,
}) {
  const [pos, setPos, resetPos] = usePosition(positionKey)
  const [isHidden, setIsHidden] = useHidden(positionKey)
  const [hover, setHover] = useState(false)
  const [dragging, setDragging] = useState(false)
  const enabled = !!setPos

  const mvX = useMotionValue(pos.x)
  const mvY = useMotionValue(pos.y)

  // Se está oculto, não renderiza (mas o positionKey continua reservado pra restauração)
  if (isHidden) return null

  return (
    <motion.div
      className={`relative ${inline ? 'inline-block' : ''} ${className}`}
      drag={enabled}
      dragMomentum={false}
      dragElastic={0}
      style={{
        x: mvX,
        y: mvY,
        cursor: enabled ? (dragging ? 'grabbing' : 'grab') : undefined,
        zIndex: hover || dragging ? 40 : zIndex,
      }}
      onDragStart={() => setDragging(true)}
      onDragEnd={(_, info) => {
        setDragging(false)
        if (!enabled) return
        const newX = pos.x + info.offset.x
        const newY = pos.y + info.offset.y
        mvX.set(newX)
        mvY.set(newY)
        setPos({ x: newX, y: newY })
      }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      {children}

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
                mvX.set(0)
                mvY.set(0)
                resetPos && resetPos()
              }}
              className="px-1.5 py-0.5 hover:bg-wine-700 rounded-full"
              title="Voltar à posição original"
            >
              <RotateCcw size={11} />
            </button>
          )}
          {allowDelete && setIsHidden && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsHidden(true)
              }}
              className="px-1.5 py-0.5 hover:bg-red-700 rounded-full"
              title="Excluir este elemento"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
