import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2000 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ''))
    const start = performance.now()

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(eased * numeric)
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [inView, value, duration])

  const formatted = Number.isInteger(parseFloat(value))
    ? Math.round(display).toLocaleString('de-DE')
    : display.toFixed(1)

  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
