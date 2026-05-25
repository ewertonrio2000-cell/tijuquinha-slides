import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SketchMark from '../components/SketchMark'
import { SizeProvider } from '../components/SizeContext'
import FreeTextLayer from '../components/FreeTextLayer'
import HiddenItemsBadge from '../components/HiddenItemsBadge'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  title: 'TIJUQUINHA\nREVITALIZADA',
  subtitle: 'Proposta de Intervenção Urbana',
  university: 'Universidade Estácio de Sá',
  course: 'Planejamento Urbano · Ateliê de Urbanismo',
  professor: 'Prof. Carlos Rodrigo Avilez',
  student1Name: 'Juliana Gorito',
  student1Id: '202303653913',
  student2Name: 'Ewerton Matos',
  student2Id: '202303653921',
  year: '2026',
  image: null,
  sizes: {},
  positions: {},
  freeTexts: [],
  hidden: [],
}

export default function Slide00Cover({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} hidden={d.hidden || []} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })} onHiddenChange={(hidden) => set({ hidden })}>
    <div className="w-full h-full grid grid-cols-12 gap-0 relative overflow-hidden">
      {/* Coluna esquerda — Título */}
      <div className="col-span-7 p-14 flex flex-col justify-between border-r border-cream/15 relative">
        <motion.div
          className="text-[11px] uppercase tracking-[0.35em] text-cream/70"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <EditableText value={d.university} onChange={(v) => set({ university: v })}  positionKey="university" sizeKey="university"/>
          <div className="mt-1">
            <EditableText value={d.course} onChange={(v) => set({ course: v })}  positionKey="course" sizeKey="course"/>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <EditableText
            value={d.title}
            onChange={(v) => set({ title: v })}
            multiline
            className="font-display text-[9rem] leading-[0.85] uppercase text-cream"
           positionKey="title" sizeKey="title"/>
          <div className="bg-cream mt-7" style={{ width: 96, height: 3 }} />
          <div className="mt-6 text-xl text-cream/80 max-w-md font-light">
            <EditableText value={d.subtitle} onChange={(v) => set({ subtitle: v })}  positionKey="subtitle" sizeKey="subtitle"/>
          </div>

          {/* Anotação manuscrita decorativa */}
          <SketchMark
            type="underline"
            className="absolute -bottom-3 left-0"
            color="#F5EFE6"
            width={220}
            delay={0.6}
          />
          <motion.div
            className="absolute -right-4 top-2 font-hand text-cream/80 text-2xl rotate-[-8deg]"
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 1, rotate: -8 }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
            proposta
          </motion.div>
        </motion.div>

        <motion.div
          className="text-[11px] uppercase tracking-[0.35em] text-cream/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <EditableText value={d.year} onChange={(v) => set({ year: v })}  positionKey="year" sizeKey="year"/>
        </motion.div>
      </div>

      {/* Coluna direita — dados + imagem */}
      <div className="col-span-5 flex flex-col">
        <div className="flex-1 p-8 relative">
          <ImageUpload
            value={d.image}
            onChange={(v) => set({ image: v })}
            className="w-full h-full"
          />
          {/* Asterisco decorativo */}
          <SketchMark
            type="asterisk"
            className="absolute -top-2 -right-2"
            color="#F5EFE6"
            size={40}
            delay={0.9}
          />
        </div>

        <motion.div
          className="border-t border-cream/15 px-8 py-7 grid grid-cols-2 gap-6 text-[11px] uppercase tracking-[0.28em] text-cream/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <div className="font-semibold text-cream mb-2 tracking-[0.32em]">Orientação</div>
            <EditableText
              value={d.professor}
              onChange={(v) => set({ professor: v })}
              className="normal-case tracking-normal text-[13px] text-cream/85"
             positionKey="professor" sizeKey="professor"/>
          </div>
          <div>
            <div className="font-semibold text-cream mb-2 tracking-[0.32em]">Alunos</div>
            <EditableText
              value={d.student1Name}
              onChange={(v) => set({ student1Name: v })}
              className="normal-case tracking-normal text-[13px] text-cream font-medium"
             positionKey="student1Name" sizeKey="student1Name"/>
            <EditableText
              value={d.student1Id}
              onChange={(v) => set({ student1Id: v })}
              className="normal-case tracking-normal text-[11px] text-cream/60"
             positionKey="student1Id" sizeKey="student1Id"/>
            <div className="mt-2">
              <EditableText
                value={d.student2Name}
                onChange={(v) => set({ student2Name: v })}
                className="normal-case tracking-normal text-[13px] text-cream font-medium"
               positionKey="student2Name" sizeKey="student2Name"/>
              <EditableText
                value={d.student2Id}
                onChange={(v) => set({ student2Id: v })}
                className="normal-case tracking-normal text-[11px] text-cream/60"
               positionKey="student2Id" sizeKey="student2Id"/>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
      <FreeTextLayer texts={d.freeTexts} onChange={(freeTexts) => set({ freeTexts })} />
      <HiddenItemsBadge />
    </SizeProvider>
  )
}
