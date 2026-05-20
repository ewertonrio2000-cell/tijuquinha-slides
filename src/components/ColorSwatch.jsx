import { motion } from 'framer-motion'

/**
 * Tira de paleta — quadrados de cor empilhados verticalmente.
 * As cores podem ser editadas (input type color) no modo edição.
 *
 * Props:
 *  - colors: string[] (hex)
 *  - onChange: (newColors[]) => void
 *  - direction: 'vertical' | 'horizontal'
 *  - size: tamanho do quadrado em px
 */
export default function ColorSwatch({
  colors = [],
  onChange,
  direction = 'vertical',
  size = 60,
  className = '',
}) {
  const isVert = direction === 'vertical'
  return (
    <div className={`flex ${isVert ? 'flex-col' : 'flex-row'} gap-0 ${className}`}>
      {colors.map((c, i) => (
        <motion.div
          key={i}
          className="relative group"
          style={{ width: size, height: size, background: c }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
        >
          {onChange && (
            <input
              type="color"
              value={c}
              onChange={(e) => {
                const next = colors.slice()
                next[i] = e.target.value
                onChange(next)
              }}
              className="edit-only absolute inset-0 opacity-0 cursor-pointer"
              title={`Editar cor ${i + 1}`}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
