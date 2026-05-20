import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '11',
  title: 'Localização',
  address: 'Estrada da Barra da Tijuca — Tijuquinha, Rio de Janeiro / RJ',
  caption: 'Trecho selecionado para a proposta, próximo à confluência com vias coletoras e ao corredor de ônibus.',
  mapImage: null,
  photos: [null, null, null, null],
}

export default function Slide11Localizacao({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setPhoto = (i, v) => set({ photos: d.photos.map((p, idx) => (idx === i ? v : p)) })
  return (
    <div className="w-full h-full p-12 flex flex-col gap-4">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Mapa */}
        <div className="flex flex-col gap-3">
          <ImageUpload
            value={d.mapImage}
            onChange={(v) => set({ mapImage: v })}
            className="w-full flex-1"
            rounded="lg"
            label="Print do Google Maps"
          />
          <div className="text-[12px] text-ink font-medium border-t border-line pt-2">
            <EditableText value={d.address} onChange={(v) => set({ address: v })} />
          </div>
          <div className="text-[11px] text-muted leading-relaxed">
            <EditableText value={d.caption} onChange={(v) => set({ caption: v })} multiline />
          </div>
        </div>
        {/* Grid de fotos */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          {d.photos.map((p, i) => (
            <ImageUpload key={i} value={p} onChange={(v) => setPhoto(i, v)} className="w-full h-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
