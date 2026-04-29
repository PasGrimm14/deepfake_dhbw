import { motion } from 'framer-motion'

export default function InfoCard({ icon: Icon, title, description, accent = false, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`card flex flex-col gap-4 ${className}`}
    >
      {Icon && (
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
            accent ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'
          }`}
        >
          <Icon size={20} />
        </div>
      )}
      <div>
        <h3 className="font-semibold text-gray-900 mb-1.5 text-base">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        )}
      </div>
    </motion.div>
  )
}
