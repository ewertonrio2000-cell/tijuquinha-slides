import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import Polaroid from '../components/Polaroid'
import Callout from '../components/Callout'
import ColorSwatch from '../components/ColorSwatch'
import SlideTitle from '../components/SlideTitle'
import { SizeProvider } from '../components/SizeContext'
import FreeTextLayer from '../components/FreeTextLayer'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '02',
  title: 'Moodboard',
  caption: 'Atmosferas, materiais e referências visuais que orientam a linguagem do projeto.',
  // Cada polaroid tem posição (% do slide), rotação, imagem e legenda.
  polaroids: [
    { x: 6, y: 14, rot: -4, img: null, caption: 'arborização', w: 220, h: 200, tape: true },
    { x: 30, y: 8, rot: 3, img: null, caption: 'mobilidade', w: 230, h: 170, tape: true },
    { x: 56, y: 16, rot: -2, img: null, caption: 'praça', w: 220, h: 210, tape: false },
    { x: 8, y: 50, rot: 4, img: null, caption: 'piso tátil', w: 200, h: 180, tape: false },
    { x: 34, y: 54, rot: -3, img: null, caption: 'mobiliário', w: 210, h: 200, tape: true },
    { x: 58, y: 58, rot: 2, img: null, caption: 'iluminação', w: 200, h: 180, tape: false },
  ],
  callouts: [
    { x: 65, y: 30, label: 'paleta urbana', rotation: -25 },
  ],
  palette: ['#4F5B45', '#A85F47', '#C77E5A', '#D9CCB4'],
  sizes: {},
  positions: {},
  freeTexts: [],
}

export default function Slide02Moodboard({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)

  const updatePolaroid = (i, patch) =>
    set({ polaroids: d.polaroids.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) })

  const updateCallout = (i, next) =>
    set({ callouts: d.callouts.map((c, idx) => (idx === i ? next : c)) })

  const addCallout = () =>
    set({ callouts: [...(d.callouts || []), { x: 50, y: 50, label: 'nova anotação', rotation: -30 }] })

  const removeCallout = (i) =>
    set({ callouts: d.callouts.filter((_, idx) => idx !== i) })

  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full relative">
      {/* Cabeçalho compacto sobreposto */}
      <div className="absolute top-10 left-12 right-12 z-10 flex items-start justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
        </div>
        <motion.div
          className="text-[12px] text-muted max-w-xs text-right bg-cream/80 backdrop-blur px-3 py-2 rounded pointer-events-auto"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <EditableText value={d.caption} onChange={(v) => set({ caption: v })} multiline  positionKey="caption" sizeKey="caption"/>
        </motion.div>
      </div>

      {/* Paleta de cor (direita) */}
      <motion.div
        className="absolute right-16 top-44 z-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-wine mb-2 font-semibold text-center">
          paleta
        </div>
        <ColorSwatch
          colors={d.palette}
          onChange={(next) => set({ palette: next })}
          size={56}
        />
      </motion.div>

      {/* Polaroids espalhadas */}
      <div className="absolute inset-0">
        {d.polaroids.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <Polaroid
              value={p.img}
              onChange={(v) => updatePolaroid(i, { img: v })}
              rotation={p.rot}
              tape={p.tape}
              width={p.w}
              height={p.h}
              caption={p.caption}
              onCaptionChange={(v) => updatePolaroid(i, { caption: v })}
              delay={0.1 + i * 0.08}
              zIndex={i + 1}
              sizeKey={`poly-${i}`}
             positionKey={`img-${i}`}/>
          </div>
        ))}
      </div>

      {/* Callouts arrastáveis */}
      {(d.callouts || []).map((c, i) => (
        <Callout
          key={i}
          x={c.x}
          y={c.y}
          label={c.label}
          rotation={c.rotation}
          color="#6E1F26"
          onChange={(next) => updateCallout(i, next)}
          onRemove={() => removeCallout(i)}
        />
      ))}

      {/* Botão para adicionar callout */}
      <button
        onClick={addCallout}
        className="edit-only absolute bottom-6 right-16 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-wine text-cream text-[11px] uppercase tracking-[0.2em] font-semibold rounded-full shadow hover:bg-wine-700 transition"
      >
        <Plus size={12} /> Anotação
      </button>
    </div>
      <FreeTextLayer texts={d.freeTexts} onChange={(freeTexts) => set({ freeTexts })} />
    </SizeProvider>
  )
}
