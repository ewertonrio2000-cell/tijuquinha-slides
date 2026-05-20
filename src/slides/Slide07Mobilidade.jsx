import { Bike, Bus, Footprints, Car, Plus, Trash2 } from 'lucide-react'
import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const ICONS = { bike: Bike, bus: Bus, foot: Footprints, car: Car }

const defaults = {
  eyebrow: '07',
  title: 'Mobilidade',
  text:
    'A estratégia de mobilidade propõe uma faixa contínua de pedestres, ciclovia segregada, novos pontos de ônibus abrigados e travessias seguras em pontos críticos. O redesenho viário reduz a velocidade do tráfego motorizado e amplia a permeabilidade do trecho.',
  image: null,
  items: [
    { icon: 'foot', label: 'Calçadas de 3m com piso tátil e acessibilidade universal' },
    { icon: 'bike', label: 'Ciclovia segregada e bidirecional ao longo do trecho' },
    { icon: 'bus', label: 'Novos pontos de ônibus cobertos com bancos e iluminação' },
    { icon: 'car', label: 'Redução de faixas de rolamento e travessias elevadas' },
  ],
}

export default function Slide07Mobilidade({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setItem = (i, patch) =>
    set({ items: d.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) })
  const addItem = () => set({ items: [...d.items, { icon: 'foot', label: 'Nova intervenção' }] })
  const remove = (i) => set({ items: d.items.filter((_, idx) => idx !== i) })
  const cycleIcon = (i) => {
    const keys = Object.keys(ICONS)
    const next = keys[(keys.indexOf(d.items[i].icon) + 1) % keys.length]
    setItem(i, { icon: next })
  }

  return (
    <div className="w-full h-full p-12 flex flex-col gap-5">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-5 flex flex-col gap-4">
          <div className="text-[13px] text-muted leading-relaxed">
            <EditableText value={d.text} onChange={(v) => set({ text: v })} multiline />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {d.items.map((it, i) => {
              const Icon = ICONS[it.icon] || Footprints
              return (
                <div key={i} className="group flex items-start gap-3 border-b border-line pb-2">
                  <button
                    onClick={() => cycleIcon(i)}
                    className="edit-only p-1.5 border border-line rounded-md hover:bg-neutral-100 mt-0.5"
                    title="Trocar ícone"
                  >
                    <Icon size={14} />
                  </button>
                  <span className="presentation hidden p-1.5 mt-0.5">
                    <Icon size={14} />
                  </span>
                  <div className="flex-1 text-[13px] text-ink">
                    <EditableText value={it.label} onChange={(v) => setItem(i, { label: v })} multiline />
                  </div>
                  <button
                    onClick={() => remove(i)}
                    className="edit-only opacity-0 group-hover:opacity-100 transition text-neutral-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })}
            <button onClick={addItem} className="edit-only mt-1 self-start flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-neutral-500 hover:text-ink">
              <Plus size={13} /> Adicionar intervenção
            </button>
          </div>
        </div>
        <div className="col-span-7">
          <ImageUpload
            value={d.image}
            onChange={(v) => set({ image: v })}
            className="w-full h-full"
            label="Diagrama de mobilidade"
            fit="contain"
          />
        </div>
      </div>
    </div>
  )
}
