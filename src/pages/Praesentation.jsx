import { motion } from 'framer-motion'
import { Presentation } from 'lucide-react'
import PageHero from '../components/PageHero'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

export default function Praesentation() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

      <PageHero
        badge="DHBW - Deepfake Awareness"
        title="Präsentation"
        subtitle="Die folgende Präsentation gibt einen strukturierten Überblick über das Thema Deepfakes – von den technischen Grundlagen bis hin zu Schutzmaßnahmen."
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                <Presentation size={18} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Folien</h2>
            </div>

            <div
              className="rounded-2xl overflow-hidden border border-gray-200 shadow-md"
              style={{ position: 'relative', width: '100%', height: 0, paddingTop: '56.25%' }}
            >
              <iframe
                loading="lazy"
                src="https://www.canva.com/design/DAHJbqxz858/5d6BrdBgOs5d9_85W8zxWw/view?embed"
                title="Deepfake Awareness – Präsentation"
                allowFullScreen
                allow="fullscreen"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>

            <p className="mt-3 text-xs text-gray-400 text-right">
              Präsentation erstellt mit{' '}
              <a
                href="https://www.canva.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600 transition-colors"
              >
                Canva
              </a>
            </p>
          </motion.div>
        </div>
      </section>

    </motion.div>
  )
}