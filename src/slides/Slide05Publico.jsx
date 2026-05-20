import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '05',
  title: 'Público-Alvo',
  personas: [
    { image: null, name: 'Moradores locais', age: '25–60 anos', needs: 'Calçadas seguras e acessíveis para deslocamentos cotidianos.' },
    { image: null, name: 'Idosos', age: '60+ anos', needs: 'Bancos para descanso, sombra e travessias seguras.' },
    { image: null, name: 'Estudantes', age: '14–22 anos', needs: 'Pontos de ônibus confortáveis e iluminação no entorno escolar.' },
    { image: null, name: 'Trabalhadores', age: '20–55 anos', needs: 'Conexões de transporte público eficientes e abrigadas.' },
  ],
}

export default function Slide05Publico({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setP = (i, patch) =>
    set({ personas: d.personas.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) })

  return (
    <div className="w-full h-full p-12 flex flex-col gap-8">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-4 gap-6 flex-1 min-h-0">
        {d.personas.map((p, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-3">
            <ImageUpload
              value={p.image}
              onChange={(v) => setP(i, { image: v })}
              className="w-32 h-32"
              rounded="full"
            />
            <div className="text-base font-semibold text-ink mt-2">
              <EditableText value={p.name} onChange={(v) => setP(i, { name: v })} />
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              <EditableText value={p.age} onChange={(v) => setP(i, { age: v })} />
            </div>
            <div className="title-bar" style={{ width: 24, height: 2 }} />
            <div className="text-[12px] text-muted leading-relaxed mt-1">
              <EditableText value={p.needs} onChange={(v) => setP(i, { needs: v })} multiline />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
