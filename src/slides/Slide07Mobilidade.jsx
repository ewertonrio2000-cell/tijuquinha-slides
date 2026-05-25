import { Bike, Bus, Footprints, Car, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import Polaroid from '../components/Polaroid'
import Callout from '../components/Callout'
import SlideTitle from '../components/SlideTitle'
import { Stagger, StaggerItem } from '../components/Stagger'
import { SizeProvider } from '../components/SizeContext'
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
  callouts: [
    { x: 70, y: 30, label: 'ciclofaixa', rotation: -25 },
    { x: 78, y: 65, label: 'travessia segura', rotation: 25 },
  ],
  sizes: {},
  positions: {},
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

  const updateCallout = (i, next) =>
    set({ callouts: d.callouts.map((c, idx) => (idx === i ? next : c)) })
  const addCallout = () =>
    set({ callouts: [...(d.callouts || []), { x: 60, y: 50, label: 'nova anotação', rotation: -30 }] })
  const removeCallout = (i) =>
    set({ callouts: d.callouts.filter((_, idx) => idx !== i) })

  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-12 flex flex-col gap-5 relative">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-5 flex flex-col gap-4">
          <motion.div
            className="text-[13px] text-muted leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <EditableText value={d.text} onChange={(v) => set({ text: v })} multiline />
          </motion.div>

          <Stagger className="flex flex-col gap-2 mt-2" gap={0.07} delay={0.3}>
            {d.items.map((it, i) => {
              const Icon = ICONS[it.icon] || Footprints
              return (
                <StaggerItem key={i} y={8}>
                  <div className="group flex items-start gap-3 border-b border-line pb-2">
                    <button
                      onClick={() => cycleIcon(i)}
                      className="edit-only p-1.5 border border-line rounded-md hover:bg-cream-200 mt-0.5 text-wine"
                      title="Trocar ícone"
                    >
                      <Icon size={14} strokeWidth={1.8} />
                    </button>
                    <span className="presentation hidden p-1.5 mt-0.5 text-wine">
                      <Icon size={14} strokeWidth={1.8} />
                    </span>
                    <div className="flex-1 text-[13px] text-ink">
                      <EditableText value={it.label} onChange={(v) => setItem(i, { label: v })} multiline />
                    </div>
                    <button
                      onClick={() => remove(i)}
                      className="edit-only opacity-0 group-hover:opacity-100 transition text-wine/50 hover:text-wine p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
          <button onClick={addItem} className="edit-only mt-1 self-start flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-wine/70 hover:text-wine">
            <Plus size={13} /> Adicionar intervenção
          </button>
        </div>

        <div className="col-span-7 relative">
          <Polaroid
            value={d.image}
            onChange={(v) => set({ image: v })}
            rotation={-2}
            tape
            width={520}
            height={400}
            caption="diagrama de mobilidade"
            delay={0.3}
          />
        </div>
      </div>

      {(d.callouts || []).map((c, i) => (
        <Callout
          key={i}
          x={c.x}
          y={c.y}
          label={c.label}
          rotation={c.rotation}
          color="#1A1A1A"
          onChange={(next) => updateCallout(i, next)}
          onRemove={() => removeCallout(i)}
        />
      ))}

      <button
        onClick={addCallout}
        className="edit-only absolute bottom-4 right-16 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-wine text-cream text-[11px] uppercase tracking-[0.2em] font-semibold rounded-full shadow hover:bg-wine-700 transition"
      >
        <Plus size={12} /> Anotação
      </button>
    </div>
    </SizeProvider>
  )
}
