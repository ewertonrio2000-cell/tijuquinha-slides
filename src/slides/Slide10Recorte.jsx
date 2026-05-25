import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import Polaroid from '../components/Polaroid'
import SlideTitle from '../components/SlideTitle'
import SketchMark from '../components/SketchMark'
import { SizeProvider } from '../components/SizeContext'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '10',
  title: 'Recorte do\nProjeto',
  description:
    'O recorte selecionado corresponde ao trecho mais conflituoso da Estrada da Barra da Tijuca, onde as calçadas são estreitas, há baixa permeabilidade e a ausência de equipamentos urbanos é mais sentida pelos moradores.',
  scale: 'Escala 1:500',
  detail: 'CAD do trecho de intervenção',
  image: null,
  sizes: {},
  positions: {},
}

export default function Slide10Recorte({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-12 flex flex-col gap-4">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-9 flex items-center justify-center relative">
          <Polaroid
            value={d.image}
            onChange={(v) => set({ image: v })}
            rotation={-1.5}
            positionKey="cad"
            tape
            width={680}
            height={440}
            delay={0.2}
          />
          <SketchMark
            type="arrow-zigzag"
            className="absolute -bottom-2 left-12"
            delay={0.7}
            width={140}
          />
          <motion.div
            className="absolute bottom-2 left-32 font-hand text-wine text-xl rotate-[-3deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            trecho selecionado
          </motion.div>
        </div>
        <motion.div
          className="col-span-3 flex flex-col justify-between"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-[13px] text-muted leading-relaxed">
            <EditableText value={d.description} onChange={(v) => set({ description: v })} multiline />
          </div>
          <div className="border-t border-line pt-3 space-y-1">
            <div className="font-hand text-wine text-2xl leading-tight">
              <EditableText value={d.scale} onChange={(v) => set({ scale: v })} />
            </div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-wine font-semibold">
              <EditableText value={d.detail} onChange={(v) => set({ detail: v })} multiline />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </SizeProvider>
  )
}
