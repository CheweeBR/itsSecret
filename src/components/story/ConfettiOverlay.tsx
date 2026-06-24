import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Dialog } from 'radix-ui'

interface Props {
  open: boolean
  onClose: () => void
  name: string
  message: string
}

export function ConfettiOverlay({ open, onClose, name, message }: Props) {
  useEffect(() => {
    if (!open) return

    const colors = ['#c0714f', '#f5e6d0', '#fdf6ed', '#ffd700', '#a85940']

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...opts,
        origin: { y: 0.6 },
        colors,
        particleCount: Math.floor(200 * particleRatio),
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.20, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.10, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.10, { spread: 120, startVelocity: 45 })
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[88vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-cream px-6 py-8 shadow-2xl focus:outline-none">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="text-5xl animate-heartbeat" aria-hidden="true">💛</div>

            <Dialog.Title
              className="text-2xl font-bold text-brown"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {name}, que alegria! ♥
            </Dialog.Title>

            <Dialog.Description
              className="text-sm leading-relaxed text-brown/80"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {message}
            </Dialog.Description>

            <Dialog.Close
              className="min-h-11 w-full rounded-2xl bg-terracota px-6 text-sm font-semibold text-cream transition-transform active:scale-95"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Eu também te amo 💛
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
