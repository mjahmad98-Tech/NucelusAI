'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LogoMark from './LogoMark'

interface Tier {
  id: string
  name: string
  model: string
  provider: 'anthropic' | 'google'
  cost: string
  coverage: number
  badge: string
  tagline: string
  description: string
  features: string[]
  keyPlaceholder: string
  getKeyUrl: string
  color: string
  limitations?: string[]
}

const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Explorer',
    model: 'Gemini 2.0 Flash',
    provider: 'google',
    cost: 'Free forever',
    coverage: 60,
    badge: 'Free',
    color: '#6B7A99',
    tagline: 'Dip your toes into biology AI',
    description: 'Great for students and curious minds. Ask questions, get clear explanations, and explore biological concepts in a conversational way — no jargon required.',
    features: [
      'Natural biology Q&A at any level',
      'Analogies and story-driven explanations',
      'Emotional, adaptive tone',
      'Basic concept exploration',
    ],
    keyPlaceholder: 'AIza...',
    getKeyUrl: 'https://aistudio.google.com/app/apikey',
    limitations: ['Hypothesis generation', 'Peer review', 'Figure analysis', 'Manuscript writing'],
  },
  {
    id: 'standard',
    name: 'Researcher',
    model: 'Claude Haiku',
    provider: 'anthropic',
    cost: '~$5 lasts weeks',
    coverage: 85,
    badge: 'Best value',
    tagline: 'Your daily lab thinking partner',
    description: 'For working scientists and grad students. Design experiments, generate testable hypotheses, and get expert-level biological reasoning — fast.',
    features: [
      'Testable hypothesis generation',
      'Experiment design with controls',
      'Lab calculations & Punnett squares',
      'RNA-seq & CRISPR guidance',
      'Adaptive work & chat modes',
    ],
    color: '#4D8FE8',
    keyPlaceholder: 'sk-ant-...',
    getKeyUrl: 'https://console.anthropic.com/',
    limitations: ['Full adversarial loop', 'Multi-reviewer simulation'],
  },
  {
    id: 'full',
    name: 'Full NucleusAI',
    model: 'Claude Sonnet',
    provider: 'anthropic',
    cost: '~$0.10–0.30/session',
    coverage: 100,
    badge: 'Full power',
    tagline: 'The complete autonomous research mind',
    description: 'Every reasoning capability unlocked — adversarial self-critique, manuscript peer review, figure dissection, 80+ database access, and a critic that challenges every conclusion before you see it.',
    features: [
      'Adversarial reasoning — agent debates itself',
      'Full manuscript writing & peer review',
      'Critical figure reading beyond the legend',
      '80+ scientific databases integrated',
      'All 12 research skills unlocked',
    ],
    color: '#D966D9',
    keyPlaceholder: 'sk-ant-...',
    getKeyUrl: 'https://console.anthropic.com/',
  },
]

const TIER_ACCENTS = {
  free:     { border: 'rgba(107,122,153,0.35)', glow: 'rgba(107,122,153,0.12)' },
  standard: { border: 'rgba(77,143,232,0.4)',   glow: 'rgba(77,143,232,0.12)' },
  full:     { border: 'rgba(217,102,217,0.4)',  glow: 'rgba(217,102,217,0.12)' },
}

interface ApiKeyGateProps {
  onConfirm: (apiKey: string, tier: string, model: string) => void
}

