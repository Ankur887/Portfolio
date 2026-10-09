/**
 * @file components/ContactForm.jsx
 * Contact form with:
 * - Formspree integration when VITE_FORMSPREE_ID is set
 * - mailto: fallback otherwise
 * - Honeypot anti-spam field
 * - Validation + aria-live status messages
 *
 * @param {{ email: string }} props
 */

import { useState, useId } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID

export default function ContactForm({ email }) {
  const uid = useId()
  const [values, setValues] = useState({ name: '', email: '', message: '', _honey: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const validate = () => {
    const e = {}
    if (!values.name.trim())                           e.name    = 'Name is required.'
    if (!values.email.trim())                          e.email   = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Enter a valid email.'
    if (!values.message.trim() || values.message.length < 10)  e.message = 'Message must be at least 10 characters.'
    return e
  }

  const handleChange = (e) => {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Honeypot
    if (values._honey) return

    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('sending')

    if (FORMSPREE_ID) {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: values.name, email: values.email, message: values.message }),
        })
        if (res.ok) setStatus('success')
        else        setStatus('error')
      } catch {
        setStatus('error')
      }
    } else {
      // Mailto fallback
      const subject = encodeURIComponent(`Portfolio contact from ${values.name}`)
      const body    = encodeURIComponent(values.message)
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
      setStatus('success')
    }
  }

  const fieldClass = (name) =>
    `form-input ${errors[name] ? 'form-input--error' : ''}`

  if (status === 'success') {
    return (
      <motion.div
        className="form-success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        role="status"
        aria-live="polite"
      >
        <CheckCircle size={40} className="text-cyan-400 mb-3" />
        <p className="text-lg font-semibold text-text">Message sent!</p>
        <p className="text-muted mt-1">I'll get back to you as soon as possible.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="contact-form" aria-label="Contact form">
      {/* Honeypot — visually hidden */}
      <input
        type="text"
        name="_honey"
        value={values._honey}
        onChange={handleChange}
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

      {/* Status message */}
      {status === 'error' && (
        <div role="alert" aria-live="assertive" className="form-error-banner">
          <AlertCircle size={16} />
          <span>Something went wrong. Please try again or email directly.</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`${uid}-name`} className="form-label">Name</label>
          <input
            id={`${uid}-name`}
            type="text"
            name="name"
            autoComplete="name"
            className={fieldClass('name')}
            value={values.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          />
          {errors.name && <span id={`${uid}-name-err`} className="form-error" role="alert">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor={`${uid}-email`} className="form-label">Email</label>
          <input
            id={`${uid}-email`}
            type="email"
            name="email"
            autoComplete="email"
            className={fieldClass('email')}
            value={values.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
          />
          {errors.email && <span id={`${uid}-email-err`} className="form-error" role="alert">{errors.email}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`${uid}-message`} className="form-label">Message</label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          className={fieldClass('message')}
          value={values.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${uid}-message-err` : undefined}
        />
        {errors.message && <span id={`${uid}-message-err`} className="form-error" role="alert">{errors.message}</span>}
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={status === 'sending'}
        aria-busy={status === 'sending'}
      >
        {status === 'sending' ? (
          <><Loader size={16} className="animate-spin" /> Sending...</>
        ) : (
          <><Send size={16} /> Send Message</>
        )}
      </button>
    </form>
  )
}
