import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Type, Move, AlignJustify } from 'lucide-react'
import ResizeCorner from './ResizeCorner'

/**
 * Texto livre flutuante adicionado pelo usuário.
 *
 * text = {
 *   id, value, x, y (% do slide),
 *   size (multiplicador), width (px ou null = auto),
 *   color, fontFamily, bg, align
 * }
 */
export default function FreeText({ text, onChange, onRemove }) {
  const ref = useRef(null)
  const focusedRef = useRef(false)
  const [hover, setHover] = useState(false)
  const widthDragRef = useRef(null)

  useEffect(() => {
    if (!ref.current || focusedRef.current) return
    if (ref.current.innerText !== (text.value ?? '')) ref.current.innerText = text.value ?? ''
  }, [text.value])

  const handleInput = (e) => onChange({ ...text, value: e.currentTarget.innerText })

  const handleDragEnd = (_, info) => {
    const dxPct = (info.offset.x / 1280) * 100
    const dyPct = (info.offset.y / 720) * 100
    onChange({
      ...text,
      x: Math.max(0, Math.min(95, text.x + dxPct)),
      y: Math.max(0, Math.min(95, text.y + dyPct)),
    })
  }

  const fontFamily =
    text.fontFamily === 'display'
      ? "'Bebas Neue', sans-serif"
      : text.fontFamily === 'hand'
      ? "'Caveat', cursive"
      : "Inter, sans-serif"

  const align = text.align || 'left'

  const onWidthPointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const startW = text.width ?? ref.current?.offsetWidth ?? 200
    const startX = e.clientX
    widthDragRef.current = { startW, startX }
    e.target.setPointerCapture(e.pointerId)
  }
  const onWidthPointerMove = (e) => {
    if (!widthDragRef.current) return
    const next = Math.max(60, Math.min(1200, widthDragRef.current.startW + (e.clientX - widthDragRef.current.startX)))
    onChange({ ...text, width: Math.round(next) })
  }
  const onWidthPointerUp = (e) => {
    widthDragRef.current = null
    try { e.target.releasePointerCapture(e.pointerId) } catch {}
  }
  const onWidthDoubleClick = () => {
    // Reset largura pra auto
    onChange({ ...text, width: null })
  }

  return (
    <motion.div
      className="absolute select-none"
      style={{
        left: `${text.x}%`,
        top: `${text.y}%`,
        zIndex: hover ? 35 : 20,
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="relative inline-block">
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => (focusedRef.current = true)}
          onBlur={() => (focusedRef.current = false)}
          className="outline-none px-2 py-1 leading-tight"
          style={{
            fontFamily,
            fontSize: `${text.size}rem`,
            color: text.color || '#1A1A1A',
            background: text.bg || 'transparent',
            minWidth: 40,
            width: text.width ? `${text.width}px` : 'auto',
            textAlign: align,
            whiteSpace: text.width ? 'normal' : 'pre-wrap',
            wordBreak: text.width ? 'break-word' : 'normal',
            border: hover ? '1px dashed rgba(110, 31, 38, 0.4)' : '1px dashed transparent',
            borderRadius: 3,
            cursor: 'text',
          }}
        >
          {text.value || ''}
        </div>

        {/* Toolbar edit-only */}
        {hover && (
          <div
            className="edit-only absolute -top-7 left-0 flex items-center gap-0.5 bg-wine text-cream rounded-full px-1 py-0.5 shadow-md z-50"
            contentEditable={false}
          >
            <span className="px-1 py-0.5 flex items-center gap-1 text-[10px] cursor-grab">
              <Move size={10} />
              <span>mover</span>
            </span>
            <span className="w-px h-3 bg-cream/30" />
            <button
              type="button"
              onClick={() => {
                const cycle = ['sans', 'display', 'hand']
                const next = cycle[(cycle.indexOf(text.fontFamily || 'sans') + 1) % cycle.length]
                onChange({ ...text, fontFamily: next })
              }}
              className="px-1.5 py-0.5 hover:bg-wine-700 rounded text-[9px] uppercase tracking-wider font-semibold"
              title="Trocar tipografia"
            >
              <Type size={10} className="inline mr-0.5" />
              {text.fontFamily || 'sans'}
            </button>
            <span className="w-px h-3 bg-cream/30" />
            <button
              type="button"
              onClick={() => {
                const cycle = ['left', 'center', 'right']
                const next = cycle[(cycle.indexOf(align) + 1) % cycle.length]
                onChange({ ...text, align: next })
              }}
              className="px-1.5 py-0.5 hover:bg-wine-700 rounded text-[9px] uppercase tracking-wider font-semibold"
              title="Alinhamento do texto"
            >
              <AlignJustify size={10} className="inline mr-0.5" />
              {align}
            </button>
            <span className="w-px h-3 bg-cream/30" />
            <input
              type="color"
              value={text.color || '#1A1A1A'}
              onChange={(e) => onChange({ ...text, color: e.target.value })}
              className="w-4 h-4 rounded cursor-pointer border border-cream/30"
              title="Cor do texto"
            />
            <span className="w-px h-3 bg-cream/30" />
            <button
              type="button"
              onClick={onRemove}
              className="px-1.5 py-0.5 hover:bg-red-700 rounded"
              title="Remover texto"
            >
              <X size={11} />
            </button>
          </div>
        )}

        {/* Handle de largura (lateral direita — drag horizontal) */}
        <div
          className="edit-only absolute z-30 select-none"
          onPointerDown={onWidthPointerDown}
          onPointerMove={onWidthPointerMove}
          onPointerUp={onWidthPointerUp}
          onPointerCancel={onWidthPointerUp}
          onDoubleClick={onWidthDoubleClick}
          title="Arraste pra ajustar largura · duplo-clique pra resetar"
          style={{
            top: '50%',
            right: -8,
            transform: 'translateY(-50%)',
            width: 10,
            height: 32,
            background: '#6E1F26',
            color: '#F5EFE6',
            borderRadius: 3,
            cursor: 'ew-resize',
            touchAction: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 700,
          }}
        >
          ⇔
        </div>

        {/* Resize handle (canto inferior direito — drag diagonal pra escala) */}
        <ResizeCorner
          value={text.size}
          onChange={(v) => onChange({ ...text, size: v })}
          min={0.5}
          max={6}
          tooltip="Arraste para redimensionar a fonte"
        />
      </div>
    </motion.div>
  )
}
