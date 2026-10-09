/**
 * @file sections/About.jsx
 */

import { motion } from 'framer-motion'
import SectionTitle  from '../components/SectionTitle'
import GlassCard     from '../components/GlassCard'
import CodolioCard   from '../components/CodolioCard'
import { identity, education } from '../data/portfolio'
import { GraduationCap, MapPin, Calendar } from 'lucide-react'

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section"
    >
      <SectionTitle id="about-heading" subtitle="Who I am & where I come from">
        About
      </SectionTitle>

      <div className="about-grid">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="about-card">
            <h3 className="card-label">Summary</h3>
            <p className="about-summary">{identity.summary}</p>

            {/* Decorative neural node row */}
            <div className="about-nodes" aria-hidden="true">
              {['React', 'FastAPI', 'LLMs', 'PostgreSQL'].map(t => (
                <span key={t} className="node-chip">{t}</span>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard className="about-card">
            <h3 className="card-label">Education</h3>
            <ul className="education-list" aria-label="Education history">
              {education.map(edu => (
                <li key={edu.id} className="education-item">
                  <GraduationCap size={18} className="edu-icon" aria-hidden="true" />
                  <div>
                    <div className="edu-degree">{edu.degree}</div>
                    <div className="edu-meta">
                      <span>{edu.institution}</span>
                      {edu.location && (
                        <><MapPin size={12} aria-hidden="true" /><span>{edu.location}</span></>
                      )}
                    </div>
                    <div className="edu-period">
                      <Calendar size={12} aria-hidden="true" />
                      <span>{edu.period}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>

      {/* Codolio stats card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ marginTop: '1.5rem' }}
      >
        <CodolioCard />
      </motion.div>
    </section>
  )
}
