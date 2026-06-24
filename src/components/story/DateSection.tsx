import { useScrollReveal } from '../../hooks/useScrollReveal'

interface Props {
  dateLabel: string
}

export function DateSection({ dateLabel }: Props) {
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.2 })

  return (
    <section className="bg-cream px-6 py-20 flex flex-col items-center">
      <div ref={reveal.ref} className={`${reveal.className} flex flex-col items-center gap-6`} style={reveal.style}>
        <p
          className="text-sm uppercase tracking-[0.25em] text-warm-300"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Foi nesse dia que tudo começou
        </p>

        <div className="polaroid w-56 flex flex-col items-center -rotate-1">
          <div className="flex h-32 w-full items-center justify-center bg-warm-100 text-5xl">
            📅
          </div>
          <p
            className="mt-3 text-center text-base font-semibold text-brown leading-snug"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {dateLabel}
          </p>
        </div>

        <p
          className="max-w-xs text-center text-sm italic text-warm-300"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          O dia em que a minha vida ficou mais bonita
        </p>
      </div>
    </section>
  )
}
