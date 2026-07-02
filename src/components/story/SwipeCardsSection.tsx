import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Compass, Camera } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { CollectibleItem } from './CollectibleItem'
import { SectionScrollHint } from './SectionScrollHint'
import type { DatePhoto } from '../../data/story'

const ROTATIONS = [-2, 3, -1.5, 1.5]

interface CardProps {
  photo: DatePhoto
  rotation: number
  zIndex: number
  depthScale: number
  isTop: boolean
  onGone: () => void
}

function SwipeCard({ photo, rotation, zIndex, depthScale, isTop, onGone }: CardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const cardRotate = useTransform(x, [-200, 0, 200], [rotation - 12, rotation, rotation + 12])

  async function handleDragEnd(_: unknown, { offset }: { offset: { x: number; y: number } }) {
    const dist = Math.sqrt(offset.x ** 2 + offset.y ** 2)
    if (dist < 80) return
    const angle = Math.atan2(offset.y, offset.x)
    await Promise.all([
      animate(x, Math.cos(angle) * 700, { duration: 0.3, ease: 'easeOut' }),
      animate(y, Math.sin(angle) * 700, { duration: 0.3, ease: 'easeOut' }),
    ])
    onGone()
  }

  return (
    <motion.div
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      style={{ x, y, rotate: cardRotate, zIndex, scale: depthScale, touchAction: 'none' }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: depthScale * 1.05 }}
      className="polaroid w-64 absolute cursor-grab active:cursor-grabbing select-none"
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
      <div
        className="hidden h-52 w-full items-center justify-center bg-warm-100"
        aria-hidden="true"
      >
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
    </motion.div>
  )
}

interface Props {
  photos: DatePhoto[]
  isCollected: boolean
  onCollect: (id: string) => void
}

export function SwipeCardsSection({ photos, isCollected, onCollect }: Props) {
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.2 })
  const [stack, setStack] = useState(() => photos.map((_, i) => i).reverse())
  const allSwiped = stack.length === 0

  function removeTop() {
    setStack(prev => prev.slice(0, -1))
  }

  const phase = !allSwiped ? 'hint' : isCollected ? 'scroll' : 'collect'

  return (
    <section className="relative bg-warm-100 min-h-svh px-6 pt-16 pb-12 flex flex-col items-center justify-center [scroll-snap-align:start]">
      <div
        ref={reveal.ref}
        className={`${reveal.className} flex flex-col items-center gap-8 w-full`}
        style={reveal.style}
      >
        <p
          className="text-2xl uppercase tracking-[0.12em] text-terracota text-center"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          E assim a nossa aventura começou
        </p>

        <div className="relative h-80 w-64">
          {stack.map((cardIndex, i) => {
            const isTop = i === stack.length - 1
            const depthFromTop = stack.length - 1 - i
            return (
              <SwipeCard
                key={cardIndex}
                photo={photos[cardIndex]}
                rotation={ROTATIONS[cardIndex % ROTATIONS.length]}
                zIndex={i + 1}
                depthScale={1 - depthFromTop * 0.04}
                isTop={isTop}
                onGone={removeTop}
              />
            )
          })}

          {allSwiped && (
            <div className="flex h-full items-center justify-center">
              <CollectibleItem
                itemId="compass"
                Icon={Compass}
                label="mapa"
                isCollected={isCollected}
                onCollect={onCollect}
              />
            </div>
          )}
        </div>
      </div>

      <SectionScrollHint
        phase={phase}
        hintText="arraste as fotos ✦"
        collectText="colete o mapa"
      />
    </section>
  )
}
