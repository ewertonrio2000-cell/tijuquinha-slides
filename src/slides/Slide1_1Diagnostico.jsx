import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '01.1',
  title: 'Diagnóstico e\nTeorização',
  diagnostico:
    'A Tijuquinha apresenta calçadas irregulares, pouco espaço para pontos de ônibus e árvores mal posicionadas que atrapalham a passagem. A iluminação noturna é deficiente, a sinalização de trânsito é insuficiente e faltam espaços de lazer e bancos para descanso ao longo da via.',
  teoria:
    'O projeto se ancora nos princípios de cidades caminháveis (Jan Gehl) e na ideia de que ruas vivas resultam de calçadas generosas, mobiliário urbano adequado e usos diversos no térreo. A intervenção também dialoga com diretrizes do Plano Diretor do Rio para vias coletoras, priorizando pedestres e modos ativos.',
  depoimento1: '“Calçadas com pouca acessibilidade, poucos espaços de lazer.”',
  depoimento2: '“Baixa iluminação noturna e sinalização de trânsito.”',
  depoimento3: '“Poucos pontos de ônibus e sem lugar para sentar.”',
  image1: null,
  image2: null,
}

export default function Slide1_1Diagnostico({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  return (
    <div className="w-full h-full p-12 flex flex-col gap-6">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Coluna 1 — Diagnóstico */}
        <div className="col-span-4 flex flex-col">
          <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 mb-2 font-semibold">Diagnóstico do Território</div>
          <div className="text-[13px] text-muted leading-relaxed">
            <EditableText value={d.diagnostico} onChange={(v) => set({ diagnostico: v })} multiline />
          </div>

          <div className="mt-5 border-t border-line pt-4 space-y-2 text-[12px] text-ink italic">
            <EditableText value={d.depoimento1} onChange={(v) => set({ depoimento1: v })} multiline />
            <EditableText value={d.depoimento2} onChange={(v) => set({ depoimento2: v })} multiline />
            <EditableText value={d.depoimento3} onChange={(v) => set({ depoimento3: v })} multiline />
          </div>
        </div>

        {/* Coluna 2 — Teoria */}
        <div className="col-span-4 border-l border-r border-line px-6 flex flex-col">
          <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 mb-2 font-semibold">Base Teórica</div>
          <div className="text-[13px] text-muted leading-relaxed">
            <EditableText value={d.teoria} onChange={(v) => set({ teoria: v })} multiline />
          </div>
        </div>

        {/* Coluna 3 — Imagens */}
        <div className="col-span-4 grid grid-rows-2 gap-3">
          <ImageUpload value={d.image1} onChange={(v) => set({ image1: v })} className="w-full h-full" label="Estado atual" />
          <ImageUpload value={d.image2} onChange={(v) => set({ image2: v })} className="w-full h-full" label="Análise" />
        </div>
      </div>
    </div>
  )
}
