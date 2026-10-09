/**
 * @file App.jsx
 * Root component:
 * - Lenis smooth scroll initialised here, synced to GSAP ScrollTrigger
 * - ScrollTrigger writes section progress to zustand store
 * - Scene chunk loaded lazily via React.lazy + Suspense
 * - Error boundary wraps canvas; falls back to CSS gradient on error
 */

import { useEffect, useRef, Suspense, lazy, Component } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Components
import Nav    from './components/Nav'
import Cursor from './components/Cursor'
import Loader from './components/Loader'

// Sections
import Hero       from './sections/Hero'
import About      from './sections/About'
import Skills     from './sections/Skills'
import Experience from './sections/Experience'
import Projects   from './sections/Projects'
import Contact    from './sections/Contact'

// Data
import { skillGroups, experience } from './data/portfolio'

// Store
import { useScrollStore } from './store/scroll'

// Perf hook
import { usePerfTier } from './hooks/usePerfTier'

// Lazy 3D scene
const SceneRoot = lazy(() => import('./scene/SceneRoot'))

gsap.registerPlugin(ScrollTrigger)

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'contact']

// ── Error boundary for canvas ─────────────────────────────────────────────────
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: false }
  }
  static getDerivedStateFromError() { return { error: true } }
  componentDidCatch(err) { console.error('[Canvas]', err) }
  render() {
    if (this.state.error) {
      return (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 0,
            background: 'radial-gradient(ellipse at 30% 40%, #1a0a3a 0%, #05060a 60%)',
          }}
        />
      )
    }
    return this.props.children
  }
}

// ── Mouse ref shared with 3D scene ────────────────────────────────────────────
function useMouse() {
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return mouse
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const tier    = usePerfTier()
  const mouse   = useMouse()
  const setScroll = useScrollStore(s => s.setScroll)

  // Lenis + ScrollTrigger sync
  useEffect(() => {
    if (tier === 'static') return

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })

    // Sync lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Overall progress trigger
    const overallTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        // Per-section progress
        const sectionProgress = SECTION_IDS.map((id) => {
          const el = document.getElementById(id)
          if (!el) return 0
          const rect   = el.getBoundingClientRect()
          const vh     = window.innerHeight
          const inView = Math.max(0, Math.min(1, (vh - rect.top) / (rect.height + vh)))
          return inView
        })

        const idx = sectionProgress.reduce((best, p, i) => (p > sectionProgress[best] ? i : best), 0)
        setScroll(self.progress, idx, sectionProgress)
      },
    })

    return () => {
      overallTrigger.kill()
      ScrollTrigger.killAll()
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [tier, setScroll])

  const showCanvas = tier !== 'static'

  return (
    <>
      <Cursor />
      <Nav    />

      {/* 3D Canvas — fixed, behind content, aria-hidden */}
      {showCanvas && (
        <CanvasErrorBoundary>
          <Suspense fallback={null}>
            <SceneRoot tier={tier} mouse={mouse} skillGroups={skillGroups} experience={experience} />
          </Suspense>
        </CanvasErrorBoundary>
      )}

      {/* Static fallback gradient when no WebGL */}
      {tier === 'static' && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 0,
            background: 'radial-gradient(ellipse at 30% 40%, #160a3a 0%, #05060a 60%)',
          }}
        />
      )}

      {/* Loader overlay — fades out when 3D is ready */}
      {showCanvas && (
        <Suspense fallback={null}>
          <Loader />
        </Suspense>
      )}

      {/* DOM content — always first-paint */}
      <main id="main-content" className="main-content">
        <header>
          <Hero />
        </header>
        <About      />
        <Skills     />
        <Experience />
        <Projects   />
        <Contact    />
      </main>
    </>
  )
}
