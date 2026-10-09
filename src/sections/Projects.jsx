/**
 * @file sections/Projects.jsx
 * Featured project (Friday AI) with layered architecture visual.
 * Additional projects as tilt cards in a grid.
 * Modal for project details.
 */

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import TiltCard     from '../components/TiltCard'
import Modal        from '../components/Modal'
import SafeLink     from '../components/SafeLink'
import GlassCard    from '../components/GlassCard'
import { projects }  from '../data/portfolio'

// ── Featured: Friday AI ──────────────────────────────────────────────────────
function FridayAICard({ project }) {
  return (
    <motion.div
      className="featured-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <GlassCard className="featured-inner">
        <div className="featured-badge">Featured</div>
        <h3 className="featured-title">{project.title}</h3>
        <p className="featured-desc">{project.description}</p>

        {/* Layered architecture visual (CSS 3D + Framer Motion tilt) */}
        <div className="arch-visual" aria-label="Architecture: React SPA → FastAPI → PostgreSQL">
          {project.architecture.map((layer, i) => (
            <motion.div
              key={layer.layer}
              className="arch-layer"
              style={{
                '--layer-color': layer.color,
                zIndex: project.architecture.length - i,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.15 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Animated data packet */}
              <motion.div
                className="data-packet"
                animate={{ x: ['0%', '90%', '0%'] }}
                transition={{ repeat: Infinity, duration: 2.5 + i * 0.5, ease: 'linear' }}
                aria-hidden="true"
              />
              <span className="arch-label">{layer.tech}</span>
              <span className="arch-sublabel">{layer.layer}</span>
            </motion.div>
          ))}
        </div>

        {/* Highlights */}
        <ul className="featured-highlights">
          {project.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>

        {/* Tech chips */}
        <div className="tech-chips">
          {project.stack.map(t => <span key={t} className="tech-chip">{t}</span>)}
        </div>

        {/* Links */}
        <div className="card-links">
          <SafeLink href={project.github} className="card-link" aria-label={`${project.title} GitHub repository`}>
            <GithubIcon /> GitHub
          </SafeLink>
          <SafeLink href={project.live} className="card-link" aria-label={`${project.title} live demo`}>
            <ExternalLink size={14} /> Live
          </SafeLink>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ── Project Grid Card ─────────────────────────────────────────────────────────
function ProjectCard({ project, onOpen }) {
  const triggerRef = useRef()

  return (
    <TiltCard className="project-card">
      <div className="project-card-body">
        <h3 className="project-title">{project.title}</h3>
        {project.status && (
          <span className={`status-badge status-badge--${project.status.toLowerCase().replace(' ', '-')}`}>
            {project.status}
          </span>
        )}
        <p className="project-desc">{project.description}</p>
        <div className="tech-chips">
          {project.stack.map(t => <span key={t} className="tech-chip">{t}</span>)}
        </div>
      </div>

      <div className="card-links">
        <SafeLink href={project.github} className="card-link" aria-label={`${project.title} on GitHub`}>
          <GithubIcon /> GitHub
        </SafeLink>
        <SafeLink href={project.live} className="card-link" aria-label={`${project.title} live demo`}>
          <ExternalLink size={14} /> Live
        </SafeLink>
        <button
          ref={triggerRef}
          className="card-link"
          onClick={() => onOpen(project, triggerRef)}
          aria-label={`View details for ${project.title}`}
        >
          Details <ArrowRight size={14} />
        </button>
      </div>
    </TiltCard>
  )
}

// ── Inline SVG brand icon ─────────────────────────────────────────────────────
function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

// ── Section ────────────────────────────────────────────────────────────────────
export default function Projects() {
  const [modalProject,  setModalProject]  = useState(null)
  const [modalTrigger,  setModalTrigger]  = useState(null)

  const featured   = projects.find(p => p.featured)
  const additional = projects.filter(p => !p.featured)

  const openModal = (project, triggerRef) => {
    setModalProject(project)
    setModalTrigger(triggerRef)
  }
  const closeModal = () => setModalProject(null)

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="section"
    >
      <SectionTitle id="projects-heading" subtitle="Things I have built">
        Projects
      </SectionTitle>

      {/* Featured */}
      {featured && <FridayAICard project={featured} />}

      {/* Grid */}
      <div className="projects-grid">
        {additional.map(p => (
          <ProjectCard key={p.id} project={p} onOpen={openModal} />
        ))}
      </div>

      {/* Project detail modal */}
      <Modal
        open={!!modalProject}
        onClose={closeModal}
        title={modalProject?.title ?? ''}
        triggerRef={modalTrigger}
      >
        {modalProject && (
          <div className="modal-project-detail">
            <p className="modal-desc">{modalProject.description}</p>
            {modalProject.highlights && (
              <>
                <h4 className="modal-section-label">Highlights</h4>
                <ul className="modal-highlights">
                  {modalProject.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </>
            )}
            <div className="tech-chips mt-4">
              {modalProject.stack.map(t => <span key={t} className="tech-chip">{t}</span>)}
            </div>
            <div className="card-links mt-4">
              <SafeLink href={modalProject.github} className="btn-secondary" aria-label="GitHub repository">
                <GithubIcon /> GitHub
              </SafeLink>
              <SafeLink href={modalProject.live} className="btn-primary" aria-label="Live demo">
                <ExternalLink size={14} /> Live Demo
              </SafeLink>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
