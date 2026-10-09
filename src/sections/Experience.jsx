/**
 * @file sections/Experience.jsx
 * Vertical timeline. Active item updates via scroll position.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/SectionTitle'
import GlassCard    from '../components/GlassCard'
import { experience } from '../data/portfolio'
import { Briefcase, MapPin, Calendar } from 'lucide-react'

export default function Experience() {
  const [activeId, setActiveId] = useState(experience[0]?.id)

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="section"
    >
      <SectionTitle id="experience-heading" subtitle="Professional & community experience">
        Experience
      </SectionTitle>

      <div className="experience-timeline" role="list">
        {experience.map((item, i) => (
          <motion.div
            key={item.id}
            role="listitem"
            className={`timeline-item ${activeId === item.id ? 'timeline-item--active' : ''}`}
            data-exp-id={item.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            onViewportEnter={() => setActiveId(item.id)}
          >
            {/* Timeline connector */}
            <div className="timeline-connector" aria-hidden="true">
              <div className="timeline-dot" />
              {i < experience.length - 1 && <div className="timeline-line" />}
            </div>

            {/* Content card */}
            <GlassCard className="timeline-card">
              <div className="timeline-header">
                <Briefcase size={16} className="timeline-icon" aria-hidden="true" />
                <h3 className="timeline-role">{item.role}</h3>
              </div>
              <div className="timeline-meta">
                <span className="timeline-company">{item.company}</span>
                {item.type && (
                  <><MapPin size={12} aria-hidden="true" /><span>{item.type}</span></>
                )}
                <Calendar size={12} aria-hidden="true" />
                <span>{item.period}</span>
              </div>
              <ul className="timeline-bullets" aria-label={`${item.role} at ${item.company} responsibilities`}>
                {item.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
