import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLiveCounter } from '../../hooks/useLiveCounter'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useCountUpProgress } from '../../hooks/useCountUp'

interface Props {
  startDate: Date
}

const units = [
  { key: 'days' as const,    label: 'dias' },
  { key: 'hours' as const,   label: 'horas' },
  { key: 'minutes' as const, label: 'minutos' },
  { key: 'seconds' as const, label: 'segundos' },
]

export function CounterSection({ startDate }: Props) {
  const counter = useLiveCounter(startDate)
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.2 })

  // "visible" vira true quando o conteúdo entra em view (mesmo ref do reveal)
  const isVisible = reveal.className.includes('opacity-100')

  // Animação de contagem 0 → valor ao vivo (igual à quantidade de mensagens).
  // Ao terminar (progress = 1) volta a exibir o valor ao vivo, que segue tickando.
  const progress = useCountUpProgress(isVisible)

  return (
    <section className="relative bg-warm-100 flex min-h-svh items-center justify-center px-6 py-20 [scroll-snap-align:start]">
      <div ref={reveal.ref} className={`${reveal.className} w-full`} style={reveal.style}>
        <p
          className="mb-10 text-center text-3xl uppercase tracking-[0.25em] text-terracota"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Já faz
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {units.map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-2xl bg-cream px-4 py-5 shadow-sm"
            >
              <span
                className="text-7xl font-bold tabular-nums text-brown"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {String(Math.round(counter[key] * progress)).padStart(2, '0')}
              </span>
              <span
                className="mt-1 text-2xl text-warm-300 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <p
          className="mt-10 text-center text-lg italic text-brown"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          que você aceitou ser o amor da minha vida
        </p>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="counter-arrow"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute bottom-10 pb-safe-b flex flex-col items-center gap-1 text-warm-300"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={24} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
