import EditableText from './EditableText'

export default function SlideTitle({ value, onChange, eyebrow, size = 'lg' }) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
    '2xl': 'text-6xl',
  }
  return (
    <div>
      {eyebrow && (
        <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-2 font-medium">
          {eyebrow}
        </div>
      )}
      <EditableText
        value={value}
        onChange={onChange}
        className={`${sizes[size]} font-bold tracking-tight leading-[1.05] text-ink`}
      />
      <div className="title-bar" />
    </div>
  )
}
