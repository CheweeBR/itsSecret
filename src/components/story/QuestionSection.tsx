import { forwardRef, useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface Props {
  onYes: () => void
  style?: React.CSSProperties
}

export const QuestionSection = forwardRef<HTMLElement, Props>(function QuestionSection(
  { onYes, style },
  ref,
) {
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.2 })
  const maybeRef = useRef<HTMLButtonElement>(null)
  const [dodging, setDodging] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  // Botão fujão: assim que ela chega perto (toque no mobile / hover no desktop),
  // ele salta para um ponto aleatório da tela, longe do dedo. Nunca dá pra clicar.
  const dodge = useCallback((event: React.PointerEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const el = maybeRef.current
    const w = el?.offsetWidth ?? 180
    const h = el?.offsetHeight ?? 56
    const margin = 12
    const maxLeft = Math.max(margin, window.innerWidth - w - margin)
    const maxTop = Math.max(margin, window.innerHeight - h - margin)
    const px = 'clientX' in event ? event.clientX : window.innerWidth / 2
    const py = 'clientY' in event ? event.clientY : window.innerHeight / 2

    let left = margin
    let top = margin
    // Tenta algumas posições até achar uma bem longe do dedo dela.
    for (let i = 0; i < 12; i++) {
      left = margin + Math.random() * (maxLeft - margin)
      top = margin + Math.random() * (maxTop - margin)
      const dx = left + w / 2 - px
      const dy = top + h / 2 - py
      if (Math.hypot(dx, dy) > 160) break
    }

    setPos({ top, left })
    setDodging(true)
  }, [])

  return (
    <section
      ref={ref}
      style={style}
      className="min-h-svh bg-brown flex flex-col items-center justify-center px-6 py-20 pb-safe-b text-center [scroll-snap-align:start]"
    >
      <div
        ref={reveal.ref}
        className={`${reveal.className} flex flex-col items-center gap-8`}
        style={reveal.style}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Heart size={52} strokeWidth={1.5} className="text-terracota" fill="currentColor" />
        </motion.div>

        <h2
          className="text-3xl font-bold leading-snug text-cream"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Aceita ser minha<br />
          <span className="italic text-warm-200">melhor amiga para sempre?</span>
        </h2>

        <button
          type="button"
          onClick={onYes}
          className="relative z-[60] min-h-14 w-full max-w-xs rounded-2xl border-2 border-cream bg-terracota px-8 text-4xl font-semibold text-cream transition-transform active:scale-95"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Sim
        </button>

        <button
          ref={maybeRef}
          type="button"
          onPointerEnter={dodge}
          onPointerDown={dodge}
          onClick={dodge}
          className="text-2xl text-warm-200 opacity-60 underline underline-offset-4"
          style={{
            fontFamily: 'var(--font-body)',
            ...(dodging
              ? {
                  position: 'fixed',
                  top: pos.top,
                  left: pos.left,
                  margin: 0,
                  zIndex: 50,
                  touchAction: 'none',
                  transition: 'top 0.18s ease-out, left 0.18s ease-out',
                }
              : {}),
          }}
        >
          Preciso pensar...
        </button>
      </div>
    </section>
  )
})
