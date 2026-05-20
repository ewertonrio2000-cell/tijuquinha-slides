import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import Slide from './components/Slide'
import Toolbar from './components/Toolbar'
import SlideNavigation from './components/SlideNavigation'
import { resetAllSlides } from './hooks/useSlideStorage'
import { onSyncStatus } from './lib/supabase'

import Slide00Cover from './slides/Slide00Cover'
import Slide01Proposta from './slides/Slide01Proposta'
import Slide1_1Diagnostico from './slides/Slide1_1Diagnostico'
import Slide02Moodboard from './slides/Slide02Moodboard'
import Slide03Referencias from './slides/Slide03Referencias'
import Slide04Diretrizes from './slides/Slide04Diretrizes'
import Slide05Publico from './slides/Slide05Publico'
import Slide06Paisagismo from './slides/Slide06Paisagismo'
import Slide07Mobilidade from './slides/Slide07Mobilidade'
import Slide08Proposta from './slides/Slide08Proposta'
import Slide09Mapa from './slides/Slide09Mapa'
import Slide10Recorte from './slides/Slide10Recorte'
import Slide11Localizacao from './slides/Slide11Localizacao'
import Slide12Desenho from './slides/Slide12Desenho'
import Slide13Corte from './slides/Slide13Corte'

const SLIDES = [
  { id: 'slide-00', label: '00', title: 'Capa', Component: Slide00Cover, hidePageNumber: true },
  { id: 'slide-01', label: '01', title: 'Proposta', Component: Slide01Proposta },
  { id: 'slide-01-1', label: '01.1', title: 'Diagnóstico', Component: Slide1_1Diagnostico },
  { id: 'slide-02', label: '02', title: 'Moodboard', Component: Slide02Moodboard },
  { id: 'slide-03', label: '03', title: 'Referências', Component: Slide03Referencias },
  { id: 'slide-04', label: '04', title: 'Diretrizes × Programa', Component: Slide04Diretrizes },
  { id: 'slide-05', label: '05', title: 'Público-Alvo', Component: Slide05Publico },
  { id: 'slide-06', label: '06', title: 'Paisagismo', Component: Slide06Paisagismo },
  { id: 'slide-07', label: '07', title: 'Mobilidade', Component: Slide07Mobilidade },
  { id: 'slide-08', label: '08', title: 'Proposta Urbana', Component: Slide08Proposta },
  { id: 'slide-09', label: '09', title: 'Mapa', Component: Slide09Mapa },
  { id: 'slide-10', label: '10', title: 'Recorte', Component: Slide10Recorte },
  { id: 'slide-11', label: '11', title: 'Localização', Component: Slide11Localizacao },
  { id: 'slide-12', label: '12', title: 'Desenho Resolvido', Component: Slide12Desenho },
  { id: 'slide-13', label: '13', title: 'Corte da Rua', Component: Slide13Corte },
]

