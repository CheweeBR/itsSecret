import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Gift } from 'lucide-react'
import { SectionScrollHint } from './SectionScrollHint'

interface Props {
  finalMessage: string
  rewardPhrase: string
}

const HEART_COLORS = ['#c0506a', '#f5d0d8', '#fdf0f0', '#e8a0b0', '#7a2040']

// Explosão de corações — reaproveitado do antigo ConfettiOverlay
function burstConfetti() {
  const fire = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...opts,
      origin: { y: 0.6 },
      colors: HEART_COLORS,
      particleCount: Math.floor(200 * particleRatio),
    })
  }
  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

const MUITO_CAP = 240 // teto de segurança

export const FinaleSection = forwardRef<HTMLDivElement, Props>(function FinaleSection(
  { finalMessage, rewardPhrase },
  ref,
) {
  // ── Seção A: "muito" acumulando até encher ────────────────────
  const [started, setStarted] = useState(false)
  const [count, setCount] = useState(3)
  const [filled, setFilled] = useState(false)
  const areaRef = useRef<HTMLDivElement>(null)
  const paraRef = useRef<HTMLParagraphElement>(null)

  // Confete ao aparecer + pequeno atraso pra o auto-scroll chegar antes da enxurrada
  useEffect(() => {
    burstConfetti()
    const t = setTimeout(() => setStarted(true), 550)
    return () => clearTimeout(t)
  }, [])

  // A cada tick adiciona mais um "muito", até o parágrafo preencher a área
  useEffect(() => {
    if (!started || filled) return
    const area = areaRef.current
    const para = paraRef.current
    if (area && para && para.scrollHeight >= area.clientHeight) {
      setFilled(true)
      return
    }
    if (count >= MUITO_CAP) {
      setFilled(true)
      return
    }
    const t = setTimeout(() => setCount((c) => c + 1), 90)
    return () => clearTimeout(t)
  }, [started, filled, count])

  // ── Seção B: recompensa ───────────────────────────────────────
  const [claimed, setClaimed] = useState(false)
  const rewardRef = useRef<HTMLDivElement>(null)

  const claim = useCallback(() => {
    setClaimed(true)
    burstConfetti()
    setTimeout(() => {
      rewardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 500)
  }, [])

  return (
    <div ref={ref}>
      {/* Seção A — "Eu te amo muito muito muito..." */}
      <section className="relative min-h-svh overflow-hidden bg-brown flex flex-col items-center px-6 py-16 text-center [scroll-snap-align:start]">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 shrink-0 text-4xl font-bold text-cream sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Eu te amo
        </motion.h2>

        <div
          ref={areaRef}
          className="flex min-h-0 w-full max-w-md flex-1 items-start justify-center overflow-hidden"
        >
          <p
            ref={paraRef}
            className="text-2xl leading-relaxed text-warm-200"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {Array.from({ length: count }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                muito{' '}
              </motion.span>
            ))}
            {filled && '...'}
          </p>
        </div>

        {/* Setinha pra baixo quando terminar de escrever os "muito" */}
        {filled && <SectionScrollHint phase="scroll" />}
      </section>

      {/* Seção B — texto final + recompensa */}
      <section className="min-h-svh bg-cream flex flex-col items-center justify-center px-6 py-20 text-center [scroll-snap-align:start]">
        <div className="flex w-full max-w-md flex-col items-center gap-8">
          <div className="animate-heartbeat" aria-hidden="true">
            <Heart size={56} strokeWidth={1.5} className="text-terracota" fill="currentColor" />
          </div>

          <p
            className="whitespace-pre-line text-justify text-2xl leading-relaxed text-brown/80"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {finalMessage}
          </p>

          <AnimatePresence mode="wait">
            {!claimed ? (
              <motion.button
                key="claim"
                type="button"
                onClick={claim}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileTap={{ scale: 0.95 }}
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-brown bg-terracota px-6 text-3xl font-semibold text-cream shadow-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Gift size={28} strokeWidth={1.8} aria-hidden="true" />
                Coletar recompensa
              </motion.button>
            ) : (
              <motion.div
                key="reward"
                ref={rewardRef}
                initial={{ opacity: 0, scale: 0.8, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="w-full rounded-3xl border-2 border-terracota bg-brown px-6 py-10 shadow-2xl"
              >
                <p className="mb-4 text-sm uppercase tracking-widest text-warm-200/70">
                  Recompensa desbloqueada
                </p>
                <p
                  className="text-3xl font-bold leading-snug text-cream sm:text-4xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {rewardPhrase}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
})
