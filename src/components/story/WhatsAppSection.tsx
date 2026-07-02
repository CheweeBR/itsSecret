import { motion } from 'framer-motion'
import { MessageCircle, Images, Heart } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useCountUp } from '../../hooks/useCountUp'
import type { WhatsAppStats } from '../../data/story'

interface Props {
  stats: WhatsAppStats
}

export function WhatsAppSection({ stats }: Props) {
  const reveal = useScrollReveal({ direction: 'up', threshold: 0.3 })
  const isVisible = reveal.className.includes('opacity-100')

  const total   = useCountUp(stats.total,   isVisible, 0)
  const media   = useCountUp(stats.media,   isVisible, 200)
  const teAmoTotal  = useCountUp(stats.teAmo + stats.euTeAmo, isVisible, 400)
  const amorTotal   = useCountUp(stats.amor + stats.mor,     isVisible, 600)

  return (
    <section className="bg-cream min-h-svh px-6 py-20 flex flex-col items-center justify-center [scroll-snap-align:start]">
      <div
        ref={reveal.ref}
        className={`${reveal.className} flex flex-col items-center gap-6 w-full max-w-sm`}
        style={reveal.style}
      >
        <p
          className="text-3xl uppercase tracking-[0.2em] text-terracota text-center"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Em 1 ano juntos
        </p>

        {/* Totais: mensagens + mídias */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {[
            { icon: <MessageCircle size={24} strokeWidth={1.5} />, value: total, label: 'mensagens' },
            { icon: <Images size={24} strokeWidth={1.5} />,        value: media, label: 'mídias' },
          ].map(({ icon, value, label }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center gap-1 rounded-2xl bg-warm-100 py-4 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-terracota">{icon}</div>
              <span className="text-4xl font-bold tabular-nums text-brown" style={{ fontFamily: 'var(--font-body)' }}>
                {value.toLocaleString('pt-BR')}
              </span>
              <span className="text-lg text-warm-300 uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Separador */}
        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-warm-200" />
          <Heart size={14} className="text-terracota" fill="currentColor" />
          <div className="h-px flex-1 bg-warm-200" />
        </div>

        {/* Dados emocionais */}
        <div className="w-full flex flex-col gap-2">
          {[
            { label: '"te amo" / "eu te amo"', value: teAmoTotal, delay: 0   },
            { label: '"amor/mor"', value: amorTotal,  delay: 150 },
          ].map(({ label, value, delay }) => (
            <motion.div
              key={label}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-warm-100"
              initial={{ opacity: 0, x: -16 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + delay / 1000, duration: 0.4 }}
            >
              <span className="text-xl italic text-warm-300" style={{ fontFamily: 'var(--font-display)' }}>
                {label}
              </span>
              <span className="text-2xl font-bold tabular-nums text-brown" style={{ fontFamily: 'var(--font-body)' }}>
                {value.toLocaleString('pt-BR')}
              </span>
            </motion.div>
          ))}
        </div>

        <p
          className="max-w-xs text-center text-xl italic text-brown"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Mesmo distantes, estamos sempre pertinho
        </p>
      </div>
    </section>
  )
}
