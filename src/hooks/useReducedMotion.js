/**
 * @file hooks/useReducedMotion.js
 * Reactive hook that tracks prefers-reduced-motion.
 * @returns {boolean}
 */

import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  const [reduced, setReduced] = useState(mql.matches)

  useEffect(() => {
    const handler = (e) => setReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return reduced
}
