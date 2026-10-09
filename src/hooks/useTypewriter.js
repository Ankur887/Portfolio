/**
 * @file hooks/useTypewriter.js
 * Cycles through an array of strings with a typewriter effect.
 * Respects prefers-reduced-motion: returns the first string statically.
 *
 * @param {string[]} strings
 * @param {{ typeSpeed?: number, deleteSpeed?: number, pauseMs?: number }} [opts]
 * @returns {{ display: string, isTyping: boolean }}
 */

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useTypewriter(strings, opts = {}) {
  const { typeSpeed = 60, deleteSpeed = 30, pauseMs = 1800 } = opts
  const reduced = useReducedMotion()

  const [display, setDisplay] = useState(strings[0] ?? '')
  const [isTyping, setIsTyping] = useState(false)

  const stateRef = useRef({
    strIndex: 0,
    charIndex: 0,
    deleting: false,
  })

  useEffect(() => {
    if (reduced) {
      setDisplay(strings[0] ?? '')
      return
    }

    let raf
    let timeout

    function tick() {
      const s = stateRef.current
      const current = strings[s.strIndex]

      if (!s.deleting) {
        // Typing forward
        if (s.charIndex < current.length) {
          s.charIndex++
          setDisplay(current.slice(0, s.charIndex))
          setIsTyping(true)
          timeout = setTimeout(tick, typeSpeed)
        } else {
          // Pause at full word before deleting
          setIsTyping(false)
          timeout = setTimeout(() => {
            s.deleting = true
            tick()
          }, pauseMs)
        }
      } else {
        // Deleting backwards
        if (s.charIndex > 0) {
          s.charIndex--
          setDisplay(current.slice(0, s.charIndex))
          setIsTyping(true)
          timeout = setTimeout(tick, deleteSpeed)
        } else {
          // Move to next string
          s.deleting = false
          s.strIndex = (s.strIndex + 1) % strings.length
          setIsTyping(false)
          timeout = setTimeout(tick, 300)
        }
      }
    }

    timeout = setTimeout(tick, 600)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [strings, reduced, typeSpeed, deleteSpeed, pauseMs])

  return { display, isTyping }
}
