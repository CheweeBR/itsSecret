import { useState, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { story } from '../data/story'
import { IntroModal } from '../components/story/IntroModal'
import { HeroSection } from '../components/story/HeroSection'
import { CounterSection } from '../components/story/CounterSection'
import { DateSection } from '../components/story/DateSection'
import { SwipeCardsSection } from '../components/story/SwipeCardsSection'
import { WhatsAppSection } from '../components/story/WhatsAppSection'
import { AdventureSection } from '../components/story/AdventureSection'
import { SnapchatSection } from '../components/story/SnapchatSection'
import { MissoshiroSection } from '../components/story/MissoshiroSection'
import { FutureSection } from '../components/story/FutureSection'
import { LockGateSection } from '../components/story/LockGateSection'
import { QuestionSection } from '../components/story/QuestionSection'
import { InventoryHUD } from '../components/story/InventoryHUD'
import { FinaleSection } from '../components/story/FinaleSection'
import { MusicPlayer } from '../components/story/MusicPlayer'

export default function Story() {
  const [started, setStarted] = useState(false)
  const [saidYes, setSaidYes] = useState(false)
  const [inventory, setInventory] = useState<Set<string>>(new Set())
  const allCollected = inventory.size >= 4
  const questionRef = useRef<HTMLElement>(null)
  const finaleRef = useRef<HTMLDivElement>(null)

  // Bloqueia scroll enquanto o modal está aberto e, ao iniciar, garante que a
  // experiência comece no topo (evita saltar para a posição de scroll restaurada
  // de uma sessão anterior quando o overflow é liberado).
  useEffect(() => {
    if (started) {
      document.documentElement.style.overflow = ''
      window.scrollTo(0, 0)
    } else {
      document.documentElement.style.overflow = 'hidden'
    }
    return () => { document.documentElement.style.overflow = '' }
  }, [started])

  function collect(itemId: string) {
    setInventory(prev => new Set([...prev, itemId]))
  }

  // DEV ONLY — botão para coletar todas as recompensas de uma vez (remover antes de publicar)
  function collectAll() {
    setInventory(new Set(['compass', 'star', 'pawprint', 'key']))
  }

  // Quando todos os itens forem coletados, scroll suave para a pergunta final
  useEffect(() => {
    if (!allCollected) return
    const timer = setTimeout(() => {
      questionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 1400)
    return () => clearTimeout(timer)
  }, [allCollected])

  // Depois do "Sim", arrasta suavemente para baixo até o gran finale
  useEffect(() => {
    if (!saidYes) return
    const timer = setTimeout(() => {
      finaleRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 250)
    return () => clearTimeout(timer)
  }, [saidYes])

  const {
    girlfriend,
    startDate,
    firstPhoto,
    datePhotos,
    whatsappStats,
    adventurePhotos,
    snapchatStreak,
    missoshiroPhotos,
    futurePhotos,
    musicSrc,
    finalMessage,
    rewardPhrase,
    showDevCollectAll,
  } = story

  return (
    <>
      <AnimatePresence>
        {!started && <IntroModal onStart={() => setStarted(true)} />}
      </AnimatePresence>

      <main className="bg-cream overflow-x-hidden">
      {import.meta.env.DEV && showDevCollectAll && (
        <button
          type="button"
          onClick={collectAll}
          className="fixed bottom-4 left-4 z-[100] rounded-full bg-brown px-4 py-2 text-xs font-bold uppercase tracking-wider text-cream shadow-lg active:scale-95"
        >
          DEV: coletar tudo
        </button>
      )}
      <MusicPlayer src={musicSrc} play={started} />
      <InventoryHUD inventory={inventory} />

      <HeroSection name={girlfriend} />
      <CounterSection startDate={startDate} />
      <DateSection photo={firstPhoto} />
      <SwipeCardsSection
        photos={datePhotos}
        isCollected={inventory.has('compass')}
        onCollect={collect}
      />
      <WhatsAppSection stats={whatsappStats} />
      <AdventureSection
        photos={adventurePhotos}
        isCollected={inventory.has('star')}
        onCollect={collect}
      />
      <SnapchatSection streak={snapchatStreak} />
      <MissoshiroSection
        photos={missoshiroPhotos}
        isCollected={inventory.has('pawprint')}
        onCollect={collect}
      />
      <FutureSection
        photos={futurePhotos}
        isCollected={inventory.has('key')}
        onCollect={collect}
      />

      <LockGateSection inventory={inventory} allCollected={allCollected} />

      <QuestionSection
        ref={questionRef}
        style={{ display: allCollected ? undefined : 'none' }}
        onYes={() => setSaidYes(true)}
      />

      {saidYes && (
        <FinaleSection
          ref={finaleRef}
          finalMessage={finalMessage}
          rewardPhrase={rewardPhrase}
        />
      )}
      </main>
    </>
  )
}
