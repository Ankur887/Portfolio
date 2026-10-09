/**
 * @file components/Loader.jsx
 * Loading screen with progress bar (drei useProgress).
 * Minimum display time of 800ms.
 * Fades out on completion.
 * Hero DOM content is rendered behind it immediately.
 */

import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

const MIN_DISPLAY_MS = 800
const MAX_DISPLAY_MS = 5000   // fallback: always dismiss after 5 s

export default function Loader() {
  const { progress, errors } = useProgress()
  const [visible, setVisible] = useState(true)
  const [minMet, setMinMet] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinMet(true), MIN_DISPLAY_MS)
    return () => clearTimeout(t)
  }, [])

  // Dismiss when fully loaded + min time met
  useEffect(() => {
    if (progress >= 100 && minMet) {
      setVisible(false)
    }
  }, [progress, minMet])

  // Hard fallback: dismiss no matter what after MAX_DISPLAY_MS
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), MAX_DISPLAY_MS)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loader-overlay"
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
          aria-label="Loading portfolio"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="loader-inner">
            {/* Logo / identity */}
            <div className="loader-name">ANKUR</div>

            {/* Progress track */}
            <div className="loader-track" aria-hidden="true">
              <motion.div
                className="loader-fill"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
            </div>

            <div className="loader-pct" aria-hidden="true">
              {errors.length > 0
                ? 'Some assets failed to load'
                : `${Math.round(progress)}%`}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
