import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import Polaroid from '../components/Polaroid'
import Callout from '../components/Callout'
import SlideTitle from '../components/SlideTitle'
import { SizeProvider } from '../components/SizeContext'
import FreeTextLayer from '../components/FreeTextLayer'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '06',
  title: 'Paisagismo —\nRealocação de Árvores',
  text:
    'A estratégia paisagística remove árvores mal posicionadas que comprometem a passagem dos pedestres e propõe novas espécies em pontos estratégicos, criando sombra contínua, conforto térmico e identidade verde para a Tijuquinha.',
  imageBefore: null,
  imageAfter: null,
  legend: 'Comparativo antes/depois das intervenções de arborização ao longo da Estrada da Barra da Tijuca.',
  callouts: [
    { x: 38, y: 45, label: 'árvore mal posicionada', rotation: 30 },
    { x: 72, y: 55, label: 'nova espécie', rotation: -25 },
  ],
  sizes: {},
  positions: {},
  freeTexts: [],
}

export default function Slide06Paisagismo({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const updateCallout = (i, next) =>
    set({ callouts: d.callouts.map((c, idx) => (idx === i ? next : c)) })
  const addCallout = () =>
    set({ callouts: [...(d.callouts || []), { x: 50, y: 50, label: 'nova anotação', rotation: -30 }] })
  const removeCallout = (i) =>
    set({ callouts: d.callouts.filter((_, idx) => idx !== i) })

  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-12 flex flex-col gap-5 relative">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 relative">
        <div className="col-span-4 flex flex-col justify-between">
          <motion.div
            className="text-[13px] text-muted leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <EditableText value={d.text} onChange={(v) => set({ text: v })} multiline  positionKey="text" sizeKey="text"/>
          </motion.div>
          <div className="text-[11px] text-wine/70 leading-relaxed border-t border-line pt-3 mt-3 font-hand text-base text-wine">
            <EditableText value={d.legend} onChange={(v) => set({ legend: v })} multiline  positionKey="legend" sizeKey="legend"/>
          </div>
        </div>

        {/* Collage antes/depois — polaroids levemente sobrepostas */}
        <div className="col-span-8 relative">
          <div className="absolute" style={{ left: '5%', top: '12%' }}>
            <Polaroid
              value={d.imageBefore}
              onChange={(v) => set({ imageBefore: v })}
              rotation={-4}
              tape
              width={280}
              height={300}
              caption="ANTES"
              delay={0.2}
              positionKey="antes"
              zIndex={1}
             sizeKey="imageBefore"/>
          </div>
          <div className="absolute" style={{ right: '5%', top: '20%' }}>
            <Polaroid
              value={d.imageAfter}
              onChange={(v) => set({ imageAfter: v })}
              rotation={5}
              width={280}
              height={300}
              caption="DEPOIS"
              delay={0.35}
              positionKey="depois"
              zIndex={2}
             sizeKey="imageAfter"/>
          </div>
        </div>
      </div>

      {/* Callouts globais (relativos ao slide inteiro) */}
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
      <FreeTextLayer texts={d.freeTexts} onChange={(freeTexts) => set({ freeTexts })} />
    </SizeProvider>
  )
}
