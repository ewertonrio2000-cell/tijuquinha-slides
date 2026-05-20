import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SlideNavigation({
  current,
  total,
  slides,
  onSelect,
  onPrev,
  onNext,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur border-t border-neutral-800 text-white px-4 py-3 flex items-center gap-3 z-30">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="p-2 rounded-md hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Slide anterior (←)"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex-1 overflow-x-auto thumb-strip">
        <div className="flex gap-2 min-w-max px-1">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onSelect(i)}
              className={`relative px-3 py-2 rounded-md text-[11px] font-medium whitespace-nowrap transition border ${
                i === current
                  ? 'bg-white text-neutral-900 border-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-neutral-700'
              }`}
              title={s.title}
            >
              <span className="opacity-60 mr-1.5">{s.label}</span>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-neutral-400 tabular-nums px-2">
        Slide {current + 1} de {total}
      </div>

      <button
        onClick={onNext}
        disabled={current === total - 1}
        className="p-2 rounded-md hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Próximo slide (→)"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
