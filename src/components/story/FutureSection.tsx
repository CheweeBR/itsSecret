import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { KeyRound, Camera } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { CollectibleItem } from './CollectibleItem'
import { SectionScrollHint } from './SectionScrollHint'
import type { DatePhoto } from '../../data/story'

const CARD_WIDTH = 128 // w-32

// Uma foto voando por lane; velocidades lentas para tocar fácil numa tela de 360px
const LANES = [
  { top: '0%', duration: 14, rotate: -3, fromLeft: true },
  { top: '16%', duration: 18, rotate: 2.5, fromLeft: false },
  { top: '32%', duration: 16, rotate: -1.5, fromLeft: true },
]

interface FlyingSlot {
  src: string
  initialFrac: number
}

interface FloatingProps {
  photo: DatePhoto
  slotIndex: number
  areaWidth: number
  active: boolean
  initialFrac: number
  onCatch: (src: string) => void
}

function FloatingPhoto({ photo, slotIndex, areaWidth, active, initialFrac, onCatch }: FloatingProps) {
  const x = useMotionValue(-CARD_WIDTH)
  const lane = LANES[slotIndex % LANES.length]

  useEffect(() => {
    if (!active) return
    const start = lane.fromLeft ? -CARD_WIDTH : areaWidth
    const end = lane.fromLeft ? areaWidth : -CARD_WIDTH
    const span = end - start
    // retoma de onde parou; ao entrar no jogo parte do ponto inicial da lane
    let frac = (x.get() - start) / span
    if (frac <= 0 || frac >= 1) frac = initialFrac
    x.set(start + span * frac)
    let controls = animate(x, end, {
      duration: lane.duration * (1 - frac),
      ease: 'linear',
      onComplete: loop,
    })
    function loop() {
      x.set(start)
      controls = animate(x, end, { duration: lane.duration, ease: 'linear', onComplete: loop })
    }
    return () => controls.stop()
  }, [active, areaWidth, initialFrac, lane, x])

  return (
    <motion.button
      type="button"
      layoutId={photo.src}
      // pointerdown captura no primeiro toque — click falha em alvos em movimento
      onPointerDown={() => onCatch(photo.src)}
      className="polaroid absolute left-0 w-32 cursor-pointer select-none"
      style={{ x, top: lane.top, rotate: lane.rotate, zIndex: slotIndex + 1, willChange: 'transform' }}
      animate={{ y: [0, -8, 0] }}
      transition={{ y: { duration: 2.4 + slotIndex * 0.5, repeat: Infinity, ease: 'easeInOut' } }}
    >
      <img
        src={photo.src}
        alt={photo.caption ?? ''}
        className="h-24 w-full object-cover"
        draggable={false}
        onError={(e) => {
          const img = e.currentTarget
          img.style.display = 'none'
          const ph = img.nextElementSibling as HTMLElement | null
          if (ph) ph.style.display = 'flex'
        }}
      />
      <div className="hidden h-24 w-full items-center justify-center bg-warm-100" aria-hidden="true">
        <Camera size={32} strokeWidth={1} className="text-warm-300" />
      </div>
      {photo.caption && (
        <p
          className="mt-2 text-center text-xs font-semibold text-brown leading-snug"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {photo.caption}
        </p>
      )}
    </motion.button>
  )
}

interface Props {
  photos: DatePhoto[]
  isCollected: boolean
  onCollect: (id: string) => void
}