export default function App() {
  const [current, setCurrent] = useState(0)
  const [presentation, setPresentation] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [scale, setScale] = useState(1)
  const [syncStatus, setSyncStatusState] = useState('idle')

  useEffect(() => onSyncStatus(setSyncStatusState), [])
  const exportRef = useRef(null)
  const stageRef = useRef(null)

  const total = SLIDES.length
  const slide = SLIDES[current]

  // Responsive scale: shrink the 1280x720 canvas to fit the available area.
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const pad = presentation ? 0 : 140 // toolbar (~56) + bottom nav (~72) + breathing room
      const sideX = presentation ? 0 : 80
      const sx = (w - sideX) / 1280
      const sy = (h - pad) / 720
      setScale(Math.min(sx, sy, 1))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [presentation])

  const go = useCallback((i) => {
    setCurrent(Math.max(0, Math.min(total - 1, i)))
  }, [total])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      // ignore when typing in editable content
      const target = e.target
      const isEditing =
        target?.isContentEditable ||
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA'
      if (isEditing) return

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        go(current + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(current - 1)
      } else if (e.key === 'Escape' && presentation) {
        setPresentation(false)
      } else if (e.key === 'f' || e.key === 'F') {
        if (!e.metaKey && !e.ctrlKey) setPresentation((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, presentation, go])

  const handleResetSlide = async () => {
    if (!confirm('Resetar o conteúdo deste slide para o padrão? (Afeta também a versão online compartilhada.)')) return
    const { supabase, SLIDES_TABLE } = await import('./lib/supabase')
    localStorage.removeItem('tijuquinha:slide:' + slide.id)
    try {
      await supabase.from(SLIDES_TABLE).delete().eq('id', slide.id)
    } catch (e) {
      console.error(e)
    }
    window.location.reload()
  }

  const handleResetAll = async () => {
    if (!confirm('Apagar TODO o conteúdo salvo de todos os slides? Afeta também a versão online compartilhada. Esta ação não pode ser desfeita.')) return
    await resetAllSlides()
    window.location.reload()
  }

  const handleExportPDF = async () => {
    setExporting(true)
    // Wait a tick so React renders the hidden export stage with all slides
    await new Promise((r) => setTimeout(r, 50))
    try {
      const container = exportRef.current
      if (!container) return
      const nodes = Array.from(container.querySelectorAll('[data-export-slide]'))
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1280, 720] })

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const canvas = await html2canvas(node, {
          backgroundColor: '#FAFAFA',
          scale: 2,
          useCORS: true,
          logging: false,
          width: 1280,
          height: 720,
        })
        const img = canvas.toDataURL('image/jpeg', 0.92)
        if (i > 0) pdf.addPage([1280, 720], 'landscape')
        pdf.addImage(img, 'JPEG', 0, 0, 1280, 720)
      }
      pdf.save('tijuquinha-apresentacao.pdf')
    } catch (err) {
      console.error(err)
      alert('Erro ao gerar PDF. Veja o console.')
    } finally {
      setExporting(false)
    }
  }

  const SlideComp = slide.Component

  return (
    <div className={`min-h-screen w-full ${presentation ? 'presentation bg-black' : 'bg-neutral-900'}`}>
      <Toolbar
        presentationMode={presentation}
        onTogglePresentation={() => setPresentation((p) => !p)}
        onExportPDF={handleExportPDF}
        onResetSlide={handleResetSlide}
        onResetAll={handleResetAll}
        exporting={exporting}
        syncStatus={syncStatus}
      />

      {/* Stage */}
      <div
        ref={stageRef}
        className="w-full flex items-center justify-center"
        style={{
          minHeight: '100vh',
          paddingTop: presentation ? 0 : 64,
          paddingBottom: presentation ? 0 : 84,
        }}
      >
        <div
          className="slide-fade origin-center shadow-2xl"
          key={slide.id + '-' + current}
          style={{
            width: 1280,
            height: 720,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <Slide
            pageNumber={current + 1}
            totalSlides={total}
            hidePageNumber={slide.hidePageNumber}
          >
            <SlideComp slideId={slide.id} />
          </Slide>
        </div>
      </div>

      {/* Mobile warning */}
      <div className="md:hidden fixed top-16 left-2 right-2 z-40 bg-yellow-100 text-yellow-900 text-xs p-2 rounded-md border border-yellow-300">
        Melhor visualizado em desktop (mínimo 1280px de largura).
      </div>

      {!presentation && (
        <SlideNavigation
          current={current}
          total={total}
          slides={SLIDES}
          onSelect={go}
          onPrev={() => go(current - 1)}
          onNext={() => go(current + 1)}
        />
      )}

      {/* Hidden export stage — renders all slides at full size off-screen */}
      {exporting && (
        <div
          ref={exportRef}
          className="exporting fixed left-[-99999px] top-0"
          aria-hidden
        >
          {SLIDES.map((s, i) => {
            const C = s.Component
            return (
              <div key={s.id} data-export-slide style={{ width: 1280, height: 720 }}>
                <Slide pageNumber={i + 1} totalSlides={total} hidePageNumber={s.hidePageNumber}>
                  <C slideId={s.id} />
                </Slide>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
