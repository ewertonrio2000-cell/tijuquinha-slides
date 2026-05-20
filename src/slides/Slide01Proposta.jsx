import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: 'Proposta de Intervenção',
  title: 'Tijuquinha\nRequalificada',
  concept: 'Acessibilidade, conforto e identidade para a Estrada da Barra da Tijuca',
  description:
    'O local escolhido para o projeto foi a Tijuquinha, na Estrada da Barra da Tijuca. A proposta busca requalificar o trecho a partir da uniformização das calçadas, do redesenho da mobilidade, da iluminação adequada e da implantação de pontos de ônibus mais confortáveis — devolvendo qualidade urbana e segurança aos moradores e pedestres.',
  image: null,
}

export default function Slide01Proposta({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <div className="w-full h-full grid grid-cols-2 gap-0">
      <div className="p-12 flex flex-col justify-between border-r border-line">
        <SlideTitle
          eyebrow={d.eyebrow}
          value={d.title}
          onChange={(v) => set({ title: v })}
        />
        <div>
          <div className="text-lg text-ink font-medium mb-4 max-w-md">
            <EditableText
              value={d.concept}
              onChange={(v) => set({ concept: v })}
              multiline
            />
          </div>
          <div className="text-sm text-muted leading-relaxed max-w-md">
            <EditableText
              value={d.description}
              onChange={(v) => set({ description: v })}
              multiline
            />
          </div>
        </div>
      </div>
      <div className="p-8">
        <ImageUpload
          value={d.image}
          onChange={(v) => set({ image: v })}
          className="w-full h-full"
          rounded="lg"
        />
      </div>
    </div>
  )
}