export function FutureSection({ photos, isCollected, onCollect }: Props) {
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.2 })
  // Estado do jogo num objeto só, com updater puro (StrictMode executa updaters 2x)
  const [game, setGame] = useState(() => ({
    caught: new Set<string>(),
    // No máximo uma foto por lane; ao capturar, a próxima da fila entra no lugar
    flying: LANES.map((_, i): FlyingSlot | null =>
      photos[i] ? { src: photos[i].src, initialFrac: (0.15 + i * 0.38) % 1 } : null
    ),
    nextIndex: Math.min(LANES.length, photos.length),
  }))
  const { caught, flying } = game
  const sectionRef = useRef<HTMLElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)
  const [areaWidth, setAreaWidth] = useState(0)
  const [inView, setInView] = useState(false)

  useLayoutEffect(() => {
    const el = areaRef.current
    if (!el) return
    const update = () => setAreaWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Anima só com a seção visível — poupa CPU/bateria no celular
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Depois de coletar a chave, a última foto capturada vira destaque no centro;
  // clicar numa polaroid da grade troca o destaque (a anterior volta pro seu lugar)
  const [featured, setFeatured] = useState<string | null>(null)

  useEffect(() => {
    if (!isCollected) return
    // espera a animação de saída da chave antes de destacar
    const timer = setTimeout(() => {
      setFeatured(prev => prev ?? [...caught].at(-1) ?? photos.at(-1)?.src ?? null)
    }, 700)
    return () => clearTimeout(timer)
  }, [isCollected, caught, photos])

  const allCaught = photos.every(p => caught.has(p.src))
  const featuredPhoto = featured ? photos.find(p => p.src === featured) : undefined
  const phase = !allCaught ? 'hint' : isCollected ? 'scroll' : 'collect'

  function catchPhoto(src: string) {
    setGame(prev => {
      if (prev.caught.has(src)) return prev
      const caught = new Set([...prev.caught, src])
      const flying = [...prev.flying]
      let nextIndex = prev.nextIndex
      const i = flying.findIndex(slot => slot?.src === src)
      if (i !== -1) {
        const nextPhoto = photos[nextIndex]
        // a substituta entra pela borda da tela (frac 0)
        flying[i] = nextPhoto ? { src: nextPhoto.src, initialFrac: 0 } : null
        if (nextPhoto) nextIndex += 1
      }
      return { caught, flying, nextIndex }
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-warm-100 min-h-svh px-6 pt-16 pb-12 flex flex-col items-center justify-center [scroll-snap-align:start]"
    >
      <div
        ref={reveal.ref}
        className={`${reveal.className} flex flex-col items-center gap-4 w-full`}
        style={reveal.style}
      >
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-2xl uppercase tracking-[0.12em] text-terracota text-center"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Nosso futuro será assim
          </p>
          <p
            className="max-w-xs text-center text-lg italic text-brown"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            cheio de sorriso, parceria e amor
          </p>
        </div>

        <div ref={areaRef} className="relative h-64 w-screen overflow-hidden">
          {areaWidth > 0 &&
            flying.map((slot, i) => {
              if (!slot) return null
              const photo = photos.find(p => p.src === slot.src)
              if (!photo) return null
              return (
                <FloatingPhoto
                  key={slot.src}
                  photo={photo}
                  slotIndex={i}
                  areaWidth={areaWidth}
                  active={inView}
                  initialFrac={slot.initialFrac}
                  onCatch={catchPhoto}
                />
              )
            })}

          {allCaught && !featured && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CollectibleItem
                itemId="key"
                Icon={KeyRound}
                label="chave"
                isCollected={isCollected}
                onCollect={onCollect}
              />
            </div>
          )}

          {featuredPhoto && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <motion.div
                key={featuredPhoto.src}
                layoutId={featuredPhoto.src}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="polaroid w-44"
                style={{ rotate: -2 }}
              >
                <img
                  src={featuredPhoto.src}
                  alt={featuredPhoto.caption ?? ''}
                  className="h-36 w-full object-cover"
                  draggable={false}
                />
                {featuredPhoto.caption && (
                  <p
                    className="mt-2 text-center text-sm font-semibold text-brown leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {featuredPhoto.caption}
                  </p>
                )}
              </motion.div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {photos.map((photo, i) => (
            <div key={photo.src} className="flex h-18 w-16 items-center justify-center">
              {caught.has(photo.src) && featured !== photo.src ? (
                <motion.button
                  type="button"
                  layoutId={photo.src}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  onClick={() => setFeatured(photo.src)}
                  disabled={!isCollected}
                  whileTap={isCollected ? { scale: 0.9 } : undefined}
                  className={`w-16 bg-white p-1 pb-1.5 shadow-md ${isCollected ? 'cursor-pointer' : ''}`}
                  style={{ rotate: i % 2 === 0 ? -3 : 3 }}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption ?? ''}
                    className="h-14 w-full object-cover"
                    draggable={false}
                  />
                </motion.button>
              ) : (
                <div className="h-16 w-12 rounded-sm border-2 border-dashed border-warm-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      <SectionScrollHint
        phase={phase}
        hintText="toque nas fotos para pegá-las ✦"
        collectText="colete a chave"
      />
    </section>
  )
}
