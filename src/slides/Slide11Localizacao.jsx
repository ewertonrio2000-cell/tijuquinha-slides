import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import EditableText from '../components/EditableText'
import Polaroid from '../components/Polaroid'
import SlideTitle from '../components/SlideTitle'
import { SizeProvider } from '../components/SizeContext'
import FreeTextLayer from '../components/FreeTextLayer'
import HiddenItemsBadge from '../components/HiddenItemsBadge'
import { useSlideStorage } from '../hooks/useSlideStorage'

const defaults = {
  eyebrow: '11',
  title: 'Localização',
  address: 'Estrada da Barra da Tijuca — Tijuquinha, Rio de Janeiro / RJ',
  caption: 'Trecho selecionado para a proposta, próximo à confluência com vias coletoras e ao corredor de ônibus.',
  mapImage: null,
  photos: [
    { img: null, rot: -3, cap: 'esquina norte' },
    { img: null, rot: 2, cap: 'calçada leste' },
    { img: null, rot: -2, cap: 'ponto de ônibus' },
    { img: null, rot: 3, cap: 'travessia' },
  ],
  sizes: {},
  positions: {},
  freeTexts: [],
  hidden: [],
}

export default function Slide11Localizacao({ slideId }) {
  const [d, set] = useSlideStorage(slideId, defaults)
  const setPhoto = (i, patch) =>
    set({ photos: d.photos.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) })

  return (
    <SizeProvider sizes={d.sizes} positions={d.positions} hidden={d.hidden || []} onSizesChange={(sizes) => set({ sizes })} onPositionsChange={(positions) => set({ positions })} onHiddenChange={(hidden) => set({ hidden })}>
    <div className="w-full h-full p-12 flex flex-col gap-4">
      <SlideTitle eyebrow={d.eyebrow} value={d.title} onChange={(v) => set({ title: v })} size="md" />
      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Mapa */}
        <div className="flex flex-col gap-3 relative">
          <Polaroid
            value={d.mapImage}
            onChange={(v) => set({ mapImage: v })}
            rotation={-2}
            tape
            width={500}
            height={380}
            delay={0.2}
            positionKey="map"
           sizeKey="mapImage"/>
          <motion.div
            className="absolute right-3 top-3 text-wine"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            <MapPin size={30} fill="#6E1F26" />
          </motion.div>
          <motion.div
            className="mt-4 font-hand text-wine text-xl leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <EditableText value={d.address} onChange={(v) => set({ address: v })} multiline  positionKey="address" sizeKey="address"/>
          </motion.div>
          <div className="text-[12px] text-muted leading-relaxed">
            <EditableText value={d.caption} onChange={(v) => set({ caption: v })} multiline  positionKey="caption" sizeKey="caption"/>
          </div>
        </div>

        {/* Grid de fotos */}
        <div className="relative">
          <div className="absolute" style={{ left: '5%', top: '0%' }}>
            <Polaroid value={d.photos[0]?.img} onChange={(v) => setPhoto(0, { img: v })} rotation={d.photos[0]?.rot} caption={d.photos[0]?.cap} onCaptionChange={(v) => setPhoto(0, { cap: v })} width={170} height={150} delay={0.3} tape  positionKey="el-4" sizeKey="el-4"/>
          </div>
          <div className="absolute" style={{ right: '5%', top: '8%' }}>
            <Polaroid value={d.photos[1]?.img} onChange={(v) => setPhoto(1, { img: v })} rotation={d.photos[1]?.rot} caption={d.photos[1]?.cap} onCaptionChange={(v) => setPhoto(1, { cap: v })} width={170} height={150} delay={0.4}  positionKey="el-5" sizeKey="el-5"/>
          </div>
          <div className="absolute" style={{ left: '10%', bottom: '5%' }}>
            <Polaroid value={d.photos[2]?.img} onChange={(v) => setPhoto(2, { img: v })} rotation={d.photos[2]?.rot} caption={d.photos[2]?.cap} onCaptionChange={(v) => setPhoto(2, { cap: v })} width={170} height={150} delay={0.5}  positionKey="el-6" sizeKey="el-6"/>
          </div>
          <div className="absolute" style={{ right: '8%', bottom: '0%' }}>
            <Polaroid value={d.photos[3]?.img} onChange={(v) => setPhoto(3, { img: v })} rotation={d.photos[3]?.rot} caption={d.photos[3]?.cap} onCaptionChange={(v) => setPhoto(3, { cap: v })} width={170} height={150} delay={0.6} tape  positionKey="el-7" sizeKey="el-7"/>
          </div>
        </div>
      </div>
    </div>
      <FreeTextLayer texts={d.freeTexts} onChange={(freeTexts) => set({ freeTexts })} />
      <HiddenItemsBadge />
    </SizeProvider>
  )
}
