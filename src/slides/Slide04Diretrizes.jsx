import { Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import SlideTitle from '../components/SlideTitle'
import { Stagger, StaggerItem } from '../components/Stagger'
import { SizeProvider } from '../components/SizeContext'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '04',
  title: 'Diretrizes\n× Programa',
  diretrizes: [
    'Priorizar pedestres e modos ativos',
    'Garantir acessibilidade universal nas calçadas',
    'Integrar paisagismo e infraestrutura verde',
    'Reorganizar postes, fiação e iluminação',
    'Qualificar paradas de ônibus e mobiliário',
  ],
  programa: [
    'Calçadas uniformizadas e acessíveis',
    'Ciclovia segregada',
    'Pontos de ônibus com cobertura e assento',
    'Iluminação pública renovada',
    'Áreas de estar e arborização',
  ],
  sizes: {},
  positions: {},
}

function EditList({ items, onChange }) {
  const update = (i, v) => onChange(items.map((x, idx) => (idx === i ? v : x)))
  const add = () => onChange([...items, 'Novo item'])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <Stagger className="flex flex-col gap-3" gap={0.05}>
      {items.map((item, i) => (
        <StaggerItem key={i} className="group flex items-start gap-3 border-b border-cream/15 pb-2.5">
          <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-cream" />
          <div className="flex-1 text-[14px] text-cream leading-snug">
            <EditableText value={item} onChange={(v) => update(i, v)}  positionKey="el-1" sizeKey="el-1"/>
          </div>
          <button
            onClick={() => remove(i)}
            className="edit-only opacity-0 group-hover:opacity-100 transition text-cream/50 hover:text-cream p-1"
            title="Remover"
          >
            <Trash2 size={13} />
          </button>
        </StaggerItem>
      ))}
      <button
        onClick={add}
        className="edit-only mt-2 self-start flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-cream/60 hover:text-cream"
      >
        <Plus size={13} /> Adicionar item
      </button>
    </Stagger>
  )
}

export default function Slide04Diretrizes({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-14 flex flex-col gap-8">
      <SlideTitle
        eyebrow={d.eyebrow}
        value={d.title}
        onChange={(v) => set({ title: v })}
        size="lg"
        tone="wine"
      />
      <div className="grid grid-cols-2 gap-14 flex-1 min-h-0">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="text-[11px] uppercase tracking-[0.3em] text-cream/60 mb-5 font-semibold">
            Diretrizes
          </div>
          <EditList items={d.diretrizes} onChange={(v) => set({ diretrizes: v })} />
        </motion.div>
        <motion.div className="border-l border-cream/15 pl-14" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="text-[11px] uppercase tracking-[0.3em] text-cream/60 mb-5 font-semibold">
            Programa
          </div>
          <EditList items={d.programa} onChange={(v) => set({ programa: v })} />
        </motion.div>
      </div>
    </div>
    </SizeProvider>
  )
}
