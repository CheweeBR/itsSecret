import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface Props {
  onYes: () => void
}

export function QuestionSection({ onYes }: Props) {
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.2 })

  function handleMaybe() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="min-h-dvh bg-brown flex flex-col items-center justify-center px-6 py-20 pb-safe-b text-center">
      <div ref={reveal.ref} className={`${reveal.className} flex flex-col items-center gap-8`} style={reveal.style}>
        <motion.div
          animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl"
          aria-hidden="true"
        >
          💛
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
          className="min-h-14 w-full max-w-xs rounded-2xl border-2 border-cream bg-terracota px-8 text-lg font-semibold text-cream transition-transform active:scale-95"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Sim 💛
        </button>

        <button
          type="button"
          onClick={handleMaybe}
          className="text-xs text-warm-200 opacity-60 underline underline-offset-4"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Preciso pensar...
        </button>
      </div>
    </section>
  )
}
