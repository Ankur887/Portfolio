/**
 * @file components/SectionTitle.jsx
 * Animates in once on scroll with Framer Motion whileInView.
 * Reduced motion: renders without animation.
 *
 * @param {{ children: React.ReactNode, subtitle?: string, id?: string }} props
 */

import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

export default function SectionTitle({ children, subtitle, id }) {
  const reduced = useReducedMotion()

  const variants = {
    hidden: { opacity: 0, y: 32 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <motion.div
      className="section-title-wrapper"
      initial={reduced ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
    >
      <h2 id={id} className="section-title">{children}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      <div className="title-underline" aria-hidden="true" />
    </motion.div>
  )
}
