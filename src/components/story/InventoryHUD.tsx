import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Star, PawPrint, KeyRound } from 'lucide-react'

const SLOTS = [
  { id: 'compass',  Icon: Compass,  },
  { id: 'star',     Icon: Star,     },
  { id: 'pawprint', Icon: PawPrint, },
  { id: 'key',      Icon: KeyRound, },
]

interface Props {
  inventory: Set<string>
}

export function InventoryHUD({ inventory }: Props) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (inventory.size === 0) return

    setVisible(true)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 3000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [inventory.size])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-4 px-4 py-3"
          style={{ background: 'rgba(253, 240, 240, 0.92)', backdropFilter: 'blur(8px)' }}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        >
          {SLOTS.map(({ id, Icon }) => {
            const has = inventory.has(id)
            return (
              <motion.div
                key={id}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  has
                    ? 'border-terracota bg-terracota/10'
                    : 'border-warm-200 bg-transparent'
                }`}
                animate={has ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {has ? (
                  <Icon size={20} strokeWidth={1.8} className="text-terracota" />
                ) : (
                  <span
                    className="text-3xl font-bold text-warm-200"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    ?
                  </span>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
