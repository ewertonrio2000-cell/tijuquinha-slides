import { useCallback, useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { AnimatePresence, motion } from 'framer-motion'

import Slide from './components/Slide'
import Toolbar from './components/Toolbar'
import SlideNavigation from './components/SlideNavigation'
import ToastContainer from './components/ToastContainer'
import DiagnosticPanel from './components/DiagnosticPanel'
import { resetAllSlides, flushAllToSupabase } from './hooks/useSlideStorage'
import { onSyncStatus, supabaseReady } from './lib/supabase'
import { toast } from './lib/toast'

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
  { id: 'slide-00', label: '00', title: 'Capa', Component: Slide00Cover, hidePageNumber: true, variant: 'wine' },
  { id: 'slide-01', label: '01', title: 'Proposta', Component: Slide01Proposta },
  { id: 'slide-01-1', label: '01.1', title: 'Diagnóstico', Component: Slide1_1Diagnostico },
  { id: 'slide-02', label: '02', title: 'Moodboard', Component: Slide02Moodboard },
  { id: 'slide-03', label: '03', title: 'Referências', Component: Slide03Referencias },
  { id: 'slide-04', label: '04', title: 'Diretrizes × Programa', Component: Slide04Diretrizes, variant: 'wine' },
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
  const [diagOpen, setDiagOpen] = useState(false)
  const [savingNow, setSavingNow] = useState(false)

  useEffect(() => onSyncStatus(setSyncStatusState), [])

  // Aviso inicial se env vars não estão configuradas no build
  useEffect(() => {
    if (!supabaseReady) {
      toast(
        'Sincronização offline — variáveis de ambiente do Supabase não foram embutidas neste build. Sua colega não vai ver suas alterações até que isso seja corrigido no Vercel.',
        { kind: 'error', duration: 0 },
      )
    }
  }, [])

  const handleSaveNow = async () => {
    setSavingNow(true)
    try {
      const result = await flushAllToSupabase()
      if (result.ok) {
        toast(`${result.pushed ?? 0} slides sincronizados com sucesso.`, { kind: 'success' })
      } else {
        toast(
          `Sincronização parcial. ${result.errors.length} erro(s):\n${result.errors.slice(0, 3).join('\n')}`,
          { kind: 'error', duration: 8000 },
        )
      }
    } finally {
      setSavingNow(false)
    }
  }
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

  const [direction, setDirection] = useState(0)
  const go = useCallback((i) => {
    setCurrent(Math.max(0, Math.min(total - 1, i)))
  }, [total])
  const goWithDir = useCallback((nextIdx) => {
    setDirection(nextIdx > current ? 1 : -1)
    setCurrent(Math.max(0, Math.min(total - 1, nextIdx)))
  }, [current, total])

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
        goWithDir(current + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goWithDir(current - 1)
      } else if (e.key === 'Escape' && presentation) {
        setPresentation(false)
      } else if (e.key === 'f' || e.key === 'F') {
        if (!e.metaKey && !e.ctrlKey) setPresentation((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, presentation])

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
          backgroundColor: '#F5EFE6',
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
    <div className={`min-h-screen w-full ${presentation ? 'presentation bg-black' : 'bg-[#1c1614]'}`}>
      <Toolbar
        presentationMode={presentation}
        onTogglePresentation={() => setPresentation((p) => !p)}
        onExportPDF={handleExportPDF}
        onResetSlide={handleResetSlide}
        onResetAll={handleResetAll}
        exporting={exporting}
        syncStatus={syncStatus}
        onOpenDiagnostic={() => setDiagOpen(true)}
        onSaveNow={handleSaveNow}
        saving={savingNow}
      />

      <DiagnosticPanel open={diagOpen} onClose={() => setDiagOpen(false)} />
      <ToastContainer />

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
        <motion.div
          className="origin-center shadow-2xl"
          style={{
            width: 1280,
            height: 720,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              data-slide-canvas
              initial={(d) => ({ opacity: 0, x: d > 0 ? 40 : -40 })}
              animate={{ opacity: 1, x: 0 }}
              exit={(d) => ({ opacity: 0, x: d > 0 ? -40 : 40 })}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 1280, height: 720 }}
            >
              <Slide
                pageNumber={current + 1}
                totalSlides={total}
                hidePageNumber={slide.hidePageNumber}
                variant={slide.variant}
              >
                <SlideComp slideId={slide.id} />
              </Slide>
            </motion.div>
          </AnimatePresence>
        </motion.div>
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
          onSelect={goWithDir}
          onPrev={() => goWithDir(current - 1)}
          onNext={() => goWithDir(current + 1)}
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
