import { useEffect, useRef, useState } from 'react'

type Direction = 'up' | 'left' | 'right' | 'none'

interface Options {
  direction?: Direction
  delay?: number
  threshold?: number
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: Options = {},
) {
  const { direction = 'up', delay = 0, threshold = 0.15 } = options
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const initial: Record<Direction, string> = {
    up:    'translate-y-10 opacity-0',
    left:  '-translate-x-10 opacity-0',
    right: 'translate-x-10 opacity-0',
    none:  'opacity-0',
  }

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined

  const className = `transition-all duration-700 ease-out ${
    visible ? 'translate-x-0 translate-y-0 opacity-100' : initial[direction]
  }`

  return { ref, className, style }
}
