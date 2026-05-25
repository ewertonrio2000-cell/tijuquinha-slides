import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import Polaroid from '../components/Polaroid'
import SlideTitle from '../components/SlideTitle'
import { Stagger, StaggerItem } from '../components/Stagger'
import { SizeProvider } from '../components/SizeContext'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '01.1',
  title: 'Diagnóstico e\nTeorização',
  diagnostico:
    'A Tijuquinha apresenta calçadas irregulares, pouco espaço para pontos de ônibus e árvores mal posicionadas que atrapalham a passagem. A iluminação noturna é deficiente, a sinalização de trânsito é insuficiente e faltam espaços de lazer e bancos para descanso ao longo da via.',
  teoria:
    'O projeto se ancora nos princípios de cidades caminháveis (Jan Gehl) e na ideia de que ruas vivas resultam de calçadas generosas, mobiliário urbano adequado e usos diversos no térreo. A intervenção também dialoga com diretrizes do Plano Diretor do Rio para vias coletoras, priorizando pedestres e modos ativos.',
  depoimento1: 'Calçadas com pouca acessibilidade, poucos espaços de lazer',
  depoimento2: 'Baixa iluminação noturna e sinalização de trânsito',
  depoimento3: 'Poucos pontos de ônibus e sem lugar para sentar',
  image1: null,
  image2: null,
  sizes: {},
  positions: {},
}

function StickyQuote({ value, onChange, rotation = -2, delay = 0 }) {
  return (
    <motion.div
      className="relative bg-cream-200 px-4 py-3 shadow-sm"
      style={{ transform: `rotate(${rotation}deg)`, borderLeft: '3px solid #6E1F26' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <span className="absolute -left-1 -top-1 font-display text-wine text-3xl leading-none">“</span>
      <div className="font-hand text-ink text-lg leading-snug pl-2">
        <EditableText value={value} onChange={onChange} multiline  positionKey="el-1"/>
      </div>
    </motion.div>
  )
}

export default function Slide1_1Diagnostico({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-12 flex flex-col gap-6">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <motion.div
          className="col-span-4 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-[11px] uppercase tracking-[0.3em] text-wine mb-2 font-semibold">
            Diagnóstico do Território
          </div>
          <div className="text-[13px] text-muted leading-relaxed">
            <EditableText value={d.diagnostico} onChange={(v) => set({ diagnostico: v })} multiline  positionKey="diagnostico"/>
          </div>

          <div className="mt-5 space-y-3">
            <StickyQuote value={d.depoimento1} onChange={(v) => set({ depoimento1: v })} rotation={-2} delay={0.4} />
            <StickyQuote value={d.depoimento2} onChange={(v) => set({ depoimento2: v })} rotation={1.5} delay={0.5} />
            <StickyQuote value={d.depoimento3} onChange={(v) => set({ depoimento3: v })} rotation={-1} delay={0.6} />
          </div>
        </motion.div>

        <motion.div
          className="col-span-4 border-l border-r border-line px-6 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-[11px] uppercase tracking-[0.3em] text-wine mb-2 font-semibold">
            Base Teórica
          </div>
          <div className="text-[13px] text-muted leading-relaxed">
            <EditableText value={d.teoria} onChange={(v) => set({ teoria: v })} multiline  positionKey="teoria"/>
          </div>
        </motion.div>

        <div className="col-span-4 relative">
          <div className="absolute" style={{ left: '5%', top: '5%' }}>
            <Polaroid
              value={d.image1}
              onChange={(v) => set({ image1: v })}
              rotation={-3}
              tape
              width={220}
              height={170}
              caption="estado atual"
              delay={0.3}
              zIndex={1}
             positionKey="image1"/>
          </div>
          <div className="absolute" style={{ right: '0%', bottom: '5%' }}>
            <Polaroid
              value={d.image2}
              onChange={(v) => set({ image2: v })}
              rotation={4}
              width={220}
              height={170}
              caption="análise"
              delay={0.45}
              zIndex={2}
             positionKey="image2"/>
          </div>
        </div>
      </div>
    </div>
    </SizeProvider>
  )
}
