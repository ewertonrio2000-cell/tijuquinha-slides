import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import SketchMark from '../components/SketchMark'
import { SizeProvider } from '../components/SizeContext'
import FreeTextLayer from '../components/FreeTextLayer'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '13',
  title: 'Corte da Rua',
  description:
    'O corte transversal demonstra a nova distribuição do espaço viário: calçadas de 3 m com piso tátil, faixa de arborização e mobiliário, ciclovia segregada de 2,5 m, faixa de rolamento reduzida e nova travessia elevada.',
  measurements:
    '• Calçada: 3,00 m\n• Faixa de arborização: 1,20 m\n• Ciclovia bidirecional: 2,50 m\n• Faixa de rolamento: 3,00 m por sentido\n• Ponto de ônibus: integrado à calçada',
  image: null,
  sizes: {},
  positions: {},
  freeTexts: [],
}

export default function Slide13Corte({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-12 flex flex-col gap-5">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <motion.div
          className="col-span-8 flex flex-col relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ImageUpload
            value={d.image}
            onChange={(v) => set({ image: v })}
            className="w-full h-full"
            rounded="lg"
            fit="contain"
            label="Corte via Streetmix"
          />
          <SketchMark
            type="circle"
            className="absolute top-1/3 left-1/3"
            delay={0.8}
            size={180}
          />
          <motion.div
            className="absolute top-[28%] left-[40%] font-hand text-wine text-xl rotate-[-3deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            ciclovia segregada
          </motion.div>
        </motion.div>

        <motion.div
          className="col-span-4 flex flex-col gap-4"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-wine mb-2 font-semibold">
              Descrição
            </div>
            <div className="text-[13px] text-muted leading-relaxed">
              <EditableText value={d.description} onChange={(v) => set({ description: v })} multiline  positionKey="description" sizeKey="description"/>
            </div>
          </div>
          <div className="border-t border-line pt-4 relative">
            <div className="text-[11px] uppercase tracking-[0.3em] text-wine mb-2 font-semibold">
              Dimensões
            </div>
            <div className="text-[13px] text-ink leading-relaxed font-medium">
              <EditableText value={d.measurements} onChange={(v) => set({ measurements: v })} multiline  positionKey="measurements" sizeKey="measurements"/>
            </div>
            <SketchMark
              type="underline"
              className="absolute -bottom-1 left-0"
              delay={0.9}
              width={160}
            />
          </div>
        </motion.div>
      </div>
    </div>
      <FreeTextLayer texts={d.freeTexts} onChange={(freeTexts) => set({ freeTexts })} />
    </SizeProvider>
  )
}
