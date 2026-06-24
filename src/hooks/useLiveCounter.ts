import { useEffect, useState } from 'react'

interface Counter {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calc(startDate: Date): Counter {
  const diff = Math.max(0, Date.now() - startDate.getTime())
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

export function useLiveCounter(startDate: Date): Counter {
  const [counter, setCounter] = useState<Counter>(() => calc(startDate))

  useEffect(() => {
    const id = setInterval(() => setCounter(calc(startDate)), 1000)
    return () => clearInterval(id)
  }, [startDate])

  return counter
}
