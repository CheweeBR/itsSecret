import { useState } from 'react'
import { story } from '../data/story'
import { HeroSection } from '../components/story/HeroSection'
import { CounterSection } from '../components/story/CounterSection'
import { DateSection } from '../components/story/DateSection'
import { MomentCard } from '../components/story/MomentCard'
import { PhraseSection } from '../components/story/PhraseSection'
import { QuestionSection } from '../components/story/QuestionSection'
import { ConfettiOverlay } from '../components/story/ConfettiOverlay'

export default function Story() {
  const [showSurprise, setShowSurprise] = useState(false)

  const { girlfriend, startDate, startDateLabel, moments, phrases, surpriseMessage } = story

  // Intercala momentos e frases: momento, frase, momento, frase, ...
  const interleaved = moments.flatMap((moment, i) => {
    const elements: React.ReactNode[] = [
      <MomentCard key={`moment-${moment.id}`} moment={moment} index={i} />,
    ]
    if (phrases[i]) {
      elements.push(
        <PhraseSection key={`phrase-${i}`} phrase={phrases[i]} index={i} />,
      )
    }
    return elements
  })

  // Frases extras que sobraram após os momentos
  if (phrases.length > moments.length) {
    phrases.slice(moments.length).forEach((phrase, i) => {
      interleaved.push(
        <PhraseSection
          key={`phrase-extra-${i}`}
          phrase={phrase}
          index={moments.length + i}
        />,
      )
    })
  }

  return (
    <main className="bg-cream">
      <HeroSection name={girlfriend} />
      <CounterSection startDate={startDate} />
      <DateSection dateLabel={startDateLabel} />
      {interleaved}
      <QuestionSection onYes={() => setShowSurprise(true)} />
      <ConfettiOverlay
        open={showSurprise}
        onClose={() => setShowSurprise(false)}
        name={girlfriend}
        message={surpriseMessage}
      />
    </main>
  )
}
