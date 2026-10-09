/**
 * @file sections/Skills.jsx
 * Accessibility: real grouped <ul> in DOM. On mobile, shown as chip grid.
 * On desktop, the 3D constellation is the primary UI.
 */

import { motion } from 'framer-motion'
import SectionTitle  from '../components/SectionTitle'
import { skillGroups } from '../data/portfolio'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function Skills() {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="section"
    >
      <SectionTitle id="skills-heading" subtitle="Technologies and disciplines I work with">
        Skills
      </SectionTitle>

      {/* Accessible skill list (visible on mobile, visually-hidden on desktop behind 3D) */}
      <div className={isMobile ? 'skills-chips-grid' : 'skills-list-desktop'}>
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.label}
            className="skill-group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: gi * 0.07 }}
          >
            <h3
              className="skill-group-label"
              style={{ color: group.color }}
            >
              {group.label}
            </h3>
            <ul className="skill-items" aria-label={`${group.label} skills`}>
              {group.items.map(item => (
                <li key={item.name}>
                  <span
                    className="skill-chip"
                    style={{ borderColor: `${group.color}55` }}
                    data-skill={item.name}
                  >
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
