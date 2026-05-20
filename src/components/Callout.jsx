import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Move } from 'lucide-react'

/**
 * Callout = "anotação flutuante" com seta + label manuscrito.
 *
 * Estado controlado por props (posição em % do slide, rotação, label).
 * O usuário pode:
 *  - Arrastar pra reposicionar
 *  - Editar o label inline
 *  - Remover (X)
 *
 * Props:
 *  - x, y         — posição em % (0..100) relativa ao slide 1280x720
 *  - label        — texto manuscrito
 *  - rotation     — graus de rotação aplicados à seta (apontando direção)
 *  - color        — cor da seta/label (default #1A1A1A pra contraste no creme)
 *  - onChange     — recebe { x, y, label, rotation }
 *  - onRemove     — opcional, mostra botão de lixeira
 *  - arrowLength  — comprimento da seta (default 70)
 *  - editable     — quando false, modo apresentação (sem handles)
 */
export default function Callout({
  x = 50,
  y = 50,
  label = 'anotação',
  rotation = -30,
  color = '#1A1A1A',
  onChange,
  onRemove,
  arrowLength = 70,
  editable = true,
}) {
  const ref = useRef(null)
  const [hover, setHover] = useState(false)
  const labelRef = useRef(null)

  const commitLabel = () => {
    if (!onChange) return
    const newLabel = labelRef.current?.innerText ?? label
    if (newLabel !== label) onChange({ x, y, label: newLabel, rotation })
  }

  const handleDragEnd = (_, info) => {
    if (!onChange) return
    // Converte offset px para % do slide 1280x720
    const dxPct = (info.offset.x / 1280) * 100
    const dyPct = (info.offset.y / 720) * 100
    const nextX = Math.max(0, Math.min(100, x + dxPct))
    const nextY = Math.max(0, Math.min(100, y + dyPct))
    onChange({ x: nextX, y: nextY, label, rotation })
  }

  // A seta aponta DO label (parte de baixo-direita) PARA o ponto âncora (x,y)
  // — usuários posicionam o âncora; o label fica deslocado abaixo/à direita conforme rotation.
  const arrowAngle = (rotation * Math.PI) / 180
  const dx = Math.cos(arrowAngle) * arrowLength
  const dy = Math.sin(arrowAngle) * arrowLength

  return (
    <motion.div
      ref={ref}
      className="absolute select-none"
      style={{ left: `${x}%`, top: `${y}%`, zIndex: 20 }}
      drag={editable}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      {/* Ponto âncora */}
      <div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          background: color,
          left: -4,
          top: -4,
        }}
      />

      {/* Seta SVG do ponto até o label */}
      <svg
        width={Math.abs(dx) + 20}
        height={Math.abs(dy) + 20}
        viewBox={`0 0 ${Math.abs(dx) + 20} ${Math.abs(dy) + 20}`}
        className="absolute pointer-events-none"
        style={{
          left: dx >= 0 ? 0 : dx - 10,
          top: dy >= 0 ? 0 : dy - 10,
        }}
      >
        <path
          d={`M 10 10 Q ${Math.abs(dx) / 2 + (dy >= 0 ? -10 : 10)} ${
            Math.abs(dy) / 2 + (dx >= 0 ? -10 : 10)
          } ${Math.abs(dx) + 10} ${Math.abs(dy) + 10}`}
          stroke={color}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          transform={`${dx < 0 ? 'translate(' + (Math.abs(dx) + 20) + ',0) scale(-1,1)' : ''} ${
            dy < 0 ? 'translate(0,' + (Math.abs(dy) + 20) + ') scale(1,-1)' : ''
          }`}
        />
      </svg>

      {/* Label manuscrito */}
      <div
        className="absolute font-hand whitespace-nowrap"
        style={{
          left: dx,
          top: dy,
          color,
          fontSize: '1.05rem',
          fontWeight: 600,
        }}
      >
        <div
          ref={labelRef}
          contentEditable={editable}
          suppressContentEditableWarning
          onBlur={commitLabel}
          className="outline-none px-1 leading-tight"
        >
          {label}
        </div>

        {/* Controles edit-only */}
        {editable && hover && (
          <div className="edit-only absolute -top-2 -right-2 flex gap-0.5">
            <button
              type="button"
              className="p-0.5 bg-white/90 border border-line rounded text-wine cursor-grab"
              title="Arraste para mover"
            >
              <Move size={11} />
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-0.5 bg-white/90 border border-line rounded text-wine"
                title="Remover anotação"
              >
                <X size={11} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
