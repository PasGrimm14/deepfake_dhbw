const config = {
  LOW: {
    label: 'LOW',
    className: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  MEDIUM: {
    label: 'MEDIUM',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-500',
  },
  HIGH: {
    label: 'HIGH',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
  },
  CRITICAL: {
    label: 'CRITICAL',
    className: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-600',
  },
}

export default function RiskBadge({ level = 'LOW', size = 'sm' }) {
  const cfg = config[level] ?? config.LOW
  const textSize = size === 'lg' ? 'text-sm px-3 py-1.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border uppercase tracking-wider ${cfg.className} ${textSize}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
