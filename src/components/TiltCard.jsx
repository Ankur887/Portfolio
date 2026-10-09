/**
 * @file components/TiltCard.jsx
 * Card with pointer-driven 3D tilt, lift shadow, and glow on hover/focus.
 * Uses Framer Motion. Reduced motion: tilt disabled.
 *
 * @param {{ children: React.ReactNode, className?: string }} props
 */

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const SPRING = { stiffness: 250, damping: 25 }
const MAX_TILT = 12  // degrees

export default function TiltCard({ children, className = '', ...rest }) {
  const reduced = useReducedMotion()
  const ref     = useRef()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotX = useSpring(rawX, SPRING)
  const rotY = useSpring(rawY, SPRING)

  const handleMove = useCallback((e) => {
    if (reduced || !ref.current) return
    const rect   = ref.current.getBoundingClientRect()
    const cx     = rect.left + rect.width  / 2
    const cy     = rect.top  + rect.height / 2
    const dx     = (e.clientX - cx) / (rect.width  / 2)
    const dy     = (e.clientY - cy) / (rect.height / 2)
    rawY.set( dx * MAX_TILT)
    rawX.set(-dy * MAX_TILT)
  }, [reduced, rawX, rawY])

  const handleLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ scale: { duration: 0.2 } }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
