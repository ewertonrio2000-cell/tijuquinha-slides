import { motion } from 'framer-motion'
import EditableText from './EditableText'

/**
 * Título com "pincelada" terracota atrás — estilo da referência "A MARÉ QUE QUEREMOS".
 * O blob é um SVG com bordas irregulares; o título fica sobre ele.
 */
const BLOB_PATHS = {
  // Manchas painted-looking com bordas orgânicas
  a: 'M 12 50 C 6 22, 40 4, 90 8 C 158 14, 220 22, 280 38 C 332 52, 360 92, 320 130 C 280 168, 200 168, 132 152 C 70 138, 18 110, 12 50 Z',
  b: 'M 20 80 C 10 30, 60 6, 130 14 C 200 22, 280 8, 320 60 C 340 110, 318 158, 240 168 C 168 178, 80 170, 36 138 C 8 118, 24 100, 20 80 Z',
}

export default function BrushTitle({
  value,
  onChange,
  size = 'xl',
  color = '#A85F47',
  blob = 'a',
  className = '',
}) {
  const sizes = {
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl',
    '2xl': 'text-7xl',
  }
  return (
    <div className={`relative inline-block ${className}`}>
      <motion.svg
        viewBox="0 0 340 180"
        className="absolute -top-3 -left-5 -right-5 -bottom-3 w-[calc(100%+40px)] h-[calc(100%+24px)]"
        preserveAspectRatio="none"
        initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <path d={BLOB_PATHS[blob]} fill={color} opacity="0.95" />
      </motion.svg>
      <motion.div
        className="relative z-10 px-4 py-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <EditableText
          value={value}
          onChange={onChange}
          multiline
          className={`font-display ${sizes[size]} leading-[0.95] uppercase text-cream`}
        />
      </motion.div>
    </div>
  )
}
