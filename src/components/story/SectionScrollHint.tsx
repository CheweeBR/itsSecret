import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

type Phase = 'hint' | 'collect' | 'scroll'

interface Props {
  phase: Phase
  hintText?: string
  collectText?: string
}

export function SectionScrollHint({
  phase,
  hintText = 'arraste as fotos ✦',
  collectText = 'colete o item',
}: Props) {
  const [hidden, setHidden] = useState(false)

  // Quando volta para hint/collect, reseta o hidden
  useEffect(() => {
    if (phase !== 'scroll') {
      setHidden(false)
      return
    }

    const startY = window.scrollY

    function onScroll() {
      if (Math.abs(window.scrollY - startY) > 30) {
        setHidden(true)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [phase])

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key={phase}
          className="absolute bottom-10 pb-safe-b flex flex-col items-center gap-1 text-warm-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4 }}
        >
          {phase === 'scroll' ? (
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={24} strokeWidth={1.5} />
            </motion.div>
          ) : (
            <p
              className="text-lg opacity-60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {phase === 'hint' ? hintText : collectText}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