export default function ApiKeyGate({ onConfirm }: ApiKeyGateProps) {
  const [selectedTier, setSelectedTier] = useState<Tier>(TIERS[1])
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const accent = TIER_ACCENTS[selectedTier.id as keyof typeof TIER_ACCENTS]

  const handleStart = async () => {
    setError('')
    if (!apiKey.trim()) { setError('Please enter your API key to continue.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    localStorage.setItem('nucleus_api_key', apiKey.trim())
    localStorage.setItem('nucleus_tier', selectedTier.id)
    localStorage.setItem('nucleus_model', selectedTier.model)
    onConfirm(apiKey.trim(), selectedTier.id, selectedTier.model)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center px-6 pb-16 pt-4 min-h-full">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center text-center mb-10"
      >
        <motion.div
          className="mb-5"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <LogoMark size={72} animated />
        </motion.div>

        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.1,
            marginBottom: '0.6rem',
          }}
        >
          Meet <span className="gradient-text">NucleusAI</span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#B8C7E0', maxWidth: 480, lineHeight: 1.65, marginBottom: '0.75rem' }}>
          An autonomous biology research mind that{' '}
          <strong style={{ color: '#EE99EE', fontWeight: 600 }}>reasons, critiques, and adapts</strong>{' '}
          — from first-year questions to cutting-edge manuscript review.
        </p>

        <motion.p
          style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', color: '#7AB0F5' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity }}
        >
          ✦ THINK DEEPER · RESEARCH SMARTER · SCIENCE FASTER ✦
        </motion.p>
      </motion.div>

      {/* ── Tier Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: 820,
          marginBottom: '2rem',
        }}
      >
        {TIERS.map((tier, i) => {
          const isSelected = selectedTier.id === tier.id
          return (
            <motion.button
              key={tier.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 130, damping: 18 }}
              onClick={() => { setSelectedTier(tier); setApiKey('') }}
              style={{
                position: 'relative',
                borderRadius: 18,
                padding: '1.4rem',
                textAlign: 'left',
                background: isSelected
                  ? `linear-gradient(145deg, ${tier.color}18, ${tier.color}08, rgba(6,11,24,0.85))`
                  : 'rgba(10,16,32,0.7)',
                border: `1.5px solid ${isSelected ? tier.color + '55' : tier.color + '18'}`,
                backdropFilter: 'blur(20px)',
                boxShadow: isSelected
                  ? `0 0 0 1px ${tier.color}22, 0 8px 32px ${tier.color}18, inset 0 1px 0 ${tier.color}22`
                  : '0 2px 12px rgba(0,0,0,0.3)',
                transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
              }}
            >
              {/* Badge */}
              <span style={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '3px 9px',
                borderRadius: 20,
                background: tier.color + '22',
                color: tier.color,
                border: `1px solid ${tier.color}33`,
                textTransform: 'uppercase',
              }}>
                {tier.badge}
              </span>

              {/* Tier name */}
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 3, paddingRight: 60 }}>
                {tier.name}
              </p>

              {/* Model */}
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: tier.color, marginBottom: 8 }}>
                {tier.model}
              </p>

              {/* Tagline */}
              <p style={{ fontSize: '0.82rem', color: '#9BAAC4', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.45 }}>
                &ldquo;{tier.tagline}&rdquo;
              </p>

              {/* Coverage bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6B7A99', marginBottom: 5 }}>
                  <span>Reasoning power</span>
                  <span style={{ color: tier.color, fontWeight: 700 }}>{tier.coverage}%</span>
                </div>
                <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${tier.color}55, ${tier.color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${tier.coverage}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.8rem', color: '#9BAAC4', lineHeight: 1.6, marginBottom: 12 }}>
                {tier.description}
              </p>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: '0.8rem', color: '#C8D3E8' }}>
                    <span style={{ color: tier.color, fontSize: '0.6rem', marginTop: 4, flexShrink: 0 }}>◆</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Cost */}
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: tier.color, marginTop: 12 }}>
                {tier.cost}
              </p>
            </motion.button>
          )
        })}
      </div>

      {/* ── Key Input Panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ width: '100%', maxWidth: 460 }}
      >
        <div
          style={{
            borderRadius: 20,
            padding: '1.75rem',
            background: 'rgba(8,13,26,0.88)',
            backdropFilter: 'blur(24px)',
            border: `1.5px solid ${accent.border}`,
            boxShadow: `0 0 40px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
          }}
        >
          {/* Label row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E8EDF8' }}>
              {selectedTier.provider === 'google' ? 'Google AI Studio Key' : 'Anthropic API Key'}
            </label>
            <a
              href={selectedTier.getKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.78rem', color: selectedTier.color, fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Get free key →
            </a>
          </div>

          {/* Input */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder={selectedTier.keyPlaceholder}
              style={{
                width: '100%',
                borderRadius: 12,
                padding: '0.85rem 3.5rem 0.85rem 1rem',
                fontSize: '0.88rem',
                background: 'rgba(4,8,18,0.95)',
                border: `1.5px solid ${error ? '#f87171' : selectedTier.color + '33'}`,
                color: '#E8EDF8',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = selectedTier.color + '88')}
              onBlur={(e) => (e.currentTarget.style.borderColor = error ? '#f87171' : selectedTier.color + '33')}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: '0.72rem', fontWeight: 600, color: '#6B7A99',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
              }}
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: '0.78rem', color: '#f87171', marginBottom: 10 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Security note */}
          <p style={{ fontSize: '0.72rem', color: '#4A5568', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🔒</span>
            Stored in your browser only — never sent to any server
          </p>

          {/* CTA button */}
          <motion.button
            onClick={handleStart}
            disabled={loading}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: 12,
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#FFFFFF',
              background: `linear-gradient(135deg, ${selectedTier.color}DD, ${selectedTier.color}88)`,
              border: `1px solid ${selectedTier.color}55`,
              boxShadow: `0 4px 20px ${selectedTier.color}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              letterSpacing: '0.03em',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <motion.span
                  style={{
                    display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                />
                Launching NucleusAI...
              </span>
            ) : (
              `Enter as ${selectedTier.name} →`
            )}
          </motion.button>

          {/* Limitations */}
          <AnimatePresence>
            {selectedTier.limitations && selectedTier.limitations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  marginTop: 14, padding: '0.75rem 1rem', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ fontSize: '0.68rem', color: '#4A5568', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Unlocks with upgrade:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedTier.limitations.map((f) => (
                      <span key={f} style={{
                        fontSize: '0.7rem', padding: '3px 10px', borderRadius: 20,
                        background: 'rgba(255,255,255,0.04)', color: '#4A5568',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
