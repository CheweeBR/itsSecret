import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface Props {
  itemId: string
  Icon: LucideIcon
  label: string
  isCollected: boolean
  onCollect: (id: string) => void
}

export function CollectibleItem({ itemId, Icon, label, isCollected, onCollect }: Props) {
  return (
    <AnimatePresence>
      {!isCollected && (
        <motion.div
          key="collectible"
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0, y: -30 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200 }}
        >
          <motion.button
            type="button"
            onClick={() => onCollect(itemId)}
            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-terracota bg-cream shadow-lg active:scale-95"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon size={36} strokeWidth={1.5} className="text-warm-300" />
          </motion.button>
          <p
            className="text-xl uppercase tracking-widest text-warm-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {label}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
