import { motion } from 'framer-motion'

/**
 * Setas e marcações "desenhadas à mão" em SVG.
 * Usado pra anotar detalhes em mapas, fotos, ícones — em estilo caderno/sketch.
 *
 * Cada tipo tem variantes de orientação. O componente é posicionável via classes
 * Tailwind absolutas pelo pai (ex: className="absolute top-10 left-1/2").
 *
 *  type:
 *    'arrow-curve'   — seta com curva suave
 *    'arrow-zigzag'  — seta com pequenas oscilações
 *    'circle'        — círculo irregular (destaca elemento)
 *    'underline'     — sublinhado ondulado
 *    'asterisk'      — estrelinha de destaque
 *    'star'          — estrela manual
 */

const variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 220, damping: 18 } },
}

function ArrowCurve({ width = 120, height = 80, flip = false, color = '#6E1F26' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 80" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <path
        d="M 8 10 C 30 10, 50 14, 70 30 C 86 44, 92 58, 100 70"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 100 70 L 90 60 M 100 70 L 108 56"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function ArrowZigzag({ width = 110, height = 38, color = '#6E1F26' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 110 38" fill="none">
      <path
        d="M 6 22 Q 18 14, 30 22 T 56 22 T 86 22 L 96 22"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M 96 22 L 86 14 M 96 22 L 86 30" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function CircleMark({ size = 180, color = '#6E1F26' }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 180 108" fill="none">
      <path
        d="M 14 60 C 14 22, 80 8, 120 12 C 156 16, 172 38, 170 62 C 168 86, 132 102, 88 100 C 44 98, 10 86, 14 60 Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function Underline({ width = 160, height = 18, color = '#6E1F26' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 18" fill="none">
      <path
        d="M 4 12 Q 30 4, 56 10 T 110 10 T 156 8"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function Asterisk({ size = 36, color = '#6E1F26' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <g stroke={color} strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="4" x2="18" y2="32" />
        <line x1="4" y1="18" x2="32" y2="18" />
        <line x1="8" y1="8" x2="28" y2="28" />
        <line x1="28" y1="8" x2="8" y2="28" />
      </g>
    </svg>
  )
}

function Star({ size = 40, color = '#6E1F26' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M 20 4 L 24 16 L 36 18 L 27 26 L 30 38 L 20 31 L 10 38 L 13 26 L 4 18 L 16 16 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default function SketchMark({
  type = 'arrow-curve',
  className = '',
  style,
  delay = 0,
  label,
  labelClassName = '',
  color = '#6E1F26',
  ...props
}) {
  const M = {
    'arrow-curve': ArrowCurve,
    'arrow-zigzag': ArrowZigzag,
    circle: CircleMark,
    underline: Underline,
    asterisk: Asterisk,
    star: Star,
  }[type]

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      style={style}
      variants={variants}
      initial="hidden"
      animate="show"
      transition={{ delay }}
    >
      <M color={color} {...props} />
      {label && (
        <div className={`font-hand text-wine text-lg leading-tight ${labelClassName}`}>{label}</div>
      )}
    </motion.div>
  )
}
