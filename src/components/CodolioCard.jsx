/**
 * @file components/CodolioCard.jsx
 * Displays Codolio profile stats: questions solved, active days,
 * coding platform badges, and skill tags.
 * Entire card links to the live Codolio profile.
 */

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const CODOLIO_URL  = 'https://codolio.com/profile/Ankur5511'
const CODOLIO_USER = '@Ankur5511'
const CODOLIO_NAME = 'Ankur Kumar'

const stats = [
  { label: 'Questions Solved', value: '676', color: 'var(--cyan)'    },
  { label: 'Active Days',      value: '392', color: 'var(--violet)'  },
]

/* Platform SVG icons */
const GFGIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-1.104-.695 4.47 4.47 0 0 1-.79-1.007 3.96 3.96 0 0 1 0-3.474 4.46 4.46 0 0 1 .79-1.006 3.79 3.79 0 0 1 1.104-.695 4.51 4.51 0 0 1 3.116-.017c.42.159.8.391 1.104.695.215.214.402.458.543.726L23 9.762a5.86 5.86 0 0 0-.764-1.065A5.2 5.2 0 0 0 20.716 7.7a6.15 6.15 0 0 0-4.343-.016 5.37 5.37 0 0 0-1.677 1.031 5.63 5.63 0 0 0-1.12 1.53 4.87 4.87 0 0 0 0 4.188 5.62 5.62 0 0 0 1.12 1.531 5.37 5.37 0 0 0 1.677 1.031 6.15 6.15 0 0 0 4.343-.016 5.2 5.2 0 0 0 1.52-.988c.286-.27.537-.576.748-.912l-1.534-1.744zM0 12.03c0 .276.044.547.13.804H1.5c-.064-.257-.098-.526-.098-.804 0-.267.03-.525.088-.773H.133A3.97 3.97 0 0 0 0 12.03zm10.926 0a3.7 3.7 0 0 1-.112.905H9.338a2.84 2.84 0 0 0 0-1.81h1.476c.074.293.112.598.112.905zM5.463 9.762c.563 0 1.104.195 1.53.554l1.109-1.266A3.91 3.91 0 0 0 5.463 8c-1.07 0-2.067.44-2.788 1.22L3.84 10.61a2.85 2.85 0 0 1 1.623-.848zm0 4.536c-.61 0-1.17-.23-1.603-.612L2.695 14.95A3.91 3.91 0 0 0 5.463 16c1.07 0 2.066-.44 2.787-1.22l-1.164-1.39a2.86 2.86 0 0 1-1.623.908z"/>
  </svg>
)
const LeetCodeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
  </svg>
)
const CodeChefIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.257.004C5.06.164-.076 5.48 0 11.677c.077 6.196 5.303 11.25 11.5 11.323C17.7 23.073 23 17.923 23 11.726 23 5.385 17.677.004 11.257.004zm-.234 5.45c.21 0 .42.017.627.05a3.12 3.12 0 0 1 1.884.954c.234.264.418.573.504.918.084.346.045.73-.122 1.035a2.05 2.05 0 0 1-.744.783c-.3.174-.653.27-1.004.27-.56 0-1.104-.214-1.504-.6a2.022 2.022 0 0 1-.586-1.402c0-.53.215-1.063.59-1.44.35-.35.842-.566 1.355-.568zm4.578 3.156c.63 0 1.195.352 1.506.862.176.294.262.645.218.994-.05.35-.225.688-.492.927-.266.24-.614.39-.97.39-.47 0-.93-.212-1.24-.577a1.727 1.727 0 0 1-.38-1.025c-.02-.38.098-.758.31-1.062.258-.376.66-.51 1.048-.509zm-9.105.016c.378 0 .75.126 1.044.358.294.232.513.56.6.92.088.36.04.754-.136 1.07a1.711 1.711 0 0 1-.796.74 1.7 1.7 0 0 1-1.03.082 1.773 1.773 0 0 1-.87-.522 1.72 1.72 0 0 1-.43-.906 1.75 1.75 0 0 1 .17-1.008c.195-.37.517-.664.904-.8.178-.063.364-.094.544-.934zM12 13.15c1.37 0 2.704.26 3.87.787 1.165.527 2.14 1.29 2.756 2.21H5.374c.616-.92 1.59-1.683 2.756-2.21A9.406 9.406 0 0 1 12 13.151z"/>
  </svg>
)

const platforms = [
  { name: 'GeeksForGeeks', color: '#2f8d46', Icon: GFGIcon  },
  { name: 'LeetCode',      color: '#FFA116', Icon: LeetCodeIcon },
  { name: 'CodeChef',      color: '#A07850', Icon: CodeChefIcon },
]

const tags = ['#JAVA', '#C++', '#C', '#RUST', '#NEWBIE', '#CP']

function AnimatedStat({ value, label, color, delay = 0 }) {
  return (
    <motion.div
      className="codolio-stat"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <span className="codolio-stat-label">{label}</span>
      <motion.span
        className="codolio-stat-value"
        style={{ color }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
      >
        {value}
      </motion.span>
    </motion.div>
  )
}

export default function CodolioCard() {
  return (
    <motion.a
      href={CODOLIO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="codolio-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
      whileHover={{ scale: 1.015 }}
      aria-label={`View ${CODOLIO_NAME}'s Codolio profile`}
    >
      {/* Header */}
      <div className="codolio-header">
        <div className="codolio-brand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          <span className="codolio-logo-text">codolio</span>
        </div>
        <ExternalLink size={14} className="codolio-ext-icon" aria-hidden="true" />
      </div>

      {/* Identity */}
      <div className="codolio-identity">
        <div className="codolio-avatar" aria-hidden="true">AK</div>
        <div>
          <div className="codolio-name">
            {CODOLIO_NAME}
            {/* verified checkmark */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--cyan)" aria-label="Verified" style={{ display:'inline', marginLeft:'5px', verticalAlign:'middle' }}>
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" fill="none" stroke="var(--cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="codolio-username">{CODOLIO_USER}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="codolio-stats">
        {stats.map((s, i) => (
          <AnimatedStat key={s.label} {...s} delay={i * 0.1} />
        ))}
      </div>

      {/* Platform icons */}
      <div className="codolio-platforms-row">
        <span className="codolio-find-label">You can find me on</span>
        <div className="codolio-platforms">
          {platforms.map(({ name, color, Icon }) => (
            <span key={name} className="codolio-platform-icon" style={{ color }} title={name} aria-label={name}>
              <Icon />
            </span>
          ))}
        </div>
      </div>

      {/* Skill tags */}
      <div className="codolio-tags" aria-label="Skill tags">
        {tags.map(tag => (
          <span key={tag} className="codolio-tag">{tag}</span>
        ))}
      </div>
    </motion.a>
  )
}
