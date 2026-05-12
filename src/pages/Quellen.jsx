import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Copy, Check, ExternalLink,
  Filter, Search, Loader2, AlertTriangle, RefreshCw
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { useNotion } from '../hooks/useNotion'
import { formatAPA7, getCategories } from '../data/quellenUtils'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

const TYPE_LABELS = {
  journal: 'Fachzeitschrift',
  book:    'Buch',
  website: 'Website',
  news:    'Nachrichtenartikel',
  report:  'Bericht / Report',
}

const TYPE_COLORS = {
  journal: 'bg-blue-50 text-blue-700 border-blue-200',
  book:    'bg-purple-50 text-purple-700 border-purple-200',
  website: 'bg-green-50 text-green-700 border-green-200',
  news:    'bg-orange-50 text-orange-700 border-orange-200',
  report:  'bg-gray-100 text-gray-700 border-gray-300',
}

function RenderAPA({ text }) {
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <em key={i} className="not-italic font-semibold text-gray-800">{part}</em>
          : part
      )}
    </span>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard?.writeText(text.replace(/\*/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      title="APA-Zitat kopieren"
      className="flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  )
}

function QuelleCard({ q }) {
  const apa = formatAPA7(q)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${TYPE_COLORS[q.type] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {TYPE_LABELS[q.type] ?? q.type}
          </span>
          <span className="text-xs text-gray-400">{q.category}</span>
          {q.note && <span className="text-xs text-gray-400 italic">({q.note})</span>}
        </div>
        <CopyButton text={apa} />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mt-1">
        <RenderAPA text={apa} />
      </p>
      {q.url && (
        <a
          href={q.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Quelle öffnen <ExternalLink size={11} />
        </a>
      )}
    </motion.div>
  )
}

function SkeletonCards() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-28 bg-gray-200 rounded-full" />
            <div className="h-5 w-20 bg-gray-100 rounded-full" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 rounded w-4/5 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-3/5" />
        </div>
      ))}
    </div>
  )
}

export default function Quellen() {
  const { quellen, loading, error } = useNotion()
  const categories = useMemo(() => getCategories(quellen), [quellen])
  const [activeCategory, setActiveCategory] = useState('Alle')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = quellen
    if (activeCategory !== 'Alle') list = list.filter((q) => q.category === activeCategory)
    if (search.trim()) {
      const s = search.toLowerCase()
      list = list.filter(
        (q) =>
          q.title?.toLowerCase().includes(s) ||
          q.authors?.some((a) => a.toLowerCase().includes(s)) ||
          q.journal?.toLowerCase().includes(s) ||
          q.outlet?.toLowerCase().includes(s)
      )
    }
    return list
  }, [quellen, activeCategory, search])

  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach((q) => {
      if (!map[q.category]) map[q.category] = []
      map[q.category].push(q)
    })
    return map
  }, [filtered])

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHero
        badge="Wissenschaftliche Grundlage"
        title="Quellenverzeichnis"
        subtitle={
          loading ? 'Quellen werden geladen…'
          : error  ? 'Fehler beim Laden der Quellen.'
          : `${quellen.length} Quellen nach APA\u00a07 — gepflegt in Notion.`
        }
      />

      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Fehlerstate */}
          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800 mb-1">Notion konnte nicht erreicht werden</p>
                <p className="text-xs text-red-600 font-mono mb-2">{error}</p>
                <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                  <li><code className="bg-red-100 px-1 rounded">VITE_NOTION_TOKEN</code> und <code className="bg-red-100 px-1 rounded">VITE_NOTION_DATABASE_ID</code> in <code className="bg-red-100 px-1 rounded">.env</code> vorhanden?</li>
                  <li>Ist die Integration in Notion mit der Datenbank verbunden? (··· → Connections)</li>
                  <li>Wurde <code className="bg-red-100 px-1 rounded">npm run dev</code> nach Änderung der .env neu gestartet?</li>
                </ul>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-900"
                >
                  <RefreshCw size={12} /> Seite neu laden
                </button>
              </div>
            </div>
          )}

          {/* Suche */}
          <div className="relative mb-6">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Autor, Titel oder Zeitschrift suchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:opacity-50"
            />
          </div>

          {/* Kategoriefilter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('Alle')}
              disabled={loading}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors disabled:opacity-40 ${
                activeCategory === 'Alle'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              <Filter size={11} className="inline mr-1" />
              Alle {!loading && `(${quellen.length})`}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                disabled={loading}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors disabled:opacity-40 ${
                  activeCategory === cat
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat} ({quellen.filter((q) => q.category === cat).length})
              </button>
            ))}
          </div>

          {/* Ladestate */}
          {loading && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <Loader2 size={15} className="animate-spin" />
                Quellen werden aus Notion geladen…
              </div>
              <SkeletonCards />
            </div>
          )}

          {/* Keine Ergebnisse */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Keine Quellen gefunden.</p>
            </div>
          )}

          {/* Ergebnisliste */}
          {!loading && (
            <AnimatePresence>
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="mb-10">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-red-500 rounded" />
                    {cat}
                    <span className="text-gray-300">({items.length})</span>
                  </h2>
                  <div className="space-y-3">
                    {items.map((q) => <QuelleCard key={q.id} q={q} />)}
                  </div>
                </div>
              ))}
            </AnimatePresence>
          )}

          {/* Hinweis */}
          {!loading && !error && quellen.length > 0 && (
            <div className="mt-10 p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong className="text-blue-800">Hinweis:</strong> Alle Zitate folgen dem{' '}
                <strong>APA Publication Manual, 7. Auflage</strong>. Klicke auf{' '}
                <Copy size={11} className="inline" /> um eine Zitierung als Klartext zu kopieren.
                Neue Quellen können direkt in Notion eingetragen werden.
              </p>
            </div>
          )}

        </div>
      </section>
    </motion.div>
  )
}