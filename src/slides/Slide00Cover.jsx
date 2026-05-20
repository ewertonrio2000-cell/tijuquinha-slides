import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  title: 'ATELIÊ DE\nURBANISMO:\nESCALAS',
  subtitle: 'Proposta de Intervenção Urbana',
  university: 'Universidade Estácio de Sá',
  course: 'Planejamento Urbano',
  professor: 'Prof. Carlos Rodrigo Avilez',
  student1Name: 'Juliana Gorito',
  student1Id: '202303653913',
  student2Name: 'Ewerton Matos',
  student2Id: '202303653921',
  year: '2026',
  image: null,
}

export default function Slide00Cover({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <div className="w-full h-full grid grid-cols-12 gap-0">
      {/* Coluna esquerda — Título */}
      <div className="col-span-6 p-14 flex flex-col justify-between border-r border-line">
        <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
          <EditableText value={d.university} onChange={(v) => set({ university: v })} />
          <div className="mt-1">
            <EditableText value={d.course} onChange={(v) => set({ course: v })} />
          </div>
        </div>

        <div>
          <EditableText
            value={d.title}
            onChange={(v) => set({ title: v })}
            multiline
            className="text-7xl font-extrabold tracking-tight leading-[0.95]"
          />
          <div className="title-bar mt-6" style={{ width: 64, height: 3 }} />
          <div className="mt-6 text-lg text-muted max-w-md">
            <EditableText value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
          </div>
        </div>

        <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
          <EditableText value={d.year} onChange={(v) => set({ year: v })} />
        </div>
      </div>

      {/* Coluna central — imagem opcional */}
      <div className="col-span-4 border-r border-line p-10 flex items-center justify-center">
        <ImageUpload
          value={d.image}
          onChange={(v) => set({ image: v })}
          className="w-full h-full max-h-[480px]"
        />
      </div>

      {/* Coluna direita — Dados */}
      <div className="col-span-2 p-8 flex flex-col justify-between">
        <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          <div className="font-semibold text-ink mb-1">Orientação</div>
          <EditableText value={d.professor} onChange={(v) => set({ professor: v })} className="normal-case tracking-normal text-[12px] text-muted" />
        </div>

        <div className="space-y-5 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          <div>
            <div className="font-semibold text-ink mb-1">Alunos</div>
            <EditableText
              value={d.student1Name}
              onChange={(v) => set({ student1Name: v })}
              className="normal-case tracking-normal text-[13px] text-ink font-medium"
            />
            <EditableText
              value={d.student1Id}
              onChange={(v) => set({ student1Id: v })}
              className="normal-case tracking-normal text-[11px] text-muted"
            />
          </div>
          <div>
            <EditableText
              value={d.student2Name}
              onChange={(v) => set({ student2Name: v })}
              className="normal-case tracking-normal text-[13px] text-ink font-medium"
            />
            <EditableText
              value={d.student2Id}
              onChange={(v) => set({ student2Id: v })}
              className="normal-case tracking-normal text-[11px] text-muted"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
