import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronRight } from 'lucide-react'
import { CollectibleItem } from './CollectibleItem'
import { SectionScrollHint } from './SectionScrollHint'
import type { DatePhoto } from '../../data/story'

const GRID = 2
const TOTAL = GRID * GRID
// Delays variados: peças caem em momentos diferentes para parecer orgânico
const FALL_DELAYS = [0.38, 0.60, 0.47, 0.74]

function shuffled(): number[] {
  const arr = Array.from({ length: TOTAL }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // garante que não começa já resolvido
  if (arr.every((v, i) => v === i)) [arr[0], arr[1]] = [arr[1], arr[0]]
  return arr
}

function tileStyle(tileId: number, src: string): React.CSSProperties {
  const col = tileId % GRID
  const row = Math.floor(tileId / GRID)
  return {
    backgroundImage: `url(${src})`,
    backgroundSize: '200% 200%',
    backgroundPosition: `${col * 100}% ${row * 100}%`,
  }
}

function Puzzle({ photo, onSolved }: { photo: DatePhoto; onSolved: () => void }) {
  const [tiles, setTiles] = useState(shuffled)
  const [selected, setSelected] = useState<number | null>(null)
  // posições iniciais aleatórias calculadas uma única vez no mount
  const initY = useRef(Array.from({ length: TOTAL }, () => -(260 + Math.random() * 180)))
  const initX = useRef(Array.from({ length: TOTAL }, () => (Math.random() - 0.5) * 90))

  function tap(pos: number) {
    if (selected === null) { setSelected(pos); return }
    if (selected === pos) { setSelected(null); return }
    const next = [...tiles]
    ;[next[selected], next[pos]] = [next[pos], next[selected]]
    setTiles(next)
    setSelected(null)
    if (next.every((t, i) => t === i)) onSolved()
  }

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {tiles.map((tileId, pos) => (
        <motion.button
          key={pos}
          type="button"
          initial={{ y: initY.current[pos], x: initX.current[pos], opacity: 0 }}
          animate={{ y: 0, x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 85, delay: FALL_DELAYS[pos] }}
          whileTap={{ scale: 0.92 }}
          onClick={() => tap(pos)}
          aria-label={`Peça ${pos + 1}`}
          aria-pressed={selected === pos}
          className={[
            'w-36 h-36 select-none border-[3px]',
            selected === pos
              ? 'border-terracota shadow-[0_0_14px_3px_rgba(192,113,79,0.55)]'
              : 'border-white/50',
          ].join(' ')}
          style={tileStyle(tileId, photo.src)}
        />
      ))}
    </div>
  )
}

interface Props {
  photos: DatePhoto[]
  isCollected: boolean
  onCollect: (id: string) => void
}

export function AdventureSection({ photos, isCollected, onCollect }: Props) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const [bgSrc, setBgSrc] = useState<string | null>(null)
  const [bgVisible, setBgVisible] = useState(false)
  const [solved, setSolved] = useState(false)

  const isLast = photoIdx >= photos.length - 1
  const allDone = solved && isLast
  const phase = allDone ? (isCollected ? 'scroll' : 'collect') : 'hint'

  function onPuzzleSolved() {
    setBgSrc(photos[photoIdx].src)
    setBgVisible(true)
    setSolved(true)
  }

  function goNext() {
    setPhotoIdx(i => i + 1)
    setSolved(false)
  }

  return (
    <section className="relative bg-brown min-h-svh overflow-hidden px-6 pt-16 pb-12 flex flex-col items-center justify-center [scroll-snap-align:start]">

      {/* Foto resolvida aparece como fundo — div estável, sem remount */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ opacity: bgVisible ? 1 : 0 }}
        transition={{ duration: 0.9 }}
      >
        {bgSrc && <img src={bgSrc} alt="" className="w-full h-full object-cover" aria-hidden />}
        <div className="absolute inset-0 bg-brown/72" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-2">
          <p
            className="text-2xl uppercase tracking-[0.12em] text-terracota text-center"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            nossas aventuras continuaram
          </p>
          {photos.length > 1 && (
            <p className="text-xs text-cream/50" style={{ fontFamily: 'var(--font-display)' }}>
              {photoIdx + 1} de {photos.length}
            </p>
          )}
        </div>

        {/* Quebra-cabeça → vista resolvida */}
        <AnimatePresence mode="wait">
          {!solved ? (
            <motion.div
              key={`puzzle-${photoIdx}`}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {photos[photoIdx] ? (
                <Puzzle photo={photos[photoIdx]} onSolved={onPuzzleSolved} />
              ) : (
                <p className="text-cream/40 text-sm text-center" style={{ fontFamily: 'var(--font-display)' }}>
                  adicione fotos em public/photos/03-puzzle/
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`solved-${photoIdx}`}
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Polaroid com a foto montada */}
              <div className="polaroid w-60">
                <img
                  src={photos[photoIdx].src}
                  alt={photos[photoIdx].caption ?? ''}
                  className="h-48 w-full object-cover"
                />
                {photos[photoIdx].caption && (
                  <p
                    className="mt-3 text-center text-sm font-semibold text-brown leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {photos[photoIdx].caption}
                  </p>
                )}
              </div>

              {/* Próxima foto ou coletável */}
              {!isLast ? (
                <motion.button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-terracota text-cream text-sm tracking-wide"
                  style={{ fontFamily: 'var(--font-body)' }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  próxima memória <ChevronRight size={15} strokeWidth={2} />
                </motion.button>
              ) : (
                <CollectibleItem
                  itemId="star"
                  Icon={Star}
                  label="estrela"
                  isCollected={isCollected}
                  onCollect={onCollect}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SectionScrollHint
        phase={phase}
        hintText="monte o quebra-cabeça ✦"
        collectText="colete a estrela"
      />
    </section>
  )
}
