import { motion } from 'framer-motion'

interface Props {
  onStart: () => void
}

export function IntroModal({ onStart }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-brown flex flex-col items-center justify-center px-8 gap-8"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    >
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
        className="text-2xl italic text-cream/70 text-center leading-relaxed"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        você está preparada?
      </motion.p>

      <motion.button
        type="button"
        onClick={onStart}
        className="px-10 py-3.5 rounded-full bg-terracota text-cream uppercase tracking-widest text-sm"
        style={{ fontFamily: 'var(--font-body)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, type: 'spring', damping: 14, stiffness: 160 }}
        whileTap={{ scale: 0.94 }}
      >
        Estou pronta ✦
      </motion.button>
    </motion.div>
  )
}
