import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useCountUp } from '../../hooks/useCountUp'

interface Props {
  streak: number
}

export function SnapchatSection({ streak }: Props) {
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.25 })
  const isVisible = reveal.className.includes('opacity-100')
  const displayStreak = useCountUp(streak, isVisible)

  return (
    <section className="bg-brown min-h-svh px-6 py-20 flex flex-col items-center justify-center [scroll-snap-align:start]">
      <div
        ref={reveal.ref}
        className={`${reveal.className} flex flex-col items-center gap-8 max-w-sm`}
        style={reveal.style}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-terracota"
        >
          <Flame size={64} strokeWidth={1.5} fill="currentColor" className="text-terracota" />
        </motion.div>

        <p
          className="text-8xl font-bold tabular-nums text-cream text-center"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {displayStreak.toLocaleString('pt-BR')}
        </p>

        <p
          className="text-2xl uppercase tracking-[0.2em] text-warm-200 text-center"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          dias de foguinho
        </p>

        <div className="flex flex-col gap-4 text-center">
          <p
            className="text-xl italic text-warm-100 leading-relaxed"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Esse é o nosso primeiro filho, exige carinho, dedicação e amor.
          </p>
          <p
            className="text-xl italic text-warm-200 leading-relaxed"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Assim como o nosso relacionamento.
          </p>
        </div>
      </div>
    </section>
  )
}
