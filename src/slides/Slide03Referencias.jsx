import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import Polaroid from '../components/Polaroid'
import SlideTitle from '../components/SlideTitle'
import { Stagger, StaggerItem } from '../components/Stagger'
import { SizeProvider } from '../components/SizeContext'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '03',
  title: 'Referências\nProjetuais',
  cards: [
    {
      image: null,
      name: 'Superblocks',
      place: 'Barcelona',
      description: 'Reorganização de quadras para priorizar pedestres, reduzir tráfego e devolver o espaço público à vida cotidiana.',
      rot: -3,
    },
    {
      image: null,
      name: 'Cheonggyecheon',
      place: 'Seul',
      description: 'Requalificação de via expressa em corredor verde e hídrico, recuperando ambiência urbana e biodiversidade.',
      rot: 2,
    },
    {
      image: null,
      name: 'Times Square',
      place: 'Nova York',
      description: 'Redesenho de espaço viário icônico, ampliando calçadas, criando praças e prioridade ao pedestre.',
      rot: -2,
    },
  ],
  sizes: {},
  positions: {},
}

export default function Slide03Referencias({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setCard = (i, patch) =>
    set({ cards: d.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) })

  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-12 flex flex-col gap-6 relative">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />

      <Stagger className="grid grid-cols-3 gap-8 flex-1 min-h-0 items-start pt-6" gap={0.12}>
        {d.cards.map((c, i) => (
          <StaggerItem key={i} y={20}>
            <div className="flex flex-col items-center gap-4">
              <Polaroid
                value={c.image}
                onChange={(v) => setCard(i, { image: v })}
                rotation={c.rot}
                tape={i % 2 === 0}
                width={220}
                height={220}
                delay={0.05 * i}
               positionKey={`image-${i}`}/>
              <motion.div
                className="text-center max-w-[260px] mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <EditableText
                  value={c.name}
                  onChange={(v) => setCard(i, { name: v })}
                  className="font-display text-2xl uppercase tracking-wide text-ink leading-tight"
                 positionKey={`name-${i}`}/>
                <div className="font-hand text-wine text-base mt-0.5">
                  <EditableText value={c.place} onChange={(v) => setCard(i, { place: v })}  positionKey={`place-${i}`}/>
                </div>
                <div className="bg-wine mx-auto mt-2" style={{ width: 24, height: 2 }} />
                <div className="text-[12px] text-muted leading-relaxed mt-3 px-2">
                  <EditableText
                    value={c.description}
                    onChange={(v) => setCard(i, { description: v })}
                    multiline
                   positionKey="description-3"/>
                </div>
              </motion.div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
    </SizeProvider>
  )
}
