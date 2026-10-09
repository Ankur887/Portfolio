/**
 * @file portfolio.js
 * @description Single source of truth for all portfolio content.
 * Edit this file to update copy, links, and project details.
 */

// ─── Types (JSDoc) ───────────────────────────────────────────────────────────

/**
 * @typedef {Object} SkillGroup
 * @property {string} label
 * @property {string} color  - CSS hex for 3D node glow
 * @property {SkillItem[]} items
 */

/**
 * @typedef {Object} SkillItem
 * @property {string} name
 * @property {string} [short]  - Abbreviated label for 3D node billboards
 */

/**
 * @typedef {Object} ExperienceItem
 * @property {string} id
 * @property {string} role
 * @property {string} company
 * @property {string} type
 * @property {string} period
 * @property {string[]} bullets
 */

/**
 * @typedef {Object} ProjectItem
 * @property {string} id
 * @property {string} title
 * @property {string} status
 * @property {string} description
 * @property {string[]} stack  - Tech chip labels // VERIFY each project stack
 * @property {string} github
 * @property {string} live
 * @property {boolean} [featured]
 * @property {string[]} [highlights]
 */

/**
 * @typedef {Object} ContactLink
 * @property {string} id
 * @property {string} label
 * @property {string} href
 * @property {string} icon  - Icon key: 'email' | 'phone' | 'github' | 'linkedin' | 'codolio'
 */

// ─── Identity ─────────────────────────────────────────────────────────────────

export const identity = {
  name: 'Ankur',
  roles: ['Full Stack Developer', 'AI Engineer', 'Software Developer'],
  summary:
    'Full Stack Developer and AI/ML Engineer who builds end-to-end systems spanning FastAPI/Django backends, React frontends, and LLM-powered features, with a strong foundation in DSA and core CS fundamentals.',
}

// ─── Education ────────────────────────────────────────────────────────────────

export const education = [
  {
    id: 'btech',
    degree: 'B.Tech in Computer Science, AI & Machine Learning',
    institution: 'Sharda University',
    location: 'Greater Noida',
    period: '2024 – 2028 (Pursuing)',
  },
  {
    id: 'class12',
    degree: 'Class XII (PCM)',
    institution: 'NLK Inter College',
    location: '',
    period: '2023',
  },
  {
    id: 'class10',
    degree: 'Class X',
    institution: 'NLK Inter College',
    location: '',
    period: '2021',
  },
]

// ─── Skills ───────────────────────────────────────────────────────────────────

/** @type {SkillGroup[]} */
export const skillGroups = [
  {
    label: 'Languages',
    color: '#22d3ee',
    items: [
      { name: 'Python' },
      { name: 'JavaScript' },
      { name: 'HTML5' },
      { name: 'CSS3' },
      { name: 'SQL' },
    ],
  },
  {
    label: 'Full Stack',
    color: '#8b5cf6',
    items: [
      { name: 'React.js', short: 'React' },
      { name: 'FastAPI' },
      { name: 'Django' },
      { name: 'REST APIs' },
      { name: 'JWT Authentication', short: 'JWT Auth' },
      { name: 'Tailwind CSS', short: 'Tailwind' },
      { name: 'Responsive Design', short: 'Responsive' },
    ],
  },
  {
    label: 'AI / ML',
    color: '#fbbf24',
    items: [
      { name: 'Scikit-Learn', short: 'Sklearn' },
      { name: 'TensorFlow' },
      { name: 'PyTorch-style DL workflows', short: 'PyTorch' },
      { name: 'Transformers' },
      { name: 'LLM Orchestration (Groq, Ollama)', short: 'LLM Orch.' },
      { name: 'Prompt Engineering', short: 'Prompting' },
      { name: 'Computer Vision', short: 'CV' },
    ],
  },
  {
    label: 'Data & Systems',
    color: '#22d3ee',
    items: [
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
      { name: 'SQLite' },
      { name: 'SQLAlchemy' },
      { name: 'Database Design', short: 'DB Design' },
      { name: 'System Design Fundamentals', short: 'Sys Design' },
    ],
  },
  {
    label: 'Core CS',
    color: '#8b5cf6',
    items: [
      { name: 'Data Structures & Algorithms', short: 'DSA' },
      { name: 'Operating Systems', short: 'OS' },
      { name: 'Computer Networks', short: 'CN' },
      { name: 'Computer Organization & Architecture', short: 'COA' },
      { name: 'DBMS' },
    ],
  },
  {
    label: 'Math for ML',
    color: '#fbbf24',
    items: [
      { name: 'Linear Algebra', short: 'Lin. Alg.' },
      { name: 'Probability & Statistics', short: 'Stats' },
    ],
  },
]

// ─── Experience ───────────────────────────────────────────────────────────────

