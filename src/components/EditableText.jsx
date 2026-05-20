import { useEffect, useRef } from 'react'

/**
 * Texto editável inline via contentEditable.
 * - Mantém o cursor onde o usuário está editando (não re-renderiza enquanto focado).
 * - Suporta multiline via prop `multiline`.
 */
export default function EditableText({
  value,
  onChange,
  className = '',
  placeholder = 'Clique para editar',
  multiline = false,
  as: Tag = 'div',
}) {
  const ref = useRef(null)
  const focusedRef = useRef(false)

  // Sincroniza o DOM apenas quando o valor externo muda e não estamos editando.
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

  return (
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
      style={{ whiteSpace: multiline ? 'pre-wrap' : 'normal' }}
    >
      {value || ''}
    </Tag>
  )
}
