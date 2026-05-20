import { motion } from 'framer-motion'

/**
 * Container que anima os filhos em sequência (stagger).
 * Use combinado com <StaggerItem /> para itens individuais.
 */
export function Stagger({ children, className = '', delay = 0, gap = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', y = 14, ...props }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