/** @type {ExperienceItem[]} */
export const experience = [
  {
    id: 'coincent',
    role: 'AI Engineer Intern',
    company: 'Coincent.ai',
    type: 'Remote',
    period: 'Feb 2025 – Aug 2025',
    bullets: [
      'Built and evaluated supervised learning models with Scikit-Learn and TensorFlow across the full pipeline, from preprocessing to training and evaluation.',
      'Integrated LLMs and Transformer architectures via Ollama, with exposure to prompt design and model orchestration in a remote, asynchronous team.',
    ],
  },
  {
    id: 'datama',
    role: 'React + AI Developer Intern',
    company: 'Datama.in',
    type: 'On-site',
    period: 'Dec 2024 – Feb 2025',
    bullets: [
      'Developed "AI Study Buddy" with React and Tailwind CSS, an interactive learning tool for study material and coding problems.',
      'Strengthened component-driven frontend architecture and utility-first styling.',
    ],
  },
  {
    id: 'dart',
    role: 'Technical Organizer',
    company: 'DART Workshop (Drones & Robotics)',
    type: '',
    period: '2024',
    bullets: [
      'Co-organized a hands-on workshop where students built working drones, robots, and RC cars.',
      'Managed technical logistics and mentored participants through assembly and troubleshooting.',
    ],
  },
  {
    id: 'cosmic',
    role: 'Team Member',
    company: 'Cosmic Space Explorers',
    type: '',
    period: '3 months',
    bullets: [
      'Collaborated with a cross-functional team on space-technology projects and technical design reviews.',
    ],
  },
]

// ─── Projects ─────────────────────────────────────────────────────────────────

/** @type {ProjectItem[]} */
export const projects = [
  {
    id: 'friday-ai',
    title: 'Friday AI — Career Intelligence Platform',
    status: 'Ongoing',
    description:
      'Full-stack AI career platform with an interview engine, ATS resume analyser, and persistent AI memory — all secured with JWT + OTP authentication.',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Groq LLM API', 'JWT', 'OTP Auth'], // VERIFY
    github: '#',
    live: '#',
    featured: true,
    highlights: [
      'AI interview engine with 12 configurable rounds (behavioral, technical, system design, coding, ML) and multiple company personas.',
      'ATS resume analysis with PDF parsing and JD keyword matching.',
      'Persistent AI memory (SQLite-backed) across sessions.',
      'JWT + OTP auth with email verification and refresh tokens.',
    ],
    architecture: [
      { layer: 'Frontend', tech: 'React SPA', color: '#22d3ee' },
      { layer: 'API Layer', tech: 'FastAPI Service', color: '#8b5cf6' },
      { layer: 'Persistence', tech: 'PostgreSQL + SQLite', color: '#fbbf24' },
    ],
  },
  {
    id: 'arcade-flux',
    title: 'Arcade Flux',
    status: 'Completed',
    description:
      'Scalable web gaming platform with 50+ games, performance-optimized and fully responsive.',
    stack: ['React', 'JavaScript', 'CSS3'], // VERIFY
    github: '#',
    live: '#',
  },
  {
    id: 'deepfake-detection',
    title: 'DeepFake Detection System',
    status: 'Completed',
    description:
      'Computer vision + Librosa audio analysis + face forensics to detect and flag manipulated media.',
    stack: ['Python', 'TensorFlow', 'Librosa', 'Computer Vision', 'OpenCV'], // VERIFY
    github: '#',
    live: '#',
  },
  {
    id: 'self-driving-car',
    title: 'Self-Driving Car Simulation',
    status: 'Completed',
    description:
      'Neural-network-driven simulation with real-time decision visualization.',
    stack: ['JavaScript', 'Neural Networks', 'Canvas API'], // VERIFY
    github: '#',
    live: '#',
  },
  {
    id: 'tank-combat',
    title: 'Unity 3D Tank Combat Game',
    status: 'Completed',
    description:
      'Custom physics, controls, and gameplay mechanics built in Unity.',
    stack: ['Unity', 'C#', '3D Physics'], // VERIFY
    github: '#',
    live: '#',
  },
  {
    id: 'dart-website',
    title: 'DART Workshop Website',
    status: 'Completed',
    description:
      'Public workshop site with clean UI and responsive design for a drone and robotics event.',
    stack: ['React', 'Tailwind CSS', 'Responsive Design'], // VERIFY
    github: '#',
    live: '#',
  },
]

// ─── Contact ──────────────────────────────────────────────────────────────────

/** @type {ContactLink[]} */
export const contactLinks = [
  {
    id: 'email',
    label: 'ankursagar1234560@gmail.com',
    href: 'mailto:ankursagar1234560@gmail.com',
    icon: 'email',
  },
  {
    id: 'phone',
    label: '+91 99561 78926',
    href: 'tel:+919956178926',
    icon: 'phone',
  },
  {
    id: 'github',
    label: 'github.com/Ankur887',
    href: 'https://github.com/Ankur887',
    icon: 'github',
  },
  {
    id: 'linkedin',
    label: 'linkedin.com/in/Ankur',
    href: 'https://linkedin.com/in/Ankur',
    icon: 'linkedin',
  },
  {
    id: 'codolio',
    label: 'codolio.com/profile/Ankur5511',
    href: 'https://codolio.com/profile/Ankur5511',
    icon: 'codolio',
  },
]

export const email = 'ankursagar1234560@gmail.com'
