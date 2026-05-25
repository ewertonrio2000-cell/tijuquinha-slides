import { motion } from 'framer-motion'
import { Footprints, Cable, Lightbulb, Bus } from 'lucide-react'
import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import SketchMark from '../components/SketchMark'
import { Stagger, StaggerItem } from '../components/Stagger'
import { SizeProvider } from '../components/SizeContext'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '08',
  title: 'Proposta\nUrbana',
  intro:
    'Quatro eixos integrados requalificam o espaço público e devolvem qualidade de vida à Tijuquinha.',
  image: null,
  axes: [
    { title: 'Calçadas', text: 'Uniformizar e aumentar calçadas para garantir maior conforto e acessibilidade.' },
    { title: 'Fiação', text: 'Remover os fios e fazer uma nova implantação de forma subterrânea.' },
    { title: 'Iluminação', text: 'Fazer o projeto de iluminação da rua principal e realocar os postes.' },
    { title: 'Pontos de Ônibus', text: 'Implantar pontos de ônibus mais confortáveis, de forma que a passagem não fique prejudicada.' },
  ],
  sizes: {},
}

const AXIS_ICONS = [Footprints, Cable, Lightbulb, Bus]

export default function Slide08Proposta({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setAxis = (i, patch) =>
    set({ axes: d.axes.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) })

  return (
    <SizeProvider sizes={d.sizes} onSizesChange={(sizes) => set({ sizes })}>
    <div className="w-full h-full p-12 flex flex-col gap-5 relative">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-7 flex flex-col gap-4">
          <motion.div
            className="text-base text-muted leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <EditableText value={d.intro} onChange={(v) => set({ intro: v })} multiline />
          </motion.div>

          <Stagger className="grid grid-cols-2 gap-3 flex-1 min-h-0" gap={0.1} delay={0.2}>
            {d.axes.map((a, i) => {
              const Icon = AXIS_ICONS[i] || Footprints
              return (
                <StaggerItem key={i} y={20}>
                  <motion.div
                    whileHover={{ y: -3, boxShadow: '0 10px 30px -10px rgba(110,31,38,0.25)' }}
                    className="border border-line bg-white rounded-lg p-4 flex flex-col gap-2 h-full"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={26} className="text-wine" strokeWidth={1.5} />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-wine/60 font-semibold ml-auto">
                        0{i + 1}
                      </span>
                    </div>
                    <EditableText
                      value={a.title}
                      onChange={(v) => setAxis(i, { title: v })}
                      className="font-display text-2xl uppercase tracking-wide text-ink leading-none"
                    />
                    <div className="bg-wine" style={{ width: 24, height: 2 }} />
                    <div className="text-[12px] text-muted leading-relaxed mt-1">
                      <EditableText
                        value={a.text}
                        onChange={(v) => setAxis(i, { text: v })}
                        multiline
                      />
                    </div>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>

        <div className="col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full h-full"
          >
            <ImageUpload value={d.image} onChange={(v) => set({ image: v })} className="w-full h-full" rounded="lg" />
          </motion.div>

          {/* Anotação manuscrita */}
          <SketchMark
            type="arrow-curve"
            className="absolute -left-6 top-12"
            flip
            delay={0.9}
            width={90}
            height={70}
          />
          <motion.div
            className="absolute -left-4 top-4 font-hand text-wine text-xl rotate-[-6deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            visão geral
          </motion.div>
        </div>
      </div>
    </div>
    </SizeProvider>
  )
}
