/**
 * Wrapper de slide em 16:9 com a nova paleta bordô/creme.
 * Suporta variantes de tema:
 *   - 'cream' (default): fundo creme, texto preto, sidebar bordô
 *   - 'wine':            fundo bordô, texto creme — usado em capa/seções fortes
 */
export default function Slide({
  pageNumber,
  totalSlides,
  children,
  hidePageNumber = false,
  variant = 'cream',
}) {
  const dots = Array.from({ length: totalSlides }, (_, i) => i)
  const isWine = variant === 'wine'
  const bgMain = isWine ? 'bg-wine text-cream' : 'bg-cream text-ink'
  const sidebarBg = isWine ? 'bg-wine-700 border-wine-700' : 'bg-cream-200 border-line'
  const sidebarText = isWine ? 'text-cream/80' : 'text-wine'
  const dotInactive = isWine ? 'bg-cream/30' : 'bg-wine/25'
  const dotActive = isWine ? 'bg-cream' : 'bg-wine'
  const footerBorder = isWine ? 'border-wine-700' : 'border-line'
  const footerText = isWine ? 'text-cream/70' : 'text-wine'
  const footerMuted = isWine ? 'text-cream/50' : 'text-wine/50'

  return (
    <div className={`relative ${bgMain}`} style={{ width: 1280, height: 720 }}>
      {/* Sidebar direita */}
      <div
        className={`absolute top-0 right-0 h-full flex flex-col items-center justify-between py-6 border-l ${sidebarBg}`}
        style={{ width: 44 }}
      >
        <div
          className={`text-[10px] uppercase tracking-[0.32em] whitespace-nowrap font-medium ${sidebarText}`}
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Planejamento Urbano — Tijuquinha — RJ
        </div>
        <div className="flex flex-col items-center gap-1.5">
          {dots.map((i) => (
            <span
              key={i}
              className="inline-block rounded-full"
              style={{
                width: 5,
                height: 5,
                background: i === pageNumber - 1
                  ? (isWine ? '#F5EFE6' : '#6E1F26')
                  : (isWine ? 'rgba(245,239,230,0.3)' : 'rgba(110,31,38,0.25)'),
              }}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="absolute inset-0" style={{ right: 44 }}>
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 relative">{children}</div>
          {/* Rodapé */}
          {!hidePageNumber && (
            <div className={`border-t ${footerBorder} px-10 py-3 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] font-medium`}>
              <span className={footerText}>
                {String(pageNumber).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
              </span>
              <span className={footerMuted}>Ateliê de Urbanismo — Estácio</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
