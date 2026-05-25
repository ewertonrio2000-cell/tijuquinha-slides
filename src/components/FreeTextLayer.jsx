import { Plus } from 'lucide-react'
import FreeText from './FreeText'

/**
 * Layer que renderiza um array de FreeText + botão "+ Texto".
 *
 * Props:
 *  - texts: array de { id, value, x, y, size, color, fontFamily, bg }
 *  - onChange: (nextTexts[]) => void
 *  - buttonPosition: classes Tailwind para posicionar o botão (default canto inferior direito)
 */
export default function FreeTextLayer({ texts = [], onChange, buttonPosition = 'bottom-4 right-40' }) {
  if (!onChange) return null

  const update = (i, next) => onChange(texts.map((t, idx) => (idx === i ? next : t)))
  const add = () =>
    onChange([
      ...texts,
      {
        id: Date.now(),
        value: 'Novo texto',
        x: 40,
        y: 40,
        size: 1.4,
        color: '#1A1A1A',
        fontFamily: 'sans',
      },
    ])
  const remove = (i) => onChange(texts.filter((_, idx) => idx !== i))

  return (
    <>
      {texts.map((t, i) => (
        <FreeText
          key={t.id ?? i}
          text={t}
          onChange={(next) => update(i, next)}
          onRemove={() => remove(i)}
        />
      ))}
      <button
        onClick={add}
        type="button"
        className={`edit-only absolute z-30 flex items-center gap-1.5 px-3 py-1.5 bg-wine text-cream text-[11px] uppercase tracking-[0.2em] font-semibold rounded-full shadow hover:bg-wine-700 transition ${buttonPosition}`}
        title="Adicionar caixa de texto livre"
      >
        <Plus size={12} /> Texto
      </button>
    </>
  )
}
