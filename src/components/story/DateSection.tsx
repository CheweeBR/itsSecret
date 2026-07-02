import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Camera } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import type { DatePhoto } from '../../data/story'

interface Props {
  photo: DatePhoto
}

export function DateSection({ photo }: Props) {
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.2 })
  const polaroidRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(polaroidRef, { once: true, margin: '-80px' })

  return (
    <section className="bg-cream min-h-svh px-6 py-16 flex flex-col items-center justify-center [scroll-snap-align:start]">
      <div
        ref={reveal.ref}
        className={`${reveal.className} flex flex-col items-center gap-6`}
        style={reveal.style}
      >
        <p
          className="text-2xl uppercase tracking-[0.12em] text-warm-300 text-center"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          O início da jornada dos heróis
        </p>

        <div ref={polaroidRef} className="overflow-hidden pb-4">
          <motion.div
            className="polaroid w-72 flex flex-col items-center -rotate-1"
            initial={{ y: '-110%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ type: 'spring', damping: 14, stiffness: 35, mass: 2.5 }}
          >
            <img
              src={photo.src}
              alt={photo.caption ?? ''}
              className="h-56 w-full object-cover"
              onError={(e) => {
                const img = e.currentTarget
                img.style.display = 'none'
                const ph = img.nextElementSibling as HTMLElement | null
                if (ph) ph.style.display = 'flex'
              }}
            />
            <div
              className="hidden h-56 w-full items-center justify-center bg-warm-100"
              aria-hidden="true"
            >
              <Camera size={48} strokeWidth={1} className="text-warm-300" />
            </div>
            {photo.caption && (
              <p
                className="mt-3 text-center text-base font-semibold text-brown leading-snug"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {photo.caption}
              </p>
            )}
          </motion.div>
        </div>

        <motion.p
          className="max-w-xs text-center text-lg italic text-brown leading-relaxed"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
        >
          Foi o dia em que fiz a melhor escolha da minha vida
        </motion.p>

      </div>
    </section>
  )
}
