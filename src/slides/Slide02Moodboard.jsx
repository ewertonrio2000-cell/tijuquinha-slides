import EditableText from '../components/EditableText'
import ImageUpload from '../components/ImageUpload'
import SlideTitle from '../components/SlideTitle'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '02',
  title: 'Moodboard',
  caption: 'Atmosferas, materiais e referências visuais que orientam a linguagem do projeto.',
  images: Array(8).fill(null),
}

export default function Slide02Moodboard({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setImage = (i, v) => set({ images: d.images.map((x, idx) => (idx === i ? v : x)) })
  return (
    <div className="w-full h-full p-12 flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
        <div className="text-[12px] text-muted max-w-sm text-right">
          <EditableText value={d.caption} onChange={(v) => set({ caption: v })} multiline />
        </div>
      </div>
      {/* Grid assimétrico estilo colagem */}
      <div className="flex-1 grid grid-cols-6 grid-rows-4 gap-3 min-h-0">
        <div className="col-span-2 row-span-2"><ImageUpload value={d.images[0]} onChange={(v) => setImage(0, v)} className="w-full h-full" /></div>
        <div className="col-span-2 row-span-1"><ImageUpload value={d.images[1]} onChange={(v) => setImage(1, v)} className="w-full h-full" /></div>
        <div className="col-span-2 row-span-2"><ImageUpload value={d.images[2]} onChange={(v) => setImage(2, v)} className="w-full h-full" /></div>
        <div className="col-span-1 row-span-1"><ImageUpload value={d.images[3]} onChange={(v) => setImage(3, v)} className="w-full h-full" /></div>
        <div className="col-span-1 row-span-1"><ImageUpload value={d.images[4]} onChange={(v) => setImage(4, v)} className="w-full h-full" /></div>
        <div className="col-span-2 row-span-2"><ImageUpload value={d.images[5]} onChange={(v) => setImage(5, v)} className="w-full h-full" /></div>
        <div className="col-span-2 row-span-1"><ImageUpload value={d.images[6]} onChange={(v) => setImage(6, v)} className="w-full h-full" /></div>
        <div className="col-span-2 row-span-1"><ImageUpload value={d.images[7]} onChange={(v) => setImage(7, v)} className="w-full h-full" /></div>
      </div>
    </div>
  )
}
