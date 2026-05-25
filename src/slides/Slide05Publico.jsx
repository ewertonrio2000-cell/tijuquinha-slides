import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { Stagger, StaggerItem } from '../components/Stagger'
import { SizeProvider } from '../components/SizeContext'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '05',
  title: 'Público-Alvo',
  personas: [
    { image: null, name: 'Moradores', tag: 'locais', age: '25–60 anos', needs: 'Calçadas seguras e acessíveis para deslocamentos cotidianos.' },
    { image: null, name: 'Idosos', tag: 'descanso', age: '60+ anos', needs: 'Bancos para descanso, sombra e travessias seguras.' },
    { image: null, name: 'Estudantes', tag: 'rotina', age: '14–22 anos', needs: 'Pontos de ônibus confortáveis e iluminação no entorno escolar.' },
    { image: null, name: 'Trabalhadores', tag: 'fluxo', age: '20–55 anos', needs: 'Conexões de transporte público eficientes e abrigadas.' },
  ],
  sizes: {},
  positions: {},
}

export default function Slide05Publico({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setP = (i, patch) =>
    set({ personas: d.personas.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) })

  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })}>
    <div className="w-full h-full p-12 flex flex-col gap-8">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <Stagger className="grid grid-cols-4 gap-6 flex-1 min-h-0" gap={0.12} delay={0.15}>
        {d.personas.map((p, i) => (
          <StaggerItem key={i} y={18}>
            <motion.div
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center gap-3 relative"
            >
              {/* Tag manuscrito acima */}
              <div
                className="font-hand text-wine text-xl absolute -top-3 left-1/2 -translate-x-1/2 z-10"
                style={{ transform: `translateX(-50%) rotate(${i % 2 ? 4 : -4}deg)` }}
              >
                <EditableText value={p.tag} onChange={(v) => setP(i, { tag: v })}  positionKey={`tag-${i}`} sizeKey={`tag-${i}`}/>
              </div>

              {/* Avatar com moldura branca + leve tilt */}
              <div
                className="relative bg-white p-1.5 shadow-md"
                style={{
                  borderRadius: '50%',
                  transform: `rotate(${i % 2 ? -3 : 3}deg)`,
                }}
              >
                <div
                  className="w-32 h-32 overflow-hidden rounded-full bg-neutral-100"
                >
                  <ImageUpload
                    value={p.image}
                    onChange={(v) => setP(i, { image: v })}
                    className="w-full h-full"
                    rounded="full"
                  />
                </div>
              </div>

              <EditableText
                value={p.name}
                onChange={(v) => setP(i, { name: v })}
                className="font-display text-2xl uppercase tracking-wide text-ink mt-2 leading-none"
               positionKey="name-2" sizeKey="name-2"/>
              <div className="text-[10px] uppercase tracking-[0.25em] text-wine">
                <EditableText value={p.age} onChange={(v) => setP(i, { age: v })}  positionKey="age-3" sizeKey="age-3"/>
              </div>
              <div className="bg-wine" style={{ width: 24, height: 2 }} />
              <div className="text-[12px] text-muted leading-relaxed mt-1 px-2">
                <EditableText value={p.needs} onChange={(v) => setP(i, { needs: v })} multiline  positionKey="needs-4" sizeKey="needs-4"/>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
    </SizeProvider>
  )
}
