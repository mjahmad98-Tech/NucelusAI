'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import LogoMark from '@/components/ui/LogoMark'
import ApiKeyGate from '@/components/ui/ApiKeyGate'

const DNABackground = dynamic(() => import('@/components/ui/DNABackground'), { ssr: false })

type Stage = 'gate' | 'splash' | 'loading'

export default function Home() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('gate')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const existing = localStorage.getItem('nucleus_api_key')
    if (existing) {
      // Already has key — go straight to splash then chat
      setStage('splash')
      setTimeout(() => router.push('/chat'), 3000)
    }
    // else stay on gate (default)
  }, [router])

  const handleKeyConfirm = (_apiKey: string, _tier: string, _model: string) => {
    // After key entered → show DNA splash → then chat
    setStage('splash')
    setTimeout(() => router.push('/chat'), 3200)
  }

  if (!mounted) return null

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
      {/* DNA background always visible */}
      <DNABackground />

      {/* Scanline texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
        }}
      />

      {/* LUMS Banner — always on top */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center py-2.5 px-4"
        style={{
          background: 'rgba(4,8,18,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(46,111,204,0.15)',
        }}
      >
        <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">
          <span className="font-bold" style={{ color: '#7AB0F5' }}>Tariq Lab</span>
          <span className="mx-3 text-gray-700">·</span>
          Department of Life Sciences
          <span className="mx-3 text-gray-700">·</span>
          <span className="font-semibold" style={{ color: '#D966D9' }}>LUMS, Lahore</span>
        </p>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── STAGE 1: API KEY GATE ── */}
        {stage === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 overflow-y-auto pt-14"
          >
            <ApiKeyGate onConfirm={handleKeyConfirm} />
          </motion.div>
        )}

        {/* ── STAGE 2: DNA SPLASH ── */}
        {stage === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.2 }}
              className="mb-7"
            >
              <LogoMark size={110} animated />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="font-bold text-white mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.8rem, 5vw, 4rem)' }}
            >
              Nucleus<span className="gradient-text">AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray-300 text-center leading-relaxed"
              style={{ fontSize: '1.05rem', maxWidth: 440 }}
            >
              Your autonomous biology research partner.
              <br />
              <span className="text-gray-500" style={{ fontSize: '0.9rem' }}>
                Adversarial reasoning · 32 knowledge domains · 80+ databases
              </span>
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-10 w-56"
            >
              <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #4D8FE8, #D966D9)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.6, delay: 1.1, ease: 'easeInOut' }}
                />
              </div>
              <motion.p
                className="text-center mt-2 tracking-widest uppercase"
                style={{ fontSize: '0.65rem', color: '#4A5568' }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Activating knowledge graph
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* ── STAGE 3: LOADING ── */}
        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="mb-5"
            >
              <LogoMark size={64} animated={false} />
            </motion.div>
            <p style={{ color: 'var(--grey-300)', fontSize: '0.95rem' }}>
              Launching NucleusAI
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                ...
              </motion.span>
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
