/**
 * @file components/SafeLink.jsx
 * Renders a disabled link when href === "#".
 * Disabled links get: aria-disabled, title "Link coming soon", no navigation.
 *
 * @param {{ href: string, children: React.ReactNode, className?: string, download?: boolean }} props
 */

import { forwardRef } from 'react'

const SafeLink = forwardRef(function SafeLink(
  { href, children, className = '', download, ...rest },
  ref
) {
  const isPlaceholder = !href || href === '#'

  if (isPlaceholder) {
    return (
      <span
        ref={ref}
        role="link"
        aria-disabled="true"
        title="Link coming soon"
        className={`opacity-50 cursor-not-allowed select-none ${className}`}
        tabIndex={0}
        onKeyDown={(e) => e.preventDefault()}
        {...rest}
      >
        {children}
      </span>
    )
  }

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      download={download}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {children}
    </a>
  )
})

export default SafeLink
