import { useEffect, useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useSize } from './SizeContext'
import Draggable from './Draggable'

/**
 * Texto editável inline via contentEditable.
 * - Suporta `sizeKey` que persiste um multiplicador de tamanho via SizeContext.
 * - Quando `sizeKey` está presente, mostra A+/A- no hover (edit mode).
 */
export default function EditableText({
  value,
  onChange,
  className = '',
  placeholder = 'Clique para editar',
  multiline = false,
  as: Tag = 'div',
  sizeKey,
  positionKey,
}) {
  const ref = useRef(null)
  const focusedRef = useRef(false)
  const [hover, setHover] = useState(false)
  const [size, setSizeDelta] = useSize(sizeKey, 1)

  useEffect(() => {
    if (!ref.current) return
    if (focusedRef.current) return
    if (ref.current.innerText !== (value ?? '')) {
      ref.current.innerText = value ?? ''
    }
  }, [value])

  const handleInput = (e) => {
    onChange?.(e.currentTarget.innerText)
  }

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  const showControls = sizeKey && setSizeDelta && hover

  const content = (
    <span
      className="relative inline-block w-full"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Tag
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => (focusedRef.current = true)}
        onBlur={() => (focusedRef.current = false)}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className={`outline-none ${!value ? 'text-neutral-400' : ''} ${className}`}
        style={{
          whiteSpace: multiline ? 'pre-wrap' : 'normal',
          fontSize: sizeKey ? `${size}em` : undefined,
          lineHeight: sizeKey ? 1.1 : undefined,
        }}
      >
        {value || ''}
      </Tag>

      {showControls && (
        <span
          className="edit-only absolute -top-7 right-0 flex items-center gap-0.5 bg-wine text-cream rounded-full px-1 py-0.5 shadow-md z-30 select-none"
          contentEditable={false}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSizeDelta(-0.1)
            }}
            className="px-1 hover:bg-wine-700 rounded-full"
            title="Diminuir fonte"
          >
            <Minus size={11} />
          </button>
          <span className="text-[10px] font-mono px-1 tabular-nums">{size.toFixed(1)}×</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSizeDelta(0.1)
            }}
            className="px-1 hover:bg-wine-700 rounded-full"
            title="Aumentar fonte"
          >
            <Plus size={11} />
          </button>
        </span>
      )}
    </span>
  )

  if (positionKey) {
    return <Draggable positionKey={positionKey} inline>{content}</Draggable>
  }
  return content
}
