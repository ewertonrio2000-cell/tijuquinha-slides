import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '06',
  title: 'Paisagismo —\nRealocação de Árvores',
  text:
    'A estratégia paisagística remove árvores mal posicionadas que comprometem a passagem dos pedestres e propõe novas espécies em pontos estratégicos, criando sombra contínua, conforto térmico e identidade verde para a Tijuquinha.',
  imageBefore: null,
  imageAfter: null,
  legend: 'Comparativo antes/depois das intervenções de arborização ao longo da Estrada da Barra da Tijuca.',
}

export default function Slide06Paisagismo({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <div className="w-full h-full p-12 flex flex-col gap-5">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-4 flex flex-col justify-between">
          <div className="text-[13px] text-muted leading-relaxed">
            <EditableText value={d.text} onChange={(v) => set({ text: v })} multiline />
          </div>
          <div className="text-[11px] text-neutral-500 leading-relaxed border-t border-line pt-3 mt-3">
            <EditableText value={d.legend} onChange={(v) => set({ legend: v })} multiline />
          </div>
        </div>
        <div className="col-span-8 grid grid-cols-2 gap-4">
          <ImageUpload value={d.imageBefore} onChange={(v) => set({ imageBefore: v })} className="w-full h-full" label="Antes" />
          <ImageUpload value={d.imageAfter} onChange={(v) => set({ imageAfter: v })} className="w-full h-full" label="Depois" />
        </div>
      </div>
    </div>
  )
}
