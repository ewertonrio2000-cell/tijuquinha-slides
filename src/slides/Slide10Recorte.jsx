import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '10',
  title: 'Recorte do\nProjeto',
  description:
    'O recorte selecionado corresponde ao trecho mais conflituoso da Estrada da Barra da Tijuca, onde as calçadas são estreitas, há baixa permeabilidade e a ausência de equipamentos urbanos é mais sentida pelos moradores.',
  detail: 'Escala 1:500 — desenho CAD do trecho de intervenção.',
  image: null,
}

export default function Slide10Recorte({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <div className="w-full h-full p-12 flex flex-col gap-4">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-9">
          <ImageUpload
            value={d.image}
            onChange={(v) => set({ image: v })}
            className="w-full h-full"
            rounded="lg"
            fit="contain"
            label="Desenho CAD do recorte"
          />
        </div>
        <div className="col-span-3 flex flex-col justify-between">
          <div className="text-[13px] text-muted leading-relaxed">
            <EditableText value={d.description} onChange={(v) => set({ description: v })} multiline />
          </div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 border-t border-line pt-3">
            <EditableText value={d.detail} onChange={(v) => set({ detail: v })} multiline />
          </div>
        </div>
      </div>
    </div>
  )
}
