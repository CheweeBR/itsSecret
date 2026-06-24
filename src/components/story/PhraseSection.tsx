import { useScrollReveal } from '../../hooks/useScrollReveal'

interface Props {
  phrase: string
  index: number
}

export function PhraseSection({ phrase, index }: Props) {
  const reveal = useScrollReveal<HTMLQuoteElement>({ direction: 'none', threshold: 0.25 })
  const bg = index % 2 === 0 ? 'bg-warm-100' : 'bg-cream'

  return (
    <section className={`${bg} px-8 py-20 flex items-center justify-center`}>
      <blockquote
        ref={reveal.ref}
        className={`${reveal.className} max-w-sm text-center`}
        style={reveal.style}
      >
        <span className="mb-4 block text-4xl text-terracota" aria-hidden="true">
          "
        </span>
        <p
          className="text-2xl font-semibold italic leading-relaxed text-brown"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {phrase}
        </p>
        <span className="mt-2 block text-4xl text-terracota" aria-hidden="true">
          "
        </span>
      </blockquote>
    </section>
  )
}
