import { Camera } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import type { Moment } from '../../data/story'

interface Props {
  moment: Moment
  index: number
}

export function MomentCard({ moment, index }: Props) {
  const direction = index % 2 === 0 ? 'left' : 'right'
  const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1'
  const reveal = useScrollReveal({ direction, threshold: 0.15, delay: 50 })

  return (
    <div className="overflow-x-hidden min-h-svh flex items-start justify-center pt-10 [scroll-snap-align:start]">
      <div
        ref={reveal.ref}
        className={`${reveal.className} flex flex-col items-center px-6 py-10 w-full`}
        style={reveal.style}
      >
      <div className={`polaroid w-full max-w-xs ${rotation}`}>
        <img
          src={moment.photo}
          alt={moment.caption}
          className="h-60 w-full object-cover"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget
            img.style.display = 'none'
            const placeholder = img.nextElementSibling as HTMLElement | null
            if (placeholder) placeholder.style.display = 'flex'
          }}
        />
        <div
          className="hidden h-60 w-full items-center justify-center bg-warm-100"
          aria-hidden="true"
        >
          <Camera size={44} strokeWidth={1} className="text-warm-300" />
        </div>
        <div className="pt-3">
          <p
            className="text-xl uppercase tracking-wider text-terracota"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {moment.date}
          </p>
          <p
            className="mt-1 text-2xl leading-snug text-brown"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {moment.caption}
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}
