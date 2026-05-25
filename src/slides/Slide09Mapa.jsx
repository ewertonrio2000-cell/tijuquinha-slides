import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import SketchMark from '../components/SketchMark'
import { SizeProvider } from '../components/SizeContext'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '09',
  title: 'Mapa',
  legend: 'Mapa do trecho da Estrada da Barra da Tijuca — Tijuquinha, com indicação dos principais pontos de intervenção.',
  image: null,
  sizes: {},
  positions: {},
}

export default function Slide09Mapa({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-12 flex flex-col gap-4 relative">
      <div className="flex items-end justify-between">
        <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
        <motion.div
          className="text-[12px] text-muted max-w-md text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <EditableText value={d.legend} onChange={(v) => set({ legend: v })} multiline  positionKey="legend"/>
        </motion.div>
      </div>

      <motion.div
        className="flex-1 min-h-0 relative"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ImageUpload
          value={d.image}
          onChange={(v) => set({ image: v })}
          className="w-full h-full"
          rounded="lg"
          fit="contain"
          label="Mapa em alta resolução"
        />

        {/* Pin animado no canto e seta de destaque */}
        <motion.div
          className="absolute top-8 left-12 text-wine drop-shadow"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          <MapPin size={36} strokeWidth={2} fill="#6E1F26" />
        </motion.div>

        <SketchMark
          type="arrow-curve"
          className="absolute top-2 left-32"
          delay={0.9}
          width={100}
          height={60}
        />
        <motion.div
          className="absolute top-1 left-44 font-hand text-wine text-xl rotate-[-4deg]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          ponto crítico
        </motion.div>
      </motion.div>
    </div>
    </SizeProvider>
  )
}
