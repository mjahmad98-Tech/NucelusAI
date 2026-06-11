'use client'

import { motion } from 'framer-motion'

interface LogoMarkProps {
  size?: number
  animated?: boolean
}

export default function LogoMark({ size = 80, animated = true }: LogoMarkProps) {
  const s = size
  const cx = s / 2
  const cy = s / 2

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Core nucleus gradient */}
        <radialGradient id={`ng-${s}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#7AB0F5" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#4D8FE8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C040C0" stopOpacity="0.3" />
        </radialGradient>

        {/* Outer glow */}
        <radialGradient id={`og-${s}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4D8FE8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4D8FE8" stopOpacity="0" />
        </radialGradient>

        {/* Chromosome arm gradient */}
        <linearGradient id={`ag1-${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7AB0F5" />
          <stop offset="100%" stopColor="#4D8FE8" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`ag2-${s}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D966D9" />
          <stop offset="100%" stopColor="#C040C0" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`ag3-${s}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7AB0F5" />
          <stop offset="100%" stopColor="#4D8FE8" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`ag4-${s}`} x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#D966D9" />
          <stop offset="100%" stopColor="#C040C0" stopOpacity="0.4" />
        </linearGradient>

        <filter id={`gf-${s}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`glow-lg-${s}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ambient glow */}
      <motion.circle
        cx={50} cy={50} r={42}
        fill={`url(#og-${s})`}
        animate={animated ? { r: [38, 46, 38], opacity: [0.6, 1, 0.6] } : undefined}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Chromosome arms - 4 radiating rods */}
      {/* Top-right */}
      <motion.path
        d="M 50 50 L 76 24"
        stroke={`url(#ag1-${s})`}
        strokeWidth="5"
        strokeLinecap="round"
        filter={`url(#gf-${s})`}
        animate={animated ? { opacity: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />
      {/* Arm cap bead top-right */}
      <motion.circle cx={76} cy={24} r={4}
        fill="#7AB0F5"
        filter={`url(#gf-${s})`}
        animate={animated ? { r: [3.5, 5, 3.5] } : undefined}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />

      {/* Bottom-left */}
      <motion.path
        d="M 50 50 L 24 76"
        stroke={`url(#ag3-${s})`}
        strokeWidth="5"
        strokeLinecap="round"
        filter={`url(#gf-${s})`}
        animate={animated ? { opacity: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle cx={24} cy={76} r={4}
        fill="#7AB0F5"
        filter={`url(#gf-${s})`}
        animate={animated ? { r: [3.5, 5, 3.5] } : undefined}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />

      {/* Top-left */}
      <motion.path
        d="M 50 50 L 24 24"
        stroke={`url(#ag2-${s})`}
        strokeWidth="5"
        strokeLinecap="round"
        filter={`url(#gf-${s})`}
        animate={animated ? { opacity: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 2, repeat: Infinity, delay: 0.25 }}
      />
      <motion.circle cx={24} cy={24} r={4}
        fill="#D966D9"
        filter={`url(#gf-${s})`}
        animate={animated ? { r: [3.5, 5, 3.5] } : undefined}
        transition={{ duration: 2, repeat: Infinity, delay: 0.25 }}
      />

      {/* Bottom-right */}
      <motion.path
        d="M 50 50 L 76 76"
        stroke={`url(#ag4-${s})`}
        strokeWidth="5"
        strokeLinecap="round"
        filter={`url(#gf-${s})`}
        animate={animated ? { opacity: [0.7, 1, 0.7] } : undefined}
        transition={{ duration: 2, repeat: Infinity, delay: 0.75 }}
      />
      <motion.circle cx={76} cy={76} r={4}
        fill="#D966D9"
        filter={`url(#gf-${s})`}
        animate={animated ? { r: [3.5, 5, 3.5] } : undefined}
        transition={{ duration: 2, repeat: Infinity, delay: 0.75 }}
      />

      {/* DNA base-pair dots along top-right arm */}
      {[0.35, 0.6, 0.82].map((t, i) => (
        <motion.circle
          key={i}
          cx={50 + 26 * t}
          cy={50 - 26 * t}
          r={2.5}
          fill="#EE99EE"
          filter={`url(#gf-${s})`}
          animate={animated ? { opacity: [0.3, 1, 0.3], r: [2, 3, 2] } : undefined}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}

      {/* Orbital ring */}
      <motion.circle
        cx={50} cy={50} r={26}
        stroke="#4D8FE8"
        strokeWidth={1}
        strokeOpacity={0.35}
        fill="none"
        strokeDasharray="4 3"
        animate={animated ? { rotate: 360 } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 50px' }}
      />

      {/* Nucleus core */}
      <motion.circle
        cx={50} cy={50} r={20}
        fill={`url(#ng-${s})`}
        filter={`url(#glow-lg-${s})`}
        animate={animated ? { r: [19, 21.5, 19] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner ring — crisp */}
      <circle cx={50} cy={50} r={13}
        stroke="white"
        strokeWidth={0.8}
        strokeOpacity={0.25}
        fill="none"
      />

      {/* Centre dot — bright white */}
      <motion.circle
        cx={50} cy={50} r={4.5}
        fill="white"
        animate={animated ? { r: [4, 5.5, 4], opacity: [0.85, 1, 0.85] } : undefined}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}
