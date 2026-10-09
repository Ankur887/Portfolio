/**
 * @file sections/Hero.jsx
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Typewriter from '../components/Typewriter'
import SafeLink   from '../components/SafeLink'
import { identity } from '../data/portfolio'

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="hero-section"
    >
      {/* Visually hidden h1 — the 3D text is decorative */}
      <h1 id="hero-heading" className="sr-only">{identity.name}</h1>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      >
        {/* Visual name — decorative, backed by the real h1 above */}
        <div className="hero-name" aria-hidden="true">{identity.name}</div>

        {/* Typewriter subtitle */}
        <div className="hero-subtitle">
          <Typewriter strings={identity.roles} />
        </div>

        {/* Summary */}
        <p className="hero-summary">{identity.summary}</p>

        {/* CTAs */}
        <div className="hero-ctas">
          <button
            className="btn-primary"
            onClick={scrollToProjects}
            aria-label="Scroll to Projects section"
          >
            View Projects
          </button>

          <SafeLink
            href="/resume.pdf"
            download
            className="btn-secondary"
            aria-label="Download Ankur's resume as PDF"
          >
            Download Resume
          </SafeLink>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="scroll-hint"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}
