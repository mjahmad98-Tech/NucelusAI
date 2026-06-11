'use client'

import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-start gap-3 max-w-2xl mx-auto w-full px-4"
    >
      {/* Avatar */}
      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: 'linear-gradient(135deg, rgba(46,111,204,0.3), rgba(192,64,192,0.3))',
          border: '1px solid rgba(46,111,204,0.3)',
          color: '#7AB0F5',
        }}
      >
        N
      </div>

      {/* Bubble */}
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{
          background: 'rgba(15,24,41,0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(46,111,204,0.15)',
        }}
      >
        <div className="flex items-center gap-1.5 h-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: i % 2 === 0 ? '#4D8FE8' : '#D966D9' }}
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">NucleusAI is thinking...</span>
        </div>
      </div>
    </motion.div>
  )
}
