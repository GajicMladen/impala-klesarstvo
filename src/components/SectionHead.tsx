import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function SectionHead({
  eyebrow,
  title,
  text,
  action,
  align = 'left',
}: {
  eyebrow: string
  title: string
  text?: string
  action?: ReactNode
  align?: 'left' | 'center'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${align === 'center' ? 'text-center md:flex-col md:items-center' : ''}`}
    >
      <div className={align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        <div className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-accent">
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
        </div>
        <h2 className="text-3xl font-light leading-[1.05] tracking-tight md:text-5xl">{title}</h2>
        {text && <p className="mt-5 text-base leading-relaxed text-mist md:text-lg">{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  )
}
