/**
 * @file components/Modal.jsx
 * Accessible modal with focus trap, Esc-to-close, aria-modal,
 * and focus return to trigger element on close.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   title: string,
 *   triggerRef: React.RefObject<HTMLElement>,
 *   children: React.ReactNode
 * }} props
 */

import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, title, triggerRef, children }) {
  const dialogRef = useRef()

  // Focus first focusable element when opened
  useEffect(() => {
    if (open && dialogRef.current) {
      const first = dialogRef.current.querySelector(FOCUSABLE)
      first?.focus()
    }
  }, [open])

  // Return focus to trigger on close
  useEffect(() => {
    if (!open) {
      triggerRef?.current?.focus()
    }
  }, [open, triggerRef])

  // Esc key closes
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { onClose(); return }

    // Focus trap
    if (e.key === 'Tab' && dialogRef.current) {
      const focusable = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
      if (!focusable.length) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="modal-dialog"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.93, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">{title}</h2>
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
