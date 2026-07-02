import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { MotionValue, PanInfo } from 'framer-motion'
import { PawPrint, Camera } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { CollectibleItem } from './CollectibleItem'
import { SectionScrollHint } from './SectionScrollHint'
import type { DatePhoto } from '../../data/story'

// Quantos px de arrasto correspondem a uma virada completa (180°)
const DRAG_PER_PAGE = 150
const SWIPE_OFFSET = 70
const SWIPE_VELOCITY = 500

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

interface PageProps {
  photo: DatePhoto
  index: number
  total: number
  // Páginas viradas (float): página i está virando enquanto progress ∈ (i, i+1)
  progress: MotionValue<number>
}

function AlbumPage({ photo, index, total, progress }: PageProps) {
  const rotateY = useTransform(progress, [index, index + 1], [0, -180])
  // Escurece conforme a página levanta, como se saísse da luz
  const shade = useTransform(progress, [index, index + 0.5], [0, 0.4])
  // Página virada fica de costas (backface-visibility esconde), mas ainda
  // capturaria toques na área espelhada à esquerda — some de vez do hit-test
  const visibility = useTransform(progress, p => (p >= index + 0.99 ? 'hidden' : 'visible'))

  return (
    <motion.div
      className="absolute left-4 top-4 h-[19rem] w-60 bg-white p-3 shadow-md select-none"
      style={{
        rotateY,
        visibility,
        x: index,
        y: index * 0.8,
        zIndex: total - index,
        transformOrigin: 'left center',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <img
        src={photo.src}
        alt={photo.caption ?? ''}
        className="h-52 w-full object-cover"
        draggable={false}
        onError={(e) => {
          const img = e.currentTarget
          img.style.display = 'none'
          const ph = img.nextElementSibling as HTMLElement | null
          if (ph) ph.style.display = 'flex'
        }}
      />
      <div className="hidden h-52 w-full items-center justify-center bg-warm-100" aria-hidden="true">
        <Camera size={40} strokeWidth={1} className="text-warm-300" />
      </div>
      {photo.caption && (
        <p
          className="mt-3 text-center text-sm font-semibold text-brown leading-snug"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {photo.caption}
        </p>
      )}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-brown-d"
        style={{ opacity: shade }}
      />
    </motion.div>
  )
}

interface Props {
  photos: DatePhoto[]
  isCollected: boolean
  onCollect: (id: string) => void
}

export function MissoshiroSection({ photos, isCollected, onCollect }: Props) {
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.2 })
  const total = photos.length
  const [page, setPage] = useState(0)
  const progress = useMotionValue(0)
  const panStart = useRef(0)
  const albumRef = useRef<HTMLDivElement>(null)
  const allFlipped = page === total

  const phase = !allFlipped ? 'hint' : isCollected ? 'scroll' : 'collect'

  function handlePanStart() {
    progress.stop()
    panStart.current = progress.get()
  }

  function handlePan(_: unknown, info: PanInfo) {
    // Arrastar para a esquerda vira a página atual; para a direita, desvira a anterior.
    // Limitado a uma página por gesto, como num álbum de verdade.
    const raw = panStart.current - info.offset.x / DRAG_PER_PAGE
    progress.set(clamp(raw, Math.max(0, page - 1), Math.min(total, page + 1)))
  }

  function handlePanEnd(_: unknown, info: PanInfo) {
    let target = page
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
      target = Math.min(page + 1, total)
    } else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
      target = Math.max(page - 1, 0)
    }
    setPage(target)
    animate(progress, target, { type: 'spring', stiffness: 120, damping: 17 })
  }

  // Tocar na metade direita do álbum avança a página; na esquerda, volta.
  // O Framer só dispara onTap quando não houve arrasto, então convive com o pan.
  function handleTap(event: MouseEvent | TouchEvent | PointerEvent) {
    // Todas viradas: não interfere no clique de coletar a patinha.
    if (allFlipped || !albumRef.current) return
    const clientX = 'clientX' in event ? event.clientX : event.changedTouches[0]?.clientX ?? 0
    const rect = albumRef.current.getBoundingClientRect()
    const forward = clientX - rect.left > rect.width / 2
    const target = forward ? Math.min(page + 1, total) : Math.max(page - 1, 0)
    setPage(target)
    animate(progress, target, { type: 'spring', stiffness: 120, damping: 17 })
  }

  return (
    <section className="relative bg-cream min-h-svh px-6 pt-16 pb-12 flex flex-col items-center justify-center [scroll-snap-align:start]">
      <div
        ref={reveal.ref}
        className={`${reveal.className} flex flex-col items-center gap-8 w-full`}
        style={reveal.style}
      >
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-2xl uppercase tracking-[0.12em] text-warm-300 text-center"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Missoshiro
          </p>
          <p
            className="max-w-xs text-center text-lg italic text-brown"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            A nossa segunda filha
          </p>
        </div>

        <motion.div
          ref={albumRef}
          className="relative h-[21rem] w-[17rem] cursor-grab active:cursor-grabbing"
          style={{ perspective: 1200, touchAction: 'pan-y' }}
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          onTap={handleTap}
        >
          {/* Capa/contracapa do álbum com lombada costurada à esquerda */}
          <div className="absolute inset-0 rounded-r-md rounded-l-sm bg-warm-100 shadow-lg">
            <div className="absolute inset-y-0 left-0 w-4 rounded-l-sm bg-warm-200" />
            <div className="absolute inset-y-2 left-4 border-l border-dashed border-warm-300/60" />
          </div>

          {allFlipped && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CollectibleItem
                itemId="pawprint"
                Icon={PawPrint}
                label="patinha"
                isCollected={isCollected}
                onCollect={onCollect}
              />
            </div>
          )}

          {photos.map((photo, i) => (
            <AlbumPage key={i} photo={photo} index={i} total={total} progress={progress} />
          ))}
        </motion.div>

        {total > 0 && (
          <div className="flex items-center gap-2" aria-hidden="true">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  i === page ? 'bg-terracota' : 'bg-warm-200'
                }`}
              />
            ))}
            <PawPrint
              size={12}
              strokeWidth={2}
              className={`transition-colors duration-300 ${
                allFlipped ? 'text-terracota' : 'text-warm-200'
              }`}
            />
          </div>
        )}
      </div>

      <SectionScrollHint
        phase={phase}
        hintText="deslize ou toque para virar ✦"
        collectText="colete a patinha"
      />
    </section>
  )
}
