import { useId } from 'react'
import type { SimpleIcon } from 'simple-icons'

export function BrandIcon({ icon, size = 48, color }: { icon: SimpleIcon; size?: number; color?: string }) {
  const gradientId = useId()
  const gradient = icon.slug === 'instagram' && !color
  const hex = icon.hex === '000000' || icon.hex === '313131' ? 'ffffff' : icon.hex
  return (
    <svg
      role="img"
      aria-label={icon.title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={gradient ? `url(#${gradientId})` : color ?? `#${hex}`}
    >
      {gradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#833AB4" />
            <stop offset="35%" stopColor="#C13584" />
            <stop offset="60%" stopColor="#E1306C" />
            <stop offset="82%" stopColor="#F77737" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
        </defs>
      )}
      <path d={icon.path} />
    </svg>
  )
}
