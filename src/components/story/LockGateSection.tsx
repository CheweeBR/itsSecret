import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LockKeyhole, LockKeyholeOpen, Compass, Star, PawPrint, KeyRound } from 'lucide-react'

const SLOTS = [
  { id: 'compass',  Icon: Compass,  label: 'mapa'    },
  { id: 'star',     Icon: Star,     label: 'estrela' },
  { id: 'pawprint', Icon: PawPrint, label: 'patinha' },
  { id: 'key',      Icon: KeyRound, label: 'chave'   },
]

interface Props {
  inventory: Set<string>
  allCollected: boolean
}

export function LockGateSection({ inventory, allCollected }: Props) {
  const [shaking, setShaking] = useState(false)
  const missing = 4 - inventory.size

  function handleSwipeAttempt() {
    if (allCollected) return
    setShaking(true)
    setTimeout(() => setShaking(false), 600)
  }

  return (
    <AnimatePresence>
      {!allCollected && (
        <motion.section
          className="bg-brown-d min-h-svh px-6 py-20 flex flex-col items-center justify-center gap-8 [scroll-snap-align:start]"
          style={{ background: '#5a1030' }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          onTouchEnd={handleSwipeAttempt}
        >
          <motion.div
            animate={shaking ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <LockKeyhole
              size={72}
              strokeWidth={1.2}
              className="text-warm-200"
            />
          </motion.div>

          <div className="flex flex-col items-center gap-3 text-center">
            <p
              className="text-2xl uppercase tracking-[0.2em] text-warm-200"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              capítulo final bloqueado
            </p>
            <p
              className="text-lg italic text-warm-300"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              colete os {missing} {missing === 1 ? 'item restante' : 'itens restantes'} para continuar
            </p>
          </div>

          <div className="flex gap-4">
            {SLOTS.map(({ id, Icon }) => {
              const has = inventory.has(id)
              return (
                <motion.div
                  key={id}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                    has
                      ? 'border-terracota bg-terracota/20'
                      : 'border-warm-200/30 bg-transparent'
                  }`}
                  animate={!has && shaking ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className={has ? 'text-terracota' : 'text-warm-200/30'}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.section>
      )}

      {allCollected && (
        <motion.section
          key="unlocked"
          className="min-h-svh px-6 py-20 flex flex-col items-center justify-center gap-6 [scroll-snap-align:start]"
          style={{ background: '#5a1030' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          >
            <LockKeyholeOpen size={72} strokeWidth={1.2} className="text-terracota" />
          </motion.div>
          <motion.p
            className="text-2xl uppercase tracking-[0.2em] text-warm-200 text-center"
            style={{ fontFamily: 'var(--font-body)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            capítulo final desbloqueado
          </motion.p>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
