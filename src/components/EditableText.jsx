import { useEffect, useRef } from 'react'
import { useSize } from './SizeContext'
import Draggable from './Draggable'
import ResizeCorner from './ResizeCorner'

/**
 * Texto editável inline via contentEditable.
 * - Suporta `sizeKey`: handle persistente no canto para redimensionar fonte
 * - Suporta `positionKey`: wraps em Draggable para reposicionar
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
  const [size, , setSizeAbs] = useSize(sizeKey, 1)

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

  const content = (
    <span className="relative inline-block w-full">
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

      {sizeKey && setSizeAbs && (
        <ResizeCorner
          value={size}
          onChange={setSizeAbs}
          tooltip="Arraste para redimensionar a fonte"
        />
      )}
    </span>
  )

  if (positionKey) {
    return <Draggable positionKey={positionKey} inline>{content}</Draggable>
  }
  return content
}
