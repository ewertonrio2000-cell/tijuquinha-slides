import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '09',
  title: 'Mapa',
  legend: 'Mapa do trecho da Estrada da Barra da Tijuca — Tijuquinha, com indicação dos principais pontos de intervenção.',
  image: null,
}

export default function Slide09Mapa({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <div className="w-full h-full p-12 flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
        <div className="text-[12px] text-muted max-w-md text-right">
          <EditableText value={d.legend} onChange={(v) => set({ legend: v })} multiline />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ImageUpload
          value={d.image}
          onChange={(v) => set({ image: v })}
          className="w-full h-full"
          rounded="lg"
          fit="contain"
          label="Mapa em alta resolução"
        />
      </div>
    </div>
  )
}
