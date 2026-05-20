import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '03',
  title: 'Referências\nProjetuais',
  cards: [
    {
      image: null,
      name: 'Superblocks — Barcelona',
      description: 'Reorganização de quadras para priorizar pedestres, reduzir tráfego e devolver o espaço público à vida cotidiana.',
    },
    {
      image: null,
      name: 'Cheonggyecheon — Seul',
      description: 'Requalificação de via expressa em corredor verde e hídrico, recuperando ambiência urbana e biodiversidade.',
    },
    {
      image: null,
      name: 'Times Square — Nova York',
      description: 'Redesenho de espaço viário icônico, ampliando calçadas, criando praças e prioridade ao pedestre.',
    },
  ],
}

export default function Slide03Referencias({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setCard = (i, patch) =>
    set({ cards: d.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) })

  return (
    <div className="w-full h-full p-12 flex flex-col gap-6">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {d.cards.map((c, i) => (
          <div key={i} className="flex flex-col border border-line rounded-lg overflow-hidden bg-white">
            <ImageUpload
              value={c.image}
              onChange={(v) => setCard(i, { image: v })}
              className="w-full h-[55%]"
              rounded="none"
            />
            <div className="p-4 flex-1 flex flex-col gap-2">
              <EditableText
                value={c.name}
                onChange={(v) => setCard(i, { name: v })}
                className="text-base font-semibold text-ink"
              />
              <div className="title-bar" style={{ width: 24, height: 2 }} />
              <div className="text-[12px] text-muted leading-relaxed mt-1">
                <EditableText
                  value={c.description}
                  onChange={(v) => setCard(i, { description: v })}
                  multiline
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
