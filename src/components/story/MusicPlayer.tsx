import { useEffect, useRef } from 'react'

interface Props {
  src: string
  play: boolean
}

export function MusicPlayer({ src, play }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (play) {
      audioRef.current?.play().catch(() => {})
    } else {
      audioRef.current?.pause()
    }
  }, [play])

  return <audio ref={audioRef} src={src} loop preload="auto" />
}
