/**
 * @file components/Typewriter.jsx
 * Animated typewriter cycling through role strings.
 * Screen readers see the static full string via aria-label.
 * Reduced motion: renders the first string statically.
 *
 * @param {{ strings: string[] }} props
 */

import { useTypewriter } from '../hooks/useTypewriter'
import { useReducedMotion } from '../hooks/useReducedMotion'

export default function Typewriter({ strings }) {
  const reduced = useReducedMotion()
  const { display, isTyping } = useTypewriter(strings)

  // Screen readers get the static first string, not the animation
  return (
    <span
      className="typewriter"
      aria-label={strings[0]}
      aria-live="off"
    >
      <span aria-hidden="true">
        {display}
        {!reduced && (
          <span
            className={`typewriter-cursor ${isTyping ? 'blinking' : ''}`}
            aria-hidden="true"
          >|</span>
        )}
      </span>
    </span>
  )
}
