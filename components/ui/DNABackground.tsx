'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Feature {
  id: string
  label: string
  emoji: string
  headline: string
  body: string
  angle: number
  radius: number
  color: string
}

const FEATURES: Feature[] = [
  {
    id: 'epistemic',
    label: 'Epistemic Tagging',
    emoji: '🎯',
    headline: 'Every claim is scored — nothing slips through unverified.',
    body: 'NucleusAI attaches a confidence score (0–100%) and evidence type to every statement it makes. You\'ll always know if something is backed by a primary paper, textbook knowledge, or is speculative. No more trusting AI blindly.',
    angle: 20,
    radius: 0.33,
    color: '#7AB0F5',
  },
  {
    id: 'adversarial',
    label: 'Adversarial Reasoning',
    emoji: '⚔️',
    headline: 'The agent argues with itself before answering you.',
    body: 'A built-in Critic agent challenges every hypothesis. A Fixer resolves the criticism. A Verifier checks the fix. This three-way debate runs silently behind every complex answer — so what you read has already survived internal cross-examination.',
    angle: 75,
    radius: 0.38,
    color: '#D966D9',
  },
  {
    id: 'hypothesis',
    label: 'Hypothesis Engine',
    emoji: '💡',
    headline: 'Not just answers — ranked, testable scientific ideas.',
    body: 'Ask NucleusAI to generate hypotheses and it returns Bayesian-ranked candidates, each with a testability score and a falsification prediction. It even tells you the single experiment that would disprove each one. Science, not guessing.',
    angle: 138,
    radius: 0.30,
    color: '#7AB0F5',
  },
  {
    id: 'emotional',
    label: 'Emotional Intelligence',
    emoji: '🧠',
    headline: 'It reads your mood and adapts in real time.',
    body: 'Frustrated with a concept? NucleusAI detects it and switches to simpler analogies. Curious and exploring? It opens up with richer stories. Working on a manuscript? It shifts to precise, citation-dense mode. One agent, infinite registers.',
    angle: 200,
    radius: 0.36,
    color: '#EE99EE',
  },
  {
    id: 'peerreview',
    label: 'Peer Review Simulation',
    emoji: '📋',
    headline: 'Get journal-quality critique before you submit.',
    body: 'NucleusAI simulates five distinct reviewer profiles — a methods expert, a statistician, a domain specialist, a clinical reviewer, and a writing critic. It generates structured major and minor concerns, then helps you respond to each one like a real author.',
    angle: 258,
    radius: 0.33,
    color: '#7AB0F5',
  },
  {
    id: 'databases',
    label: '80+ Live Databases',
    emoji: '🗄️',
    headline: 'The world\'s best biology databases, one conversation away.',
    body: 'GEO, PDB, UniProt, AlphaFold, OMIM, ENCODE, FlyBase, KEGG, Reactome, ClinVar, STRING, ENCORI, miRBase, and 70+ more. Ask for a protein structure, gene expression dataset, or disease variant — NucleusAI fetches and interprets it directly.',
    angle: 318,
    radius: 0.39,
    color: '#D966D9',
  },
  {
    id: 'nodes',
    label: '32 Knowledge Domains',
    emoji: '🌐',
    headline: 'From quantum biology to philosophy of science — nothing is out of scope.',
    body: 'NucleusAI holds 32 deeply interconnected knowledge nodes: molecular biology, cancer, immunology, biophysics, systems biology, evolution, neurobiology, chemistry, mathematics, and more. Every domain connects to every other — so cross-disciplinary insights emerge naturally.',
    angle: 48,
    radius: 0.43,
    color: '#EE99EE',
  },
  {
    id: 'figures',
    label: 'Figure Critical Reading',
    emoji: '🔬',
    headline: 'It sees what the legend doesn\'t say.',
    body: 'Upload a figure and NucleusAI goes far beyond the legend — detecting artefacts, checking statistical reporting, predicting examiner questions, finding similar published figures, and flagging what the authors are implying but not stating. Your figures will never look the same again.',
    angle: 285,
    radius: 0.43,
    color: '#7AB0F5',
  },
]

interface HoveredFeature extends Feature {
  screenX: number
  screenY: number
}

