import { useRef, useState } from 'react'

/**
 * Handle persistente no canto inferior direito do elemento.
 * Arraste para baixo-direita → aumenta. Arraste para cima-esquerda → diminui.
 *
 * Props:
 *  - value: número atual (multiplicador)
 *  - onChange: (novoValor) => void
 *  - min, max: limites (default 0.3..4)
 *  - sensitivity: quanto cada px de drag muda o valor (default 0.005 = 200px ⇒ +1.0)
 *  - tooltip: texto do title
 *  - color: cor do handle (default bordô)
 */
export default function ResizeCorner({
  value,
  onChange,
  min = 0.3,
  max = 4,
  sensitivity = 0.005,
  tooltip,
  color = '#6E1F26',
}) {
  const startRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [hover, setHover] = useState(false)

  if (!onChange) return null

  const onPointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    startRef.current = { x: e.clientX, y: e.clientY, val: value }
    setDragging(true)
  }
  const onPointerMove = (e) => {
    if (!startRef.current) return
    const dx = e.clientX - startRef.current.x
    const dy = e.clientY - startRef.current.y
    // Diagonal: combina X e Y. Movimento pra baixo-direita aumenta.
    const delta = (dx + dy) * sensitivity
    let next = startRef.current.val + delta
    next = Math.max(min, Math.min(max, next))
    onChange(+next.toFixed(2))
  }
  const onPointerUp = (e) => {
    startRef.current = null
    setDragging(false)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => e.stopPropagation()}
      title={tooltip || 'Arraste para redimensionar'}
      className="edit-only absolute z-30 flex items-center justify-center select-none"
      style={{
        bottom: -6,
        right: -6,
        width: 16,
        height: 16,
        background: color,
        color: '#F5EFE6',
        borderRadius: '50% 4px 4px 4px',
        cursor: 'nwse-resize',
        boxShadow: dragging ? '0 0 0 3px rgba(110,31,38,0.3)' : '0 1px 3px rgba(0,0,0,0.25)',
        touchAction: 'none',
        transition: 'box-shadow 0.15s',
      }}
    >
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M 1 8 L 8 1 M 4 8 L 8 4 M 7 8 L 8 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      {(hover || dragging) && (
        <span
          className="absolute pointer-events-none whitespace-nowrap"
          style={{
            top: -22,
            right: 0,
            background: color,
            color: '#F5EFE6',
            padding: '2px 6px',
            fontSize: 10,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            borderRadius: 3,
            fontWeight: 600,
          }}
        >
          {value.toFixed(2)}×
        </span>
      )}
    </div>
  )
}
