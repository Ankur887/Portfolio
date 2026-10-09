/**
 * @file components/GlassCard.jsx
 * Translucent dark glass panel with 1px white border at 10% opacity.
 * Falls back to an opaque dark panel when backdrop-filter is unsupported.
 *
 * @param {{ children: React.ReactNode, className?: string }} props
 */

export default function GlassCard({ children, className = '', ...rest }) {
  return (
    <div
      className={`glass-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