export default function DNABackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const tRef = useRef(0)
  const [hovered, setHovered] = useState<HoveredFeature | null>(null)
  const dotsRef = useRef<{ x: number; y: number; f: Feature }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', resize)

    // Floating particles
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.35 + 0.08,
      color: Math.random() > 0.5 ? '#4D8FE8' : '#C040C0',
    }))

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2
      const t = tRef.current

      // Grid
      ctx.strokeStyle = 'rgba(46,111,204,0.035)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 44) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 44) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      }

      // DNA double helix
      const helixH = Math.min(H * 0.7, 560)
      const helixW = 90
      const startY = cy - helixH / 2
      const steps = 140
      const turns = 3.2

      for (let i = 0; i <= steps; i++) {
        const prog = i / steps
        const y = startY + prog * helixH
        const a1 = prog * Math.PI * 2 * turns + t
        const a2 = a1 + Math.PI

        const x1 = cx + Math.cos(a1) * helixW
        const x2 = cx + Math.cos(a2) * helixW

        const al1 = 0.45 + 0.35 * Math.sin(a1)
        const al2 = 0.45 + 0.35 * Math.sin(a2)

        ctx.beginPath()
        ctx.arc(x1, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(77,143,232,${al1.toFixed(2)})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x2, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(217,102,217,${al2.toFixed(2)})`
        ctx.fill()

        if (i % 7 === 0) {
          const grad = ctx.createLinearGradient(x1, y, x2, y)
          grad.addColorStop(0, `rgba(77,143,232,${(al1 * 0.45).toFixed(2)})`)
          grad.addColorStop(1, `rgba(217,102,217,${(al2 * 0.45).toFixed(2)})`)
          ctx.beginPath()
          ctx.moveTo(x1, y); ctx.lineTo(x2, y)
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      // Nucleosome glow
      const nsG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 65)
      nsG.addColorStop(0, 'rgba(77,143,232,0.42)')
      nsG.addColorStop(0.45, 'rgba(192,64,192,0.18)')
      nsG.addColorStop(1, 'rgba(6,11,24,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, 65, 0, Math.PI * 2)
      ctx.fillStyle = nsG
      ctx.fill()

      for (let ring = 0; ring < 4; ring++) {
        const r = 70 + ring * 22 + Math.sin(t * 1.8 + ring) * 4
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(77,143,232,${(0.09 - ring * 0.018).toFixed(3)})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Feature threads + nodes
      const newDots: { x: number; y: number; f: Feature }[] = []
      const dim = Math.min(W, H)

      for (const f of FEATURES) {
        const rad = (f.angle + t * 4) * (Math.PI / 180)
        const dist = dim * f.radius
        const fx = cx + Math.cos(rad) * dist
        const fy = cy + Math.sin(rad) * dist

        // Thread
        const grad = ctx.createLinearGradient(cx, cy, fx, fy)
        grad.addColorStop(0, 'rgba(77,143,232,0.0)')
        grad.addColorStop(0.55, f.color + '55')
        grad.addColorStop(1, f.color + 'CC')
        ctx.beginPath()
        ctx.moveTo(cx, cy); ctx.lineTo(fx, fy)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Node pulse
        const pulse = 0.65 + 0.35 * Math.sin(t * 2.2 + f.angle * 0.05)
        const nr = 7 + pulse * 2

        // Outer ring
        ctx.beginPath()
        ctx.arc(fx, fy, nr + 5, 0, Math.PI * 2)
        ctx.strokeStyle = f.color + Math.round(pulse * 80).toString(16).padStart(2, '0')
        ctx.lineWidth = 1
        ctx.stroke()

        // Node fill
        ctx.beginPath()
        ctx.arc(fx, fy, nr, 0, Math.PI * 2)
        ctx.fillStyle = f.color + Math.round(pulse * 220).toString(16).padStart(2, '0')
        ctx.fill()

        // Label — larger and clearer
        ctx.font = '700 13px Inter, system-ui, sans-serif'
        const textX = fx < cx ? fx - nr - 10 : fx + nr + 10
        ctx.textAlign = fx < cx ? 'right' : 'left'
        // Shadow for legibility
        ctx.shadowColor = 'rgba(0,0,0,0.9)'
        ctx.shadowBlur = 6
        ctx.fillStyle = '#FFFFFF'
        ctx.fillText(f.label, textX, fy - 2)
        ctx.shadowBlur = 0
        // Sub-label (emoji)
        ctx.font = '11px Inter, system-ui, sans-serif'
        ctx.fillStyle = f.color + 'DD'
        ctx.fillText(f.emoji + ' hover to learn', textX, fy + 13)
        ctx.textAlign = 'left'

        newDots.push({ x: fx, y: fy, f })
      }

      dotsRef.current = newDots
      tRef.current += 0.003
      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const hit = dotsRef.current.find((d) => {
      const dx = d.x - clientX
      const dy = d.y - clientY
      return Math.sqrt(dx * dx + dy * dy) < 28
    })
    if (hit) {
      setHovered({ ...hit.f, screenX: clientX, screenY: clientY })
    } else {
      setHovered(null)
    }
  }, [])

  return (
    <div className="absolute inset-0" onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)}>
      <canvas ref={canvasRef} className="absolute inset-0" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered.id}
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(hovered.screenX + 18, window.innerWidth - 300),
              top: Math.max(hovered.screenY - 60, 60),
              width: 280,
            }}
          >
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(6,11,24,0.96)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${hovered.color}55`,
                boxShadow: `0 0 32px ${hovered.color}25, 0 8px 32px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{hovered.emoji}</span>
                <p className="font-bold text-white text-sm" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {hovered.label}
                </p>
              </div>

              {/* Headline */}
              <p className="text-sm font-semibold mb-2 leading-snug" style={{ color: hovered.color }}>
                {hovered.headline}
              </p>

              {/* Body */}
              <p className="text-xs text-gray-300 leading-relaxed">
                {hovered.body}
              </p>

              {/* Bottom accent line */}
              <div
                className="mt-3 h-0.5 rounded-full"
                style={{ background: `linear-gradient(90deg, ${hovered.color}88, transparent)` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
