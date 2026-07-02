import { useEffect, useState } from 'react'

/**
 * Anima um número de 0 até `target` quando `isVisible` fica true.
 * Usa easing "ease-out cubic" (mesma sensação da contagem do WhatsApp).
 * Ideal para valores estáticos (nº de mensagens, foguinhos, etc.).
 */
export function useCountUp(
  target: number,
  isVisible: boolean,
  delay = 0,
  duration = 1800,
) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!isVisible) return
    const startTime = performance.now()
    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setDisplay(Math.round((1 - Math.pow(1 - progress, 3)) * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    const timer = setTimeout(() => requestAnimationFrame(tick), delay)
    return () => clearTimeout(timer)
  }, [isVisible, target, delay, duration])
  return display
}

/**
 * Retorna um progresso 0 → 1 (com o mesmo easing) quando `isVisible` fica true.
 * Útil para animar valores que mudam ao vivo (contador de dias/horas): basta
 * multiplicar o valor atual por esse progresso. Ao terminar (progress = 1) o
 * valor exibido volta a ser exatamente o valor ao vivo e continua atualizando.
 */
export function useCountUpProgress(
  isVisible: boolean,
  delay = 0,
  duration = 1800,
) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!isVisible) return
    const startTime = performance.now()
    function tick(now: number) {
      const elapsed = now - startTime
      const p = Math.min(elapsed / duration, 1)
      setProgress(1 - Math.pow(1 - p, 3))
      if (p < 1) requestAnimationFrame(tick)
    }
    const timer = setTimeout(() => requestAnimationFrame(tick), delay)
    return () => clearTimeout(timer)
  }, [isVisible, delay, duration])
  return progress
}
