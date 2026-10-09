/**
 * @file components/Cursor.jsx
 * Custom cursor: small dot + glow trail via rAF lerp.
 * Only shown on desktop with fine pointer.
 * Native cursor shown over inputs/text.
 * Disabled when prefers-reduced-motion is set.
 */

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function Cursor() {
  const reduced    = useReducedMotion()
  const isFine     = useMediaQuery('(pointer: fine)')
  const dotRef     = useRef()
  const trailRef   = useRef()
  const pos        = useRef({ x: -100, y: -100 })
  const trail      = useRef({ x: -100, y: -100 })
  const rafRef     = useRef()

  useEffect(() => {
    if (reduced || !isFine) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      // Lerp trail toward cursor
      trail.current.x += (pos.current.x - trail.current.x) * 0.12
      trail.current.y += (pos.current.y - trail.current.y) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trail.current.x - 12}px, ${trail.current.y - 12}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [reduced, isFine])

  if (reduced || !isFine) return null

  return (
    <>
      <div ref={dotRef}   className="cursor-dot"   aria-hidden="true" />
      <div ref={trailRef} className="cursor-trail"  aria-hidden="true" />
    </>
  )
}
