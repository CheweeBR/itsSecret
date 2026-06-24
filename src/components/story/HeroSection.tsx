import { motion } from 'framer-motion'

interface Props {
  name: string
}

export function HeroSection({ name }: Props) {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-cream to-warm-100 px-6 pt-safe-t text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl"
          aria-hidden="true"
        >
          ♥
        </motion.div>

        <p
          className="text-sm font-light uppercase tracking-[0.3em] text-terracota"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Um ano juntos
        </p>

        <h1
          className="text-4xl font-bold leading-tight text-brown"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Para {name},<br />
          <span className="italic font-normal text-terracota">com todo o meu amor</span>
        </h1>

        <p
          className="max-w-xs text-base text-warm-300 leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Role para baixo e reviva a nossa história
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 pb-safe-b flex flex-col items-center gap-2 text-warm-300"
      >
        <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-body)' }}>
          Rolar
        </span>
        <span className="animate-bounce-slow text-lg">↓</span>
      </motion.div>
    </section>
  )
}
