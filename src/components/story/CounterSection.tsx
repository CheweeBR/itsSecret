import { useLiveCounter } from '../../hooks/useLiveCounter'
import { useScrollReveal } from '../../hooks/useScrollReveal'

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

  return (
    <section className="bg-warm-100 px-6 py-20">
      <div ref={reveal.ref} className={reveal.className} style={reveal.style}>
        <p
          className="mb-10 text-center text-sm uppercase tracking-[0.25em] text-terracota"
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
                className="text-4xl font-bold tabular-nums text-brown"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {String(counter[key]).padStart(2, '0')}
              </span>
              <span
                className="mt-1 text-xs text-warm-300 uppercase tracking-wider"
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
          que você faz parte da minha vida
        </p>
      </div>
    </section>
  )
}
