import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import Polaroid from '../components/Polaroid'
import SlideTitle from '../components/SlideTitle'
import SketchMark from '../components/SketchMark'
import { SizeProvider } from '../components/SizeContext'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: 'Proposta de Intervenção',
  title: 'Tijuquinha\nRequalificada',
  concept: 'Acessibilidade, conforto e identidade',
  description:
    'O local escolhido para o projeto foi a Tijuquinha, na Estrada da Barra da Tijuca. A proposta busca requalificar o trecho a partir da uniformização das calçadas, do redesenho da mobilidade, da iluminação adequada e da implantação de pontos de ônibus mais confortáveis — devolvendo qualidade urbana e segurança aos moradores e pedestres.',
  image: null,
  sizes: {},
}

export default function Slide01Proposta({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <SizeProvider sizes={d.sizes} onSizesChange={(sizes) => set({ sizes })}>
      <div className="w-full h-full grid grid-cols-2 gap-0 relative">
        <div className="p-12 flex flex-col justify-between border-r border-line relative">
          <SlideTitle
            eyebrow={d.eyebrow}
            value={d.title}
            onChange={(v) => set({ title: v })}
          />
          <div className="relative">
            <motion.div
              className="font-hand text-wine text-3xl leading-tight mb-3 max-w-md"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <EditableText
                value={d.concept}
                onChange={(v) => set({ concept: v })}
                multiline
                sizeKey="concept"
              />
            </motion.div>
            <motion.div
              className="text-sm text-muted leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <EditableText
                value={d.description}
                onChange={(v) => set({ description: v })}
                multiline
                sizeKey="description"
              />
            </motion.div>
            <SketchMark
              type="underline"
              className="absolute -bottom-3 left-0"
              delay={0.8}
              width={180}
            />
          </div>
        </div>
        <div className="p-10 flex items-center justify-center relative">
          <Polaroid
            value={d.image}
            onChange={(v) => set({ image: v })}
            rotation={3}
            tape
            width={460}
            height={500}
            delay={0.2}
            sizeKey="heroImage"
          />
        </div>
      </div>
    </SizeProvider>
  )
}
