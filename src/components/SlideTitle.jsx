import { motion } from 'framer-motion'
import EditableText from './EditableText'

/**
 * Título de slide no estilo da referência:
 *  - eyebrow pequeno em caixa-alta tracking wide bordô
 *  - título grande em Bebas Neue (font-display) UPPERCASE
 *  - linha bordô fina abaixo
 *  - opcional `tone="wine"` para slides com fundo bordô (texto creme).
 */
export default function SlideTitle({ value, onChange, eyebrow, size = 'lg', tone = 'dark' }) {
  const sizes = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-6xl',
    xl: 'text-7xl',
    '2xl': 'text-8xl',
  }
  const titleColor = tone === 'wine' ? 'text-cream' : 'text-ink'
  const eyebrowColor = tone === 'wine' ? 'text-cream/70' : 'text-wine'
  const barColor = tone === 'wine' ? 'bg-cream' : 'bg-wine'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {eyebrow && (
        <div className={`text-[11px] uppercase tracking-[0.35em] mb-3 font-semibold ${eyebrowColor}`}>
          {eyebrow}
        </div>
      )}
      <EditableText
        value={value}
        onChange={onChange}
        multiline
        className={`font-display ${sizes[size]} leading-[0.95] uppercase ${titleColor}`}
      />
      <div className={`${barColor} mt-3`} style={{ width: 56, height: 2.5 }} />
    </motion.div>
  )
}
