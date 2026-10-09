/**
 * @file hooks/usePerfTier.js
 * @description Detects device capability and returns a performance tier.
 * @returns {'high' | 'low' | 'static'}
 *
 * Tier criteria:
 *   static  — prefers-reduced-motion OR no WebGL support
 *   low     — coarse pointer OR width<768 OR hardwareConcurrency≤4
 *             OR deviceMemory≤4 OR saveData=true
 *   high    — everything else
 */

import { useMemo } from 'react'

/** Check WebGL availability without creating a persistent context */
function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

/**
 * @returns {'high' | 'low' | 'static'}
 */
export function usePerfTier() {
  return useMemo(() => {
    // 1. Reduced motion → static (no camera travel at all)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'

    // 2. No WebGL → static (CSS gradient fallback)
    if (!hasWebGL()) return 'static'

    // 3. Aggregate low-end signals
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const narrowViewport = window.innerWidth < 768
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4
    const lowMemory = (navigator.deviceMemory ?? 8) <= 4
    const saveData = navigator.connection?.saveData === true

    const lowSignals = [coarsePointer, narrowViewport, lowCores, lowMemory, saveData]
    const lowCount = lowSignals.filter(Boolean).length

    // Two or more low signals → low tier
    if (lowCount >= 2) return 'low'

    return 'high'
  }, []) // Computed once at mount; page reload picks up any changes
}
