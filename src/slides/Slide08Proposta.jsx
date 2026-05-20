import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '08',
  title: 'Proposta Urbana',
  intro:
    'A proposta urbana se organiza em quatro eixos integrados, que juntos requalificam o espaço público e devolvem qualidade de vida à Tijuquinha.',
  image: null,
  axes: [
    { title: 'Calçadas', text: 'Uniformizar e aumentar calçadas para garantir maior conforto e acessibilidade.' },
    { title: 'Fiação', text: 'Remover os fios e fazer uma nova implantação de forma subterrânea.' },
    { title: 'Iluminação', text: 'Fazer o projeto de iluminação da rua principal e realocar os postes.' },
    { title: 'Pontos de Ônibus', text: 'Implantar pontos de ônibus mais confortáveis, de forma que a passagem não fique prejudicada.' },
  ],
}

export default function Slide08Proposta({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setAxis = (i, patch) =>
    set({ axes: d.axes.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) })

  return (
    <div className="w-full h-full p-12 flex flex-col gap-5">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-7 flex flex-col gap-4">
          <div className="text-[14px] text-muted leading-relaxed max-w-xl">
            <EditableText value={d.intro} onChange={(v) => set({ intro: v })} multiline />
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
            {d.axes.map((a, i) => (
              <div key={i} className="border border-line rounded-lg p-4 bg-white flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                    0{i + 1}
                  </span>
                  <EditableText
                    value={a.title}
                    onChange={(v) => setAxis(i, { title: v })}
                    className="text-sm font-bold uppercase tracking-wider text-ink"
                  />
                </div>
                <div className="title-bar" style={{ width: 20, height: 2 }} />
                <div className="text-[12px] text-muted leading-relaxed mt-1">
                  <EditableText
                    value={a.text}
                    onChange={(v) => setAxis(i, { text: v })}
                    multiline
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-5">
          <ImageUpload value={d.image} onChange={(v) => set({ image: v })} className="w-full h-full" rounded="lg" />
        </div>
      </div>
    </div>
  )
}
