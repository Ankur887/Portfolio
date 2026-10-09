/**
 * @file components/Nav.jsx
 * Fixed navigation with:
 * - Section dot buttons (aria-label + aria-current)
 * - Thin scroll progress bar at the top
 * Reads active section from zustand store.
 */

import { useScrollStore } from '../store/scroll'

const SECTIONS = [
  { id: 'hero',       label: 'Hero' },
  { id: 'about',      label: 'About' },
  { id: 'skills',     label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects' },
  { id: 'contact',    label: 'Contact' },
]

export default function Nav() {
  const sectionIndex = useScrollStore(s => s.sectionIndex)
  const progress     = useScrollStore(s => s.progress)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />

      {/* Section dots nav */}
      <nav className="dots-nav" aria-label="Section navigation">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`dot-btn ${sectionIndex === i ? 'dot-btn--active' : ''}`}
            aria-label={`Navigate to ${s.label}`}
            aria-current={sectionIndex === i ? 'true' : undefined}
            onClick={() => scrollTo(s.id)}
          />
        ))}
      </nav>
    </>
  )
}
