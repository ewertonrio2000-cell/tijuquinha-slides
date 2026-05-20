/**
 * Wrapper de slide em 16:9. Renderiza:
 *  - Barra lateral direita vertical com texto rotacionado
 *  - Numeração de página (canto inferior esquerdo)
 *  - Indicador de pontos (canto inferior direito)
 *  - Linha divisória horizontal no rodapé
 */
export default function Slide({
  pageNumber,
  totalSlides,
  children,
  hidePageNumber = false,
}) {
  const dots = Array.from({ length: totalSlides }, (_, i) => i)
  // 16:9 design canvas: 1280x720
  return (
    <div
      className="relative bg-paper text-ink"
      style={{ width: 1280, height: 720 }}
    >
      {/* Sidebar direita */}
      <div
        className="absolute top-0 right-0 h-full flex flex-col items-center justify-between py-6 border-l border-line bg-paper"
        style={{ width: 40 }}
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted whitespace-nowrap"
             style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          Planejamento Urbano — Tijuquinha — RJ
        </div>
        <div className="flex flex-col items-center gap-1.5">
          {dots.map((i) => (
            <span
              key={i}
              className={`dot ${i === (pageNumber - 1) ? 'active' : ''}`}
              style={{ width: 4, height: 4 }}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="absolute inset-0" style={{ right: 40 }}>
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 relative">{children}</div>
          {/* Rodapé */}
          {!hidePageNumber && (
            <div className="border-t border-line px-10 py-3 flex items-center justify-between text-[11px] text-muted uppercase tracking-[0.25em]">
              <span className="font-medium text-ink">
                {String(pageNumber).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
              </span>
              <span className="text-neutral-500">Ateliê de Urbanismo — Estácio</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
