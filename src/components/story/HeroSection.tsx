import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ChevronDown } from 'lucide-react'

interface Props {
  name: string
}

export function HeroSection({ name }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-cream to-warm-100 px-6 pt-safe-t text-center [scroll-snap-align:start]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Heart size={64} strokeWidth={1.5} className="text-terracota" fill="currentColor" />
        </motion.div>

        <p
          className="text-3xl font-light uppercase tracking-[0.3em] text-terracota"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Um ano juntos
        </p>

        <h1
          className="text-6xl leading-tight text-brown"
          style={{ fontFamily: "'Sacramento', cursive" }}
        >
          Para {name},<br />
          <span className="text-terracota">com todo o meu amor</span>
        </h1>
      </motion.div>

      <AnimatePresence>
        {!scrolled && (
          <motion.div
            key="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 0.8 } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.4 } }}
            className="absolute bottom-10 pb-safe-b flex flex-col items-center gap-1 text-warm-300"
          >
            <span className="text-2xl tracking-widest uppercase" style={{ fontFamily: 'var(--font-body)' }}>
              Rolar
            </span>
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
