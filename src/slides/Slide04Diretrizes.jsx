import { Plus, Trash2 } from 'lucide-react'
import EditableText from '../components/EditableText'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '04',
  title: 'Diretrizes Projetuais\n× Programa',
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
}

function EditList({ items, onChange, accent }) {
  const update = (i, v) => onChange(items.map((x, idx) => (idx === i ? v : x)))
  const add = () => onChange([...items, 'Novo item'])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="group flex items-start gap-3 border-b border-line pb-2">
          <span className={`mt-2 inline-block w-1.5 h-1.5 rounded-full ${accent === 'dark' ? 'bg-ink' : 'bg-neutral-400'}`} />
          <div className="flex-1 text-[14px] text-ink">
            <EditableText value={item} onChange={(v) => update(i, v)} />
          </div>
          <button
            onClick={() => remove(i)}
            className="edit-only opacity-0 group-hover:opacity-100 transition text-neutral-400 hover:text-red-600 p-1"
            title="Remover"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="edit-only mt-2 self-start flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-neutral-500 hover:text-ink"
      >
        <Plus size={13} /> Adicionar item
      </button>
    </div>
  )
}

export default function Slide04Diretrizes({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <div className="w-full h-full p-12 flex flex-col gap-6">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-2 gap-10 flex-1 min-h-0">
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 mb-4 font-semibold">
            Diretrizes
          </div>
          <EditList items={d.diretrizes} onChange={(v) => set({ diretrizes: v })} accent="dark" />
        </div>
        <div className="border-l border-line pl-10">
          <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 mb-4 font-semibold">
            Programa
          </div>
          <EditList items={d.programa} onChange={(v) => set({ programa: v })} />
        </div>
      </div>
    </div>
  )
}
