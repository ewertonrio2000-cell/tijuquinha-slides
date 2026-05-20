import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '12',
  title: 'Desenho\nResolvido',
  legend:
    'Desenho técnico final do recorte do projeto, com calçadas ampliadas, ciclovia segregada, novos pontos de ônibus e reorganização da arborização.',
  image: null,
}

export default function Slide12Desenho({ slideId }) {
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
          label="Desenho técnico do recorte"
        />
      </div>
    </div>
  )
}
