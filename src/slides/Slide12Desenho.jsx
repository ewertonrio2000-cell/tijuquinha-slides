import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import Polaroid from '../components/Polaroid'
import Callout from '../components/Callout'
import SlideTitle from '../components/SlideTitle'
import { SizeProvider } from '../components/SizeContext'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '12',
  title: 'Desenho\nResolvido',
  legend:
    'Desenho técnico final do recorte do projeto, com calçadas ampliadas, ciclovia segregada, novos pontos de ônibus e reorganização da arborização.',
  image: null,
  callouts: [
    { x: 35, y: 55, label: 'calçada ampliada', rotation: -20 },
    { x: 65, y: 45, label: 'ciclovia segregada', rotation: 20 },
  ],
  sizes: {},
  positions: {},
}

export default function Slide12Desenho({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const updateCallout = (i, next) =>
    set({ callouts: d.callouts.map((c, idx) => (idx === i ? next : c)) })
  const addCallout = () =>
    set({ callouts: [...(d.callouts || []), { x: 50, y: 50, label: 'nova anotação', rotation: -30 }] })
  const removeCallout = (i) =>
    set({ callouts: d.callouts.filter((_, idx) => idx !== i) })

  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-12 flex flex-col gap-4 relative">
      <div className="flex items-end justify-between">
        <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
        <motion.div
          className="font-hand text-wine text-base max-w-md text-right leading-snug"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <EditableText value={d.legend} onChange={(v) => set({ legend: v })} multiline />
        </motion.div>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center relative">
        <Polaroid
          value={d.image}
          onChange={(v) => set({ image: v })}
          rotation={-1}
          tape
          width={780}
          height={460}
          delay={0.2}
          positionKey="hero"
        />
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
