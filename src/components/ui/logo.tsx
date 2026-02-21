'use client'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export default function Logo({ className = '', width = 40, height = 40 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="#1E293B" />
      <path
        d="M10 30V14L20 8L30 14V30"
        stroke="#D9F99D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14H30"
        stroke="#D9F99D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M15 30V20"
        stroke="#D9F99D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <path
        d="M25 30V20"
        stroke="#D9F99D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <rect
        x="17"
        y="22"
        width="6"
        height="8"
        rx="1"
        stroke="#D9F99D"
        strokeWidth="1.5"
      />
    </svg>
  )
}
